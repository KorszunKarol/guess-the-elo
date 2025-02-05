'use client';

// This page will only be accessible to authenticated users
export default function UpgradePage() {
    return (
        <div className="container relative min-h-screen py-16">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
                    Upgrade Your Experience
                </h1>
                <p className="text-gray-400">
                    Choose the plan that best fits your needs
                </p>
            </div>

            {/* Rest of the pricing cards code remains the same */}
        </div>
    );
}
