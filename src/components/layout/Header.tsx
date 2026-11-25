import React, { useState, useRef, useEffect } from 'react';
import { 
  Trophy, 
  Hand, 
  HeartHandshake, 
  LogOut, 
  CheckCircle2, 
  CircleDot,
  Radio,
  BookOpen,
  Menu,
  X,
  ChevronDown,
  Layers,
  Sparkles
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
  const [showMenu, setShowMenu] = useState(false);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowStageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const currentLevelInfo = curriculum.find(l => l.levelNumber === activeLevelView) || curriculum[0];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EBE6DC] px-4 lg:px-8 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Brand & Current Stage Pill */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#2A9D8F] flex items-center justify-center text-white shadow-xs shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#24313A] tracking-tight truncate">
                  Maker Lab
                </span>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#CBD5E1]" />
                {/* Current Stage Pill with Clickable Stage Selector */}
                {!isAdminView && (
                  <div className="relative">
                    <button
                      onClick={() => setShowStageDropdown(!showStageDropdown)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E6F4F2] text-[#21867A] border border-[#B2DFDB] text-xs font-bold hover:bg-[#D5EFEA] transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F]" />
                      <span>Stage {activeLevelView}: {currentLevelInfo.title.split(':')[1]?.trim() || currentLevelInfo.title}</span>
                      <ChevronDown className="w-3 h-3 text-[#2A9D8F]" />
                    </button>

                    {/* Stage Quick-Select Dropdown */}
                    {showStageDropdown && (
                      <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-[#EBE6DC] rounded-2xl shadow-xl p-2 z-50 animate-fade-in space-y-1">
                        <div className="px-2.5 py-1 text-[11px] font-bold text-[#899AA8] uppercase tracking-wider">
                          Switch Stage
                        </div>
                        {curriculum.map((lvl) => {
                          const isCompleted = completedLevels.includes(lvl.levelNumber);
                          const isCurrent = activeLevelView === lvl.levelNumber;
                          const isLocked = lvl.levelNumber > currentLevel;

                          return (
                            <button
                              key={lvl.levelNumber}
                              disabled={isLocked}
                              onClick={() => {
                                setActiveLevelView(lvl.levelNumber);
                                setShowStageDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                                isCurrent
                                  ? 'bg-[#2A9D8F] text-white'
                                  : isCompleted
                                  ? 'bg-[#E6F4F2] text-[#21867A] hover:bg-[#D5EFEA]'
                                  : isLocked
                                  ? 'text-[#899AA8] opacity-50 cursor-not-allowed'
                                  : 'text-[#24313A] hover:bg-[#FFFDF7]'
                              }`}
                            >
                              <span>Stage {lvl.levelNumber}: {lvl.title.split(':')[1]?.trim() || lvl.title}</span>
                              {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {isCurrent && <span className="text-[10px] uppercase font-black">Active</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls: Points, Mentor Help, Team & Simplified Menu */}
          <div className="flex items-center gap-2 shrink-0" ref={menuRef}>
            {teamName && (
              <>
                {/* Score Pill */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF9EC] border border-[#F4C95D] text-[#24313A] font-extrabold text-xs shadow-xs">
                  <Trophy className="w-3.5 h-3.5 text-[#B88719]" />
                  <span>{score} pts</span>
                </div>

                {/* Primary Action: Ask Mentor Button */}
                <button
                  onClick={handleToggleHand}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                    handRaised
                      ? 'bg-[#F28C75] text-white'
                      : 'bg-white hover:bg-[#FFFDF7] text-[#24313A] border border-[#EBE6DC] hover:border-[#D5CFC2]'
                  }`}
                >
                  <Hand className={`w-3.5 h-3.5 ${handRaised ? 'text-white' : 'text-[#F28C75]'}`} />
                  <span className="hidden sm:inline">{handRaised ? 'Mentor Summoned' : 'Ask Mentor'}</span>
                  <span className="sm:hidden">{handRaised ? 'Help' : 'Help'}</span>
                </button>

                {/* Team Pill */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF7] border border-[#EBE6DC] text-[#24313A] font-bold text-xs max-w-[150px]">
                  <span className="w-2 h-2 rounded-full bg-[#2A9D8F] shrink-0" />
                  <span className="truncate">{teamName}</span>
                </div>
              </>
            )}

            {/* Menu Dropdown Toggle (Holds Secondary Actions) */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#D5CFC2] text-[#24313A] transition-all shadow-xs cursor-pointer flex items-center justify-center"
                title="Workshop Menu"
              >
                {showMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

              {/* Secondary Actions Dropdown */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#EBE6DC] rounded-2xl shadow-xl p-2 z-50 animate-fade-in space-y-1">
                  {teamName && (
                    <div className="px-3 py-2 border-b border-[#EBE6DC] mb-1">
                      <p className="text-[11px] text-[#899AA8] font-medium">Logged in Team</p>
                      <p className="text-xs font-extrabold text-[#24313A] truncate">{teamName}</p>
                    </div>
                  )}

                  {/* Thank a Peer Team */}
                  {teamName && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowPeerModal(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#24313A] hover:bg-[#F1F7FA] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <HeartHandshake className="w-4 h-4 text-[#2A9D8F]" />
                      <span>Thank Peer (+50 pts)</span>
                    </button>
                  )}

                  {/* Facilitator View Toggle */}
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#24313A] hover:bg-[#E6F4F2] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Radio className="w-4 h-4 text-[#2A9D8F]" />
                    <span>{isAdminView ? 'Switch to Student View' : 'Instructor Admin Portal'}</span>
                  </button>

                  {/* Logout / Switch Team */}
                  {teamName && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#D95D43] hover:bg-[#FDF1EE] flex items-center gap-2.5 transition-colors cursor-pointer border-t border-[#EBE6DC] mt-1 pt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Switch Team / Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Peer-Help Modal */}
      {showPeerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24313A]/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#EBE6DC] rounded-3xl max-w-md w-full p-6 shadow-xl relative">
            <h3 className="text-lg font-bold text-[#24313A] flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#2A9D8F]" />
              Award Peer-Help Credit
            </h3>
            <p className="text-xs text-[#576875] mt-2 leading-relaxed">
              Did another student team help your station troubleshoot a connection or debug code? Award them <strong className="text-[#2A9D8F] font-bold">+50 points</strong> for teamwork!
            </p>

            {peerBonusSent ? (
              <div className="my-6 p-4 rounded-2xl bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A] text-center font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Teamwork bonus awarded to {selectedPeer}!
              </div>
            ) : (
              <div className="my-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#24313A] mb-1.5">
                    Select the team that helped you:
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
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowPeerModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#576875] hover:text-[#24313A] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedPeer}
                    onClick={handleSendPeerBonus}
                    className="px-5 py-2.5 text-xs font-bold bg-[#2A9D8F] hover:bg-[#21867A] disabled:opacity-40 text-white rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Send +50 Points
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
