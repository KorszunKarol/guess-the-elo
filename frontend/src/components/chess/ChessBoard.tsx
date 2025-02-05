'use client';

import { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Chessboard } from 'react-chessboard';
import { cn } from '@/lib/utils';

interface ChessBoardProps {
    position: string;
    onMove: (move: string) => void;
    className?: string;
}

export const ChessBoard = ({ position, onMove, className }: ChessBoardProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative z-20 w-full h-full">
            <div
                ref={containerRef}
                className={cn(
                    "relative aspect-square w-full rounded-xl overflow-hidden",
                    "border border-gray-700/50 shadow-inner",
                    className
                )}
            >
                {/* Background pattern */}
                <div className="absolute inset-0 bg-chess-pattern opacity-20" />

                    <Chessboard
                        position={position}
                        boardWidth={containerRef.current?.offsetWidth || 600}
                        onPieceDrop={(source, target) => {
                            onMove(`${source}-${target}`);
                            return true;
                        }}
                        customBoardStyle={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                        }}
                        customDarkSquareStyle={{
                            backgroundColor: '#334155', // slate-700
                        }}
                        customLightSquareStyle={{
                            backgroundColor: '#475569', // slate-600
                        }}
                    />
            </div>
        </div>
    );
};
