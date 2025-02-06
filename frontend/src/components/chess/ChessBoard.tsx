'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
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
    const [isLoading, setIsLoading] = useState(true);
    const [isBoardMounted, setIsBoardMounted] = useState(false);
    const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const size = Math.floor(Math.min(rect.width, rect.height));
                if (size > 0) {
                    setBoardWidth(size);
                    setIsLoading(false);
                }
            }
        };

        const observer = new ResizeObserver(() => {
            updateSize();
        });

        observer.observe(containerRef.current);
        updateSize();

        // Set mounted after a short delay to ensure pieces are loaded
        const mountTimer = setTimeout(() => {
            setIsBoardMounted(true);
        }, 100);

        return () => {
            observer.disconnect();
            clearTimeout(mountTimer);
        };
    }, []);

    const handleDragBegin = useCallback((piece: any, sourceSquare: string) => {
        console.log("handleDragBegin called. Source square:", sourceSquare, "Piece:", piece);
        if (containerRef.current) {
            const squareElem = containerRef.current.querySelector(`[data-square="${sourceSquare}"]`);
            if (squareElem) {
                const squareRect = squareElem.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                // Calculate position relative to container
                const x = squareRect.left - containerRect.left + squareRect.width / 2;
                const y = squareRect.top - containerRect.top + squareRect.height / 2;
                console.log("Square element found.", { squareRect, x, y });
                setDragPosition({ x, y });
            } else {
                console.log("Square element not found for:", sourceSquare);
            }
        } else {
            console.log("Container ref is null in handleDragBegin.");
        }
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (containerRef.current && dragPosition) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - containerRect.left;
            const y = e.clientY - containerRect.top;
            setDragPosition({ x, y });
        }
    }, [dragPosition]);

    useEffect(() => {
        if (dragPosition) {
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [dragPosition, handleMouseMove]);

    const renderDragOverlay = useCallback(
        (piece: any) => {
            if (!dragPosition) {
                console.log("renderDragOverlay: No drag position set.");
                return null;
            }
            console.log("renderDragOverlay: dragPosition is", dragPosition);
            return (
                <div
                    style={{
                        position: 'absolute',
                        left: dragPosition.x,
                        top: dragPosition.y,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        zIndex: 9999,
                    }}
                >
                    <img
                        src={piece.piece.image}
                        style={{
                            width: `${boardWidth / 8}px`,
                            height: `${boardWidth / 8}px`,
                            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                        }}
                        alt="Dragged piece"
                    />
                </div>
            );
        },
        [dragPosition, boardWidth]
    );

    if (!isBoardMounted) {
        return (
            <div
                ref={containerRef}
                className={cn(className, "flex items-center justify-center")}
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#1e293b', // slate-800
                    borderRadius: '8px',
                }}
            >
                <div className="w-12 h-12 border-4 border-blue-500/40 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn(className, "transition-opacity duration-300", {
                "opacity-0": isLoading,
                "opacity-100": !isLoading,
            })}
            style={{
                position: 'relative',
                isolation: 'isolate',
                touchAction: 'none',
                width: '100%',
                height: '100%'
            }}
        >
            <Chessboard
                position={position}
                onPieceDrop={(source: Square, target: Square) => {
                    onMove(`${source}-${target}`);
                    return true;
                }}
                boardWidth={boardWidth}
                arePiecesDraggable={true}
                boardOrientation={boardOrientation}
                customBoardStyle={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
                customDarkSquareStyle={{ backgroundColor: '#48586A' }}  // slate-800 lightened by 10%
                customLightSquareStyle={{ backgroundColor: '#cbd5e1' }}  // slate-300

                dragPieceOptions={{
                    snapToCursor: false,
                    touchAction: 'none',
                }}
            />
        </div>
    );
};
