export interface TeamState {
  teamName: string;
  currentLevel: number;
  score: number;
  handRaised: boolean;
  handRaisedAt?: number;
  lastFinishedAt?: number;
  completedLevels: number[];
  peerBonusReceivedFrom: string[];
}

export interface ToastAlertPayload {
  id: string;
  type: "speed_race" | "peer_help" | "achievement";
  title: string;
  message: string;
  teamName: string;
  timestamp: number;
}

export interface ServerToClientEvents {
  "leaderboard:update": (teams: TeamState[]) => void;
  "roster:update": (teamNames: string[]) => void;
  "room:toast": (toast: ToastAlertPayload) => void;
  "admin:fallbackToggle": (useMockFeed: boolean) => void;
  "hand:updated": (data: { teamName: string; handRaised: boolean }) => void;
}

export interface ClientToServerEvents {
  "team:login": (teamName: string, ack: (response: { success: boolean; state?: TeamState; error?: string }) => void) => void;
  "roster:addTeam": (teamName: string, ack?: (response: { success: boolean; error?: string }) => void) => void;
  "roster:removeTeam": (teamName: string, ack?: (response: { success: boolean }) => void) => void;
  "roster:loadPresets": (ack?: (response: { success: boolean; teams: string[] }) => void) => void;
  "level:complete": (data: { teamName: string; level: number }) => void;
  "help:raiseHand": (data: { teamName: string; level: number }) => void;
  "help:cancelHand": (data: { teamName: string }) => void;
  "peer:bonusAwarded": (data: { fromTeam: string; toTeam: string }) => void;
  "admin:reset": () => void;
  "admin:toggleMock": (useMock: boolean) => void;
}
