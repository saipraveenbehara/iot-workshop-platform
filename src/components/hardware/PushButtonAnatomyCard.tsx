import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, Sliders, ArrowDown, Radio } from 'lucide-react';

export const PushButtonAnatomyCard: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            Hardware Blueprint • Component Deep-Dive
          </span>
          <h3 className="text-xl font-extrabold text-white mt-0.5">
            The 4-Pin Tactile Push Button Anatomy
          </h3>
        </div>

        <div className="text-xs text-gray-400 font-mono">
          Model: 6x6mm Momentary SPST Switch
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Realistic 4-Pin Tactile Button SVG with Interactive Click */}
        <div className="bg-[#070B14] border border-gray-800/80 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
          
          <svg viewBox="0 0 320 280" className="w-full max-w-[320px] select-none">
            <defs>
              <filter id="btnShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.8" />
              </filter>
              <linearGradient id="metalPlate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="50%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
              <linearGradient id="plungerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isPressed ? '#F97316' : '#38BDF8'} />
                <stop offset="100%" stopColor={isPressed ? '#C2410C' : '#0284C7'} />
              </linearGradient>
            </defs>

            {/* 4 Curved Metal Legs */}
            {/* Top-Left Leg (Pin 1) */}
            <path d="M 80 80 C 40 80, 40 100, 30 110" fill="none" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
            <text x="25" y="125" fill="#60A5FA" fontSize="8" fontWeight="bold">Pin 1 (GP14)</text>

            {/* Bottom-Left Leg (Pin 2 - Internally linked to Pin 1) */}
            <path d="M 80 180 C 40 180, 40 160, 30 150" fill="none" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
            <text x="25" y="165" fill="#94A3B8" fontSize="8">Pin 2 (Linked to 1)</text>

            {/* Top-Right Leg (Pin 3 - GND) */}
            <path d="M 240 80 C 280 80, 280 100, 290 110" fill="none" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
            <text x="295" y="125" fill="#F87171" fontSize="8" fontWeight="bold">Pin 3 (GND)</text>

            {/* Bottom-Right Leg (Pin 4 - Internally linked to Pin 3) */}
            <path d="M 240 180 C 280 180, 280 160, 290 150" fill="none" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
            <text x="295" y="165" fill="#94A3B8" fontSize="8">Pin 4 (Linked to 3)</text>

            {/* Square Black Housing Body */}
            <rect x="75" y="55" width="170" height="150" rx="10" fill="#1E293B" stroke="#0F172A" strokeWidth="2" filter="url(#btnShadow)" />

            {/* Metal Top Shield Plate */}
            <rect x="85" y="65" width="150" height="130" rx="8" fill="url(#metalPlate)" stroke="#64748B" strokeWidth="1" />
            {/* 4 Corner Rivets */}
            <circle cx="95" cy="75" r="3" fill="#475569" />
            <circle cx="225" cy="75" r="3" fill="#475569" />
            <circle cx="95" cy="185" r="3" fill="#475569" />
            <circle cx="225" cy="185" r="3" fill="#475569" />

            {/* Center Circular Well */}
            <circle cx="160" cy="130" r="42" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />

            {/* Interactive Round Tactile Plunger Button */}
            <g
              className="cursor-pointer"
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
            >
              <circle
                cx="160"
                cy="130"
                r={isPressed ? "33" : "36"}
                fill="url(#plungerGrad)"
                stroke={isPressed ? '#EA580C' : '#0369A1'}
                strokeWidth="2"
                filter="url(#btnShadow)"
                className="transition-all duration-100"
              />
              <text x="160" y="134" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="extrabold">
                {isPressed ? 'PRESSED' : 'PUSH'}
              </text>
            </g>

            {/* Internal Circuit Indicator Arrows */}
            {isPressed ? (
              <path d="M 80 130 L 240 130" stroke="#EA580C" strokeWidth="3" strokeDasharray="4 2" />
            ) : (
              <path d="M 80 130 L 130 130 M 190 130 L 240 130" stroke="#94A3B8" strokeWidth="2" strokeDasharray="2 2" />
            )}
          </svg>

          {/* Interactive Status Indicator */}
          <div className="mt-3 text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              isPressed 
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' 
                : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
            }`}>
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{isPressed ? 'Switch Closed: Voltage = 0V (LOW)' : 'Switch Open: Pull-Up = 3.3V (HIGH)'}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Why 4 Pins & Why Straddle the Trench */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Why Does a Push Button Have 4 Legs?</span>
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Inside, the 4 legs are actually <strong>2 pairs</strong>!
            </p>
            <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>Left Legs (Pin 1 and 2):</strong> Connected together inside the plastic.</li>
              <li><strong>Right Legs (Pin 3 and 4):</strong> Connected together inside the plastic.</li>
              <li>When you push the button, a tiny flexible metal disc snaps down, bridging the left pair to the right pair!</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Why Straddle the Center Trench?</span>
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              On a breadboard, all 5 holes in a row (A, B, C, D, E) touch each other. If you placed both legs on the same side, the breadboard's internal clips would permanently short the button, making it permanently "stuck on"!
            </p>
            <p className="text-xs text-emerald-300 font-semibold pt-1">
              ✓ Straddling Row 10 Col E and Col F spans the divider trench, isolating the left pair from the right pair until pressed.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
