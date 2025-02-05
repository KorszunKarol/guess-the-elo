import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { GameState } from '../types';
import { generateRandomPosition } from '@/app/guess-the-elo/utils/chessUtils';

export function useGameState(totalRounds: number = 5) {
    const [gameState, setGameState] = useState<GameState>({
        currentRound: 1,
        totalRounds,
        timeRemaining: 60,
        score: 0,
        positions: [],
    });

    const [game, setGame] = useState<Chess>(new Chess());

    useEffect(() => {
        // Generate positions for all rounds
        const positions = Array(totalRounds)
            .fill(null)
            .map(() => generateRandomPosition());
        setGameState((prev) => ({ ...prev, positions }));
    }, [totalRounds]);

    const nextRound = () => {
        setGameState((prev) => ({
            ...prev,
            currentRound: prev.currentRound + 1,
            timeRemaining: 60,
        }));

        // Set new position
        const newGame = new Chess(gameState.positions[gameState.currentRound]);
        setGame(newGame);
    };

    return {
        gameState,
        game,
        nextRound,
    };
}
