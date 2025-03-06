import { create } from 'zustand';
import type { EngineSettings } from '@/types/stockfish';

interface EngineState {
  currentFen: string;
  isEngineEnabled: boolean;
  settings: EngineSettings;
  updateFen: (fen: string) => void;
  toggleEngine: (enabled?: boolean) => void;
  updateSettings: (settings: Partial<EngineSettings>) => void;
}

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const DEFAULT_SETTINGS = {
  depth: 20,
  multiPV: 3,
  threads: 2,
  isInfinite: false
};

console.log('Initializing engine store with settings:', DEFAULT_SETTINGS);

export const useEngineStore = create<EngineState>((set) => ({
  currentFen: DEFAULT_FEN,
  isEngineEnabled: false,
  settings: DEFAULT_SETTINGS,
  updateFen: (fen: string) => set({ currentFen: fen }),
  toggleEngine: (enabled?: boolean) => {
    console.log('Toggling engine:', enabled);
    set((state) => ({
      isEngineEnabled: enabled !== undefined ? enabled : !state.isEngineEnabled
    }));
  },
  updateSettings: (newSettings: Partial<EngineSettings>) => {
    console.log('Updating engine settings:', newSettings);
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },
}));