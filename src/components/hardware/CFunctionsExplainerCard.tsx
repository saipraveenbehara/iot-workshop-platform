import React, { useState } from 'react';
import { 
  Sparkles, 
  Code2, 
  Layers, 
  Cpu, 
  Play, 
  CheckCircle2, 
  RotateCcw,
  Zap
} from 'lucide-react';

export const CFunctionsExplainerCard: React.FC = () => {
  const [activeFuncDemo, setActiveFuncDemo] = useState<'status' | 'data' | 'error'>('status');

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE6DC]">
        <div>
          <span className="text-xs font-bold text-[#21867A] uppercase tracking-wider font-mono">
            Core Programming Concept • One-Pager
          </span>
          <h3 className="text-xl lg:text-2xl font-black text-[#24313A] mt-0.5">
            What is a C Function? The Reusable Recipe
          </h3>
        </div>

        <div className="text-xs text-[#21867A] font-mono bg-[#E6F4F2] border border-[#B2DFDB] px-3.5 py-1.5 rounded-xl font-bold self-start sm:self-auto">
          C / C++ Architecture • Modularity
        </div>
      </div>

      {/* 3 Core Conceptual Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: Anatomy of a Function */}
        <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#E6F4F2] border border-[#B2DFDB] flex items-center justify-center text-[#2A9D8F]">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#24313A]">1. Anatomy of a Function</h4>
          <p className="text-xs text-[#576875] leading-relaxed">
            A function is a named recipe with 4 parts:
          </p>
          <ul className="text-xs text-[#24313A] space-y-1 font-mono pt-1">
            <li>• <strong className="text-[#2A9D8F]">Return Type:</strong> <code>void</code> (does work, returns nothing)</li>
            <li>• <strong className="text-[#2A9D8F]">Name:</strong> <code>showMessage()</code></li>
            <li>• <strong className="text-[#2A9D8F]">Parameters:</strong> <code>(line1, line2)</code></li>
            <li>• <strong className="text-[#2A9D8F]">Body:</strong> <code>&#123; ... &#125;</code></li>
          </ul>
        </div>

        {/* Pillar 2: The Microwave Preset Analogy */}
        <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#FEF9EC] border border-[#FCEFCB] flex items-center justify-center text-[#DBAF40]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#24313A]">2. The "Popcorn" Button</h4>
          <p className="text-xs text-[#576875] leading-relaxed">
            When you press "Popcorn" on a microwave, you don't calculate motor speeds or magnetron frequencies manually. That complex recipe was saved into one button! Functions do the exact same thing for your C code.
          </p>
        </div>

        {/* Pillar 3: Keeping loop() Clean */}
        <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#F1F7FA] border border-[#D4EBF2] flex items-center justify-center text-[#2A9D8F]">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#24313A]">3. No Spaghetti Code</h4>
          <p className="text-xs text-[#576875] leading-relaxed">
            Instead of dumping 150 messy lines into <code>loop()</code>, your loop stays just 4 clean lines! Every 20 seconds, it calls <code>fetchLatestReadings()</code>. If Wi-Fi breaks, you only debug the Wi-Fi function!
          </p>
        </div>

      </div>

      {/* Interactive Function Caller Demo */}
      <div className="p-6 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBE6DC]">
          <div>
            <h4 className="text-sm font-extrabold text-[#24313A] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2A9D8F]" />
              <span>Interactive Function Call Simulator: showMessage()</span>
            </h4>
            <p className="text-xs text-[#576875] mt-0.5">
              Choose an argument below to see how a single function call wipes and repaints the OLED:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFuncDemo('status')}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                activeFuncDemo === 'status'
                  ? 'bg-[#2A9D8F] text-white border-[#2A9D8F]'
                  : 'bg-white text-[#576875] border-[#EBE6DC] hover:border-[#D5CFC2]'
              }`}
            >
              Wi-Fi Boot
            </button>
            <button
              onClick={() => setActiveFuncDemo('data')}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                activeFuncDemo === 'data'
                  ? 'bg-[#2A9D8F] text-white border-[#2A9D8F]'
                  : 'bg-white text-[#576875] border-[#EBE6DC] hover:border-[#D5CFC2]'
              }`}
            >
              Stream OK
            </button>
            <button
              onClick={() => setActiveFuncDemo('error')}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                activeFuncDemo === 'error'
                  ? 'bg-[#2A9D8F] text-white border-[#2A9D8F]'
                  : 'bg-white text-[#576875] border-[#EBE6DC] hover:border-[#D5CFC2]'
              }`}
            >
              Error Alert
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* C Call snippet */}
          <div className="bg-[#24313A] p-4 rounded-xl font-mono text-xs text-white space-y-1.5 shadow-inner">
            <span className="text-[#899AA8] text-[10px]">// Calling the function in C:</span>
            {activeFuncDemo === 'status' && (
              <p className="text-[#4ADE80]">showMessage("Connecting to Wi-Fi...", "Finding router...");</p>
            )}
            {activeFuncDemo === 'data' && (
              <p className="text-[#4ADE80]">showMessage("ThingSpeak readings", "Temp: 30.8 C");</p>
            )}
            {activeFuncDemo === 'error' && (
              <p className="text-[#F28C75]">showMessage("ThingSpeak error", "Check Serial Monitor");</p>
            )}
            <p className="text-[11px] text-[#CBD5E1] pt-2">
              Inside <code>showMessage()</code>: clears display, sets cursor, prints line 1 and line 2, then executes <code>display.display()</code> automatically!
            </p>
          </div>

          {/* Resulting simulated screen */}
          <div className="bg-black border-2 border-[#1E293B] rounded-xl p-4 text-center space-y-1 font-mono shadow-md min-h-[90px] flex flex-col justify-center">
            {activeFuncDemo === 'status' && (
              <>
                <p className="text-[#38BDF8] text-xs font-bold">Connecting to Wi-Fi...</p>
                <p className="text-[#94A3B8] text-[10px]">Finding router...</p>
              </>
            )}
            {activeFuncDemo === 'data' && (
              <>
                <p className="text-[#38BDF8] text-xs font-bold">ThingSpeak readings</p>
                <p className="text-white text-sm font-bold">Temp: 30.8 C</p>
              </>
            )}
            {activeFuncDemo === 'error' && (
              <>
                <p className="text-[#F28C75] text-xs font-bold">ThingSpeak error</p>
                <p className="text-[#94A3B8] text-[10px]">Check Serial Monitor</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
