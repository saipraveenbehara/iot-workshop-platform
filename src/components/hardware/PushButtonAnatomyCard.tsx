import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, Radio, Compass } from 'lucide-react';

export const PushButtonAnatomyCard: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE6DC]">
        <div>
          <span className="text-xs font-bold text-[#21867A] uppercase tracking-wider font-mono">
            Component Guide • Visual Anatomy
          </span>
          <h3 className="text-xl lg:text-2xl font-black text-[#24313A] mt-0.5">
            The 4-Pin Tactile Push Button
          </h3>
        </div>

        <div className="text-xs text-[#576875] font-mono bg-[#FFFDF7] px-3 py-1.5 rounded-xl border border-[#EBE6DC]">
          6×6 mm Tactile Momentary Switch
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Authentic 4-Pin Tactile Button SVG with Interactive Click */}
        <div className="bg-[#FFFDF7] border border-[#EBE6DC] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] shadow-inner">
          
          <svg viewBox="0 0 320 280" className="w-full max-w-[290px] select-none">
            <defs>
              <linearGradient id="metalPlateBright" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="50%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
            </defs>

            {/* 4 Curved Metal Legs */}
            {/* Top-Left Leg (Pin 1) */}
            <path d="M 80 80 C 40 80, 40 100, 30 110" fill="none" stroke="#94A3B8" strokeWidth="5.5" strokeLinecap="round" />
            <text x="25" y="125" fill="#2A9D8F" fontSize="8.5" fontWeight="bold">Pin 1 (GP14)</text>

            {/* Bottom-Left Leg (Pin 2) */}
            <path d="M 80 180 C 40 180, 40 160, 30 150" fill="none" stroke="#94A3B8" strokeWidth="5.5" strokeLinecap="round" />
            <text x="25" y="165" fill="#899AA8" fontSize="8">Pin 2 (Linked)</text>

            {/* Top-Right Leg (Pin 3) */}
            <path d="M 240 80 C 280 80, 280 100, 290 110" fill="none" stroke="#94A3B8" strokeWidth="5.5" strokeLinecap="round" />
            <text x="295" y="125" fill="#F28C75" fontSize="8.5" fontWeight="bold">Pin 3 (GND)</text>

            {/* Bottom-Right Leg (Pin 4) */}
            <path d="M 240 180 C 280 180, 280 160, 290 150" fill="none" stroke="#94A3B8" strokeWidth="5.5" strokeLinecap="round" />
            <text x="295" y="165" fill="#899AA8" fontSize="8">Pin 4 (Linked)</text>

            {/* Square Housing Body */}
            <rect x="75" y="55" width="170" height="150" rx="10" fill="#334155" stroke="#1E293B" strokeWidth="2" />

            {/* Metal Top Shield Plate */}
            <rect x="85" y="65" width="150" height="130" rx="8" fill="url(#metalPlateBright)" stroke="#94A3B8" strokeWidth="1" />
            {/* 4 Corner Rivets */}
            <circle cx="95" cy="75" r="3" fill="#64748B" />
            <circle cx="225" cy="75" r="3" fill="#64748B" />
            <circle cx="95" cy="185" r="3" fill="#64748B" />
            <circle cx="225" cy="185" r="3" fill="#64748B" />

            {/* Center Circular Well */}
            <circle cx="160" cy="130" r="42" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />

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
                fill={isPressed ? '#F28C75' : '#2A9D8F'}
                stroke={isPressed ? '#E06E55' : '#21867A'}
                strokeWidth="2"
                className="transition-all duration-100"
              />
              <text x="160" y="134" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="extrabold">
                {isPressed ? 'PRESSED' : 'PRESS ME'}
              </text>
            </g>

            {/* Internal Circuit Indicator Arrows */}
            {isPressed ? (
              <path d="M 80 130 L 240 130" stroke="#F28C75" strokeWidth="3" strokeDasharray="4 2" />
            ) : (
              <path d="M 80 130 L 130 130 M 190 130 L 240 130" stroke="#94A3B8" strokeWidth="2" strokeDasharray="2 2" />
            )}
          </svg>

          {/* Interactive Status Indicator */}
          <div className="mt-3 text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              isPressed 
                ? 'bg-[#FDF1EE] border border-[#F8C8BE] text-[#F28C75]' 
                : 'bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A]'
            }`}>
              <Radio className="w-3.5 h-3.5" />
              <span>{isPressed ? 'Contact Made: Signal Pulled to 0V (LOW)' : 'Contact Open: Pin Pulled UP to 3.3V (HIGH)'}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Why 4 Pins & Why Straddle the Trench */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2">
            <h4 className="text-sm font-bold text-[#24313A] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#2A9D8F]" />
              <span>Why Does a Push Button Have 4 Legs?</span>
            </h4>
            <p className="text-xs text-[#576875] leading-relaxed">
              Inside the plastic housing, the 4 legs are actually <strong>2 linked pairs</strong>:
            </p>
            <ul className="text-xs text-[#576875] space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>Left Legs (Pins 1 & 2):</strong> Permanently connected together.</li>
              <li><strong>Right Legs (Pins 3 & 4):</strong> Permanently connected together.</li>
              <li>When you push the plunger, an internal spring dome snaps down, bridging the left pair to the right pair!</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2">
            <h4 className="text-sm font-bold text-[#24313A] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
              <span>Why Straddle the Center Trench?</span>
            </h4>
            <p className="text-xs text-[#576875] leading-relaxed">
              On a breadboard, all 5 holes in a row (A, B, C, D, E) touch each other. If both sides were plugged into the same column strip, the button would be short-circuited and stuck "always on"!
            </p>
            <p className="text-xs text-[#21867A] font-bold pt-1">
              ✓ Straddling across Row 10 Col E and Col F keeps the two sides electrically separate until you physically press down.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
