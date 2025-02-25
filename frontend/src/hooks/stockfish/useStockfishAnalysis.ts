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
    const positionChanged = useRef<boolean>(false);
    const lastFen = useRef<string>(currentFen);

    // Function to add a new log entry
    const addLogEntry = useCallback((log: string) => {
        setAnalysisLogs(prev => {
            const newLogs = [...prev, log];
            return newLogs.slice(-maxLogEntries); // Keep only last N entries
        });
    }, []);

    // Initialize worker
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            workerRef.current = new Worker(
                new URL('@/workers/stockfishWorker.ts', import.meta.url)
            );

            // Set up message handler
            workerRef.current.onmessage = (e: MessageEvent) => {
                const { type, data } = e.data;

                switch (type) {
                    case 'ready':
                        setEngineReady(true);
                        addLogEntry('Engine ready');
                        break;

                    case 'started':
                        setIsAnalyzing(true);
                        setIsPaused(false);
                        addLogEntry('Analysis started');
                        break;

                    case 'paused':
                        setIsPaused(true);
                        addLogEntry('Analysis paused');
                        break;

                    case 'resumed':
                        setIsPaused(false);
                        addLogEntry('Analysis resumed');
                        break;

                    case 'analysis':
                        setEvaluation(data.evaluation);
                        setBestLines(prev => {
                            const newLines = [...prev];
                            const lineIndex = newLines.findIndex(
                                line => line.move === data.line.move
                            );

                            if (lineIndex === -1) {
                                newLines.push({
                                    ...data.line,
                                    evaluation: data.evaluation
                                });
                            } else {
                                newLines[lineIndex] = {
                                    ...data.line,
                                    evaluation: data.evaluation
                                };
                            }

                            // Update progress based on depth
                            const maxDepth = settings.depth;
                            const currentDepth = data.line.depth;
                            const depthProgress = Math.min((currentDepth / maxDepth) * 100, 99);
                            setProgress(depthProgress);

                            return newLines.sort((a, b) => b.evaluation - a.evaluation);
                        });
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
    }, [addLogEntry, settings.depth]);

    const getEvaluationColor = (value: number): string => {
        if (Math.abs(value) < 0.5) return 'text-gray-300';
        return value > 0 ? 'text-blue-400' : 'text-red-400';
    };

    const startAnalysis = useCallback(() => {
        if (!workerRef.current) {
            setError('Stockfish worker not initialized');
            return;
        }

        if (!engineReady) {
            addLogEntry('Engine not ready yet, waiting...');
            return;
        }

        setIsAnalyzing(true);
        setProgress(0);
        setError(null);

        // Only reset best lines if position changed
        if (positionChanged.current) {
            setBestLines([]);
            positionChanged.current = false;
        }

        workerRef.current.postMessage({
            type: 'start',
            fen: currentFen,
            settings: {
                depth: settings.depth,
                multiPV: settings.multiPV,
                threads: settings.threads,
                continuous: true // Enable continuous analysis mode
            }
        });
    }, [currentFen, settings, engineReady, addLogEntry]);

    const stopAnalysis = useCallback(() => {
        if (!workerRef.current || !isAnalyzing) return;

        workerRef.current.postMessage({ type: 'stop' });
    }, [isAnalyzing]);

    const pauseAnalysis = useCallback(() => {
        if (!workerRef.current || !isAnalyzing || isPaused) return;

        workerRef.current.postMessage({ type: 'pause' });
    }, [isAnalyzing, isPaused]);

    const resumeAnalysis = useCallback(() => {
        if (!workerRef.current || !isPaused) return;

        workerRef.current.postMessage({
            type: 'resume',
            settings: {
                depth: settings.depth,
                multiPV: settings.multiPV,
                threads: settings.threads,
                continuous: true
            }
        });
    }, [isPaused, settings]);

    // Track position changes with debouncing to prevent rapid restarts
    useEffect(() => {
        // Skip if engine is not enabled or auto-analysis is off
        if (!isEngineEnabled || !settings.autoAnalysis) return;

        if (currentFen !== lastFen.current) {
            positionChanged.current = true;
            lastFen.current = currentFen;

            // Use a more reliable approach with proper cleanup
            let isCurrentEffect = true; // Flag to track if this effect instance is still current

            const handlePositionChange = async () => {
                // Only proceed if this effect is still the current one
                if (!isCurrentEffect) return;

                // If already analyzing, stop first
                if (isAnalyzing && workerRef.current) {
                    workerRef.current.postMessage({ type: 'stop' });

                    // Wait for the stop to complete
                    await new Promise(resolve => setTimeout(resolve, 200));

                    // Check if this effect is still relevant
                    if (!isCurrentEffect) return;

                    // Reset state
                    setBestLines([]);
                }

                // Start new analysis if conditions are still met
                if (isEngineEnabled && settings.autoAnalysis && engineReady && workerRef.current && isCurrentEffect) {
                    workerRef.current.postMessage({
                        type: 'start',
                        fen: currentFen,
                        settings: {
                            depth: settings.depth,
                            multiPV: settings.multiPV,
                            threads: settings.threads,
                            continuous: settings.continuous
                        }
                    });

                    // Update state
                    setIsAnalyzing(true);
                    setIsPaused(false);
                    setProgress(0);
                }
            };

            // Debounce position changes to prevent rapid restarts
            const timerId = setTimeout(handlePositionChange, 300);

            // Cleanup function
            return () => {
                isCurrentEffect = false;
                clearTimeout(timerId);
            };
        }
    }, [currentFen, isEngineEnabled, settings, isAnalyzing, engineReady]);

    // Auto-start analysis when engine is first enabled
    useEffect(() => {
        // Only start analysis when engine is first enabled and not already analyzing
        if (isEngineEnabled && settings.autoAnalysis && !isAnalyzing && !isPaused && engineReady) {
            startAnalysis();
        }

        // Stop analysis if engine is disabled
        if (!isEngineEnabled && (isAnalyzing || isPaused)) {
            stopAnalysis();
        }
    }, [isEngineEnabled, settings.autoAnalysis, isAnalyzing, isPaused, engineReady, startAnalysis, stopAnalysis]);

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
                    continuous: settings.continuous
                }
            });
        }
    }, [settings.depth, settings.multiPV, settings.threads, settings.continuous, isAnalyzing, engineReady, isPaused]);

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
        pauseAnalysis,
        resumeAnalysis,
        analysisLogs,
        engineReady
    };
};
