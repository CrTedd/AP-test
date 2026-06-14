import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface FlashCardProps {
  question: string;
  answer: string;
  lecture: string;
  onAnswer?: (correct: boolean) => void;
  isQuiz?: boolean;
}

export const FlashCard: React.FC<FlashCardProps> = ({ 
  question, 
  answer, 
  lecture, 
  onAnswer,
  isQuiz 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [question]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-2xl perspective-1000">
      <div className="mb-4 text-center">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
          {lecture}
        </span>
      </div>

      <motion.div
        className={cn(
          "relative w-full min-h-[400px] cursor-pointer transition-all duration-500 preserve-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
        onClick={handleFlip}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest font-semibold">Вопрос</p>
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            {question}
          </h2>
          <div className="mt-auto pt-8 flex items-center gap-2 text-indigo-500 text-sm font-medium">
            <RotateCcw className="w-4 h-4" />
            Нажмите, чтобы увидеть ответ
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col rotate-y-180">
          <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest font-semibold text-center">Ответ</p>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
              {answer}
            </div>
          </div>
          
          {isQuiz && (
            <div className="mt-6 flex justify-center gap-4 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onAnswer?.(false)}
                className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
              >
                <XCircle className="w-5 h-5" />
                Не уверен
              </button>
              <button
                onClick={() => onAnswer?.(true)}
                className="flex items-center gap-2 px-6 py-2 bg-green-50 text-green-600 rounded-xl font-semibold hover:bg-green-100 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" />
                Знаю!
              </button>
            </div>
          )}
          
          {!isQuiz && (
             <div className="mt-6 text-center pt-4 border-t border-gray-100 text-indigo-500 text-sm font-medium">
                Нажмите, чтобы вернуться к вопросу
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
