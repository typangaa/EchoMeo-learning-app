interface ReadingProgressState {
  hsk: { [level: number]: number };
  vietnamese: { [level: number]: number };
}

const STORAGE_KEY = 'vocabulary-reading-progress';

export class ReadingProgressTracker {
  private static instance: ReadingProgressTracker;

  private constructor() {}

  static getInstance(): ReadingProgressTracker {
    if (!ReadingProgressTracker.instance) {
      ReadingProgressTracker.instance = new ReadingProgressTracker();
    }
    return ReadingProgressTracker.instance;
  }

  saveProgress(vocabularyType: 'hsk' | 'vietnamese', level: number, currentIndex: number): void {
    try {
      const progress = this.loadAllProgress();
      progress[vocabularyType][level] = currentIndex;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn('Failed to save reading progress:', error);
    }
  }

  loadProgress(vocabularyType: 'hsk' | 'vietnamese', level: number): number {
    try {
      const progress = this.loadAllProgress();
      return progress[vocabularyType][level] || 0;
    } catch (error) {
      console.warn('Failed to load reading progress:', error);
      return 0;
    }
  }

  private loadAllProgress(): ReadingProgressState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse reading progress from localStorage:', error);
    }

    return {
      hsk: {},
      vietnamese: {}
    };
  }

  clearProgress(vocabularyType: 'hsk' | 'vietnamese', level?: number): void {
    try {
      const progress = this.loadAllProgress();
      
      if (level !== undefined) {
        delete progress[vocabularyType][level];
      } else {
        progress[vocabularyType] = {};
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn('Failed to clear reading progress:', error);
    }
  }

  getAllProgress(): ReadingProgressState {
    return this.loadAllProgress();
  }

  hasProgress(vocabularyType: 'hsk' | 'vietnamese', level: number): boolean {
    const progress = this.loadProgress(vocabularyType, level);
    return progress > 0;
  }
}

export const readingProgressTracker = ReadingProgressTracker.getInstance();