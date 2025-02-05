import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Square } from 'lucide-react';

interface BoardControlsProps {
    onPrevMove?: () => void;
    onNextMove?: () => void;
    onReset?: () => void;
    onFlipBoard?: () => void;
    canGoPrev?: boolean;
    canGoNext?: boolean;
    showNavigationControls?: boolean;
}

function BoardControls({
    onPrevMove,
    onNextMove,
    onReset,
    onFlipBoard,
    canGoPrev = false,
    canGoNext = false,
    showNavigationControls = true,
}: BoardControlsProps) {
    return (
        <div className="flex items-center justify-center gap-2 mt-2">
            {showNavigationControls && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-gray-900/80 hover:bg-gray-800"
                        onClick={onPrevMove}
                        disabled={!canGoPrev}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-gray-900/80 hover:bg-gray-800"
                        onClick={onNextMove}
                        disabled={!canGoNext}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </>
            )}
            {onFlipBoard && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-gray-900/80 hover:bg-gray-800"
                    onClick={onFlipBoard}
                >
                    <Square className="h-4 w-4" />
                </Button>
            )}
            {onReset && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-gray-900/80 hover:bg-gray-800"
                    onClick={onReset}
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}

export { BoardControls };