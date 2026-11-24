import { create } from 'zustand';

const ROSTER_STORAGE_KEY = 'nxplorers_instructor_roster';

interface RosterState {
  teams: string[];
  isConfigured: boolean;
  addTeam: (name: string) => boolean;
  removeTeam: (name: string) => void;
  setTeams: (teams: string[]) => void;
  resetRoster: () => void;
  loadPresetTeams: () => void;
}

const PRESET_TEAMS = [
  'CyberKnights',
  'ByteBuilders',
  'RoboExplorers',
  'SolarMinds',
  'QuantumCrew',
  'SiliconSpark'
];

const loadInitialRoster = (): { teams: string[]; isConfigured: boolean } => {
  try {
    const raw = localStorage.getItem(ROSTER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { teams: parsed, isConfigured: true };
      }
    }
  } catch (err) {
    console.error('Failed to parse saved team roster:', err);
  }
  return { teams: [], isConfigured: false };
};

export const useRosterStore = create<RosterState>((set, get) => ({
  teams: loadInitialRoster().teams,
  isConfigured: loadInitialRoster().isConfigured,

  addTeam: (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    const current = get().teams;
    if (current.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      return false; // Already exists
    }
    const updated = [...current, trimmed];
    localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(updated));
    set({ teams: updated, isConfigured: true });
    return true;
  },

  removeTeam: (name: string) => {
    const updated = get().teams.filter(t => t !== name);
    localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(updated));
    set({ teams: updated, isConfigured: updated.length > 0 });
  },

  setTeams: (newTeams: string[]) => {
    const unique = Array.from(new Set(newTeams.map(t => t.trim()).filter(Boolean)));
    localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(unique));
    set({ teams: unique, isConfigured: unique.length > 0 });
  },

  loadPresetTeams: () => {
    localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(PRESET_TEAMS));
    set({ teams: PRESET_TEAMS, isConfigured: true });
  },

  resetRoster: () => {
    localStorage.removeItem(ROSTER_STORAGE_KEY);
    set({ teams: [], isConfigured: false });
  }
}));
