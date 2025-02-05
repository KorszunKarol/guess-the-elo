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
import ProfilePage from '@/components/chess/ProfilePage';
import StatsPage from '@/components/chess/StatsPage';

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
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-900/95 backdrop-blur-md min-h-screen">
            <Header
                onProfileClick={() => setShowProfile(true)}
                onSettingsClick={() => setIsSettingsOpen(true)}
                onStatsClick={() => setShowStats(true)}
            />
            <div className="w-full max-w-screen-2xl mx-auto mt-6">
                <div className="bg-gray-800/80 border border-gray-700/50 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden w-full">
                    <GameHeader
                        currentRound={currentRound}
                        totalRounds={totalRounds}
                        timeRemaining={timeRemaining}
                        title="Guess the Eval"
                    />
                    <GameLayout
                        leftPanel={
                            <StockfishEvaluation />
                        }
                        centerPanel={
                            <ChessContainer
                                className="w-full max-w-[min(600px,90vh)] aspect-square"
                                onFlipBoard={handleFlipBoard}
                            >
                                <ChessBoard
                                    position={game.fen()}
                                    onMove={handleMove}
                                    className="aspect-square w-full h-full"
                                    boardOrientation={isFlipped ? 'black' : 'white'}
                                />
                            </ChessContainer>
                        }
                        rightPanel={
                            <ChessEvaluationComponent
                                onSubmit={handleSubmit}
                                currentMove={currentRound}
                                highScore={0}
                                totalMoves={totalRounds}
                            />
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
