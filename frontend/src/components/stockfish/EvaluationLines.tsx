'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { StockfishLine } from '@/types/stockfish';
import { EvaluationItem } from './EvaluationItem';

interface EvaluationLinesProps {
    displayedLines: StockfishLine[];
    getEvaluationColor: (value: number) => string;
}

export const EvaluationLines = ({
    displayedLines,
    getEvaluationColor,
}: EvaluationLinesProps) => {
    // Get the main evaluation from the first line
    const mainEvaluation = useMemo(() => {
        if (displayedLines.length === 0) return null;
        return {
            score: displayedLines[0].evaluation,
            text: displayedLines[0].evaluationText,
            bestMove: displayedLines[0].move,
        };
    }, [displayedLines]);

    return (
        <div className="space-y-4">
            <div className="flex justify-center items-center">
                <div
                    className={cn(
                        'text-3xl font-bold flex items-center justify-center',
                        getEvaluationColor(mainEvaluation?.score || 0)
                    )}
                >
                    {/* Show evaluation with appropriate formatting */}
                    {mainEvaluation ? (
                        <div className="flex flex-col items-center">
                            <span>{mainEvaluation.text}</span>
                            {mainEvaluation.bestMove && (
                                <span className="text-sm font-medium text-yellow-200/90 bg-yellow-200/10 px-2 py-0.5 rounded mt-1">
                                    Best: {mainEvaluation.bestMove}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span>0.00</span>
                    )}
                </div>
            </div>

            {/* Only show lines if we have any */}
            {displayedLines.length > 0 && (
                <div className="space-y-2">
                    {displayedLines.map((line, i) => (
                        <EvaluationItem
                            key={i}
                            line={line}
                            getEvaluationColor={getEvaluationColor}
                            onSelect={() => console.log('Selected line:', line)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};