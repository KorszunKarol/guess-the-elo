import { useState, useEffect } from 'react';

interface GameSettings {
  sound: boolean;
  notifications: boolean;
  // Add other settings as needed, e.g., for themes
}

const defaultSettings: GameSettings = {
  sound: true,
  notifications: true,
};

const useGameSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage on component mount
    if (typeof window !== 'undefined') {
      const storedSettings = localStorage.getItem('gameSettings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage whenever they change
    if (typeof window !== 'undefined') {
      localStorage.setItem('gameSettings', JSON.stringify(settings));
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  return { settings, updateSettings };
};

export default useGameSettings;