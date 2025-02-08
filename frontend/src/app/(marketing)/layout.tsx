'use client';

import { ChessBackground } from '@/components/sections/ChessBackground';
import { BackgroundDots } from '@/components/chess/BackgroundDots';
import { Navigation } from '@/components/sections/Navigation';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-gray-900 text-white relative overflow-x-hidden">
      <main className="relative z-10">{children}</main>
    </div>
  );
}


