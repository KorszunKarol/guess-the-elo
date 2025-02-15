'use client';

import { Brain, Target, Swords } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    className?: string;
}

function FeatureCard({ icon, title, description, href, className }: FeatureCardProps) {
    return (
        <Link href={href}>
            <div
                className={cn(
                    "relative flex h-48 w-[24rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border bg-slate-950/50 backdrop-blur-sm px-6 py-4 transition-all duration-700 hover:border-white/20 hover:bg-slate-900/50",
                    className
                )}
            >
                <div className="flex items-center gap-3">
                    <span className="relative inline-block rounded-full bg-blue-950/80 p-2">
                        {icon}
                    </span>
                    <p className="text-xl font-medium text-blue-400">{title}</p>
                </div>
                <p className="text-gray-300 text-lg">{description}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700" />
            </div>
        </Link>
    );
}

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
        <section id="features" className="relative py-12 -mt-8 overflow-hidden min-h-[32rem]">
            {/* Background gradients */}
            <div className="absolute inset-0">
                {/* Top gradient that matches hero bottom */}
                <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950 pointer-events-none" />
                {/* Base background */}
                <div className="absolute inset-0 bg-slate-950" />
                {/* Bottom gradient to blend with next section */}
                <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-gray-900 via-slate-950 to-slate-950 pointer-events-none" />
            </div>
            {/* Dot pattern with masks */}
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,white_15%,white_85%,transparent)]">
                <DotPattern
                    width={32}
                    height={32}
                    cx={16}
                    cy={16}
                    cr={1.2}
                    className="absolute inset-0 h-full w-full opacity-90 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)] dark:fill-white/40"
                />
            </div>
            <div className="container relative mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                        Game Modes
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Three challenging modes to test your chess analysis skills
                    </p>
                </motion.div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid [grid-template-areas:'stack'] place-items-center perspective-[1000px]"
                >
                    <motion.div variants={item} className="relative z-30">
                        <FeatureCard
                            icon={<Target className="w-6 h-6 text-blue-400" />}
                            title="Guess the Elo"
                            description="Watch a game and guess the players' rating. Test your ability to recognize skill levels from gameplay patterns."
                            href="/play/elo"
                            className="[grid-area:stack] -translate-x-8 hover:translate-x-4 hover:-translate-y-2 hover:rotate-1 transition-all duration-300 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent hover:before:opacity-100 before:opacity-0 before:transition-opacity"
                        />
                    </motion.div>
                    <motion.div variants={item} className="relative z-20">
                        <FeatureCard
                            icon={<Brain className="w-6 h-6 text-purple-400" />}
                            title="Guess the Eval"
                            description="Analyze positions and predict the engine evaluation. Sharpen your tactical and positional assessment skills."
                            href="/play/eval"
                            className="[grid-area:stack] translate-x-8 hover:translate-x-16 hover:-translate-y-2 hover:rotate-1 transition-all duration-300 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent hover:before:opacity-100 before:opacity-0 before:transition-opacity"
                        />
                    </motion.div>
                    <motion.div variants={item} className="relative z-10">
                        <FeatureCard
                            icon={<Swords className="w-6 h-6 text-green-400" />}
                            title="Stockfish Analysis"
                            description="Deep dive into positions with Stockfish engine analysis. Understand the critical moments and best moves."
                            href="/analysis"
                            className="[grid-area:stack] translate-x-24 hover:translate-x-32 hover:-translate-y-2 hover:rotate-1 transition-all duration-300 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent hover:before:opacity-100 before:opacity-0 before:transition-opacity"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
