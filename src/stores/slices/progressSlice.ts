// Progress store slice - handles spaced repetition and user progress tracking
import { StateCreator } from 'zustand';
import { ProgressStore } from '../types';
import { createActionTypes, createActionSet } from '../middleware/devtools';

// Action types for DevTools
const actionTypes = createActionTypes('PROGRESS');

// Spaced repetition intervals (in days)
const INTERVALS = [1, 3, 7, 14, 30, 90];

// Helper function to calculate next review date
const calculateNextReview = (level: number, easeFactor: number): Date => {
  const baseInterval = INTERVALS[Math.min(level, INTERVALS.length - 1)];
  const adjustedInterval = Math.round(baseInterval * easeFactor);
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + adjustedInterval);
  return nextReview;
};

// Helper function to adjust ease factor
const adjustEaseFactor = (currentFactor: number, success: boolean): number => {
  if (success) {
    return Math.min(2.5, currentFactor + 0.1);
  } else {
    return Math.max(1.3, currentFactor - 0.2);
  }
};

// Progress store slice
export const createProgressSlice: StateCreator<ProgressStore> = (set, get) => {
  // Enhanced set with action types for better debugging
  const actionSet = createActionSet(set, actionTypes);

  return {
    // Initial state
    spacedRepetition: new Map(),
    
    userProgress: {
      totalStudyTime: 0,
      dailyStreak: 0,
      lastStudyDate: '',
      levelProgress: new Map(),
      weakAreas: [],
      totalWordsLearned: 0,
      averageAccuracy: 0
    },
    
    currentSession: {
      startTime: null,
      itemsStudied: 0,
      correctAnswers: 0,
      sessionType: 'flashcard',
      duration: 0
    },

    // Spaced repetition actions
    updateSpacedRepetition: (itemId, success) => {
      const currentData = get().spacedRepetition;
      const existingData = currentData.get(itemId);
      const now = new Date();
      
      let newData;
      if (existingData) {
        // Update existing item
        const newLevel = success ? Math.min(existingData.level + 1, INTERVALS.length - 1) : 0;
        const newEaseFactor = adjustEaseFactor(existingData.easeFactor, success);
        const nextReview = calculateNextReview(newLevel, newEaseFactor);
        
        newData = {
          ...existingData,
          level: newLevel,
          nextReview,
          lastReviewed: now,
          correctCount: success ? existingData.correctCount + 1 : existingData.correctCount,
          incorrectCount: success ? existingData.incorrectCount : existingData.incorrectCount + 1,
          easeFactor: newEaseFactor
        };
      } else {
        // Create new item
        const initialEaseFactor = 2.5;
        const nextReview = calculateNextReview(0, initialEaseFactor);
        
        newData = {
          itemId,
          level: success ? 1 : 0,
          nextReview,
          lastReviewed: now,
          correctCount: success ? 1 : 0,
          incorrectCount: success ? 0 : 1,
          easeFactor: initialEaseFactor
        };
      }
      
      const newMap = new Map(currentData);
      newMap.set(itemId, newData);
      
      actionSet({
        spacedRepetition: newMap
      }, false, actionTypes.custom('UPDATE_SPACED_REPETITION'));
      
      // Update user progress
      const progress = get().userProgress;
      
      actionSet({
        userProgress: {
          ...progress,
          totalWordsLearned: newMap.size,
          averageAccuracy: Array.from(newMap.values()).reduce((acc, item) => {
            const itemAccuracy = (item.correctCount / (item.correctCount + item.incorrectCount)) * 100;
            return acc + itemAccuracy;
          }, 0) / newMap.size
        }
      }, false, actionTypes.custom('UPDATE_USER_PROGRESS'));
    },

    // Study session management
    startStudySession: (type) => {
      const now = new Date();
      actionSet({
        currentSession: {
          startTime: now,
          itemsStudied: 0,
          correctAnswers: 0,
          sessionType: type,
          duration: 0
        }
      }, false, actionTypes.custom('START_STUDY_SESSION'));
    },

    endStudySession: () => {
      const session = get().currentSession;
      if (!session.startTime) return;
      
      const now = new Date();
      const duration = Math.round((now.getTime() - session.startTime.getTime()) / 60000); // minutes
      
      const progress = get().userProgress;
      const today = now.toISOString().split('T')[0];
      const lastStudyDate = progress.lastStudyDate;
      
      // Calculate streak
      let newStreak = progress.dailyStreak;
      if (lastStudyDate !== today) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastStudyDate === yesterdayStr) {
          // Consecutive day
          newStreak += 1;
        } else if (lastStudyDate !== today) {
          // Streak broken
          newStreak = 1;
        }
      }
      
      actionSet({
        currentSession: {
          ...session,
          duration
        },
        userProgress: {
          ...progress,
          totalStudyTime: progress.totalStudyTime + duration,
          dailyStreak: newStreak,
          lastStudyDate: today
        }
      }, false, actionTypes.custom('END_STUDY_SESSION'));
    },

    recordAnswer: (correct) => {
      const session = get().currentSession;
      actionSet({
        currentSession: {
          ...session,
          itemsStudied: session.itemsStudied + 1,
          correctAnswers: correct ? session.correctAnswers + 1 : session.correctAnswers
        }
      }, false, actionTypes.custom('RECORD_ANSWER'));
    },

    // User progress sync (placeholder for future user authentication)
    syncProgress: async () => {
      // This would sync progress to a backend when user authentication is implemented
      console.log('Progress sync would happen here with user authentication');
      
      actionSet({}, false, actionTypes.custom('SYNC_PROGRESS'));
    },

    // Computed selectors
    getDueItems: () => {
      const now = new Date();
      const dueItems: number[] = [];
      
      get().spacedRepetition.forEach((data, itemId) => {
        if (data.nextReview <= now) {
          dueItems.push(itemId);
        }
      });
      
      return dueItems;
    },

    getStudyStats: () => {
      const progress = get().userProgress;
      const session = get().currentSession;
      
      const sessionAccuracy = session.itemsStudied > 0 
        ? (session.correctAnswers / session.itemsStudied) * 100 
        : 0;
      
      return {
        accuracy: sessionAccuracy,
        streak: progress.dailyStreak,
        totalTime: progress.totalStudyTime
      };
    }
  };
};