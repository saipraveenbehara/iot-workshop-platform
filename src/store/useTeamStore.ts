import { create } from 'zustand';
import { TeamState } from '../types/socketEvents.js';

interface TeamStoreState {
  teamName: string | null;
  currentLevel: number;
  score: number;
  handRaised: boolean;
  completedLevels: number[];
  isLoggedIn: boolean;
  activeLevelView: number; // Allows browsing back to completed levels

  setTeamState: (state: Partial<TeamState>) => void;
  login: (name: string, state?: TeamState) => void;
  logout: () => void;
  setActiveLevelView: (lvl: number) => void;
  advanceLevel: (newLevel: number, pointsEarned: number) => void;
  toggleHand: (raised: boolean) => void;
}

const STORAGE_KEY = 'nxplorers_team_session';

const savedSession = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

export const useTeamStore = create<TeamStoreState>((set) => ({
  teamName: savedSession?.teamName || null,
  currentLevel: savedSession?.currentLevel || 0,
  score: savedSession?.score || 0,
  handRaised: savedSession?.handRaised || false,
  completedLevels: savedSession?.completedLevels || [],
  isLoggedIn: !!savedSession?.teamName,
  activeLevelView: savedSession?.currentLevel || 0,

  setTeamState: (state) =>
    set((prev) => {
      const updated = { ...prev, ...state };
      if (updated.teamName) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          teamName: updated.teamName,
          currentLevel: updated.currentLevel,
          score: updated.score,
          handRaised: updated.handRaised,
          completedLevels: updated.completedLevels
        }));
      }
      return updated;
    }),

  login: (name, state) =>
    set(() => {
      const teamData = {
        teamName: name,
        currentLevel: state?.currentLevel || 0,
        score: state?.score || 0,
        handRaised: state?.handRaised || false,
        completedLevels: state?.completedLevels || [],
        isLoggedIn: true,
        activeLevelView: state?.currentLevel || 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teamData));
      return teamData;
    }),

  logout: () =>
    set(() => {
      localStorage.removeItem(STORAGE_KEY);
      return {
        teamName: null,
        currentLevel: 0,
        score: 0,
        handRaised: false,
        completedLevels: [],
        isLoggedIn: false,
        activeLevelView: 0,
      };
    }),

  setActiveLevelView: (lvl) => set({ activeLevelView: lvl }),

  advanceLevel: (newLevel, pointsEarned) =>
    set((prev) => {
      const nextLvl = Math.max(prev.currentLevel, newLevel);
      const updated = {
        currentLevel: nextLvl,
        activeLevelView: nextLvl,
        score: prev.score + pointsEarned,
        completedLevels: prev.completedLevels.includes(prev.activeLevelView) 
          ? prev.completedLevels 
          : [...prev.completedLevels, prev.activeLevelView],
        handRaised: false,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, ...updated }));
      return updated;
    }),

  toggleHand: (raised) =>
    set((prev) => {
      const updated = { ...prev, handRaised: raised };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }),
}));
