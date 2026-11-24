import React, { useState } from 'react';
import { Sparkles, Grid, Layers, Compass } from 'lucide-react';
import { CircuitPanZoom } from '../circuit/CircuitPanZoom.js';
import { Oled, oledMeta, PartHover } from '../../hardware/index.js';

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

      {/* ONE-PAGER: WHAT IS A C LIBRARY? (Pre-OLED Foundation) */}
      <div className="p-6 rounded-2xl bg-[#FFFDF7] border-2 border-[#2A9D8F]/30 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E6F4F2] border border-[#B2DFDB] flex items-center justify-center text-[#2A9D8F]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#21867A]">Essential Concept</span>
            <h4 className="text-base font-black text-[#24313A]">
              Before We Draw on Glass: What is a C Library?
            </h4>
          </div>
        </div>

        <p className="text-xs text-[#576875] leading-relaxed">
          In C and Arduino programming, a <strong>Library</strong> is a collection of pre-written, tested code created by specialist engineers. Instead of writing 1,000 lines of complex timing loops to send raw binary pulses over silicon wires, you import a library and call simple commands like <code>display.println("Hello!")</code>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white border border-[#EBE6DC] space-y-1">
            <span className="text-[11px] font-mono font-bold text-[#2A9D8F]">1. &lt;Wire.h&gt;</span>
            <p className="text-[11px] text-[#576875]">The hardware I2C bus translator. Manages the Clock (SCL) and Data (SDA) physical lines at 400 kHz.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#EBE6DC] space-y-1">
            <span className="text-[11px] font-mono font-bold text-[#2A9D8F]">2. &lt;Adafruit_GFX.h&gt;</span>
            <p className="text-[11px] text-[#576875]">The master artist. Knows how to draw pixel coordinates, lines, rectangles, circles, and font typography.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-[#EBE6DC] space-y-1">
            <span className="text-[11px] font-mono font-bold text-[#2A9D8F]">3. &lt;Adafruit_SSD1306.h&gt;</span>
            <p className="text-[11px] text-[#576875]">The screen driver. Speaks the exact electrical dialect of the 0.96" 128×64 glass panel chip.</p>
          </div>
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
            Instead of running 8,192 individual wires, the ESP32 draws in a 1,024-byte RAM sketchpad called the <strong>Framebuffer</strong>. Calling <code>display.display()</code> blasts that entire memory map over just 2 wires (SDA on GPIO 21 and SCL on GPIO 22) to illuminate the screen!
          </p>
        </div>

      </div>

      {/* Interactive Visual Section: Authentic OLED Module + Pixel Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
        
        {/* Authentic SSD1306 Module with Pan & Zoom & Live Display */}
        <div className="flex flex-col space-y-2">
          <CircuitPanZoom
            heightClass="min-h-[300px] h-[300px]"
            initialScale={1.0}
            overlayChildren={
              <div className="absolute top-3 left-3 z-20 pointer-events-none">
                <span className="text-[10px] font-mono font-bold text-[#899AA8] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-[#EBE6DC] uppercase tracking-wider">
                  Hover pins (GND, VCC, SCL, SDA) for specs
                </span>
              </div>
            }
          >
            <svg viewBox="0 0 200 160" className="w-[220px] h-[170px] select-none" style={{ overflow: 'visible' }}>
              <Oled x={25} y={15} scale={1.4}>
                <text x="64" y="14" fill="#38BDF8" fontFamily="sans-serif" fontSize="8" textAnchor="middle">ThingSpeak readings</text>
                <text x="64" y="32" fill="#FFFFFF" fontFamily="monospace" fontSize="13" fontWeight="bold" textAnchor="middle">Temp: 30.8 C</text>
                <text x="64" y="48" fill="#4ADE80" fontFamily="monospace" fontSize="13" fontWeight="bold" textAnchor="middle">Humi: 72.0%</text>
                <text x="64" y="60" fill="#94A3B8" fontFamily="monospace" fontSize="6.5" textAnchor="middle">I2C: 0x3C ONLINE</text>
              </Oled>

              <PartHover
                meta={oledMeta}
                x={25}
                y={15}
                scale={1.4}
              />
            </svg>
          </CircuitPanZoom>
          <span className="text-xs text-[#576875] font-mono text-center font-bold">Physical 0.96" SSD1306 I2C OLED Breakout</span>
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
                className={`w-7 h-7 rounded-sm border transition-all cursor-pointer ${
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
            In C with Adafruit GFX, <code>display.drawPixel(x, y, SSD1306_WHITE)</code> lights an individual dot. <code>display.println("Hi")</code> maps characters using an internal font matrix onto your glass display!
          </p>
        </div>

      </div>
    </div>
  );
};
