'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChessContainerProps {
    children: ReactNode;
    className?: string;
    onFlipBoard?: () => void;
}

export const ChessContainer = ({ children, className, onFlipBoard }: ChessContainerProps) => {
    const childrenArray = Array.isArray(children) ? children : [children];
    const [chessboard] = childrenArray;

    return (
        <div className={cn(
            "relative flex flex-col items-center justify-center",
            "w-full h-[80vh] min-h-[500px] max-h-[700px]",
            "mx-auto z-10",
            className
        )}>
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/80 backdrop-blur-lg border border-gray-700/30 shadow-2xl" />

            {/* Chessboard wrapper */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
                <div className="relative" style={{
                    width: 'min(600px, 100%, 70vh)',
                    height: 'min(600px, 100%, 70vh)',
                }}>
                    {chessboard}
                </div>
            </div>

            {/* Flip board button */}
            <div className="absolute -bottom-8 left-0">
                <button
                    onClick={onFlipBoard}
                    className="flex items-center justify-center h-7 w-7 rounded-md bg-gray-700/80 hover:bg-gray-600 transition-colors"
                    title="Flip Board"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-gray-200"
                    >
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                        <path d="M16 21h5v-5" />
                    </svg>
                </button>
            </div>
        </div>
    );
};