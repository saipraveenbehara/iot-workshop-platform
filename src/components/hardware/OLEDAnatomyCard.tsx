import React, { useState } from 'react';
import { Sparkles, HelpCircle, Layers, Grid, Cpu, ArrowRight } from 'lucide-react';

export const OLEDAnatomyCard: React.FC = () => {
  // 8x8 Interactive Pixel Grid Sandbox
  const [pixels, setPixels] = useState<boolean[]>(() => {
    // Initial pixel pattern: Smiley Face
    const grid = new Array(64).fill(false);
    const smiley = [
      10, 13,       // Eyes
      34, 45,       // Mouth corners
      42, 43, 44    // Smile curve
    ];
    smiley.forEach(idx => { grid[idx] = true; });
    return grid;
  });

  const togglePixel = (index: number) => {
    setPixels(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const clearGrid = () => setPixels(new Array(64).fill(false));

  return (
    <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
            Hardware Blueprint • Deep-Dive
          </span>
          <h3 className="text-xl font-extrabold text-white mt-0.5">
            What is an OLED, How Pixels Work & The I2C Bus
          </h3>
        </div>

        <div className="text-xs text-cyan-300 font-mono bg-cyan-950/60 border border-cyan-500/40 px-3 py-1 rounded-xl">
          SSD1306 Controller • 128×64 Pixels • 0x3C
        </div>
      </div>

      {/* 3 Core Explanation Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: What is OLED? */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">1. What is an OLED?</h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            <strong>Organic Light Emitting Diode.</strong> Unlike old LCD screens that have a blinding white backlight shining through filters, every single OLED pixel generates its own independent light. When a pixel is OFF, it emits zero light, giving true pitch black and extreme contrast.
          </p>
        </div>

        {/* Pillar 2: What is a Pixel? */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Grid className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">2. What is a Pixel?</h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            <strong>Picture Element = Pixel.</strong> This screen is a grid of <strong>128 pixels across</strong> (X: 0 to 127) and <strong>64 pixels down</strong> (Y: 0 to 63). That is 128 × 64 = <strong>8,192 microscopic light bulbs</strong> on a piece of glass smaller than a postage stamp!
          </p>
        </div>

        {/* Pillar 3: How Code Controls It */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">3. Framebuffer & I2C</h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            Your Pico only has 2 wires (SDA and SCL), not 8,192 wires. It draws in an off-screen memory sketchpad called the <strong>Framebuffer</strong>. Calling <code>oled.show()</code> blasts that memory map over I2C at 400kHz to light up the glass!
          </p>
        </div>

      </div>

      {/* Interactive Visual Section: Realistic OLED Module + Pixel Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
        
        {/* Authentic 0.96" SSD1306 Module SVG Illustration */}
        <div className="bg-[#070B14] border border-gray-800/80 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
          <svg viewBox="0 0 320 260" className="w-full max-w-[320px] select-none">
            <defs>
              <filter id="oledShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.8" />
              </filter>
              <linearGradient id="oledPcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>

            {/* Blue Fiberglass PCB Body (27mm x 27mm) */}
            <rect x="50" y="25" width="220" height="210" rx="8" fill="url(#oledPcbGrad)" stroke="#3B82F6" strokeWidth="1.5" filter="url(#oledShadow)" />

            {/* 4 Corner Mounting Holes */}
            <circle cx="65" cy="40" r="5" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="255" cy="40" r="5" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="65" cy="220" r="5" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="255" cy="220" r="5" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />

            {/* 4 Header Pins at Top with Silkscreen Labels */}
            {/* GND */}
            <circle cx="110" cy="45" r="4" fill="#E2E8F0" stroke="#000" strokeWidth="1" />
            <text x="110" y="58" textAnchor="middle" fill="#CBD5E1" fontSize="7" fontWeight="bold">GND</text>

            {/* VCC */}
            <circle cx="140" cy="45" r="4" fill="#E2E8F0" stroke="#000" strokeWidth="1" />
            <text x="140" y="58" textAnchor="middle" fill="#EF4444" fontSize="7" fontWeight="bold">VCC</text>

            {/* SCL */}
            <circle cx="170" cy="45" r="4" fill="#E2E8F0" stroke="#000" strokeWidth="1" />
            <text x="170" y="58" textAnchor="middle" fill="#FBBF24" fontSize="7" fontWeight="bold">SCL</text>

            {/* SDA */}
            <circle cx="200" cy="45" r="4" fill="#E2E8F0" stroke="#000" strokeWidth="1" />
            <text x="200" y="58" textAnchor="middle" fill="#38BDF8" fontSize="7" fontWeight="bold">SDA</text>

            {/* Glass OLED Panel in Center */}
            <rect x="70" y="75" width="180" height="120" rx="4" fill="#000000" stroke="#475569" strokeWidth="1.5" />

            {/* Ribbon Cable Connector at Bottom */}
            <rect x="120" y="195" width="80" height="20" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />

            {/* Live OLED Display Text Preview */}
            <text x="160" y="105" textAnchor="middle" fill="#22D3EE" fontSize="12" fontWeight="extrabold" fontFamily="monospace">
              NXPLORERS IoT
            </text>
            <text x="160" y="125" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
              CyberKnights
            </text>
            <text x="160" y="145" textAnchor="middle" fill="#34D399" fontSize="9" fontFamily="monospace">
              T: 27°C | Soil: 42%
            </text>
            <text x="160" y="165" textAnchor="middle" fill="#64748B" fontSize="7.5" fontFamily="monospace">
              I2C Bus: 400kHz @ 0x3C
            </text>
            <line x1="85" y1="172" x2="235" y2="172" stroke="#06B6D4" strokeWidth="1" opacity="0.6" />
          </svg>
          <span className="text-xs text-gray-400 font-mono mt-2">Physical 0.96" SSD1306 OLED Module</span>
        </div>

        {/* Interactive Pixel Sandbox: Click pixels to draw! */}
        <div className="bg-gray-900/90 border border-gray-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Grid className="w-4 h-4 text-cyan-400" />
                <span>Interactive Pixel Sandbox (Zoomed 8×8)</span>
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Click any pixel below to turn it ON (1) or OFF (0).
              </p>
            </div>
            <button
              onClick={clearGrid}
              className="text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded bg-gray-800 border border-gray-700"
            >
              Clear
            </button>
          </div>

          {/* 8x8 Grid */}
          <div className="grid grid-cols-8 gap-1.5 p-3 bg-black rounded-xl border border-cyan-900/40 w-fit mx-auto shadow-inner">
            {pixels.map((active, idx) => (
              <button
                key={idx}
                onClick={() => togglePixel(idx)}
                className={`w-7 h-7 rounded-sm border transition-all ${
                  active
                    ? 'bg-cyan-400 border-cyan-300 shadow-md shadow-cyan-400/50 scale-95'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                }`}
                title={`Pixel #${idx}: ${active ? 'ON (1)' : 'OFF (0)'}`}
              />
            ))}
          </div>

          <div className="text-xs text-gray-300 bg-gray-950 p-3 rounded-xl border border-gray-800 font-mono flex items-center justify-between">
            <span>Active Pixels: <strong className="text-cyan-300">{pixels.filter(Boolean).length} / 64</strong></span>
            <span className="text-[11px] text-gray-500">Coordinate: (X: 0..7, Y: 0..7)</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            In MicroPython, <code>oled.pixel(x, y, 1)</code> turns on a single dot. <code>oled.text('Text', x, y)</code> uses an internal 8x8 font library to illuminate rows of pixels automatically!
          </p>
        </div>

      </div>
    </div>
  );
};
