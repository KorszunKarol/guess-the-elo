import React from 'react';
import ChessEvaluationComponent from '@/components/chess/ChessEvaluationComponent';
import { Clock } from 'lucide-react';

interface EvaluationPanelProps {
  currentRound: number;
  totalRounds: number;
  timeRemaining: number;
  onSubmit: (evaluation: number) => void;
  position: string;
}

function EvaluationPanel({
  currentRound,
  totalRounds,
  timeRemaining,
  onSubmit,
  position
}: EvaluationPanelProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center px-4 pt-4">
        <h2 className="text-xl font-bold text-blue-400">Guess the Eval</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-300">
            Round: {currentRound}/{totalRounds}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-purple-400">
            <Clock className="h-4 w-4" />
            {timeRemaining}s
          </div>
        </div>
      </div>

      <ChessEvaluationComponent
        onSubmit={onSubmit}
        currentMove={currentRound}
        highScore={0} //  pass this down
        totalMoves={totalRounds}
        position={position}
      />
    </div>
  );
}

export default EvaluationPanel;