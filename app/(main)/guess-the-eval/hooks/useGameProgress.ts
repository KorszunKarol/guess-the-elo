import { useState, useCallback } from 'react';

interface GameProgress {
  currentRound: number;
  totalRounds: number;
  score: number; // Add score if you have a scoring system
  // Add other progress-related state here, e.g., accuracy
}

const useGameProgress = (initialTotalRounds: number) => {
  const [progress, setProgress] = useState<GameProgress>({
    currentRound: 1,
    totalRounds: initialTotalRounds,
    score: 0,
  });

  const nextRound = useCallback(() => {
    setProgress((prevProgress) => {
      if (prevProgress.currentRound < prevProgress.totalRounds) {
        return { ...prevProgress, currentRound: prevProgress.currentRound + 1 };
      }
      return prevProgress; // Or handle end of game
    });
  }, []);

  const resetProgress = useCallback(() => {
      setProgress({
          currentRound: 1,
          totalRounds: initialTotalRounds, // Use initialTotalRounds
          score: 0,
      });
  }, [initialTotalRounds]);


  const updateScore = useCallback((points: number) => {
    setProgress((prevProgress) => ({
      ...prevProgress,
      score: prevProgress.score + points,
    }));
  }, []);

    const setTotalRounds = (newTotalRounds: number) => {
        setProgress(prev => ({...prev, totalRounds: newTotalRounds}))
    }

  return { progress, nextRound, resetProgress, updateScore, setTotalRounds };
};

export default useGameProgress;