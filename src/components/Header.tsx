import React from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';

interface HeaderProps {
  score: number;
  total: number;
  mode: 'study' | 'quiz';
  setMode: (mode: 'study' | 'quiz') => void;
}

export const Header: React.FC<HeaderProps> = ({ score, total, mode, setMode }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              Архитектура предприятия
            </h1>
            <h1 className="text-xl font-bold text-gray-900 sm:hidden">
              АП Тест
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setMode('study')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  mode === 'study' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Изучение
              </button>
              <button
                onClick={() => setMode('quiz')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  mode === 'quiz' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Тест
              </button>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
              <HelpCircle className="w-4 h-4" />
              <span>{score}/{total}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
