import { Brain, Target } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-dark-lighter">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Game Modes</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Two challenging modes to test your chess analysis skills
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <FeatureCard
            icon={<Brain className="w-8 h-8 text-yellow-500" />}
            title="Guess the Elo"
            description="Watch a game sequence and predict the players' rating. Can you tell a 1200 from a 2000? Put your analytical skills to the test!"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8 text-yellow-500" />}
            title="Guess the Eval"
            description="Analyze critical positions and guess the engine evaluation. Train your ability to assess positions like a chess engine!"
          />
        </div>
      </div>
    </section>
  );
}