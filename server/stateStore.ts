import { TeamState, ToastAlertPayload } from '../src/types/socketEvents.js';
import whitelist from '../src/data/whitelistTeams.json' with { type: 'json' };

class StateStore {
  private teams: Map<string, TeamState> = new Map();
  private levelFirstFinishers: Map<number, string> = new Map();
  private useMockFeed: boolean = true;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.teams.clear();
    this.levelFirstFinishers.clear();
    this.useMockFeed = true;

    // Pre-populate with whitelisted teams
    for (const teamName of whitelist) {
      this.teams.set(teamName, {
        teamName,
        currentLevel: 0,
        score: 0,
        handRaised: false,
        completedLevels: [],
        peerBonusReceivedFrom: []
      });
    }
  }

  public getTeams(): TeamState[] {
    return Array.from(this.teams.values()).sort((a, b) => b.score - a.score);
  }

  public getTeam(name: string): TeamState | undefined {
    return this.teams.get(name);
  }

  public loginTeam(name: string): TeamState | null {
    const existing = this.teams.get(name);
    if (!existing) {
      // Check case-insensitive match
      for (const [k, v] of this.teams.entries()) {
        if (k.toLowerCase() === name.toLowerCase()) {
          return v;
        }
      }
      return null;
    }
    return existing;
  }

  public completeLevel(teamName: string, level: number): { state: TeamState; isFirst: boolean } | null {
    const team = this.teams.get(teamName);
    if (!team) return null;

    let isFirst = false;
    let pointsToAdd = 100; // Base completion points

    if (!team.completedLevels.includes(level)) {
      team.completedLevels.push(level);

      // Check speed race
      if (!this.levelFirstFinishers.has(level)) {
        this.levelFirstFinishers.set(level, teamName);
        isFirst = true;
        pointsToAdd += 50; // Speed race bonus!
      }

      team.score += pointsToAdd;
      team.lastFinishedAt = Date.now();
      team.currentLevel = Math.max(team.currentLevel, level + 1);
      team.handRaised = false; // Auto dismiss hand upon completion
    }

    return { state: team, isFirst };
  }

  public raiseHand(teamName: string, level: number): TeamState | null {
    const team = this.teams.get(teamName);
    if (!team) return null;
    team.handRaised = true;
    team.handRaisedAt = Date.now();
    return team;
  }

  public cancelHand(teamName: string): TeamState | null {
    const team = this.teams.get(teamName);
    if (!team) return null;
    team.handRaised = false;
    team.handRaisedAt = undefined;
    return team;
  }

  public awardPeerBonus(fromTeam: string, toTeam: string): { success: boolean; toState?: TeamState } {
    const giver = this.teams.get(fromTeam);
    const receiver = this.teams.get(toTeam);
    if (!giver || !receiver || fromTeam === toTeam) return { success: false };

    // Prevent spamming bonus to the same team repeatedly
    if (!receiver.peerBonusReceivedFrom.includes(fromTeam)) {
      receiver.peerBonusReceivedFrom.push(fromTeam);
      receiver.score += 50; // Peer help bonus!
      giver.score += 10;    // Reward team for expressing gratitude!
      return { success: true, toState: receiver };
    }

    return { success: false };
  }

  public setMockFeed(useMock: boolean): void {
    this.useMockFeed = useMock;
  }

  public getMockFeedState(): boolean {
    return this.useMockFeed;
  }
}

export const stateStore = new StateStore();
