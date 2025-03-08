// This is a Web Worker file that handles Stockfish analysis
// It runs in a separate thread to avoid blocking the UI

// Import Chess.js library
importScripts('https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js');

// We'll dynamically import the correct version based on feature detection
let stockfishEngine = null;
let isAnalyzing = false;
let isPaused = false;
let currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
let lastUpdateTime = 0;
let isProcessingCommand = false; // Flag to prevent race conditions
let currentSettings = {
  depth: 20,
  multiPV: 5,
  threads: 2,
  isInfinite: false
};
const UPDATE_THROTTLE_MS = 100; // Throttle updates to 10 per second max

// Add a buffer to collect lines for each depth
let lineBuffer = {};

// Set debug mode to false to disable debug logging
const DEBUG = false;

// Add debug logging utility
const debugLog = (prefix, data) => {
  // Always log for debugging
  console.log(`[DEBUG][IMPORTANT][${prefix}]`, data);
};

// Add utility to format evaluation score
const formatEvaluation = (type, value) => {
  if (type === 'cp') {
    const score = parseInt(value) / 100;
    return {
      score,
      text: (score >= 0 ? '+' : '') + score.toFixed(2)
    };
  } else {
    // Handle mate scores
    const mateValue = parseInt(value);
    const score = mateValue > 0 ? 1000 - mateValue : -1000 - mateValue;
    return {
      score,
      text: `Mate in ${Math.abs(mateValue)}`
    };
  }
};

// Convert UCI moves to SAN notation using Chess.js
const convertMovesToSan = (uciMoves, fen) => {
  if (!uciMoves || uciMoves.length === 0) return [];

  // Create a new chess instance with the current position
  const chess = new Chess(fen);

  // Convert each UCI move to SAN
  const sanMoves = uciMoves.map(uciMove => {
    if (!uciMove || uciMove.length < 4) return uciMove;

    try {
      // Extract from and to squares
      const from = uciMove.slice(0, 2);
      const to = uciMove.slice(2, 4);
      const promotion = uciMove.length > 4 ? uciMove[4] : undefined;

      // Create move object
      const moveObj = {
        from: from,
        to: to,
        promotion: promotion
      };

      // Make the move and get SAN notation
      const move = chess.move(moveObj);

      // If move is valid, return SAN notation
      if (move) {
        return move.san;
      }

      return uciMove; // Fallback to UCI if move is invalid
    } catch (error) {
      debugLog('Error converting UCI to SAN', { uciMove, error });
      return uciMove; // Return original UCI move if conversion fails
    }
  });

  return sanMoves;
};

// Parse evaluation score from Stockfish output
const parseEvaluation = (line) => {
  debugLog('Raw Line', line);

  const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
  debugLog('Score Match', scoreMatch);

  if (!scoreMatch) return null;

  const [_, type, value] = scoreMatch;
  return formatEvaluation(type, value);
};

// Parse best line from Stockfish output
const parseBestLine = (line) => {
  debugLog('Raw Line', line);

  // Check for the multipv value in the line
  const multipvMatch = line.match(/multipv (\d+)/);
  const multipv = multipvMatch ? parseInt(multipvMatch[1]) : 1;

  // Extract all relevant info using a single regex
  const infoMatch = line.match(/info (?:.*?)depth (\d+)(?: .*?)(?:multipv (\d+))?(?: .*?)score (cp|mate) (-?\d+)(?: .*?)nodes (\d+)(?: .*?)time (\d+)(?: .*?)pv (.*?)(?:\s*$|\s+(?:bmc|string|refutation))/);

  if (!infoMatch) {
    debugLog('No match for info line', line);
    return null;
  }

  const [_, depth, multipvStr, scoreType, scoreValue, nodes, time, pvMoves] = infoMatch;
  debugLog('Parsed Info', { depth, multipvStr, scoreType, scoreValue, nodes, time, pvMoves });

  // Get evaluation
  const scoreInfo = formatEvaluation(scoreType, scoreValue);

  // Clean and split the moves
  const uciMoves = pvMoves.trim().split(/\s+/);
  debugLog('UCI Moves', uciMoves);

  // Convert to SAN
  const sanMoves = convertMovesToSan(uciMoves, currentFen);
  debugLog('SAN Moves', sanMoves);

  return {
    move: sanMoves[0] || uciMoves[0] || '',
    evaluation: scoreInfo?.score || 0,
    evaluationText: scoreInfo?.text || '0.00',
    sequence: sanMoves.length > 0 ? sanMoves : uciMoves,
    depth: parseInt(depth),
    multipv: multipv,
    nodes,
    time
  };
};

// Check if SharedArrayBuffer is available
const isSharedArrayBufferAvailable = typeof SharedArrayBuffer !== 'undefined';
console.log('SharedArrayBuffer available:', isSharedArrayBufferAvailable);

// Track if worker is terminated
let isTerminated = false;

// Add variables to track CPU usage
let cpuUsageStartTime = 0;
let cpuUsageCounter = 0;
let cpuUsagePercentage = 0;
let cpuUsageIntervalId = null;

// Function to measure CPU usage
const measureCpuUsage = () => {
  // Start a new measurement cycle
  cpuUsageStartTime = Date.now();
  cpuUsageCounter = 0;

  // Run a CPU-intensive task for a short period
  const endTime = cpuUsageStartTime + 50; // 50ms measurement window

  while (Date.now() < endTime) {
    // Simple increment operation to measure CPU throughput
    cpuUsageCounter++;
  }

  // Calculate operations per millisecond as a proxy for CPU usage
  const elapsedTime = Date.now() - cpuUsageStartTime;
  const opsPerMs = cpuUsageCounter / elapsedTime;

  // Normalize to a percentage (this is an approximation)
  // We'll use a baseline of 1,000,000 ops/ms as "100% usage"
  // This is arbitrary and should be calibrated for your specific use case
  const baselineOpsPerMs = 1000000;
  cpuUsagePercentage = Math.min(100, (opsPerMs / baselineOpsPerMs) * 100);

  // Send the CPU usage to the main thread
  self.postMessage({
    type: 'cpu_usage',
    data: {
      percentage: Math.round(cpuUsagePercentage),
      opsPerMs: opsPerMs
    }
  });
};

// Start measuring CPU usage periodically
const startCpuUsageMeasurement = () => {
  if (cpuUsageIntervalId) return; // Already running

  // Measure CPU usage every 2 seconds
  cpuUsageIntervalId = setInterval(measureCpuUsage, 2000);

  // Run an initial measurement
  measureCpuUsage();
};

// Stop measuring CPU usage
const stopCpuUsageMeasurement = () => {
  if (cpuUsageIntervalId) {
    clearInterval(cpuUsageIntervalId);
    cpuUsageIntervalId = null;
  }
};

// Define the message handler function
const handleEngineMessage = (event) => {
  const message = event.data;

  // Process the message based on your existing logic
  if (message === 'readyok') {
    console.log('Received readyok from Stockfish engine, sending ready message to main thread');
    self.postMessage({ type: 'ready' });
    return;
  }

  // Handle bestmove messages
  if (typeof message === 'string' && message.startsWith('bestmove')) {
    if (!currentSettings.isInfinite) {
      isAnalyzing = false;
      self.postMessage({ type: 'complete' });
    }
    return;
  }

  // Process info messages
  if (typeof message === 'string' && message.startsWith('info depth') && message.includes('score') && message.includes('pv')) {
    const bestLine = parseBestLine(message);
    if (bestLine) {
      self.postMessage({
        type: 'analysis',
        data: { line: bestLine }
      });
    }
  }
};

// Initialize Stockfish
const initStockfish = async () => {
  if (isTerminated) {
    console.warn('Worker is terminated, skipping initialization');
    return null;
  }

  try {
    console.log('Starting Stockfish engine initialization');

    // Use a simple path for the worker
    const basePath = '/wasm';
    const fileName = isSharedArrayBufferAvailable ? 'stockfish-nnue-16.js' : 'stockfish-nnue-16-single.js';
    const workerPath = `${basePath}/${fileName}`;

    console.log('Loading Stockfish worker from:', workerPath);
    console.log('Multi-threading supported:', isSharedArrayBufferAvailable);

    // Create a simple worker without module type
    const engine = new Worker(workerPath);

    // Set up message handling
    engine.onmessage = handleEngineMessage;

    // Set up error handling
    engine.onerror = (error) => {
      console.error('Stockfish worker error:', error);
      self.postMessage({
        type: 'error',
        data: { message: `Worker error: ${error.message || 'Unknown error'}` }
      });
    };

    // Initialize the engine with UCI commands
    engine.postMessage('uci');
    engine.postMessage('setoption name Use NNUE value true');
    engine.postMessage(`setoption name Threads value ${currentSettings.threads}`);
    engine.postMessage(`setoption name MultiPV value ${currentSettings.multiPV}`);
    engine.postMessage('setoption name UCI_AnalyseMode value true');
    engine.postMessage('isready');

    console.log('Sent initialization commands to engine');

    return engine;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error initializing Stockfish:', errorMessage);
    self.postMessage({
      type: 'error',
      data: { message: `Initialization error: ${errorMessage}` }
    });
    return null;
  }
};

// Helper function to restart analysis in infinite mode
const restartInfiniteAnalysis = () => {
  console.log('Restarting infinite analysis');
  if (stockfishEngine && isAnalyzing && !isPaused) {
    // Set position and restart analysis
    stockfishEngine.postMessage(`position fen ${currentFen}`);
    stockfishEngine.postMessage('go infinite');
    return true;
  }
  return false;
};

// Initialize engine on worker start
console.log('Starting Stockfish engine initialization');
initStockfish()
  .then(engine => {
    stockfishEngine = engine;
    console.log('Stockfish engine initialized successfully');
  })
  .catch(error => {
    console.error('Failed to initialize Stockfish engine:', error);
    self.postMessage({
      type: 'error',
      data: { message: 'Failed to initialize Stockfish engine' }
    });
  });

// Modify the verifyThreadUsage function to include CPU usage
const verifyThreadUsage = () => {
  if (!stockfishEngine || !isAnalyzing) return;

  // Log the requested thread count
  console.log(`Verifying thread usage. Requested threads: ${currentSettings.threads}`);

  // For the single-threaded version, we always use 1 thread
  const actualThreads = isSharedArrayBufferAvailable ? currentSettings.threads : 1;
  const unsupportedReason = isSharedArrayBufferAvailable
    ? undefined
    : "SharedArrayBuffer not available. Using single-threaded engine.";

  // Send thread info to the frontend
  self.postMessage({
    type: 'thread_info',
    data: {
      threadInfo: {
        requestedThreads: currentSettings.threads,
        actualThreads: actualThreads,
        cpuUsage: Math.round(cpuUsagePercentage), // Add CPU usage percentage
        multiThreadingSupported: isSharedArrayBufferAvailable,
        unsupportedReason: unsupportedReason
      }
    }
  });
};

// Handle messages from main thread
self.onmessage = async (e) => {
  console.log('Worker received message', e.data);

  if (!stockfishEngine) {
    console.error('Stockfish engine not initialized');
    self.postMessage({
      type: 'error',
      data: { message: 'Stockfish engine not initialized' }
    });
    return;
  }

  const { type, fen, settings } = e.data;

  // Prevent race conditions by ensuring commands are processed sequentially
  if (isProcessingCommand && type !== 'update_settings') {
    console.warn('Command Queuing', `Waiting for previous command to complete: ${type}`);
    // Wait a bit and then retry by posting the same message back to self
    setTimeout(() => {
      self.postMessage({ type: 'debug', data: { message: `Requeuing command: ${type}` } });
      // Repost the message
      self.onmessage(e);
    }, 100);
    return;
  }

  isProcessingCommand = true;

  try {
    // Helper function to ensure clean stop
    const ensureEngineStopped = async () => {
      console.log('Ensuring engine is stopped');
      if (stockfishEngine) {
        stockfishEngine.postMessage('stop');
        // Wait for the engine to respond
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    };

    switch (type) {
      case 'start':
        console.log('Processing start command', { fen, settings });
        // Always ensure clean stop before starting
        await ensureEngineStopped();

        if (fen) {
          currentFen = fen;
        }

        // Update engine settings and ensure state is set before starting
        if (settings) {
          const oldInfinite = currentSettings.isInfinite;
          currentSettings = {
            depth: settings.depth || currentSettings.depth,
            multiPV: settings.multiPV || currentSettings.multiPV,
            threads: settings.threads || currentSettings.threads,
            isInfinite: settings.isInfinite ?? currentSettings.isInfinite
          };
          console.log('Updated engine settings', {
            oldInfinite,
            newInfinite: currentSettings.isInfinite,
            depth: currentSettings.depth,
            multiPV: currentSettings.multiPV,
            threads: currentSettings.threads
          });
          stockfishEngine.postMessage(`setoption name Threads value ${currentSettings.threads}`);
          stockfishEngine.postMessage(`setoption name MultiPV value ${currentSettings.multiPV}`);
        }

        // Set state before starting analysis
        isAnalyzing = true;
        isPaused = false;
        lastUpdateTime = 0;

        // Start CPU usage measurement
        startCpuUsageMeasurement();

        console.log('Setting position and starting analysis', {
          fen: currentFen,
          isInfinite: currentSettings.isInfinite,
          depth: currentSettings.depth,
          command: currentSettings.isInfinite ? 'go infinite' : `go depth ${currentSettings.depth}`
        });

        // Set position and start analysis
        stockfishEngine.postMessage(`position fen ${currentFen}`);

        if (currentSettings.isInfinite) {
          stockfishEngine.postMessage('go infinite');
        } else {
          stockfishEngine.postMessage(`go depth ${currentSettings.depth}`);
        }

        // Notify UI that analysis is starting
        console.log('Sending started message to UI');
        self.postMessage({ type: 'started' });
        // Send initial progress
        self.postMessage({ type: 'progress', data: { depth: 0 } });

        // Verify thread usage after starting analysis
        setTimeout(verifyThreadUsage, 500);
        break;

      case 'stop':
        console.log('Processing stop command');
        if (isAnalyzing) {
          await ensureEngineStopped();
          isAnalyzing = false;
          isPaused = false;

          // Stop CPU usage measurement
          stopCpuUsageMeasurement();

          // Send complete and reset progress
          console.log('Sending complete message to UI');
          self.postMessage({ type: 'complete' });
          self.postMessage({ type: 'progress', data: { depth: 0 } });
        }
        break;

      case 'update_settings':
        if (settings) {
          const oldSettings = { ...currentSettings };
          currentSettings = {
            depth: settings.depth !== undefined ? settings.depth : currentSettings.depth,
            multiPV: settings.multiPV !== undefined ? settings.multiPV : currentSettings.multiPV,
            threads: settings.threads !== undefined ? settings.threads : currentSettings.threads,
            isInfinite: settings.isInfinite !== undefined ? settings.isInfinite : currentSettings.isInfinite
          };

          // Only update engine settings if they've changed
          if (oldSettings.threads !== currentSettings.threads) {
            stockfishEngine.postMessage(`setoption name Threads value ${currentSettings.threads}`);
          }

          if (oldSettings.multiPV !== currentSettings.multiPV) {
            stockfishEngine.postMessage(`setoption name MultiPV value ${currentSettings.multiPV}`);
          }

          // If analyzing and infinite setting changed, restart analysis
          if (isAnalyzing && oldSettings.isInfinite !== currentSettings.isInfinite) {
            await ensureEngineStopped();
            stockfishEngine.postMessage(`position fen ${currentFen}`);
            if (currentSettings.isInfinite) {
              stockfishEngine.postMessage('go infinite');
            } else {
              stockfishEngine.postMessage(`go depth ${currentSettings.depth}`);
            }
          }

          // Verify thread usage after updating settings
          setTimeout(verifyThreadUsage, 500);
        }
        break;
    }
  } finally {
    isProcessingCommand = false;
  }
};

// Add termination handler
self.addEventListener('message', (e) => {
  if (e.data.type === 'terminate') {
    isTerminated = true;
    if (stockfishEngine) {
      try {
        stockfishEngine.postMessage('quit');
        if (stockfishEngine.terminate) {
          stockfishEngine.terminate();
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn('Error during engine termination:', errorMessage);
      }
    }
    self.close();
  }
});