import { VocabularyItem, ReadingPassage } from '../types';

// Interface for user progress data
export interface UserProgress {
  // Vocabulary tracking
  vocabularyProgress: {
    [id: number]: {
      timesReviewed: number;
      lastReviewDate: string;
      mastery: number; // 0-100%
    };
  };
  
  // Reading tracking
  readingProgress: {
    [id: string]: {
      timesRead: number;
      lastReadDate: string;
      quizScores: number[]; // Array of quiz scores in percent
      completionPercent: number; // 0-100%
    };
  };
  
  // Overall statistics
  statistics: {
    totalVocabularyMastered: number;
    totalReadingCompleted: number;
    lastLoginDate: string;
    streakDays: number;
    totalStudyTime: number; // in minutes
  };
}

// Initialize empty progress data
export const initializeProgressData = (): UserProgress => {
  return {
    vocabularyProgress: {},
    readingProgress: {},
    statistics: {
      totalVocabularyMastered: 0,
      totalReadingCompleted: 0,
      lastLoginDate: new Date().toISOString(),
      streakDays: 0,
      totalStudyTime: 0
    }
  };
};

// Load progress from localStorage
export const loadProgress = (): UserProgress => {
  const storedProgress = localStorage.getItem('user_progress');
  
  if (storedProgress) {
    return JSON.parse(storedProgress);
  }
  
  return initializeProgressData();
};

// Save progress to localStorage
export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem('user_progress', JSON.stringify(progress));
};

// Update vocabulary item progress
export const updateVocabularyProgress = (
  itemId: number, 
  wasCorrect: boolean
): void => {
  const progress = loadProgress();
  
  if (!progress.vocabularyProgress[itemId]) {
    progress.vocabularyProgress[itemId] = {
      timesReviewed: 0,
      lastReviewDate: '',
      mastery: 0
    };
  }
  
  const itemProgress = progress.vocabularyProgress[itemId];
  itemProgress.timesReviewed += 1;
  itemProgress.lastReviewDate = new Date().toISOString();
  
  // Update mastery level (simple algorithm - can be improved)
  if (wasCorrect) {
    itemProgress.mastery = Math.min(100, itemProgress.mastery + 10);
  } else {
    itemProgress.mastery = Math.max(0, itemProgress.mastery - 5);
  }
  
  // Update total vocabulary mastered statistic
  progress.statistics.totalVocabularyMastered = Object.values(progress.vocabularyProgress)
    .filter(item => item.mastery >= 80)
    .length;
  
  saveProgress(progress);
};

// Update reading passage progress
export const updateReadingProgress = (
  passageId: string, 
  completionPercent: number,
  quizScore?: number
): void => {
  const progress = loadProgress();
  
  if (!progress.readingProgress[passageId]) {
    progress.readingProgress[passageId] = {
      timesRead: 0,
      lastReadDate: '',
      quizScores: [],
      completionPercent: 0
    };
  }
  
  const passageProgress = progress.readingProgress[passageId];
  passageProgress.timesRead += 1;
  passageProgress.lastReadDate = new Date().toISOString();
  passageProgress.completionPercent = Math.max(passageProgress.completionPercent, completionPercent);
  
  if (quizScore !== undefined) {
    passageProgress.quizScores.push(quizScore);
  }
  
  // Update total reading completed statistic
  progress.statistics.totalReadingCompleted = Object.values(progress.readingProgress)
    .filter(item => item.completionPercent === 100)
    .length;
  
  saveProgress(progress);
};

// Update login streak
export const updateLoginStreak = (): void => {
  const progress = loadProgress();
  const today = new Date();
  const lastLogin = new Date(progress.statistics.lastLoginDate);
  
  // Reset time part for date comparison
  today.setHours(0, 0, 0, 0);
  lastLogin.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = Math.abs(today.getTime() - lastLogin.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Update streak based on login pattern
  if (diffDays === 1) {
    // Consecutive day login
    progress.statistics.streakDays += 1;
  } else if (diffDays > 1) {
    // Streak broken
    progress.statistics.streakDays = 1;
  }
  // If diffDays === 0, it's the same day, so don't update streak
  
  progress.statistics.lastLoginDate = today.toISOString();
  
  saveProgress(progress);
};

// Update study time
export const updateStudyTime = (minutes: number): void => {
  const progress = loadProgress();
  progress.statistics.totalStudyTime += minutes;
  saveProgress(progress);
};

// Get vocabulary mastery level
export const getVocabularyMastery = (itemId: number): number => {
  const progress = loadProgress();
  return progress.vocabularyProgress[itemId]?.mastery || 0;
};

// Get reading completion percentage
export const getReadingCompletion = (passageId: string): number => {
  const progress = loadProgress();
  return progress.readingProgress[passageId]?.completionPercent || 0;
};

// Get user statistics
export const getUserStatistics = () => {
  const progress = loadProgress();
  return progress.statistics;
};

// Reset all user progress (for testing)
export const resetProgress = (): void => {
  localStorage.removeItem('user_progress');
};
