// Mock the Worker class
global.Worker = class {
  constructor() {
    this.onmessage = null;
  }
  postMessage() {}
  terminate() {}
};

// Mock URL
global.URL = {
  createObjectURL: jest.fn(),
  revokeObjectURL: jest.fn(),
};

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
  },
  writable: true,
});

// Mock process.env
process.env.NODE_ENV = 'test';