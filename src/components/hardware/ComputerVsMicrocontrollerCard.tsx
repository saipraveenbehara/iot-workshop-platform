import React, { useState } from 'react';
import { 
  Laptop, 
  Cpu, 
  Zap, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Activity,
  AlertTriangle
} from 'lucide-react';

export const ComputerVsMicrocontrollerCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'timingTest'>('visual');
  const [testState, setTestState] = useState<'idle' | 'testing' | 'done'>('idle');
  const [simulatedResults, setSimulatedResults] = useState<{
    laptopLatencyMs: number;
    picoLatencyNs: number;
  } | null>(null);

  const runLatencyTest = () => {
    setTestState('testing');
    setTimeout(() => {
      setSimulatedResults({
        laptopLatencyMs: 38.4,
        picoLatencyNs: 7.5,
      });
      setTestState('done');
    }, 1200);
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-8 animate-fade-in">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              Hardware Visual Blueprint
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">
            General Computer (Laptop) vs Dedicated Microcontroller (Pico WH)
          </h3>
        </div>

        <div className="flex rounded-xl bg-gray-900 border border-gray-800 p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'visual'
                ? 'bg-cyan-500 text-gray-950 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Visual Anatomy
          </button>
          <button
            onClick={() => setActiveTab('timingTest')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'timingTest'
                ? 'bg-cyan-500 text-gray-950 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Real-Time Speed Test
          </button>
        </div>
      </div>

      {activeTab === 'visual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* === LEFT CARD: THE GENERAL COMPUTER (LAPTOP) === */}
          <div className="p-6 rounded-3xl bg-[#070B14] border border-gray-800 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group">
            
            {/* Top Label */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-extrabold uppercase tracking-wider font-mono">
                The Heavyweight General
              </span>
              <span className="text-xs text-gray-400 font-mono">Intel / AMD / Apple Silicon</span>
            </div>

            {/* Authentic Laptop Graphic (SVG Picture) */}
            <div className="w-full flex justify-center py-2">
              <svg viewBox="0 0 320 200" className="w-full max-w-[280px] drop-shadow-2xl select-none">
                <defs>
                  <linearGradient id="laptopLid" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1E293B" />
                  </linearGradient>
                  <linearGradient id="screenGloss" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0369A1" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="laptopBase" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1E293B" />
                  </linearGradient>
                </defs>

                {/* Display Lid */}
                <rect x="40" y="20" width="240" height="135" rx="10" fill="url(#laptopLid)" stroke="#64748B" strokeWidth="1.5" />
                
                {/* Inner Bezel Screen */}
                <rect x="48" y="28" width="224" height="119" rx="4" fill="#090D16" />
                
                {/* Simulated Multitasking OS Screen Content */}
                <rect x="52" y="32" width="216" height="111" rx="2" fill="url(#screenGloss)" opacity="0.3" />

                {/* Window 1: Web Browser with multiple tabs */}
                <rect x="56" y="36" width="110" height="60" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="0.8" />
                <rect x="56" y="36" width="110" height="8" fill="#1E293B" />
                <circle cx="62" cy="40" r="1.5" fill="#EF4444" />
                <circle cx="67" cy="40" r="1.5" fill="#F59E0B" />
                <circle cx="72" cy="40" r="1.5" fill="#10B981" />
                <rect x="60" y="48" width="80" height="3" rx="1" fill="#38BDF8" opacity="0.7" />
                <rect x="60" y="55" width="60" height="2" rx="1" fill="#94A3B8" opacity="0.5" />
                <rect x="60" y="61" width="95" height="2" rx="1" fill="#94A3B8" opacity="0.5" />
                <rect x="60" y="67" width="40" height="2" rx="1" fill="#94A3B8" opacity="0.5" />

                {/* Window 2: IDE / Code Editor */}
                <rect x="130" y="52" width="130" height="65" rx="3" fill="#020617" stroke="#818CF8" strokeWidth="0.8" />
                <rect x="130" y="52" width="130" height="8" fill="#0F172A" />
                <circle cx="136" cy="56" r="1.5" fill="#EF4444" />
                <circle cx="141" cy="56" r="1.5" fill="#F59E0B" />
                <circle cx="146" cy="56" r="1.5" fill="#10B981" />
                <text x="138" y="70" fill="#38BDF8" fontSize="5" fontFamily="monospace">import time</text>
                <text x="138" y="78" fill="#A855F7" fontSize="5" fontFamily="monospace">while True:</text>
                <text x="146" y="86" fill="#4ADE80" fontSize="5" fontFamily="monospace">compute()</text>

                {/* Desktop Dock / Taskbar at Bottom */}
                <rect x="80" y="132" width="160" height="10" rx="3" fill="#000" opacity="0.7" />
                <circle cx="95" cy="137" r="3" fill="#38BDF8" />
                <circle cx="110" cy="137" r="3" fill="#818CF8" />
                <circle cx="125" cy="137" r="3" fill="#10B981" />
                <circle cx="140" cy="137" r="3" fill="#F59E0B" />
                <circle cx="155" cy="137" r="3" fill="#EC4899" />

                {/* Laptop Hinge & Base Body */}
                <path d="M 20 155 L 300 155 L 315 185 L 5 185 Z" fill="url(#laptopBase)" stroke="#64748B" strokeWidth="1.2" />
                
                {/* Keyboard Recess */}
                <polygon points="50,158 270,158 278,172 42,172" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
                
                {/* Simulated Key Grid */}
                {Array.from({ length: 4 }).map((_, row) => (
                  <line 
                    key={row}
                    x1={48 - row * 1.5} 
                    y1={160 + row * 2.8} 
                    x2={272 + row * 1.5} 
                    y2={160 + row * 2.8} 
                    stroke="#334155" 
                    strokeWidth="1" 
                    strokeDasharray="4 2" 
                  />
                ))}

                {/* Trackpad */}
                <rect x="130" y="174" width="60" height="9" rx="1.5" fill="#334155" stroke="#475569" strokeWidth="0.6" />
                
                {/* USB Port Indicator */}
                <rect x="10" y="170" width="8" height="4" rx="0.5" fill="#94A3B8" />
              </svg>
            </div>

            {/* Specifications & Role */}
            <div className="space-y-3">
              <h4 className="text-lg font-black text-white">General Purpose Computer</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Designed to run billions of tasks at once—browsers, Spotify, 3D graphics, and background updates. Its operating system kernel switches between tasks hundreds of times a second.
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800">
                  <span className="text-gray-400 block text-[10px]">Operating System</span>
                  <span className="text-blue-400 font-bold">macOS / Windows / Linux</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800">
                  <span className="text-gray-400 block text-[10px]">Power Consumption</span>
                  <span className="text-amber-400 font-bold">30 to 100 Watts</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800">
                  <span className="text-gray-400 block text-[10px]">Raw Voltage Pins</span>
                  <span className="text-rose-400 font-bold">None (Protected Ports)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800">
                  <span className="text-gray-400 block text-[10px]">Switching Latency</span>
                  <span className="text-amber-400 font-bold">10 to 50 ms (OS Jitter)</span>
                </div>
              </div>
            </div>

          </div>

          {/* === RIGHT CARD: THE MICROCONTROLLER (PICO WH) === */}
          <div className="p-6 rounded-3xl bg-emerald-950/20 border-2 border-emerald-500/40 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group shadow-emerald-500/10">
            
            {/* Top Label */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider font-mono">
                The Silicon Reflex Muscle
              </span>
              <span className="text-xs text-emerald-300 font-mono">RP2040 Dual ARM @ 133MHz</span>
            </div>

            {/* Authentic Raspberry Pi Pico WH Graphic (Exact Wokwi-style SVG Picture) */}
            <div className="w-full flex justify-center py-2">
              <svg viewBox="0 0 320 200" className="w-full max-w-[280px] drop-shadow-2xl select-none">
                <defs>
                  <linearGradient id="picoGreenPcb" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#047857" />
                    <stop offset="100%" stopColor="#065F46" />
                  </linearGradient>
                  <linearGradient id="silverCan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>
                  <filter id="picoGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Main Green PCB Board */}
                <rect x="70" y="15" width="180" height="170" rx="10" fill="url(#picoGreenPcb)" stroke="#10B981" strokeWidth="2" />
                
                {/* 4 Corner Mounting Holes with Copper Rim */}
                <circle cx="82" cy="27" r="4.5" fill="#047857" stroke="#D4AF37" strokeWidth="1.5" />
                <circle cx="238" cy="27" r="4.5" fill="#047857" stroke="#D4AF37" strokeWidth="1.5" />
                <circle cx="82" cy="173" r="4.5" fill="#047857" stroke="#D4AF37" strokeWidth="1.5" />
                <circle cx="238" cy="173" r="4.5" fill="#047857" stroke="#D4AF37" strokeWidth="1.5" />

                {/* Micro-USB Port Metal Housing */}
                <rect x="135" y="7" width="50" height="24" rx="3" fill="url(#silverCan)" stroke="#475569" strokeWidth="1.2" />
                <rect x="145" y="10" width="30" height="6" rx="1" fill="#0F172A" />

                {/* CYW43439 Wireless Metal Shield (Wi-Fi + BLE) */}
                <rect x="120" y="42" width="80" height="52" rx="4" fill="url(#silverCan)" stroke="#64748B" strokeWidth="1" />
                <text x="160" y="65" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="900" fontFamily="sans-serif">CYW43439</text>
                <text x="160" y="76" textAnchor="middle" fill="#334155" fontSize="6.5" fontWeight="bold">2.4GHz Wi-Fi</text>
                {/* Raspberry Pi Logo Leaf */}
                <circle cx="160" cy="84" r="2.5" fill="#BE123C" />

                {/* RP2040 Dual-Core Silicon Chip */}
                <rect x="135" y="112" width="50" height="50" rx="4" fill="#090D16" stroke="#334155" strokeWidth="1.5" />
                {/* Pin 1 Index Dot */}
                <circle cx="142" cy="119" r="1.5" fill="#64748B" />
                <text x="160" y="136" textAnchor="middle" fill="#E2E8F0" fontSize="8" fontWeight="bold" fontFamily="monospace">RP2040</text>
                <text x="160" y="146" textAnchor="middle" fill="#38BDF8" fontSize="6" fontFamily="monospace">133 MHz</text>

                {/* BOOTSEL Tactile Pushbutton */}
                <rect x="195" y="104" width="12" height="16" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.8" />
                <circle cx="201" cy="112" r="3" fill="#F8FAFC" />
                <text x="201" y="99" textAnchor="middle" fill="#A7F3D0" fontSize="5" fontWeight="bold">BOOTSEL</text>

                {/* Onboard LED (Pulsing Green) */}
                <circle cx="112" cy="34" r="4" fill="#10B981" filter="url(#picoGlow)" />
                <text x="112" y="46" textAnchor="middle" fill="#A7F3D0" fontSize="5" fontWeight="bold">LED</text>

                {/* Left Castellated Pin Headers (GP0 to GP15) */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <g key={`pin-l-${i}`}>
                    <rect x="66" y="38 + i * 9" width="10" height="6" rx="1.5" fill="#D4AF37" stroke="#92400E" strokeWidth="0.5" />
                    <circle cx="71" cy="41 + i * 9" r="2" fill="#065F46" />
                  </g>
                ))}

                {/* Right Castellated Pin Headers (Pin 21 to Pin 40) */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <g key={`pin-r-${i}`}>
                    <rect x="244" y="38 + i * 9" width="10" height="6" rx="1.5" fill="#D4AF37" stroke="#92400E" strokeWidth="0.5" />
                    <circle cx="249" cy="41 + i * 9" r="2" fill="#065F46" />
                  </g>
                ))}
              </svg>
            </div>

            {/* Specifications & Role */}
            <div className="space-y-3">
              <h4 className="text-lg font-black text-white">Raspberry Pi Pico WH Microcontroller</h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Boots instantly in 0.001 seconds. It runs your code directly on the silicon with zero operating system layers, toggling electrical pins in mere nanoseconds.
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-gray-900/80 border border-emerald-500/30">
                  <span className="text-gray-400 block text-[10px]">Operating System</span>
                  <span className="text-emerald-400 font-bold">None (Bare-Metal MicroPython)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-900/80 border border-emerald-500/30">
                  <span className="text-gray-400 block text-[10px]">Power Consumption</span>
                  <span className="text-emerald-300 font-bold">0.1 Watts (Tiny Battery)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-900/80 border border-emerald-500/30">
                  <span className="text-gray-400 block text-[10px]">Raw Voltage Pins</span>
                  <span className="text-emerald-400 font-bold">26 Direct GPIOs (0V / 3.3V)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-900/80 border border-emerald-500/30">
                  <span className="text-gray-400 block text-[10px]">Switching Latency</span>
                  <span className="text-emerald-300 font-bold">7.5 Nanoseconds (Instant)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* === REAL-TIME SPEED TEST TAB === */
        <div className="bg-[#070B14] border border-gray-800 rounded-2xl p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Simulated Physical Pin Toggle Race</span>
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Compare how fast code can toggle a voltage pin from a high-level OS vs bare-metal microcontroller silicon.
              </p>
            </div>

            <button
              disabled={testState === 'testing'}
              onClick={runLatencyTest}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <Activity className="w-4 h-4" />
              <span>{testState === 'testing' ? 'Measuring Clock Signals...' : 'Fire Toggle Pulse'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Laptop Pulse */}
            <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-200">Laptop via USB Adapter</span>
                <span className="text-xs font-mono text-amber-400">
                  {simulatedResults ? `${simulatedResults.laptopLatencyMs} ms` : 'Waiting...'}
                </span>
              </div>
              <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden p-0.5 border border-gray-800">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: testState === 'done' ? '100%' : testState === 'testing' ? '60%' : '0%' }}
                />
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Kernel driver overhead + USB bus packet scheduling delays the pin flip by tens of milliseconds.
              </p>
            </div>

            {/* Pico Pulse */}
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-200">Pico WH RP2040 Direct Pin</span>
                <span className="text-xs font-mono text-emerald-300 font-black">
                  {simulatedResults ? `${simulatedResults.picoLatencyNs} nanoseconds` : 'Waiting...'}
                </span>
              </div>
              <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden p-0.5 border border-emerald-500/30">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300 shadow-md shadow-emerald-400/50"
                  style={{ width: testState === 'done' || testState === 'testing' ? '100%' : '0%' }}
                />
              </div>
              <p className="text-[11px] text-emerald-300/80 leading-relaxed font-medium">
                Toggles directly on the 133MHz clock cycle. 5,000,000 times faster than OS-gated pins!
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Summary Takeaway Bar */}
      <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 flex items-start gap-3 text-xs text-gray-300">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Why We Need Both:</strong> We use your laptop to write readable MicroPython code in Thonny. Then we flash that code into the Raspberry Pi Pico WH, which handles the split-second voltage sensing and physical breadboard circuits!
        </p>
      </div>

    </div>
  );
};