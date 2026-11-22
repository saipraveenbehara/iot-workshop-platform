import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  Activity
} from 'lucide-react';
import { ConceptByte } from '../../types/curriculum.js';
import { LEDAnatomyCard } from '../hardware/LEDAnatomyCard.js';
import { PushButtonAnatomyCard } from '../hardware/PushButtonAnatomyCard.js';
import { OLEDAnatomyCard } from '../hardware/OLEDAnatomyCard.js';
import { APIExplainerCard } from '../hardware/APIExplainerCard.js';
import { ComputerVsMicrocontrollerCard } from '../hardware/ComputerVsMicrocontrollerCard.js';

interface ConceptByteViewProps {
  concept: ConceptByte;
  levelNumber: number;
  onNext: () => void;
}

export const ConceptByteView: React.FC<ConceptByteViewProps> = ({
  concept,
  levelNumber,
  onNext,
}) => {
  const [digitalSwitchState, setDigitalSwitchState] = useState(1);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Top Banner: Metaphor & Reading Time */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Phase 1 of 3: Concept Blueprint</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              {concept.title}
            </h2>
            <p className="text-base text-gray-300 font-medium flex flex-wrap items-center gap-2 pt-1">
              <span className="text-gray-400">Core Metaphor:</span>
              <span className="text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-500/40 font-bold text-sm">
                {concept.metaphor}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center px-4 py-2.5 rounded-2xl bg-gray-900/90 border border-gray-700 text-gray-200 text-xs font-semibold shrink-0 shadow-md">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{concept.readTimeSeconds}s Read Time</span>
          </div>
        </div>
      </div>

      {/* Level-Specific Interactive Hardware Component Blueprints */}
      {levelNumber === 0 && <ComputerVsMicrocontrollerCard />}

      {levelNumber === 1 && (
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Digital Output Voltage Demonstration</span>
            </h3>
            <span className="text-xs text-gray-400 font-mono">MicroPython REPL Simulator</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#070B14] border border-gray-800 p-6 rounded-2xl w-full justify-around shadow-xl">
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-gray-400 font-mono uppercase">Instruction</span>
              <div className="mt-2 px-3.5 py-2 rounded-lg bg-black text-emerald-300 font-mono text-xs border border-emerald-900/80 shadow-inner">
                led.value({digitalSwitchState})
              </div>
            </div>

            <button
              onClick={() => setDigitalSwitchState(digitalSwitchState === 1 ? 0 : 1)}
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-emerald-600 text-xs font-bold text-white transition-all border border-gray-700 shadow-md flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>Toggle Switch (Click)</span>
            </button>

            <div className="flex flex-col items-center">
              <span className="text-[11px] text-gray-400 font-mono uppercase">Pin Voltage</span>
              <div className={`mt-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                digitalSwitchState === 1
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                  : 'bg-gray-800 text-gray-500 border-gray-700'
              }`}>
                {digitalSwitchState === 1 ? '+3.3 Volts (HIGH)' : '0.0 Volts (LOW)'}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[11px] text-gray-400 font-mono uppercase">Onboard LED</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-2 transition-all duration-300 ${
                digitalSwitchState === 1
                  ? 'bg-emerald-400 text-gray-950 shadow-xl shadow-emerald-400/60 scale-110'
                  : 'bg-emerald-950/40 text-emerald-800 border border-emerald-900/50'
              }`}>
                <Zap className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note 1: Dedicated LED Anatomy in Level 2 */}
      {levelNumber === 2 && <LEDAnatomyCard />}

      {/* Dedicated Push Button Anatomy in Level 3 */}
      {levelNumber === 3 && <PushButtonAnatomyCard />}

      {/* Dedicated OLED Anatomy & Pixel Sandbox in Level 4 */}
      {levelNumber === 4 && <OLEDAnatomyCard />}

      {/* Dedicated API Restaurant Explainer in Level 5 */}
      {levelNumber === 5 && <APIExplainerCard />}

      {/* Story & Core Takeaways */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Analogy Story & Pillars */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 lg:p-7 shadow-xl space-y-3">
            <h4 className="text-base font-extrabold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>How It Works (Real-World Analogy)</span>
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed font-normal">
              {concept.analogyStory}
            </p>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 lg:p-7 shadow-xl space-y-4">
            <h4 className="text-base font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Core Takeaways for Young Engineers</span>
            </h4>
            <div className="space-y-3">
              {concept.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-4 rounded-xl bg-gray-900/70 border border-gray-800/80">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-200 leading-relaxed font-medium">
                    {takeaway}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Pro-Tip & Forward CTA */}
        <div className="space-y-6">
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h5 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Engineering Safety Rule
              </h5>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Always unplug the micro-USB cable before plugging or unplugging jumper wires and components on the breadboard. This protects the Pico's 3.3V power regulator from accidental short circuits.
            </p>
          </div>

          {/* Action Card */}
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white">Concept Mastered</h4>
              <p className="text-xs text-gray-400 mt-1">
                Proceed to the build guide to assemble the circuit on your breadboard and run the code in Thonny.
              </p>
            </div>

            <button
              onClick={onNext}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Next: Step into Build Guide</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
