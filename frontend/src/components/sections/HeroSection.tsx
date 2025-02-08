'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Icon } from '@/components/ui/icon';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

const RetroGrid = ({
    angle = 65,
    cellSize = 60,
    opacity = 0.5,
    lightLineColor = "gray",
    darkLineColor = "gray",
}) => {
    const gridStyles = {
        "--grid-angle": `${angle}deg`,
        "--cell-size": `${cellSize}px`,
        "--opacity": opacity,
        "--light-line": lightLineColor,
        "--dark-line": darkLineColor,
    } as React.CSSProperties;

    return (
        <div
            className={
                "pointer-events-none fixed inset-0 overflow-hidden [perspective:200px] " +
                `opacity-[var(--opacity)]`
            }
            style={gridStyles}
        >
            <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
                <div
                    className="animate-grid [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent to-90%" />
        </div>
    );
};

export function HeroSection() {
    return (
        <section className="relative h-screen flex flex-col justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-purple-950/10 dark:bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.5),rgba(255,255,255,0))]" />
                <RetroGrid
                    lightLineColor="hsl(240 5.9% 90%)"
                    darkLineColor="hsl(240 3.7% 15.9%)"
                    opacity={0.7}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
                <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000 filter drop-shadow-lg">
                        ChessDetective
                    </h1>
                    <div className="mb-12 max-w-2xl">
                        <TextGenerateEffect
                            words="Test your chess intuition by guessing player ratings and engine evaluations. Sharpen your understanding of the game."
                            className="text-lg md:text-xl text-gray-300"
                            filter={true}
                            duration={0.05}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <Link
                            href="/register"
                            className="group bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:opacity-90 text-white px-12 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                        >
                            <span className="text-lg">Play for Free</span>
                            <Icon name={ArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </Link>
                        <p className="text-gray-400 text-sm">
                            No credit card required • Start playing instantly
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
        </section>
    );
}
