'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { StockfishLine } from '@/types/stockfish';

interface EvaluationItemProps {
  line: StockfishLine;
  getEvaluationColor: (value: number) => string;
  onSelect?: () => void;
}

// Add utility to format move sequence with numbers
const formatMoveSequence = (moves: string[]): ReactNode[] => {
  return moves.map((move, idx) => {
    const moveNumber = Math.floor(idx / 2) + 1;
    const isWhiteMove = idx % 2 === 0;

    return (
      <span key={idx} className="inline-flex items-center">
        {isWhiteMove && (
          <span className="text-gray-600 mr-1 select-none">{moveNumber}.</span>
        )}
        <span className={cn(
          "font-medium",
          isWhiteMove ? "text-blue-300/90" : "text-red-300/90"
        )}>
          {move}
        </span>
        {idx !== moves.length - 1 && (
          <span className="mx-1.5 text-gray-700 select-none">
            {isWhiteMove ? "" : " "}
          </span>
        )}
      </span>
    );
  });
};

export const EvaluationItem = ({ line, getEvaluationColor, onSelect }: EvaluationItemProps) => {
  return (
    <div
      className="p-2.5 hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.()}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-yellow-200/90 bg-yellow-200/10 px-2 py-0.5 rounded">
              {line.move}
            </span>
            <span className={cn('font-medium', getEvaluationColor(line.evaluation))}>
              {line.evaluationText}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {`Depth ${line.depth} • ${(parseInt(line.time) / 1000).toFixed(1)}s • ${parseInt(line.nodes).toLocaleString()} nodes`}
          </div>
        </div>
        <div className="text-xs leading-relaxed font-mono">
          {formatMoveSequence(line.sequence)}
        </div>
      </div>
    </div>
  );
};