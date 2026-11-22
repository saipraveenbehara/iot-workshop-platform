import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, Radio, Compass, Sparkles } from 'lucide-react';
import { PushButton, pushButtonMeta, PartHover } from '../../hardware/index.js';

export const PushButtonAnatomyCard: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [btnColor, setBtnColor] = useState<'green' | 'red' | 'blue' | 'yellow' | 'black'>('green');

  const colors: Array<'green' | 'red' | 'blue' | 'yellow' | 'black'> = ['green', 'red', 'blue', 'yellow', 'black'];

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

        {/* Color Switcher */}
        <div className="flex items-center gap-1 bg-[#FFFDF7] border border-[#EBE6DC] p-1 rounded-xl shadow-xs self-start sm:self-auto">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setBtnColor(c)}
              className={`px-2 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                btnColor === c
                  ? 'bg-[#2A9D8F] text-white shadow-xs'
                  : 'text-[#576875] hover:text-[#24313A]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Authentic Wokwi Push Button with Interactive Click & Hover */}
        <div className="bg-[#FFFDF7] border border-[#EBE6DC] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] shadow-inner">
          <span className="text-[11px] font-mono font-bold text-[#899AA8] mb-2 uppercase tracking-wider">
            Click plunger to press • Hover pins for specs
          </span>

          <svg 
            viewBox="0 0 200 150" 
            className="w-full max-w-[240px] select-none cursor-pointer"
            style={{ overflow: 'visible' }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
          >
            {/* Authentic PushButton */}
            <PushButton
              x={30}
              y={25}
              scale={2.1}
              color={btnColor}
              pressed={isPressed}
            />

            {/* Pin Callouts */}
            <g fontFamily="sans-serif" fontSize="6" fontWeight="bold">
              <text x="24" y="55" textAnchor="end" fill="#2A9D8F">1.l (GP14)</text>
              <text x="24" y="94" textAnchor="end" fill="#899AA8">2.l (Linked)</text>
              <text x="175" y="55" textAnchor="start" fill="#F28C75">1.r (GND)</text>
              <text x="175" y="94" textAnchor="start" fill="#899AA8">2.r (Linked)</text>
            </g>

            {/* Hover Tooltip Layer */}
            <PartHover
              meta={pushButtonMeta}
              x={30}
              y={25}
              scale={2.1}
            />
          </svg>

          {/* Interactive Status Indicator */}
          <div className="mt-4 text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              isPressed 
                ? 'bg-[#FDF1EE] border border-[#F8C8BE] text-[#F28C75]' 
                : 'bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A]'
            }`}>
              <Radio className="w-3.5 h-3.5" />
              <span>{isPressed ? 'Button Down: GP14 pulled to 0V (LOW)' : 'Button Up: GP14 pulled UP to 3.3V (HIGH)'}</span>
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
              Inside the tactile casing, the 4 legs are arranged as <strong>2 permanently linked pairs</strong>:
            </p>
            <ul className="text-xs text-[#576875] space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>Left Legs (Pins 1.l & 2.l):</strong> Continuously shorted together.</li>
              <li><strong>Right Legs (Pins 1.r & 2.r):</strong> Continuously shorted together.</li>
              <li>When you press down on the plunger, the internal metallic disc snaps down, bridging the left pair to the right pair!</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2">
            <h4 className="text-sm font-bold text-[#24313A] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
              <span>Why Straddle the Central Divider Trench?</span>
            </h4>
            <p className="text-xs text-[#576875] leading-relaxed">
              On a breadboard, each column strip of 5 holes (A–E) connects together underneath. If you plugged both sides of the switch into the same strip, the switch would be short-circuited and permanently locked on!
            </p>
            <p className="text-xs text-[#21867A] font-bold pt-1">
              ✓ Straddling across the center trench keeps the input pin and ground wire isolated until you physically click the button.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
