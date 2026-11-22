import React, { useState } from 'react';
import { Zap, ShieldCheck, CheckCircle2, AlertTriangle, Compass } from 'lucide-react';

export const LEDAnatomyCard: React.FC = () => {
  const [isForwardBias, setIsForwardBias] = useState(true);

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE6DC]">
        <div>
          <span className="text-xs font-bold text-[#21867A] uppercase tracking-wider font-mono">
            Component Guide • Visual Anatomy
          </span>
          <h3 className="text-xl lg:text-2xl font-black text-[#24313A] mt-0.5">
            The 5mm LED & 220Ω Resistor
          </h3>
        </div>

        {/* Interactive Bias Switcher */}
        <div className="flex items-center gap-2 bg-[#FFFDF7] border border-[#EBE6DC] p-1 rounded-xl shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setIsForwardBias(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isForwardBias ? 'bg-[#2A9D8F] text-white shadow-sm' : 'text-[#576875] hover:text-[#24313A]'
            }`}
          >
            Forward (Lights Up)
          </button>
          <button
            onClick={() => setIsForwardBias(false)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isForwardBias ? 'bg-[#F28C75] text-white shadow-sm' : 'text-[#576875] hover:text-[#24313A]'
            }`}
          >
            Reverse (Blocks Current)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Editorial Vector Diagram of Physical LED */}
        <div className="relative bg-[#FFFDF7] border border-[#EBE6DC] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] shadow-inner">
          
          <svg viewBox="0 0 320 280" className="w-full max-w-[300px] select-none">
            <defs>
              <linearGradient id="epoxyGradBright" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34D399" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#10B981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="epoxyGradOffBright" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="leadGradBright" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CBD5E1" />
                <stop offset="50%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>

            {/* Glowing Photon Aura when Forward Bias */}
            {isForwardBias && (
              <circle cx="160" cy="80" r="55" fill="#2A9D8F" opacity="0.15" />
            )}

            {/* Metal Leads (Legs) */}
            {/* Long Leg: Anode (+) on Left */}
            <g>
              <rect x="142" y="130" width="5" height="135" fill="url(#leadGradBright)" rx="1.5" />
              <text x="135" y="250" textAnchor="end" fill="#21867A" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
                + ANODE
              </text>
              <text x="135" y="262" textAnchor="end" fill="#576875" fontSize="8">
                (Longer Leg: 3.3V)
              </text>
            </g>

            {/* Short Leg: Cathode (-) on Right */}
            <g>
              <rect x="173" y="130" width="5" height="105" fill="url(#leadGradBright)" rx="1.5" />
              <text x="185" y="225" textAnchor="start" fill="#F28C75" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
                - CATHODE
              </text>
              <text x="185" y="237" textAnchor="start" fill="#576875" fontSize="8">
                (Shorter Leg: GND)
              </text>
            </g>

            {/* Internal Anvil & Post */}
            <g opacity="0.8">
              <line x1="144" y1="130" x2="144" y2="80" stroke="#94A3B8" strokeWidth="2.5" />
              <path d="M 175 130 L 175 85 L 155 85 L 165 70 Z" fill="#64748B" />
              <circle cx="152" cy="78" r="2.5" fill={isForwardBias ? '#FFFFFF' : '#94A3B8'} />
            </g>

            {/* 5mm Dome Epoxy Bulb */}
            <g>
              <path
                d="M 125 125 L 125 75 A 35 35 0 0 1 195 75 L 195 125 Z"
                fill={isForwardBias ? 'url(#epoxyGradBright)' : 'url(#epoxyGradOffBright)'}
                stroke={isForwardBias ? '#10B981' : '#6EE7B7'}
                strokeWidth="1.5"
              />
              <path
                d="M 120 125 L 195 125 L 195 132 L 120 132 Z"
                fill={isForwardBias ? '#059669' : '#CBD5E1'}
                stroke="#64748B"
                strokeWidth="0.5"
              />
              <ellipse cx="140" cy="65" rx="5" ry="14" fill="#FFFFFF" opacity="0.5" transform="rotate(-20 140 65)" />
            </g>

            {/* Flat Notch Callout */}
            <line x1="198" y1="128" x2="228" y2="128" stroke="#F28C75" strokeWidth="1" strokeDasharray="2 2" />
            <text x="232" y="131" fill="#F28C75" fontSize="8.5" fontWeight="bold">Flat Rim (-)</text>
          </svg>

          {/* Real-time Status Badge */}
          <div className="mt-3">
            {isForwardBias ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A] text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Forward Biased: Current Flows (LED On)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF1EE] border border-[#F8C8BE] text-[#F28C75] text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Reverse Biased: Current Blocked (LED Off)</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Resistor & Polarity Guide */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2.5">
            <h4 className="text-sm font-bold text-[#24313A] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#2A9D8F]" />
              <span>Three Ways to Identify LED Polarity</span>
            </h4>
            <ul className="text-xs text-[#576875] space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#21867A] font-bold">1. Leg Length:</span>
                <span>The <strong>longer leg</strong> is always the Anode (+), which receives the 3.3V GPIO signal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F28C75] font-bold">2. Rim Notch:</span>
                <span>The plastic base rim has a tiny <strong>flat notch</strong> on the Cathode (-) side, which connects to Ground.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#DBAF40] font-bold">3. Internal Flags:</span>
                <span>The larger triangular flag inside the plastic dome is the Cathode (-).</span>
              </li>
            </ul>
          </div>

          {/* 220Ω Resistor Color Bands Explained */}
          <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-3">
            <h4 className="text-sm font-bold text-[#24313A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2A9D8F]" />
              <span>Decoding the 220Ω Current Limiter</span>
            </h4>
            
            {/* Visual Resistor Graphic */}
            <div className="flex items-center justify-center py-2">
              <div className="relative flex items-center">
                <div className="w-8 h-1.5 bg-gray-300" />
                <div className="w-28 h-7 bg-[#D5B597] rounded-md border border-[#8C6D4F] flex items-center justify-around px-2 shadow-sm">
                  <div className="w-2.5 h-full bg-[#E63946]" title="Band 1: Red (2)" />
                  <div className="w-2.5 h-full bg-[#E63946]" title="Band 2: Red (2)" />
                  <div className="w-2.5 h-full bg-[#78350F]" title="Band 3: Brown (x10)" />
                  <div className="w-2.5 h-full bg-[#D4AF37]" title="Band 4: Gold (±5%)" />
                </div>
                <div className="w-8 h-1.5 bg-gray-300" />
              </div>
            </div>

            <p className="text-[11px] text-[#576875] text-center font-mono">
              Red (2) • Red (2) • Brown (×10) = <strong className="text-[#24313A]">220 Ohms (Ω)</strong>
            </p>
            <p className="text-xs text-[#576875] leading-relaxed">
              Resistors have <strong>no polarity</strong>. You can plug them in either direction to protect the LED safely.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
