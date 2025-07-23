interface LevelPersistenceState {
  hsk: {
    study: number;
    flashcards: number;
  };
  vietnamese: {
    study: number;
    flashcards: number;
  };
}

const LEVEL_STORAGE_KEY = 'vocabulary-level-persistence';

export class LevelPersistenceTracker {
  private static instance: LevelPersistenceTracker;

  private constructor() {}

  static getInstance(): LevelPersistenceTracker {
    if (!LevelPersistenceTracker.instance) {
      LevelPersistenceTracker.instance = new LevelPersistenceTracker();
    }
    return LevelPersistenceTracker.instance;
  }

  saveLevel(vocabularyType: 'hsk' | 'vietnamese', pageType: 'study' | 'flashcards', level: number): void {
    try {
      const levels = this.loadAllLevels();
      levels[vocabularyType][pageType] = level;
      
      localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(levels));
    } catch (error) {
      console.warn('Failed to save level persistence:', error);
    }
  }

  loadLevel(vocabularyType: 'hsk' | 'vietnamese', pageType: 'study' | 'flashcards'): number {
    try {
      const levels = this.loadAllLevels();
      return levels[vocabularyType][pageType] || this.getDefaultLevel(vocabularyType);
    } catch (error) {
      console.warn('Failed to load level persistence:', error);
      return this.getDefaultLevel(vocabularyType);
    }
  }

  private loadAllLevels(): LevelPersistenceState {
    try {
      const stored = localStorage.getItem(LEVEL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse level persistence from localStorage:', error);
    }

    return {
      hsk: {
        study: this.getDefaultLevel('hsk'),
        flashcards: this.getDefaultLevel('hsk')
      },
      vietnamese: {
        study: this.getDefaultLevel('vietnamese'),
        flashcards: this.getDefaultLevel('vietnamese')
      }
    };
  }

  private getDefaultLevel(_vocabularyType: 'hsk' | 'vietnamese'): number {
    // Start with level 1 for all vocabulary types
    return 1;
  }

  clearLevel(vocabularyType: 'hsk' | 'vietnamese', pageType?: 'study' | 'flashcards'): void {
    try {
      const levels = this.loadAllLevels();
      
      if (pageType) {
        levels[vocabularyType][pageType] = this.getDefaultLevel(vocabularyType);
      } else {
        levels[vocabularyType] = {
          study: this.getDefaultLevel(vocabularyType),
          flashcards: this.getDefaultLevel(vocabularyType)
        };
      }
      
      localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(levels));
    } catch (error) {
      console.warn('Failed to clear level persistence:', error);
    }
  }

  getAllLevels(): LevelPersistenceState {
    return this.loadAllLevels();
  }

  isValidLevel(vocabularyType: 'hsk' | 'vietnamese', level: number): boolean {
    if (vocabularyType === 'hsk') {
      return level >= 1 && level <= 7;
    } else if (vocabularyType === 'vietnamese') {
      return level >= 1 && level <= 6;
    }
    return false;
  }
}

export const levelPersistenceTracker = LevelPersistenceTracker.getInstance();