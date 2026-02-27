'use client';

import { useProgress } from '@/lib/store';
import { avatars, dailyVerses, stories } from '@/lib/data';
import { motion } from 'motion/react';
import Link from 'next/link';
import { BookOpen, Star, Gamepad2, Brain, Trophy, Compass, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSound } from '@/hooks/useSound';

const getLevelInfo = (stars: number) => {
  const levels = [
    { threshold: 0, title: 'Beginner Explorer', max: 10 },
    { threshold: 10, title: 'Bible Adventurer', max: 25 },
    { threshold: 25, title: 'Story Master', max: 50 },
    { threshold: 50, title: 'Faith Hero', max: 100 },
    { threshold: 100, title: 'Bible Champion', max: 999 },
  ];
  
  const currentLevelIndex = levels.findLastIndex(l => stars >= l.threshold);
  const index = currentLevelIndex >= 0 ? currentLevelIndex : 0;
  const currentLevel = levels[index];
  const nextLevel = levels[index + 1] || currentLevel;
  
  const progressToNext = currentLevel === nextLevel 
    ? 100 
    : ((stars - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100;

  return {
    levelNum: index + 1,
    title: currentLevel.title,
    progress: progressToNext,
    nextThreshold: nextLevel.threshold,
    starsNeeded: nextLevel.threshold - stars
  };
};

export default function Home() {
  const { progress } = useProgress();
  const [dailyVerse, setDailyVerse] = useState('');
  const { playSound } = useSound();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDailyVerse(dailyVerses[Math.floor(Math.random() * dailyVerses.length)]);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const currentAvatar = avatars.find(a => a.id === progress.avatarId) || avatars[0];
  const levelInfo = getLevelInfo(progress.totalStars);

  return (
    <main className="min-h-screen pb-20 bg-sky-50">
      {/* Header */}
      <header className="bg-sky-400 text-white p-6 rounded-b-3xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="flex justify-between items-start max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-4">
            <div className="text-5xl bg-white/20 p-3 rounded-full shadow-inner">
              {currentAvatar.emoji}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome, {progress.childName}! 👋</h1>
              <div className="flex items-center gap-2 text-yellow-300 font-bold text-lg">
                <Star className="w-5 h-5 fill-current" />
                <span>{progress.totalStars} Stars</span>
                <span className="text-white/60 text-sm font-normal">•</span>
                <span className="text-white font-medium">Level {levelInfo.levelNum}: {levelInfo.title}</span>
              </div>
            </div>
          </div>
          <Link href="/profile" onClick={() => playSound('click')} className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition shadow-sm">
            <Trophy className="w-6 h-6" />
          </Link>
        </div>
        
        {/* Level Progress Bar */}
        <div className="max-w-4xl mx-auto mt-6 relative z-10">
          <div className="flex justify-between text-sm font-medium mb-2 text-sky-100">
            <span>Level {levelInfo.levelNum}</span>
            {levelInfo.starsNeeded > 0 ? (
              <span>{levelInfo.starsNeeded} stars to Level {levelInfo.levelNum + 1}</span>
            ) : (
              <span>Max Level!</span>
            )}
          </div>
          <div className="h-4 bg-black/10 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full"
            />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        {/* Daily Verse */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border-2 border-sky-100 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 text-sky-50 opacity-50">
            <BookOpen className="w-32 h-32" />
          </div>
          <h2 className="text-sky-500 font-bold mb-3 flex items-center gap-2 text-xl relative z-10">
            <BookOpen className="w-6 h-6" />
            Verse of the Day
          </h2>
          <p className="text-xl text-neutral-700 italic font-medium relative z-10 leading-relaxed">&quot;{dailyVerse}&quot;</p>
        </motion.section>

        {/* Story Map */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-neutral-800">Story Adventure</h2>
            <span className="bg-sky-100 text-sky-600 text-xs font-bold px-2 py-1 rounded-full">Levels</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => {
              const isUnlocked = progress.unlockedStories.includes(story.id);
              return (
                <Link 
                  key={story.id} 
                  href={isUnlocked ? `/story/${story.id}` : '#'}
                  onClick={() => isUnlocked && playSound('click')}
                  className={`block relative p-6 rounded-3xl border-2 transition-all duration-300 ${
                    isUnlocked 
                      ? `${story.color} border-transparent text-white shadow-md hover:scale-[1.03] hover:shadow-xl` 
                      : 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <div className="absolute top-4 right-4 font-bold opacity-50 text-xl">
                    #{index + 1}
                  </div>
                  <div className="text-5xl mb-4 drop-shadow-md">{story.scenes[0].image}</div>
                  <h3 className="text-xl font-bold mb-1">{story.title}</h3>
                  <p className="text-sm opacity-90 font-medium">{story.reference}</p>
                  
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-3xl backdrop-blur-[2px]">
                      <div className="bg-white text-neutral-600 px-4 py-2 rounded-full font-bold shadow-sm flex items-center gap-2">
                        🔒 Locked
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Mini Games */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-neutral-800">Mini Games</h2>
            <span className="bg-sky-100 text-sky-600 text-xs font-bold px-2 py-1 rounded-full">Earn Stars!</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link 
              href="/quiz"
              onClick={() => playSound('click')}
              className="bg-yellow-400 text-yellow-950 p-6 rounded-3xl shadow-md border-b-4 border-yellow-500 hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col items-center text-center gap-3"
            >
              <div className="bg-white/30 p-5 rounded-full mb-2">
                <Brain className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Bible Trivia</h3>
                <p className="opacity-90 font-medium">Test your knowledge!</p>
              </div>
            </Link>

            <Link 
              href="/memory"
              onClick={() => playSound('click')}
              className="bg-green-400 text-green-950 p-6 rounded-3xl shadow-md border-b-4 border-green-500 hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col items-center text-center gap-3"
            >
              <div className="bg-white/30 p-5 rounded-full mb-2">
                <Gamepad2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Memory Match</h3>
                <p className="opacity-90 font-medium">Find the matching pairs</p>
              </div>
            </Link>

            <Link 
              href="/adventure"
              onClick={() => playSound('click')}
              className="bg-orange-400 text-orange-950 p-6 rounded-3xl shadow-md border-b-4 border-orange-500 hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col items-center text-center gap-3 sm:col-span-2 lg:col-span-1"
            >
              <div className="bg-white/30 p-5 rounded-full mb-2">
                <Compass className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Story Adventure</h3>
                <p className="opacity-90 font-medium">Choose your path!</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

