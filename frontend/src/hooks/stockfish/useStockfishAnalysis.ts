'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { StockfishLine, EngineSettings } from '@/types/stockfish';
import { useEngineStore } from '@/stores/engineStore';

// Create selectors outside component to prevent recreation
const selectCurrentFen = (state: any) => state.currentFen;
const selectIsEngineEnabled = (state: any) => state.isEngineEnabled;
const selectSettings = (state: any) => state.settings;
const selectUpdateSettings = (state: any) => state.updateSettings;

export const useStockfishAnalysis = () => {
    // Debug flag - set to false to disable debug logging
    const DEBUG = false;

    // Use individual selectors to minimize re-renders
    const currentFen = useEngineStore(selectCurrentFen);
    const isEngineEnabled = useEngineStore(selectIsEngineEnabled);
    const settings = useEngineStore(selectSettings);
    const updateSettings = useEngineStore(selectUpdateSettings);

    const [evaluation, setEvaluation] = useState<number>(0);
    const [bestLines, setBestLines] = useState<StockfishLine[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
    const [engineReady, setEngineReady] = useState(false);
    const maxLogEntries = 10; // Keep only last 10 log entries

    const workerRef = useRef<Worker | null>(null);
    const lastFen = useRef<string>(currentFen);

    // Function to add a new log entry
    const addLogEntry = useCallback((log: string) => {
        setAnalysisLogs(prev => {
            const newLogs = [...prev, log];
            return newLogs.slice(-maxLogEntries); // Keep only last N entries
        });
    }, []);

    // Debug function to log bestLines state - only used when DEBUG is true
    const logBestLines = useCallback((lines: StockfishLine[], source: string) => {
        if (!DEBUG) return; // Early return if debug is disabled

        console.log(`[DEBUG][IMPORTANT][${source}] BestLines:`,
            lines.map(line => ({
                multipv: line.multipv,
                depth: line.depth,
                move: line.move,
                eval: line.evaluationText
            }))
        );
    }, [DEBUG]);

    // Initialize worker
    useEffect(() => {
        if (typeof window === 'undefined') return;

        console.log('Initializing Stockfish worker');

        try {
            workerRef.current = new Worker(
                new URL('@/workers/stockfishWorker.ts', import.meta.url)
            );

            console.log('Worker created successfully');

            // Set up message handler
            workerRef.current.onmessage = (e: MessageEvent) => {
                const { type, data } = e.data;

                // Only log certain message types to reduce spam
                if (DEBUG || type === 'error' || type === 'ready') {
                    console.log('Worker message received', { type, data });
                }

                switch (type) {
                    case 'ready':
                        console.log('Engine ready message received');
                        setEngineReady(true);
                        addLogEntry('Engine ready');
                        break;

                    case 'started':
                        console.log('Analysis started message received');
                        setIsAnalyzing(true);
                        setIsPaused(false);
                        addLogEntry('Analysis started');
                        break;

                    case 'paused':
                        console.log('Analysis paused message received');
                        setIsPaused(true);
                        addLogEntry('Analysis paused');
                        break;

                    case 'resumed':
                        console.log('Analysis resumed message received');
                        setIsPaused(false);
                        addLogEntry('Analysis resumed');
                        break;

                    case 'analysis':
                        setEvaluation(data.evaluation);
                        setBestLines(prev => {
                            const newLines = [...prev];
                            const lineIndex = newLines.findIndex(
                                line => line.multipv === data.line.multipv
                            );

                            // Only log when adding new lines or at significant depth changes
                            const isSignificantUpdate =
                                lineIndex === -1 ||
                                data.line.depth % 5 === 0 ||
                                data.line.depth === settings.depth;

                            if (lineIndex === -1) {
                                if (DEBUG || isSignificantUpdate) {
                                    console.log(`[DEBUG] Adding new line with multipv ${data.line.multipv}`);
                                }
                                newLines.push({
                                    ...data.line,
                                    evaluation: data.evaluation
                                });
                            } else {
                                if (DEBUG && isSignificantUpdate) {
                                    console.log(`[DEBUG] Updating line with multipv ${data.line.multipv} at depth ${data.line.depth}`);
                                }
                                newLines[lineIndex] = {
                                    ...data.line,
                                    evaluation: data.evaluation
                                };
                            }

                            // Update progress based on depth
                            if (!settings.isInfinite) {
                                const maxDepth = settings.depth;
                                const currentDepth = data.line.depth;
                                const depthProgress = Math.min((currentDepth / maxDepth) * 100, 99);
                                setProgress(depthProgress);
                            } else {
                                // In infinite mode, just show the current depth as progress
                                setProgress(data.line.depth);
                            }

                            const sortedLines = newLines.sort((a, b) => b.evaluation - a.evaluation);

                            // Only log on significant changes
                            if (DEBUG && isSignificantUpdate) {
                                logBestLines(sortedLines, 'after-update');
                            }

                            return sortedLines;
                        });
                        break;

                    case 'analysis_batch':
                        setBestLines(prev => {
                            // Start with a copy of the previous lines
                            let newLines = [...prev];

                            // Log the batch of lines
                            console.log(`[DEBUG][IMPORTANT] Received batch of ${data.lines.length} lines at depth ${data.depth}`);

                            // Process each line in the batch
                            data.lines.forEach((line: StockfishLine) => {
                                // Find if this line already exists
                                const lineIndex = newLines.findIndex(
                                    existingLine => existingLine.multipv === line.multipv
                                );

                                if (lineIndex === -1) {
                                    // Add new line
                                    console.log(`[DEBUG] Adding new line with multipv ${line.multipv}`);
                                    newLines.push(line);
                                } else {
                                    // Update existing line
                                    console.log(`[DEBUG] Updating line with multipv ${line.multipv} at depth ${line.depth}`);
                                    newLines[lineIndex] = line;
                                }
                            });

                            // Sort lines by evaluation (highest first)
                            const sortedLines = newLines.sort((a, b) => b.evaluation - a.evaluation);

                            // Log the updated lines
                            logBestLines(sortedLines, 'after-batch-update');

                            return sortedLines;
                        });

                        // Update evaluation with the best line's evaluation
                        if (data.lines.length > 0) {
                            // Find the best line (highest evaluation)
                            const bestLine = [...data.lines].sort((a, b) => b.evaluation - a.evaluation)[0];
                            setEvaluation(bestLine.evaluation);
                        }
                        break;

                    case 'progress':
                        if (data && data.depth) {
                            setProgress(data.depth);
                        }
                        break;

                    case 'complete':
                        setIsAnalyzing(false);
                        setIsPaused(false);
                        setProgress(100);
                        addLogEntry('Analysis complete');
                        break;

                    case 'error':
                        setError(data.message);
                        setIsAnalyzing(false);
                        setIsPaused(false);
                        addLogEntry(`Error: ${data.message}`);
                        break;
                }
            };

            // Clean up worker on unmount
            return () => {
                if (workerRef.current) {
                    workerRef.current.terminate();
                    workerRef.current = null;
                }
            };
        } catch (err) {
            setError('Failed to initialize Stockfish worker');
            addLogEntry('Worker initialization failed');
        }
    }, [addLogEntry, settings.depth, logBestLines]);

    // Log bestLines whenever they change for debugging
    useEffect(() => {
        if (bestLines.length > 0) {
            console.log('[DEBUG][IMPORTANT] Current bestLines state:',
                bestLines.length,
                bestLines.map(line => ({
                    multipv: line.multipv,
                    depth: line.depth,
                    move: line.move
                }))
            );
        }
    }, [bestLines]);

    const getEvaluationColor = (value: number): string => {
        if (Math.abs(value) < 0.5) return 'text-gray-300';
        return value > 0 ? 'text-blue-400' : 'text-red-400';
    };

    const startAnalysis = useCallback(() => {
        console.log('startAnalysis called', { workerRef: !!workerRef.current, engineReady, currentFen });

        if (!workerRef.current) {
            console.error('Stockfish worker not initialized');
            setError('Stockfish worker not initialized');
            return;
        }

        if (!engineReady) {
            console.warn('Engine not ready yet, waiting...');
            addLogEntry('Engine not ready yet, waiting...');
            return;
        }

        // Reset states before starting
        setError(null);
        setProgress(0);
        setIsAnalyzing(true);
        setIsPaused(false);
        setBestLines([]);
        lastFen.current = currentFen;

        console.log('Sending start command to worker', {
            fen: currentFen,
            settings: {
                depth: settings.depth,
                multiPV: settings.multiPV,
                threads: settings.threads,
                isInfinite: settings.isInfinite
            }
        });

        // Send start command to worker
        workerRef.current.postMessage({
            type: 'start',
            fen: currentFen,
            settings: {
                depth: settings.depth,
                multiPV: settings.multiPV,
                threads: settings.threads,
                isInfinite: settings.isInfinite
            }
        });
    }, [currentFen, settings, engineReady, addLogEntry]);

    const stopAnalysis = useCallback(() => {
        console.log('stopAnalysis called', { workerRef: !!workerRef.current, isAnalyzing });

        if (!workerRef.current || !isAnalyzing) {
            console.warn('Cannot stop analysis: worker not initialized or not analyzing');
            return;
        }

        console.log('Sending stop command to worker');
        workerRef.current.postMessage({ type: 'stop' });
        setIsAnalyzing(false);
        setIsPaused(false);
        setProgress(0); // Reset progress when stopping
    }, [isAnalyzing]);

    // Simplified toggle function that handles state properly
    const toggleAnalysis = useCallback(() => {
        console.log('Toggle Analysis called', { isAnalyzing, engineReady, isEngineEnabled });
        if (isAnalyzing) {
            console.log('Stopping analysis');
            stopAnalysis();
        } else {
            console.log('Starting analysis');
            startAnalysis();
        }
    }, [isAnalyzing, startAnalysis, stopAnalysis]);

    // Handle settings changes
    useEffect(() => {
        // Only update settings during active analysis
        if (isAnalyzing && engineReady && !isPaused && workerRef.current) {
            // Update settings without restarting analysis
            workerRef.current.postMessage({
                type: 'update_settings',
                settings: {
                    depth: settings.depth,
                    multiPV: settings.multiPV,
                    threads: settings.threads,
                    isInfinite: settings.isInfinite
                }
            });
        }
    }, [settings.depth, settings.multiPV, settings.threads, settings.isInfinite, isAnalyzing, engineReady, isPaused]);

    // Initialize state on mount
    useEffect(() => {
        setIsAnalyzing(false);
        setIsPaused(false);
        setProgress(0);
        setBestLines([]);
    }, []);

    // Add an effect to restart analysis when settings change
    useEffect(() => {
        // Only restart if already analyzing
        if (isAnalyzing && workerRef.current && engineReady) {
            // Stop current analysis
            stopAnalysis();

            // Small delay to ensure clean restart
            const timer = setTimeout(() => {
                startAnalysis();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [settings.multiPV]); // Only restart when multiPV changes

    return {
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
        toggleAnalysis,
        analysisLogs,
        engineReady
    };
};
