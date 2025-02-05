import { useState, useEffect } from 'react';

export function useTimer(initialTime: number = 60, onTimeUp?: () => void) {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!isActive || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUp?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, timeRemaining, onTimeUp]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        timeRemaining,
        formattedTime: formatTime(timeRemaining),
        isActive,
        setIsActive,
        resetTimer: () => setTimeRemaining(initialTime),
    };
}
