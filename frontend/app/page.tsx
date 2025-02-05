'use client';

import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowToPlaySection } from '../components/landing/HowToPlaySection';
import { FAQSection } from '../components/landing/FAQSection';
import { Footer } from '../components/landing/Footer';
import { BackgroundDots } from './guess-the-elo/components/BackgroundDots';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <BackgroundDots />
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowToPlaySection />
        <FAQSection />
        <Footer />
      </div>
    </div>
  );
}