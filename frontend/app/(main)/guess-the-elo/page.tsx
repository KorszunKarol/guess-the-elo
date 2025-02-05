'use client';

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './components/ChessBoard';
import { EvaluationComponent } from './components/EvaluationComponent';
import { Header, GameHeader, BoardControls, GameLayout } from '@/components/game';
import { BackgroundDots } from './components/BackgroundDots';
import { generateRandomPosition } from './utils/chessUtils';
import { Card, CardContent } from '@/components/ui/card';
import { SettingsModal } from './components/SettingsModal';
import ProfilePage from './components/ProfilePage';
import StatsPage from './components/StatsPage';
import GameModeSwitcher from '@/app/components/GameModeSwitcher';
import { ChessContainer } from '@/components/chess/ChessContainer';
import { GuessPanel } from '@/components/game/GuessPanel';
import { StockfishAnalysis } from '@/components/stockfish/StockfishAnalysis';

export default function GuessTheElo() {
    const [game, setGame] = useState<Chess>(new Chess());
    const [turn, setTurn] = useState<'White' | 'Black'>('White');
    const [highScore, setHighScore] = useState(0);
    const [round, setRound] = useState(1);
    const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds per round
    const [settings, setSettings] = useState({
        roundDuration: 60,
        numberOfRounds: 5,
    });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showStats, setShowStats] = useState(false);
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
                bestStreak: 0,
                totalPoints: 0,
                positionTypes: {
                    tactical: 0,
                    strategic: 0,
                    endgame: 0,
                    opening: 0,
                },
            },
            overall: {
                totalGamesPlayed: 0,
                rank: 'Novice Analyst',
                joinedDate: new Date().toISOString(),
                lastPlayed: new Date().toISOString(),
            },
        },
    });
    const [currentGuess, setCurrentGuess] = useState<number>(0);

    // Timer effect
    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    useEffect(() => {
        const newGame = new Chess();
        const { newPieces } = generateRandomPosition();
        newGame.clear();
        newPieces.forEach((piece: string) => {
            const [type, square] = piece.split('@');
            newGame.put(
                {
                    type: type.toLowerCase() as any,
                    color: type === type.toUpperCase() ? 'w' : 'b',
                },
                square as any
            );
        });
        setGame(newGame);
        setTurn(newGame.turn() === 'w' ? 'White' : 'Black');
    }, []);

    const handleEvaluationSubmit = (evaluation: { evaluation: number }) => {
        console.log('Evaluation submitted:', evaluation);
        setRound((prev) => Math.min(prev + 1, settings.numberOfRounds));
        setTimeRemaining(settings.roundDuration); // Reset timer for next round
    };

    const handleSettingsSave = (newSettings: typeof settings) => {
        setSettings(newSettings);
        console.log('Settings updated:', newSettings);
    };

    const handlePrevMove = () => {
        console.log('Previous move');
    };

    const handleNextMove = () => {
        console.log('Next move');
    };

    const handleFlipBoard = () => {
        console.log('Flip board');
    };

    const handleResetPosition = () => {
        console.log('Reset position');
    };

    if (showProfile) {
        return (
            <ProfilePage
                onClose={() => setShowProfile(false)}
                userData={userData}
            />
        );
    }

    if (showStats) {
        return (
            <StatsPage
                onClose={() => setShowStats(false)}
                stats={userData.stats}
                overallAccuracy={userData.stats.guessTheElo.averageAccuracy}
                currentStreak={userData.stats.guessTheElo.bestStreak}
                personalBestStreak={userData.stats.guessTheElo.bestStreak}
                avgGuessTime={30}
                highestGuessScore={userData.stats.guessTheElo.totalPoints}
                guessAccuracyData={[]}
                performanceData={[]}
                accuracyBreakdown={[]}
                trends={[]}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white relative">
            <BackgroundDots />
            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="mt-8">
                    <Card className="bg-gray-800 border-gray-700 overflow-hidden max-w-5xl w-full mx-auto">
                        <GameHeader
                            currentRound={round}
                            totalRounds={settings.numberOfRounds}
                            timeRemaining={timeRemaining}
                            title="Guess the Elo"
                        />
                        <CardContent className="p-4">
                            <GameLayout
                                leftPanel={
                                    <StockfishAnalysis
                                        position={game.fen()}
                                        depth={10}
                                        key={game.fen()}
                                    />
                                }
                                centerPanel={
                                    <ChessContainer>
                                        <ChessBoard position={game.fen()} onMove={handleMove} />
                                        <BoardControls
                                            onPrevMove={handlePrevMove}
                                            onNextMove={handleNextMove}
                                            onFlipBoard={handleFlipBoard}
                                            onReset={handleResetPosition}
                                            canGoPrev={false}
                                            canGoNext={false}
                                        />
                                    </ChessContainer>
                                }
                                rightPanel={
                                    <GuessPanel
                                        onSubmit={handleEvaluationSubmit}
                                        currentGuess={currentGuess}
                                        setCurrentGuess={setCurrentGuess}
                                        round={round}
                                    />
                                }
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={handleSettingsSave}
            />
        </div>
    );
}
