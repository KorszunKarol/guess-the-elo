'use client';

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '@/app/guess-the-elo/components/ChessBoard';
import ChessEvaluationComponent from '@/app/guess-the-elo/components/ChessEvaluationComponent';
import { GameControls } from '@/app/guess-the-elo/components/GameControls';
import { Header } from '@/app/guess-the-elo/components/Header';
import { BackgroundDots } from '@/app/guess-the-elo/components/BackgroundDots';
import { generateRandomPosition } from '@/app/guess-the-elo/utils/chessUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsModal } from '@/app/guess-the-elo/components/SettingsModal';
import StockfishEvaluation from "@/components/stockfish/StockfishEvaluation";
import { Button } from "@/components/ui/button";
import { Square, RotateCcw } from "lucide-react";

export default function GuessTheEval() {
  const [game, setGame] = useState<Chess>(new Chess());
  const [currentMove, setCurrentMove] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const newGame = new Chess();
    setGame(newGame);
  }, []);

  const handleSubmit = (evaluation: number) => {
    console.log('Submitted evaluation:', evaluation);
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative select-none">
      <BackgroundDots />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header
          onProfileClick={() => {}}
          onSettingsClick={handleSettingsClick}
          onStatsClick={() => {}}
        />

        <div className="mt-8 flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto">
          {/* Left side - Chess Board with layered card effect */}
          <div className="flex-1">
            <div className="relative group">
              {/* Background decorative card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-sm" />

              {/* Main card with hover effect */}
              <Card className="relative bg-gray-900/50 backdrop-blur-sm border-gray-800 h-full
                transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-lg
                group-hover:shadow-blue-500/20">
                <CardHeader className="border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r
                      from-blue-400 to-purple-600">
                      Position Analysis
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-500/10 transition-colors"
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-purple-500/10 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Inner card for chess board */}
                  <div className="relative rounded-lg overflow-hidden bg-gray-950/50 p-4 mt-2">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5" />
                    <div className="relative aspect-square w-full max-w-[700px] mx-auto">
                      <ChessBoard
                        position={game.fen()}
                        onMove={() => {}}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right side - Evaluation */}
          <div className="w-full lg:w-[400px] space-y-4">
            <ChessEvaluationComponent
              onSubmit={handleSubmit}
              currentMove={currentMove}
              highScore={highScore}
              totalMoves={10}
            />
            <StockfishEvaluation />
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(settings) => {
          console.log('Settings saved:', settings);
          setIsSettingsOpen(false);
        }}
        gameMode="eval"
      />
    </div>
  );
}