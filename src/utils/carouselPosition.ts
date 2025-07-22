interface CarouselPositionState {
  hsk: { [level: number]: number };
  vietnamese: { [level: number]: number };
}

const CAROUSEL_STORAGE_KEY = 'carousel-position-progress';

export class CarouselPositionTracker {
  private static instance: CarouselPositionTracker;

  private constructor() {}

  static getInstance(): CarouselPositionTracker {
    if (!CarouselPositionTracker.instance) {
      CarouselPositionTracker.instance = new CarouselPositionTracker();
    }
    return CarouselPositionTracker.instance;
  }

  savePosition(vocabularyType: 'hsk' | 'vietnamese', level: number, scrollPosition: number): void {
    try {
      const positions = this.loadAllPositions();
      positions[vocabularyType][level] = scrollPosition;
      
      localStorage.setItem(CAROUSEL_STORAGE_KEY, JSON.stringify(positions));
    } catch (error) {
      console.warn('Failed to save carousel position:', error);
    }
  }

  loadPosition(vocabularyType: 'hsk' | 'vietnamese', level: number): number {
    try {
      const positions = this.loadAllPositions();
      return positions[vocabularyType][level] || 0;
    } catch (error) {
      console.warn('Failed to load carousel position:', error);
      return 0;
    }
  }

  private loadAllPositions(): CarouselPositionState {
    try {
      const stored = localStorage.getItem(CAROUSEL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse carousel positions from localStorage:', error);
    }

    return {
      hsk: {},
      vietnamese: {}
    };
  }

  clearPosition(vocabularyType: 'hsk' | 'vietnamese', level?: number): void {
    try {
      const positions = this.loadAllPositions();
      
      if (level !== undefined) {
        delete positions[vocabularyType][level];
      } else {
        positions[vocabularyType] = {};
      }
      
      localStorage.setItem(CAROUSEL_STORAGE_KEY, JSON.stringify(positions));
    } catch (error) {
      console.warn('Failed to clear carousel position:', error);
    }
  }
}

export const carouselPositionTracker = CarouselPositionTracker.getInstance();