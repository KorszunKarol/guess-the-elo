'use client';

import { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import { LoadingSpinner } from './LoadingSpinner';

interface ChessSceneProps {
  className?: string;
}

export function ChessScene({ className }: ChessSceneProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Spline
        scene="https://prod.spline.design/your-scene-id/scene.splinecode"
        className={className}
      />
    </Suspense>
  );
}