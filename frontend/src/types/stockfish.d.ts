declare module 'stockfish/src/stockfish-nnue-16-single.js' {
    const Stockfish: () => string;
    export default Stockfish;
}

export interface StockfishLine {
    move: string;
    evaluation: number;
    sequence: string[];
}

export interface EngineSettings {
    depth: number;
    multiPV: number;
    threads: number;
    autoAnalysis: boolean;
}

export interface StockfishWorkerMessage {
    type: 'analysis' | 'complete' | 'error';
    data?: {
        evaluation?: number;
        line?: StockfishLine;
        message?: string;
    };
}