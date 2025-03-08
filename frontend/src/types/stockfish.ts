export interface StockfishLine {
    move: string;
    evaluation: number;
    evaluationText: string;
    sequence: string[];
    depth: number;
    multipv: number;
    nodes: string;
    time: string;
}

export interface EngineSettings {
    depth: number;
    multiPV: number;
    threads: number;
    isInfinite: boolean;
}

export interface ThreadInfo {
    requestedThreads: number;
    actualThreads: number;
    cpuUsage?: number;
}

export interface StockfishWorkerMessage {
    type: 'analysis' | 'analysis_batch' | 'complete' | 'error' | 'ready' | 'started' | 'paused' | 'resumed' | 'progress' | 'update_settings' | 'debug' | 'thread_info';
    data?: {
        evaluation?: number;
        evaluationText?: string;
        line?: StockfishLine;
        lines?: StockfishLine[];
        message?: string;
        depth?: number;
        threadInfo?: ThreadInfo;
    };
}