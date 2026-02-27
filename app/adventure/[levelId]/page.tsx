'use client';

import { useProgress } from '@/lib/store';
import { adventureLevels } from '@/lib/data';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Star, Compass } from 'lucide-react';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSound } from '@/hooks/useSound';

export default function AdventureGameplayPage({ params }: { params: Promise<{ levelId: string }> }) {
  const resolvedParams = use(params);
  const levelId = resolvedParams.levelId;
  
  const { progress, updateProgress } = useProgress();
  const router = useRouter();
  const { playSound } = useSound();
  
  const level = adventureLevels.find(l => l.id === levelId);
  const adventureData = level?.data;

  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [completed, setCompleted] = useState(false);

  if (!level || !adventureData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Level not found!</h1>
          <Link href="/adventure" className="text-orange-500 underline">Back to Levels</Link>
        </div>
      </div>
    );
  }

  const currentNode = adventureData[currentNodeId];

  const handleChoice = (nextNodeId: string) => {
    playSound('click');
    setCurrentNodeId(nextNodeId);
  };

  const handleFinish = () => {
    playSound('win');
    setCompleted(true);
    updateProgress({
      totalStars: progress.totalStars + 3
    });
  };

  if (completed) {
    // Find next level if it exists
    const currentIndex = adventureLevels.findIndex(l => l.id === levelId);
    const nextLevel = adventureLevels[currentIndex + 1];

    return (
      <main className={`min-h-screen flex items-center justify-center p-4 ${level.color}`}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">Level Complete!</h1>
          <p className="text-neutral-600 mb-6">You made great choices and finished the journey.</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((star, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.2, type: 'spring' }}
              >
                <Star className="w-12 h-12 text-yellow-400 fill-current" />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {nextLevel && (
              <button 
                onClick={() => {
                  playSound('click');
                  router.push(`/adventure/${nextLevel.id}`);
                }}
                className="w-full bg-orange-500 text-white font-bold text-lg py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-md"
              >
                Play Next Level
              </button>
            )}
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  playSound('click');
                  setCurrentNodeId('start');
                  setCompleted(false);
                }}
                className="flex-1 bg-neutral-100 text-neutral-700 font-bold text-lg py-4 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Play Again
              </button>
              <button 
                onClick={() => {
                  playSound('click');
                  router.push('/adventure');
                }}
                className="flex-1 bg-neutral-100 text-neutral-700 font-bold text-lg py-4 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Levels
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col ${level.color}`}>
      {/* Header */}
      <header className="p-4 flex items-center justify-between text-white drop-shadow-md">
        <Link href="/adventure" onClick={() => playSound('click')} className="bg-black/20 p-2 rounded-full hover:bg-black/30 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="font-bold bg-black/20 px-4 py-1 rounded-full flex items-center gap-2">
          <Compass className="w-5 h-5" />
          {level.title}
        </div>
      </header>

      {/* Adventure Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            <div className="text-[120px] mb-8 drop-shadow-2xl text-center">
              {currentNode.image}
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
              <p className="text-2xl font-medium text-neutral-800 text-center leading-relaxed">
                {currentNode.text}
              </p>
            </div>
            
            <div className="grid gap-3">
              {currentNode.isEnding ? (
                <button
                  onClick={handleFinish}
                  className="bg-white text-neutral-800 p-4 rounded-2xl font-bold text-xl hover:bg-neutral-50 transition-all shadow-md border-b-4 border-neutral-200"
                >
                  Complete Level
                </button>
              ) : (
                currentNode.choices?.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(choice.nextNodeId)}
                    className="bg-white text-neutral-700 p-4 rounded-2xl font-bold text-lg hover:bg-neutral-50 transition-all shadow-sm border-b-4 border-neutral-200"
                  >
                    {choice.text}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
