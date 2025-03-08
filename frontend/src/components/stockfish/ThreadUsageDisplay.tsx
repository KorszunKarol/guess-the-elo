'use client';

import { cn } from '@/lib/utils';
import type { ThreadInfo } from '@/types/stockfish';
import { InfoIcon } from 'lucide-react';

interface ThreadUsageDisplayProps {
    threadInfo: ThreadInfo | null;
}

export const ThreadUsageDisplay = ({ threadInfo }: ThreadUsageDisplayProps) => {
    if (!threadInfo) return null;

    const { requestedThreads, actualThreads, multiThreadingSupported, unsupportedReason } = threadInfo;
    const isCorrectThreadCount = requestedThreads === actualThreads;

    return (
        <div className="mt-2 p-2 bg-gray-800/50 rounded-lg">
            <h4 className="text-xs font-medium text-gray-300 mb-1">Thread Usage</h4>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                        Requested: <span className="font-medium text-blue-400">{requestedThreads}</span>
                    </span>
                    <span className="text-xs text-gray-400">
                        Actual: <span className={cn(
                            "font-medium",
                            isCorrectThreadCount ? "text-green-400" : "text-red-400"
                        )}>
                            {actualThreads}
                        </span>
                    </span>
                </div>
                <div className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    isCorrectThreadCount ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                )}>
                    {isCorrectThreadCount ? "Correct" : "Mismatch"}
                </div>
            </div>

            {multiThreadingSupported === false && unsupportedReason && (
                <div className="mt-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded flex items-start gap-1.5">
                    <InfoIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <div>
                        <span className="font-medium">Note:</span> {unsupportedReason}
                        <div className="mt-0.5 text-amber-300/70 text-[10px]">
                            Multi-threading requires HTTPS and specific security headers.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};