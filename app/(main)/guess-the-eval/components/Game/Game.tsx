import React, { useState, useCallback, useEffect } from 'react';
import { Header, GameHeader } from '@/components/game';
import GameBoard from './GameBoard';
import EvaluationPanel from './EvaluationPanel';
import GameControls from './GameControls';
import { useGameState } from '@/src/hooks/useGameState';
import useTimer from '@/src/hooks/useTimer';
import useGameProgress from '../../hooks/useGameProgress';
import useGameSettings from '../../hooks/useGameSettings';
import { SettingsModal } from '@/components/chess/SettingsModal';
import ProfilePage from '@/components/chess/ProfilePage';
import StatsPage from '@/components/chess/StatsPage';
import { Card, CardContent } from '@/components/ui/card';
import GameLayoutWrapper from './GameLayoutWrapper';

const TOTAL_ROUNDS = 5;

function Game() {
  const { gameState, handleMove, resetGame } = useGameState();
  const { progress, nextRound, resetProgress, setTotalRounds } = useGameProgress(TOTAL_ROUNDS);
  const { settings, updateSettings } = useGameSettings();
  const { timeRemaining, reset: resetTimer } = useTimer(60, () => {
    nextRound();
    resetTimer();
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [currentGuess, setCurrentGuess] = useState<number | null>(null);

  const handleGuessSubmit = useCallback((evaluation: number) => {
      setCurrentGuess(evaluation);
      console.log('Guess submitted:', evaluation);
      nextRound();
      resetTimer();
  }, [nextRound, resetTimer]);

  const handleSettingsSave = useCallback(
    (newSettings: { sound: boolean; notifications: boolean }) => {
      updateSettings(newSettings);
      console.log('Settings updated:', newSettings);
      setIsSettingsOpen(false);
    },
    [updateSettings]
  );

    useEffect(() => {
        if (progress.currentRound > progress.totalRounds) {
            console.log("Game Over");
        }
    }, [progress.currentRound, progress.totalRounds])

  return (
    <>
      <div>
        <Header
          onProfileClick={() => setShowProfile(true)}
          onStatsClick={() => setShowStats(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />
          <Card className='mx-auto my-8 w-full max-w-7xl'>
          <CardContent className='p-0'>

        {showProfile && (
          <ProfilePage
            onClose={() => setShowProfile(false)}
            userData={{
              name: 'John Doe',
              email: 'john.doe@example.com',
              subscription: 'Free',
              subscriptionPrice: '$0',
              achievements: ['Beginner', '10 Games Played'],
              stats: {
                guessTheElo: {
                  gamesPlayed: 0,
                  averageAccuracy: 0,
                  bestStreak: 0,
                  totalPoints: 0,
                  ratingDistribution: {
                    beginner: 0,
                    intermediate: 0,
                    advanced: 0,
                    expert: 0,
                  },
                },
                guessTheEval: {
                  gamesPlayed: 0,
                  averageAccuracy: 0,
                  bestStreak: 0,
                  totalPoints: 0,
                  positionTypes: {
                    tactical: 0,
                    strategic: 0,
                    endgame: 0,
                    opening: 0,
                  },
                },
                overall: {
                  totalGamesPlayed: 0,
                  rank: 'Novice Analyst',
                  joinedDate: new Date().toISOString(),
                  lastPlayed: new Date().toISOString(),
                },
              },
            }}
          />
        )}
        {showStats && (
          <StatsPage onClose={() => setShowStats(false)} userData={{
              name: 'John Doe',
              email: 'john.doe@example.com',
              subscription: 'Free',
              subscriptionPrice: '$0',
              achievements: ['Beginner', '10 Games Played'],
              stats: {
                guessTheElo: {
                  gamesPlayed: 0,
                  averageAccuracy: 0,
                  bestStreak: 0,
                  totalPoints: 0,
                  ratingDistribution: {
                    beginner: 0,
                    intermediate: 0,
                    advanced: 0,
                    expert: 0,
                  },
                },
                guessTheEval: {
                  gamesPlayed: 0,
                  averageAccuracy: 0,
                  bestStreak: 0,
                  totalPoints: 0,
                  positionTypes: {
                    tactical: 0,
                    strategic: 0,
                    endgame: 0,
                    opening: 0,
                  },
                },
                overall: {
                  totalGamesPlayed: 0,
                  rank: 'Novice Analyst',
                  joinedDate: new Date().toISOString(),
                  lastPlayed: new Date().toISOString(),
                },
              },
            }}/>
        )}

        <GameLayoutWrapper>
          <div className="center-panel">
            <GameBoard fen={gameState.fen} onMove={handleMove} />
            <GameControls onReset={resetGame} onFlipBoard={() => {}} />
          </div>
          <div className="right-panel">
            <EvaluationPanel
              currentRound={progress.currentRound}
              totalRounds={progress.totalRounds}
              timeRemaining={timeRemaining}
              onSubmit={handleGuessSubmit}
              position={gameState.fen}
            />
          </div>
        </GameLayoutWrapper>
          </CardContent>
          </Card>

      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
        gameMode="eval"
      />
    </>
  );
}

export default Game;