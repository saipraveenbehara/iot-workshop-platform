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
            className="pointer-events-auto p-4 rounded-2xl border border-[#EBE6DC] bg-white shadow-lg transition-all flex items-start gap-3.5"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                isSpeed
                  ? 'bg-[#FEF9EC] border border-[#F4C95D] text-[#B88719]'
                  : isPeer
                  ? 'bg-[#F1F7FA] border border-[#B9DCE8] text-[#2A9D8F]'
                  : 'bg-[#E6F4F2] border border-[#B2DFDB] text-[#2A9D8F]'
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
              <h4 className="text-xs font-extrabold tracking-wider uppercase text-[#24313A]">
                {toast.title}
              </h4>
              <p className="text-xs mt-1 leading-snug font-medium text-[#576875]">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#899AA8] hover:text-[#24313A] p-1 shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
