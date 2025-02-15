'use client';

import { useState, useMemo } from 'react';
import { Settings, Square, Play, Cpu, Power } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useStockfishAnalysis } from '@/hooks/stockfish/useStockfishAnalysis';
import { useEngineStore } from '@/stores/engineStore';
import { cn } from '@/lib/utils';

interface StockfishEvaluationProps {
    className?: string;
}

export default function StockfishEvaluation({ className }: StockfishEvaluationProps) {
    const [showSettings, setShowSettings] = useState(false);
    const {
        evaluation,
        bestLines,
        settings,
        updateSettings,
        getEvaluationColor,
        isAnalyzing,
        progress,
        error,
        startAnalysis,
        stopAnalysis,
    } = useStockfishAnalysis();

    const { isEngineEnabled, toggleEngine } = useEngineStore();

    const displayedLines = useMemo(() => {
        return bestLines.slice(0, settings.multiPV);
    }, [bestLines, settings.multiPV]);

    const getEvaluationPercentage = (evalScore: number) => {
        const clampedScore = Math.min(Math.max(evalScore, -8), 8);
        return ((clampedScore + 8) / 16) * 100;
    };

    return (
        <Card className={cn('w-full bg-gray-900/50 backdrop-blur-sm border-gray-800', className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    Engine Analysis
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={isAnalyzing ? stopAnalysis : startAnalysis}
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        aria-label={isAnalyzing ? 'Stop analysis' : 'Start analysis'}
                    >
                        {isAnalyzing ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleEngine()}
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        aria-label={isEngineEnabled ? 'Disable engine' : 'Enable engine'}
                    >
                        {isEngineEnabled ? <Cpu className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSettings(!showSettings)}
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        aria-label="Toggle engine settings"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {error && (
                    <div className="mb-4 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {isAnalyzing && (
                    <div className="space-y-2 mb-4">
                        <Progress value={progress} className="h-1" />
                        <div className="w-full flex justify-between text-[10px] text-gray-500">
                            <span>-8.0</span>
                            <span className="text-blue-400">0.0</span>
                            <span>+8.0</span>
                        </div>
                        <div className="relative w-full h-[2px] bg-gray-800">
                            <div
                                className="absolute w-2 h-2 rounded-full bg-blue-400"
                                style={{
                                    left: `${getEvaluationPercentage(evaluation)}%`,
                                    transform: 'translate(-50%, -25%)',
                                    transition: 'left 0.3s ease-out',
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex justify-center items-center">
                        <div className={cn('text-3xl font-bold', getEvaluationColor(evaluation))}>
                            {evaluation >= 0 ? '+' : ''}
                            {evaluation.toFixed(1)}
                        </div>
                    </div>

                    <div className="space-y-2">
                        {displayedLines.map((line, i) => (
                            <div
                                key={i}
                                className="p-2.5 hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                            >
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-yellow-200/90 bg-yellow-200/10 px-2 py-0.5 rounded">
                                                {line.move}
                                            </span>
                                            <span className={cn('font-medium', getEvaluationColor(line.evaluation))}>
                                                {line.evaluation >= 0 ? '+' : ''}
                                                {line.evaluation.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 flex flex-wrap items-center gap-1.5">
                                        {line.sequence.map((move, idx) => (
                                            <span key={idx} className="flex items-center">
                                                {move}
                                                {idx !== line.sequence.length - 1 && (
                                                    <span className="mx-0.5 text-gray-700">→</span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
