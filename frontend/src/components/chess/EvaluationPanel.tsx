'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface EvaluationPanelProps {
    currentMove: number;
    totalMoves: number;
    highScore: number;
}

export function EvaluationPanel({
    currentMove,
    totalMoves,
    highScore,
}: EvaluationPanelProps) {
    const [evaluation, setEvaluation] = useState(1500);
    const [showHint, setShowHint] = useState(false);

    return (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-blue-400">
                        Evaluate the Position
                    </h2>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Turn:</span>
                            <span className="text-yellow-400">White</span>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">
                                    Your Evaluation:
                                </span>
                                <span className="text-base font-bold text-blue-400">
                                    {evaluation}
                                </span>
                            </div>
                            <Slider
                                value={[evaluation]}
                                onValueChange={([value]) =>
                                    setEvaluation(value)
                                }
                                min={0}
                                max={3000}
                                step={100}
                                className="mb-2"
                            />
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Beginner</span>
                                <span>Intermediate</span>
                                <span>Advanced</span>
                                <span>Expert</span>
                                <span>Master</span>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <span className="text-sm text-gray-400">
                                Category:
                            </span>
                            <div className="text-green-400 font-semibold mt-1">
                                {evaluation >= 2200
                                    ? 'Master'
                                    : evaluation >= 1800
                                      ? 'Expert'
                                      : evaluation >= 1500
                                        ? 'Advanced'
                                        : evaluation >= 1200
                                          ? 'Intermediate'
                                          : 'Beginner'}
                            </div>
                        </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90">
                        Submit Evaluation
                    </Button>

                    <div className="flex justify-between text-sm">
                        <div>
                            <span className="text-gray-400">High Score:</span>
                            <span className="ml-2 text-yellow-400">
                                {highScore}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400">Round:</span>
                            <span className="ml-2 text-blue-400">
                                {currentMove}/{totalMoves}
                            </span>
                        </div>
                    </div>

                    <div>
                        <Button
                            variant="ghost"
                            className="w-full text-gray-400 hover:text-white"
                            onClick={() => setShowHint(!showHint)}
                        >
                            {showHint ? 'Hide Hint' : 'Show Hint'}
                            {showHint ? (
                                <ChevronUp className="ml-2 h-4 w-4" />
                            ) : (
                                <ChevronDown className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                        {showHint && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 text-sm text-gray-400"
                            >
                                Look for piece positioning, control of the
                                center, and pawn structure to help gauge the
                                skill level.
                            </motion.div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
