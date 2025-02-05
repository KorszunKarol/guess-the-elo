import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {
    Target,
    TrendingUp,
    Clock,
    Brain,
    ChevronLeft,
    Star,
} from 'lucide-react';

interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: string | number;
    description: string;
}

interface ChartData {
    [key: string]: string | number;
}

interface StatsPageProps {
    onClose: () => void;
    stats: {
        guessTheElo: {
            gamesPlayed: number;
            averageAccuracy: number;
            averageError: number;
            totalPoints: number;
            bestAccuracy: number;
            averageTime: number;
            ratingDistribution: {
                beginner: number;
                intermediate: number;
                advanced: number;
                expert: number;
            };
        };
        guessTheEval: {
            gamesPlayed: number;
            averageAccuracy: number;
            averageCPL: number;
            totalPoints: number;
            bestAccuracy: number;
            averageTime: number;
            winningPositions: number;
            equalPositions: number;
            losingPositions: number;
        };
    };
}

function StatCard({ icon: Icon, title, value, description }: StatCardProps) {
    return (
        <Card className="bg-[#1a1b1e] border-[#2a2b2d]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
                <p className="text-xs text-gray-400">{description}</p>
            </CardContent>
        </Card>
    );
}

function ModeStats({
    stats,
    mode,
}: {
    stats: any;
    mode: 'guessTheElo' | 'guessTheEval';
}) {
    const data =
        mode === 'guessTheElo'
            ? Object.entries(stats[mode].ratingDistribution).map(
                  ([key, value]) => ({
                      category: key.charAt(0).toUpperCase() + key.slice(1),
                      accuracy: value,
                  })
              )
            : [];

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {mode === 'guessTheElo' ? (
                    <>
                        <StatCard
                            icon={Target}
                            title="Accuracy"
                            value={`${stats[mode].averageAccuracy}%`}
                            description="Average guess accuracy"
                        />
                        <StatCard
                            icon={Clock}
                            title="Games Played"
                            value={stats[mode].gamesPlayed}
                            description="Total games completed"
                        />
                        <StatCard
                            icon={Brain}
                            title="Average Error"
                            value={`±${stats[mode].averageError || 0}`}
                            description="Average Elo difference"
                        />
                        <StatCard
                            icon={TrendingUp}
                            title="Total Points"
                            value={stats[mode].totalPoints}
                            description="Cumulative score"
                        />
                        <StatCard
                            icon={Star}
                            title="Best Accuracy"
                            value={`${stats[mode].bestAccuracy}%`}
                            description="Highest accuracy achieved"
                        />
                        <StatCard
                            icon={Clock}
                            title="Average Time"
                            value={`${stats[mode].averageTime}s`}
                            description="Average time per guess"
                        />
                    </>
                ) : (
                    <>
                        <StatCard
                            icon={Target}
                            title="Accuracy"
                            value={`${stats[mode].averageAccuracy}%`}
                            description="Average evaluation accuracy"
                        />
                        <StatCard
                            icon={Clock}
                            title="Games Played"
                            value={stats[mode].gamesPlayed}
                            description="Total positions evaluated"
                        />
                        <StatCard
                            icon={Brain}
                            title="Average CPL"
                            value={stats[mode].averageCPL || 0}
                            description="Centipawn loss average"
                        />
                        <StatCard
                            icon={TrendingUp}
                            title="Total Points"
                            value={stats[mode].totalPoints}
                            description="Cumulative score"
                        />
                        <StatCard
                            icon={Star}
                            title="Best Accuracy"
                            value={`${stats[mode].bestAccuracy}%`}
                            description="Highest accuracy achieved"
                        />
                        <StatCard
                            icon={Clock}
                            title="Average Time"
                            value={`${stats[mode].averageTime}s`}
                            description="Average time per evaluation"
                        />
                    </>
                )}
            </div>

            {mode === 'guessTheElo' ? (
                <Card className="bg-[#1a1b1e] border-[#2a2b2d]">
                    <CardHeader>
                        <CardTitle className="text-gray-200">
                            Rating Distribution
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Your accuracy across different rating ranges
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis
                                    dataKey="category"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: '#2a2b2d',
                                        border: 'none',
                                    }}
                                    labelStyle={{ color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar
                                    dataKey="accuracy"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-[#1a1b1e] border-[#2a2b2d]">
                    <CardHeader>
                        <CardTitle className="text-gray-200">
                            Position Type Accuracy
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Your accuracy based on position evaluation
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    {
                                        category: 'Winning',
                                        accuracy:
                                            stats.guessTheEval.winningPositions,
                                    },
                                    {
                                        category: 'Equal',
                                        accuracy:
                                            stats.guessTheEval.equalPositions,
                                    },
                                    {
                                        category: 'Losing',
                                        accuracy:
                                            stats.guessTheEval.losingPositions,
                                    },
                                ]}
                            >
                                <XAxis
                                    dataKey="category"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: '#2a2b2d',
                                        border: 'none',
                                    }}
                                    labelStyle={{ color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar
                                    dataKey="accuracy"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default function StatsPage({ onClose, stats }: StatsPageProps) {
    return (
        <div className="min-h-screen bg-[#121316] text-white p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                        onClick={onClose}
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold">Statistics</h1>
                </div>

                <Tabs defaultValue="guessTheElo" className="space-y-6">
                    <TabsList className="bg-[#1a1b1e] border-[#2a2b2d]">
                        <TabsTrigger
                            value="guessTheElo"
                            className="data-[state=active]:bg-[#2a2b2d]"
                        >
                            Guess the Elo
                        </TabsTrigger>
                        <TabsTrigger
                            value="guessTheEval"
                            className="data-[state=active]:bg-[#2a2b2d]"
                        >
                            Guess the Eval
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="guessTheElo">
                        <ModeStats stats={stats} mode="guessTheElo" />
                    </TabsContent>

                    <TabsContent value="guessTheEval">
                        <ModeStats stats={stats} mode="guessTheEval" />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
