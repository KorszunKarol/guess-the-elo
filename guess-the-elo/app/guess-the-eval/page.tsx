'use client';

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '@/app/guess-the-elo/components/ChessBoard';
import ChessEvaluationComponent from '@/app/guess-the-elo/components/ChessEvaluationComponent';
import { GameControls } from '@/app/guess-the-elo/components/GameControls';
import { Header } from '@/app/guess-the-elo/components/Header';
import { BackgroundDots } from '@/app/guess-the-elo/components/BackgroundDots';
import { generateRandomPosition } from '@/app/guess-the-elo/utils/chessUtils';
import { Card, CardContent } from "@/components/ui/card";
import { SettingsModal } from '@/app/guess-the-elo/components/SettingsModal';
import { Button } from "@/components/ui/button";
import GameModeSwitcher from '@/app/components/GameModeSwitcher';
import Link from 'next/link';

export default function GuessTheEval() {
  const [game, setGame] = useState<Chess | null>(null);
  const [currentMove, setCurrentMove] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [totalMoves, setTotalMoves] = useState(10); // You can adjust this
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const newGame = new Chess();
    const { newPieces } = generateRandomPosition();
    newGame.clear();
    newPieces.forEach(piece => {
      const [type, square] = piece.split('@');
      newGame.put({ type: type.toLowerCase() as any, color: type === type.toUpperCase() ? 'w' : 'b' }, square as any);
    });
    setGame(newGame);
  }, []);

  const handleEvaluationSubmit = (evaluation: number) => {
    console.log('Evaluation submitted:', evaluation);
    setCurrentMove(prev => Math.min(prev + 1, totalMoves));
    // Here you would typically compare the submitted evaluation with the actual evaluation
    // and update the high score accordingly
  };

  const handleSettingsSave = (newSettings: any) => {
    console.log('Settings updated:', newSettings);
    setIsSettingsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <BackgroundDots />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <Header onProfileClick={() => {}} onSettingsClick={() => setIsSettingsOpen(true)} />
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
        <div className="flex justify-center mt-8">
          <Card className="bg-gray-800 border-gray-700 overflow-hidden max-w-5xl w-full">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row justify-center items-start gap-4">
                <div className="w-full lg:w-auto flex-shrink-0">
                  {game && <ChessBoard game={game} />}
                  <GameControls
                    onPrevMove={() => setCurrentMove(prev => Math.max(prev - 1, 1))}
                    onNextMove={() => setCurrentMove(prev => Math.min(prev + 1, totalMoves))}
                    canGoPrev={currentMove > 1}
                    canGoNext={currentMove < totalMoves}
                  />
                </div>
                <div className="w-full lg:w-96 flex-shrink-0">
                  <ChessEvaluationComponent
                    onSubmit={handleEvaluationSubmit}
                    currentMove={currentMove}
                    highScore={highScore}
                    totalMoves={totalMoves}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
      />
    </div>
  );
}