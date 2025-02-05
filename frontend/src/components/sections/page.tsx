'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { HowToPlaySection } from '@/components/sections/HowToPlaySection';
import { FAQSection } from '@/components/sections/FAQSection';
import { Footer } from '@/components/sections/Footer';
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
