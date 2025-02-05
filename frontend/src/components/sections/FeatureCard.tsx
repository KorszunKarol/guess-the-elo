'use client';

import { ReactNode } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    className?: string;
}

export function FeatureCard({
    icon,
    title,
    description,
    className,
}: FeatureCardProps) {
    return (
        <Card
            className={cn(
                'group relative overflow-hidden border-gray-800 bg-gray-950/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-gray-700 hover:shadow-lg',
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader>
                <div className="mb-2 rounded-lg bg-gray-900/50 p-3 w-fit">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
            </CardHeader>
            <CardContent>
                <p className="text-gray-400">{description}</p>
            </CardContent>
        </Card>
    );
}
