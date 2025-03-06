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

export interface StockfishWorkerMessage {
    type: 'analysis' | 'complete' | 'error' | 'ready' | 'started' | 'paused' | 'resumed' | 'progress' | 'update_settings' | 'debug';
    data?: {
        evaluation?: number;
        evaluationText?: string;
        line?: StockfishLine;
        message?: string;
        depth?: number;
    };
}