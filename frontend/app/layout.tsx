import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ChessBackground } from '@/components/landing/ChessBackground';
import { ToasterProvider } from '@/components/providers/toaster-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChessDetective - Guess Ratings & Evaluations',
  description: 'Investigate chess positions, solve rating mysteries, and uncover engine evaluations in this unique chess analysis game.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen bg-gray-900 text-gray-50`}>
        <div className="fixed inset-0 z-0">
          <ChessBackground />
        </div>
        <div className="relative z-10">
          {children}
        </div>
        <ToasterProvider />
      </body>
    </html>
  );
}