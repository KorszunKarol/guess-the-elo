'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github } from 'lucide-react';
import { ChessBackground } from '@/components/sections/ChessBackground';
import { BackgroundDots } from '@components/chess/BackgroundDots';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
            <BackgroundDots />
            <ChessBackground />

            {/* Decorative Elements */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-1/4 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            {/* Main Content */}
            <div className="container relative z-10 min-h-screen flex flex-col items-center justify-start pt-4 pb-16">
                {/* Brand Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                        Welcome to ChessDetective
                    </h1>
                    <p className="text-gray-400">
                        Join our community of chess enthusiasts
                    </p>
                </motion.div>

                {/* Registration Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-full max-w-md"
                >
                    <Card className="bg-[#374151] backdrop-blur-sm bg-opacity-80">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center">
                                <Link
                                    href="/"
                                    className="text-gray-400 hover:text-gray-300 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <CardTitle className="text-2xl font-bold text-blue-500 flex-grow text-center">
                                    Create Account
                                </CardTitle>
                            </div>
                            <CardDescription className="text-gray-400 text-center">
                                Start your chess investigation journey
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="detective@example.com"
                                    className="bg-[#1f2937] border-0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    className="bg-[#1f2937] border-0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirm"
                                    type="password"
                                    className="bg-[#1f2937] border-0"
                                />
                            </div>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                                Create Account
                            </Button>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-600" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-[#374151] px-2 text-gray-500 uppercase">
                                        OR CONTINUE WITH
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full border border-gray-600 hover:bg-[#1f2937] text-gray-300"
                            >
                                <Github className="mr-2 h-4 w-4" />
                                Github
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-gray-500">
                                    Already have an account?{' '}
                                </span>
                                <Link
                                    href="/login"
                                    className="text-blue-500 hover:underline"
                                >
                                    Sign in
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
