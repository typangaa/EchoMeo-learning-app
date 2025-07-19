interface LessonCompletionState {
  hsk: { [level: number]: { [lesson: number]: boolean } };
  vietnamese: { [level: number]: { [lesson: number]: boolean } };
}

const LESSON_COMPLETION_STORAGE_KEY = 'flashcard-lesson-completion';

export class LessonCompletionTracker {
  private static instance: LessonCompletionTracker;

  private constructor() {}

  static getInstance(): LessonCompletionTracker {
    if (!LessonCompletionTracker.instance) {
      LessonCompletionTracker.instance = new LessonCompletionTracker();
    }
    return LessonCompletionTracker.instance;
  }

  markLessonCompleted(vocabularyType: 'hsk' | 'vietnamese', level: number, lesson: number): void {
    try {
      const completionState = this.loadCompletionState();
      
      if (!completionState[vocabularyType][level]) {
        completionState[vocabularyType][level] = {};
      }
      
      completionState[vocabularyType][level][lesson] = true;
      
      localStorage.setItem(LESSON_COMPLETION_STORAGE_KEY, JSON.stringify(completionState));
    } catch (error) {
      console.warn('Failed to save lesson completion:', error);
    }
  }

  isLessonCompleted(vocabularyType: 'hsk' | 'vietnamese', level: number, lesson: number): boolean {
    try {
      const completionState = this.loadCompletionState();
      return completionState[vocabularyType][level]?.[lesson] || false;
    } catch (error) {
      console.warn('Failed to check lesson completion:', error);
      return false;
    }
  }

  getCompletedLessons(vocabularyType: 'hsk' | 'vietnamese', level: number): number[] {
    try {
      const completionState = this.loadCompletionState();
      const levelCompletions = completionState[vocabularyType][level] || {};
      return Object.keys(levelCompletions)
        .map(Number)
        .filter(lesson => levelCompletions[lesson]);
    } catch (error) {
      console.warn('Failed to get completed lessons:', error);
      return [];
    }
  }

  getLevelProgress(vocabularyType: 'hsk' | 'vietnamese', level: number, totalLessons: number): { completed: number; total: number; percentage: number } {
    const completedLessons = this.getCompletedLessons(vocabularyType, level);
    const completed = completedLessons.length;
    const percentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    
    return {
      completed,
      total: totalLessons,
      percentage
    };
  }

  clearLessonCompletion(vocabularyType: 'hsk' | 'vietnamese', level?: number, lesson?: number): void {
    try {
      const completionState = this.loadCompletionState();
      
      if (level !== undefined && lesson !== undefined) {
        // Clear specific lesson
        if (completionState[vocabularyType][level]) {
          delete completionState[vocabularyType][level][lesson];
        }
      } else if (level !== undefined) {
        // Clear entire level
        delete completionState[vocabularyType][level];
      } else {
        // Clear all completions for vocabulary type
        completionState[vocabularyType] = {};
      }
      
      localStorage.setItem(LESSON_COMPLETION_STORAGE_KEY, JSON.stringify(completionState));
    } catch (error) {
      console.warn('Failed to clear lesson completion:', error);
    }
  }

  private loadCompletionState(): LessonCompletionState {
    try {
      const stored = localStorage.getItem(LESSON_COMPLETION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse lesson completion from localStorage:', error);
    }

    return {
      hsk: {},
      vietnamese: {}
    };
  }

  getAllCompletionData(): LessonCompletionState {
    return this.loadCompletionState();
  }

  getOverallProgress(vocabularyType: 'hsk' | 'vietnamese'): { totalCompleted: number; totalLevels: number } {
    try {
      const completionState = this.loadCompletionState();
      const typeCompletions = completionState[vocabularyType];
      
      let totalCompleted = 0;
      const levels = Object.keys(typeCompletions);
      
      levels.forEach(level => {
        const levelCompletions = typeCompletions[parseInt(level)] || {};
        totalCompleted += Object.values(levelCompletions).filter(Boolean).length;
      });
      
      return {
        totalCompleted,
        totalLevels: levels.length
      };
    } catch (error) {
      console.warn('Failed to get overall progress:', error);
      return { totalCompleted: 0, totalLevels: 0 };
    }
  }
}

export const lessonCompletionTracker = LessonCompletionTracker.getInstance();