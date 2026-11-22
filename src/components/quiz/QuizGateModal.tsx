import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { QuizQuestion } from '../../types/curriculum.js';

interface QuizGateModalProps {
  questions: QuizQuestion[];
  isOpen: boolean;
  onPassed: () => void;
  onClose: () => void;
}

export const QuizGateModal: React.FC<QuizGateModalProps> = ({
  questions,
  isOpen,
  onPassed,
  onClose,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQ.correctIndex;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked && isCorrect) return; // Prevent changing after correct
    setSelectedAnswer(idx);
    setIsAnswerChecked(false);
  };

  const handleCheckAnswer = () => {
    setIsAnswerChecked(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onPassed();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      setShowHint(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#111827] border border-gray-800 rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl relative">
        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Unlock Challenge Gate
          </span>
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Text */}
        <h3 className="text-lg lg:text-xl font-bold text-white leading-snug">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="mt-5 space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            let optionStyle = 'bg-gray-900 border-gray-800 text-gray-200 hover:border-gray-700';

            if (isAnswerChecked) {
              if (idx === currentQ.correctIndex) {
                optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }
            } else if (isSelected) {
              optionStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-medium';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 ${optionStyle}`}
              >
                <span className="w-6 h-6 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 text-xs font-bold text-gray-300">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="pt-0.5">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback / Explanation / Hint */}
        {isAnswerChecked && (
          <div
            className={`mt-5 p-4 rounded-xl border text-xs leading-relaxed animate-fade-in ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Not quite! Try again:</span>
                </>
              )}
            </div>
            <p>{isCorrect ? currentQ.explanation : showHint ? currentQ.hint : currentQ.hint}</p>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-7 flex items-center justify-between">
          <button
            onClick={() => setShowHint(true)}
            className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1 font-medium transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Need a Hint?</span>
          </button>

          {!isAnswerChecked || !isCorrect ? (
            <button
              disabled={selectedAnswer === null}
              onClick={handleCheckAnswer}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-gray-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              <span>{isLastQuestion ? 'Unlock Build Guide 🚀' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
