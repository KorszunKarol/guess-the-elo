'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
        <div className="w-full">
            <nav className="relative flex items-center justify-between px-6 h-16">
                <Link href="/" className="hover:opacity-90 transition-opacity z-50">
                    <ChessLogo />
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="top-4  flex max-w-fit rounded-full backdrop-blur-lg bg-white/5 shadow-[0_0_30px_-5px_rgba(0,0,0,0.2)] px-4 py-2 items-center justify-center space-x-4"
                >
                    <Link
                        href="#features"
                        className="relative text-gray-300 hover:text-blue-400 transition-colors px-3 py-1"
                    >
                        Features
                    </Link>
                    <Link
                        href="#how-to-play"
                        className="relative text-gray-300 hover:text-blue-400 transition-colors px-3 py-1"
                    >
                        How to Play
                    </Link>
                    <Link
                        href="#pricing"
                        className="relative text-gray-300 hover:text-blue-400 transition-colors px-3 py-1"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="#contact"
                        className="relative text-gray-300 hover:text-blue-400 transition-colors px-3 py-1"
                    >
                        Contact
                    </Link>
                </motion.div>

                <div className="flex items-center z-50">
                    <Button
                        variant="default"
                        className="h-12 px-6 bg-gradient-to-r from-blue-400 to-purple-600 text-white shadow-lg"
                        asChild
                    >
                        <Link href="/register">Play for Free</Link>
                    </Button>
                </div>
            </nav>
        </div>
    );
}

export default Navigation;