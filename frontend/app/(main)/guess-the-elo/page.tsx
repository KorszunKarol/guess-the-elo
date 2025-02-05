'use client';

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './components/ChessBoard';
import { EvaluationComponent } from './components/EvaluationComponent';
import { GameControls } from './components/GameControls';
import { Header } from './components/Header';
import { BackgroundDots } from './components/BackgroundDots';
import { generateRandomPosition } from './utils/chessUtils';
import { Card, CardContent } from '@/components/ui/card';
import { SettingsModal } from './components/SettingsModal';
import ProfilePage from './components/ProfilePage';
import StatsPage from './components/StatsPage';
import GameModeSwitcher from '@/app/components/GameModeSwitcher';

export default function GuessTheElo() {
    const [game, setGame] = useState<Chess | null>(null);
    const [turn, setTurn] = useState<'White' | 'Black'>('White');
    const [highScore, setHighScore] = useState(0);
    const [round, setRound] = useState(1);
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

    const handleSettingsClick = () => {
        setIsSettingsOpen(true);
    };

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
    };

    const handleSettingsSave = (newSettings: typeof settings) => {
        setSettings(newSettings);
        console.log('Settings updated:', newSettings);
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
                <Header
                    onProfileClick={() => setShowProfile(true)}
                    onSettingsClick={handleSettingsClick}
                    onStatsClick={() => setShowStats(true)}
                />
                <div className="flex justify-center mt-8">
                    <Card className="bg-gray-800 border-gray-700 overflow-hidden max-w-5xl w-full">
                        <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row justify-center items-start gap-4">
                                <div className="w-full lg:w-auto flex-shrink-0">
                                    {game && <ChessBoard game={game} />}
                                    <GameControls
                                        onPrevMove={() =>
                                            console.log('Previous move')
                                        }
                                        onNextMove={() =>
                                            console.log('Next move')
                                        }
                                        canGoPrev={false}
                                        canGoNext={false}
                                    />
                                </div>
                                <div className="w-full lg:w-96 flex-shrink-0">
                                    <EvaluationComponent
                                        onSubmit={handleEvaluationSubmit}
                                        turn={turn}
                                        highScore={highScore}
                                        round={round}
                                    />
                                </div>
                            </div>
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
