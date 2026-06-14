import React, { useState, useEffect } from 'react';
import { Check, X, GripVertical } from 'lucide-react';
import { cn } from '../utils/cn';
import { Question } from '../data';

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [matchingPairs, setMatchingPairs] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; msg?: string } | null>(null);

  useEffect(() => {
    setSelectedIndices([]);
    setMatchingPairs({});
    setIsSubmitted(false);
    setFeedback(null);
  }, [question]);

  const handleSingleSubmit = (index: number) => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const correct = index === question.correctAnswer;
    setFeedback({ correct });
    setTimeout(() => onAnswer(correct), 1500);
  };

  const handleMultipleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const correctAnswers = question.correctAnswer as number[];
    const isCorrect = 
      selectedIndices.length === correctAnswers.length && 
      selectedIndices.every(idx => correctAnswers.includes(idx));
    
    setFeedback({ correct: isCorrect });
    setTimeout(() => onAnswer(isCorrect), 1500);
  };

  const handleMatchingChange = (pairId: string, value: string) => {
    setMatchingPairs(prev => ({ ...prev, [pairId]: value }));
  };

  const handleMatchingSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const isCorrect = question.pairs?.every(pair => matchingPairs[pair.id] === pair.right);
    setFeedback({ correct: !!isCorrect });
    setTimeout(() => onAnswer(!!isCorrect), 2000);
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
      <div className="mb-6 flex justify-between items-center">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
          {question.lecture}
        </span>
        <span className="text-xs font-medium text-gray-400">
          {question.type === 'single' && 'Выберите один ответ'}
          {question.type === 'multiple' && 'Выберите несколько ответов'}
          {question.type === 'matching' && 'Установите соответствие'}
        </span>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-tight">
        {question.question}
      </h2>

      <div className="space-y-3">
        {/* Single Choice */}
        {question.type === 'single' && question.options?.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSingleSubmit(idx)}
            disabled={isSubmitted}
            className={cn(
              "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
              isSubmitted 
                ? idx === question.correctAnswer
                  ? "border-green-500 bg-green-50"
                  : "border-gray-100 opacity-50"
                : "border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50"
            )}
          >
            <span className="font-medium text-gray-700">{option}</span>
            {isSubmitted && idx === question.correctAnswer && <Check className="text-green-500 w-5 h-5" />}
          </button>
        ))}

        {/* Multiple Choice */}
        {question.type === 'multiple' && (
          <>
            {question.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (isSubmitted) return;
                  setSelectedIndices(prev => 
                    prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                  );
                }}
                disabled={isSubmitted}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4",
                  isSubmitted
                    ? (question.correctAnswer as number[]).includes(idx)
                      ? "border-green-500 bg-green-50"
                      : selectedIndices.includes(idx) ? "border-red-500 bg-red-50" : "border-gray-100 opacity-50"
                    : selectedIndices.includes(idx)
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-100 hover:border-indigo-200"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border flex items-center justify-center shrink-0",
                  selectedIndices.includes(idx) ? "bg-indigo-600 border-indigo-600" : "border-gray-300"
                )}>
                  {selectedIndices.includes(idx) && <Check className="text-white w-4 h-4" />}
                </div>
                <span className="font-medium text-gray-700">{option}</span>
              </button>
            ))}
            <button
              onClick={handleMultipleSubmit}
              disabled={isSubmitted || selectedIndices.length === 0}
              className="mt-6 w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
            >
              Ответить
            </button>
          </>
        )}

        {/* Matching */}
        {question.type === 'matching' && (
          <div className="space-y-4">
            {question.pairs?.map((pair) => (
              <div key={pair.id} className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-1/3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  {pair.left}
                </div>
                <div className="hidden md:block text-gray-400">→</div>
                <select
                  value={matchingPairs[pair.id] || ""}
                  onChange={(e) => handleMatchingChange(pair.id, e.target.value)}
                  disabled={isSubmitted}
                  className={cn(
                    "w-full md:flex-1 p-3 rounded-lg border-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500",
                    isSubmitted
                      ? matchingPairs[pair.id] === pair.right
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-gray-200"
                  )}
                >
                  <option value="">Выберите соответствие...</option>
                  {question.pairs?.map(p => (
                    <option key={p.id} value={p.right}>{p.right}</option>
                  ))}
                </select>
              </div>
            ))}
             <button
              onClick={handleMatchingSubmit}
              disabled={isSubmitted || Object.keys(matchingPairs).length < (question.pairs?.length || 0)}
              className="mt-6 w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
            >
              Проверить соответствие
            </button>
          </div>
        )}
      </div>

      {/* Feedback Overlay */}
      {feedback && (
        <div className={cn(
          "mt-8 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2",
          feedback.correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {feedback.correct ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
          <span className="font-bold">
            {feedback.correct ? "Правильно!" : "Ошибка. Посмотрите правильные ответы выше."}
          </span>
        </div>
      )}
    </div>
  );
};
