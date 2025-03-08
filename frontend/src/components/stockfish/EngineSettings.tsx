'use client';

import { Cpu } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { EngineSettings } from '@/types/stockfish';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface EngineSettingsProps {
    settings: EngineSettings;
    onSettingsChange: (settings: Partial<EngineSettings>) => void;
}

export const EngineSettings = ({
    settings,
    onSettingsChange,
}: EngineSettingsProps) => {
    // Create ticks for depth slider
    const depthMin = 10;
    const depthMax = 30;
    const depthSkipInterval = 5;
    const depthTicks = [...Array(depthMax - depthMin + 1)].map((_, i) => i + depthMin);

    // Create ticks for multiPV slider
    const multiPVMin = 1;
    const multiPVMax = 5;
    const multiPVTicks = [...Array(multiPVMax - multiPVMin + 1)].map((_, i) => i + multiPVMin);

    // Create ticks for threads slider
    const threadsMin = 1;
    const threadsMax = 8;
    const threadsSkipInterval = 1;
    const threadsTicks = [...Array(threadsMax - threadsMin + 1)].map((_, i) => i + threadsMin);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Depth</span>
                    <span>{settings.depth}</span>
                </div>
                <Slider
                    value={[settings.depth]}
                    min={depthMin}
                    max={depthMax}
                    step={1}
                    onValueChange={([depth]) => onSettingsChange({ depth })}
                />
                {/* Ticks for depth slider */}
                <span
                    className="mt-1 flex w-full items-center justify-between gap-1 px-1 text-xs font-medium text-gray-500"
                    aria-hidden="true"
                >
                    {depthTicks.map((tick) => (
                        <span
                            key={tick}
                            className={cn(
                                "flex w-0 flex-col items-center justify-center gap-1",
                                (tick - depthMin) % depthSkipInterval !== 0 && "opacity-0"
                            )}
                        >
                            <span
                                className={cn(
                                    "h-1 w-px bg-gray-500/70",
                                    (tick - depthMin) % depthSkipInterval !== 0 && "h-0.5"
                                )}
                            />
                            <span>{tick}</span>
                        </span>
                    ))}
                </span>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Lines</span>
                    <span>{settings.multiPV}</span>
                </div>
                <Slider
                    value={[settings.multiPV]}
                    min={multiPVMin}
                    max={multiPVMax}
                    step={1}
                    onValueChange={([multiPV]) => onSettingsChange({ multiPV })}
                />
                {/* Ticks for multiPV slider */}
                <span
                    className="mt-1 flex w-full items-center justify-between gap-1 px-1 text-xs font-medium text-gray-500"
                    aria-hidden="true"
                >
                    {multiPVTicks.map((tick) => (
                        <span
                            key={tick}
                            className="flex w-0 flex-col items-center justify-center gap-1"
                        >
                            <span className="h-1 w-px bg-gray-500/70" />
                            <span>{tick}</span>
                        </span>
                    ))}
                </span>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Threads</span>
                    <span>{settings.threads}</span>
                </div>
                <Slider
                    value={[settings.threads]}
                    min={threadsMin}
                    max={threadsMax}
                    step={1}
                    onValueChange={([threads]) => onSettingsChange({ threads })}
                />
                {/* Ticks for threads slider */}
                <span
                    className="mt-1 flex w-full items-center justify-between gap-1 px-1 text-xs font-medium text-gray-500"
                    aria-hidden="true"
                >
                    {threadsTicks.map((tick) => (
                        <span
                            key={tick}
                            className={cn(
                                "flex w-0 flex-col items-center justify-center gap-1",
                                (tick - threadsMin) % threadsSkipInterval !== 0 && "opacity-0"
                            )}
                        >
                            <span
                                className={cn(
                                    "h-1 w-px bg-gray-500/70",
                                    (tick - threadsMin) % threadsSkipInterval !== 0 && "h-0.5"
                                )}
                            />
                            <span>{tick}</span>
                        </span>
                    ))}
                </span>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>CPU Usage</span>
                    <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <div className="text-sm text-gray-400">Auto-Analysis</div>
                    <div className="text-xs text-gray-500">
                        Automatically analyze new positions
                    </div>
                </div>
                <Switch
                    checked={settings.autoAnalysis}
                    onCheckedChange={(checked) =>
                        onSettingsChange({ autoAnalysis: checked })
                    }
                />
            </div>
            <div className="flex items-center gap-2 text-xs text-yellow-400">
                <Cpu className="h-3 w-3" />
                <span>Higher values may affect performance</span>
            </div>
        </div>
    );
};
