import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GameControlsProps {
    onPrevMove: () => void;
    onNextMove: () => void;
    canGoPrev: boolean;
    canGoNext: boolean;
}

function GameControls({
    onPrevMove,
    onNextMove,
    canGoPrev,
    canGoNext,
}: GameControlsProps) {
    return (
        <div className="flex justify-center gap-4 mt-4">
            <Button onClick={onPrevMove} disabled={!canGoPrev}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={onNextMove} disabled={!canGoNext}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    );
}

export { GameControls };
