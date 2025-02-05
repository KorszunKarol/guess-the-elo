'use client';

import { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: LucideIcon;
  className?: string;
}

export function Icon({ name: Icon, className, ...props }: IconProps) {
  return (
    <Icon
      className={cn('', className)}
      strokeWidth={1.5}
      {...props}
    />
  );
}