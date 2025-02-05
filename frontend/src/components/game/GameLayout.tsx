import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GameLayoutProps {
    leftPanel: ReactNode;    // Stockfish analysis
    middlePanel: ReactNode;  // Chessboard
    rightPanel: ReactNode;   // Guessing panel
    className?: string;
}

function GameLayout({ leftPanel, middlePanel, rightPanel, className }: GameLayoutProps) {
    return (
        <div className={cn(
            "grid grid-cols-1 lg:grid-cols-[minmax(300px,1fr)_minmax(400px,600px)_minmax(300px,1fr)] gap-6",
            "w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8",
            className
        )}>
            <div className="lg:col-span-1">{leftPanel}</div>
            <div className="lg:col-span-1">{middlePanel}</div>
            <div className="lg:col-span-1">{rightPanel}</div>
        </div>
    );
}

export { GameLayout };