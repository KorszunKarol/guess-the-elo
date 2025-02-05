'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronUp, ChevronDown, Play, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { EngineSettings } from './EngineSettings';
import { useStockfishAnalysis } from '@/hooks/stockfish/useStockfishAnalysis';
import { Progress } from '@/components/ui/progress';

export default function StockfishEvaluation() {
    const [showSettings, setShowSettings] = useState(false);
    const {
        evaluation,
        bestLines,
        settings,
        updateSettings,
        getEvaluationColor,
        isAnalyzing,
        progress,
        startAnalysis,
        stopAnalysis,
    } = useStockfishAnalysis();

    const displayedLines = useMemo(() => {
        return bestLines.slice(0, settings.multiPV);
    }, [bestLines, settings.multiPV]);

    const getEvaluationPercentage = (eval_score: number) => {
        const clampedScore = Math.min(Math.max(eval_score, -8), 8);
        const percentage = ((clampedScore + 8) / 16) * 100;
        return percentage;
    };

    return (
        <Card className="w-full bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    Engine Analysis
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={isAnalyzing ? stopAnalysis : startAnalysis}
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        aria-label={
                            isAnalyzing ? 'Stop analysis' : 'Start analysis'
                        }
                    >
                        {isAnalyzing ? (
                            <Square className="h-4 w-4" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
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
                {isAnalyzing && (
                    <div className="space-y-2 mb-6">
                        {/* Tick marks above bar */}
                        <div className="w-full flex justify-between text-[10px] text-gray-500">
                            <span>-8.0</span>
                            <span className="text-blue-400">0.0</span>
                            <span>+8.0</span>
                        </div>

                        {/* Bar and pulse */}
                        <div className="relative w-full h-[2px]">
                            {/* Base bar */}
                            <div className="absolute w-full h-full bg-gray-800" />

                            {/* Pulse indicator */}
                            <motion.div
                                className="absolute w-2 h-2 rounded-full bg-blue-400"
                                style={{
                                    left: `${getEvaluationPercentage(evaluation)}%`,
                                    transform: 'translate(-50%, -25%)',
                                    boxShadow:
                                        '0 0 6px rgba(96, 165, 250, 0.6)',
                                }}
                                animate={{
                                    opacity: [0.7, 1, 0.7],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        </div>
                    </div>
                )}

                <Collapsible open={showSettings} onOpenChange={setShowSettings}>
                    <CollapsibleContent className="space-y-4 mb-4">
                        <EngineSettings
                            settings={settings}
                            onSettingsChange={updateSettings}
                        />
                    </CollapsibleContent>
                </Collapsible>

                <div className="space-y-4">
                    <motion.div
                        className="flex justify-center items-center"
                        initial={false}
                    >
                        <motion.div
                            className={`text-3xl font-bold ${getEvaluationColor(evaluation)}`}
                            key={evaluation}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {evaluation >= 0 ? '+' : ''}
                            {evaluation.toFixed(1)}
                        </motion.div>
                    </motion.div>

                    <div className="max-h-[200px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="space-y-2">
                            <AnimatePresence initial={false}>
                                {displayedLines.map((line, i) => (
                                    <motion.div
                                        key={i}
                                        className="relative overflow-hidden p-2.5 hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {/* Background glow on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="space-y-1.5">
                                            {/* Main move and eval */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-yellow-200/90 bg-yellow-200/10 px-2 py-0.5 rounded">
                                                        {line.move}
                                                    </span>
                                                    <span
                                                        className={`${getEvaluationColor(line.evaluation)} font-medium`}
                                                    >
                                                        {line.evaluation >= 0
                                                            ? '+'
                                                            : ''}
                                                        {line.evaluation.toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Move sequence with arrows */}
                                            <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                                {line.sequence.map(
                                                    (move, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="flex items-center"
                                                        >
                                                            {move}
                                                            {idx !==
                                                                line.sequence
                                                                    .length -
                                                                    1 && (
                                                                <svg
                                                                    className="h-3 w-3 text-gray-700 mx-0.5"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
