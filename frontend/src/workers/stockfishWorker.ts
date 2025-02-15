/// <reference lib="webworker" />

// This is a Web Worker file that handles Stockfish analysis
// It runs in a separate thread to avoid blocking the UI

import type { StockfishLine } from '@/types/stockfish';
import Stockfish from 'stockfish/src/stockfish-nnue-16-single.js';

interface StockfishMessage {
  type: 'start' | 'stop';
  fen?: string;
  settings?: {
    depth: number;
    multiPV: number;
    threads: number;
  };
}

let stockfish: Worker | null = null;
let isAnalyzing = false;

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

    // Add this initialization sequence
    engine.postMessage('uci');
    engine.postMessage('setoption name Use NNUE value true');
    engine.postMessage('setoption name Threads value 2');
    engine.postMessage('isready');

    // Set up message handler
    engine.onmessage = (e: MessageEvent) => {
      const message = e.data;

      // Parse Stockfish output and send back to main thread
      if (message.startsWith('info depth')) {
        const evaluation = parseEvaluation(message);
        const bestLine = parseBestLine(message);

        if (evaluation !== null && bestLine) {
          self.postMessage({
            type: 'analysis',
            data: {
              evaluation,
              line: bestLine
            }
          });
        }
      }

      // Handle "bestmove" messages when analysis is complete
      if (message.startsWith('bestmove')) {
        isAnalyzing = false;
        self.postMessage({ type: 'complete' });
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

// Parse evaluation score from Stockfish output
const parseEvaluation = (line: string): number | null => {
  const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
  if (!scoreMatch) return null;

  const [_, type, value] = scoreMatch;
  if (type === 'cp') {
    return parseInt(value) / 100;
  } else {
    // Handle mate scores
    return value.startsWith('-') ? -Infinity : Infinity;
  }
};

// Parse best line from Stockfish output
const parseBestLine = (line: string): StockfishLine | null => {
  const moveMatch = line.match(/pv (.+)$/);
  if (!moveMatch) return null;

  const moves = moveMatch[1].split(' ');
  return {
    move: moves[0],
    evaluation: 0, // This will be updated with the parsed evaluation
    sequence: moves
  };
};

// Handle messages from the main thread
self.onmessage = async (e: MessageEvent<StockfishMessage>) => {
  const { type, fen, settings } = e.data;

  if (!stockfish) {
    stockfish = await initStockfish();
    if (!stockfish) return; // Exit if initialization failed
  }

  switch (type) {
    case 'start':
      if (fen && stockfish) {
        isAnalyzing = true;

        // Update settings if provided
        if (settings) {
          stockfish.postMessage(`setoption name MultiPV value ${settings.multiPV}`);
          stockfish.postMessage(`setoption name Threads value ${settings.threads}`);
        }

        // Start analysis
        stockfish.postMessage('position fen ' + fen);
        stockfish.postMessage(`go depth ${settings?.depth || 20}`);
      }
      break;

    case 'stop':
      if (stockfish && isAnalyzing) {
        stockfish.postMessage('stop');
        isAnalyzing = false;
      }
      break;
  }
};

// Handle worker cleanup
self.addEventListener('unload', () => {
  if (stockfish) {
    stockfish.postMessage('quit');
  }
});