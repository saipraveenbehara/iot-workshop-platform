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
  Compass
} from 'lucide-react';
import { PicoW, picoWMeta, PartHover } from '../../hardware/index.js';

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
    }, 1000);
  };

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 shadow-sm space-y-8 animate-fade-in">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBE6DC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F]" />
            <span className="text-xs font-bold text-[#21867A] uppercase tracking-wider font-mono">
              Hardware Visual Blueprint
            </span>
          </div>
          <h3 className="text-xl lg:text-2xl font-black text-[#24313A] mt-1">
            General Computer (Laptop) vs Dedicated Microcontroller (Pico WH)
          </h3>
        </div>

        <div className="flex rounded-xl bg-[#FFFDF7] border border-[#EBE6DC] p-1 self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'visual'
                ? 'bg-[#2A9D8F] text-white shadow-sm'
                : 'text-[#576875] hover:text-[#24313A]'
            }`}
          >
            Visual Anatomy
          </button>
          <button
            onClick={() => setActiveTab('timingTest')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'timingTest'
                ? 'bg-[#2A9D8F] text-white shadow-sm'
                : 'text-[#576875] hover:text-[#24313A]'
            }`}
          >
            Real-Time Speed Test
          </button>
        </div>
      </div>

      {activeTab === 'visual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* === LEFT CARD: THE GENERAL COMPUTER (LAPTOP) === */}
          <div className="p-6 rounded-3xl bg-[#FFFDF7] border border-[#EBE6DC] flex flex-col justify-between space-y-6 shadow-sm">
            
            {/* Top Label */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#F1F7FA] border border-[#D4EBF2] text-[#24313A] text-xs font-bold uppercase tracking-wider font-mono">
                The Heavyweight General
              </span>
              <span className="text-xs text-[#576875] font-mono">macOS / Windows / Linux</span>
            </div>

            {/* Authentic Laptop Graphic (Bright Editorial Vector) */}
            <div className="w-full flex justify-center py-2">
              <svg viewBox="0 0 320 200" className="w-full max-w-[280px] drop-shadow-sm select-none">
                <defs>
                  <linearGradient id="laptopLidBright" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>
                  <linearGradient id="laptopBaseBright" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                  </linearGradient>
                </defs>

                {/* Display Lid */}
                <rect x="40" y="20" width="240" height="135" rx="10" fill="url(#laptopLidBright)" stroke="#64748B" strokeWidth="1.2" />
                
                {/* Inner Screen Bezel */}
                <rect x="46" y="26" width="228" height="123" rx="4" fill="#0F172A" />
                
                {/* Screen Wallpaper */}
                <rect x="50" y="30" width="220" height="115" rx="2" fill="#F8FAFC" />

                {/* Window 1: Web Browser */}
                <rect x="56" y="36" width="115" height="64" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                <rect x="56" y="36" width="115" height="10" fill="#F1F5F9" />
                <circle cx="62" cy="41" r="2" fill="#EF4444" />
                <circle cx="68" cy="41" r="2" fill="#F59E0B" />
                <circle cx="74" cy="41" r="2" fill="#10B981" />
                <rect x="62" y="50" width="70" height="4" rx="1" fill="#0284C7" opacity="0.8" />
                <rect x="62" y="58" width="95" height="2" rx="1" fill="#94A3B8" />
                <rect x="62" y="64" width="85" height="2" rx="1" fill="#94A3B8" />
                <rect x="62" y="70" width="60" height="2" rx="1" fill="#94A3B8" />

                {/* Window 2: Code Editor (Thonny IDE) */}
                <rect x="135" y="55" width="128" height="68" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                <rect x="135" y="55" width="128" height="10" fill="#0F172A" />
                <circle cx="142" cy="60" r="1.8" fill="#EF4444" />
                <circle cx="148" cy="60" r="1.8" fill="#F59E0B" />
                <circle cx="154" cy="60" r="1.8" fill="#10B981" />
                <text x="144" y="75" fill="#38BDF8" fontSize="5.5" fontFamily="monospace">import time</text>
                <text x="144" y="85" fill="#F472B6" fontSize="5.5" fontFamily="monospace">while True:</text>
                <text x="154" y="95" fill="#4ADE80" fontSize="5.5" fontFamily="monospace">led.toggle()</text>

                {/* Taskbar at Bottom */}
                <rect x="80" y="134" width="160" height="9" rx="3" fill="#E2E8F0" />
                <circle cx="95" cy="138.5" r="2.5" fill="#0284C7" />
                <circle cx="110" cy="138.5" r="2.5" fill="#8B5CF6" />
                <circle cx="125" cy="138.5" r="2.5" fill="#10B981" />
                <circle cx="140" cy="138.5" r="2.5" fill="#F59E0B" />

                {/* Laptop Base & Keyboard */}
                <path d="M 20 155 L 300 155 L 315 185 L 5 185 Z" fill="url(#laptopBaseBright)" stroke="#64748B" strokeWidth="1.2" />
                
                {/* Keyboard Recess */}
                <polygon points="50,158 270,158 278,172 42,172" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
                {Array.from({ length: 4 }).map((_, row) => (
                  <line 
                    key={row}
                    x1={48 - row * 1.5} 
                    y1={160 + row * 2.8} 
                    x2={272 + row * 1.5} 
                    y2={160 + row * 2.8} 
                    stroke="#94A3B8" 
                    strokeWidth="1" 
                    strokeDasharray="4 2" 
                  />
                ))}

                {/* Trackpad */}
                <rect x="130" y="174" width="60" height="9" rx="1.5" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.6" />
              </svg>
            </div>

            {/* Specifications & Role */}
            <div className="space-y-3">
              <h4 className="text-base font-black text-[#24313A]">General Purpose Computer</h4>
              <p className="text-xs text-[#576875] leading-relaxed">
                Coordinates millions of operating system threads and background apps. Its task scheduler adds unpredictable millisecond latencies, making raw microsecond pin timing impossible.
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-white border border-[#EBE6DC]">
                  <span className="text-[#899AA8] block text-[10px]">Operating System</span>
                  <span className="text-[#24313A] font-bold">macOS / Windows / Linux</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#EBE6DC]">
                  <span className="text-[#899AA8] block text-[10px]">Power Consumption</span>
                  <span className="text-[#24313A] font-bold">30 to 100 Watts</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#EBE6DC]">
                  <span className="text-[#899AA8] block text-[10px]">Direct Voltage Pins</span>
                  <span className="text-[#F28C75] font-bold">None (Protected Ports)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#EBE6DC]">
                  <span className="text-[#899AA8] block text-[10px]">Switching Latency</span>
                  <span className="text-[#576875] font-bold">10 to 50 ms (OS Jitter)</span>
                </div>
              </div>
            </div>

          </div>

          {/* === RIGHT CARD: THE MICROCONTROLLER (PICO WH) === */}
          <div className="p-6 rounded-3xl bg-[#E6F4F2]/50 border border-[#B2DFDB] flex flex-col justify-between space-y-6 shadow-sm">
            
            {/* Top Label */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#2A9D8F] text-white text-xs font-bold uppercase tracking-wider font-mono">
                The Dedicated Maker Brain
              </span>
              <span className="text-xs text-[#21867A] font-mono font-bold">RP2040 Dual ARM @ 133MHz</span>
            </div>

            {/* Authentic Raspberry Pi Pico WH Graphic with PartHover */}
            <div className="w-full flex flex-col items-center justify-center py-2">
              <span className="text-[11px] font-mono font-bold text-[#21867A] mb-1 uppercase tracking-wider">
                Hover over pins or board for specs
              </span>
              <svg viewBox="0 0 120 220" className="w-full max-w-[200px] select-none" style={{ overflow: 'visible' }}>
                <PicoW x={20} y={10} scale={1} />
                <PartHover meta={picoWMeta} x={20} y={10} scale={1} />
              </svg>
            </div>

            {/* Specifications & Role */}
            <div className="space-y-3">
              <h4 className="text-base font-black text-[#24313A]">Raspberry Pi Pico WH Microcontroller</h4>
              <p className="text-xs text-[#576875] leading-relaxed">
                Boots instantly in 0.001 seconds. It runs code directly on silicon with zero operating system overhead, measuring and toggling electrical signals in nanoseconds.
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-white border border-[#B2DFDB]">
                  <span className="text-[#899AA8] block text-[10px]">Operating System</span>
                  <span className="text-[#21867A] font-bold">Bare-Metal Firmware</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#B2DFDB]">
                  <span className="text-[#899AA8] block text-[10px]">Power Consumption</span>
                  <span className="text-[#21867A] font-bold">0.1 Watts (Tiny Battery)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#B2DFDB]">
                  <span className="text-[#899AA8] block text-[10px]">Direct Voltage Pins</span>
                  <span className="text-[#21867A] font-bold">26 GPIOs (0V / 3.3V)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#B2DFDB]">
                  <span className="text-[#899AA8] block text-[10px]">Switching Latency</span>
                  <span className="text-[#21867A] font-bold">7.5 Nanoseconds</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* === REAL-TIME SPEED TEST TAB === */
        <div className="bg-[#FFFDF7] border border-[#EBE6DC] rounded-2xl p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-extrabold text-[#24313A] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F4C95D]" />
                <span>Signal Switching Speed Experiment</span>
              </h4>
              <p className="text-xs text-[#576875] mt-0.5">
                Compare how quickly code can switch an electrical pin from an operating system vs dedicated microcontroller silicon.
              </p>
            </div>

            <button
              disabled={testState === 'testing'}
              onClick={runLatencyTest}
              className="px-5 py-2.5 rounded-xl bg-[#2A9D8F] hover:bg-[#21867A] disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <Activity className="w-4 h-4" />
              <span>{testState === 'testing' ? 'Measuring Clock Cycles...' : 'Measure Pulse Speed'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Laptop Pulse */}
            <div className="p-5 rounded-2xl bg-white border border-[#EBE6DC] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#24313A]">Laptop via USB Adapter</span>
                <span className="text-xs font-mono font-bold text-[#F28C75]">
                  {simulatedResults ? `${simulatedResults.laptopLatencyMs} ms` : 'Waiting...'}
                </span>
              </div>
              <div className="w-full bg-[#FFFDF7] h-3 rounded-full overflow-hidden p-0.5 border border-[#EBE6DC]">
                <div 
                  className="bg-[#F28C75] h-full rounded-full transition-all duration-700"
                  style={{ width: testState === 'done' ? '100%' : testState === 'testing' ? '60%' : '0%' }}
                />
              </div>
              <p className="text-[11px] text-[#576875] leading-relaxed">
                Operating system thread scheduling and USB packet buffers delay the pin toggle by milliseconds.
              </p>
            </div>

            {/* Pico Pulse */}
            <div className="p-5 rounded-2xl bg-[#E6F4F2] border border-[#B2DFDB] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#21867A]">Pico WH Direct Silicon Pin</span>
                <span className="text-xs font-mono text-[#21867A] font-black">
                  {simulatedResults ? `${simulatedResults.picoLatencyNs} nanoseconds` : 'Waiting...'}
                </span>
              </div>
              <div className="w-full bg-white h-3 rounded-full overflow-hidden p-0.5 border border-[#B2DFDB]">
                <div 
                  className="bg-[#2A9D8F] h-full rounded-full transition-all duration-300"
                  style={{ width: testState === 'done' || testState === 'testing' ? '100%' : '0%' }}
                />
              </div>
              <p className="text-[11px] text-[#21867A] leading-relaxed font-medium">
                Toggles directly on the 133MHz processor clock cycle with zero waiting.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Summary Takeaway Bar */}
      <div className="p-4 rounded-2xl bg-[#FEF9EC] border border-[#FCEFCB] flex items-start gap-3 text-xs text-[#24313A]">
        <Sparkles className="w-4 h-4 text-[#DBAF40] shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          <strong>The Maker Partnership:</strong> You use your computer's screen and keyboard to write and read code comfortably in Thonny. Then you upload that code to the Raspberry Pi Pico WH, which brings the physical circuits on your breadboard to life!
        </p>
      </div>

    </div>
  );
};
