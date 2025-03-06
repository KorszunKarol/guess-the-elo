'use client';

import { cn } from '@/lib/utils';
import type { EngineSettings } from '@/types/stockfish';

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
                <div>
                    <label className="text-xs text-gray-300 font-medium block mb-1">Analysis Depth</label>
                    <select
                        className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm"
                        value={settings.depth}
                        onChange={(e) => onUpdateSettings({ depth: parseInt(e.target.value) })}
                        disabled={settings.isInfinite}
                    >
                        {[10, 15, 20, 25, 30].map((depth) => (
                            <option key={depth} value={depth}>
                                {depth}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        {settings.isInfinite ? "Depth set to infinite" : "Higher depth = better analysis but slower"}
                    </p>
                </div>
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
            </div>
        </div>
    );
};