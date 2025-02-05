'use client';

import { Brain, Target } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import Link from 'next/link';
import { motion } from "framer-motion";

export function FeaturesSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Game Modes</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Two challenging modes to test your chess analysis skills
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <motion.div variants={item}>
            <Link href="/guess-the-elo" className="block">
              <FeatureCard
                icon={<Brain className="w-8 h-8 text-blue-400" />}
                title="Guess the Elo"
                description="Watch a game sequence and predict the players' rating. Can you tell a 1200 from a 2000? Put your analytical skills to the test!"
              />
            </Link>
          </motion.div>
          <motion.div variants={item}>
            <Link href="/guess-the-eval" className="block">
              <FeatureCard
                icon={<Target className="w-8 h-8 text-purple-400" />}
                title="Guess the Eval"
                description="Analyze critical positions and guess the engine evaluation. Train your ability to assess positions like a chess engine!"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}