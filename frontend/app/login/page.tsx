'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChessBackground } from '@/components/landing/ChessBackground';
import { BackgroundDots } from '@/components/landing/BackgroundDots';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
            <BackgroundDots />
            {/* Background Elements */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-1/4 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            {/* Main Content */}
            <div className="container relative z-10 min-h-screen flex flex-col items-center justify-center py-16">
                {/* Brand Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                        Welcome Back to ChessDetective
                    </h1>
                    <p className="text-gray-400">
                        Continue your chess investigation journey
                    </p>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-full max-w-md"
                >
                    <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center">
                                <Link
                                    href="/"
                                    className="text-gray-400 hover:text-gray-300 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <CardTitle className="text-2xl font-bold text-blue-400 flex-grow text-center">
                                    Sign In
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="detective@example.com"
                                    className="bg-gray-900/50 border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    className="bg-gray-900/50 border-gray-700"
                                />
                            </div>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90">
                                Sign In
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-gray-400">
                                    Don't have an account?{' '}
                                </span>
                                <Link
                                    href="/register"
                                    className="text-blue-400 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8 flex gap-8 text-sm text-gray-400"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>1000+ active players</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Secure & Private</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span>Free to play</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
