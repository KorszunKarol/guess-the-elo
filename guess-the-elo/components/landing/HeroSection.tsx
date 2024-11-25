'use client';

import { ArrowRight } from 'lucide-react';
import { Navigation } from './Navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { ChessBackground } from './ChessBackground';

export function HeroSection() {
  return (
    <header className="relative min-h-[60vh] flex flex-col">
      <ChessBackground />
      <div className="container relative z-10 mx-auto px-4 py-8 flex-1 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center -mt-20">
          <div className="flex flex-col items-center text-center max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
            >
              ChessDetective
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl"
            >
              Test your chess analysis skills! Can you guess player ratings and engine evaluations?
              Join thousands of players improving their chess understanding.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex flex-col items-center gap-4">
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white px-12 py-4 rounded-lg font-semibold flex items-center gap-2 transition-colors text-lg"
                >
                  Play for Free <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-gray-400 text-sm">
                  No credit card required • Start playing instantly
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}