import React, { useState } from 'react';
import { 
  Cpu, 
  Trophy, 
  Hand, 
  HeartHandshake, 
  LogOut, 
  CheckCircle2, 
  CircleDot,
  Radio,
  BookOpen
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

  const { isConnected, raiseHand, cancelHand, awardPeerBonus } = useSocketStore();
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EBE6DC] px-4 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Platform Title (Editorial Science Magazine Header) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A9D8F] flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base lg:text-lg font-extrabold text-[#24313A] tracking-tight">
                    NXplorers Maker Lab
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E6F4F2] text-[#21867A] border border-[#B2DFDB]">
                    Workbench
                  </span>
                </div>
                <p className="text-xs text-[#576875] font-medium">Raspberry Pi Pico WH • MicroPython</p>
              </div>
            </div>

            {/* Connection Indicator & Admin Toggle (Mobile) */}
            <div className="flex items-center gap-2 md:hidden">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#2A9D8F]' : 'bg-[#F28C75]'}`} />
              <button
                onClick={onOpenAdmin}
                className="text-xs font-semibold text-[#576875] hover:text-[#24313A] px-2.5 py-1 rounded-lg bg-[#FFFDF7] border border-[#EBE6DC]"
              >
                {isAdminView ? 'Student App' : 'Facilitator'}
              </button>
            </div>
          </div>

          {/* Level Progress Stepper (Clear & Purposeful) */}
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-[#2A9D8F] text-white shadow-sm'
                        : isCompleted
                        ? 'bg-[#E6F4F2] text-[#21867A] border border-[#B2DFDB] hover:bg-[#D1ECE8]'
                        : isLocked
                        ? 'bg-[#FFFDF7] text-[#899AA8] cursor-not-allowed border border-[#EBE6DC]/60'
                        : 'bg-white text-[#576875] border border-[#EBE6DC] hover:border-[#D5CFC2]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2A9D8F]" />
                    ) : isCurrent ? (
                      <CircleDot className="w-3.5 h-3.5 text-white animate-pulse" />
                    ) : (
                      <span className="w-3.5 h-3.5 text-center leading-none text-[10px] font-bold">
                        {lvl.levelNumber}
                      </span>
                    )}
                    <span>Stage {lvl.levelNumber}</span>
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
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF9EC] border border-[#FCEFCB] text-[#24313A] font-extrabold text-xs">
                  <Trophy className="w-3.5 h-3.5 text-[#DBAF40]" />
                  <span>{score} pts</span>
                </div>

                {/* Peer-Help Bonus Button */}
                <button
                  onClick={() => setShowPeerModal(true)}
                  title="Thank a team that helped you"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F1F7FA] border border-[#D4EBF2] text-[#24313A] hover:bg-[#E0F0F5] text-xs font-bold transition-all"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-[#2A9D8F]" />
                  <span className="hidden sm:inline">Thank Peer</span>
                </button>

                {/* Raise Hand Button */}
                <button
                  onClick={handleToggleHand}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    handRaised
                      ? 'bg-[#F28C75] text-white shadow-sm'
                      : 'bg-white hover:bg-[#FFFDF7] text-[#24313A] border border-[#EBE6DC] hover:border-[#D5CFC2]'
                  }`}
                >
                  <Hand className={`w-3.5 h-3.5 ${handRaised ? 'text-white' : 'text-[#F28C75]'}`} />
                  <span>{handRaised ? 'Mentor Summoned' : 'Ask Mentor'}</span>
                </button>

                {/* Team Badge & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-[#EBE6DC]">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-[#24313A] truncate max-w-[120px]">{teamName}</p>
                    <p className="text-[10px] text-[#576875] flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F]" /> Ready
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    title="Switch team / Logout"
                    className="p-1.5 text-[#899AA8] hover:text-[#F28C75] hover:bg-[#FDF1EE] rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : null}

            {/* Facilitator Switcher (Desktop) */}
            <button
              onClick={onOpenAdmin}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isAdminView
                  ? 'bg-[#E6F4F2] text-[#21867A] border-[#B2DFDB]'
                  : 'bg-white text-[#576875] border-[#EBE6DC] hover:border-[#D5CFC2] hover:text-[#24313A]'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-[#2A9D8F]" />
              <span>{isAdminView ? 'Student View' : 'Facilitator View'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Peer-Help Modal */}
      {showPeerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24313A]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#EBE6DC] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-[#24313A] flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#2A9D8F]" />
              Award Peer-Help Credit
            </h3>
            <p className="text-xs text-[#576875] mt-2 leading-relaxed">
              Did a fellow maker help your station troubleshoot a connection or debug code? Award them <strong className="text-[#2A9D8F] font-bold">+50 points</strong> as a token of teamwork!
            </p>

            {peerBonusSent ? (
              <div className="my-6 p-4 rounded-2xl bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A] text-center font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Bonus Awarded to {selectedPeer}!
              </div>
            ) : (
              <div className="my-5">
                <label className="block text-xs font-bold text-[#24313A] mb-2">
                  Select the team that helped:
                </label>
                <select
                  value={selectedPeer}
                  onChange={(e) => setSelectedPeer(e.target.value)}
                  className="w-full bg-[#FFFDF7] border border-[#EBE6DC] rounded-xl px-3 py-2.5 text-sm text-[#24313A] focus:outline-none focus:border-[#2A9D8F]"
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
                    className="px-4 py-2 text-xs font-bold text-[#576875] hover:text-[#24313A]"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedPeer}
                    onClick={handleSendPeerBonus}
                    className="px-5 py-2.5 text-xs font-bold bg-[#2A9D8F] hover:bg-[#21867A] disabled:opacity-40 text-white rounded-xl shadow-sm transition-all"
                  >
                    Send Teamwork Credit
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
