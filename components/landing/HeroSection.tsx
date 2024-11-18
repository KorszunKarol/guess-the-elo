'use client';

import { ArrowRight } from 'lucide-react';
import { Navigation } from './Navigation';
import Link from 'next/link';
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <header className="container mx-auto px-4 py-16">
      <Navigation />
      <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Your personal chess analysis trainer
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl">
          Challenge your analytical skills with our innovative chess rating and position evaluation game.
          Train like a grandmaster, think like an engine.
        </p>

        {/* Device Mockup */}
        <div className="relative w-full max-w-4xl mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Laptop Frame */}
            <div className="relative mx-auto w-full max-w-4xl aspect-[16/10] bg-gray-800 rounded-t-2xl p-4 shadow-2xl">
              {/* Screen Content */}
              <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-4">
                  {/* Chess Board Side */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <img
                      src="/chess-position.png"
                      alt="Chess Position"
                      className="w-full rounded-lg"
                    />
                  </div>
                  {/* Analysis Side */}
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-800 rounded-lg w-3/4"></div>
                    <div className="h-32 bg-gray-800 rounded-lg"></div>
                    <div className="h-8 bg-gray-800 rounded-lg w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Laptop Base */}
            <div className="relative mx-auto w-[95%] h-4 bg-gray-800 rounded-b-xl"></div>
            <div className="relative mx-auto w-[40%] h-1 bg-gray-700 rounded-b-xl"></div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 inset-0 blur-3xl opacity-20 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        </div>

        <Link
          href="/guess-the-elo"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-colors text-lg"
        >
          Start Analyzing <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}