import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import confetti from 'canvas-confetti';
import { 
  TeamState, 
  ToastAlertPayload, 
  ClientToServerEvents, 
  ServerToClientEvents 
} from '../types/socketEvents.js';
import { useTeamStore } from './useTeamStore.js';

interface SocketStoreState {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  leaderboard: TeamState[];
  activeToasts: ToastAlertPayload[];
  isMockFeedActive: boolean;

  initSocket: () => void;
  submitLogin: (name: string) => Promise<{ success: boolean; error?: string }>;
  submitLevelComplete: (level: number) => void;
  raiseHand: (level: number) => void;
  cancelHand: () => void;
  awardPeerBonus: (toTeam: string) => void;
  dismissToast: (id: string) => void;
  adminResetRoom: () => void;
  adminToggleMockFeed: (val: boolean) => void;
}

export const useSocketStore = create<SocketStoreState>((set, get) => ({
  socket: null,
  isConnected: false,
  leaderboard: [],
  activeToasts: [],
  isMockFeedActive: true,

  initSocket: () => {
    if (get().socket) return;

    // Connect to same origin, which Vite proxies to port 3001
    const s: Socket<ServerToClientEvents, ClientToServerEvents> = io('/', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    s.on('connect', () => {
      set({ isConnected: true });
      // Re-sync team session if logged in
      const currentTeam = useTeamStore.getState().teamName;
      if (currentTeam) {
        s.emit('team:login', currentTeam, (res) => {
          if (res.success && res.state) {
            useTeamStore.getState().setTeamState(res.state);
          }
        });
      }
    });

    s.on('disconnect', () => {
      set({ isConnected: false });
    });

    s.on('leaderboard:update', (teams) => {
      set({ leaderboard: teams });
      // Update local team score if in leaderboard
      const myName = useTeamStore.getState().teamName;
      if (myName) {
        const found = teams.find((t) => t.teamName === myName);
        if (found) {
          useTeamStore.getState().setTeamState({
            score: found.score,
            currentLevel: found.currentLevel,
            handRaised: found.handRaised,
            completedLevels: found.completedLevels,
          });
        }
      }
    });

    s.on('room:toast', (toast) => {
      set((prev) => ({ activeToasts: [toast, ...prev.activeToasts.slice(0, 4)] }));

      // Trigger celebratory confetti if this team won the speed race!
      if (toast.type === 'speed_race') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      // Auto dismiss after 7 seconds
      setTimeout(() => {
        get().dismissToast(toast.id);
      }, 7000);
    });

    s.on('admin:fallbackToggle', (useMock) => {
      set({ isMockFeedActive: useMock });
    });

    s.on('hand:updated', ({ teamName, handRaised }) => {
      const myName = useTeamStore.getState().teamName;
      if (myName === teamName) {
        useTeamStore.getState().toggleHand(handRaised);
      }
    });

    set({ socket: s });
  },

  submitLogin: (name: string) => {
    return new Promise((resolve) => {
      const s = get().socket;
      if (!s) {
        // Fallback local login if socket connecting
        useTeamStore.getState().login(name);
        resolve({ success: true });
        return;
      }
      s.emit('team:login', name, (res) => {
        if (res.success && res.state) {
          useTeamStore.getState().login(name, res.state);
          resolve({ success: true });
        } else {
          resolve({ success: false, error: res.error || 'Team not authorized' });
        }
      });
    });
  },

  submitLevelComplete: (level: number) => {
    const s = get().socket;
    const teamName = useTeamStore.getState().teamName;
    if (s && teamName) {
      s.emit('level:complete', { teamName, level });
    }
    useTeamStore.getState().advanceLevel(level + 1, 100);
  },

  raiseHand: (level: number) => {
    const s = get().socket;
    const teamName = useTeamStore.getState().teamName;
    if (s && teamName) {
      s.emit('help:raiseHand', { teamName, level });
      useTeamStore.getState().toggleHand(true);
    }
  },

  cancelHand: () => {
    const s = get().socket;
    const teamName = useTeamStore.getState().teamName;
    if (s && teamName) {
      s.emit('help:cancelHand', { teamName });
      useTeamStore.getState().toggleHand(false);
    }
  },

  awardPeerBonus: (toTeam: string) => {
    const s = get().socket;
    const fromTeam = useTeamStore.getState().teamName;
    if (s && fromTeam) {
      s.emit('peer:bonusAwarded', { fromTeam, toTeam });
    }
  },

  dismissToast: (id: string) => {
    set((prev) => ({
      activeToasts: prev.activeToasts.filter((t) => t.id !== id),
    }));
  },

  adminResetRoom: () => {
    const s = get().socket;
    if (s) s.emit('admin:reset');
  },

  adminToggleMockFeed: (val: boolean) => {
    const s = get().socket;
    if (s) s.emit('admin:toggleMock', val);
  },
}));
