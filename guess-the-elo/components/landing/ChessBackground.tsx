'use client';

import { useEffect, useState } from 'react';
import styles from './ChessBackground.module.css';

const chessPieces = [
  {
    name: 'pawn',
    path: 'M 22,9 C 19.79,9 18,10.79 18,13 C 18,13.89 18.29,14.71 18.78,15.38 C 16.83,16.5 15.5,18.59 15.5,21 C 15.5,23.03 16.44,24.84 17.91,26.03 C 14.91,27.09 10.5,31.58 10.5,39.5 L 33.5,39.5 C 33.5,31.58 29.09,27.09 26.09,26.03 C 27.56,24.84 28.5,23.03 28.5,21 C 28.5,18.59 27.17,16.5 25.22,15.38 C 25.71,14.71 26,13.89 26,13 C 26,10.79 24.21,9 22,9 z'
  },
  {
    name: 'knight',
    path: 'M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18'
  },
  {
    name: 'bishop',
    path: 'M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z'
  },
  {
    name: 'rook',
    path: 'M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14'
  }
];

export function ChessBackground() {
  const [pieces, setPieces] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    piece: typeof chessPieces[number];
    delay: number;
  }>>([]);

  useEffect(() => {
    const particleCount = 30;
    const newPieces = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 40,
      rotation: Math.random() * 360,
      piece: chessPieces[Math.floor(Math.random() * chessPieces.length)],
      delay: Math.random() * 5
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={styles.chessPiece}
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 45 45"
            className="w-full h-full opacity-20 dark:opacity-40 text-gray-400 dark:text-blue-400"
          >
            <path
              d={piece.piece.path}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              transform={`rotate(${piece.rotation}, 22.5, 22.5)`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}