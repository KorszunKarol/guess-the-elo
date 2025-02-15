"use client";

import { Pricing } from "@/components/blocks/pricing";

const chessPricingPlans = [
  {
    name: "FREE",
    price: "0",
    yearlyPrice: "0",
    period: "forever",
    features: [
      "10 Elo guessing games per day",
      "5 Engine evaluation games per day",
      "Basic game analysis",
      "Public leaderboard access",
      "Community features",
    ],
    description: "Perfect for casual players and beginners",
    buttonText: "Start Playing",
    href: "/register",
    isPopular: false,
  },
  {
    name: "GRANDMASTER",
    price: "9.99",
    yearlyPrice: "7.99",
    period: "per month",
    features: [
      "Unlimited Elo guessing games",
      "Unlimited Engine evaluation games",
      "Advanced game analysis",
      "Detailed performance statistics",
      "Priority access to new features",
      "Ad-free experience",
      "Premium leaderboard badge",
    ],
    description: "For serious chess enthusiasts and competitors",
    buttonText: "Upgrade Now",
    href: "/checkout?plan=grandmaster",
    isPopular: true,
  },
  {
    name: "WORLD CHAMPION",
    price: "19.99",
    yearlyPrice: "15.99",
    period: "per month",
    features: [
      "Everything in Grandmaster",
      "Custom training programs",
      "Personal progress tracking",
      "Advanced analytics dashboard",
      "Early access to new features",
      "Priority support",
      "Exclusive monthly challenges",
      "Custom profile themes",
    ],
    description: "For professional players and coaches",
    buttonText: "Go Premium",
    href: "/checkout?plan=champion",
    isPopular: false,
  },
];

const switchStyles = {
  track: {
    checked: 'bg-gradient-to-r from-blue-500 to-purple-600',
    unchecked: 'bg-gray-700'
  },
  thumb: 'bg-white'
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <Pricing
          plans={chessPricingPlans}
          title="Choose Your Path to Chess Mastery"
          description="Select the plan that matches your ambition\nAll plans include core features and regular updates to enhance your chess analysis skills."
          switchStyles={switchStyles}
        />
      </div>
    </div>
  );
}
