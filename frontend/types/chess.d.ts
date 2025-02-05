declare module 'chess' {
  interface ChessBoardProps {
    position: string;
    onMove: (move: string) => void;
    className?: string;
  }

  interface ChessControlsProps {
    onFlipBoard: () => void;
    onReset: () => void;
    className?: string;
  }

  interface ChessContainerProps {
    children: React.ReactNode;
    className?: string;
  }
}