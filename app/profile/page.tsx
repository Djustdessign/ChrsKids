'use client';

import { useProgress } from '@/lib/store';
import { avatars } from '@/lib/data';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Star, Save } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSound } from '@/hooks/useSound';

export default function ProfilePage() {
  const { progress, updateProgress } = useProgress();
  const router = useRouter();
  const { playSound } = useSound();
  
  const [name, setName] = useState(progress.childName);
  const [avatarId, setAvatarId] = useState(progress.avatarId);

  const handleSave = () => {
    playSound('click');
    updateProgress({
      childName: name,
      avatarId: avatarId
    });
    router.push('/');
  };

  return (
    <main className="min-h-screen flex flex-col bg-sky-400">
      {/* Header */}
      <header className="p-4 flex items-center justify-between text-white">
        <Link href="/" onClick={() => playSound('click')} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="font-bold bg-white/20 px-4 py-1 rounded-full flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-300 fill-current" />
          {progress.totalStars} Stars
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl"
        >
          <h1 className="text-2xl font-bold text-neutral-800 mb-6 text-center">Your Profile</h1>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-neutral-600 mb-2">Your Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-100 border-2 border-neutral-200 rounded-xl p-4 text-lg font-bold text-neutral-800 focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-neutral-600 mb-2">Choose Avatar</label>
            <div className="grid grid-cols-2 gap-3">
              {avatars.map(avatar => (
                <button
                  key={avatar.id}
                  onClick={() => {
                    playSound('click');
                    setAvatarId(avatar.id);
                  }}
                  className={`p-4 rounded-2xl border-4 transition-all flex flex-col items-center gap-2 ${
                    avatarId === avatar.id 
                      ? 'border-sky-500 bg-sky-50' 
                      : 'border-transparent bg-neutral-100 hover:bg-neutral-200'
                  }`}
                >
                  <span className="text-4xl">{avatar.emoji}</span>
                  <span className="font-bold text-neutral-700">{avatar.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-sky-500 text-white font-bold text-lg py-4 rounded-xl hover:bg-sky-600 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Profile
          </button>
        </motion.div>
      </div>
    </main>
  );
}
