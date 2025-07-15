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
      const currentState = get();
      
      // Only detect system preferences if app is not already initialized
      // (to avoid overriding persisted settings)
      if (!currentState.initialized) {
        // Detect system theme preference
        const prefersDarkMode = window.matchMedia && 
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Detect browser language with Traditional Chinese support
        const browserLanguage = navigator.language;
        let detectedLanguage: 'en' | 'vi' | 'zh' | 'zh-tw' = 'en';
        
        if (browserLanguage.startsWith('zh-TW') || browserLanguage.startsWith('zh-HK') || browserLanguage.startsWith('zh-Hant')) {
          detectedLanguage = 'zh-tw';
        } else if (browserLanguage.startsWith('zh')) {
          detectedLanguage = 'zh';
        } else if (browserLanguage.startsWith('vi')) {
          detectedLanguage = 'vi';
        } else if (browserLanguage.startsWith('en')) {
          detectedLanguage = 'en';
        }
        
        // Only update if values are still defaults or if this is the first run
        const shouldUpdateTheme = currentState.theme === 'light'; // Default theme
        const shouldUpdateLanguage = currentState.language === 'en'; // Default language
        
        if (shouldUpdateTheme || shouldUpdateLanguage) {
          actionSet({
            theme: shouldUpdateTheme ? (prefersDarkMode ? 'dark' : 'light') : currentState.theme,
            language: shouldUpdateLanguage ? detectedLanguage : currentState.language,
            isOnline: navigator.onLine,
            initialized: true
          }, false, actionTypes.custom('INITIALIZE_APP'));
        } else {
          // Just mark as initialized without changing persisted settings
          actionSet({
            isOnline: navigator.onLine,
            initialized: true
          }, false, actionTypes.custom('INITIALIZE_APP'));
        }
      }

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