import React, { useState } from 'react';
import { Zap, ShieldCheck, CheckCircle2, AlertTriangle, Compass, Sparkles } from 'lucide-react';
import { CircuitPanZoom } from '../circuit/CircuitPanZoom.js';
import { Led, ledMeta, Resistor, resistorMeta, PartHover } from '../../hardware/index.js';

export const LEDAnatomyCard: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<'green' | 'red' | 'orange' | 'yellow' | 'blue' | 'white'>('green');
  const [isForwardBias, setIsForwardBias] = useState(true);

  const colors: Array<'green' | 'red' | 'orange' | 'yellow' | 'blue' | 'white'> = [
    'green', 'red', 'orange', 'yellow', 'blue', 'white'
  ];

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

        {/* Controls: Color Selector & Bias Switcher */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* LED Color Picker */}
          <div className="flex items-center gap-1 bg-[#FFFDF7] border border-[#EBE6DC] p-1 rounded-xl shadow-xs">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`px-2 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  selectedColor === c
                    ? 'bg-[#2A9D8F] text-white shadow-xs'
                    : 'text-[#576875] hover:text-[#24313A]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Interactive Bias Switcher */}
          <div className="flex items-center gap-1 bg-[#FFFDF7] border border-[#EBE6DC] p-1 rounded-xl shadow-xs">
            <button
              onClick={() => setIsForwardBias(true)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isForwardBias ? 'bg-[#2A9D8F] text-white shadow-xs' : 'text-[#576875] hover:text-[#24313A]'
              }`}
            >
              Forward (On)
            </button>
            <button
              onClick={() => setIsForwardBias(false)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                !isForwardBias ? 'bg-[#F28C75] text-white shadow-xs' : 'text-[#576875] hover:text-[#24313A]'
              }`}
            >
              Reverse (Off)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Authentic Wokwi LED with Pan & Zoom Inspector */}
        <div className="flex flex-col space-y-3">
          <CircuitPanZoom
            heightClass="min-h-[300px] h-[300px]"
            initialScale={1.0}
            overlayChildren={
              <div className="absolute top-3 left-3 z-20 pointer-events-none">
                <span className="text-[10px] font-mono font-bold text-[#899AA8] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-[#EBE6DC] uppercase tracking-wider">
                  Hover pins or body for specs
                </span>
              </div>
            }
          >
            <svg viewBox="0 0 160 160" className="w-[180px] h-[180px] select-none" style={{ overflow: 'visible' }}>
              {/* Authentic Scaled LED Component */}
              <Led
                x={40}
                y={25}
                scale={2.8}
                color={selectedColor}
                lit={isForwardBias}
                brightness={1.2}
              />

              {/* Pin callout text lines */}
              <g fontFamily="sans-serif" fontSize="6.5" fontWeight="bold">
                {/* Cathode Label */}
                <text x="67" y="135" textAnchor="middle" fill="#F28C75">
                  CATHODE (-)
                </text>
                <text x="67" y="144" textAnchor="middle" fill="#899AA8" fontSize="5.5">
                  Shorter Leg • GND
                </text>

                {/* Anode Label */}
                <text x="94" y="135" textAnchor="middle" fill="#2A9D8F">
                  ANODE (+)
                </text>
                <text x="94" y="144" textAnchor="middle" fill="#899AA8" fontSize="5.5">
                  Longer Leg • 3.3V
                </text>
              </g>

              {/* Interactive Part Hover Layer */}
              <PartHover
                meta={ledMeta}
                x={40}
                y={25}
                scale={2.8}
                showLabels={false}
              />
            </svg>
          </CircuitPanZoom>

          {/* Real-time Status Badge */}
          <div className="flex justify-center">
            {isForwardBias ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A] text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2A9D8F]" />
                <span>Forward Biased: Current Flows ({selectedColor.toUpperCase()} LED Illuminated)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF1EE] border border-[#F8C8BE] text-[#F28C75] text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F28C75]" />
                <span>Reverse Biased: Current Blocked (LED Dark)</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Resistor & Polarity Guide */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2.5">
            <h4 className="text-sm font-bold text-[#24313A] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#2A9D8F]" />
              <span>Two Dependable Ways to Identify LED Polarity</span>
            </h4>
            <ul className="text-xs text-[#576875] space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#21867A] font-bold">1. Lead Length (Untrimmed):</span>
                <span>The <strong>longer metal lead</strong> is the Anode (+), which connects to the 3.3V GPIO signal. The shorter lead is the Cathode (-).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F28C75] font-bold">2. Flat Edge on Casing Rim:</span>
                <span>The plastic rim at the base of the LED has a distinct <strong>flat edge</strong> on the Cathode (-) side, which connects to Ground. This remains reliable even after leads are trimmed!</span>
              </li>
            </ul>
          </div>

          {/* 220Ω Resistor Color Bands Explained */}
          <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-3">
            <h4 className="text-sm font-bold text-[#24313A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2A9D8F]" />
              <span>Authentic 220Ω Resistor (Hoverable)</span>
            </h4>
            
            {/* Visual Resistor Graphic with PartHover */}
            <div className="flex items-center justify-center py-2 bg-white rounded-xl border border-[#EBE6DC]">
              <svg viewBox="0 0 180 50" className="w-full max-w-[220px]" style={{ overflow: 'visible' }}>
                <Resistor x={30} y={15} scale={2} ohms={220} />
                <PartHover meta={resistorMeta} x={30} y={15} scale={2} />
              </svg>
            </div>

            <p className="text-[11px] text-[#576875] text-center font-mono">
              Band Colors: Red (2) • Red (2) • Brown (×10) • Gold (±5%) = <strong className="text-[#24313A]">220 Ohms (Ω)</strong>
            </p>
            <p className="text-xs text-[#576875] leading-relaxed">
              Resistors have <strong>no polarity</strong>: you can connect them in either direction. They restrict high electrical current to a safe 15 milliamps to protect your LED and microcontroller pin.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
