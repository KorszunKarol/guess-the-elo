'use client';

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '@/components/chess/ChessBoard';
import ChessEvaluationComponent from '@/components/chess/ChessEvaluationComponent';
import { Header } from '@components/game/Header';
import { BackgroundDots } from '@/components/chess/BackgroundDots';
import { Card, CardContent } from '@/components/ui/card';
import { SettingsModal } from '@/components/chess/SettingsModal';
import StockfishEvaluation from '@/components/stockfish/StockfishEvaluation';
import { Clock, Flag, RotateCcw, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GuessTheEval() {
    const [game, setGame] = useState<Chess>(new Chess());
    const [currentRound, setCurrentRound] = useState(1);
    const [totalRounds] = useState(5);
    const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds per round
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Timer effect
    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    // Format time remaining
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = (evaluation: number) => {
        // Handle evaluation submission
        if (currentRound < totalRounds) {
            setCurrentRound((prev) => prev + 1);
            setTimeRemaining(60); // Reset timer for next round
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white relative select-none">
            <BackgroundDots />
            <div className="container mx-auto px-4 py-8 relative z-10">
                <Header
                    onProfileClick={() => {}}
                    onSettingsClick={() => setIsSettingsOpen(true)}
                    onStatsClick={() => {}}
                />

                {/* Main Content */}
                <div className="mt-8 space-y-6">
                    {/* Position Card with Round and Timer */}
                    <Card className="bg-gray-900 border-gray-800 overflow-hidden">
                        <div className="p-6 flex items-center justify-between border-b border-gray-800 bg-gray-950">
                            <h2 className="text-2xl font-bold text-gray-100">
                                Current Position
                            </h2>
                            <div className="flex items-center gap-8 text-lg">
                                <div className="flex items-center gap-3">
                                    <Flag className="h-6 w-6 text-blue-400" />
                                    <span className="text-gray-300">
                                        Round{' '}
                                        <span className="text-blue-400 font-semibold">
                                            {currentRound}
                                        </span>
                                        /{totalRounds}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-6 w-6 text-yellow-400" />
                                    <span className="text-yellow-400 font-mono font-semibold text-2xl">
                                        {formatTime(timeRemaining)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Chess Board Container */}
                        <div className="p-10 bg-gradient-to-br from-gray-900 to-gray-800">
                            <div className="max-w-[800px] mx-auto">
                                <div className="relative aspect-square rounded-xl overflow-hidden border-4 border-gray-700 shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5" />
                                    <ChessBoard
                                        position={game.fen()}
                                        onMove={() => {}}
                                    />

                                    {/* Board Controls */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 bg-gray-900/80 hover:bg-gray-800"
                                        >
                                            <Square className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 bg-gray-900/80 hover:bg-gray-800"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Evaluation Components */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
                        <ChessEvaluationComponent
                            onSubmit={handleSubmit}
                            currentMove={currentRound}
                            highScore={0}
                            totalMoves={totalRounds}
                        />
                        <StockfishEvaluation />
                    </div>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={(settings) => {
                    console.log('Settings saved:', settings);
                    setIsSettingsOpen(false);
                }}
                gameMode="eval"
            />
        </div>
    );
}
