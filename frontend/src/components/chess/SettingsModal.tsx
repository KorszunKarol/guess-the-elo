'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

interface GameSettings {
    sound: boolean;
    notifications: boolean;
    darkMode: boolean;
    openingBias?: number;
    middlegameBias?: number;
    endgameBias?: number;
}

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: GameSettings) => void;
    gameMode: 'elo' | 'eval';
}

export function SettingsModal({
    isOpen,
    onClose,
    onSave,
    gameMode,
}: SettingsModalProps) {
    const [settings, setSettings] = useState<GameSettings>({
        sound: true,
        notifications: true,
        darkMode: true,
        openingBias: 33,
        middlegameBias: 33,
        endgameBias: 34,
    });

    const handleSave = () => {
        onSave(settings);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        Game Settings
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Original Guess the Elo settings */}
                    {gameMode === 'elo' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm text-gray-300">
                                    Sound Effects
                                </Label>
                                <Switch
                                    checked={settings.sound}
                                    onCheckedChange={(checked) =>
                                        setSettings((prev) => ({
                                            ...prev,
                                            sound: checked,
                                        }))
                                    }
                                    className="data-[state=checked]:bg-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm text-gray-300">
                                    Notifications
                                </Label>
                                <Switch
                                    checked={settings.notifications}
                                    onCheckedChange={(checked) =>
                                        setSettings((prev) => ({
                                            ...prev,
                                            notifications: checked,
                                        }))
                                    }
                                    className="data-[state=checked]:bg-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm text-gray-300">
                                    Dark Mode
                                </Label>
                                <Switch
                                    checked={settings.darkMode}
                                    onCheckedChange={(checked) =>
                                        setSettings((prev) => ({
                                            ...prev,
                                            darkMode: checked,
                                        }))
                                    }
                                    className="data-[state=checked]:bg-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Eval mode position bias settings */}
                    {gameMode === 'eval' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-300">
                                    <Label>Opening Positions</Label>
                                    <span>{settings.openingBias}%</span>
                                </div>
                                <Slider
                                    value={[settings.openingBias!]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={([value]) => {
                                        setSettings((prev) => ({
                                            ...prev,
                                            openingBias: value,
                                        }));
                                    }}
                                    className="cursor-pointer"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-300">
                                    <Label>Middlegame Positions</Label>
                                    <span>{settings.middlegameBias}%</span>
                                </div>
                                <Slider
                                    value={[settings.middlegameBias!]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={([value]) => {
                                        setSettings((prev) => ({
                                            ...prev,
                                            middlegameBias: value,
                                        }));
                                    }}
                                    className="cursor-pointer"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-300">
                                    <Label>Endgame Positions</Label>
                                    <span>{settings.endgameBias}%</span>
                                </div>
                                <Slider
                                    value={[settings.endgameBias!]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={([value]) => {
                                        setSettings((prev) => ({
                                            ...prev,
                                            endgameBias: value,
                                        }));
                                    }}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="hover:bg-gray-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
