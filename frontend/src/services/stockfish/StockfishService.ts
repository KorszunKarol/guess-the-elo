import type { EngineSettings, StockfishLine } from '@/types/stockfish';

// Event types for the service
type EventType = 'ready' | 'analysis' | 'progress' | 'complete' | 'error' | 'started' | 'paused' | 'resumed';
type EventCallback = (...args: any[]) => void;

export class StockfishService {
  // Core properties
  private worker: Worker | null = null;
  private isReady: boolean = false;
  private isAnalyzing: boolean = false;
  private isPaused: boolean = false;
  private currentFen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  private settings: EngineSettings = {
    depth: 20,
    multiPV: 3,
    threads: 2,
    isInfinite: false
  };
  private bestLines: StockfishLine[] = [];
  private debug = false;

  // Event handlers
  private eventHandlers: {
    [key in EventType]: EventCallback[];
  } = {
    ready: [],
    analysis: [],
    progress: [],
    complete: [],
    error: [],
    started: [],
    paused: [],
    resumed: []
  };

  constructor(debug = false) {
    this.debug = debug;
  }

  /**
   * Initialize the Stockfish worker and set up event handlers
   */
  public async initialize(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    this.debugLog('Initializing Stockfish service');

    try {
      // For testing purposes, we'll create a mock worker
      if (process.env.NODE_ENV === 'test') {
        this.worker = new Worker('/stockfish-worker.js');
      } else {
        // In real environment, use the actual worker
        this.worker = new Worker(
          new URL('/stockfish-worker.js', window.location.origin)
        );
      }

      this.debugLog('Worker created successfully');

      // Set up message handler
      this.worker.onmessage = this.handleWorkerMessage.bind(this);

      // Wait for engine to be ready
      const isReady = await new Promise<boolean>((resolve) => {
        const readyHandler = () => {
          this.off('ready', readyHandler);
          resolve(true);
        };

        this.on('ready', readyHandler);

        // Timeout after 5 seconds
        const timeout = setTimeout(() => {
          this.off('ready', readyHandler);
          this.triggerEvent('error', 'Engine initialization timed out');
          resolve(false);
        }, 5000);

        this.on('ready', () => clearTimeout(timeout));
      });

      return isReady;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error initializing Stockfish';
      this.triggerEvent('error', errorMessage);
      return false;
    }
  }

  /**
   * Handle messages from the worker
   */
  private handleWorkerMessage(e: MessageEvent) {
    const { type, data } = e.data;
    this.debugLog('Worker message received', { type, data });

    switch (type) {
      case 'ready':
        this.isReady = true;
        this.triggerEvent('ready');
        break;

      case 'started':
        this.isAnalyzing = true;
        this.isPaused = false;
        this.triggerEvent('started');
        break;

      case 'paused':
        this.isPaused = true;
        this.triggerEvent('paused');
        break;

      case 'resumed':
        this.isPaused = false;
        this.triggerEvent('resumed');
        break;

      case 'analysis':
        if (data.line) {
          // Find or create the line
          const lineIndex = this.bestLines.findIndex(
            line => line.multipv === data.line.multipv
          );

          if (lineIndex === -1) {
            this.bestLines.push({
              ...data.line,
              evaluation: data.evaluation || 0
            });
          } else {
            this.bestLines[lineIndex] = {
              ...data.line,
              evaluation: data.evaluation || 0
            };
          }

          // Sort lines by evaluation
          this.bestLines.sort((a, b) => b.evaluation - a.evaluation);

          // Calculate progress
          let progress = 0;
          if (!this.settings.isInfinite) {
            const maxDepth = this.settings.depth;
            const currentDepth = data.line.depth;
            progress = Math.min((currentDepth / maxDepth) * 100, 99);
          } else {
            // In infinite mode, just show the current depth as progress
            progress = data.line.depth;
          }

          this.triggerEvent('progress', progress);
          this.triggerEvent('analysis', this.bestLines);
        }
        break;

      case 'progress':
        if (data && data.depth) {
          this.triggerEvent('progress', data.depth);
        }
        break;

      case 'complete':
        this.isAnalyzing = false;
        this.isPaused = false;
        this.triggerEvent('progress', 100);
        this.triggerEvent('complete');
        break;

      case 'error':
        this.isAnalyzing = false;
        this.isPaused = false;
        this.triggerEvent('error', data.message);
        break;
    }
  }

  /**
   * Start analyzing a position
   */
  public analyze(fen: string): void {
    this.debugLog('analyze called', { worker: !!this.worker, isReady: this.isReady, fen });

    if (!this.worker) {
      this.triggerEvent('error', 'Stockfish worker not initialized');
      return;
    }

    if (!this.isReady) {
      this.triggerEvent('error', 'Engine not ready yet');
      return;
    }

    // Reset state
    this.bestLines = [];
    this.isAnalyzing = true;
    this.isPaused = false;
    this.currentFen = fen;

    this.debugLog('Sending start command to worker', {
      fen,
      settings: this.settings
    });

    // Send command to worker
    this.worker.postMessage({
      type: 'start',
      fen,
      settings: this.settings
    });

    this.triggerEvent('started');
  }

  /**
   * Stop the current analysis
   */
  public stop(): void {
    this.debugLog('stop called', { worker: !!this.worker, isAnalyzing: this.isAnalyzing });

    if (!this.worker || !this.isAnalyzing) {
      return;
    }

    this.worker.postMessage({ type: 'stop' });
    this.isAnalyzing = false;
    this.isPaused = false;
    this.triggerEvent('complete');
  }

  /**
   * Pause the current analysis
   */
  public pause(): void {
    this.debugLog('pause called', { worker: !!this.worker, isAnalyzing: this.isAnalyzing });

    if (!this.worker || !this.isAnalyzing || this.isPaused) {
      return;
    }

    this.worker.postMessage({ type: 'pause' });
    this.isPaused = true;
    this.triggerEvent('paused');
  }

  /**
   * Resume the paused analysis
   */
  public resume(): void {
    this.debugLog('resume called', { worker: !!this.worker, isAnalyzing: this.isAnalyzing, isPaused: this.isPaused });

    if (!this.worker || !this.isAnalyzing || !this.isPaused) {
      return;
    }

    this.worker.postMessage({ type: 'resume' });
    this.isPaused = false;
    this.triggerEvent('resumed');
  }

  /**
   * Update engine settings
   */
  public updateSettings(newSettings: Partial<EngineSettings>): void {
    this.debugLog('updateSettings called', { newSettings });

    this.settings = { ...this.settings, ...newSettings };

    if (this.worker && this.isAnalyzing) {
      this.worker.postMessage({
        type: 'update_settings',
        settings: this.settings
      });
    }
  }

  /**
   * Register event handler
   */
  public on(event: EventType, callback: EventCallback): void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(callback);
  }

  /**
   * Unregister event handler
   */
  public off(event: EventType, callback: EventCallback): void {
    if (!this.eventHandlers[event]) return;

    const index = this.eventHandlers[event].indexOf(callback);
    if (index !== -1) {
      this.eventHandlers[event].splice(index, 1);
    }
  }

  /**
   * Trigger an event
   */
  private triggerEvent(event: EventType, ...args: any[]): void {
    if (!this.eventHandlers[event]) return;

    for (const callback of this.eventHandlers[event]) {
      try {
        callback(...args);
      } catch (err) {
        console.error(`Error in ${event} event handler:`, err);
      }
    }
  }

  /**
   * Get current engine state
   */
  public getEngineState() {
    return {
      isReady: this.isReady,
      isAnalyzing: this.isAnalyzing,
      isPaused: this.isPaused,
      currentFen: this.currentFen,
      settings: { ...this.settings },
      bestLines: [...this.bestLines]
    };
  }

  /**
   * Log debug messages if debug mode is enabled
   */
  private debugLog(message: string, data?: any): void {
    if (!this.debug) return;
    console.log(`[StockfishService] ${message}`, data);
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.debugLog('dispose called');

    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    // Clear all event handlers
    for (const event in this.eventHandlers) {
      this.eventHandlers[event as EventType] = [];
    }

    this.isReady = false;
    this.isAnalyzing = false;
    this.isPaused = false;
  }
}