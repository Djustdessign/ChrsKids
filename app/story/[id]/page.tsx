'use client';

import { useProgress } from '@/lib/store';
import { stories } from '@/lib/data';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { useState, use, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const story = stories.find(s => s.id === resolvedParams.id);
  const { progress, updateProgress } = useProgress();
  const router = useRouter();
  
  const [currentScene, setCurrentScene] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const readingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (readingTimeoutRef.current) {
        clearTimeout(readingTimeoutRef.current);
      }
    };
  }, []);

  if (!story) {
    return <div className="p-8 text-center">Story not found. <Link href="/" className="text-sky-500 underline">Go Home</Link></div>;
  }

  const scene = story.scenes[currentScene];
  const words = scene.text.split(' ');

  const toggleReading = () => {
    if (isReading) {
      setIsReading(false);
      setHighlightedWordIndex(-1);
      if (readingTimeoutRef.current) {
        clearTimeout(readingTimeoutRef.current);
      }
      window.speechSynthesis.cancel();
    } else {
      setIsReading(true);
      setHighlightedWordIndex(0);
      
      // Use Web Speech API for actual narration
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        
        const utterance = new SpeechSynthesisUtterance(scene.text);
        utterance.rate = 0.9; // Slightly slower for kids
        utterance.pitch = 1.1; // Slightly higher pitch
        
        // Estimate word timings since SpeechSynthesis doesn't reliably provide word boundaries on all platforms
        readNextWord(0);
        
        utterance.onend = () => {
          setIsReading(false);
          setHighlightedWordIndex(-1);
          if (readingTimeoutRef.current) {
            clearTimeout(readingTimeoutRef.current);
          }
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback to just visual highlighting if speech synthesis is not supported
        readNextWord(0);
      }
    }
  };

  const readNextWord = (index: number) => {
    if (index >= words.length) {
      return; // The onend event of utterance will handle the final cleanup
    }

    setHighlightedWordIndex(index);
    
    // Simulate reading speed (approx 300ms per word, adjust based on word length)
    // This is a rough estimation to sync with the SpeechSynthesis
    const delay = Math.max(250, words[index].length * 70);
    
    readingTimeoutRef.current = setTimeout(() => {
      if (isReading) {
        readNextWord(index + 1);
      }
    }, delay);
  };

  const handleNext = () => {
    setIsReading(false);
    setHighlightedWordIndex(-1);
    if (readingTimeoutRef.current) {
      clearTimeout(readingTimeoutRef.current);
    }
    window.speechSynthesis?.cancel();
    
    if (currentScene < story.scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      setCompleted(true);
      // Unlock next story if available
      const currentIndex = stories.findIndex(s => s.id === story.id);
      const nextStory = stories[currentIndex + 1];
      
      const newUnlocked = [...progress.unlockedStories];
      if (nextStory && !newUnlocked.includes(nextStory.id)) {
        newUnlocked.push(nextStory.id);
      }
      
      // Add stars
      updateProgress({
        unlockedStories: newUnlocked,
        totalStars: progress.totalStars + 3
      });
    }
  };

  const handlePrev = () => {
    setIsReading(false);
    setHighlightedWordIndex(-1);
    if (readingTimeoutRef.current) {
      clearTimeout(readingTimeoutRef.current);
    }
    window.speechSynthesis?.cancel();
    
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  };

  if (completed) {
    return (
      <main className={`min-h-screen flex items-center justify-center p-4 ${story.color}`}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">Great Job!</h1>
          <p className="text-neutral-600 mb-6">You finished &quot;{story.title}&quot;</p>
          
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

          <div className="bg-sky-50 rounded-2xl p-4 mb-8 text-left">
            <h3 className="font-bold text-sky-800 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Memory Verse
            </h3>
            <p className="text-sky-900 italic">&quot;{story.memoryVerse}&quot;</p>
          </div>

          <button 
            onClick={() => router.push('/')}
            className="w-full bg-sky-500 text-white font-bold text-lg py-4 rounded-xl hover:bg-sky-600 transition-colors shadow-md"
          >
            Back to Map
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col ${story.color} transition-colors duration-500`}>
      {/* Header */}
      <header className="p-4 flex items-center justify-between text-white">
        <Link href="/" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="font-bold bg-white/20 px-4 py-1 rounded-full">
          {currentScene + 1} / {story.scenes.length}
        </div>
        <button 
          onClick={toggleReading}
          className={`p-2 rounded-full transition ${isReading ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20 hover:bg-white/30'}`}
          title={isReading ? "Stop Read-Along" : "Start Read-Along"}
        >
          {isReading ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      </header>

      {/* Scene Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-lg text-center"
          >
            <div className="text-[120px] mb-8 drop-shadow-2xl">
              {scene.image}
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl text-neutral-800 text-2xl font-medium leading-relaxed flex flex-wrap justify-center gap-x-2 gap-y-1">
              {words.map((word, index) => (
                <span 
                  key={index} 
                  className={`transition-colors duration-200 ${index === highlightedWordIndex ? 'text-sky-500 bg-sky-100 px-1 rounded-md' : ''}`}
                >
                  {word}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-6 flex justify-center gap-4 max-w-lg mx-auto w-full">
        <button 
          onClick={handlePrev}
          disabled={currentScene === 0}
          className="bg-white/20 text-white p-4 rounded-2xl disabled:opacity-30 hover:bg-white/30 transition"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 bg-white text-sky-500 font-bold text-xl p-4 rounded-2xl hover:bg-neutral-50 transition shadow-lg flex items-center justify-center gap-2"
        >
          {currentScene === story.scenes.length - 1 ? 'Finish' : 'Next'}
          {currentScene !== story.scenes.length - 1 && <ArrowRight className="w-6 h-6" />}
        </button>
      </div>
    </main>
  );
}
