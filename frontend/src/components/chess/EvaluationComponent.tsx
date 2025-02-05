'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface EvaluationComponentProps {
    onSubmit: (evaluation: { evaluation: number }) => void;
    turn: 'White' | 'Black';
    highScore: number;
    round: number;
}

function EvaluationComponent({
    onSubmit,
    turn,
    highScore,
    round,
}: EvaluationComponentProps) {
    const [evaluation, setEvaluation] = useState(1500);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHint, setShowHint] = useState(false);

    function handleSubmit() {
        setIsSubmitting(true);
        onSubmit({ evaluation });
        setTimeout(() => setIsSubmitting(false), 1000);
    }

    function getEloCategory(elo: number) {
        if (elo < 1200) return 'Beginner';
        if (elo < 1400) return 'Intermediate';
        if (elo < 1600) return 'Advanced';
        if (elo < 1800) return 'Expert';
        if (elo < 2000) return 'Master';
        return 'Grandmaster';
    }

    return (
        <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-xl">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    Evaluate the Position
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-gray-200">
                            Turn:
                        </span>
                        <span
                            className={`text-base font-bold ${turn === 'White' ? 'text-yellow-200' : 'text-gray-800'}`}
                        >
                            {turn}
                        </span>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-300">
                                Your Evaluation:
                            </span>
                            <span className="text-base font-bold text-blue-400">
                                {evaluation}
                            </span>
                        </div>
                        <Slider
                            value={[evaluation]}
                            onValueChange={([value]) => setEvaluation(value)}
                            max={3000}
                            step={10}
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
                    <div className="text-center">
                        <span className="text-sm font-medium text-gray-300">
                            Category:
                        </span>
                        <motion.div
                            className="text-base font-bold text-green-400 mt-1"
                            key={getEloCategory(evaluation)}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {getEloCategory(evaluation)}
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
                            'Submit Evaluation'
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
                                Round:
                            </span>
                            <span className="ml-2 text-base font-bold text-blue-400">
                                {round}/5
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

export { EvaluationComponent };
