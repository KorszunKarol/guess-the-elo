import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PanelProps {
    children: ReactNode;
    zIndex?: number;
    className?: string;
}

export function Panel({ children, zIndex = 10, className }: PanelProps) {
    return (
        <div
            style={{ zIndex }}
            className={cn(
                "bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/30 shadow-xl",
                "flex-1 overflow-hidden",
                className
            )}
        >
            {children}
        </div>
    );
}