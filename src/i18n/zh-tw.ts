import { TranslationKeys } from './en';

export const zhTw: TranslationKeys = {
  // Navigation
  nav: {
    appTitle: "🐱 EchoMeo",
    home: "首頁",
    browse: "瀏覽",
    study: "學習",
    vietnamese: "越南語",
    vietnameseStudy: "越南語學習",
    hsk: "HSK",
    hskStudy: "HSK學習",
    flashcards: "閃卡",
    reading: "閱讀",
    progress: "學習進度",
    settings: "設定",
    language: "語言",
    toggleDarkMode: "切換深色/淺色模式",
    openMenu: "開啟選單",
    closeMenu: "關閉選單",
  },

  // Homepage
  home: {
    title: "🐱 EchoMeo",
    subtitle: "多語言學習平台",
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
  },

  // Landing Page
  landing: {
    welcome: {
      title: "歡迎來到🐱 EchoMeo",
      subtitle: "讓我們設置您的學習體驗"
    },
    steps: {
      interface: "介面",
      languages: "語言",
      audio: "音訊"
    },
    interface: {
      title: "選擇介面語言",
      description: "選擇您希望用於介面的語言"
    },
    languages: {
      title: "選擇學習語言",
      description: "選擇您要學習的語言",
      fromLanguage: "從語言",
      toLanguage: "到語言",
      englishSupplement: "顯示英語",
      englishSupplementDescription: "在所選語言旁顯示英語翻譯以便更好地理解"
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
    languagePair: {
      title: "📚 語言學習方向",
      description: "配置您的語言學習方向",
      fromLanguage: "從語言",
      toLanguage: "到語言",
      englishSupplement: "顯示英語",
      englishSupplementDescription: "在所選語言旁顯示英語翻譯以便更好地理解"
    },
    theme: {
      title: "🎨 主題與外觀",
      description: "使用您喜好的顏色和外觀自訂學習環境",
      colorTitle: "主題顏色",
      colorDescription: "選擇激發學習動力的顏色主題",
      modeTitle: "外觀模式",
      modeDescription: "選擇您偏好的亮度設定",
      preview: "目前選擇",
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
    vocabularyList: "詞彙列表",
    currentItem: "當前項目",
    clickToJump: "點擊跳轉到項目",
    showList: "顯示列表",
    hideList: "隱藏列表",
    position: "位置",
    keyboardHints: "鍵盤快捷鍵",
    previous: "上一個",
    next: "下一個",
    items: "項",
    noItems: "沒有可用項目",
    noSearchResults: "未找到搜尋結果",
    currentLevel: "當前級別",
    totalItems: "總項目數",
    showFavorites: "顯示收藏",
    addToFavorites: "新增到收藏",
    removeFromFavorites: "從收藏中移除",
    
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
            "HSK 1-7級：總計10963個詞彙",
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
      },
      selectLevel: "選擇級別開始學習",
      level1: {
        description: "初學者基礎詞彙（506個詞）"
      },
      level2: {
        description: "初級詞彙建設（750個詞）"
      },
      level3: {
        description: "中級詞彙擴展（953個詞）"
      },
      level4: {
        description: "中高級詞彙（971個詞）"
      },
      level5: {
        description: "高級詞彙掌握（1059個詞）"
      },
      level6: {
        description: "優秀詞彙水平（1123個詞）"
      },
      level7: {
        description: "專家詞彙掌握（5601個詞）"
      }
    },

    // Vietnamese Vocabulary Page
    vietnamese: {
      title: "越南語詞彙",
      description: "瀏覽帶有中文翻譯的越南語詞彙",
      practiceFlashcards: "🧠 練習閃卡",
      allVocabulary: "所有詞彙",
      favoritesButton: "★ 收藏",
      selectLevel: "選擇級別開始學習",
      level: "級別",
      level1: {
        description: "初學者基礎詞彙（A1級）"
      },
      level2: {
        description: "初級詞彙建設（A2級）"
      },
      level3: {
        description: "中級詞彙擴展（B1級）"
      },
      level4: {
        description: "中高級詞彙（B2級）"
      },
      level5: {
        description: "高級詞彙掌握（C1級）"
      },
      level6: {
        description: "優秀詞彙水平（C1+級）"
      },
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

  // Progress
  progress: {
    title: "學習進度",
    overview: {
      title: "概覽",
      streak: "學習連續天數",
      totalWords: "總詞彙量",
      studyTime: "學習時間",
      accuracy: "準確率",
    },
    hsk: {
      title: "HSK 中文",
    },
    vietnamese: {
      title: "越南語",
    },
    currentLevel: "目前級別",
    wordsProgress: "已學詞彙",
    lessonsProgress: "已完成課程",
    weeklyGoal: {
      title: "每週目標",
      sessions: "本週學習次數",
    },
    achievements: {
      title: "成就",
      firstWeek: "完成第一週",
      words100: "學會100個詞彙",
      accuracy90: "達到90%準確率",
    },
    statistics: {
      title: "學習統計",
      totalStudyDays: "總學習天數",
      favoriteWords: "收藏詞彙",
      studyTime: "總學習時間",
    },
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
    reportBug: "回報錯誤",
  },

  // Languages
  languages: {
    en: "English",
    vi: "Tiếng Việt",
    zh: "简体中文",
    "zh-tw": "繁體中文",
  },

  // Learning Languages (for language pair selection)
  learningLanguages: {
    en: "英語",
    vi: "越南語",
    mandarin: "普通話", 
    cantonese: "粵語",
  },
};