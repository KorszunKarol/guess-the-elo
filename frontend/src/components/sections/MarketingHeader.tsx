'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function MarketingHeader() {
  const pathname = usePathname();

  return (
    <header className="relative z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              ChessDetective
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              className={cn(
                "text-gray-300 hover:text-white transition-colors",
                pathname === '/features' && 'text-white font-medium'
              )}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "text-gray-300 hover:text-white transition-colors",
                pathname === '/pricing' && 'text-white font-medium'
              )}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-gray-300 hover:text-white transition-colors",
                pathname === '/about' && 'text-white font-medium'
              )}
            >
              About
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}