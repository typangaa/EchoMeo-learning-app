import { useState, useEffect } from 'react';

interface AutoplayPreferences {
  autoplayOnCardChange: boolean;
  autoplayOnFlip: boolean;
}

const DEFAULT_PREFERENCES: AutoplayPreferences = {
  autoplayOnCardChange: true,  // Play audio when a new card appears
  autoplayOnFlip: false,       // Don't play audio when flipping card
};

const STORAGE_KEY = 'flashcard_autoplay_preferences';

/**
 * Custom hook for managing autoplay preferences in flashcards
 * Stores preferences in localStorage for persistence across sessions
 */
export function useAutoplayPreference() {
  const [preferences, setPreferences] = useState<AutoplayPreferences>(() => {
    // Load preferences from localStorage on initialization
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load autoplay preferences from localStorage:', error);
    }
    return DEFAULT_PREFERENCES;
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save autoplay preferences to localStorage:', error);
    }
  }, [preferences]);

  const updatePreference = (key: keyof AutoplayPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleAutoplayOnCardChange = () => {
    updatePreference('autoplayOnCardChange', !preferences.autoplayOnCardChange);
  };

  const toggleAutoplayOnFlip = () => {
    updatePreference('autoplayOnFlip', !preferences.autoplayOnFlip);
  };

  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return {
    preferences,
    updatePreference,
    toggleAutoplayOnCardChange,
    toggleAutoplayOnFlip,
    resetToDefaults,
  };
}

export default useAutoplayPreference;
