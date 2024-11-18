'use client';

import { Card, CardContent } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import { Chess } from 'chess.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useMemo, useState, useEffect } from 'react';

const Chessboard = dynamic(() => import('react-chessboard').then((mod) => mod.Chessboard), { ssr: false });

interface ChessBoardProps {
  game: Chess;
}

const ChessBoard = ({ game }: ChessBoardProps) => {
  const [boardWidth, setBoardWidth] = useState(400);

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(500, window.innerWidth - 40);
      setBoardWidth(width);
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const boardConfig = useMemo(() => ({
    position: game.fen(),
    boardWidth,
    arePiecesDraggable: false,
    customDarkSquareStyle: { backgroundColor: '#374151' },
    customLightSquareStyle: { backgroundColor: '#eeeeee' },
  }), [game, boardWidth]);

  if (!game) {
    return <div className="text-red-500">Error: Chess game not initialized</div>;
  }

  return (
    <Card className="bg-gray-800 border-gray-700 w-full">
      <CardContent className="p-5">
        <div className="w-full mx-auto">
          <DndProvider backend={HTML5Backend}>
            <Chessboard {...boardConfig} />
          </DndProvider>
        </div>
      </CardContent>
    </Card>
  );
}

export { ChessBoard };