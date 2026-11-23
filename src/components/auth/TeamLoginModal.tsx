import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle, Users } from 'lucide-react';
import { useSocketStore } from '../../store/useSocketStore.js';
import whitelist from '../../data/whitelistTeams.json' with { type: 'json' };

export const TeamLoginModal: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitLogin } = useSocketStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) {
      setError('Please select your team from the roster.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await submitLogin(selectedTeam);
    if (!res.success) {
      setError(res.error || 'Team authorization failed.');
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
            Select your assigned team name to load your workbench kit, circuit guides, and real-time activities.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#576875] uppercase tracking-wider mb-2">
                Select Your Team:
              </label>
              <div className="relative">
                <select
                  value={selectedTeam}
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-[#FFFDF7] border border-[#EBE6DC] hover:border-[#D5CFC2] focus:border-[#2A9D8F] rounded-2xl px-4 py-3.5 text-[#24313A] font-semibold text-sm appearance-none focus:outline-none transition-all cursor-pointer shadow-xs"
                >
                  <option value="">-- Choose your team name --</option>
                  {whitelist.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#576875]">
                  ▼
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
              disabled={!selectedTeam || isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#2A9D8F] hover:bg-[#21867A] disabled:opacity-40 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Opening Workbench...' : 'Enter Workshop'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#EBE6DC] flex items-center justify-between text-xs text-[#576875]">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#2A9D8F]" />
              10 Kits + 2 Spares Verified
            </span>
            <span className="font-mono text-[11px] text-[#899AA8]">C / C++ • ESP32 DevKit V1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
