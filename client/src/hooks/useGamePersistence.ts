import { useEffect, useState } from 'react';

export interface GameProgress {
  discoveredTreasures: Set<string>;
  totalScore: number;
  completedQuizzes: Set<string>;
  achievements: Set<string>;
  lastUpdated: number;
}

const STORAGE_KEY = 'treasure-hunt-v2-progress';

export const useGamePersistence = () => {
  const [progress, setProgress] = useState<GameProgress>(() => {
    // Carregar do localStorage na inicialização
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          discoveredTreasures: new Set(parsed.discoveredTreasures),
          totalScore: parsed.totalScore,
          completedQuizzes: new Set(parsed.completedQuizzes),
          achievements: new Set(parsed.achievements),
          lastUpdated: parsed.lastUpdated,
        };
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
      }
    }
    return {
      discoveredTreasures: new Set(),
      totalScore: 0,
      completedQuizzes: new Set(),
      achievements: new Set(),
      lastUpdated: Date.now(),
    };
  });

  // Salvar no localStorage sempre que o progresso mudar
  useEffect(() => {
    const toSave = {
      discoveredTreasures: Array.from(progress.discoveredTreasures),
      totalScore: progress.totalScore,
      completedQuizzes: Array.from(progress.completedQuizzes),
      achievements: Array.from(progress.achievements),
      lastUpdated: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [progress]);

  const discoverTreasure = (treasureId: string, points: number) => {
    setProgress((prev) => ({
      ...prev,
      discoveredTreasures: new Set([...prev.discoveredTreasures, treasureId]),
      totalScore: prev.totalScore + points,
    }));
  };

  const completeQuiz = (quizId: string, bonusPoints: number) => {
    setProgress((prev) => ({
      ...prev,
      completedQuizzes: new Set([...prev.completedQuizzes, quizId]),
      totalScore: prev.totalScore + bonusPoints,
    }));
  };

  const addAchievement = (achievementId: string) => {
    setProgress((prev) => ({
      ...prev,
      achievements: new Set([...prev.achievements, achievementId]),
    }));
  };

  const resetProgress = () => {
    setProgress({
      discoveredTreasures: new Set(),
      totalScore: 0,
      completedQuizzes: new Set(),
      achievements: new Set(),
      lastUpdated: Date.now(),
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    progress,
    discoverTreasure,
    completeQuiz,
    addAchievement,
    resetProgress,
  };
};
