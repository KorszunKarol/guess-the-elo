// Simple bridge to load Stockfish from the wasm directory
importScripts('./wasm/stockfish-nnue-16-single.js');

// Initialize the engine
const engine = self.Stockfish();

// Set up message handler for engine responses
engine.onmessage = function(event) {
  // Forward messages from the engine to the main thread
  self.postMessage(event.data);
};

// Handle messages from the main thread
self.onmessage = function(event) {
  // Forward messages to the engine
  engine.postMessage(event.data);
};