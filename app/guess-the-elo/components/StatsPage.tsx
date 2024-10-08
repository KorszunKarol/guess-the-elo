import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Target, TrendingUp, Clock, Brain } from "lucide-react"

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
  overallAccuracy: number;
  currentStreak: number;
  personalBestStreak: number;
  avgGuessTime: number;
  highestGuessScore: number;
  guessAccuracyData: ChartData[];
  performanceData: ChartData[];
  accuracyBreakdown: { range: string; accuracy: number }[];
  trends: { aspect: string; trend: string }[];
}

function StatCard({ icon: Icon, title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function GuessAccuracyChart({ data }: { data: ChartData[] }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Guess Accuracy by Elo Category</CardTitle>
        <CardDescription>Your accuracy in guessing Elo ratings across different skill levels</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              contentStyle={{ background: '#333', border: 'none' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="accuracy" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function PerformanceChart({ data }: { data: ChartData[] }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Weekly Performance</CardTitle>
        <CardDescription>Your guessing score over the past week</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Tooltip
              contentStyle={{ background: '#333', border: 'none' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default function StatsPage({
  overallAccuracy,
  currentStreak,
  personalBestStreak,
  avgGuessTime,
  highestGuessScore,
  guessAccuracyData,
  performanceData,
  accuracyBreakdown,
  trends
}: StatsPageProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-primary">Guess the Elo Statistics</h2>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Target} title="Overall Accuracy" value={`${overallAccuracy}%`} description={`${overallAccuracy > 70 ? 'Great job!' : 'Keep improving!'}`} />
            <StatCard icon={TrendingUp} title="Current Streak" value={currentStreak} description={`Personal best: ${personalBestStreak}`} />
            <StatCard icon={Clock} title="Avg. Guess Time" value={`${avgGuessTime}s`} description="Try to improve your speed" />
            <StatCard icon={Brain} title="Highest Guess Score" value={highestGuessScore} description="Can you beat it?" />
          </div>
          <GuessAccuracyChart data={guessAccuracyData} />
          <PerformanceChart data={performanceData} />
        </TabsContent>
        <TabsContent value="accuracy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accuracy Breakdown</CardTitle>
              <CardDescription>Your guessing accuracy for different Elo ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {accuracyBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.range}</span>
                    <span>{item.accuracy}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guessing Trends</CardTitle>
              <CardDescription>Your performance trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trends.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.aspect}</span>
                    <span>{item.trend}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}