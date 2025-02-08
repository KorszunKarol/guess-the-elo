'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { HowToPlaySection } from '@/components/sections/HowToPlaySection';
import { FAQSection } from '@/components/sections/FAQSection';
import { Footer } from '@/components/sections/Footer';
import { BackgroundDots } from '@/components/chess/BackgroundDots';
import Navigation from '@/components/sections/Navigation';


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <Navigation/>
      <BackgroundDots/>
      <HeroSection />
      <FeaturesSection />
      <HowToPlaySection />
      <FAQSection />
      <Footer />
    </div>
  );
}