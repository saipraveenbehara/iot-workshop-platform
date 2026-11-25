import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Terminal, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Sliders, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Cpu,
  Layers
} from 'lucide-react';
import { CodeChunk, ActivityItem } from '../../types/curriculum.js';

interface CodeChunkViewerProps {
  chunks: CodeChunk[];
  fullScript: string;
  activities?: ActivityItem[];
}

export const CodeChunkViewer: React.FC<CodeChunkViewerProps> = ({
  chunks,
  fullScript,
  activities,
}) => {
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showFullCode, setShowFullCode] = useState(true);

  const hasMultipleActivities = activities && activities.length > 1;
  const currentActivity = activities && activities.length > 0 
    ? activities[selectedActivityIndex] 
    : null;

  const activeScript = currentActivity ? currentActivity.fullScript : fullScript;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-7 shadow-sm flex flex-col gap-6">
      
      {/* 1. Multi-Activity Tabs Selector (e.g. Activity 2 vs Activity 3) */}
      {hasMultipleActivities && (
        <div className="space-y-2 pb-2 border-b border-[#EBE6DC]">
          <span className="text-[11px] font-mono font-bold text-[#899AA8] uppercase tracking-wider">
            Choose Activity to Upload:
          </span>
          <div className="flex flex-wrap gap-2">
            {activities.map((act, idx) => (
              <button
                key={act.id}
                onClick={() => {
                  setSelectedActivityIndex(idx);
                  setCopiedKey(null);
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedActivityIndex === idx
                    ? 'bg-[#2A9D8F] text-white shadow-sm'
                    : 'bg-[#FFFDF7] text-[#24313A] border border-[#EBE6DC] hover:border-[#2A9D8F]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{act.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Header & Giant 1-Click Copy Complete Sketch Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F]" />
            <span className="text-xs font-bold text-[#21867A] uppercase tracking-wider font-mono">
              {currentActivity ? currentActivity.title : 'Complete Arduino C Sketch'}
            </span>
          </div>
          <p className="text-xs text-[#576875] mt-0.5">
            {currentActivity ? currentActivity.goal : 'One complete, self-contained sketch ready to flash into Arduino IDE'}
          </p>
        </div>

        {/* 1-Click Copy Full Sketch */}
        <button
          onClick={() => handleCopy(activeScript, 'active-full')}
          className={`flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-black text-xs transition-all shadow-sm cursor-pointer shrink-0 ${
            copiedKey === 'active-full'
              ? 'bg-[#2A9D8F] text-white scale-102'
              : 'bg-[#2A9D8F] hover:bg-[#21867A] text-white hover:shadow-md'
          }`}
        >
          {copiedKey === 'active-full' ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Full Sketch Copied! Paste into IDE</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Complete Sketch (Ready to Upload)</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Arduino IDE 3-Step Quick Guide */}
      <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#E6F4F2] text-[#2A9D8F] font-bold font-mono flex items-center justify-center shrink-0">
            1
          </div>
          <span className="text-[#576875]">In Arduino IDE: Press <strong>Ctrl+A</strong> then <strong>Ctrl+V</strong></span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#E6F4F2] text-[#2A9D8F] font-bold font-mono flex items-center justify-center shrink-0">
            2
          </div>
          <span className="text-[#576875]">Board: <strong>DOIT ESP32 DEVKIT V1</strong></span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#E6F4F2] text-[#2A9D8F] font-bold font-mono flex items-center justify-center shrink-0">
            3
          </div>
          <span className="text-[#576875]">Click <strong>Upload (➔)</strong> & open Serial Monitor</span>
        </div>
      </div>

      {/* 4. Complete Ready-to-Run Code View */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFullCode(!showFullCode)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#24313A] hover:text-[#2A9D8F] cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-[#2A9D8F]" />
            <span>Complete Ready-to-Run Code</span>
            {showFullCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          
          <button
            onClick={() => handleCopy(activeScript, 'active-full-preview')}
            className="text-[11px] font-mono font-bold text-[#576875] hover:text-[#2A9D8F] flex items-center gap-1 cursor-pointer"
          >
            {copiedKey === 'active-full-preview' ? <Check className="w-3 h-3 text-[#2A9D8F]" /> : <Copy className="w-3 h-3" />}
            <span>{copiedKey === 'active-full-preview' ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {showFullCode && (
          <div className="rounded-2xl border border-[#EBE6DC] overflow-hidden bg-[#1E293B] shadow-inner">
            <div className="px-4 py-2 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>sketch.ino</span>
              <span>ESP32 Arduino C / C++</span>
            </div>
            <pre className="p-4 font-mono text-xs text-[#F8FAFC] leading-relaxed overflow-x-auto max-h-80 scrollbar-thin">
              {activeScript}
            </pre>
          </div>
        )}
      </div>

      {/* 5. How the Code Flows (Walkthrough Steps) */}
      <div className="space-y-3 pt-2 border-t border-[#EBE6DC]">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-[#24313A] tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F4C95D]" />
            <span>How This Sketch Works (Code Walkthrough)</span>
          </h4>
          <span className="text-[11px] font-mono text-[#899AA8]">Flow Breakdown</span>
        </div>

        {/* If activity has flowSteps, show them */}
        {currentActivity && currentActivity.flowSteps && currentActivity.flowSteps.length > 0 ? (
          <div className="space-y-3">
            {currentActivity.flowSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#24313A] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E6F4F2] text-[#2A9D8F] font-mono font-bold flex items-center justify-center text-[10px]">
                      {step.stepNumber}
                    </span>
                    <span>{step.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#899AA8]">Lines in sketch</span>
                </div>

                <pre className="p-2.5 rounded-xl bg-white border border-[#EBE6DC] font-mono text-[11px] text-[#21867A] overflow-x-auto">
                  {step.codeSnippet}
                </pre>

                <p className="text-[#576875] text-[11px] leading-relaxed pl-1">
                  {step.explanation}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback to codeChunks */
          <div className="space-y-3">
            {chunks.map((chunk) => (
              <div
                key={chunk.blockId}
                className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#EBE6DC] space-y-2 text-xs"
              >
                <div className="font-bold text-[#24313A]">{chunk.title}</div>
                <pre className="p-2.5 rounded-xl bg-white border border-[#EBE6DC] font-mono text-[11px] text-[#21867A] overflow-x-auto">
                  {chunk.code}
                </pre>
                <p className="text-[#576875] text-[11px] leading-relaxed">
                  {chunk.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
