import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

interface GuessPanelProps {
  onSubmit: (value: number) => void;
  currentGuess: number;
  round: number;
}

export function GuessPanel({ onSubmit, currentGuess, round }: GuessPanelProps) {
  const [value, setValue] = useState(currentGuess);

  return (
    <Card className="h-full bg-background/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Your Evaluation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">
              Your Guess:
            </span>
            <span className="text-base font-bold text-blue-400">
              {value}
            </span>
          </div>
          <Slider
            value={[value]}
            onValueChange={([val]) => setValue(val)}
            max={3000}
            step={10}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
            <span>Expert</span>
            <span>Master</span>
          </div>
          <Button
            onClick={() => onSubmit(value)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Submit Guess
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}