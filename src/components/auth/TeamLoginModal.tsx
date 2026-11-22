import React, { useState } from 'react';
import { Cpu, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#111827] border border-gray-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            NXplorers Student Innovation Bootcamp
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Welcome to the Learning Session!
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Let's begin with excitement. Enter your team name below to unlock your kits, access live guides, and compete on the classroom leaderboard.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Select Your Team Name:
              </label>
              <div className="relative">
                <select
                  value={selectedTeam}
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-gray-900/90 border border-gray-700 hover:border-gray-600 focus:border-emerald-500 rounded-2xl px-4 py-3.5 text-white font-medium text-sm appearance-none focus:outline-none transition-all cursor-pointer shadow-inner"
                >
                  <option value="">-- Choose your assigned team --</option>
                  {whitelist.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  ▼
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedTeam || isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-40 text-gray-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{isSubmitting ? 'Connecting...' : 'Enter Workshop Mission'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              10 Kits + 2 Spares Ready
            </span>
            <span>MicroPython • Pico WH</span>
          </div>
        </div>
      </div>
    </div>
  );
};
