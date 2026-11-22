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
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
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
          
          {/* Top Mission Banner & Visual Hierarchy */}
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              
              {/* Mission Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Cpu className="w-3.5 h-3.5" />
                    Mission Stage {currentLevelData.levelNumber}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    Est. Time: {currentLevelData.estimatedMinutes} mins
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {currentLevelData.title}
                </h2>
                <p className="text-base text-gray-300 max-w-2xl">
                  {currentLevelData.subtitle}
                </p>
              </div>

              {/* 3-Phase Linear Stepper */}
              <div className="flex items-center gap-2 bg-gray-900/90 border border-gray-800 p-1.5 rounded-2xl shadow-inner self-start md:self-center">
                
                {/* Phase 1: Concept Byte */}
                <button
                  onClick={() => setStagePhase('concept')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    stagePhase === 'concept'
                      ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>1. Concept</span>
                </button>

                {/* Phase 2: Build & Code Guide */}
                <button
                  onClick={() => {
                    if (isBuildVisited || stagePhase === 'quiz') {
                      setStagePhase('build');
                    }
                  }}
                  disabled={!isBuildVisited && stagePhase === 'concept'}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    stagePhase === 'build'
                      ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20'
                      : isBuildVisited
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>2. Build Guide</span>
                  {!isBuildVisited && <Lock className="w-3 h-3 ml-0.5 text-gray-600" />}
                </button>

                {/* Phase 3: Challenge Quiz */}
                <button
                  onClick={() => {
                    if (isBuildVisited) {
                      setStagePhase('quiz');
                    }
                  }}
                  disabled={!isBuildVisited}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    stagePhase === 'quiz'
                      ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20'
                      : isBuildVisited
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>3. Quiz</span>
                  {!isBuildVisited && <Lock className="w-3 h-3 ml-0.5 text-gray-600" />}
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
