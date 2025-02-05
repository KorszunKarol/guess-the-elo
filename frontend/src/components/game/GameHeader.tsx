import { Clock, Flag } from 'lucide-react';

interface GameHeaderProps {
    currentRound: number;
    totalRounds: number;
    timeRemaining: number;
    title?: string;
}

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function GameHeader({
    currentRound,
    totalRounds,
    timeRemaining,
    title = 'Current Position'
}: GameHeaderProps) {
    return (
        <div className="p-6 flex items-center justify-between border-b border-gray-800 bg-gray-950">
            <h2 className="text-2xl font-bold text-gray-100">
                {title}
            </h2>
            <div className="flex items-center gap-8 text-lg">
                <div className="flex items-center gap-3">
                    <Flag className="h-6 w-6 text-blue-400" />
                    <span className="text-gray-300">
                        Round{' '}
                        <span className="text-blue-400 font-semibold">
                            {currentRound}
                        </span>
                        /{totalRounds}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-yellow-400" />
                    <span className="text-yellow-400 font-mono font-semibold text-2xl">
                        {formatTime(timeRemaining)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export { GameHeader };