'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChessEvaluationComponentProps {
    onSubmit: (evaluation: number) => void;
    currentMove: number;
    highScore: number;
    totalMoves: number;
    className?: string;
}

export default function ChessEvaluationComponent({
    onSubmit,
    currentMove,
    highScore,
    totalMoves,
    className,
}: ChessEvaluationComponentProps) {
    const [evaluation, setEvaluation] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHint, setShowHint] = useState(false);

    function handleSubmit() {
        setIsSubmitting(true);
        onSubmit(evaluation);
        setTimeout(() => setIsSubmitting(false), 1000);
    }

    function getEvaluationCategory(value: number) {
        const absValue = Math.abs(value);
        if (absValue < 100) return 'Equal';
        if (absValue < 300) return 'Slight Advantage';
        if (absValue < 500) return 'Clear Advantage';
        if (absValue < 900) return 'Winning';
        return 'Decisive';
    }

    return (
        <Card className={cn(
            "w-full h-full bg-gray-900/50 backdrop-blur-sm border-gray-800",
            className
        )}>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-gray-200">
                            Current Move:
                        </span>
                        <span className="text-base font-bold text-yellow-200">
                            {currentMove}
                        </span>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-300">
                                Your Guess:
                            </span>
                            <span className="text-base font-bold text-blue-400">
                                {evaluation}
                            </span>
                        </div>
                        <Slider
                            value={[evaluation]}
                            onValueChange={([value]) => setEvaluation(value)}
                            min={-2000}
                            max={2000}
                            step={10}
                            className="mb-2"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>-2000</span>
                            <span>-1000</span>
                            <span>0</span>
                            <span>1000</span>
                            <span>2000</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-sm font-medium text-gray-300">
                            Evaluation:
                        </span>
                        <motion.div
                            className="text-base font-bold text-green-400 mt-1"
                            key={getEvaluationCategory(evaluation)}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {evaluation >= 0 ? 'White' : 'Black'}{' '}
                            {getEvaluationCategory(evaluation)}
                        </motion.div>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <motion.div
                                className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        ) : (
                            'Submit Guess'
                        )}
                    </Button>
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-sm font-medium text-gray-300">
                                High Score:
                            </span>
                            <span className="ml-2 text-base font-bold text-yellow-400">
                                {highScore}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-300">
                                Move:
                            </span>
                            <span className="ml-2 text-base font-bold text-blue-400">
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
                                className="mt-2 text-sm text-gray-400"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                Consider factors like material balance, piece
                                activity, king safety, and pawn structure when
                                evaluating the position.
                            </motion.div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
