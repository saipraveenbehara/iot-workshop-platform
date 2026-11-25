import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, X, AlertCircle, Sparkles } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const cleanUser = userId.trim();
    const cleanPass = password.trim();

    // Verification check: User ID = admin, Password = admin
    if (cleanUser === 'admin' && cleanPass === 'admin') {
      setIsSubmitting(false);
      onSuccess();
    } else {
      setIsSubmitting(false);
      setError('Invalid admin credentials. (Hint: User ID: admin, Password: admin)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24313A]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#EBE6DC] rounded-3xl max-w-md w-full p-7 lg:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#899AA8] hover:text-[#24313A] hover:bg-[#FFFDF7] transition-all cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A] text-[11px] font-bold uppercase tracking-wider font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2A9D8F]" />
            <span>Instructor Portal Access</span>
          </div>

          <h3 className="text-2xl font-black text-[#24313A] tracking-tight">
            Admin Authentication
          </h3>
          <p className="text-xs sm:text-sm text-[#576875] leading-relaxed">
            Enter your instructor credentials to manage team accounts, view live hand-raising requests, and track workbench leaderboard telemetry.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#576875] uppercase tracking-wider mb-1.5">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setError(null);
              }}
              placeholder="admin"
              autoFocus
              className="w-full bg-[#FFFDF7] border border-[#EBE6DC] focus:border-[#2A9D8F] rounded-2xl px-4 py-3 text-sm text-[#24313A] font-medium focus:outline-none transition-all shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#576875] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="•••••"
              className="w-full bg-[#FFFDF7] border border-[#EBE6DC] focus:border-[#2A9D8F] rounded-2xl px-4 py-3 text-sm text-[#24313A] font-medium focus:outline-none transition-all shadow-xs"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-[#FDF1EE] border border-[#F28C75] text-[#D95D43] text-xs flex items-center gap-2 font-semibold animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#F28C75]" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !userId || !password}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#2A9D8F] hover:bg-[#21867A] disabled:opacity-40 text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Access Admin Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-[#EBE6DC] text-center">
          <p className="text-[11px] text-[#899AA8]">
            Workshop Facilitator System • Default: <strong className="text-[#576875] font-mono">admin / admin</strong>
          </p>
        </div>

      </div>
    </div>
  );
};
