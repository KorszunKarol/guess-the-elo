'use client';

import Link from 'next/link';

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

export function Footer() {
    return (
        <footer className="bg-gray-800 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-4">
                    <Link href="/" className="hover:opacity-90 transition-opacity">
                        <ChessLogo />
                    </Link>
                    <p className="text-gray-400 text-sm text-center">
                        © {new Date().getFullYear()} ChessDetective. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
