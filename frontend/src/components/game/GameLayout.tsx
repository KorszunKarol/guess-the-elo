import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Panel } from './Panel';

interface GameLayoutProps {
    leftPanel: ReactNode;    // Stockfish analysis
    centerPanel: ReactNode;  // Chessboard
    rightPanel: ReactNode;   // Guessing panel
    className?: string;
}

function GameLayout({ leftPanel, centerPanel, rightPanel, className }: GameLayoutProps) {
    return (
        <div className={cn(
            "grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4 lg:gap-8",
            "w-full h-[600px] max-h-[90vh]",
            className
        )}>
            {/* Left Panel - Stockfish Analysis */}
            <Panel className="h-full overflow-auto">{leftPanel}</Panel>

            {/* Center Panel - Chessboard */}
            <Panel className="h-full flex items-center justify-center p-4">
                {centerPanel}
            </Panel>

            {/* Right Panel - Guessing Interface */}
            <Panel className="h-full overflow-auto">{rightPanel}</Panel>
        </div>
    );
}

export { GameLayout };