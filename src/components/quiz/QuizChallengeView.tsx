import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  Check, 
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

  // Try Again action - re-enables selecting options
  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2A9D8F', '#F4C95D', '#B9DCE8', '#F28C75'],
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
        <div className="w-20 h-14 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] p-1.5 shrink-0 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-center">
            <div className="w-4 h-3.5 bg-[#94A3B8] rounded-[1px]" title="USB-B Port" />
            <div className="w-3 h-3 rounded-full bg-[#334155]" title="DC Jack" />
          </div>
          <div className="w-10 h-2.5 bg-[#1E293B] rounded-[1px] mx-auto flex items-center justify-center">
            <span className="text-[5px] text-[#E2E8F0] font-mono">ATmega328P</span>
          </div>
          <span className="text-[7.5px] text-[#0369A1] font-mono font-bold text-center">UNO R3 (Blue)</span>
        </div>
      );
    }
    if (idx === 1) {
      return (
        <div className="w-20 h-14 rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] p-1.5 shrink-0 flex flex-col justify-between shadow-xs">
          <div className="w-3.5 h-2 bg-[#94A3B8] mx-auto rounded-[1px]" />
          <div className="w-9 h-6 bg-[#E2E8F0] border border-[#CBD5E1] rounded-[2px] mx-auto flex items-center justify-center">
            <span className="text-[6px] text-[#475569] font-bold">ESP-WROOM</span>
          </div>
          <span className="text-[7.5px] text-[#64748B] font-mono font-bold text-center">ESP32 (Black)</span>
        </div>
      );
    }
    if (idx === 2) {
      return (
        <div className="w-20 h-14 rounded-xl bg-[#E6F4F2] border-2 border-[#2A9D8F] p-1.5 shrink-0 flex flex-col justify-between shadow-xs">
          <div className="w-4.5 h-2 bg-[#94A3B8] mx-auto rounded-[1px]" title="Micro-USB" />
          <div className="flex justify-between items-center px-0.5">
            <div className="w-5 h-4 bg-white border border-[#B2DFDB] rounded-[1px] flex items-center justify-center">
              <span className="text-[5px] text-[#24313A] font-bold">CYW43</span>
            </div>
            <div className="w-4 h-4 bg-[#1E293B] rounded-[1px] flex items-center justify-center">
              <span className="text-[4.5px] text-[#2A9D8F] font-mono">RP2040</span>
            </div>
          </div>
          <span className="text-[7.5px] text-[#21867A] font-mono font-bold text-center">Pico WH (Green)</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Top Header & Back Navigation with Clarified Step Numbering */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EBE6DC]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EBE6DC] hover:border-[#D5CFC2] text-[#24313A] text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#2A9D8F]" />
          <span>Back to Build Guide</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-[#2A9D8F] flex items-center gap-1.5 bg-[#E6F4F2] px-3 py-1 rounded-full border border-[#B2DFDB]">
          <Sparkles className="w-4 h-4" />
          <span>Stage {levelNumber} · Step 3 of 3: Check Understanding</span>
        </span>
      </div>

      {/* Celebration State if Quiz Finished */}
      {quizFinished ? (
        <div className="bg-white border border-[#EBE6DC] rounded-3xl p-8 lg:p-12 shadow-sm text-center space-y-6 animate-scale-up">
          <div className="w-16 h-16 rounded-2xl bg-[#E6F4F2] border border-[#B2DFDB] flex items-center justify-center text-[#2A9D8F] mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider text-[#2A9D8F] uppercase bg-[#E6F4F2] px-3 py-1 rounded-full border border-[#B2DFDB]">
              Stage Complete & Verified
            </span>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-[#24313A] tracking-tight">
              Stage {levelNumber} Completed
            </h3>
            <p className="text-sm text-[#576875] max-w-md mx-auto leading-relaxed">
              Your team successfully connected the concepts, built the circuit, and passed the understanding check.
            </p>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#FEF9EC] border border-[#F4C95D] text-[#B88719] font-bold text-xs">
            <Check className="w-4 h-4" />
            <span>+100 Points Awarded to Team Total</span>
          </div>

          <div className="pt-4 max-w-md mx-auto">
            <button
              onClick={onCompleteLevel}
              className="w-full py-4 px-6 rounded-2xl bg-[#2A9D8F] hover:bg-[#21867A] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Advance to Next Stage</span>
              <Rocket className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Active Quiz Question Card */
        <div className="bg-white border border-[#EBE6DC] rounded-3xl p-6 lg:p-10 shadow-sm space-y-6">
          
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#576875]">
              <span className="font-bold text-[#24313A] uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="font-mono text-[#2A9D8F] font-bold">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[#EBE6DC] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2A9D8F] h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-xl lg:text-2xl font-extrabold text-[#24313A] leading-snug">
            {currentQ.question}
          </h3>

          {/* Multiple Choice Options with Unmistakable Selection Indicator */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              let optionStyle = 'bg-[#FFFDF7] border-[#EBE6DC] text-[#24313A] hover:border-[#2A9D8F] hover:bg-white';

              if (isAnswerChecked) {
                if (idx === currentQ.correctIndex) {
                  optionStyle = 'bg-[#E6F4F2] border-2 border-[#2A9D8F] text-[#24313A] font-bold ring-2 ring-[#2A9D8F]/20';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-[#FDF1EE] border-2 border-[#F28C75] text-[#24313A] ring-2 ring-[#F28C75]/20';
                }
              } else if (isSelected) {
                optionStyle = 'bg-[#E6F4F2] border-2 border-[#2A9D8F] text-[#24313A] font-bold shadow-xs ring-2 ring-[#2A9D8F]/25';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer shadow-xs ${optionStyle}`}
                >
                  <div className="flex items-start gap-3.5">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                      isSelected 
                        ? 'bg-[#2A9D8F] text-white shadow-xs' 
                        : 'bg-white border border-[#EBE6DC] text-[#576875]'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm pt-0.5 leading-relaxed">{option}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Unmistakable Radio/Check Selection Indicator */}
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-[#CBD5E1] bg-white" />
                    )}
                    {renderBoardIllustration(idx)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanations */}
          {isAnswerChecked && (
            <div
              className={`p-5 rounded-2xl border text-xs leading-relaxed animate-fade-in ${
                isCorrect
                  ? 'bg-[#E6F4F2] border-[#B2DFDB] text-[#21867A]'
                  : 'bg-[#FDF1EE] border-[#F28C75] text-[#D95D43]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#2A9D8F]" />
                    <span className="text-[#24313A]">Correct</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-[#F28C75]" />
                    <span className="text-[#24313A]">Not quite. Review the hint below:</span>
                  </>
                )}
              </div>
              <p className="text-sm text-[#576875] leading-relaxed font-medium">
                {isCorrect ? currentQ.explanation : currentQ.hint}
              </p>
            </div>
          )}

          {/* Controls Bottom Bar */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#EBE6DC]">
            <button
              onClick={() => setShowHint(true)}
              className="text-xs text-[#576875] hover:text-[#2A9D8F] flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#F4C95D]" />
              <span>{showHint ? `Hint: ${currentQ.hint}` : 'Need a hint?'}</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Note 1: If answered wrong, show "Try Again" to go back to selecting options */}
              {isAnswerChecked && !isCorrect && (
                <button
                  onClick={handleTryAgain}
                  className="px-5 py-2.5 rounded-xl bg-[#FEF9EC] hover:bg-[#FDF1D6] border border-[#F4C95D] text-[#B88719] font-bold text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              )}

              {/* Helper prompt when no option is selected yet */}
              {!isAnswerChecked && selectedAnswer === null && (
                <span className="text-xs font-semibold text-[#899AA8] italic">
                  Choose an answer to continue
                </span>
              )}

              {/* Submit Answer Button (Strengthened contrast: vibrant deep teal #2A9D8F with white text #FFFFFF) */}
              {!isAnswerChecked && (
                <button
                  disabled={selectedAnswer === null}
                  onClick={handleCheckAnswer}
                  className={`px-8 py-3 rounded-xl font-extrabold text-sm transition-all shadow-sm ${
                    selectedAnswer !== null
                      ? 'bg-[#2A9D8F] hover:bg-[#21867A] text-white shadow-md cursor-pointer transform hover:-translate-y-0.5'
                      : 'bg-[#E2E8F0] text-[#899AA8] cursor-not-allowed border border-[#CBD5E1]'
                  }`}
                >
                  Check Answer
                </button>
              )}

              {/* Next Question / Finish Button */}
              {isAnswerChecked && isCorrect && (
                <button
                  onClick={handleNextQuestion}
                  className="px-8 py-3 rounded-xl bg-[#2A9D8F] hover:bg-[#21867A] text-white font-extrabold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>{isLastQuestion ? 'Complete Stage' : 'Next Question'}</span>
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
