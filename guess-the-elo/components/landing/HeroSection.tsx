'use client';

import { ArrowRight } from 'lucide-react';
import { Navigation } from './Navigation';
import Link from 'next/link';
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <header className="container mx-auto px-4 py-16">
      <Navigation />
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
        >
          ChessDetective
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-300 mb-8 max-w-2xl"
        >
          Investigate chess positions, solve rating mysteries, and uncover engine evaluations.
          Join our community of chess detectives today!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex gap-4">
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-colors text-lg"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </header>
  );
}