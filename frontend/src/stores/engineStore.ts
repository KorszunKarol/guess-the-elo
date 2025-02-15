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

export const useEngineStore = create<EngineState>((set) => ({
  currentFen: DEFAULT_FEN,
  isEngineEnabled: false,
  settings: {
    depth: 20,
    multiPV: 3,
    threads: 2,
    autoAnalysis: true,
  },
  updateFen: (fen: string) => set({ currentFen: fen }),
  toggleEngine: (enabled?: boolean) =>
    set((state) => ({
      isEngineEnabled: enabled !== undefined ? enabled : !state.isEngineEnabled
    })),
  updateSettings: (newSettings: Partial<EngineSettings>) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),
}));