/// <reference lib="webworker" />

// This is a Web Worker file that handles Stockfish analysis
// It runs in a separate thread to avoid blocking the UI

import type { StockfishLine } from '@/types/stockfish';
import Stockfish from 'stockfish/src/stockfish-nnue-16-single.js';
import { Chess } from 'chess.js';

interface StockfishMessage {
  type: 'start' | 'stop' | 'pause' | 'resume' | 'update_settings';
  fen?: string;
  settings?: {
    depth: number;
    multiPV: number;
    threads: number;
    isInfinite?: boolean;
  };
}

let isAnalyzing = false;
let isPaused = false;
let currentFen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
let lastUpdateTime = 0;
let isProcessingCommand = false; // Flag to prevent race conditions
let currentSettings = {
  depth: 20,
  multiPV: 3,
  threads: 2,
  isInfinite: false
};
const UPDATE_THROTTLE_MS = 100; // Throttle updates to 10 per second max

// Add debug logging utility
const DEBUG = true;
const debugLog = (prefix: string, data: any) => {
  if (DEBUG) {
    console.log(`[DEBUG][${prefix}]`, data);
  }
};

// Add utility to format evaluation score
const formatEvaluation = (type: string, value: string): { score: number; text: string } => {
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

// Parse evaluation score from Stockfish output
const parseEvaluation = (line: string): { score: number; text: string } | null => {
  debugLog('Raw Line', line);

  const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
  debugLog('Score Match', scoreMatch);

  if (!scoreMatch) return null;

  const [_, type, value] = scoreMatch;
  return formatEvaluation(type, value);
};

// Convert UCI moves to SAN notation
const convertMovesToSan = (uciMoves: string[]): string[] => {
  const chess = new Chess(currentFen);
  const sanMoves: string[] = [];

  for (const uciMove of uciMoves) {
    try {
      // Skip empty moves
      if (!uciMove || uciMove.length < 4) continue;

      // Convert UCI move format (e2e4) to an object format { from: 'e2', to: 'e4' }
      const from = uciMove.slice(0, 2);
      const to = uciMove.slice(2, 4);
      const promotion = uciMove[4];

      const moveObj = {
        from,
        to,
        ...(promotion && { promotion })
      };

      const move = chess.move(moveObj);
      if (move) {
        sanMoves.push(move.san);
      }
    } catch (err) {
      console.error('Failed to convert move:', uciMove, err);
      break; // Stop on first error as subsequent moves would be invalid
    }
  }

  return sanMoves;
};

// Parse best line from Stockfish output
const parseBestLine = (line: string): StockfishLine | null => {
  debugLog('Parsing Line', line);

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
  const sanMoves = convertMovesToSan(uciMoves);
  debugLog('SAN Moves', sanMoves);

  return {
    move: sanMoves[0] || '',
    evaluation: scoreInfo?.score || 0,
    evaluationText: scoreInfo?.text || '0.00',
    sequence: sanMoves,
    depth: parseInt(depth),
    multipv: multipvStr ? parseInt(multipvStr) : 1,
    nodes,
    time
  };
};

// Initialize Stockfish
const initStockfish = async () => {
  try {
    // Determine the correct path based on environment
    const basePath = process.env.NODE_ENV === 'development'
      ? `${self.location.origin}/wasm`
      : '/_next/static/wasm';

    const workerPath = `${basePath}/stockfish-nnue-16-single.js`;
    console.log('Loading Stockfish worker from:', workerPath);

    const engine = new Worker(workerPath, {
      type: 'module',
      name: 'stockfish-worker'
    });

    // Enhanced initialization sequence
    engine.postMessage('uci');
    engine.postMessage('setoption name Use NNUE value true');
    engine.postMessage('setoption name Threads value 2');
    engine.postMessage('setoption name MultiPV value 3');
    engine.postMessage('setoption name UCI_AnalyseMode value true'); // Enable analysis mode
    engine.postMessage('setoption name Hash value 128'); // Set hash size to 128MB
    engine.postMessage('isready');

    // Add log formatting utilities
    const formatStockfishLog = (message: string) => {
      debugLog('Formatting Message', message);

      // Only format info depth messages that contain a score and pv
      if (message.startsWith('info depth') && message.includes('score') && message.includes('pv')) {
        const parts = message.split(' ');
        debugLog('Message Parts', parts);

        const depth = parts[2];
        const scoreIndex = parts.indexOf('score') + 2;
        const nodesIndex = parts.indexOf('nodes') + 1;
        const timeIndex = parts.indexOf('time') + 1;
        const pvIndex = parts.indexOf('pv') + 1;

        debugLog('Indices', { depth, scoreIndex, nodesIndex, timeIndex, pvIndex });

        // Only proceed if we found all required indices
        if (scoreIndex > 2 && nodesIndex > 1 && timeIndex > 1 && pvIndex > 1) {
          const scoreType = parts[scoreIndex - 1]; // 'cp' or 'mate'
          const score = parts[scoreIndex];
          const nodes = parseInt(parts[nodesIndex]).toLocaleString();
          const time = Math.round(parseInt(parts[timeIndex]) / 10) / 100;
          const pv = parts.slice(pvIndex).join(' ');

          debugLog('Parsed Values', { scoreType, score, nodes, time, pv });

          const formattedScore = scoreType === 'mate' ?
            `Mate in ${Math.abs(parseInt(score))}` :
            (parseInt(score) / 100).toFixed(2);

          return `[Depth ${depth}] Score: ${formattedScore} | Nodes: ${nodes} | Time: ${time}s\nLine: ${pv}`;
        }
      }

      // Format bestmove messages
      if (message.startsWith('bestmove')) {
        const parts = message.split(' ');
        debugLog('Bestmove Parts', parts);
        const move = parts[1];
        return `[Best Move] ${move}`;
      }

      // Don't log other messages
      return null;
    };

    // Set up message handler with throttling for continuous updates
    engine.onmessage = (e: MessageEvent) => {
      const message = e.data;
      debugLog('Worker Message', message);

      // Process readyok message
      if (message === 'readyok') {
        self.postMessage({ type: 'ready' });
      }

      // Handle "bestmove" messages when analysis is complete
      if (message.startsWith('bestmove')) {
        console.log('Received bestmove message in infinite mode:', currentSettings.isInfinite);
        const formattedLog = formatStockfishLog(message);
        if (formattedLog) {
          console.log('[Stockfish]', formattedLog);
        }

        // Only handle completion in non-infinite mode
        if (!currentSettings.isInfinite) {
          if (!isPaused) {
            // In depth-limited mode, this means we've reached target depth
            console.log('Analysis complete in depth-limited mode, stopping');
            isAnalyzing = false;
            self.postMessage({ type: 'complete' });
            self.postMessage({ type: 'progress', data: { depth: 100 } });
          }
        } else {
          console.log('Received bestmove in infinite mode - restarting analysis');
          // In infinite mode, we need to restart the analysis
          restartInfiniteAnalysis();
        }
      }

      // Process info messages with throttling for UI performance
      if (message.startsWith('info depth') && message.includes('score') && message.includes('pv')) {
        const now = Date.now();
        const shouldUpdate = now - lastUpdateTime >= UPDATE_THROTTLE_MS;

        // Extract depth information for debugging
        const depthMatch = message.match(/depth (\d+)/);
        const currentDepth = depthMatch ? parseInt(depthMatch[1]) : 0;
        console.log(`Processing info at depth ${currentDepth}, infinite mode: ${currentSettings.isInfinite}`);

        // Always process the message for logging
        const formattedLog = formatStockfishLog(message);
        if (formattedLog) {
          console.log('[Stockfish]', formattedLog);
        }

        // Only send updates to UI at throttled rate
        if (shouldUpdate && isAnalyzing) {
          lastUpdateTime = now;

          // Parse Stockfish output and send back to main thread
          const evaluation = parseEvaluation(message);
          const bestLine = parseBestLine(message);
          debugLog('Parsed Data', { evaluation, bestLine });

          if (evaluation && bestLine) {
            // Update progress based on depth in non-infinite mode
            if (!currentSettings.isInfinite) {
              const progress = Math.min((bestLine.depth / currentSettings.depth) * 100, 99);
              console.log(`Depth progress: ${bestLine.depth}/${currentSettings.depth} (${progress.toFixed(1)}%)`);
              self.postMessage({ type: 'progress', data: { depth: progress } });
            }

            self.postMessage({
              type: 'analysis',
              data: {
                evaluation: evaluation.score,
                evaluationText: evaluation.text,
                line: bestLine
              }
            });
          }
        }
      }
    };

    console.log('Initializing Stockfish worker from:', import.meta.url);
    console.log('WASM path:', new URL('stockfish/src/stockfish-nnue-16-single.wasm', import.meta.url).href);

    return engine;
  } catch (error) {
    console.error('Stockfish initialization failed:', error);
    throw error;
  }
};

// Initialize Stockfish engine
let stockfishEngine: Worker | null = null;

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

// Handle messages from main thread
self.onmessage = async (e: MessageEvent<StockfishMessage>) => {
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
      // Use a type assertion to handle the TypeScript error
      (self.onmessage as (e: MessageEvent<StockfishMessage>) => void)(e);
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
        break;

      case 'stop':
        console.log('Processing stop command');
        if (isAnalyzing) {
          await ensureEngineStopped();
          isAnalyzing = false;
          isPaused = false;
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
        }
        break;
    }
  } finally {
    isProcessingCommand = false;
  }
};