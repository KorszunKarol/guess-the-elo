'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { StockfishLine } from '@/types/stockfish';

interface EvaluationItemProps {
  line: StockfishLine;
  getEvaluationColor: (value: number) => string;
  onSelect?: () => void;
  isMainLine?: boolean;
}

// Add utility to format move sequence with numbers
const formatMoveSequence = (moves: string[]): ReactNode[] => {
  // Early return if no moves
  if (!moves || moves.length === 0) {
    return [];
  }

  // Group moves into pairs (white move + black move)
  // This ensures we keep move pairs together which is more natural for chess notation
  const PAIRS_PER_LINE = 2; // 2 pairs = 4 moves per line
  const lines: ReactNode[][] = [];

  // Calculate how many full move pairs we have
  const totalPairs = Math.ceil(moves.length / 2);

  // Group moves into separate lines by pairs
  for (let pairIndex = 0; pairIndex < totalPairs; pairIndex += PAIRS_PER_LINE) {
    const formattedLine: ReactNode[] = [];

    // Process each pair in this line
    for (let i = 0; i < PAIRS_PER_LINE && pairIndex + i < totalPairs; i++) {
      const moveIndex = (pairIndex + i) * 2;
      const moveNumber = pairIndex + i + 1;

      // Add move number
      formattedLine.push(
        <span key={`num-${moveIndex}`} className="text-gray-600 mr-1 select-none">{moveNumber}.</span>
      );

      // Add white move if available
      if (moveIndex < moves.length) {
        formattedLine.push(
          <span
            key={`move-${moveIndex}`}
            className="font-medium text-blue-300/90"
          >
            {moves[moveIndex]}
          </span>
        );
      }

      // Add space after white move
      formattedLine.push(
        <span key={`space-${moveIndex}`} className="mx-1.5 text-gray-700 select-none"></span>
      );

      // Add black move if available
      if (moveIndex + 1 < moves.length) {
        formattedLine.push(
          <span
            key={`move-${moveIndex + 1}`}
            className="font-medium text-red-300/90"
          >
            {moves[moveIndex + 1]}
          </span>
        );
      }

      // Add space between pairs (except for the last pair in a line)
      if (i < PAIRS_PER_LINE - 1 && pairIndex + i < totalPairs - 1) {
        formattedLine.push(
          <span key={`pair-space-${moveIndex}`} className="mx-3 select-none"></span>
        );
      }
    }

    lines.push(formattedLine);
  }

  // Return an array of divs, each containing a line of moves
  return lines.map((line, idx) => (
    <div key={`line-${idx}`} className="flex flex-wrap items-center mb-2">
      {line}
    </div>
  ));
};

export const EvaluationItem = ({
  line,
  getEvaluationColor,
  onSelect,
  isMainLine = false
}: EvaluationItemProps) => {
  return (
    <div
      className={cn(
        "p-2.5 rounded-lg transition-all duration-300 cursor-pointer",
        isMainLine ? "bg-gray-800/30" : "hover:bg-gray-800/50",
        "transform transition-transform duration-300 ease-in-out"
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.()}
    >
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-medium px-2 py-0.5 rounded transition-colors duration-300",
              isMainLine ? "bg-yellow-300/20 text-yellow-200" : "bg-yellow-200/10 text-yellow-200/90"
            )}>
              {line.move}
            </span>
            <span className={cn('font-medium transition-colors duration-300', getEvaluationColor(line.evaluation))}>
              {line.evaluationText}
            </span>
          </div>
        </div>
        <div className="text-xs leading-relaxed font-mono space-y-1 transition-all duration-300">
          {formatMoveSequence(line.sequence)}
        </div>
      </div>
    </div>
  );
};