'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold">Chess Insight</span>
          </Link>
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Chess Insight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}