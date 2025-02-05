'use client';

import { Brain, Target } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function FeaturesSection() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <section id="features" className="py-12 -mt-8">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                        Game Modes
                    </h2>
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
                        <FeatureCard
                            icon={<Target className="w-6 h-6 text-blue-400" />}
                            title="Guess the Elo"
                            description="Watch a game and guess the players' rating. Test your ability to recognize skill levels from gameplay patterns."
                            href="/play/elo"
                        />
                    </motion.div>
                    <motion.div variants={item}>
                        <FeatureCard
                            icon={<Brain className="w-6 h-6 text-purple-400" />}
                            title="Guess the Eval"
                            description="Analyze positions and predict the engine evaluation. Sharpen your tactical and positional assessment skills."
                            href="/play/eval"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
