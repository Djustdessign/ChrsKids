'use client';

import { useProgress } from '@/lib/store';
import { adventureLevels } from '@/lib/data';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Compass, Star, Play } from 'lucide-react';

export default function AdventureSelectPage() {
  const { progress } = useProgress();

  return (
    <main className="min-h-screen bg-orange-50 pb-12">
      {/* Header */}
      <header className="bg-orange-400 text-white p-6 rounded-b-[3rem] shadow-md mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2 font-bold text-xl">
            <Compass className="w-6 h-6" />
            Adventure Zone
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
            {progress.totalStars}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-orange-900 mb-4">
            Welcome, {progress.childName || 'Friend'}! 🗺️
          </h1>
          <p className="text-lg text-orange-800">
            Choose an adventure level and make the right choices to win stars!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adventureLevels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={`/adventure/${level.id}`}
                className={`block ${level.color} p-6 rounded-3xl shadow-lg hover:scale-105 transition-transform border-4 border-white`}
              >
                <div className="bg-white/30 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-sm">
                  {level.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">
                  {level.title}
                </h2>
                <p className="text-white/90 font-medium mb-6">
                  {level.description}
                </p>
                
                <div className="bg-white/20 rounded-xl p-3 flex items-center justify-center gap-2 text-white font-bold hover:bg-white/30 transition-colors">
                  <Play className="w-5 h-5 fill-current" />
                  Play Level
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
