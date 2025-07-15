export const en = {
  // Navigation
  nav: {
    appTitle: "Learn Chinese - 学越南语",
    vietnamese: "Vietnamese",
    hsk: "HSK",
    flashcards: "Flashcards",
    reading: "Reading",
    pronunciation: "Pronunciation",
    settings: "Settings",
    language: "Language",
    toggleDarkMode: "Toggle dark mode",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  // Homepage
  home: {
    title: "Learn Chinese - 学越南语",
    subtitle: "Vietnamese ↔ Chinese Language Learning Platform",
    vietnamese: {
      title: "Tiếng Việt",
      description: "Learn Vietnamese vocabulary with Chinese translations across 6 levels (A1-C1)",
      browseVocabulary: "📚 Browse Vocabulary",
      practiceFlashcards: "🧠 Practice Flashcards",
      features: "Audio pronunciation, spaced repetition, cultural context",
    },
    hsk: {
      title: "汉语 HSK",
      description: "Master Chinese with HSK vocabulary across 6 levels",
      browseVocabulary: "📚 Browse Vocabulary", 
      practiceFlashcards: "🧠 Practice Flashcards",
      features: "Pinyin, audio, character practice, grammar notes",
    },
    reading: {
      title: "📖 Reading Practice",
      description: "Practice reading with vocabulary lookup",
      startReading: "Start Reading Practice",
    },
    pronunciation: {
      title: "Pronunciation Practice",
      description: "Perfect your Vietnamese and Chinese pronunciation with AI-powered speech recognition feedback.",
      startPractice: "Start Practice"
    },
  },

  // Landing Page
  landing: {
    welcome: {
      title: "Welcome to Vietnamese-Chinese Learning",
      subtitle: "Let's set up your learning experience"
    },
    steps: {
      language: "Language",
      audio: "Audio"
    },
    language: {
      title: "Choose Your Interface Language",
      description: "Select the language you'd like to use for the interface"
    },
    audio: {
      title: "Configure Audio Settings",
      description: "Adjust voice settings and test pronunciation"
    },
    theme: {
      toggle: "Toggle Theme"
    },
    continue: "Continue",
    back: "Back",
    skip: "Skip Setup",
    startLearning: "Start Learning"
  },

  // Settings
  settings: {
    title: "Settings",
    interfaceLanguage: {
      title: "🌐 Interface Language",
      description: "Choose your preferred interface language",
    },
    audio: {
      title: "🔊 Audio Settings",
      volume: "Volume",
      speechRate: "Speech Rate",
      speechPitch: "Speech Pitch",
      pitch: "Pitch",
      selectVoice: "Select a voice...",
      playing: "Playing...",
      testVietnamese: "🇻🇳 Test Vietnamese",
      testChinese: "🇨🇳 Test Chinese",
      vietnameseVoice: "Vietnamese Voice",
      chineseVoice: "Chinese Voice",
      test: "Test",
      testing: "Testing...",
      resetDefaults: "Reset to Defaults",
      autoSelectVoice: "Auto-select best voice",
      noVietnameseVoices: "No Vietnamese voices available",
      noChineseVoices: "No Chinese voices available",
      tips: {
        title: "💡 Audio Tips:",
        items: [
          "Lower speech rate (0.7x) helps with pronunciation learning",
          "Adjust pitch to find the most comfortable voice tone",
          "Use 'Auto-select best voice' to find the highest quality voices",
          "Test voices to find ones that work best for your device",
        ],
      },
    },
  },

  // Vocabulary
  vocabulary: {
    searchPlaceholder: "Search vocabulary (Chinese, Vietnamese, English, Pinyin, or Category)...",
    total: "Total",
    favorites: "Favorites",
    showing: "Showing",
    search: "Search",
    loadingLevel: "Loading {level} enriched vocabulary...",
    noVocabularyLoaded: "No vocabulary loaded yet",
    loadLevel: "Load {level}",
    clearFilters: "Clear filters",
    retryLoading: "Retry Loading",
    
    // HSK Vocabulary Page
    hsk: {
      title: "HSK Vocabulary",
      description: "Browse HSK vocabulary with Vietnamese translations",
      practiceFlashcards: "🧠 Practice Flashcards",
      allVocabulary: "All Vocabulary",
      favoritesButton: "★ Favorites",
      about: {
        title: "About HSK Vocabulary",
        description: "HSK is the standardized Chinese proficiency test. Learn vocabulary with Vietnamese translations, detailed meanings, and example sentences.",
        availableContent: {
          title: "Available Content:",
          items: [
            "HSK Levels 1-6: 5000+ words total",
            "Vietnamese translations & meanings",
            "Pinyin pronunciation & examples",
            "Usage frequency indicators"
          ]
        },
        features: {
          title: "Features:",
          items: [
            "Audio pronunciations",
            "Spaced repetition practice", 
            "Character stroke learning",
            "Progress tracking system"
          ]
        }
      }
    },

    // Vietnamese Vocabulary Page
    vietnamese: {
      title: "Vietnamese Vocabulary",
      description: "Browse Vietnamese vocabulary with Chinese translations",
      practiceFlashcards: "🧠 Practice Flashcards",
      allVocabulary: "All Vocabulary",
      favoritesButton: "★ Favorites",
      about: {
        title: "About Vietnamese Vocabulary",
        description: "Learn Vietnamese vocabulary with comprehensive Chinese translations across 6 CEFR levels from A1 to C1.",
        availableContent: {
          title: "Available Content:",
          items: [
            "CEFR Levels A1-C1: 6000+ words total",
            "Chinese translations & meanings",
            "Audio pronunciations & examples",
            "Cultural context & usage notes"
          ]
        },
        features: {
          title: "Features:",
          items: [
            "Native speaker audio",
            "Spaced repetition system",
            "Cultural context learning",
            "Progress tracking & analytics"
          ]
        }
      }
    }
  },

  // Common
  common: {
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
  },

  // Languages
  languages: {
    en: "English",
    vi: "Tiếng Việt",
    zh: "简体中文",
    "zh-tw": "繁體中文",
  },
};

export type TranslationKeys = typeof en;