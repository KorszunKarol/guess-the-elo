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

                    {/* Show depth info */}
                    <span className={cn(
                        "text-xs bg-gray-800/50 px-2 py-0.5 rounded-full",
                        isAnalyzing ? "text-gray-300" : "text-gray-500"
                    )}>
                        Depth: {maxDepthReached}/{targetDepth}
                    </span>
                </div>

                {/* Show nodes info */}
                <div className="text-xs text-gray-400">
                    <span className="bg-gray-800/50 px-2 py-0.5 rounded-full">
                        {totalNodes.toLocaleString()} nodes
                    </span>
                    {isAnalyzing && !isPaused && (
                        <span className="ml-1 text-green-400">
                            ({nodesPerSecond}/s)
                        </span>
                    )}
                </div>
            </div>

            {/* Progress bar with evaluation marker */}
            <div className="space-y-1">
                <Progress
                    value={progress}
                    className={cn(
                        "h-1.5 rounded-full",
                        isAnalyzing && !isPaused ? "opacity-100" : "opacity-70"
                    )}
                />
                <div className="w-full flex justify-between text-[10px] text-gray-500">
                    <span>-8.0</span>
                    <span className="text-blue-400">0.0</span>
                    <span>+8.0</span>
                </div>
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