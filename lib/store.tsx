import { createContext, useContext, useEffect, useState } from 'react';

export type UserProgress = {
  childName: string;
  avatarId: string;
  totalStars: number;
  unlockedStories: string[];
  earnedBadges: string[];
};

const defaultProgress: UserProgress = {
  childName: 'Explorer',
  avatarId: 'lion',
  totalStars: 0,
  unlockedStories: ['creation'],
  earnedBadges: [],
};

const ProgressContext = createContext<{
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
}>({
  progress: defaultProgress,
  updateProgress: () => {},
});

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('bible_quest_progress');
      if (saved) {
        try {
          setProgress(JSON.parse(saved));
        } catch (e) {}
      }
      setLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('bible_quest_progress', JSON.stringify(next));
      return next;
    });
  };

  if (!loaded) return null;

  return (
    <ProgressContext.Provider value={{ progress, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
