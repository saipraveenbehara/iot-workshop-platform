import React, { useState } from 'react';
import { 
  Trophy, 
  Hand, 
  Radio, 
  Flame, 
  Droplets, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Users, 
  Sparkles,
  Server
} from 'lucide-react';
import { useSocketStore } from '../../store/useSocketStore.js';

export const FacilitatorView: React.FC = () => {
  const { 
    leaderboard, 
    cancelHand, 
    adminResetRoom, 
    isMockFeedActive, 
    adminToggleMockFeed 
  } = useSocketStore();

  const [alertFeedback, setAlertFeedback] = useState<string | null>(null);

  // Teams with active hand raises
  const handsRaised = leaderboard.filter((t) => t.handRaised);

  const handleTriggerAlert = async (type: 'heat' | 'dry' | 'reset') => {
    try {
      const res = await fetch('/api/trigger-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      setAlertFeedback(data.message);
      setTimeout(() => setAlertFeedback(null), 3000);
    } catch {
      setAlertFeedback('Trigger failed. Check server.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 to-blue-950/40 border border-purple-500/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              Facilitator Mission Control
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Classroom Real-Time Dashboard
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Monitoring 10 student teams across Bangalore / Tamil Nadu / Gujarat / Haryana bootcamps.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all team scores and progress for a fresh workshop?')) {
                  adminResetRoom();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 hover:border-rose-500/50 hover:bg-rose-500/10 text-gray-300 hover:text-rose-400 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Session</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active "Raise Hand" Support Queue */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Hand className="w-5 h-5 text-rose-400" />
                <span>Support Queue</span>
                <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {handsRaised.length}
                </span>
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              {handsRaised.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                  No hands raised right now.<br />All teams are progressing smoothly!
                </div>
              ) : (
                handsRaised.map((team) => (
                  <div
                    key={team.teamName}
                    className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 shadow-lg shadow-rose-500/10 flex flex-col gap-2 animate-pulse-short"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white">{team.teamName}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                        Level {team.currentLevel}
                      </span>
                    </div>
                    <p className="text-xs text-rose-200/80 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Waiting for help
                    </p>
                    <button
                      onClick={() => cancelHand()}
                      className="mt-2 w-full py-2 rounded-xl bg-gray-900 hover:bg-emerald-600 text-gray-300 hover:text-white font-bold text-xs border border-gray-700 transition-all"
                    >
                      Mark Resolved ✓
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interactive Cloud Telemetry Broadcaster Controls */}
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>Broadcast Telemetry Injector</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Inject live environmental spikes into the local / ThingSpeak feed to test students' closed-loop OLED alarms and buzzers!
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => handleTriggerAlert('heat')}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Heat Wave (&gt;30°C)</span>
              </button>
              <button
                onClick={() => handleTriggerAlert('dry')}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all"
              >
                <Droplets className="w-4 h-4 text-rose-400" />
                <span>Dry Soil (&lt;25%)</span>
              </button>
            </div>

            <button
              onClick={() => handleTriggerAlert('reset')}
              className="w-full py-2.5 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-300 text-xs font-semibold transition-all"
            >
              Reset to Normal Room Baseline
            </button>

            {alertFeedback && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center animate-fade-in">
                {alertFeedback}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Room Leaderboard */}
        <div className="lg:col-span-2">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 lg:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Live Classroom Leaderboard</span>
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                Ranked by points & speed
              </span>
            </div>

            <div className="mt-5 divide-y divide-gray-800/80">
              {leaderboard.map((team, rank) => {
                const isTop3 = rank < 3;
                return (
                  <div
                    key={team.teamName}
                    className="py-3.5 flex items-center justify-between gap-4 transition-all hover:bg-gray-900/40 px-3 rounded-xl"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          rank === 0
                            ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/30'
                            : rank === 1
                            ? 'bg-slate-300 text-gray-950'
                            : rank === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {rank + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate flex items-center gap-2">
                          <span>{team.teamName}</span>
                          {team.handRaised && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                              Needs Help!
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Currently at <strong className="text-emerald-400">Level {team.currentLevel}</strong> • {team.completedLevels.length} levels cleared
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-amber-400">
                        {team.score}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">pts</span>
                      {team.peerBonusReceivedFrom.length > 0 && (
                        <p className="text-[10px] text-blue-400 font-semibold">
                          +{team.peerBonusReceivedFrom.length * 50} peer bonus
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
