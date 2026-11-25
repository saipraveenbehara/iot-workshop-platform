import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Zap,
  GraduationCap
} from 'lucide-react';
import { LevelData } from '../../types/curriculum.js';
import { InstructorCircuitGuide } from '../circuit/InstructorCircuitGuide.js';
import { WokwiInteractiveBoard } from '../wokwi/WokwiInteractiveBoard.js';
import { CodeChunkViewer } from '../code/CodeChunkViewer.js';
import { ThingSpeakPuzzleCard } from '../hardware/ThingSpeakPuzzleCard.js';

interface BuildGuideViewProps {
  levelData: LevelData;
  onBack: () => void;
  onNext: () => void;
}

export const BuildGuideView: React.FC<BuildGuideViewProps> = ({
  levelData,
  onBack,
  onNext,
}) => {
  const [circuitStepIndex, setCircuitStepIndex] = useState(0);
  const [visualizerMode, setVisualizerMode] = useState<'instructor' | 'wokwi'>('instructor');

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Top Navigation & Workbench Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBE6DC]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="self-start flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#D5CFC2] text-[#24313A] text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#2A9D8F]" />
            <span>Back to Concept</span>
          </button>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#2A9D8F]" />
            <span>Stage {levelData.levelNumber} · Step 2 of 3: Build & Code Guide</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-[#576875]">Circuit View:</span>
          <div className="flex rounded-xl bg-[#FFFDF7] border border-[#EBE6DC] p-1 shadow-sm">
            <button
              onClick={() => setVisualizerMode('instructor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                visualizerMode === 'instructor'
                  ? 'bg-[#2A9D8F] text-white shadow-sm'
                  : 'text-[#576875] hover:text-[#24313A]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Instructor Circuit Guide</span>
            </button>
            <button
              onClick={() => setVisualizerMode('wokwi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                visualizerMode === 'wokwi'
                  ? 'bg-[#2A9D8F] text-white shadow-sm'
                  : 'text-[#576875] hover:text-[#24313A]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Interactive Twin (Sim)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workspace (Hardware Guide Left, Code Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Circuit Guide (Instructor-Led) or Interactive Twin */}
        <div>
          {visualizerMode === 'instructor' ? (
            <InstructorCircuitGuide
              levelNumber={levelData.levelNumber}
              steps={levelData.circuitSteps}
              currentStepIndex={circuitStepIndex}
              onStepChange={setCircuitStepIndex}
            />
          ) : (
            <WokwiInteractiveBoard levelNumber={levelData.levelNumber} />
          )}
        </div>

        {/* Right Column: Flowing Code & Hands-on Verification */}
        <div className="space-y-6">
          {(levelData.levelNumber === 5 || levelData.levelNumber === 6) && <ThingSpeakPuzzleCard />}

          <CodeChunkViewer
            chunks={levelData.codeChunks}
            fullScript={levelData.fullScript}
            activities={levelData.activities}
          />

          {/* Verification Challenge Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#EBE6DC] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2A9D8F]" />
              <h4 className="text-sm font-black text-[#24313A] uppercase tracking-wider">
                Hands-On Hardware Check
              </h4>
            </div>

            <p className="text-sm text-[#576875] leading-relaxed font-medium">
              {levelData.verificationChallenge.instruction}
            </p>

            <div className="p-4 rounded-2xl bg-[#E6F4F2] border border-[#B2DFDB] text-sm text-[#21867A] flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#2A9D8F] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#24313A]">Expected Observable Result:</strong> {levelData.verificationChallenge.expectedObservableResult}
              </span>
            </div>

            {/* Next Step: Quiz Navigation */}
            <div className="pt-2">
              <button
                onClick={onNext}
                className="w-full py-4 px-6 rounded-2xl bg-[#2A9D8F] hover:bg-[#21867A] text-white font-black text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Next: Check Understanding</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
