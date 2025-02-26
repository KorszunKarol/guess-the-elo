'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
};

export function Spinner({
  className,
  size = 'md',
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('animate-spin text-muted-foreground', className)}
      {...props}
    >
      <Loader2 className={cn(sizeClasses[size], 'animate-spin')} />
      <span className="sr-only">Loading</span>
    </div>
  );
}