import { Sparkles } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="flex justify-between items-center mb-16">
      <div className="flex items-center gap-2">
        <Sparkles className="w-8 h-8 text-yellow-500" />
        <span className="text-xl font-bold">GameIQ</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="#features" className="hover:text-yellow-400 transition-colors">Features</a>
        <a href="#how-to-play" className="hover:text-yellow-400 transition-colors">How to Play</a>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors">
          Play Now
        </button>
      </div>
    </nav>
  );
}