export interface GameState {
    currentRound: number;
    totalRounds: number;
    timeRemaining: number;
    score: number;
    positions: string[]; // FEN strings
}

export interface EvaluationGuess {
    value: number;
    timestamp: number;
}

export interface GameSettings {
    timePerRound: number;
    totalRounds: number;
    showHints: boolean;
}

export * from './engine';
export * from './game';
export * from './chess'; // Add if you have chess types
