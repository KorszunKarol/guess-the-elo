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
        <nav className="flex items-center justify-between px-6 py-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 h-20"> {/* Increased height and padding */}
            <Link href="/" className="hover:opacity-90 transition-opacity">
                <ChessLogo />
            </Link>
            <div className="flex items-center gap-8 ml-auto mr-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        className="text-gray-300 hover:text-white hover:bg-gray-700/50 h-10" // Increased button height
                        asChild
                    >
                        <Link href="#features">Features</Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-gray-300 hover:text-white hover:bg-gray-700/50 h-10" // Increased button height
                        asChild
                    >
                        <Link href="#how-to-play">How to Play</Link>
                    </Button>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        className="rounded-lg border-gray-600 hover:bg-gray-700/30 hover:border-gray-500 h-10" // Increased button height
                        asChild
                    >
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button
                        variant="gradient"
                        className="rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all h-10" // Increased button height
                        asChild
                    >
                        <Link href="/register">Play for Free</Link>
                    </Button>
                </div>
            </div>
            <Brain
                className="w-10 h-10 text-blue-400" // Increased icon size
                aria-hidden="true"
                size={40} // Increased size prop
                color="#60a5fa"
            />
        </nav>
    );
}