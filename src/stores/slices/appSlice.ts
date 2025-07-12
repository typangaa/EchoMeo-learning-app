// App store slice - handles app-wide settings and state
import { StateCreator } from 'zustand';
import { AppStore } from '../types';
import { createActionTypes, createActionSet } from '../middleware/devtools';

// Action types for DevTools
const actionTypes = createActionTypes('APP');

// App store slice
export const createAppSlice: StateCreator<AppStore> = (set, get) => {
  // Enhanced set with action types for better debugging
  const actionSet = createActionSet(set, actionTypes);

  return {
    // Initial state
    theme: 'light',
    language: 'en',
    isOnline: navigator.onLine || true,
    initialized: false,

    // Actions
    setTheme: (theme) => {
      actionSet(
        { theme },
        false,
        actionTypes.custom('SET_THEME')
      );
    },

    setLanguage: (language) => {
      actionSet(
        { language },
        false,
        actionTypes.custom('SET_LANGUAGE')
      );
    },

    setOnlineStatus: (isOnline) => {
      actionSet(
        { isOnline },
        false,
        actionTypes.custom('SET_ONLINE_STATUS')
      );
    },

    initializeApp: () => {
      // Detect system theme preference
      const prefersDarkMode = window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Detect browser language
      const browserLanguage = navigator.language.slice(0, 2);
      const supportedLanguages = ['en', 'vi', 'zh'];
      const detectedLanguage = supportedLanguages.includes(browserLanguage) 
        ? browserLanguage as 'en' | 'vi' | 'zh'
        : 'en';

      // Setup online/offline listeners
      const handleOnline = () => get().setOnlineStatus(true);
      const handleOffline = () => get().setOnlineStatus(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Setup theme change listener
      const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleThemeChange = (_e: MediaQueryListEvent) => {
        // Only auto-update theme if user hasn't manually set it
        // This would require checking if theme was user-set vs system-set
        // For now, we'll just detect initial preference
      };
      
      if (themeMediaQuery.addEventListener) {
        themeMediaQuery.addEventListener('change', handleThemeChange);
      } else {
        // Fallback for older browsers
        themeMediaQuery.addListener(handleThemeChange);
      }

      actionSet({
        theme: prefersDarkMode ? 'dark' : 'light',
        language: detectedLanguage,
        isOnline: navigator.onLine,
        initialized: true
      }, false, actionTypes.custom('INITIALIZE_APP'));

      // Cleanup function (would be called in useEffect cleanup)
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        if (themeMediaQuery.removeEventListener) {
          themeMediaQuery.removeEventListener('change', handleThemeChange);
        } else {
          themeMediaQuery.removeListener(handleThemeChange);
        }
      };
    }
  };
};