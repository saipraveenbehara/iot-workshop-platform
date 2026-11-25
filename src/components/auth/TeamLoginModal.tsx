import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle, Users, Radio, Lock } from 'lucide-react';
import { useSocketStore } from '../../store/useSocketStore.js';
import { useRosterStore } from '../../store/useRosterStore.js';

interface TeamLoginModalProps {
  onOpenInstructor?: () => void;
}

export const TeamLoginModal: React.FC<TeamLoginModalProps> = ({ onOpenInstructor }) => {
  const [typedTeam, setTypedTeam] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitLogin } = useSocketStore();
  const { teams } = useRosterStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = typedTeam.trim();
    if (!cleanName) {
      setError('Please enter your assigned team name.');
      return;
    }

    // Verify team name exists in instructor's authorized roster (case-insensitive)
    const matched = teams.find((t) => t.toLowerCase() === cleanName.toLowerCase());
    if (!matched) {
      setError(`Team "${cleanName}" has not been registered yet. Please ask your instructor to add your team in the Admin Portal.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await submitLogin(matched);
    if (!res.success) {
      setError(res.error || 'Team authorization failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24313A]/50 backdrop-blur-xs">
      <div className="bg-white border border-[#EBE6DC] rounded-3xl max-w-lg w-full p-8 shadow-xl relative">
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F2] border border-[#B2DFDB] text-[#2A9D8F] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Maker-Space Workshop
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#24313A] tracking-tight leading-tight">
            Welcome to the Workbench
          </h2>
          <p className="text-sm text-[#576875] mt-2 leading-relaxed">
            Enter your team name to sign in and launch your interactive ESP32 workbench kit and live IoT activities.
          </p>

          {teams.length === 0 ? (
            /* Waiting for Instructor State */
            <div className="mt-8 p-6 rounded-2xl bg-[#FFFDF7] border-2 border-dashed border-[#EBE6DC] text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF9EC] border border-[#FCEFCB] flex items-center justify-center text-[#DBAF40] mx-auto">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#24313A]">Waiting for Session Setup</h4>
                <p className="text-xs text-[#576875] mt-1.5 leading-relaxed">
                  No team accounts have been created yet. Please wait for your instructor to launch the session and add team names.
                </p>
              </div>
              {onOpenInstructor && (
                <button
                  onClick={onOpenInstructor}
                  className="px-4 py-2.5 rounded-xl bg-[#2A9D8F] hover:bg-[#21867A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Instructor: Enter Admin Portal
                </button>
              )}
            </div>
          ) : (
            /* Standard Team Login Form */
            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#576875] uppercase tracking-wider mb-2">
                  Enter Your Assigned Team Name:
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={typedTeam}
                    onChange={(e) => {
                      setTypedTeam(e.target.value);
                      setError(null);
                    }}
                    placeholder="Type team name (e.g., CyberKnights, SolarMinds)..."
                    autoFocus
                    className="w-full bg-[#FFFDF7] border border-[#EBE6DC] hover:border-[#D5CFC2] focus:border-[#2A9D8F] rounded-2xl px-4 py-3.5 text-[#24313A] font-semibold text-sm focus:outline-none transition-all shadow-xs"
                  />

                  {/* Quick Select from Active Roster */}
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-[#899AA8] uppercase tracking-wider block mb-1.5">
                      Or pick from active registered teams:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-[#FFFDF7] border border-[#EBE6DC] rounded-xl">
                      {teams.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setTypedTeam(t);
                            setError(null);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            typedTeam.toLowerCase() === t.toLowerCase()
                              ? 'bg-[#2A9D8F] text-white shadow-xs'
                              : 'bg-white border border-[#EBE6DC] text-[#24313A] hover:border-[#2A9D8F]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-[#FDF1EE] border border-[#F28C75] text-[#D95D43] text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#F28C75]" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!typedTeam.trim() || isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#2A9D8F] hover:bg-[#21867A] disabled:opacity-40 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer"
              >
                <span>{isSubmitting ? 'Opening Workbench...' : 'Enter Workshop'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-[#EBE6DC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#576875]">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#2A9D8F]" />
              ESP32 C/C++ Workbench Lab
            </span>
            
            {onOpenInstructor && (
              <button
                type="button"
                onClick={onOpenInstructor}
                className="text-xs font-bold text-[#2A9D8F] hover:text-[#21867A] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Instructor Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

