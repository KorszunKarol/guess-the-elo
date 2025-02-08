import React, { useState, useRef, useEffect } from 'react';
import { ChessBoard, type ChessBoardProps } from '@/components/chess/ChessBoard'; //  correct path
import { ChessContainer } from '@/components/chess/ChessContainer';
import { useGameState } from '@/src/hooks/useGameState'; // Import useGameState

interface GameBoardProps {
  //  pass down the fen
  fen: string;
  onMove: (move: string) => void; //  type for move
}

function GameBoard({ fen, onMove }: GameBoardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipBoard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <ChessContainer className="w-full max-w-[min(800px,95vh)] aspect-square">
      <ChessBoard
        position={fen}
        onMove={onMove}
        boardOrientation={isFlipped ? 'black' : 'white'}
        className="aspect-square w-full h-full"
      />
    </ChessContainer>
  );
}

export default GameBoard;