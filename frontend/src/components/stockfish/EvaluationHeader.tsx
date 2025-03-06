'use client';

import { Settings, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEngineStore } from '@/stores/engineStore';

interface EvaluationHeaderProps {
    isAnalyzing: boolean;
    engineReady: boolean;
    showSettings: boolean;
    onToggleAnalysis: () => void;
    onToggleSettings: () => void;
}

export const EvaluationHeader = ({
    isAnalyzing,
    engineReady,
    showSettings,
    onToggleAnalysis,
    onToggleSettings,
}: EvaluationHeaderProps) => {
    const toggleEngine = useEngineStore(state => state.toggleEngine);

    const handleToggleAnalysis = () => {
        console.log('Play/Stop button clicked', { isAnalyzing, engineReady });

        // Toggle engine state in the store - this is critical to prevent auto-stopping
        toggleEngine(!isAnalyzing);

        // Then toggle the analysis
        onToggleAnalysis();
    };

    return (
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Engine Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
                {/* Simple Play/Stop button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleAnalysis}
                    className={cn(
                        "h-8 w-8 hover:text-white relative",
                        !engineReady ? "text-gray-600" :
                        isAnalyzing ? "text-green-400 animate-pulse" : "text-gray-400"
                    )}
                    aria-label={!isAnalyzing ? "Start analysis" : "Stop analysis"}
                    disabled={!engineReady}
                >
                    {isAnalyzing ? (
                        <Square className="h-4 w-4" />
                    ) : (
                        <Play className="h-4 w-4" />
                    )}
                </Button>

                {/* Settings button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleSettings}
                    className={cn(
                        "h-8 w-8 hover:text-white",
                        showSettings ? "text-blue-400" : "text-gray-400"
                    )}
                    aria-label="Toggle engine settings"
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </div>
        </CardHeader>
    );
};