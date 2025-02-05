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
          <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" rx="2" />
          <rect x="4" y="4" width="8" height="8" className="opacity-40" />
          <rect x="12" y="12" width="8" height="8" className="opacity-40" />
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
    <nav className="flex justify-between items-center mb-16">
      <Link href="/" className="hover:opacity-90 transition-opacity">
        <ChessLogo />
      </Link>
      <div className="flex items-center gap-6">
        <a href="#features" className="text-white hover:text-blue-400 transition-colors">Features</a>
        <a href="#how-to-play" className="text-white hover:text-blue-400 transition-colors">How to Play</a>
        <Link href="/login">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold">
            Play for Free
          </button>
        </Link>
      </div>
    </nav>
  );
}