'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ChessEvaluationComponentProps {
    onSubmit: (evaluation: number) => void;
    currentMove: number;
    highScore: number;
    totalMoves: number;
    position: string; // FEN string
}

const PIECE_VALUES = {
    p: -1, P: 1,    // pawns
    n: -3, N: 3,    // knights
    b: -3, B: 3,    // bishops
    r: -5, R: 5,    // rooks
    q: -9, Q: 9,    // queens
};

// Step function for non-linear evaluation control
function getEvaluationStep(value: number): number {
    const absValue = Math.abs(value);
    if (absValue <= 500) return 2;     // Fine control up to ±500
    if (absValue < 1000) return 25;    // Larger steps for clear advantages
    return 100;                        // Coarse steps for winning positions
}

function calculateMaterial(fen: string): number {
    const position = fen.split(' ')[0];
    return position.split('').reduce((sum, char) => {
        return sum + (PIECE_VALUES[char as keyof typeof PIECE_VALUES] || 0);
    }, 0);
}

const formSchema = z.object({
    evaluation: z.string().transform((val) => {
        const num = Number(val);
        if (isNaN(num)) return 0;
        return Math.min(Math.max(num, -2000), 2000);
    }),
});

export default function ChessEvaluationComponent({
    onSubmit,
    currentMove,
    highScore,
    totalMoves,
    position,
}: ChessEvaluationComponentProps) {
    const [evaluation, setEvaluation] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            evaluation: "0",
        },
    });

    const materialAdvantage = useMemo(() => calculateMaterial(position), [position]);

    function handleEvaluationChange(newValue: number[]) {
        const value = newValue[0];
        const step = getEvaluationStep(value);
        const roundedValue = Math.round(value / step) * step;
        setEvaluation(roundedValue);
        form.setValue("evaluation", roundedValue.toString());
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        form.setValue("evaluation", value);
        const numValue = Number(value);
        if (!isNaN(numValue)) {
            const boundedValue = Math.min(Math.max(numValue, -2000), 2000);
            setEvaluation(boundedValue);
        }
    }

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
        <Card className="rounded-lg border text-card-foreground shadow-sm w-full h-full bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardContent className="h-full p-5">
                <div className="h-full flex flex-col space-y-5">
                    {/* Guess Section */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-300">
                                Your Guess:
                            </span>
                            <div className="flex items-center gap-2">
                                <Form {...form}>
                                    <FormField
                                        control={form.control}
                                        name="evaluation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        onChange={handleInputChange}
                                                        className="w-36 h-11 text-right text-lg font-medium
                                                                 bg-gray-800/80 border-gray-700/50
                                                                 focus:outline-none focus:ring-0 focus:border-gray-700/50
                                                                 rounded-lg px-4
                                                                 [appearance:textfield]
                                                                 [&::-webkit-outer-spin-button]:appearance-none
                                                                 [&::-webkit-inner-spin-button]:appearance-none"
                                                        min={-2000}
                                                        max={2000}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </Form>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg -m-1" />
                            <Slider
                                value={[evaluation]}
                                onValueChange={handleEvaluationChange}
                                min={-2000}
                                max={2000}
                                step={1}
                                className="mb-2"
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>-2000</span>
                            <span>-1000</span>
                            <span>0</span>
                            <span>1000</span>
                            <span>2000</span>
                        </div>
                    </div>

                    {/* Evaluation Section */}
                    <div className="flex flex-col items-center space-y-2 py-1">
                        <span className="text-sm font-medium text-gray-300">
                            Evaluation:
                        </span>
                        <motion.div
                            className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
                            key={getEvaluationCategory(evaluation)}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {evaluation >= 0 ? 'White ' : 'Black '}
                            {getEvaluationCategory(evaluation)}
                        </motion.div>
                        <div className="text-sm font-medium text-gray-400">
                            Material: {materialAdvantage > 0 ? '+' : ''}{materialAdvantage}
                        </div>
                    </div>

                    {/* Submit and Score Section */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleSubmit}
                            className="w-full h-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                                     shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30
                                     transition-all duration-300 font-semibold"
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

                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-300">
                                Score:
                            </span>
                            <span className="ml-2 text-base font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                                {highScore}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
