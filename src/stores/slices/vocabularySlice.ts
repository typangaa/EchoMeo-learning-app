// Vocabulary store slice - unified vocabulary management for all types
import { StateCreator } from 'zustand';
import { VocabularyStore } from '../types';
import { createActionTypes, createActionSet } from '../middleware/devtools';
import { VocabularyItem } from '../../types';
import { loadEnrichedHSKLevel } from '../../data/enrichedHSKLoader';
import { loadEnrichedVietnameseLevel } from '../../data/enrichedVietnameseLoader';

// Action types for DevTools
const actionTypes = createActionTypes('VOCABULARY');

// Vocabulary store slice
export const createVocabularySlice: StateCreator<VocabularyStore> = (set, get) => {
  // Enhanced set with action types for better debugging
  const actionSet = createActionSet(set, actionTypes);

  return {
    // Initial state - removed legacy regular vocabulary
    hskVocabulary: new Map(),
    vietnameseVocabulary: new Map(),
    
    // Favorites (using Sets for better performance)
    favorites: {
      hsk: new Set(),
      vietnamese: new Set()
    },
    
    // Filtering & Search
    filters: {
      levels: [],
      categories: [],
      difficulties: [],
      onlyFavorites: false,
      hasAudio: false
    },
    searchTerm: '',
    
    // Loading states
    loading: {
      hsk: false,
      vietnamese: false
    },
    error: null,

    // Data loading actions
    loadVocabulary: async (type, level) => {
      // Set loading state
      actionSet({
        loading: { ...get().loading, [type]: true },
        error: null
      }, false, actionTypes.custom('START_LOADING'));

      try {
        if (type === 'hsk' && typeof level === 'number') {
          // Load HSK vocabulary by level
          const hskData = await loadEnrichedHSKLevel(level);
          const currentMap = get().hskVocabulary;
          const newMap = new Map(currentMap);
          newMap.set(level, hskData);
          
          actionSet({
            hskVocabulary: newMap,
            loading: { ...get().loading, hsk: false }
          }, false, actionTypes.custom('LOAD_HSK_SUCCESS'));
          
        } else if (type === 'vietnamese') {
          // Load Vietnamese vocabulary by level
          const levelNum = typeof level === 'string' ? parseInt(level, 10) : level;
          if (typeof levelNum === 'number' && !isNaN(levelNum)) {
            const vietnameseData = await loadEnrichedVietnameseLevel(levelNum);
            const currentMap = get().vietnameseVocabulary;
            const newMap = new Map(currentMap);
            newMap.set(levelNum.toString(), vietnameseData);
            
            actionSet({
              vietnameseVocabulary: newMap,
              loading: { ...get().loading, vietnamese: false }
            }, false, actionTypes.custom('LOAD_VIETNAMESE_SUCCESS'));
          } else {
            console.error(`Invalid level for Vietnamese vocabulary: ${level}`);
            actionSet({
              loading: { ...get().loading, vietnamese: false },
              error: 'Invalid level for Vietnamese vocabulary'
            }, false, actionTypes.custom('LOAD_ERROR'));
          }
          
        }
        
      } catch (error: any) {
        console.error(`Failed to load ${type} vocabulary:`, error);
        actionSet({
          loading: { ...get().loading, [type]: false },
          error: error.message || 'Failed to load vocabulary'
        }, false, actionTypes.custom('LOAD_ERROR'));
      }
    },

    // Favorites management
    toggleFavorite: (type, id) => {
      const currentFavorites = get().favorites;
      const typeSet = new Set(currentFavorites[type]);
      
      if (typeSet.has(id)) {
        typeSet.delete(id);
      } else {
        typeSet.add(id);
      }
      
      actionSet({
        favorites: {
          ...currentFavorites,
          [type]: typeSet
        },
        _memoizedFilters: {} // Clear cache when favorites change
      }, false, actionTypes.custom('TOGGLE_FAVORITE'));
    },

    // Filtering actions
    setFilters: (newFilters) => {
      const currentFilters = get().filters;
      actionSet({
        filters: { ...currentFilters, ...newFilters },
        _memoizedFilters: {} // Clear cache when filters change
      }, false, actionTypes.custom('SET_FILTERS'));
    },

    setSearchTerm: (term) => {
      actionSet({
        searchTerm: term,
        _memoizedFilters: {} // Clear cache when search term changes
      }, false, actionTypes.custom('SET_SEARCH_TERM'));
    },

    clearError: () => {
      actionSet({
        error: null
      }, false, actionTypes.custom('CLEAR_ERROR'));
    },

    // Computed selectors (implemented as methods to avoid stale closures)
    getFilteredVocabulary: (type, level) => {
      const state = get();
      let vocabulary: VocabularyItem[] = [];
      
      // Get vocabulary based on type and level
      if (type === 'hsk' && typeof level === 'number') {
        vocabulary = state.hskVocabulary.get(level) || [];
      } else if (type === 'vietnamese' && typeof level === 'string') {
        vocabulary = state.vietnameseVocabulary.get(level) || [];
      }
      
      // Apply filters
      let filtered = [...vocabulary];
      
      // Search filter
      if (state.searchTerm) {
        const term = state.searchTerm.toLowerCase();
        filtered = filtered.filter(item =>
          item.vietnamese.toLowerCase().includes(term) ||
          item.chinese.includes(term) ||
          item.pinyin?.toLowerCase().includes(term) ||
          item.english?.toLowerCase().includes(term)
        );
      }
      
      // Level filtering is handled at the data loading level for HSK and Vietnamese
      
      // Category filter
      if (state.filters.categories.length > 0) {
        filtered = filtered.filter(item =>
          state.filters.categories.includes(item.category)
        );
      }
      
      // Favorites filter
      if (state.filters.onlyFavorites) {
        const favSet = state.favorites[type];
        filtered = filtered.filter(item => favSet.has(item.id));
      }
      
      // Audio filter (check if vocabulary item has audio property)
      if (state.filters.hasAudio) {
        filtered = filtered.filter(item => (item as any).hasAudio);
      }
      
      return filtered;
    },

    getFavoriteCount: (type) => {
      return get().favorites[type].size;
    }
  };
};