'use client';

import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "€0",
    description: "Perfect for casual players",
    features: [
      "3 games per day",
      "Basic position analysis",
      "Public leaderboard access",
      "Basic statistics",
    ],
    limitations: [
      "No Stockfish support",
      "Limited game history",
      "Basic features only",
    ],
    buttonText: "Get Started",
    href: "/register",
    popular: false
  },
  {
    name: "Monthly",
    price: "€5",
    period: "/month",
    description: "For dedicated investigators",
    features: [
      "Unlimited games",
      "Full Stockfish analysis",
      "Detailed statistics",
      "Game history & review",
      "Advanced features",
      "Priority support",
    ],
    buttonText: "Subscribe Monthly",
    href: "/register?plan=monthly",
    popular: true
  },
  {
    name: "Yearly",
    price: "€48",
    period: "/year",
    description: "Best value for enthusiasts",
    features: [
      "Everything in Monthly",
      "2 months free",
      "Early access to features",
      "Custom analysis tools",
      "Premium badge",
      "Priority support",
    ],
    buttonText: "Subscribe Yearly",
    href: "/register?plan=yearly",
    popular: false
  }
];

export default function PricingPage() {
  return (
    <div className="container relative min-h-screen py-16">
      <div className="flex items-center justify-between mb-12">
        <Link href="/" className="text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back to home
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Pricing Plans
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: plans.indexOf(plan) * 0.1 }}
          >
            <Card className={`relative h-full ${plan.popular ? 'border-blue-500' : 'border-gray-800'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-400">{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-green-500" />
                      {feature}
                    </div>
                  ))}
                  {plan.limitations && plan.limitations.map((limitation) => (
                    <div key={limitation} className="flex items-center gap-2 text-gray-500 line-through">
                      <Check className="w-5 h-5" />
                      {limitation}
                    </div>
                  ))}
                </div>
                <Link href={plan.href}>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}