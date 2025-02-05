import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChessControlsProps {
  onFlipBoard: () => void;
  onReset: () => void;
  className?: string;
}

export const ChessControls = ({ onFlipBoard, onReset, className }: ChessControlsProps) => (
  <div className={cn("flex gap-4 justify-center", className)}>
    <Button variant="outline" onClick={onFlipBoard}>
      Flip Board
    </Button>
    <Button variant="outline" onClick={onReset}>
      Reset Position
    </Button>
  </div>
);