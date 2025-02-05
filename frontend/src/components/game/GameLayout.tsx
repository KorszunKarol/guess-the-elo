'use client';

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import { Panel } from './Panel';

interface GameLayoutProps {
    leftPanel: ReactNode;    // Stockfish analysis
    centerPanel: ReactNode;  // Chessboard
    rightPanel: ReactNode;   // Guessing panel
    className?: string;
}

export function GameLayout({ leftPanel, centerPanel, rightPanel, className }: GameLayoutProps) {
    return (
        <div className={cn(
            "grid grid-cols-1 lg:grid-cols-[minmax(300px,1fr)_minmax(600px,2fr)_minmax(300px,1fr)]",
            "gap-6 w-full h-[700px] max-h-[85vh]",
            "overflow-hidden",
            className
        )}>
            {/* Left Panel - Stockfish Analysis */}
            <Panel className="h-full overflow-y-auto scrollbar-hide">
                {leftPanel}
            </Panel>

            {/* Center Panel - Chessboard */}
            <div className="h-full w-full flex items-center justify-center">
                {centerPanel}
            </div>

            {/* Right Panel - Guessing Interface */}
            <Panel className="h-full overflow-y-auto scrollbar-hide">
                {rightPanel}
            </Panel>
        </div>
    );
}