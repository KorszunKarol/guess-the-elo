'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

function ChessLogo() {
    return (
        <div className="flex items-center gap-2">
            <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                className="text-blue-400"
            >
                <g fill="currentColor">
                    <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        rx="2"
                    />
                    <rect
                        x="4"
                        y="4"
                        width="8"
                        height="8"
                        className="opacity-40"
                    />
                    <rect
                        x="12"
                        y="12"
                        width="8"
                        height="8"
                        className="opacity-40"
                    />
                </g>
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                ChessDetective
            </span>
        </div>
    );
}

export function Navigation() {
    return (
        <div className="sticky top-0 z-50 w-full">
            {/* Blur layer - sits between background and content */}
            <div className="absolute inset-0 -z-20 backdrop-blur-md" />

            {/* Border - needs to be above blur layer */}
            <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Navigation content */}
            <nav className="relative flex items-center justify-between px-6 py-6">
                <Link href="/" className="hover:opacity-90 transition-opacity">
                    <ChessLogo />
                </Link>
                <div className="flex items-center gap-10 ml-auto mr-16 text-lg">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="secondary"
                            className="h-12 px-6"
                            asChild
                        >
                            <Link href="#features">Features</Link>
                        </Button>
                        <Button
                            variant="secondary"
                            className="h-12 px-6"
                            asChild
                        >
                            <Link href="#how-to-play">How to Play</Link>
                        </Button>
                        <Button
                            variant="secondary"
                            className="h-12 px-6"
                            asChild
                        >
                            <Link href="#how-to-play">Pricing</Link>
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="default"
                            className="h-12 px-6 bg-gradient-to-r from-blue-400 to-purple-600 text-white"
                            asChild
                        >
                            <Link href="/register">Play for Free</Link>
                        </Button>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navigation;