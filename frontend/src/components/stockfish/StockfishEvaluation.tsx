'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useStockfishAnalysis } from '@/hooks/stockfish/useStockfishAnalysis';
import { EvaluationHeader } from './EvaluationHeader';
import { AnalysisStatus } from './AnalysisStatus';
import { AnalysisStats } from './AnalysisStats';
import { SettingsPanel } from './SettingsPanel';
import { EvaluationLines } from './EvaluationLines';

interface StockfishEvaluationProps {
    className?: string;
}

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
        toggleAnalysis,
        analysisLogs,
        engineReady
    } = useStockfishAnalysis();

    const displayedLines = useMemo(() => {
        return bestLines.slice(0, settings.multiPV);
    }, [bestLines, settings.multiPV]);

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

    const handleToggleSettings = () => {
        setShowSettings(!showSettings);
        setShowLogs(false); // Close logs when opening settings
    };

    return (
        <Card className={cn('w-full bg-gray-900/50 backdrop-blur-sm border-gray-800', className)}>
            <EvaluationHeader
                isAnalyzing={isAnalyzing}
                engineReady={engineReady}
                showSettings={showSettings}
                onToggleAnalysis={toggleAnalysis}
                onToggleSettings={handleToggleSettings}
            />

            <CardContent>
                <AnalysisStatus
                    error={error}
                    engineReady={engineReady}
                />

                {(isAnalyzing || progress > 0) && (
                    <AnalysisStats
                        isAnalyzing={isAnalyzing}
                        isPaused={isPaused}
                        maxDepthReached={maxDepthReached}
                        targetDepth={settings.depth}
                        totalNodes={totalNodes}
                        nodesPerSecond={nodesPerSecond}
                        progress={progress}
                        evaluation={evaluation}
                        isInfinite={settings.isInfinite}
                    />
                )}

                {showSettings && (
                    <SettingsPanel
                        settings={settings}
                        onUpdateSettings={updateSettings}
                    />
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

                <EvaluationLines
                    displayedLines={displayedLines}
                    getEvaluationColor={getEvaluationColor}
                />
            </CardContent>
        </Card>
    );
}
