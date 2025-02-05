'use client';

import { ChessBackground } from '@/components/sections/ChessBackground';
import { BackgroundDots } from '@/components/chess/BackgroundDots';

import { NavigationWrapper } from '@/components/sections/NavigationWrapper';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-gray-900 text-white relative">
      <div className="fixed inset-0 -z-50">
        <ChessBackground />
        <BackgroundDots />
      </div>
      <NavigationWrapper />
      <main className="relative z-10">{children}</main>
    </div>
  );
}


