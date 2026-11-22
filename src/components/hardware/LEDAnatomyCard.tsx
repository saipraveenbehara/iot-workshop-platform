import React, { useState } from 'react';
import { Zap, HelpCircle, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export const LEDAnatomyCard: React.FC = () => {
  const [isForwardBias, setIsForwardBias] = useState(true);

  return (
    <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
            Hardware Blueprint • Component Deep-Dive
          </span>
          <h3 className="text-xl font-extrabold text-white mt-0.5">
            The 5mm LED & 220Ω Resistor Anatomy
          </h3>
        </div>

        {/* Interactive Bias Switcher */}
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setIsForwardBias(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isForwardBias ? 'bg-emerald-500 text-gray-950 shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Forward (Correct)
          </button>
          <button
            onClick={() => setIsForwardBias(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isForwardBias ? 'bg-rose-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Reverse (Backwards)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: True Photorealistic SVG Diagram of Physical LED */}
        <div className="relative bg-[#070B14] border border-gray-800/80 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
          
          <svg viewBox="0 0 320 280" className="w-full max-w-[320px] select-none">
            <defs>
              <filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="epoxyGradGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34D399" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#10B981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="epoxyGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#064E3B" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#022C22" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="leadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="50%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>

            {/* Glowing Photon Aura when Forward Bias */}
            {isForwardBias && (
              <circle cx="160" cy="80" r="60" fill="#10B981" opacity="0.3" filter="url(#ledGlow)" />
            )}

            {/* Metal Leads (Legs) */}
            {/* Long Leg: Anode (+) on Left (or right depending on flip) */}
            <g>
              <rect x="142" y="130" width="5" height="135" fill="url(#leadGrad)" rx="1.5" />
              <text x="135" y="250" textAnchor="end" fill="#34D399" fontSize="10" fontWeight="extrabold" fontFamily="monospace">
                + ANODE
              </text>
              <text x="135" y="262" textAnchor="end" fill="#94A3B8" fontSize="8">
                (Longer Leg: 3.3V)
              </text>
            </g>

            {/* Short Leg: Cathode (-) on Right */}
            <g>
              <rect x="173" y="130" width="5" height="105" fill="url(#leadGrad)" rx="1.5" />
              <text x="185" y="225" textAnchor="start" fill="#F87171" fontSize="10" fontWeight="extrabold" fontFamily="monospace">
                - CATHODE
              </text>
              <text x="185" y="237" textAnchor="start" fill="#94A3B8" fontSize="8">
                (Shorter Leg: GND)
              </text>
            </g>

            {/* Internal Anvil & Post (visible through transparent epoxy) */}
            <g opacity="0.7">
              {/* Post (Anode side) */}
              <line x1="144" y1="130" x2="144" y2="80" stroke="#CBD5E1" strokeWidth="3" />
              {/* Anvil (Cathode side flag) */}
              <path d="M 175 130 L 175 85 L 155 85 L 165 70 Z" fill="#94A3B8" />
              {/* Semiconductor Die emitting photons */}
              <circle cx="152" cy="78" r="2.5" fill={isForwardBias ? '#FFFFFF' : '#475569'} />
            </g>

            {/* 5mm Dome Epoxy Bulb */}
            <g filter={isForwardBias ? 'url(#ledGlow)' : undefined}>
              {/* Dome */}
              <path
                d="M 125 125 L 125 75 A 35 35 0 0 1 195 75 L 195 125 Z"
                fill={isForwardBias ? 'url(#epoxyGradGreen)' : 'url(#epoxyGradDark)'}
                stroke={isForwardBias ? '#34D399' : '#047857'}
                strokeWidth="1.5"
              />
              {/* Plastic Base Rim with Flat Notch on Cathode Side */}
              <path
                d="M 120 125 L 195 125 L 195 132 L 120 132 Z"
                fill={isForwardBias ? '#059669' : '#064E3B'}
                stroke="#10B981"
                strokeWidth="0.5"
              />
              {/* Highlight Glare */}
              <ellipse cx="140" cy="65" rx="6" ry="16" fill="#FFFFFF" opacity="0.4" transform="rotate(-20 140 65)" />
            </g>

            {/* Flat Notch Callout */}
            <line x1="198" y1="128" x2="230" y2="128" stroke="#F87171" strokeWidth="1" strokeDasharray="2 2" />
            <text x="235" y="131" fill="#F87171" fontSize="8" fontWeight="bold">Flat Rim Notch (-)</text>
          </svg>

          {/* Real-time Status Badge */}
          <div className="mt-3">
            {isForwardBias ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Forward Biased: Current Flows (LED Glowing)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Reverse Biased: Current Blocked (No Light)</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Resistor & Polarity Guide */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>How to Never Wire an LED Backwards</span>
            </h4>
            <ul className="text-xs text-gray-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">1. Look at the Legs:</span>
                <span>The <strong>longer leg</strong> is the Anode (+). It connects towards the Pico's 3.3V GPIO pin.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">2. Feel the Plastic Rim:</span>
                <span>One side of the plastic rim has a <strong>flat notch</strong>. That flat edge marks the Cathode (-) going to Ground.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">3. Look Inside the Bulb:</span>
                <span>The larger triangular metal flag inside is the Cathode (-). The tiny pin is the Anode (+).</span>
              </li>
            </ul>
          </div>

          {/* 220Ω Resistor Color Bands Explained */}
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Decoding the 220Ω Resistor Bands</span>
            </h4>
            
            {/* Visual Resistor Graphic */}
            <div className="flex items-center justify-center py-2">
              <div className="relative flex items-center">
                <div className="w-8 h-1.5 bg-gray-400" />
                <div className="w-28 h-7 bg-[#D4A373] rounded-md border border-amber-900/60 flex items-center justify-around px-2 shadow-md">
                  <div className="w-2.5 h-full bg-[#E63946]" title="Band 1: Red (2)" />
                  <div className="w-2.5 h-full bg-[#E63946]" title="Band 2: Red (2)" />
                  <div className="w-2.5 h-full bg-[#78350F]" title="Band 3: Brown (x10)" />
                  <div className="w-2.5 h-full bg-[#D4AF37]" title="Band 4: Gold (±5%)" />
                </div>
                <div className="w-8 h-1.5 bg-gray-400" />
              </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center font-mono">
              Red (2) • Red (2) • Brown (×10) = <strong className="text-amber-300">220 Ohms (Ω)</strong>
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Resistors have <strong>no polarity</strong>. You can plug them in either way and they protect your LED with identical safety!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
