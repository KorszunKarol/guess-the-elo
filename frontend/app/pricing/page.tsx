'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BackgroundDots } from '@components/chess/BackgroundDots';
import { useState } from 'react';
import { stripePromise } from '@/lib/stripe';
import { useToast } from '@/components/ui/use-toast';

const plans = [
    {
        name: 'Free',
        price: '€0',
        description: 'Perfect for casual players',
        features: [
            '3 games per day',
            'Basic position analysis',
            'Public leaderboard access',
            'Basic statistics',
        ],
        limitations: [
            'No Stockfish support',
            'Limited game history',
            'Basic features only',
        ],
        buttonText: 'Get Started',
        href: '/register',
        popular: false,
    },
    {
        name: 'Monthly',
        price: '€5',
        period: '/month',
        description: 'For dedicated investigators',
        features: [
            'Unlimited games',
            'Full Stockfish analysis',
            'Detailed statistics',
            'Game history & review',
            'Advanced features',
            'Priority support',
        ],
        buttonText: 'Subscribe Monthly',
        href: '/register?plan=monthly',
        popular: true,
    },
    {
        name: 'Yearly',
        price: '€48',
        period: '/year',
        description: 'Best value for enthusiasts',
        features: [
            'Everything in Monthly',
            '2 months free',
            'Early access to features',
            'Custom analysis tools',
            'Premium badge',
            'Priority support',
        ],
        buttonText: 'Subscribe Yearly',
        href: '/register?plan=yearly',
        popular: false,
    },
];

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSubscribe = async (plan: (typeof plans)[0]) => {
        try {
            setLoading(plan.name);

            // If it's the free plan, redirect to registration
            if (plan.price === '€0') {
                window.location.href = plan.href;
                return;
            }

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: plan.price,
                    planType: plan.name.toLowerCase(),
                }),
            });

            const { sessionId, error } = await response.json();

            if (error) {
                throw new Error(error);
            }

            const stripe = await stripePromise;
            const { error: stripeError } = await stripe!.redirectToCheckout({
                sessionId,
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'Something went wrong. Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white relative">
            <BackgroundDots />
            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
                    >
                        Choose Your Plan
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg"
                    >
                        Unlock your full potential with our premium features
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                        >
                            <Card
                                className={`relative h-full bg-gray-800 border-gray-700 ${
                                    plan.popular ? 'border-blue-500' : ''
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-bold">
                                            {plan.price}
                                        </span>
                                        {plan.period && (
                                            <span className="text-gray-400 ml-2">
                                                {plan.period}
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <div
                                                key={feature}
                                                className="flex items-center"
                                            >
                                                <Check className="h-5 w-5 text-green-500 mr-2" />
                                                <span className="text-gray-300">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                        {plan.limitations && (
                                            <div className="pt-3 border-t border-gray-700">
                                                {plan.limitations.map(
                                                    (limitation) => (
                                                        <div
                                                            key={limitation}
                                                            className="flex items-center text-gray-400"
                                                        >
                                                            <span className="h-5 w-5 mr-2">
                                                                -
                                                            </span>
                                                            <span>
                                                                {limitation}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className={`w-full ${
                                            plan.popular
                                                ? 'bg-blue-500 hover:bg-blue-600'
                                                : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                        onClick={() => handleSubscribe(plan)}
                                        disabled={loading === plan.name}
                                    >
                                        {loading === plan.name ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            plan.buttonText
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-16 text-gray-400"
                >
                    <p>All plans include a 14-day money-back guarantee</p>
                    <p className="mt-2">
                        Have questions?{' '}
                        <a href="#" className="text-blue-400 hover:underline">
                            Contact us
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
