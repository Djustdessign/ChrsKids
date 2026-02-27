'use client';

import { useProgress } from '@/lib/store';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Star, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSound } from '@/hooks/useSound';

const ALL_ICONS = ['🕊️', '🐟', '🍞', '🌈', '🐑', '🌟', '👑', '✝️', '🍇', '🍷', '🔥', '💧'];

const LEVELS = [
  { id: 1, name: 'Level 1', pairs: 4, cols: 'grid-cols-4' },
  { id: 2, name: 'Level 2', pairs: 6, cols: 'grid-cols-4' },
  { id: 3, name: 'Level 3', pairs: 8, cols: 'grid-cols-4' },
  { id: 4, name: 'Level 4', pairs: 10, cols: 'grid-cols-5' },
  { id: 5, name: 'Level 5', pairs: 12, cols: 'grid-cols-6' },
];

type Card = {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemoryPage() {
  const { progress, updateProgress } = useProgress();
  const router = useRouter();
  const { playSound } = useSound();
  
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentLevel = LEVELS[currentLevelIndex];

  useEffect(() => {
    const initializeGame = () => {
      const levelIcons = ALL_ICONS.slice(0, currentLevel.pairs);
      const shuffledIcons = [...levelIcons, ...levelIcons]
        .sort(() => Math.random() - 0.5)
        .map((icon, index) => ({
          id: index,
          icon,
          isFlipped: false,
          isMatched: false,
        }));
      setCards(shuffledIcons);
      setFlippedIndices([]);
      setMoves(0);
      setCompleted(false);
    };

    const timer = setTimeout(() => {
      initializeGame();
    }, 0);
    return () => clearTimeout(timer);
  }, [currentLevel.pairs]);

  const handleRestart = () => {
    playSound('click');
    const levelIcons = ALL_ICONS.slice(0, currentLevel.pairs);
    const shuffledIcons = [...levelIcons, ...levelIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledIcons);
    setFlippedIndices([]);
    setMoves(0);
    setCompleted(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    playSound('click');

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves(m => m + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      if (newCards[firstIndex].icon === newCards[secondIndex].icon) {
        // Match found
        playSound('match');
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          
          if (matchedCards.every(c => c.isMatched)) {
            playSound('win');
            setCompleted(true);
            // Add stars based on moves
            let earnedStars = 3;
            if (moves > 12) earnedStars = 2;
            if (moves > 16) earnedStars = 1;
            
            updateProgress({
              totalStars: progress.totalStars + earnedStars
            });
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  if (completed) {
    let earnedStars = 3;
    if (moves > currentLevel.pairs * 1.5) earnedStars = 2;
    if (moves > currentLevel.pairs * 2) earnedStars = 1;
    
    const hasNextLevel = currentLevelIndex < LEVELS.length - 1;

    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-green-400">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl"
        >
          <div className="text-6xl mb-4">🧩</div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">{currentLevel.name} Complete!</h1>
          <p className="text-neutral-600 mb-6">You found all pairs in {moves} moves.</p>
          
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
                onClick={() => {
                  playSound('click');
                  setCurrentLevelIndex(i => i + 1);
                }}
                className="w-full bg-green-500 text-white font-bold text-lg py-4 rounded-xl hover:bg-green-600 transition-colors shadow-md"
              >
                Next Level
              </button>
            )}
            <div className="flex gap-3">
              <button 
                onClick={handleRestart}
                className="flex-1 bg-neutral-100 text-neutral-700 font-bold text-lg py-4 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Play Again
              </button>
              <button 
                onClick={() => {
                  playSound('click');
                  router.push('/');
                }}
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
    <main className="min-h-screen flex flex-col bg-green-400">
      {/* Header */}
      <header className="p-4 flex items-center justify-between text-green-950">
        <Link href="/" onClick={() => playSound('click')} className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="font-bold bg-white/30 px-4 py-1 rounded-full">
          Moves: {moves}
        </div>
        <button onClick={handleRestart} className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition">
          <RotateCcw className="w-6 h-6" />
        </button>
      </header>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className={`grid ${currentLevel.cols} gap-3 max-w-md w-full`}>
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all duration-300 ${
                card.isFlipped || card.isMatched
                  ? 'bg-white shadow-inner'
                  : 'bg-green-500 shadow-md border-b-4 border-green-600 hover:bg-green-400'
              }`}
              whileTap={{ scale: 0.95 }}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
            >
              <span className={card.isFlipped || card.isMatched ? 'rotate-y-180 block' : 'hidden'}>
                {card.icon}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  );
}
