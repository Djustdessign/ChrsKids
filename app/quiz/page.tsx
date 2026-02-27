'use client';

import { useProgress } from '@/lib/store';
import { quizLevels } from '@/lib/data';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const { progress, updateProgress } = useProgress();
  const router = useRouter();
  
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentLevel = quizLevels[currentLevelIndex];
  const question = currentLevel.questions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    
    if (index === question.answer) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQuestion < currentLevel.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setCompleted(true);
        // Add stars based on score
        const earnedStars = Math.ceil((score + (index === question.answer ? 1 : 0)) / currentLevel.questions.length * 3);
        updateProgress({
          totalStars: progress.totalStars + earnedStars
        });
      }
    }, 1500);
  };

  const handleNextLevel = () => {
    setCurrentLevelIndex(i => i + 1);
    setCurrentQuestion(0);
    setScore(0);
    setCompleted(false);
    setSelectedAnswer(null);
  };

  if (completed) {
    const earnedStars = Math.ceil(score / currentLevel.questions.length * 3);
    const hasNextLevel = currentLevelIndex < quizLevels.length - 1;
    
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-yellow-400">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">{currentLevel.name} Complete!</h1>
          <p className="text-neutral-600 mb-6">You got {score} out of {currentLevel.questions.length} right.</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((star, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.2, type: 'spring' }}
              >
                <Star className={`w-12 h-12 ${i < earnedStars ? 'text-yellow-400 fill-current' : 'text-neutral-200'}`} />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {hasNextLevel && (
              <button 
                onClick={handleNextLevel}
                className="w-full bg-yellow-500 text-white font-bold text-lg py-4 rounded-xl hover:bg-yellow-600 transition-colors shadow-md"
              >
                Next Level
              </button>
            )}
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setCompleted(false);
                  setSelectedAnswer(null);
                }}
                className="flex-1 bg-neutral-100 text-neutral-700 font-bold text-lg py-4 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Play Again
              </button>
              <button 
                onClick={() => router.push('/')}
                className="flex-1 bg-neutral-100 text-neutral-700 font-bold text-lg py-4 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Back to Map
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-yellow-400">
      {/* Header */}
      <header className="p-4 flex items-center justify-between text-yellow-950">
        <Link href="/" className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="font-bold bg-white/30 px-4 py-1 rounded-full">
          Question {currentQuestion + 1} of {currentLevel.questions.length}
        </div>
        <div className="flex items-center gap-1 font-bold bg-white/30 px-3 py-1 rounded-full">
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          {score}
        </div>
      </header>

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
              <h2 className="text-2xl font-bold text-neutral-800 text-center leading-relaxed">
                {question.question}
              </h2>
            </div>
            
            <div className="grid gap-3">
              {question.options.map((option, index) => {
                let btnClass = "bg-white text-neutral-700 hover:bg-neutral-50";
                
                if (selectedAnswer !== null) {
                  if (index === question.answer) {
                    btnClass = "bg-green-500 text-white border-green-600";
                  } else if (index === selectedAnswer) {
                    btnClass = "bg-red-500 text-white border-red-600";
                  } else {
                    btnClass = "bg-white opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-2xl font-bold text-lg transition-all border-b-4 ${btnClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
