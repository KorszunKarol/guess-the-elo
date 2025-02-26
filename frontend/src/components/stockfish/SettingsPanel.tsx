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
    return (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg space-y-3">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Engine Settings</h3>

            {/* Main toggles */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-xs text-gray-300 font-medium">Continuous Analysis</label>
                        <p className="text-xs text-gray-500">Engine keeps analyzing and improving evaluation</p>
                    </div>
                    <div
                        className={cn(
                            "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                            settings.continuous ? "bg-green-500" : "bg-gray-600"
                        )}
                        onClick={() => onUpdateSettings({ continuous: !settings.continuous })}
                        role="checkbox"
                        aria-checked={settings.continuous}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onUpdateSettings({ continuous: !settings.continuous })}
                    >
                        <div
                            className={cn(
                                "absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform",
                                settings.continuous ? "translate-x-5" : "translate-x-0.5"
                            )}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-xs text-gray-300 font-medium">Auto-Analyze Position</label>
                        <p className="text-xs text-gray-500">Automatically analyze when position changes</p>
                    </div>
                    <div
                        className={cn(
                            "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                            settings.autoAnalysis ? "bg-green-500" : "bg-gray-600"
                        )}
                        onClick={() => onUpdateSettings({ autoAnalysis: !settings.autoAnalysis })}
                        role="checkbox"
                        aria-checked={settings.autoAnalysis}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onUpdateSettings({ autoAnalysis: !settings.autoAnalysis })}
                    >
                        <div
                            className={cn(
                                "absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform",
                                settings.autoAnalysis ? "translate-x-5" : "translate-x-0.5"
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
                    >
                        {[10, 15, 20, 25, 30].map((depth) => (
                            <option key={depth} value={depth}>
                                {depth}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Higher depth = better analysis but slower</p>
                </div>
                <div>
                    <label className="text-xs text-gray-300 font-medium block mb-1">Lines to Show</label>
                    <select
                        className="w-full bg-gray-700 text-white rounded-md px-2 py-1 text-sm"
                        value={settings.multiPV}
                        onChange={(e) => onUpdateSettings({ multiPV: parseInt(e.target.value) })}
                    >
                        {[1, 2, 3].map((pv) => (
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