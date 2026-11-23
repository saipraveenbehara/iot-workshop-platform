import React from 'react';
import { 
  Lightbulb, 
  Clock, 
  CheckCircle2, 
  X, 
  Layers, 
  Cpu, 
  Network, 
  Cloud, 
  Monitor, 
  ToggleRight, 
  GitBranch, 
  Grid 
} from 'lucide-react';
import { ConceptByte } from '../../types/curriculum.js';

interface ConceptByteModalProps {
  concept: ConceptByte;
  isOpen: boolean;
  onClose: () => void;
  onContinueToQuiz: () => void;
}

export const ConceptByteModal: React.FC<ConceptByteModalProps> = ({
  concept,
  isOpen,
  onClose,
  onContinueToQuiz,
}) => {
  if (!isOpen) return null;

  const renderIllustration = () => {
    switch (concept.svgType) {
      case 'brain_vs_pc':
        return (
          <div className="h-48 w-full bg-gray-950/80 rounded-2xl border border-gray-800 p-4 flex items-center justify-around relative overflow-hidden">
            <div className="text-center p-3 rounded-xl bg-gray-900 border border-gray-800 w-36">
              <Monitor className="w-8 h-8 text-blue-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-white">Laptop (PC)</p>
              <p className="text-[10px] text-gray-400 mt-1">Operating system, video, windows, human UI</p>
            </div>
            <div className="text-emerald-400 font-bold text-sm tracking-wider uppercase px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              VS
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 w-36 shadow-lg shadow-emerald-500/10">
              <Cpu className="w-8 h-8 text-emerald-400 mx-auto mb-1 animate-pulse" />
              <p className="text-xs font-bold text-white">ESP32 DevKit V1</p>
              <p className="text-[10px] text-emerald-300/80 mt-1">Direct electrical pin control in microseconds</p>
            </div>
          </div>
        );

      case 'digital_switch':
        return (
          <div className="h-48 w-full bg-gray-950/80 rounded-2xl border border-gray-800 p-4 flex flex-col items-center justify-center relative">
            <div className="flex items-center gap-8">
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-700 text-center">
                <span className="text-2xl font-black text-emerald-400">1</span>
                <p className="text-xs font-bold text-gray-200 mt-1">HIGH (3.3V)</p>
                <p className="text-[10px] text-emerald-400">Electricity ON ⚡</p>
              </div>
              <ToggleRight className="w-10 h-10 text-emerald-400" />
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-700 text-center">
                <span className="text-2xl font-black text-gray-500">0</span>
                <p className="text-xs font-bold text-gray-200 mt-1">LOW (0.0V)</p>
                <p className="text-[10px] text-gray-400">Power CUT 🛑</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-4 text-center">
              <code>time.sleep(0.5)</code> gives your eyes time to see the voltage switch!
            </p>
          </div>
        );

      case 'breadboard_cutaway':
        return (
          <div className="h-48 w-full bg-gray-950/80 rounded-2xl border border-gray-800 p-4 flex flex-col justify-center relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30">
                <p className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" /> Power Rails (Horizontal)
                </p>
                <p className="text-[10px] text-gray-300 mt-1">
                  Long side rails marked (+) and (-) run along the entire length of the board.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Terminal Columns (Vertical)
                </p>
                <p className="text-[10px] text-gray-300 mt-1">
                  5-hole groups (A-B-C-D-E) are linked together underneath by metal spring clips.
                </p>
              </div>
            </div>
            <p className="text-[10px] text-amber-400 font-semibold text-center mt-3">
              ⚠️ Never plug both legs of an LED into the same column—that creates a short circuit!
            </p>
          </div>
        );

      case 'pullup_tugofwar':
        return (
          <div className="h-48 w-full bg-gray-950/80 rounded-2xl border border-gray-800 p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-4 w-full max-w-sm">
              <div className="flex-1 p-2.5 rounded-lg bg-gray-900 border border-gray-700 text-center">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Released</span>
                <p className="text-lg font-black text-white">Value = 1</p>
                <p className="text-[10px] text-gray-400">Pull-up holds pin at 3.3V</p>
              </div>
              <span className="text-gray-500 font-bold">➔</span>
              <div className="flex-1 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-center">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Pressed!</span>
                <p className="text-lg font-black text-emerald-400">Value = 0</p>
                <p className="text-[10px] text-emerald-200">Button connects pin to GND</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 text-center">
              This is <strong>Active-Low</strong> logic: 0 means Pressed, 1 means Released!
            </p>
          </div>
        );

      case 'i2c_bus_grid':
        return (
          <div className="h-48 w-full bg-gray-950/80 rounded-2xl border border-gray-800 p-4 flex items-center justify-around">
            <div className="text-center">
              <Grid className="w-8 h-8 text-cyan-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-white">128 × 64 Grid</p>
              <p className="text-[10px] text-gray-400">8,192 pixels starting at (0, 0)</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-gray-900 border border-gray-700">
              <p className="text-xs font-mono font-bold text-emerald-400">SDA (GP4)</p>
              <p className="text-[9px] text-gray-400">Data Carrier</p>
              <div className="h-px bg-gray-700 my-1.5" />
              <p className="text-xs font-mono font-bold text-amber-400">SCL (GP5)</p>
              <p className="text-[9px] text-gray-400">Clock Metronome</p>
            </div>
            <div className="text-center">
              <span className="text-xl font-bold text-purple-400">oled.show()</span>
              <p className="text-[10px] text-gray-400 mt-1">Blasts buffer to glass</p>
            </div>
          </div>
        );

      case 'iot_4_layers':
        return (
          <div className="h-48 w-full bg-gray-950/80 rounded-2xl border border-gray-800 p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-xs">
              <Monitor className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="font-bold text-purple-300">Layer 4: Application</span>
              <span className="text-gray-400 text-[10px] ml-auto">Your OLED screen & alert buzzer</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs">
              <Cloud className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-bold text-blue-300">Layer 3: Cloud / Data</span>
              <span className="text-gray-400 text-[10px] ml-auto">ThingSpeak server collecting JSON</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs">
              <Network className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-bold text-cyan-300">Layer 2: Network</span>
              <span className="text-gray-400 text-[10px] ml-auto">2.4 GHz Wi-Fi radio packets</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs">
              <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-emerald-300">Layer 1: Perception</span>
              <span className="text-gray-400 text-[10px] ml-auto">Sensors touching physical nature</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-48 w-full bg-gray-950/80 rounded-2xl border border-gray-800 p-4 flex items-center justify-center">
            <Lightbulb className="w-12 h-12 text-emerald-400 animate-pulse" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#111827] border border-gray-800 rounded-3xl max-w-xl w-full p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Lightbulb className="w-4 h-4" />
              Concept Byte • {concept.metaphor}
            </div>
            <h3 className="text-xl font-extrabold text-white">{concept.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-5 space-y-5 scrollbar-thin scrollbar-thumb-gray-800 pr-1">
          {/* Visual Diagram */}
          {renderIllustration()}

          {/* Analogy Story */}
          <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-sm text-gray-300 leading-relaxed italic">
            "{concept.analogyStory}"
          </div>

          {/* Key Takeaways */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Key Rules to Remember:
            </h4>
            <div className="space-y-2">
              {concept.keyTakeaways.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {concept.readTimeSeconds} sec read
          </span>
          <button
            onClick={onContinueToQuiz}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            Take Unlock Quiz ➔
          </button>
        </div>
      </div>
    </div>
  );
};
