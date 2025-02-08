import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  onReset: () => void;
  onFlipBoard: () => void;
}
function GameControls({ onReset, onFlipBoard }: GameControlsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        aria-label="Reset Position"
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onFlipBoard}
        aria-label="Flip Board"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      {/* Add other controls (e.g., surrender) here */}
    </div>
  );
}

export default GameControls;