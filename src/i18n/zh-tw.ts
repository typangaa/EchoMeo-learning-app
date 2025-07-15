import { TranslationKeys } from './en';

export const zhTw: TranslationKeys = {
  // Navigation
  nav: {
    appTitle: "學越南語 - Học Tiếng Trung",
    vietnamese: "越南語",
    hsk: "HSK",
    flashcards: "閃卡",
    reading: "閱讀",
    pronunciation: "發音",
    settings: "設定",
    language: "語言",
    toggleDarkMode: "切換深色/淺色模式",
    openMenu: "開啟選單",
    closeMenu: "關閉選單",
  },

  // Homepage
  home: {
    title: "學越南語 - Học Tiếng Trung",
    subtitle: "越南語 ↔ 中文語言學習平台",
    vietnamese: {
      title: "Tiếng Việt",
      description: "透過6個級別(A1-C1)學習越南語詞彙和中文翻譯",
      browseVocabulary: "📚 瀏覽詞彙",
      practiceFlashcards: "🧠 練習閃卡",
      features: "語音發音、間隔重複、文化背景",
    },
    hsk: {
      title: "漢語 HSK",
      description: "透過6個HSK級別掌握中文詞彙",
      browseVocabulary: "📚 瀏覽詞彙",
      practiceFlashcards: "🧠 練習閃卡",
      features: "拼音、語音、漢字練習、語法筆記",
    },
    reading: {
      title: "📖 閱讀練習", 
      description: "透過詞彙查找練習閱讀",
      startReading: "開始閱讀練習",
    },
    pronunciation: {
      title: "發音練習",
      description: "透過AI語音識別回饋完善您的越南語和中文發音。",
      startPractice: "開始練習"
    },
  },

  // Landing Page
  landing: {
    welcome: {
      title: "歡迎來到越南語-中文學習平台",
      subtitle: "讓我們設置您的學習體驗"
    },
    steps: {
      language: "語言",
      audio: "音訊"
    },
    language: {
      title: "選擇介面語言",
      description: "選擇您希望用於介面的語言"
    },
    audio: {
      title: "配置音訊設定",
      description: "調整語音設定並測試發音"
    },
    theme: {
      toggle: "切換主題"
    },
    continue: "繼續",
    back: "返回",
    skip: "跳過設定",
    startLearning: "開始學習"
  },

  // Settings
  settings: {
    title: "設定",
    interfaceLanguage: {
      title: "🌐 介面語言",
      description: "選擇您偏好的介面語言",
    },
    audio: {
      title: "🔊 音訊設定",
      volume: "音量",
      speechRate: "語音速度",
      speechPitch: "語音音調",
      pitch: "音調",
      selectVoice: "選擇聲音...",
      playing: "正在播放...",
      testVietnamese: "🇻🇳 測試越南語",
      testChinese: "🇨🇳 測試中文",
      vietnameseVoice: "越南語語音",
      chineseVoice: "中文語音",
      test: "測試",
      testing: "正在測試...",
      resetDefaults: "重設為預設值",
      autoSelectVoice: "自動選擇最佳語音",
      noVietnameseVoices: "沒有可用的越南語語音",
      noChineseVoices: "沒有可用的中文語音",
      tips: {
        title: "💡 音訊提示：",
        items: [
          "較慢的語音速度(0.7x)有助於發音學習",
          "調整音調以找到最舒適的語音音色",
          "使用「自動選擇最佳語音」來找到最高品質的語音",
          "測試語音以找到最適合您裝置的語音",
        ],
      },
    },
  },

  // Vocabulary
  vocabulary: {
    searchPlaceholder: "搜尋詞彙（中文、越南語、英語、拼音或類別）...",
    total: "總計",
    favorites: "收藏",
    showing: "顯示",
    search: "搜尋",
    loadingLevel: "正在載入{level}擴展詞彙...",
    noVocabularyLoaded: "尚未載入詞彙",
    loadLevel: "載入{level}",
    clearFilters: "清除篩選",
    retryLoading: "重試載入",
    
    // HSK Vocabulary Page
    hsk: {
      title: "HSK詞彙",
      description: "瀏覽帶有越南語翻譯的HSK詞彙",
      practiceFlashcards: "🧠 練習閃卡",
      allVocabulary: "所有詞彙",
      favoritesButton: "★ 收藏",
      about: {
        title: "關於HSK詞彙",
        description: "HSK是標準化的中文水平考試。學習帶有越南語翻譯、詳細含義和例句的詞彙。",
        availableContent: {
          title: "可用內容：",
          items: [
            "HSK 1-6級：總計5000+詞彙",
            "越南語翻譯和含義",
            "拼音發音和例句",
            "使用頻率指標"
          ]
        },
        features: {
          title: "功能特色：",
          items: [
            "語音發音",
            "間隔重複練習",
            "漢字筆劃學習",
            "進度追蹤系統"
          ]
        }
      }
    },

    // Vietnamese Vocabulary Page
    vietnamese: {
      title: "越南語詞彙",
      description: "瀏覽帶有中文翻譯的越南語詞彙",
      practiceFlashcards: "🧠 練習閃卡",
      allVocabulary: "所有詞彙",
      favoritesButton: "★ 收藏",
      about: {
        title: "關於越南語詞彙",
        description: "透過6個CEFR級別從A1到C1學習帶有全面中文翻譯的越南語詞彙。",
        availableContent: {
          title: "可用內容：",
          items: [
            "CEFR A1-C1級：總計6000+詞彙",
            "中文翻譯和含義",
            "語音發音和例句",
            "文化背景和使用說明"
          ]
        },
        features: {
          title: "功能特色：",
          items: [
            "母語發音",
            "間隔重複系統",
            "文化背景學習",
            "進度追蹤和分析"
          ]
        }
      }
    }
  },

  // Common
  common: {
    loading: "載入中...",
    error: "錯誤",
    retry: "重試",
    close: "關閉",
    back: "返回",
    next: "下一頁",
    previous: "上一頁",
    save: "儲存",
    cancel: "取消",
    confirm: "確認",
  },

  // Languages
  languages: {
    en: "English",
    vi: "Tiếng Việt",
    zh: "简体中文",
    "zh-tw": "繁體中文",
  },
};