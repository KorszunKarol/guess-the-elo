import { ArrowRight } from 'lucide-react';
import { Navigation } from './Navigation';

export function HeroSection() {
  return (
    <header className="container mx-auto px-4 py-16">
      <Navigation />
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
          Master Chess Analysis
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl">
          Challenge your analytical skills with our innovative chess rating and position evaluation game. 
          Train like a grandmaster, think like an engine.
        </p>
        <div className="relative w-full max-w-2xl mb-12">
          <img
            src="https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&q=80"
            alt="Chess position analysis"
            className="rounded-xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent"></div>
        </div>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-colors text-lg">
          Start Analyzing <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}