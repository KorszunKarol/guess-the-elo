'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { ChessBackground } from '@/components/sections/ChessBackground';
import { BackgroundDots } from '@/components/chess/BackgroundDots';
import { RetroGrid } from "@/components/ui/retro-grid";

function ChessLogo() {
    return (
        <Link href="/" className="flex items-center gap-2 absolute top-4 left-4 hover:opacity-80 transition-opacity">
            <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                className="text-blue-400"
            >
                <g fill="currentColor">
                    <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        rx="2"
                    />
                    <rect
                        x="4"
                        y="4"
                        width="8"
                        height="8"
                        className="opacity-40"
                    />
                    <rect
                        x="12"
                        y="12"
                        width="8"
                        height="8"
                        className="opacity-40"
                    />
                </g>
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                ChessDetective
            </span>
        </Link>
    );
}

export default function RegisterPage() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle registration logic here
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            <ChessLogo />
            <RetroGrid />

            <div className="max-w-md w-full mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        ChessDetective
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Create your free account
                    </p>
                </motion.div>

                <div className="w-full bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10"
                    >
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <LabelInputContainer>
                                    <Label className="text-gray-300">Email</Label>
                                    <Input
                                        placeholder="chessmaster@example.com"
                                        type="email"
                                        className="bg-gray-900 border-gray-700 text-white focus:border-blue-500"
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label className="text-gray-300">Password</Label>
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        className="bg-gray-900 border-gray-700 text-white focus:border-blue-500"
                                    />
                                </LabelInputContainer>
                            </div>

                            <button
                                className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                                type="submit"
                            >
                                Create Account
                            </button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg border border-gray-700 transition-colors"
                                >
                                    <IconBrandGoogle className="h-5 w-5 text-blue-400" />
                                    <span>Google</span>
                                </button>
                            </motion.div>

                            <p className="text-center text-sm text-gray-400 mt-6">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
