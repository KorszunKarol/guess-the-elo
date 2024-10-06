'use client';

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './components/ChessBoard';
import { EvaluationComponent } from './components/EvaluationComponent';
import { GameControls } from './components/GameControls';
import { Header } from './components/Header';
import { BackgroundDots } from './components/BackgroundDots';
import { generateRandomPosition } from './utils/chessUtils';
import { Card, CardContent } from "@/components/ui/card";

export default function GuessTheElo() {
  const [game, setGame] = useState<Chess | null>(null);
  const [turn, setTurn] = useState<'White' | 'Black'>('White');
  const [highScore, setHighScore] = useState(0);
  const [round, setRound] = useState(1);

  useEffect(() => {
    const newGame = new Chess();
    const { newPieces } = generateRandomPosition();
    newGame.clear();
    newPieces.forEach(piece => {
      const [type, square] = piece.split('@');
      newGame.put({ type: type.toLowerCase() as any, color: type === type.toUpperCase() ? 'w' : 'b' }, square as any);
    });
    setGame(newGame);
    setTurn(newGame.turn() === 'w' ? 'White' : 'Black');
  }, []);

  const handleEvaluationSubmit = (evaluation: { evaluation: number }) => {
    console.log('Evaluation submitted:', evaluation);
    setRound(prev => Math.min(prev + 1, 5));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <BackgroundDots />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />
        <div className="flex justify-center mt-8">
          <Card className="bg-gray-800 border-gray-700 overflow-hidden max-w-5xl w-full">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row justify-center items-start gap-4">
                <div className="w-full lg:w-auto flex-shrink-0">
                  {game && <ChessBoard game={game} />}
                  <GameControls
                    onPrevMove={() => console.log('Previous move')}
                    onNextMove={() => console.log('Next move')}
                    canGoPrev={false}
                    canGoNext={false}
                  />
                </div>
                <div className="w-full lg:w-96 flex-shrink-0">
                  <EvaluationComponent
                    onSubmit={handleEvaluationSubmit}
                    turn={turn}
                    highScore={highScore}
                    round={round}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}