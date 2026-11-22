import React from 'react';
import { Trophy, HeartHandshake, Zap, X } from 'lucide-react';
import { useSocketStore } from '../../store/useSocketStore.js';

export const ToastAlert: React.FC = () => {
  const { activeToasts, dismissToast } = useSocketStore();

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {activeToasts.map((toast) => {
        const isSpeed = toast.type === 'speed_race';
        const isPeer = toast.type === 'peer_help';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all animate-bounce-short flex items-start gap-3.5 ${
              isSpeed
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-500/20'
                : isPeer
                ? 'bg-blue-950/90 border-blue-500/50 text-blue-100 shadow-blue-500/20'
                : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-500/20'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                isSpeed
                  ? 'bg-amber-500 text-gray-950'
                  : isPeer
                  ? 'bg-blue-500 text-white'
                  : 'bg-emerald-500 text-gray-950'
              }`}
            >
              {isSpeed ? (
                <Trophy className="w-5 h-5" />
              ) : isPeer ? (
                <HeartHandshake className="w-5 h-5" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                {toast.title}
              </h4>
              <p className="text-xs mt-1 leading-snug font-medium opacity-95">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-white p-1 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
