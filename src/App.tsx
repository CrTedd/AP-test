import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  ListFilter,
  RefreshCw,
  Award,
  BookOpen
} from 'lucide-react';
import { examQuizData, Question } from './data';
import { QuestionCard } from './components/QuestionCard';

function App() {
  const [selectedLecture, setSelectedLecture] = useState<string>('Все лекции');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledCards, setShuffledCards] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  const lectures = useMemo(() => {
    const unique = Array.from(new Set(examQuizData.map(q => q.lecture)));
    return ['Все лекции', ...unique];
  }, []);

  const filteredCards = useMemo(() => {
    if (selectedLecture === 'Все лекции') return examQuizData;
    return examQuizData.filter(q => q.lecture === selectedLecture);
  }, [selectedLecture]);

  const initQuiz = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnsweredCount(0);
    setIsFinished(false);
  };

  useEffect(() => {
    initQuiz();
  }, [selectedLecture, filteredCards]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(prev => prev + 1);
    setAnsweredCount(prev => prev + 1);
    
    setTimeout(() => {
      if (currentIndex < shuffledCards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 500);
  };

  const restart = () => {
    initQuiz();
  };

  if (shuffledCards.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Архитектура предприятия <span className="text-indigo-600">Тест</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100">
                <Award className="w-4 h-4" />
                <span>{score} / {shuffledCards.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Progress Bar */}
        {!isFinished && (
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Прогресс</span>
              <span className="text-sm font-bold text-indigo-600">{currentIndex + 1} из {shuffledCards.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / shuffledCards.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Filters */}
        {!isFinished && (
          <div className="mb-8 max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <ListFilter className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold text-sm">Тема:</span>
              <select 
                value={selectedLecture}
                onChange={(e) => setSelectedLecture(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm"
              >
                {lectures.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={restart}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors group"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Начать сначала
            </button>
          </div>
        )}

        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            {isFinished ? (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="text-center bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-md w-full"
              >
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Trophy className="w-12 h-12 text-yellow-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Тест завершен!</h2>
                <div className="text-5xl font-black text-indigo-600 my-6">
                  {Math.round((score / shuffledCards.length) * 100)}%
                </div>
                <p className="text-gray-500 mb-8 font-medium">
                  Ваш результат: <span className="text-gray-900 font-bold">{score}</span> из <span className="text-gray-900 font-bold">{shuffledCards.length}</span> правильных ответов.
                </p>
                <button
                  onClick={restart}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-200"
                >
                  Попробовать еще раз
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={shuffledCards[currentIndex].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, type: "spring", damping: 25 }}
                className="w-full flex flex-col items-center"
              >
                <QuestionCard 
                  question={shuffledCards[currentIndex]}
                  onAnswer={handleAnswer}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest border-t border-gray-100">
        Экзамен по «Архитектуре предприятия» • 2024
      </footer>
    </div>
  );
}

export default App;
