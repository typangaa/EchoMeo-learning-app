import { toast } from '@/hooks/useToast';

export const learningToasts = {
  // Lesson completion toasts
  lessonComplete: (lessonNumber: number, vocabularyType: 'hsk' | 'vietnamese', score: number) => {
    const isExcellent = score >= 90;
    const isGood = score >= 70;
    
    toast({
      variant: 'lesson',
      title: isExcellent ? '🎉 Excellent!' : isGood ? '👏 Well Done!' : '💪 Keep Going!',
      description: `Lesson ${lessonNumber} completed with ${score}% accuracy in ${vocabularyType.toUpperCase()}`,
      duration: 5000,
    });
  },

  // Favorite management toasts
  favoriteAdded: (word: string, vocabularyType: 'hsk' | 'vietnamese') => {
    toast({
      variant: 'favorite',
      title: '⭐ Added to Favorites',
      description: `"${word}" saved to your ${vocabularyType.toUpperCase()} favorites`,
      duration: 3000,
    });
  },

  favoriteRemoved: (word: string) => {
    toast({
      variant: 'warning',
      title: '💫 Removed from Favorites',
      description: `"${word}" removed from your favorites`,
      duration: 3000,
    });
  },

  // Audio toasts
  audioPlaying: (text: string, language: 'vietnamese' | 'chinese') => {
    toast({
      variant: 'audio',
      title: '🔊 Playing Audio',
      description: `Playing "${text}" in ${language === 'vietnamese' ? 'Vietnamese' : 'Chinese'}`,
      duration: 2000,
    });
  },

  audioError: () => {
    toast({
      variant: 'destructive',
      title: '🔇 Audio Error',
      description: 'Unable to play audio. Please check your settings.',
      duration: 4000,
    });
  },

  // Progress toasts
  levelCompleted: (level: number, vocabularyType: 'hsk' | 'vietnamese') => {
    toast({
      variant: 'success',
      title: '🎯 Level Completed!',
      description: `Congratulations! You've completed ${vocabularyType.toUpperCase()} Level ${level}`,
      duration: 6000,
    });
  },

  studyStreakAchieved: (days: number) => {
    toast({
      variant: 'success',
      title: '🔥 Study Streak!',
      description: `Amazing! You've studied for ${days} days in a row!`,
      duration: 5000,
    });
  },

  // Data management toasts
  dataLoaded: (count: number, vocabularyType: 'hsk' | 'vietnamese') => {
    toast({
      variant: 'info',
      title: '📚 Data Loaded',
      description: `Loaded ${count} ${vocabularyType.toUpperCase()} vocabulary items`,
      duration: 3000,
    });
  },

  dataError: (vocabularyType: 'hsk' | 'vietnamese') => {
    toast({
      variant: 'destructive',
      title: '❌ Loading Error',
      description: `Failed to load ${vocabularyType.toUpperCase()} vocabulary data`,
      duration: 5000,
    });
  },

  // Settings toasts
  settingsSaved: () => {
    toast({
      variant: 'success',
      title: '✅ Settings Saved',
      description: 'Your preferences have been saved successfully',
      duration: 3000,
    });
  },

  themeChanged: (themeName: string) => {
    toast({
      variant: 'info',
      title: '🎨 Theme Changed',
      description: `Switched to ${themeName} theme`,
      duration: 2000,
    });
  },

  // Search toasts
  noSearchResults: (query: string) => {
    toast({
      variant: 'warning',
      title: '🔍 No Results',
      description: `No vocabulary found for "${query}"`,
      duration: 3000,
    });
  },

  searchTooShort: () => {
    toast({
      variant: 'warning',
      title: '⌨️ Search Too Short',
      description: 'Please enter at least 2 characters to search',
      duration: 2000,
    });
  },

  // Export/Import toasts
  dataExported: (count: number) => {
    toast({
      variant: 'success',
      title: '📤 Data Exported',
      description: `Successfully exported ${count} vocabulary items`,
      duration: 4000,
    });
  },

  dataImported: (count: number) => {
    toast({
      variant: 'success',
      title: '📥 Data Imported',
      description: `Successfully imported ${count} vocabulary items`,
      duration: 4000,
    });
  },

  // General success/error toasts
  success: (message: string) => {
    toast({
      variant: 'success',
      title: '✅ Success',
      description: message,
      duration: 3000,
    });
  },

  error: (message: string) => {
    toast({
      variant: 'destructive',
      title: '❌ Error',
      description: message,
      duration: 4000,
    });
  },

  info: (message: string) => {
    toast({
      variant: 'info',
      title: 'ℹ️ Info',
      description: message,
      duration: 3000,
    });
  },
};