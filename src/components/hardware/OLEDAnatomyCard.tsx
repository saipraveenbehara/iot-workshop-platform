import React, { useState } from 'react';
import { Sparkles, Grid, Layers, Compass } from 'lucide-react';

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
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE6DC]">
        <div>
          <span className="text-xs font-bold text-[#21867A] uppercase tracking-wider font-mono">
            Component Guide • Visual Anatomy
          </span>
          <h3 className="text-xl lg:text-2xl font-black text-[#24313A] mt-0.5">
            What is an OLED, How Pixels Work & The I2C Bus
          </h3>
        </div>

        <div className="text-xs text-[#21867A] font-mono bg-[#E6F4F2] border border-[#B2DFDB] px-3.5 py-1.5 rounded-xl font-bold self-start sm:self-auto">
          SSD1306 • 128×64 Pixels • Address 0x3C
        </div>
      </div>

      {/* 3 Core Explanation Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: What is OLED? */}
        <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E6F4F2] border border-[#B2DFDB] flex items-center justify-center text-[#2A9D8F]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#24313A]">1. What is an OLED?</h4>
          <p className="text-xs text-[#576875] leading-relaxed">
            <strong>Organic Light Emitting Diode.</strong> Unlike old LCD screens that require a bright white backlight shining through plastic, every single OLED pixel produces its own individual light. Turned-off pixels emit zero light, giving true pitch-black contrast.
          </p>
        </div>

        {/* Pillar 2: What is a Pixel? */}
        <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F1F7FA] border border-[#D4EBF2] flex items-center justify-center text-[#2A9D8F]">
            <Grid className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#24313A]">2. What is a Pixel?</h4>
          <p className="text-xs text-[#576875] leading-relaxed">
            <strong>Picture Element = Pixel.</strong> This screen is an exact coordinate grid: <strong>128 pixels across</strong> (X: 0 to 127) by <strong>64 pixels down</strong> (Y: 0 to 63). That is 128 × 64 = <strong>8,192 microscopic light points</strong> on a display smaller than a postage stamp!
          </p>
        </div>

        {/* Pillar 3: How Code Controls It */}
        <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FEF9EC] border border-[#FCEFCB] flex items-center justify-center text-[#DBAF40]">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#24313A]">3. Framebuffer & I2C</h4>
          <p className="text-xs text-[#576875] leading-relaxed">
            Instead of running 8,192 individual wires, the Pico draws in a 1,024-byte RAM sketchpad called the <strong>Framebuffer</strong>. Calling <code>oled.show()</code> blasts that entire memory map over just 2 wires (SDA and SCL) to illuminate the screen!
          </p>
        </div>

      </div>

      {/* Interactive Visual Section: Realistic OLED Module + Pixel Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
        
        {/* Authentic 0.96" SSD1306 Module SVG Illustration */}
        <div className="bg-[#FFFDF7] border border-[#EBE6DC] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] shadow-inner">
          <svg viewBox="0 0 320 260" className="w-full max-w-[300px] select-none">
            <defs>
              <linearGradient id="oledPcbGradBright" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>

            {/* Blue Fiberglass PCB Body (27mm x 27mm) */}
            <rect x="50" y="25" width="220" height="210" rx="8" fill="url(#oledPcbGradBright)" stroke="#3B82F6" strokeWidth="1.5" />

            {/* 4 Corner Mounting Holes with Brass Bushings */}
            <circle cx="65" cy="40" r="5" fill="#0F172A" stroke="#D4AF37" strokeWidth="1.2" />
            <circle cx="255" cy="40" r="5" fill="#0F172A" stroke="#D4AF37" strokeWidth="1.2" />
            <circle cx="65" cy="220" r="5" fill="#0F172A" stroke="#D4AF37" strokeWidth="1.2" />
            <circle cx="255" cy="220" r="5" fill="#0F172A" stroke="#D4AF37" strokeWidth="1.2" />

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
            <text x="160" y="165" textAnchor="middle" fill="#94A3B8" fontSize="7.5" fontFamily="monospace">
              I2C Bus: 400kHz @ 0x3C
            </text>
            <line x1="85" y1="172" x2="235" y2="172" stroke="#06B6D4" strokeWidth="1" opacity="0.6" />
          </svg>
          <span className="text-xs text-[#576875] font-mono mt-2 font-bold">Physical 0.96" SSD1306 OLED Breakout</span>
        </div>

        {/* Interactive Pixel Sandbox: Click pixels to draw! */}
        <div className="bg-[#FFFDF7] border border-[#EBE6DC] p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#24313A] flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#2A9D8F]" />
                <span>Interactive Pixel Sandbox (8×8 Grid)</span>
              </h4>
              <p className="text-[11px] text-[#576875] mt-0.5">
                Click any pixel to toggle it ON (1) or OFF (0).
              </p>
            </div>
            <button
              onClick={clearGrid}
              className="text-xs text-[#576875] hover:text-[#24313A] px-3 py-1 rounded-lg bg-white border border-[#EBE6DC] font-bold"
            >
              Clear
            </button>
          </div>

          {/* 8x8 Grid */}
          <div className="grid grid-cols-8 gap-1.5 p-3.5 bg-[#24313A] rounded-2xl w-fit mx-auto shadow-sm">
            {pixels.map((active, idx) => (
              <button
                key={idx}
                onClick={() => togglePixel(idx)}
                className={`w-7 h-7 rounded-sm border transition-all ${
                  active
                    ? 'bg-[#2A9D8F] border-[#21867A] shadow-sm scale-95'
                    : 'bg-[#1E293B] border-[#334155] hover:border-gray-500'
                }`}
                title={`Pixel #${idx}: ${active ? 'ON (1)' : 'OFF (0)'}`}
              />
            ))}
          </div>

          <div className="text-xs text-[#24313A] bg-white p-3 rounded-xl border border-[#EBE6DC] font-mono flex items-center justify-between">
            <span>Lit Pixels: <strong className="text-[#21867A]">{pixels.filter(Boolean).length} / 64</strong></span>
            <span className="text-[11px] text-[#899AA8]">Coordinates: (0..7, 0..7)</span>
          </div>
          <p className="text-xs text-[#576875] leading-relaxed">
            In MicroPython, <code>oled.pixel(x, y, 1)</code> lights an individual dot. <code>oled.text('Hi', x, y)</code> maps letters using an internal 8×8 font matrix onto your glass display!
          </p>
        </div>

      </div>
    </div>
  );
};
