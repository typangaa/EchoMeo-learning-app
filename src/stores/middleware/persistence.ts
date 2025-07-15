// Persistence middleware for Zustand stores
// Supports both web (localStorage) and mobile (AsyncStorage) environments

export interface PersistOptions<T> {
  name: string;
  version?: number;
  migrate?: (persistedState: any, version: number) => T;
  partialize?: (state: T) => Partial<T>;
  onRehydrateStorage?: (state: T) => void;
}

// Storage interface for platform abstraction
export interface StorageAdapter {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
}

// Web storage adapter (localStorage)
export const webStorageAdapter: StorageAdapter = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error);
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error);
    }
  }
};

// Mobile storage adapter (AsyncStorage) - will be implemented for React Native
export const createAsyncStorageAdapter = (AsyncStorage: any): StorageAdapter => ({
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item from AsyncStorage: ${key}`, error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to set item in AsyncStorage: ${key}`, error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove item from AsyncStorage: ${key}`, error);
    }
  }
});

// Platform detection
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// Default storage adapter based on platform
export const defaultStorageAdapter = isReactNative ? null : webStorageAdapter;

// Serialization helpers
const serialize = (value: any): string => {
  try {
    return JSON.stringify(value, (_key, val) => {
      // Handle Map objects
      if (val instanceof Map) {
        return {
          __type: 'Map',
          __data: Array.from(val.entries())
        };
      }
      // Handle Set objects
      if (val instanceof Set) {
        return {
          __type: 'Set',
          __data: Array.from(val)
        };
      }
      // Handle Date objects
      if (val instanceof Date) {
        return {
          __type: 'Date',
          __data: val.toISOString()
        };
      }
      return val;
    });
  } catch (error) {
    console.error('Failed to serialize state:', error);
    return '{}';
  }
};

const deserialize = (value: string): any => {
  try {
    return JSON.parse(value, (_key, val) => {
      // Reconstruct Map objects
      if (val && typeof val === 'object' && val.__type === 'Map') {
        return new Map(val.__data);
      }
      // Reconstruct Set objects
      if (val && typeof val === 'object' && val.__type === 'Set') {
        return new Set(val.__data);
      }
      // Reconstruct Date objects
      if (val && typeof val === 'object' && val.__type === 'Date') {
        return new Date(val.__data);
      }
      return val;
    });
  } catch (error) {
    console.error('Failed to deserialize state:', error);
    return {};
  }
};

// Persistence middleware factory
export const createPersistMiddleware = <T>(
  options: PersistOptions<T>,
  storageAdapter: StorageAdapter = defaultStorageAdapter!
) => {
  const { name, version = 1, migrate, partialize, onRehydrateStorage } = options;
  
  return (config: any) => (set: any, get: any, api: any) => {
    const initialState = config(set, get, api);
    
    // Load persisted state
    const loadPersistedState = async () => {
      try {
        const persistedValue = await storageAdapter.getItem(name);
        if (!persistedValue) return initialState;
        
        const persistedState = deserialize(persistedValue);
        
        // Handle version migration
        if (migrate && persistedState.__version !== version) {
          const migratedState = migrate(persistedState, persistedState.__version || 0);
          return { ...initialState, ...migratedState, __version: version };
        }
        
        // Merge persisted state with initial state
        const rehydratedState = { ...initialState, ...persistedState, __version: version };
        
        // Call rehydration callback
        if (onRehydrateStorage) {
          onRehydrateStorage(rehydratedState);
        }
        
        return rehydratedState;
      } catch (error) {
        console.error('Failed to load persisted state:', error);
        return initialState;
      }
    };
    
    // Save state to storage
    const saveState = async (state: T) => {
      try {
        const stateToSave = partialize ? partialize(state) : state;
        const serializedState = serialize({ ...stateToSave, __version: version });
        await storageAdapter.setItem(name, serializedState);
      } catch (error) {
        console.error('Failed to save state:', error);
      }
    };
    
    // Override set function to trigger persistence
    const persistentSet = (partial: any, replace?: boolean) => {
      set(partial, replace);
      const currentState = get();
      saveState(currentState);
    };
    
    // Initialize with persisted state
    if (typeof window !== 'undefined' || isReactNative) {
      loadPersistedState().then(persistedState => {
        set(persistedState, true);
      });
    }
    
    return config(persistentSet, get, api);
  };
};

// Utility function to clear persisted data
export const clearPersistedData = async (keys: string[], storageAdapter: StorageAdapter = defaultStorageAdapter!) => {
  try {
    await Promise.all(keys.map(key => storageAdapter.removeItem(key)));
  } catch (error) {
    console.error('Failed to clear persisted data:', error);
  }
};

// Predefined persistence configurations
export const persistConfigs = {
  app: {
    name: 'vietnamese-chinese-app',
    partialize: (state: any) => ({
      theme: state.theme,
      language: state.language,
    })
  },
  vocabulary: {
    name: 'vietnamese-chinese-vocabulary',
    partialize: (state: any) => ({
      favorites: state.favorites,
      filters: state.filters,
    })
  },
  progress: {
    name: 'vietnamese-chinese-progress',
    partialize: (state: any) => ({
      spacedRepetition: state.spacedRepetition,
      userProgress: state.userProgress,
    })
  },
  audio: {
    name: 'vietnamese-chinese-audio',
    partialize: (state: any) => ({
      autoplay: state.autoplay,
      playbackRate: state.playbackRate,
      volume: state.volume,
      pitch: state.pitch,
      preferredVietnameseVoice: state.preferredVietnameseVoice,
      preferredChineseVoice: state.preferredChineseVoice,
    })
  },
  ui: {
    name: 'vietnamese-chinese-ui',
    partialize: (state: any) => ({
      layoutMode: state.layoutMode,
      sidebarCollapsed: state.sidebarCollapsed,
    })
  }
};