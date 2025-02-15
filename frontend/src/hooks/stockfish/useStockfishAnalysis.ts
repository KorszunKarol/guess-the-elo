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
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const workerRef = useRef<Worker | null>(null);
    const verificationComplete = useRef(false);
    const verificationTimeout = useRef<NodeJS.Timeout>();

    const verifyWASM = useCallback(async () => {
        // Skip if already verified
        if (verificationComplete.current) return;

        // Clear any pending verification
        if (verificationTimeout.current) {
            clearTimeout(verificationTimeout.current);
        }

        try {
            const basePath = process.env.NODE_ENV === 'development'
                ? `${typeof window !== 'undefined' ? window.location.origin : ''}/wasm`
                : '/_next/static/wasm';

            const wasmPath = `${basePath}/stockfish-nnue-16-single.wasm`;
            console.log('Verifying WASM at:', wasmPath);

            const res = await fetch(wasmPath);
            if (!res.ok) {
                throw new Error(`Failed to fetch WASM: ${res.status} ${res.statusText}`);
            }

            console.log('WASM fetch status:', res.status);
            console.log('WASM content type:', res.headers.get('content-type'));
            const buffer = await res.arrayBuffer();
            console.log('WASM size:', buffer.byteLength, 'bytes');

            // Also verify NNUE file
            const nnuePath = `${basePath}/nn-5af11540bbfe.nnue`;
            console.log('Verifying NNUE at:', nnuePath);

            const nnueRes = await fetch(nnuePath);
            if (!nnueRes.ok) {
                console.warn('NNUE file not found:', nnuePath);
            } else {
                console.log('NNUE fetch status:', nnueRes.status);
                console.log('NNUE size:', (await nnueRes.arrayBuffer()).byteLength, 'bytes');
            }

            // Mark verification as complete only if successful
            verificationComplete.current = true;
        } catch (error) {
            console.error('WASM verification failed:', error);
            setError(error instanceof Error ? error.message : 'Failed to verify WASM');
            // Reset verification flag on error
            verificationComplete.current = false;
        }
    }, []); // Empty dependency array since we don't use any external values

    // Run verification once on mount
    useEffect(() => {
        if (typeof window === 'undefined') return; // Skip on server-side

        verificationTimeout.current = setTimeout(() => {
            verifyWASM();
        }, 100); // Small delay to ensure DOM is ready

        return () => {
            if (verificationTimeout.current) {
                clearTimeout(verificationTimeout.current);
            }
        };
    }, [verifyWASM]);

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

                            return newLines.sort((a, b) => b.evaluation - a.evaluation);
                        });
                        break;

                    case 'complete':
                        setIsAnalyzing(false);
                        setProgress(100);
                        break;

                    case 'error':
                        setError(data.message);
                        setIsAnalyzing(false);
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
        }
    }, []);

    const getEvaluationColor = (value: number): string => {
        if (Math.abs(value) < 0.5) return 'text-gray-300';
        return value > 0 ? 'text-blue-400' : 'text-red-400';
    };

    const startAnalysis = () => {
        if (!workerRef.current) {
            setError('Stockfish worker not initialized');
            return;
        }

        setIsAnalyzing(true);
        setProgress(0);
        setBestLines([]);
        setError(null);

        workerRef.current.postMessage({
            type: 'start',
            fen: currentFen,
            settings: {
                depth: settings.depth,
                multiPV: settings.multiPV,
                threads: settings.threads
            }
        });
    };

    const stopAnalysis = () => {
        if (!workerRef.current) return;

        workerRef.current.postMessage({ type: 'stop' });
        setIsAnalyzing(false);
    };

    // Auto-start analysis when engine is enabled and the current FEN changes
    useEffect(() => {
        if (isEngineEnabled && settings.autoAnalysis && !isAnalyzing) {
            startAnalysis();
        }
        // Stop analysis if engine is disabled
        if (!isEngineEnabled && isAnalyzing) {
            stopAnalysis();
        }
    }, [currentFen, isEngineEnabled, settings.autoAnalysis, isAnalyzing]);

    // Handle analysis progress
    useEffect(() => {
        if (!isAnalyzing) return;

        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + (100 / (settings.depth * 10)), 100));
        }, 100);

        return () => clearInterval(interval);
    }, [isAnalyzing, settings.depth]);

    return {
        evaluation,
        bestLines,
        settings,
        updateSettings,
        getEvaluationColor,
        isAnalyzing,
        progress,
        error,
        startAnalysis,
        stopAnalysis,
    };
};
