import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Lightbulb, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Lock,
  Cpu,
  Layers,
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useTeamStore } from './store/useTeamStore.js';
import { useSocketStore } from './store/useSocketStore.js';
import { Header } from './components/layout/Header.js';
import { ToastAlert } from './components/layout/ToastAlert.js';
import { TeamLoginModal } from './components/auth/TeamLoginModal.js';
import { ConceptByteView } from './components/concept/ConceptByteView.js';
import { BuildGuideView } from './components/build/BuildGuideView.js';
import { QuizChallengeView } from './components/quiz/QuizChallengeView.js';
import { FacilitatorView } from './components/facilitator/FacilitatorView.js';
import rawCurriculum from './data/curriculumData.json' with { type: 'json' };
import { LevelData } from './types/curriculum.js';

const curriculum = rawCurriculum as unknown as LevelData[];

export type StagePhase = 'concept' | 'build' | 'quiz';

export const App: React.FC = () => {
  const { 
    teamName, 
    isLoggedIn, 
    activeLevelView, 
    currentLevel, 
    completedLevels,
    setActiveLevelView 
  } = useTeamStore();

  const { initSocket, submitLevelComplete } = useSocketStore();

  const [isAdminView, setIsAdminView] = useState(false);
  const [stagePhase, setStagePhase] = useState<StagePhase>('concept');
  const [visitedBuildPhases, setVisitedBuildPhases] = useState<number[]>([]);

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  const currentLevelData = curriculum.find((l) => l.levelNumber === activeLevelView) || curriculum[0];
  const isLevelCompleted = completedLevels.includes(activeLevelView);
  const isBuildVisited = visitedBuildPhases.includes(activeLevelView) || isLevelCompleted;

  // Whenever user switches level, reset phase to concept (or keep build/quiz if completed)
  useEffect(() => {
    setStagePhase('concept');
  }, [activeLevelView]);

  const handleGoToBuild = () => {
    if (!visitedBuildPhases.includes(activeLevelView)) {
      setVisitedBuildPhases([...visitedBuildPhases, activeLevelView]);
    }
    setStagePhase('build');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToQuiz = () => {
    setStagePhase('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteLevel = () => {
    submitLevelComplete(activeLevelView);
    // Advance to next level if available
    if (activeLevelView < curriculum.length - 1) {
      setActiveLevelView(activeLevelView + 1);
      setStagePhase('concept');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#24313A] flex flex-col font-sans selection:bg-[#D1ECE8] selection:text-[#21867A]">
      {/* Toast Alert System */}
      <ToastAlert />

      {/* Persistent Sticky Header */}
      <Header
        isAdminView={isAdminView}
        onOpenAdmin={() => setIsAdminView(!isAdminView)}
      />

      {/* Login Modal */}
      {!isLoggedIn && <TeamLoginModal />}

      {/* Facilitator / Admin View */}
      {isAdminView ? (
        <main className="flex-1">
          <FacilitatorView />
        </main>
      ) : (
        /* Student Level Runner */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
          
          {/* Top Activity Banner & Visual Hierarchy (Editorial Maker Style) */}
          <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              
              {/* Activity Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E6F4F2] border border-[#B2DFDB] text-[#21867A]">
                    <Cpu className="w-3.5 h-3.5" />
                    Activity Stage {currentLevelData.levelNumber}
                  </span>
                  <span className="text-xs text-[#576875] font-medium">
                    Est. {currentLevelData.estimatedMinutes} minutes hands-on
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-[#24313A] tracking-tight">
                  {currentLevelData.title}
                </h2>
                <p className="text-sm lg:text-base text-[#576875] max-w-2xl leading-relaxed">
                  {currentLevelData.subtitle}
                </p>
              </div>

              {/* 3-Phase Stepper */}
              <div className="flex items-center gap-2 bg-[#FFFDF7] border border-[#EBE6DC] p-1.5 rounded-2xl self-start md:self-center shadow-inner">
                
                {/* Phase 1: Concept */}
                <button
                  onClick={() => setStagePhase('concept')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    stagePhase === 'concept'
                      ? 'bg-[#2A9D8F] text-white shadow-sm'
                      : 'text-[#576875] hover:text-[#24313A]'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>1. Concept</span>
                </button>

                {/* Phase 2: Build & Code */}
                <button
                  onClick={() => {
                    if (isBuildVisited || stagePhase === 'quiz') {
                      setStagePhase('build');
                    }
                  }}
                  disabled={!isBuildVisited && stagePhase === 'concept'}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    stagePhase === 'build'
                      ? 'bg-[#2A9D8F] text-white shadow-sm'
                      : isBuildVisited
                      ? 'text-[#24313A] hover:bg-white'
                      : 'text-[#899AA8] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>2. Build & Code</span>
                  {!isBuildVisited && <Lock className="w-3 h-3 ml-0.5 text-[#899AA8]" />}
                </button>

                {/* Phase 3: Check Understanding */}
                <button
                  onClick={() => {
                    if (isBuildVisited) {
                      setStagePhase('quiz');
                    }
                  }}
                  disabled={!isBuildVisited}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    stagePhase === 'quiz'
                      ? 'bg-[#2A9D8F] text-white shadow-sm'
                      : isBuildVisited
                      ? 'text-[#24313A] hover:bg-white'
                      : 'text-[#899AA8] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>3. Check In</span>
                  {!isBuildVisited && <Lock className="w-3 h-3 ml-0.5 text-[#899AA8]" />}
                </button>

              </div>

            </div>
          </div>

          {/* Linear Stage Phase View Routing */}
          <div className="pt-2">
            
            {/* Phase 1: Concept Byte (Consumes entire view) */}
            {stagePhase === 'concept' && (
              <ConceptByteView
                concept={currentLevelData.conceptByte}
                levelNumber={currentLevelData.levelNumber}
                onNext={handleGoToBuild}
              />
            )}

            {/* Phase 2: Build & Code Guide */}
            {stagePhase === 'build' && (
              <BuildGuideView
                levelData={currentLevelData}
                onBack={() => setStagePhase('concept')}
                onNext={handleGoToQuiz}
              />
            )}

            {/* Phase 3: Challenge Quiz (In-page, Note 1 try-again workflow) */}
            {stagePhase === 'quiz' && (
              <QuizChallengeView
                questions={currentLevelData.quizGate}
                levelNumber={currentLevelData.levelNumber}
                isLevelCompleted={isLevelCompleted}
                onBack={() => setStagePhase('build')}
                onCompleteLevel={handleCompleteLevel}
              />
            )}

          </div>

        </main>
      )}

    </div>
  );
};
