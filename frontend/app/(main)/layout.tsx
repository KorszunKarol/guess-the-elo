'use client';

import { usePathname } from 'next/navigation';
import { ChessBackground } from '@/components/sections/ChessBackground';
import { BackgroundDots } from '@/components/chess/BackgroundDots';
import { NavigationWrapper } from '@/components/sections/NavigationWrapper';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] grid grid-rows-[auto_1fr] bg-gray-900 text-white">
      <ChessBackground />
      <BackgroundDots />

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl h-[calc(100dvh-160px)]">
        {children}
      </main>
    </div>
  );
}