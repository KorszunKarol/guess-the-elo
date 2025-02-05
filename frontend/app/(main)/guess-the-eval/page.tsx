'use client';

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '@/components/chess/ChessBoard';
import ChessEvaluationComponent from '@/components/chess/ChessEvaluationComponent';
import { Header } from '@/components/game';
import { Card } from '@/components/ui/card';
import { SettingsModal } from '@/components/chess/SettingsModal';
import StockfishEvaluation from '@/components/stockfish/StockfishEvaluation';
import { GameHeader, BoardControls } from '@/components/game';
import { ChessContainer } from '@/components/chess/ChessContainer';
import { ChessControls } from '@/components/chess/ChessControls';
import { GameLayout } from '@/components/game/GameLayout';
import { StockfishAnalysis } from '@/components/stockfish/StockfishAnalysis';

export default function GuessTheEval() {
    const [game, setGame] = useState<Chess>(new Chess());
    const [currentRound, setCurrentRound] = useState(1);
    const [totalRounds] = useState(5);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        if (timeRemaining <= 0) return;
        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeRemaining]);

    const handleSubmit = (evaluation: number) => {
        if (currentRound < totalRounds) {
            setCurrentRound((prev) => prev + 1);
            setTimeRemaining(60);
        }
    };

    const handleFlipBoard = () => {
        console.log('Flip board');
    };

    const handleResetPosition = () => {
        console.log('Reset position');
    };

    const handleMove = (move: string) => {
        // Handle move logic
    };

    const headerProps = {
        onProfileClick: () => {},
        onSettingsClick: () => setIsSettingsOpen(true),
        onStatsClick: () => {}
    };

    const evaluationProps = {
        onSubmit: handleSubmit,
        currentMove: currentRound,
        highScore: 0,
        totalMoves: totalRounds
    };

    const modalProps = {
        isOpen: isSettingsOpen,
        onClose: () => setIsSettingsOpen(false),
        onSave: (settings: any) => {
            console.log('Settings saved:', settings);
            setIsSettingsOpen(false);
        },
        gameMode: 'eval'
    };

    return (
        <GameLayout
            leftPanel={
                <div aria-label="Engine analysis panel">
                    <StockfishEvaluation />
                </div>
            }
            middlePanel={
                <div aria-label="Chess board panel">
                    <ChessContainer>
                        <ChessBoard position={game.fen()} onMove={handleMove} />
                        <ChessControls
                            onFlipBoard={handleFlipBoard}
                            onReset={handleResetPosition}
                        />
                    </ChessContainer>
                </div>
            }
            rightPanel={
                <div aria-label="Guessing controls panel">
                    <ChessEvaluationComponent {...evaluationProps} />
                </div>
            }
        />
    );
}
