'use client';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface AnalysisStatsProps {
    isAnalyzing: boolean;
    isPaused: boolean;
    maxDepthReached: number;
    targetDepth: number;
    totalNodes: number;
    nodesPerSecond: string;
    progress: number;
    evaluation: number;
    isInfinite?: boolean;
}

export const AnalysisStats = ({
    isAnalyzing,
    isPaused,
    maxDepthReached,
    targetDepth,
    totalNodes,
    nodesPerSecond,
    progress,
    evaluation,
    isInfinite = false,
}: AnalysisStatsProps) => {
    const getEvaluationPercentage = (evalScore: number) => {
        const clampedScore = Math.min(Math.max(evalScore, -8), 8);
        return ((clampedScore + 8) / 16) * 100;
    };

    return (
        <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        isAnalyzing
                            ? (isPaused
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400 animate-pulse")
                            : (progress > 0
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-gray-500/20 text-gray-400")
                    )}>
                        {isAnalyzing
                            ? (isPaused ? "Paused" : "Analyzing")
                            : (progress > 0 ? "Complete" : "Idle")}
                    </span>

                    <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        isAnalyzing ? "bg-gray-800/70 text-gray-300" : "bg-gray-800/50 text-gray-400"
                    )}>
                        Depth: {maxDepthReached}{isInfinite ? "" : `/${targetDepth}`}
                    </span>
                </div>
            </div>

            {/* Progress bar with evaluation marker */}
            <div className="space-y-1">
                <Progress
                    value={isInfinite ? (maxDepthReached > 0 ? Math.min(maxDepthReached * 3, 100) : 0) : progress}
                    className={cn(
                        "h-1.5 rounded-full",
                        isAnalyzing && !isPaused ? "opacity-100" : "opacity-70"
                    )}
                />
                <div className="relative w-full h-[2px] bg-gray-800">
                    <div
                        className={cn(
                            "absolute w-2 h-2 rounded-full",
                            evaluation > 0 ? "bg-blue-400" : "bg-red-400"
                        )}
                        style={{
                            left: `${getEvaluationPercentage(evaluation)}%`,
                            transform: 'translate(-50%, -25%)',
                            transition: 'left 0.3s ease-out',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};