'use client';

import { cn } from '@/lib/utils';
import type { EngineSettings } from '@/types/stockfish';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SettingsPanelProps {
    settings: EngineSettings;
    onUpdateSettings: (settings: Partial<EngineSettings>) => void;
}

export const SettingsPanel = ({
    settings,
    onUpdateSettings,
}: SettingsPanelProps) => {
    console.log('SettingsPanel rendered with settings:', settings);

    const handleInfiniteToggle = () => {
        console.log('Toggling infinite mode from', settings.isInfinite, 'to', !settings.isInfinite);
        onUpdateSettings({ isInfinite: !settings.isInfinite });
    };

    // Handle depth value change
    const handleDepthChange = (values: number[]) => {
        if (values[0] !== settings.depth) {
            onUpdateSettings({ depth: values[0] });
        }
    };

    // Create ticks for depth slider
    const depthMin = 5;
    const depthMax = 30;
    const depthSkipInterval = 5;
    const depthTicks = [...Array(depthMax - depthMin + 1)].map((_, i) => i + depthMin);

    return (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg space-y-3">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Engine Settings</h3>

            {/* Main toggles */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-xs text-gray-300 font-medium">Infinite Analysis</label>
                        <p className="text-xs text-gray-500">Engine analyzes indefinitely at maximum depth</p>
                    </div>
                    <div
                        className={cn(
                            "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                            settings.isInfinite ? "bg-green-500" : "bg-gray-600"
                        )}
                        onClick={handleInfiniteToggle}
                        role="checkbox"
                        aria-checked={settings.isInfinite}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleInfiniteToggle()}
                    >
                        <div
                            className={cn(
                                "absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform",
                                settings.isInfinite ? "translate-x-5" : "translate-x-0.5"
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Numeric settings */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-700">
                {/* Enhanced Slider for depth with ticks */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <Label className="text-xs text-gray-300 font-medium">Analysis Depth</Label>
                        <span className="text-xs font-medium text-blue-400">{settings.depth}</span>
                    </div>
                    <Slider
                        value={[settings.depth]}
                        min={depthMin}
                        max={depthMax}
                        step={1}
                        onValueChange={handleDepthChange}
                        disabled={settings.isInfinite}
                        showTooltip
                        tooltipContent={(value) => `Depth: ${value}`}
                        aria-label="Select analysis depth"
                    />
                    {/* Ticks for the slider */}
                    <span
                        className="mt-2 flex w-full items-center justify-between gap-1 px-1 text-xs font-medium text-gray-500"
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
                    <p className="text-xs text-gray-500 mt-3">
                        {settings.isInfinite ? "Depth set to infinite" : "Higher depth = better analysis but slower (5-30)"}
                    </p>
                </div>

                {/* Revert back to dropdown for multiPV */}
                <div>
                    <label className="text-xs text-gray-300 font-medium block mb-1">Lines to Show</label>
                    <select
                        className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm"
                        value={settings.multiPV}
                        onChange={(e) => onUpdateSettings({ multiPV: parseInt(e.target.value) })}
                    >
                        {[1, 2, 3, 4, 5].map((pv) => (
                            <option key={pv} value={pv}>
                                {pv} {pv === 1 ? 'line' : 'lines'}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Number of alternative moves to analyze</p>
                </div>

                {/* Add threads dropdown in a new row */}
                <div className="col-span-2 mt-3 pt-3 border-t border-gray-700">
                    <label className="text-xs text-gray-300 font-medium block mb-1">CPU Threads</label>
                    <select
                        className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm"
                        value={settings.threads}
                        onChange={(e) => onUpdateSettings({ threads: parseInt(e.target.value) })}
                        aria-label="Select number of CPU threads"
                    >
                        {[1, 2, 4, 8, 16].map((threadCount) => (
                            <option key={threadCount} value={threadCount}>
                                {threadCount} {threadCount === 1 ? 'thread' : 'threads'}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        Number of CPU threads to use (higher = faster analysis but more CPU usage)
                    </p>
                </div>
            </div>
        </div>
    );
};