'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Trophy,
    Activity,
    Settings,
    ChevronLeft,
    Crown,
    Target,
    Brain,
    Zap,
    ChessKnight,
    Flame,
    Star,
    Calendar,
    Clock,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';

interface UserStats {
    guessTheElo: {
        gamesPlayed: number;
        averageAccuracy: number; // How close their guesses are to actual Elo (percentage)
        bestStreak: number; // Longest streak of guesses within acceptable range
        totalPoints: number; // Cumulative points from all games
        ratingDistribution: {
            // Success rate for different rating ranges
            beginner: number; // <1200
            intermediate: number; // 1200-1600
            advanced: number; // 1600-2000
            expert: number; // >2000
        };
    };
    guessTheEval: {
        gamesPlayed: number;
        averageAccuracy: number; // How close their guesses are to engine eval
        bestStreak: number;
        totalPoints: number;
        positionTypes: {
            // Success rate for different position types
            tactical: number; // Sharp tactical positions
            strategic: number; // Quiet strategic positions
            endgame: number; // Endgame positions
            opening: number; // Opening positions
        };
    };
    overall: {
        totalGamesPlayed: number;
        rank: string; // Based on total points (e.g., "Master Detective", "Novice Analyst")
        joinedDate: string;
        lastPlayed: string;
    };
}

interface ProfilePageProps {
    onClose: () => void;
    userData: {
        name: string;
        email: string;
        subscription: string;
        subscriptionPrice: string;
        achievements: string[];
        stats: UserStats;
    };
}

export default function ProfilePage({ onClose, userData }: ProfilePageProps) {
    return (
        <div className="min-h-screen bg-[#0f1011] text-white">
            <div className="max-w-[1200px] mx-auto p-6">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold ml-4">
                        Profile Dashboard
                    </h1>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Profile Info */}
                    <div className="col-span-12 lg:col-span-3">
                        <Card className="bg-[#1a1b1e] border-[#2a2b2d]">
                            <CardHeader>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                                        {userData.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {userData.name}
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            {userData.email}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-[#141516] rounded-lg">
                                        <span className="text-gray-400">
                                            Subscription
                                        </span>
                                        <span className="flex items-center">
                                            <Crown className="h-4 w-4 text-yellow-500 mr-2" />
                                            {userData.subscription}
                                        </span>
                                    </div>
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        Upgrade Plan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Middle Column - Stats */}
                    <div className="col-span-12 lg:col-span-6">
                        <Tabs defaultValue="overall" className="w-full">
                            <TabsList className="w-full grid grid-cols-3 bg-[#1a1b1e] p-1 rounded-lg mb-6">
                                <TabsTrigger
                                    value="overall"
                                    className="data-[state=active]:bg-[#141516] data-[state=active]:text-white"
                                >
                                    Overall
                                </TabsTrigger>
                                <TabsTrigger
                                    value="guessElo"
                                    className="data-[state=active]:bg-[#141516] data-[state=active]:text-white"
                                >
                                    Guess the Elo
                                </TabsTrigger>
                                <TabsTrigger
                                    value="guessEval"
                                    className="data-[state=active]:bg-[#141516] data-[state=active]:text-white"
                                >
                                    Guess the Eval
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overall">
                                <Card className="bg-[#1a1b1e] border-[#2a2b2d]">
                                    <CardHeader>
                                        <CardTitle>
                                            Overall Statistics
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Your combined performance across all
                                            modes
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <StatCard
                                                title="Total Games"
                                                value={
                                                    userData.stats.overall
                                                        .totalGamesPlayed
                                                }
                                                icon={
                                                    <Activity className="h-4 w-4 text-blue-500" />
                                                }
                                            />
                                            <StatCard
                                                title="Rank"
                                                value={
                                                    userData.stats.overall.rank
                                                }
                                                icon={
                                                    <Crown className="h-4 w-4 text-yellow-500" />
                                                }
                                            />
                                            <StatCard
                                                title="Member Since"
                                                value={new Date(
                                                    userData.stats.overall.joinedDate
                                                ).toLocaleDateString()}
                                                icon={
                                                    <Calendar className="h-4 w-4 text-green-500" />
                                                }
                                            />
                                            <StatCard
                                                title="Last Active"
                                                value={new Date(
                                                    userData.stats.overall.lastPlayed
                                                ).toLocaleDateString()}
                                                icon={
                                                    <Clock className="h-4 w-4 text-purple-500" />
                                                }
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="guessElo">
                                <Card className="bg-[#1a1b1e] border-[#2a2b2d]">
                                    <CardHeader>
                                        <CardTitle>
                                            Guess the Elo Stats
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">
                                            Your rating prediction performance
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <StatCard
                                                    title="Games Played"
                                                    value={
                                                        userData.stats
                                                            .guessTheElo
                                                            .gamesPlayed
                                                    }
                                                    icon={
                                                        <ChessKnight className="h-4 w-4 text-blue-500" />
                                                    }
                                                />
                                                <StatCard
                                                    title="Accuracy"
                                                    value={`${userData.stats.guessTheElo.averageAccuracy}%`}
                                                    icon={
                                                        <Target className="h-4 w-4 text-green-500" />
                                                    }
                                                />
                                                <StatCard
                                                    title="Best Streak"
                                                    value={
                                                        userData.stats
                                                            .guessTheElo
                                                            .bestStreak
                                                    }
                                                    icon={
                                                        <Flame className="h-4 w-4 text-orange-500" />
                                                    }
                                                />
                                                <StatCard
                                                    title="Total Points"
                                                    value={
                                                        userData.stats
                                                            .guessTheElo
                                                            .totalPoints
                                                    }
                                                    icon={
                                                        <Star className="h-4 w-4 text-yellow-500" />
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium mb-3">
                                                    Rating Range Performance
                                                </h4>
                                                <div className="space-y-2">
                                                    <ProgressStat
                                                        label="Beginner (<1200)"
                                                        value={
                                                            userData.stats
                                                                .guessTheElo
                                                                .ratingDistribution
                                                                .beginner
                                                        }
                                                    />
                                                    <ProgressStat
                                                        label="Intermediate (1200-1600)"
                                                        value={
                                                            userData.stats
                                                                .guessTheElo
                                                                .ratingDistribution
                                                                .intermediate
                                                        }
                                                    />
                                                    <ProgressStat
                                                        label="Advanced (1600-2000)"
                                                        value={
                                                            userData.stats
                                                                .guessTheElo
                                                                .ratingDistribution
                                                                .advanced
                                                        }
                                                    />
                                                    <ProgressStat
                                                        label="Expert (>2000)"
                                                        value={
                                                            userData.stats
                                                                .guessTheElo
                                                                .ratingDistribution
                                                                .expert
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="guessEval">
                                {/* Similar structure for Guess the Eval stats */}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Column - Achievements */}
                    <div className="col-span-12 lg:col-span-3">
                        <Card className="bg-[#1a1b1e] border-[#2a2b2d]">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                                    Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {userData.achievements.map(
                                        (achievement, index) => (
                                            <HoverCard key={index}>
                                                <HoverCardTrigger asChild>
                                                    <div className="flex items-center p-3 bg-[#141516] rounded-lg cursor-pointer hover:bg-[#1e1f21] transition-colors">
                                                        <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                                                        {achievement}
                                                    </div>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="bg-[#1a1b1e] border-[#2a2b2d]">
                                                    <div className="text-sm">
                                                        Achievement details and
                                                        progress could go here
                                                    </div>
                                                </HoverCardContent>
                                            </HoverCard>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}) {
    return (
        <div className="bg-[#141516] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{title}</span>
                {icon}
            </div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    );
}

function ProgressStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-300">{value}%</span>
            </div>
            <Progress value={value} className="h-2" />
        </div>
    );
}
