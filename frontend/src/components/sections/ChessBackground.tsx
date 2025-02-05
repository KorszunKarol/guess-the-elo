'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Different geometric shapes
const shapes = [
    {
        type: 'circle',
        render: (size: number) => (
            <circle cx={size / 2} cy={size / 2} r={size / 3} />
        ),
    },
    {
        type: 'square',
        render: (size: number) => (
            <rect
                width={size * 0.6}
                height={size * 0.6}
                x={size * 0.2}
                y={size * 0.2}
            />
        ),
    },
    {
        type: 'triangle',
        render: (size: number) => {
            const center = size / 2;
            const third = size / 3;
            return (
                <polygon
                    points={`${center},${third} ${center + third},${center + third} ${center - third},${center + third}`}
                />
            );
        },
    },
    {
        type: 'diamond',
        render: (size: number) => {
            const center = size / 2;
            const third = size / 3;
            return (
                <polygon
                    points={`${center},${third} ${center + third},${center} ${center},${center + third} ${center - third},${center}`}
                />
            );
        },
    },
];

export function ChessBackground() {
    return (
        <div className="fixed inset-0 -z-50" role="presentation" aria-hidden="true">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />

            {/* Dot pattern */}
            <div className="absolute inset-0 bg-dot-pattern opacity-60" />

            {/* Bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
        </div>
    );
}
