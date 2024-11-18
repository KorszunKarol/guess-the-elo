'use client';

import { Card } from "@/components/ui/card";

export function GamePreview() {
  return (
    <Card className="w-full bg-gray-900/50 backdrop-blur-sm border-gray-800">
      <div className="p-6 space-y-6">
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Guess the Position Evaluation
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between text-gray-300">
            <span>Current Move:</span>
            <span className="text-yellow-400">1</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Your Guess:</span>
              <span className="text-blue-400">70</span>
            </div>

            {/* Slider representation */}
            <div className="relative w-full h-2 bg-gray-700 rounded-full">
              <div className="absolute h-full w-[60%] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-500"></div>
            </div>

            <div className="flex justify-between text-xs text-gray-400">
              <span>-2000</span>
              <span>-1000</span>
              <span>0</span>
              <span>1000</span>
              <span>2000</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <span className="text-sm text-gray-300">Evaluation:</span>
            <div className="text-green-400 font-semibold">
              White Equal
            </div>
          </div>

          <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
            Submit Guess
          </button>

          <div className="flex justify-between text-sm text-gray-400">
            <span>High Score: 0</span>
            <span>Move: 1/10</span>
          </div>

          <button className="w-full py-2 text-gray-400 hover:text-gray-300 transition-colors">
            Show Hint
          </button>
        </div>
      </div>
    </Card>
  );
}