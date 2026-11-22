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
  Server
} from 'lucide-react';
import { useSocketStore } from '../../store/useSocketStore.js';

export const FacilitatorView: React.FC = () => {
  const { 
    leaderboard, 
    cancelHand, 
    adminResetRoom
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
      <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F2] border border-[#B2DFDB] text-[#2A9D8F] text-xs font-bold uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5 text-[#2A9D8F]" />
              Facilitator Dashboard
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#24313A] tracking-tight">
              Classroom Progress Overview
            </h2>
            <p className="text-sm text-[#576875] mt-1">
              Live telemetry and team tracking for student teams across workshop cohorts.
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#F28C75] hover:bg-[#FDF1EE] text-[#576875] hover:text-[#D95D43] text-xs font-bold transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Session</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active "Raise Hand" Support Queue */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#EBE6DC]">
              <h3 className="text-base font-extrabold text-[#24313A] flex items-center gap-2">
                <Hand className="w-5 h-5 text-[#F28C75]" />
                <span>Support Queue</span>
                <span className="ml-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FDF1EE] text-[#D95D43] border border-[#F28C75]">
                  {handsRaised.length}
                </span>
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              {handsRaised.length === 0 ? (
                <div className="text-center py-8 text-[#576875] text-xs">
                  <CheckCircle2 className="w-8 h-8 text-[#2A9D8F] mx-auto mb-2 opacity-60" />
                  No hands raised right now.<br />All teams are progressing smoothly.
                </div>
              ) : (
                handsRaised.map((team) => (
                  <div
                    key={team.teamName}
                    className="p-4 rounded-2xl bg-[#FDF1EE] border border-[#F28C75] shadow-xs flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#24313A]">{team.teamName}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#F28C75] text-white">
                        Level {team.currentLevel}
                      </span>
                    </div>
                    <p className="text-xs text-[#D95D43] flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Waiting for mentor assistance
                    </p>
                    <button
                      onClick={() => cancelHand()}
                      className="mt-2 w-full py-2 rounded-xl bg-white hover:bg-[#E6F4F2] text-[#24313A] hover:text-[#2A9D8F] font-bold text-xs border border-[#EBE6DC] hover:border-[#2A9D8F] transition-all shadow-xs"
                    >
                      Mark Resolved ✓
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interactive Cloud Telemetry Broadcaster Controls */}
          <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#24313A] flex items-center gap-2">
              <Server className="w-5 h-5 text-[#2A9D8F]" />
              <span>Broadcast Telemetry Injector</span>
            </h3>
            <p className="text-xs text-[#576875] leading-relaxed">
              Inject live environmental spikes into the local / ThingSpeak feed to test students' closed-loop OLED alarms and buzzers.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => handleTriggerAlert('heat')}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#FEF9EC] border border-[#F4C95D] hover:bg-[#FDF1D6] text-[#B88719] text-xs font-bold transition-all shadow-xs"
              >
                <Flame className="w-4 h-4 text-[#F4C95D]" />
                <span>Heat Wave (&gt;30°C)</span>
              </button>
              <button
                onClick={() => handleTriggerAlert('dry')}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#FDF1EE] border border-[#F28C75] hover:bg-[#FCE3DD] text-[#D95D43] text-xs font-bold transition-all shadow-xs"
              >
                <Droplets className="w-4 h-4 text-[#F28C75]" />
                <span>Dry Soil (&lt;25%)</span>
              </button>
            </div>

            <button
              onClick={() => handleTriggerAlert('reset')}
              className="w-full py-2.5 rounded-xl bg-[#FFFDF7] border border-[#EBE6DC] hover:border-[#2A9D8F] hover:bg-[#E6F4F2] text-[#24313A] text-xs font-bold transition-all shadow-xs"
            >
              Reset to Normal Room Baseline
            </button>

            {alertFeedback && (
              <div className="p-3 rounded-xl bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A] text-xs font-bold text-center animate-fade-in">
                {alertFeedback}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Room Leaderboard */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE6DC]">
              <h3 className="text-lg font-extrabold text-[#24313A] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#F4C95D]" />
                <span>Workshop Team Progress</span>
              </h3>
              <span className="text-xs text-[#576875] font-semibold">
                Ranked by points & completion
              </span>
            </div>

            <div className="mt-5 space-y-2.5">
              {leaderboard.map((team, rank) => {
                return (
                  <div
                    key={team.teamName}
                    className="p-3.5 flex items-center justify-between gap-4 transition-all bg-[#FFFDF7] border border-[#EBE6DC] hover:border-[#D5CFC2] rounded-2xl"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          rank === 0
                            ? 'bg-[#F4C95D] text-[#24313A]'
                            : rank === 1
                            ? 'bg-[#B9DCE8] text-[#24313A]'
                            : rank === 2
                            ? 'bg-[#EBE6DC] text-[#24313A]'
                            : 'bg-white border border-[#EBE6DC] text-[#576875]'
                        }`}
                      >
                        {rank + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#24313A] truncate flex items-center gap-2">
                          <span>{team.teamName}</span>
                          {team.handRaised && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F28C75] text-white">
                              Needs Assistance
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[#576875] mt-0.5">
                          Currently at <strong className="text-[#2A9D8F]">Level {team.currentLevel}</strong> • {team.completedLevels.length} levels completed
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-[#24313A]">
                        {team.score}
                      </span>
                      <span className="text-xs text-[#576875] ml-1">pts</span>
                      {team.peerBonusReceivedFrom.length > 0 && (
                        <p className="text-[10px] text-[#2A9D8F] font-bold">
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
