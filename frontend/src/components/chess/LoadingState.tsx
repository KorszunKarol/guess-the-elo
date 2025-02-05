import { Loader2 } from 'lucide-react';

export function LoadingState() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                <p className="text-white text-lg">Loading your game...</p>
            </div>
        </div>
    );
}
