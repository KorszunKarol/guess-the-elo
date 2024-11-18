'use client';

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GamePreview } from './GamePreview';

interface StepProps {
  number: string;
  title: string;
  description: string;
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="flex gap-4">
      <div className="text-blue-400 font-bold text-xl">{number}</div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export function HowToPlaySection() {
  return (
    <section id="how-to-play" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            How to Play
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto relative">
            Start improving your chess analysis in simple steps
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <GamePreview />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <span className="text-blue-400 text-xl font-bold">01</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Select Your Mode</h3>
                  <p className="text-gray-600 dark:text-gray-400">Choose between Guess the Elo or Guess the Eval mode.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-blue-400 text-xl font-bold">02</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Study the Position</h3>
                  <p className="text-gray-600 dark:text-gray-400">Watch the moves or analyze the position carefully.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-blue-400 text-xl font-bold">03</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Make Your Prediction</h3>
                  <p className="text-gray-600 dark:text-gray-400">Enter your rating guess or evaluation prediction.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-blue-400 text-xl font-bold">04</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Learn and Improve</h3>
                  <p className="text-gray-600 dark:text-gray-400">See the correct answer and understand where you can improve.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}