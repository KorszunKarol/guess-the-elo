'use client';

import { Card, CardContent } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useMemo, useState, useEffect } from 'react';

const Chessboard = dynamic(
    () => import('react-chessboard').then((mod) => mod.Chessboard),
    { ssr: false }
);

interface ChessBoardProps {
    position: string;
    onMove?: () => void;
}

export const ChessBoard = ({ position, onMove }: ChessBoardProps) => {
    const [boardWidth, setBoardWidth] = useState(600);

    useEffect(() => {
        const updateDimensions = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setBoardWidth(Math.min(350, width - 40));
            } else if (width < 1024) {
                setBoardWidth(500);
            } else {
                setBoardWidth(600);
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const boardConfig = useMemo(
        () => ({
            position,
            boardWidth,
            arePiecesDraggable: false,
            customDarkSquareStyle: { backgroundColor: '#374151' },
            customLightSquareStyle: { backgroundColor: '#eeeeee' },
            boardOrientation: 'white',
            showBoardNotation: true,
        }),
        [position, boardWidth]
    );

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-5">
                <div className="flex justify-center">
                    <DndProvider backend={HTML5Backend}>
                        <Chessboard {...boardConfig} />
                    </DndProvider>
                </div>
            </CardContent>
        </Card>
    );
};
