import React, { useState } from 'react';
import { 
  Cpu, 
  Trophy, 
  Hand, 
  HeartHandshake, 
  LogOut, 
  ShieldAlert, 
  CheckCircle2, 
  CircleDot,
  Radio
} from 'lucide-react';
import { useTeamStore } from '../../store/useTeamStore.js';
import { useSocketStore } from '../../store/useSocketStore.js';
import curriculum from '../../data/curriculumData.json' with { type: 'json' };
import whitelist from '../../data/whitelistTeams.json' with { type: 'json' };

interface HeaderProps {
  onOpenAdmin: () => void;
  isAdminView: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, isAdminView }) => {
  const { 
    teamName, 
    score, 
    handRaised, 
    activeLevelView, 
    currentLevel, 
    completedLevels,
    setActiveLevelView, 
    logout 
  } = useTeamStore();

  const { isConnected, raiseHand, cancelHand, awardPeerBonus, leaderboard } = useSocketStore();
  const [showPeerModal, setShowPeerModal] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState('');
  const [peerBonusSent, setPeerBonusSent] = useState(false);

  const handleToggleHand = () => {
    if (handRaised) {
      cancelHand();
    } else {
      raiseHand(activeLevelView);
    }
  };

  const handleSendPeerBonus = () => {
    if (!selectedPeer || selectedPeer === teamName) return;
    awardPeerBonus(selectedPeer);
    setPeerBonusSent(true);
    setTimeout(() => {
      setPeerBonusSent(false);
      setShowPeerModal(false);
      setSelectedPeer('');
    }, 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-gray-800 px-4 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white tracking-wide">NXplorers IoT</h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Workshop
                  </span>
                </div>
                <p className="text-xs text-gray-400">Raspberry Pi Pico WH MicroPython Platform</p>
              </div>
            </div>

            {/* Connection Indicator & Admin Toggle (Mobile) */}
            <div className="flex items-center gap-2 md:hidden">
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-sm shadow-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <button
                onClick={onOpenAdmin}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-800/60"
              >
                {isAdminView ? 'Student View' : 'Admin'}
              </button>
            </div>
          </div>

          {/* Level Progress Stepper */}
          {!isAdminView && teamName && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none justify-center">
              {curriculum.map((lvl) => {
                const isCompleted = completedLevels.includes(lvl.levelNumber);
                const isCurrent = activeLevelView === lvl.levelNumber;
                const isLocked = lvl.levelNumber > currentLevel;

                return (
                  <button
                    key={lvl.levelNumber}
                    disabled={isLocked}
                    onClick={() => setActiveLevelView(lvl.levelNumber)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/30'
                        : isCompleted
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/40'
                        : isLocked
                        ? 'bg-gray-900/60 text-gray-500 cursor-not-allowed border border-gray-800/40'
                        : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <CircleDot className="w-3.5 h-3.5 animate-pulse text-gray-950" />
                    ) : (
                      <span className="w-3.5 h-3.5 text-center leading-none text-[10px] font-bold">
                        {lvl.levelNumber}
                      </span>
                    )}
                    <span>L{lvl.levelNumber}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Controls: Team Badge, Points, Raise Hand & Peer Help */}
          <div className="flex items-center justify-end gap-2.5">
            {teamName ? (
              <>
                {/* Score Pill */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{score} pts</span>
                </div>

                {/* Peer-Help Bonus Button */}
                <button
                  onClick={() => setShowPeerModal(true)}
                  title="Award bonus points to a team that helped you!"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-all"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Thank Peer</span>
                </button>

                {/* Raise Hand Button */}
                <button
                  onClick={handleToggleHand}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                    handRaised
                      ? 'bg-rose-500 text-white animate-bounce shadow-rose-500/40'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
                  }`}
                >
                  <Hand className={`w-3.5 h-3.5 ${handRaised ? 'text-white' : 'text-rose-400'}`} />
                  <span>{handRaised ? 'Hand Raised!' : 'Raise Hand'}</span>
                </button>

                {/* Team Badge & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white truncate max-w-[120px]">{teamName}</p>
                    <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    title="Switch team / Logout"
                    className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : null}

            {/* Admin Switcher (Desktop) */}
            <button
              onClick={onOpenAdmin}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isAdminView
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 hover:bg-purple-600/30'
                  : 'bg-gray-800/80 text-gray-300 border-gray-700 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span>{isAdminView ? 'Student App' : 'Facilitator'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Peer-Help Modal */}
      {showPeerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111827] border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-blue-400" />
              Award Peer-Help Bonus
            </h3>
            <p className="text-xs text-gray-300 mt-2">
              Did another team jump in to help you fix a loose wire or troubleshoot code? Give them <strong className="text-emerald-400">+50 bonus points</strong> on the leaderboard! (Your team also receives +10 points for good sportsmanship).
            </p>

            {peerBonusSent ? (
              <div className="my-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Bonus Awarded to {selectedPeer}!
              </div>
            ) : (
              <div className="my-5">
                <label className="block text-xs font-semibold text-gray-400 mb-2">
                  Select the team that helped:
                </label>
                <select
                  value={selectedPeer}
                  onChange={(e) => setSelectedPeer(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Team --</option>
                  {whitelist
                    .filter((t) => t !== teamName)
                    .map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                </select>

                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowPeerModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedPeer}
                    onClick={handleSendPeerBonus}
                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                  >
                    Send +50 Bonus Points
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
