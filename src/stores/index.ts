// Main store configuration and exports
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AppStore, UIStore, AudioStore, VocabularyStore, ProgressStore } from './types';
import { createAppSlice } from './slices/appSlice';
import { createUISlice } from './slices/uiSlice';
import { createAudioSlice } from './slices/audioSlice';
import { createVocabularySlice } from './slices/vocabularySlice';
import { createProgressSlice } from './slices/progressSlice';
import { createPersistMiddleware, persistConfigs } from './middleware/persistence';
import { createDevToolsMiddleware, combineMiddleware, createLoggerMiddleware } from './middleware/devtools';

// Development environment check
const isDevelopment = process.env.NODE_ENV === 'development';

// Create separate stores for each slice
export const useAppStore = create<AppStore>()(
  subscribeWithSelector(
    combineMiddleware(
      createDevToolsMiddleware({
        name: 'Vietnamese-Chinese App Store',
        enabled: isDevelopment
      }),
      createLoggerMiddleware({
        enabled: isDevelopment && false, // Disable logger by default, enable for debugging
        collapsed: true
      }),
      createPersistMiddleware(persistConfigs.app)
    )(createAppSlice)
  )
);

export const useUIStore = create<UIStore>()(
  subscribeWithSelector(
    combineMiddleware(
      createDevToolsMiddleware({
        name: 'Vietnamese-Chinese UI Store',
        enabled: isDevelopment
      }),
      createLoggerMiddleware({
        enabled: isDevelopment && false,
        collapsed: true
      }),
      createPersistMiddleware(persistConfigs.ui)
    )(createUISlice)
  )
);

export const useAudioStore = create<AudioStore>()(
  subscribeWithSelector(
    combineMiddleware(
      createDevToolsMiddleware({
        name: 'Vietnamese-Chinese Audio Store',
        enabled: isDevelopment
      }),
      createLoggerMiddleware({
        enabled: isDevelopment && false,
        collapsed: true
      }),
      createPersistMiddleware(persistConfigs.audio)
    )(createAudioSlice)
  )
);

export const useVocabularyStore = create<VocabularyStore>()(
  subscribeWithSelector(
    combineMiddleware(
      createDevToolsMiddleware({
        name: 'Vietnamese-Chinese Vocabulary Store',
        enabled: isDevelopment
      }),
      createLoggerMiddleware({
        enabled: isDevelopment && false,
        collapsed: true
      }),
      createPersistMiddleware(persistConfigs.vocabulary)
    )(createVocabularySlice)
  )
);

export const useProgressStore = create<ProgressStore>()(
  subscribeWithSelector(
    combineMiddleware(
      createDevToolsMiddleware({
        name: 'Vietnamese-Chinese Progress Store',
        enabled: isDevelopment
      }),
      createLoggerMiddleware({
        enabled: isDevelopment && false,
        collapsed: true
      }),
      createPersistMiddleware(persistConfigs.progress)
    )(createProgressSlice)
  )
);

// =============================================================================
// APP STORE HOOKS
// =============================================================================

export const useTheme = () => useAppStore((state) => state.theme);
export const useLanguage = () => useAppStore((state) => state.language);
export const useOnlineStatus = () => useAppStore((state) => state.isOnline);
export const useAppInitialized = () => useAppStore((state) => state.initialized);

// Theme actions
export const useThemeActions = () => useAppStore((state) => ({
  setTheme: state.setTheme,
  setLanguage: state.setLanguage
}));

// Individual stable action hooks to prevent object recreation
export const useSetLanguage = () => useAppStore((state) => state.setLanguage);

// App lifecycle actions
export const useAppActions = () => useAppStore((state) => ({
  setOnlineStatus: state.setOnlineStatus,
  initializeApp: state.initializeApp
}));

// =============================================================================
// UI STORE HOOKS
// =============================================================================

export const useCurrentPage = () => useUIStore((state) => state.currentPage);
export const useNavigationHistory = () => useUIStore((state) => state.navigationHistory);
export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const usePopover = () => useUIStore((state) => state.popover);
export const useLayoutMode = () => useUIStore((state) => state.layoutMode);
export const useSidebarCollapsed = () => useUIStore((state) => state.sidebarCollapsed);

// Navigation actions
export const useNavigationActions = () => useUIStore((state) => ({
  setCurrentPage: state.setCurrentPage,
  navigateBack: state.navigateBack
}));

// Modal actions
export const useModalActions = () => useUIStore((state) => ({
  openModal: state.openModal,
  closeModal: state.closeModal
}));

// Popover actions
export const usePopoverActions = () => useUIStore((state) => ({
  setPopover: state.setPopover,
  closePopover: state.closePopover
}));

// Layout actions
export const useLayoutActions = () => useUIStore((state) => ({
  setLayoutMode: state.setLayoutMode,
  toggleSidebar: state.toggleSidebar
}));

// =============================================================================
// AUDIO STORE HOOKS
// =============================================================================

export const useIsPlaying = () => useAudioStore((state) => state.isPlaying);
export const useCurrentAudio = () => useAudioStore((state) => state.currentAudio);
export const useAutoplay = () => useAudioStore((state) => state.autoplay);
export const usePlaybackRate = () => useAudioStore((state) => state.playbackRate);
export const useVolume = () => useAudioStore((state) => state.volume);
export const usePitch = () => useAudioStore((state) => state.pitch);
export const usePreferredVietnameseVoice = () => useAudioStore((state) => state.preferredVietnameseVoice);
export const usePreferredChineseVoice = () => useAudioStore((state) => state.preferredChineseVoice);
export const useAudioQueue = () => useAudioStore((state) => state.queue);
export const useQueueIndex = () => useAudioStore((state) => state.queueIndex);

// Audio playback actions
export const useAudioPlayback = () => useAudioStore((state) => ({
  play: state.play,
  pause: state.pause,
  stop: state.stop
}));

// Audio settings actions
export const useAudioSettings = () => useAudioStore((state) => ({
  setAutoplay: state.setAutoplay,
  setPlaybackRate: state.setPlaybackRate,
  setVolume: state.setVolume,
  setPitch: state.setPitch,
  setPreferredVoice: state.setPreferredVoice,
  initializeAudioSettings: state.initializeAudioSettings
}));

// Audio queue actions
export const useAudioQueueActions = () => useAudioStore((state) => ({
  addToQueue: state.addToQueue,
  clearQueue: state.clearQueue,
  nextInQueue: state.nextInQueue,
  previousInQueue: state.previousInQueue
}));

// Passage playback hooks
export const useIsPassagePlaying = () => useAudioStore((state) => state.isPassagePlaying);
export const useCurrentPassageId = () => useAudioStore((state) => state.currentPassageId);
export const useCurrentParagraphIndex = () => useAudioStore((state) => state.currentParagraphIndex);
export const usePassageLanguage = () => useAudioStore((state) => state.passageLanguage);
export const usePlayPassage = () => useAudioStore((state) => state.playPassage);
export const useStopPassage = () => useAudioStore((state) => state.stopPassage);
export const usePausePassage = () => useAudioStore((state) => state.pausePassage);

export const usePassagePlayback = () => useAudioStore((state) => ({
  playPassage: state.playPassage,
  stopPassage: state.stopPassage,
  pausePassage: state.pausePassage
}));

// Individual audio hooks
export const useIsIndividualPlaying = () => useAudioStore((state) => state.isIndividualPlaying);
export const useCurrentIndividualText = () => useAudioStore((state) => state.currentIndividualText);
export const usePlayIndividual = () => useAudioStore((state) => state.playIndividual);
export const useStopIndividual = () => useAudioStore((state) => state.stopIndividual);

export const useIndividualAudio = () => useAudioStore((state) => ({
  playIndividual: state.playIndividual,
  stopIndividual: state.stopIndividual
}));

// General audio hooks
export const useAudioError = () => useAudioStore((state) => state.error);
export const useStopAllAudio = () => useAudioStore((state) => state.stopAllAudio);
export const useAudioErrorActions = () => useAudioStore((state) => ({
  setError: state.setError,
  clearError: state.clearError
}));

// =============================================================================
// VOCABULARY STORE HOOKS
// =============================================================================

// Removed legacy regular vocabulary - only HSK and Vietnamese systems remain
export const useHSKVocabulary = () => useVocabularyStore((state) => state.hskVocabulary);
export const useVietnameseVocabulary = () => useVocabularyStore((state) => state.vietnameseVocabulary);
export const useFavorites = () => useVocabularyStore((state) => state.favorites);
export const useVocabularyFilters = () => useVocabularyStore((state) => state.filters);
export const useVocabularySearchTerm = () => useVocabularyStore((state) => state.searchTerm);
export const useVocabularyLoading = () => useVocabularyStore((state) => state.loading);
export const useVocabularyError = () => useVocabularyStore((state) => state.error);

// Vocabulary loading actions (individual stable hooks)
export const useLoadVocabulary = () => useVocabularyStore((state) => state.loadVocabulary);
export const useClearVocabularyError = () => useVocabularyStore((state) => state.clearError);

// Favorites actions (individual stable hooks)
export const useToggleFavorite = () => useVocabularyStore((state) => state.toggleFavorite);
export const useGetFavoriteCount = () => useVocabularyStore((state) => state.getFavoriteCount);

// Filter and search actions (individual stable hooks)
export const useSetFilters = () => useVocabularyStore((state) => state.setFilters);
export const useSetSearchTerm = () => useVocabularyStore((state) => state.setSearchTerm);

// Legacy object-returning hooks (for backward compatibility, but these cause re-renders)
export const useVocabularyLoader = () => useVocabularyStore((state) => ({
  loadVocabulary: state.loadVocabulary,
  clearError: state.clearError
}));

export const useFavoritesActions = () => useVocabularyStore((state) => ({
  toggleFavorite: state.toggleFavorite,
  getFavoriteCount: state.getFavoriteCount
}));

export const useVocabularyFilterActions = () => useVocabularyStore((state) => ({
  setFilters: state.setFilters,
  setSearchTerm: state.setSearchTerm
}));

// Computed selectors with memoization
export const useFilteredVocabulary = (type: 'hsk' | 'vietnamese', level?: number | string) => {
  return useVocabularyStore((state) => {
    const vocabulary = type === 'hsk' && typeof level === 'number' ? state.hskVocabulary.get(level) || [] :
                     type === 'vietnamese' && typeof level === 'string' ? state.vietnameseVocabulary.get(level) || [] : [];
    
    const { searchTerm, filters } = state;
    
    // Create a stable key for memoization
    const filterKey = JSON.stringify({
      searchTerm,
      levels: filters.levels,
      categories: filters.categories,
      onlyFavorites: filters.onlyFavorites,
      hasAudio: filters.hasAudio,
      favoritesSize: state.favorites[type].size
    });
    
    // Store memoized results on the state object itself
    const memoKey = `filtered_${type}_${level || 'default'}_${filterKey}`;
    if (state._memoizedFilters && state._memoizedFilters[memoKey]) {
      return state._memoizedFilters[memoKey];
    }
    
    // Apply filters
    let filtered = [...vocabulary];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.vietnamese.toLowerCase().includes(term) ||
        item.chinese.includes(term) ||
        item.pinyin?.toLowerCase().includes(term) ||
        item.english?.toLowerCase().includes(term)
      );
    }
    
    // Level filtering is handled at the data loading level for HSK and Vietnamese
    
    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item =>
        filters.categories.includes(item.category)
      );
    }
    
    // Favorites filter
    if (filters.onlyFavorites) {
      const favSet = state.favorites[type];
      filtered = filtered.filter(item => favSet.has(item.id));
    }
    
    // Audio filter
    if (filters.hasAudio) {
      filtered = filtered.filter(item => (item as any).hasAudio);
    }
    
    // Store result in memoization cache
    if (!state._memoizedFilters) {
      (state as any)._memoizedFilters = {};
    }
    state._memoizedFilters![memoKey] = filtered;
    
    return filtered;
  });
};

export const useFavoriteCount = (type: 'hsk' | 'vietnamese') =>
  useVocabularyStore((state) => state.getFavoriteCount(type));

// Convenience hooks for specific vocabulary types

export const useHSKVocabularyFiltered = (level: number) => 
  useVocabularyStore((state) => state.getFilteredVocabulary('hsk', level));

export const useVietnameseVocabularyFiltered = (level: string) => 
  useVocabularyStore((state) => state.getFilteredVocabulary('vietnamese', level));

// Check if specific item is favorite
export const useIsFavorite = (type: 'hsk' | 'vietnamese', id: number) =>
  useVocabularyStore((state) => state.favorites[type].has(id));

// =============================================================================
// PROGRESS STORE HOOKS
// =============================================================================

export const useSpacedRepetition = () => useProgressStore((state) => state.spacedRepetition);
export const useUserProgress = () => useProgressStore((state) => state.userProgress);
export const useCurrentSession = () => useProgressStore((state) => state.currentSession);

// Progress actions
export const useSpacedRepetitionActions = () => useProgressStore((state) => ({
  updateSpacedRepetition: state.updateSpacedRepetition,
  syncProgress: state.syncProgress
}));

// Study session actions
export const useStudySessionActions = () => useProgressStore((state) => ({
  startStudySession: state.startStudySession,
  endStudySession: state.endStudySession,
  recordAnswer: state.recordAnswer
}));

// Computed progress selectors
export const useDueItems = () => useProgressStore((state) => state.getDueItems());
export const useStudyStats = () => useProgressStore((state) => state.getStudyStats());

// Convenience hooks for specific progress metrics
export const useStudyStreak = () => useProgressStore((state) => state.userProgress.dailyStreak);
export const useTotalStudyTime = () => useProgressStore((state) => state.userProgress.totalStudyTime);
export const useWordsLearned = () => useProgressStore((state) => state.userProgress.totalWordsLearned);
export const useAverageAccuracy = () => useProgressStore((state) => state.userProgress.averageAccuracy);

// Session-specific hooks
export const useSessionInProgress = () => useProgressStore((state) => state.currentSession.startTime !== null);
export const useSessionAccuracy = () => useProgressStore((state) => {
  const session = state.currentSession;
  return session.itemsStudied > 0 ? (session.correctAnswers / session.itemsStudied) * 100 : 0;
});

// =============================================================================
// STORE INITIALIZATION
// =============================================================================

// Initialize app when store is first created (disabled temporarily to debug infinite loop)
// if (typeof window !== 'undefined') {
//   // Initialize the app on store creation
//   setTimeout(() => {
//     const appState = useAppStore.getState();
//     const audioState = useAudioStore.getState();
    
//     // Only initialize if not already initialized
//     if (!appState.initialized) {
//       console.log('Initializing app store...');
//       appState.initializeApp();
//     }
    
//     // Initialize audio settings separately
//     console.log('Initializing audio settings...');
//     audioState.initializeAudioSettings();
//   }, 100);
// }

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type { AppStore, UIStore, AudioStore, VocabularyStore, ProgressStore } from './types';

// =============================================================================
// SUBSCRIPTION UTILITIES
// =============================================================================

// App store subscriptions
export const subscribeToTheme = (callback: (theme: 'light' | 'dark') => void) => {
  return useAppStore.subscribe(
    (state) => state.theme,
    callback
  );
};

export const subscribeToLanguage = (callback: (language: 'en' | 'vi' | 'zh' | 'zh-tw') => void) => {
  return useAppStore.subscribe(
    (state) => state.language,
    callback
  );
};

export const subscribeToOnlineStatus = (callback: (isOnline: boolean) => void) => {
  return useAppStore.subscribe(
    (state) => state.isOnline,
    callback
  );
};

// UI store subscriptions
export const subscribeToModal = (callback: (modalId: string | null) => void) => {
  return useUIStore.subscribe(
    (state) => state.activeModal,
    callback
  );
};

export const subscribeToLayoutMode = (callback: (mode: 'list' | 'grid' | 'cards') => void) => {
  return useUIStore.subscribe(
    (state) => state.layoutMode,
    callback
  );
};

// Audio store subscriptions
export const subscribeToAudioPlayback = (callback: (isPlaying: boolean) => void) => {
  return useAudioStore.subscribe(
    (state) => state.isPlaying,
    callback
  );
};

export const subscribeToCurrentAudio = (callback: (audio: any) => void) => {
  return useAudioStore.subscribe(
    (state) => state.currentAudio,
    callback
  );
};

// Vocabulary store subscriptions
export const subscribeToFavorites = (callback: (favorites: any) => void) => {
  return useVocabularyStore.subscribe(
    (state) => state.favorites,
    callback
  );
};

export const subscribeToVocabularyFilters = (callback: (filters: any) => void) => {
  return useVocabularyStore.subscribe(
    (state) => state.filters,
    callback
  );
};

export const subscribeToSearchTerm = (callback: (term: string) => void) => {
  return useVocabularyStore.subscribe(
    (state) => state.searchTerm,
    callback
  );
};

// Progress store subscriptions
export const subscribeToStudyStreak = (callback: (streak: number) => void) => {
  return useProgressStore.subscribe(
    (state) => state.userProgress.dailyStreak,
    callback
  );
};

export const subscribeToSession = (callback: (session: any) => void) => {
  return useProgressStore.subscribe(
    (state) => state.currentSession,
    callback
  );
};

// =============================================================================
// DEBUG UTILITIES (DEVELOPMENT ONLY)
// =============================================================================

if (isDevelopment) {
  // Make stores available in console for debugging
  (window as any).stores = {
    app: useAppStore,
    ui: useUIStore,
    audio: useAudioStore,
    vocabulary: useVocabularyStore,
    progress: useProgressStore
  };
  
  // Log store state changes in development (commented out to reduce noise)
  // useAppStore.subscribe((state) => console.debug('App Store State:', state));
  // useUIStore.subscribe((state) => console.debug('UI Store State:', state));
  // useAudioStore.subscribe((state) => console.debug('Audio Store State:', state));
}

// =============================================================================
// STORE RESET UTILITIES
// =============================================================================

// Store reset utility (useful for testing or user logout)
export const resetAppStore = () => {
  useAppStore.setState({
    theme: 'light',
    language: 'en' as 'en' | 'vi' | 'zh' | 'zh-tw',
    isOnline: navigator.onLine || true,
    initialized: false
  });
};

export const resetUIStore = () => {
  useUIStore.setState({
    currentPage: window.location.pathname,
    navigationHistory: [window.location.pathname],
    activeModal: null,
    popover: {
      isOpen: false,
      position: { x: 0, y: 0 },
      content: null
    },
    layoutMode: 'list',
    sidebarCollapsed: false
  });
};

export const resetAudioStore = () => {
  useAudioStore.setState({
    isPlaying: false,
    currentAudio: null,
    autoplay: false,
    playbackRate: 1.0,
    volume: 0.8,
    queue: [],
    queueIndex: -1
  });
};

export const resetVocabularyStore = () => {
  useVocabularyStore.setState({
    hskVocabulary: new Map(),
    vietnameseVocabulary: new Map(),
    favorites: {
      hsk: new Set(),
      vietnamese: new Set()
    },
    filters: {
      levels: [],
      categories: [],
      difficulties: [],
      onlyFavorites: false,
      hasAudio: false
    },
    searchTerm: '',
    loading: {
      hsk: false,
      vietnamese: false
    },
    error: null
  });
};

export const resetProgressStore = () => {
  useProgressStore.setState({
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
    }
  });
};

// Reset all stores
export const resetAllStores = () => {
  resetAppStore();
  resetUIStore();
  resetAudioStore();
  resetVocabularyStore();
  resetProgressStore();
};