'use client';

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '@/components/chess/ChessBoard';
import ChessEvaluationComponent from '@/components/chess/ChessEvaluationComponent';
import { Header } from '@/components/game';
import { Card } from '@/components/ui/card';
import { SettingsModal } from '@/components/chess/SettingsModal';
import StockfishEvaluation from '@/components/stockfish/StockfishEvaluation';
import { GameLayout } from '@/components/game/GameLayout';
import ProfilePage from '@/components/chess/ProfilePage';
import StatsPage from '@/components/chess/StatsPage';
import { BoardControls } from '@/components/game';
import { ChessContainer } from '@/components/chess/ChessContainer';
import { Clock } from 'lucide-react';

export default function GuessTheEvalPage() {
    const [game, setGame] = useState<Chess>(new Chess());
    const [currentRound, setCurrentRound] = useState(1);
    const [totalRounds] = useState(5);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [currentGuess, setCurrentGuess] = useState<number>(0);
    const [userData, setUserData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        subscription: 'Free',
        subscriptionPrice: '$0',
        achievements: ['Beginner', '10 Games Played'],
        stats: {
            guessTheElo: {
                gamesPlayed: 0,
                averageAccuracy: 0,
                bestStreak: 0,
                totalPoints: 0,
                ratingDistribution: {
                    beginner: 0,
                    intermediate: 0,
                    advanced: 0,
                    expert: 0,
                },
            },
            guessTheEval: {
                gamesPlayed: 0,
                averageAccuracy: 0,
                averageCPL: 0,
                totalPoints: 0,
                bestAccuracy: 0,
                averageTime: 0,
                winningPositions: 0,
                equalPositions: 0,
                losingPositions: 0,
            },
            overall: {
                totalGamesPlayed: 0,
                rank: 'Novice Analyst',
                joinedDate: new Date().toISOString(),
                lastPlayed: new Date().toISOString(),
            },
        },
    });
    const [isFlipped, setIsFlipped] = useState(false);

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
        setIsFlipped(!isFlipped);
    };

    const handleResetPosition = () => {
        setGame(new Chess());
        setCurrentGuess(0);
    };

    const handleMove = (move: string) => {
        // Handle move logic
    };

    if (showProfile) {
        return (
            <ProfilePage
                onClose={() => setShowProfile(false)}
                userData={{
                    ...userData,
                    stats: {
                        ...userData.stats,
                        guessTheElo: {
                            ...userData.stats.guessTheElo,
                            bestStreak: 0,
                        },
                        guessTheEval: {
                            ...userData.stats.guessTheEval,
                            bestStreak: 0,
                            positionTypes: {
                                tactical: 0,
                                strategic: 0,
                                endgame: 0,
                                opening: 0,
                            },
                        },
                    },
                }}
            />
        );
    }

    if (showStats) {
        return (
            <StatsPage
                onClose={() => setShowStats(false)}
                stats={{
                    guessTheElo: {
                        ...userData.stats.guessTheElo,
                        averageError: 0,
                        bestAccuracy: 0,
                        averageTime: 0,
                    },
                    guessTheEval: userData.stats.guessTheEval,
                }}
            />
        );
    }

    return (


        <div className="flex flex-col items-center justify-start p-0 bg-gray-900/95 min-h-screen">
            <div className="w-full max-w-screen-2xl mx-auto mt-1">
                <div className="bg-gray-800/90 border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden w-full">
                    <GameLayout
                        leftPanel={
                            <StockfishEvaluation />
                        }
                        centerPanel={
                            <div className="relative isolate z-10 h-full">
                                <ChessContainer
                                    className="w-full max-w-[min(800px,95vh)] aspect-square"
                                    onFlipBoard={handleFlipBoard}
                                >
                                    <ChessBoard
                                        position={game.fen()}
                                        onMove={handleMove}
                                        className="aspect-square w-full h-full"
                                        boardOrientation={isFlipped ? 'black' : 'white'}
                                    />
                                </ChessContainer>
                            </div>
                        }
                        rightPanel={
                            <div className="flex flex-col gap-4 h-full">
                                <div className="flex justify-between items-center px-4 pt-4">
                                    <h2 className="text-xl font-bold text-blue-400">Guess the Eval</h2>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm font-medium text-gray-300">
                                            Round: {currentRound}/{totalRounds}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-purple-400">
                                            <Clock className="h-4 w-4" />
                                            {timeRemaining}s
                                        </div>
                                    </div>
                                </div>

                                <ChessEvaluationComponent
                                    onSubmit={handleSubmit}
                                    currentMove={currentRound}
                                    highScore={0}
                                    totalMoves={totalRounds}
                                    position={game.fen()}
                                />
                            </div>
                        }
                    />
                </div>
            </div>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={(settings: any) => {
                    console.log('Settings saved:', settings);
                    setIsSettingsOpen(false);
                }}
                gameMode="eval"
            />
        </div>
    );
}
