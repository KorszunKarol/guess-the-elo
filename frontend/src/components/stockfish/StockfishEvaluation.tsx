'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { Settings, Square, Play, Cpu, Power, Pause, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useStockfishAnalysis } from '@/hooks/stockfish/useStockfishAnalysis';
import { useEngineStore } from '@/stores/engineStore';
import { cn } from '@/lib/utils';
import type { StockfishLine } from '@/types/stockfish';

interface StockfishEvaluationProps {
    className?: string;
}

// Add utility to format move sequence with numbers
const formatMoveSequence = (moves: string[]): ReactNode[] => {
    return moves.map((move, idx) => {
        const moveNumber = Math.floor(idx / 2) + 1;
        const isWhiteMove = idx % 2 === 0;

        return (
            <span key={idx} className="inline-flex items-center">
                {isWhiteMove && (
                    <span className="text-gray-600 mr-1 select-none">{moveNumber}.</span>
                )}
                <span className={cn(
                    "font-medium",
                    isWhiteMove ? "text-blue-300/90" : "text-red-300/90"
                )}>
                    {move}
                </span>
                {idx !== moves.length - 1 && (
                    <span className="mx-1.5 text-gray-700 select-none">
                        {isWhiteMove ? "" : " "}
                    </span>
                )}
            </span>
        );
    });
};

interface EvaluationItemProps {
    line: StockfishLine;
    getEvaluationColor: (value: number) => string;
    onSelect?: () => void;
}

const EvaluationItem = ({ line, getEvaluationColor, onSelect }: EvaluationItemProps) => {
    return (
        <div
            className="p-2.5 hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
            onClick={onSelect}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect?.()}
        >
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-yellow-200/90 bg-yellow-200/10 px-2 py-0.5 rounded">
                            {line.move}
                        </span>
                        <span className={cn('font-medium', getEvaluationColor(line.evaluation))}>
                            {line.evaluationText}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500">
                        {`Depth ${line.depth} • ${(parseInt(line.time) / 1000).toFixed(1)}s • ${parseInt(line.nodes).toLocaleString()} nodes`}
                    </div>
                </div>
                <div className="text-xs leading-relaxed font-mono">
                    {formatMoveSequence(line.sequence)}
                </div>
            </div>
        </div>
    );
};

export default function StockfishEvaluation({ className }: StockfishEvaluationProps) {
    const [showSettings, setShowSettings] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const {
        evaluation,
        bestLines,
        settings,
        updateSettings,
        getEvaluationColor,
        isAnalyzing,
        isPaused,
        progress,
        error,
        startAnalysis,
        stopAnalysis,
        pauseAnalysis,
        resumeAnalysis,
        analysisLogs,
        engineReady
    } = useStockfishAnalysis();

    const { isEngineEnabled, toggleEngine } = useEngineStore();

    const displayedLines = useMemo(() => {
        return bestLines.slice(0, settings.multiPV);
    }, [bestLines, settings.multiPV]);

    const getEvaluationPercentage = (evalScore: number) => {
        const clampedScore = Math.min(Math.max(evalScore, -8), 8);
        return ((clampedScore + 8) / 16) * 100;
    };

    // Get the highest depth reached
    const maxDepthReached = useMemo(() => {
        if (displayedLines.length === 0) return 0;
        return Math.max(...displayedLines.map(line => line.depth));
    }, [displayedLines]);

    // Get total nodes searched
    const totalNodes = useMemo(() => {
        if (displayedLines.length === 0) return 0;
        // Use the first line's nodes as it typically has the total
        return parseInt(displayedLines[0]?.nodes || '0');
    }, [displayedLines]);

    // Format nodes per second
    const formatNps = (nodes: number, time: number): string => {
        if (time <= 0) return '0';
        const nps = Math.round(nodes / (time / 1000));
        return nps.toLocaleString();
    };

    // Calculate NPS
    const nodesPerSecond = useMemo(() => {
        if (displayedLines.length === 0) return '0';
        const time = parseInt(displayedLines[0]?.time || '0');
        return formatNps(totalNodes, time);
    }, [displayedLines, totalNodes]);

    return (
        <Card className={cn('w-full bg-gray-900/50 backdrop-blur-sm border-gray-800', className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    Engine Analysis
                </CardTitle>
                <div className="flex items-center gap-2">
                    {/* Single unified control button that changes based on state */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            if (!isAnalyzing) {
                                startAnalysis();
                            } else if (isPaused) {
                                resumeAnalysis();
                            } else {
                                pauseAnalysis();
                            }
                        }}
                        className={cn(
                            "h-8 w-8 hover:text-white relative",
                            !engineReady ? "text-gray-600" :
                            isAnalyzing
                                ? (isPaused ? "text-yellow-400" : "text-green-400")
                                : "text-gray-400"
                        )}
                        aria-label={
                            !isAnalyzing
                                ? "Start analysis"
                                : (isPaused ? "Resume analysis" : "Pause analysis")
                        }
                        disabled={!engineReady}
                    >
                        {!isAnalyzing && <Play className="h-4 w-4" />}
                        {isAnalyzing && !isPaused && <Pause className="h-4 w-4" />}
                        {isAnalyzing && isPaused && <Play className="h-4 w-4" />}
                    </Button>

                    {/* Engine toggle button with clear on/off state */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            // If turning off, make sure to stop analysis
                            if (isEngineEnabled && isAnalyzing) {
                                stopAnalysis();
                            }
                            toggleEngine();
                        }}
                        className={cn(
                            "h-8 w-8 hover:text-white",
                            isEngineEnabled ? "text-green-400" : "text-gray-400"
                        )}
                        aria-label={isEngineEnabled ? 'Disable engine' : 'Enable engine'}
                    >
                        {isEngineEnabled ? <Cpu className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                    </Button>

                    {/* Settings button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setShowSettings(!showSettings);
                            setShowLogs(false); // Close logs when opening settings
                        }}
                        className={cn(
                            "h-8 w-8 hover:text-white",
                            showSettings ? "text-blue-400" : "text-gray-400"
                        )}
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

                {!engineReady && (
                    <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm">
                        Engine is initializing...
                    </div>
                )}

                {(isAnalyzing || progress > 0) && (
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    isAnalyzing
                                        ? (isPaused
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "bg-green-500/20 text-green-400 animate-pulse")
                                        : "bg-blue-500/20 text-blue-400"
                                )}>
                                    {isAnalyzing
                                        ? (isPaused ? "Paused" : "Analyzing")
                                        : "Complete"}
                                </span>

                                {/* Show depth info */}
                                <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded-full">
                                    Depth: {maxDepthReached}/{settings.depth}
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
                )}

                {showSettings && (
                    <div className="mb-4 p-3 bg-gray-800/50 rounded-lg space-y-3">
                        <h3 className="text-sm font-medium text-gray-300 mb-2">Engine Settings</h3>

                        {/* Main toggles */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-xs text-gray-300 font-medium">Continuous Analysis</label>
                                    <p className="text-xs text-gray-500">Engine keeps analyzing and improving evaluation</p>
                                </div>
                                <div
                                    className={cn(
                                        "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                                        settings.continuous ? "bg-green-500" : "bg-gray-600"
                                    )}
                                    onClick={() => updateSettings({ continuous: !settings.continuous })}
                                    role="checkbox"
                                    aria-checked={settings.continuous}
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && updateSettings({ continuous: !settings.continuous })}
                                >
                                    <div
                                        className={cn(
                                            "absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform",
                                            settings.continuous ? "translate-x-5" : "translate-x-0.5"
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-xs text-gray-300 font-medium">Auto-Analyze Position</label>
                                    <p className="text-xs text-gray-500">Automatically analyze when position changes</p>
                                </div>
                                <div
                                    className={cn(
                                        "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                                        settings.autoAnalysis ? "bg-green-500" : "bg-gray-600"
                                    )}
                                    onClick={() => updateSettings({ autoAnalysis: !settings.autoAnalysis })}
                                    role="checkbox"
                                    aria-checked={settings.autoAnalysis}
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && updateSettings({ autoAnalysis: !settings.autoAnalysis })}
                                >
                                    <div
                                        className={cn(
                                            "absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform",
                                            settings.autoAnalysis ? "translate-x-5" : "translate-x-0.5"
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Numeric settings */}
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-700">
                            <div>
                                <label className="text-xs text-gray-300 font-medium block mb-1">Analysis Depth</label>
                                <select
                                    className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm"
                                    value={settings.depth}
                                    onChange={(e) => updateSettings({ depth: parseInt(e.target.value) })}
                                >
                                    {[10, 15, 20, 25, 30].map((depth) => (
                                        <option key={depth} value={depth}>
                                            {depth}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Higher depth = better analysis but slower</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-300 font-medium block mb-1">Lines to Show</label>
                                <select
                                    className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm"
                                    value={settings.multiPV}
                                    onChange={(e) => updateSettings({ multiPV: parseInt(e.target.value) })}
                                >
                                    {[1, 2, 3].map((pv) => (
                                        <option key={pv} value={pv}>
                                            {pv} {pv === 1 ? 'line' : 'lines'}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Number of alternative moves to analyze</p>
                            </div>
                        </div>
                    </div>
                )}

                {showLogs && analysisLogs.length > 0 && (
                    <div className="mb-4 p-2 bg-gray-800/50 rounded-lg">
                        <div className="text-xs text-gray-400 font-mono max-h-24 overflow-y-auto">
                            {analysisLogs.map((log, i) => (
                                <div key={i} className="py-0.5">
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex justify-center items-center">
                        <div
                            className={cn(
                                'text-3xl font-bold flex items-center justify-center',
                                getEvaluationColor(evaluation)
                            )}
                        >
                            {/* Show evaluation with appropriate formatting */}
                            {displayedLines.length > 0 ? (
                                <div className="flex flex-col items-center">
                                    <span>{displayedLines[0]?.evaluationText}</span>
                                    {displayedLines[0]?.move && (
                                        <span className="text-sm font-medium text-yellow-200/90 bg-yellow-200/10 px-2 py-0.5 rounded mt-1">
                                            Best: {displayedLines[0]?.move}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span>{(evaluation >= 0 ? '+' : '') + evaluation.toFixed(2)}</span>
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
            </CardContent>
        </Card>
    );
}
