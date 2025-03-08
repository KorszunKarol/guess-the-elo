import { StockfishService } from '../StockfishService';
import type { StockfishLine } from '@/types/stockfish';

// No need to mock worker_threads as we're using the global Worker mock from jest.setup.js

describe('StockfishService', () => {
  let service: StockfishService;
  let mockWorker: any;
  let mockPostMessage: jest.Mock;
  let mockOnMessage: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock worker
    mockPostMessage = jest.fn();
    mockOnMessage = jest.fn();
    mockWorker = {
      postMessage: mockPostMessage,
      terminate: jest.fn(),
      onmessage: mockOnMessage,
    };

    // Mock Worker constructor
    (global as any).Worker = jest.fn(() => mockWorker);

    // Create service instance
    service = new StockfishService(true); // Enable debug mode for testing
  });

  afterEach(() => {
    service.dispose();
  });

  describe('initialization', () => {
    test('initializes correctly', async () => {
      // Start initialization
      const initPromise = service.initialize();

      // Simulate worker ready message
      const readyCallback = (mockWorker as any).onmessage;
      readyCallback({ data: { type: 'ready' } });

      // Check result
      const result = await initPromise;
      expect(result).toBe(true);
    });

    test('handles initialization failure', async () => {
      // Mock Worker to throw error
      (global as any).Worker = jest.fn(() => {
        throw new Error('Worker initialization failed');
      });

      // Create new service instance
      const errorService = new StockfishService();

      // Start initialization
      const result = await errorService.initialize();

      // Check result
      expect(result).toBe(false);
    });
  });

  describe('analysis', () => {
    beforeEach(async () => {
      // Initialize service
      const initPromise = service.initialize();

      // Simulate worker ready message
      const readyCallback = (mockWorker as any).onmessage;
      readyCallback({ data: { type: 'ready' } });

      await initPromise;
    });

    test('starts analysis correctly', () => {
      // Set up test
      const testFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

      // Register mock event handler
      const startedHandler = jest.fn();
      service.on('started', startedHandler);

      // Start analysis
      service.analyze(testFen);

      // Check if worker received correct message
      expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'start',
        fen: testFen,
        settings: expect.any(Object)
      });

      // Check if event was triggered
      expect(startedHandler).toHaveBeenCalled();
    });

    test('handles analysis results', () => {
      // Set up test
      const testFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

      // Register mock event handlers
      const analysisHandler = jest.fn();
      const progressHandler = jest.fn();
      service.on('analysis', analysisHandler);
      service.on('progress', progressHandler);

      // Start analysis
      service.analyze(testFen);

      // Simulate analysis result
      const mockLine: StockfishLine = {
        move: 'e2e4',
        evaluation: 0.32,
        evaluationText: '+0.32',
        sequence: ['e2e4', 'e7e5'],
        depth: 10,
        multipv: 1,
        nodes: '1000000',
        time: '1000'
      };

      const readyCallback = (mockWorker as any).onmessage;
      readyCallback({
        data: {
          type: 'analysis',
          data: {
            line: mockLine,
            evaluation: 0.32
          }
        }
      });

      // Check if events were triggered
      expect(analysisHandler).toHaveBeenCalled();
      expect(progressHandler).toHaveBeenCalled();
    });

    test('stops analysis correctly', () => {
      // Set up test
      const testFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

      // Register mock event handler
      const completeHandler = jest.fn();
      service.on('complete', completeHandler);

      // Start and then stop analysis
      service.analyze(testFen);
      service.stop();

      // Check if worker received correct message
      expect(mockPostMessage).toHaveBeenCalledWith({ type: 'stop' });

      // Check if event was triggered
      expect(completeHandler).toHaveBeenCalled();
    });
  });

  describe('settings', () => {
    beforeEach(async () => {
      // Initialize service
      const initPromise = service.initialize();

      // Simulate worker ready message
      const readyCallback = (mockWorker as any).onmessage;
      readyCallback({ data: { type: 'ready' } });

      await initPromise;
    });

    test('updates settings correctly', () => {
      // Set up test
      const newSettings = {
        depth: 25,
        multiPV: 5
      };

      // Start analysis
      const testFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      service.analyze(testFen);

      // Update settings
      service.updateSettings(newSettings);

      // Check if worker received correct message
      expect(mockPostMessage).toHaveBeenCalledWith({
        type: 'update_settings',
        settings: expect.objectContaining({
          depth: 25,
          multiPV: 5
        })
      });
    });
  });

  describe('event handling', () => {
    test('registers and unregisters event handlers', () => {
      // Set up test
      const handler = jest.fn();

      // Register handler
      service.on('ready', handler);

      // Trigger event
      (service as any).triggerEvent('ready');

      // Check if handler was called
      expect(handler).toHaveBeenCalled();

      // Reset mock
      handler.mockReset();

      // Unregister handler
      service.off('ready', handler);

      // Trigger event again
      (service as any).triggerEvent('ready');

      // Check if handler was not called
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    test('disposes resources correctly', () => {
      // Initialize service
      service.initialize();

      // Register mock event handler
      const handler = jest.fn();
      service.on('ready', handler);

      // Dispose service
      service.dispose();

      // Check if worker was terminated
      expect(mockWorker.terminate).toHaveBeenCalled();

      // Trigger event after disposal
      (service as any).triggerEvent('ready');

      // Check if handler was not called (should be removed)
      expect(handler).not.toHaveBeenCalled();
    });
  });
});