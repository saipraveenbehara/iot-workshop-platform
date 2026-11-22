import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  Trophy, 
  Rocket 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../../types/curriculum.js';

interface QuizChallengeViewProps {
  questions: QuizQuestion[];
  levelNumber: number;
  isLevelCompleted: boolean;
  onBack: () => void;
  onCompleteLevel: () => void;
}

export const QuizChallengeView: React.FC<QuizChallengeViewProps> = ({
  questions,
  levelNumber,
  isLevelCompleted,
  onBack,
  onCompleteLevel,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [quizFinished, setQuizFinished] = useState(isLevelCompleted);

  const currentQ = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQ.correctIndex;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectOption = (idx: number) => {
    // If answer is already checked and correct, don't allow changing
    if (isAnswerChecked && isCorrect) return;
    setSelectedAnswer(idx);
    setIsAnswerChecked(false);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerChecked(true);
    if (selectedAnswer !== currentQ.correctIndex) {
      setShowHint(true);
    }
  };

  // Note 1: Try Again action - re-enables selecting options
  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Trigger room celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#F59E0B', '#8B5CF6'],
      });
      setQuizFinished(true);
      onCompleteLevel();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      setShowHint(false);
    }
  };

  const renderBoardIllustration = (idx: number) => {
    if (currentQ.id !== 'q0-1') return null;
    if (idx === 0) {
      return (
        <div className="w-20 h-14 rounded-xl bg-[#008184] border border-cyan-300/40 p-1.5 shrink-0 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-center">
            <div className="w-4 h-3.5 bg-gray-200 rounded-[1px]" title="USB-B Port" />
            <div className="w-3 h-3 rounded-full bg-black" title="DC Jack" />
          </div>
          <div className="w-10 h-2.5 bg-black rounded-[1px] mx-auto flex items-center justify-center">
            <span className="text-[5px] text-gray-300 font-mono">ATmega328P</span>
          </div>
          <span className="text-[7.5px] text-cyan-100 font-mono font-black text-center">UNO R3 (Blue)</span>
        </div>
      );
    }
    if (idx === 1) {
      return (
        <div className="w-20 h-14 rounded-xl bg-[#0F172A] border border-gray-700 p-1.5 shrink-0 flex flex-col justify-between shadow-md">
          <div className="w-3.5 h-2 bg-gray-400 mx-auto rounded-[1px]" />
          <div className="w-9 h-6 bg-[#CBD5E1] rounded-[2px] mx-auto flex items-center justify-center">
            <span className="text-[6px] text-gray-900 font-black">ESP-WROOM</span>
          </div>
          <span className="text-[7.5px] text-gray-400 font-mono font-bold text-center">ESP32 (Black)</span>
        </div>
      );
    }
    if (idx === 2) {
      return (
        <div className="w-20 h-14 rounded-xl bg-[#047857] border-2 border-emerald-400 p-1.5 shrink-0 flex flex-col justify-between shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30">
          <div className="w-4.5 h-2 bg-[#94A3B8] mx-auto rounded-[1px]" title="Micro-USB" />
          <div className="flex justify-between items-center px-0.5">
            <div className="w-5 h-4 bg-[#E2E8F0] rounded-[1px] flex items-center justify-center">
              <span className="text-[5px] text-gray-900 font-black">CYW43439</span>
            </div>
            <div className="w-4 h-4 bg-black rounded-[1px] flex items-center justify-center">
              <span className="text-[4.5px] text-cyan-300 font-mono">RP2040</span>
            </div>
          </div>
          <span className="text-[7.5px] text-emerald-100 font-mono font-black text-center">Pico WH (Green)</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Top Header & Back Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-xs font-bold transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Build Guide</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Phase 3 of 3: Challenge Quiz</span>
        </span>
      </div>

      {/* Celebration State if Quiz Finished */}
      {quizFinished ? (
        <div className="bg-gradient-to-br from-emerald-950/60 via-gray-900 to-[#111827] border-2 border-emerald-500/40 rounded-3xl p-8 lg:p-12 shadow-2xl text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Stage Verified & Logged
            </span>
            <h3 className="text-3xl font-black text-white tracking-tight">
              Mission Stage {levelNumber} Complete!
            </h3>
            <p className="text-sm text-gray-300 max-w-md mx-auto">
              Your team successfully passed the concept byte, built the hardware circuit, and mastered the engineering challenge!
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>+100 Points Awarded to Team Score</span>
          </div>

          <div className="pt-4 max-w-md mx-auto">
            <button
              onClick={onCompleteLevel}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Advance to Next Mission Stage</span>
              <Rocket className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Active Quiz Question Card */
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 lg:p-10 shadow-2xl space-y-6">
          
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-bold text-white uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="font-mono text-emerald-400 font-semibold">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-xl lg:text-2xl font-extrabold text-white leading-snug">
            {currentQ.question}
          </h3>

          {/* Multiple Choice Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              let optionStyle = 'bg-gray-900/80 border-gray-800 text-gray-200 hover:border-gray-700 hover:bg-gray-800/80';

              if (isAnswerChecked) {
                if (idx === currentQ.correctIndex) {
                  optionStyle = 'bg-emerald-950/60 border-2 border-emerald-500 text-emerald-100 font-bold shadow-lg shadow-emerald-500/10';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-950/60 border-2 border-rose-500 text-rose-200';
                }
              } else if (isSelected) {
                optionStyle = 'bg-emerald-500/10 border-2 border-emerald-500 text-emerald-200 font-medium shadow-md shadow-emerald-500/10';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${optionStyle}`}
                >
                  <div className="flex items-start gap-4">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-all ${
                      isSelected ? 'bg-emerald-500 text-gray-950' : 'bg-gray-800 border border-gray-700 text-gray-300'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm pt-0.5 leading-relaxed">{option}</span>
                  </div>
                  {renderBoardIllustration(idx)}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanations */}
          {isAnswerChecked && (
            <div
              className={`p-5 rounded-2xl border text-xs leading-relaxed animate-fade-in ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base mb-1.5">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-300">Correct.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                    <span className="text-rose-300">Incorrect. Review the hint below:</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-medium">
                {isCorrect ? currentQ.explanation : currentQ.hint}
              </p>
            </div>
          )}

          {/* Controls Bottom Bar (Note 1 Implementation) */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-800/80">
            <button
              onClick={() => setShowHint(true)}
              className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1.5 font-medium transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? `Hint: ${currentQ.hint}` : 'Need a Hint?'}</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Note 1: If answered wrong, show "Try Again" to go back to selecting options */}
              {isAnswerChecked && !isCorrect && (
                <button
                  onClick={handleTryAgain}
                  className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Try Again (Select Another Option)</span>
                </button>
              )}

              {/* Submit Answer Button */}
              {!isAnswerChecked && (
                <button
                  disabled={selectedAnswer === null}
                  onClick={handleCheckAnswer}
                  className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-gray-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  Check Answer
                </button>
              )}

              {/* Next Question / Finish Button */}
              {isAnswerChecked && isCorrect && (
                <button
                  onClick={handleNextQuestion}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>{isLastQuestion ? 'Complete Stage & Claim Score 🚀' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
