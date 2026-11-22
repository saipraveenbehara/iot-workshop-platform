import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Zap,
  Activity,
  Compass
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
      
      {/* Top Banner: Metaphor & Reading Time (Bright Editorial Style) */}
      <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A] text-xs font-bold uppercase tracking-wider font-mono">
              <Compass className="w-3.5 h-3.5" />
              <span>Step 1: Concept Blueprint</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-[#24313A] tracking-tight">
              {concept.title}
            </h2>
            <p className="text-sm lg:text-base text-[#576875] font-medium flex flex-wrap items-center gap-2 pt-1">
              <span>Core Model:</span>
              <span className="text-[#24313A] bg-[#FEF9EC] px-3 py-1 rounded-xl border border-[#FCEFCB] font-bold text-xs lg:text-sm">
                {concept.metaphor}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] text-[#24313A] text-xs font-bold shrink-0 shadow-sm">
            <Clock className="w-4 h-4 text-[#2A9D8F]" />
            <span>{concept.readTimeSeconds}s Quick Read</span>
          </div>
        </div>
      </div>

      {/* Level-Specific Interactive Hardware Component Blueprints */}
      {levelNumber === 0 && <ComputerVsMicrocontrollerCard />}

      {levelNumber === 1 && (
        <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBE6DC]">
            <h3 className="text-sm font-extrabold text-[#24313A] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2A9D8F]" />
              <span>Digital Output Voltage Demonstration</span>
            </h3>
            <span className="text-xs text-[#576875] font-mono">Interactive Signal Switch</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#FFFDF7] border border-[#EBE6DC] p-6 rounded-2xl w-full justify-around shadow-sm">
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-[#576875] font-mono uppercase font-bold">Code Command</span>
              <div className="mt-2 px-3.5 py-2 rounded-xl bg-white text-[#21867A] font-mono text-xs font-bold border border-[#B2DFDB] shadow-sm">
                led.value({digitalSwitchState})
              </div>
            </div>

            <button
              onClick={() => setDigitalSwitchState(digitalSwitchState === 1 ? 0 : 1)}
              className="px-5 py-2.5 rounded-xl bg-[#2A9D8F] hover:bg-[#21867A] text-xs font-bold text-white transition-all shadow-sm flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>Toggle State (Click)</span>
            </button>

            <div className="flex flex-col items-center">
              <span className="text-[11px] text-[#576875] font-mono uppercase font-bold">Physical Voltage</span>
              <div className={`mt-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                digitalSwitchState === 1
                  ? 'bg-[#E6F4F2] text-[#21867A] border-[#B2DFDB] shadow-sm'
                  : 'bg-white text-[#899AA8] border-[#EBE6DC]'
              }`}>
                {digitalSwitchState === 1 ? '+3.3 Volts (HIGH)' : '0.0 Volts (LOW)'}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[11px] text-[#576875] font-mono uppercase font-bold">Onboard LED</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-2 transition-all duration-300 ${
                digitalSwitchState === 1
                  ? 'bg-[#2A9D8F] text-white shadow-md scale-110'
                  : 'bg-[#FFFDF7] text-[#899AA8] border border-[#EBE6DC]'
              }`}>
                <Zap className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level 2: LED Anatomy */}
      {levelNumber === 2 && <LEDAnatomyCard />}

      {/* Level 3: Push Button Anatomy */}
      {levelNumber === 3 && <PushButtonAnatomyCard />}

      {/* Level 4: OLED Anatomy & Pixel Sandbox */}
      {levelNumber === 4 && <OLEDAnatomyCard />}

      {/* Level 5: API Explainer */}
      {levelNumber === 5 && <APIExplainerCard />}

      {/* Story & Core Takeaways (Editorial 2-Column Spread) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Analogy Story & Pillars */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-7 shadow-sm space-y-3">
            <h4 className="text-base font-extrabold text-[#24313A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F28C75]" />
              <span>How It Works (Real-World Analogy)</span>
            </h4>
            <p className="text-sm text-[#576875] leading-relaxed">
              {concept.analogyStory}
            </p>
          </div>

          <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-7 shadow-sm space-y-4">
            <h4 className="text-base font-extrabold text-[#24313A] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2A9D8F]" />
              <span>Key Ideas to Remember</span>
            </h4>
            <div className="space-y-3">
              {concept.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC]">
                  <span className="w-6 h-6 rounded-lg bg-[#E6F4F2] text-[#21867A] border border-[#B2DFDB] flex items-center justify-center shrink-0 text-xs font-extrabold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-[#24313A] leading-relaxed font-medium">
                    {takeaway}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Workshop Safety Rule & Forward CTA */}
        <div className="space-y-6">
          <div className="bg-[#FEF9EC] border border-[#FCEFCB] rounded-3xl p-6 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#DBAF40]" />
              <h5 className="text-xs font-extrabold text-[#24313A] uppercase tracking-wider font-mono">
                Workshop Safety Habit
              </h5>
            </div>
            <p className="text-xs text-[#576875] leading-relaxed font-medium">
              Always disconnect the USB cable before plugging or unplugging wires on the breadboard. This keeps the Pico's voltage regulator safe from accidental short circuits.
            </p>
          </div>

          {/* Action Card */}
          <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4F2] border border-[#B2DFDB] flex items-center justify-center text-[#2A9D8F] mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-[#24313A]">Ready to Build?</h4>
              <p className="text-xs text-[#576875] mt-1 leading-relaxed">
                Step into the build guide to assemble your breadboard circuit and write the code.
              </p>
            </div>

            <button
              onClick={onNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#2A9D8F] hover:bg-[#21867A] text-white font-black text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Next: Open Build Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
