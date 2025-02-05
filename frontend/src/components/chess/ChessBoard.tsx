'use client';

import { useRef, useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cn } from '@/lib/utils';

interface ChessBoardProps {
    position: string;
    onMove: (move: string) => void;
    className?: string;
    boardOrientation?: 'white' | 'black';
}

export const ChessBoard = ({ position, onMove, className, boardOrientation = 'white' }: ChessBoardProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [boardWidth, setBoardWidth] = useState(600);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setBoardWidth(width);
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="relative z-20 w-full h-full">
                <div ref={containerRef} className={cn(
                    "relative aspect-square w-full h-full rounded-xl overflow-hidden",
                    "border border-gray-700/50 shadow-inner",
                    className
                )}>
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-chess-pattern opacity-20" />
                    <Chessboard
                        position={position}
                        boardWidth={boardWidth}
                        arePiecesDraggable={true}
                        boardOrientation={boardOrientation}
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
        </DndProvider>
    );
};
