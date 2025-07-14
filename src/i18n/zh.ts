import { TranslationKeys } from './en';

export const zh: TranslationKeys = {
  // Navigation
  nav: {
    appTitle: "学越南语 - Học Tiếng Trung",
    vietnamese: "越南语",
    hsk: "HSK",
    flashcards: "闪卡",
    reading: "阅读",
    settings: "设置",
    toggleDarkMode: "切换深色/浅色模式",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
  },

  // Homepage
  home: {
    title: "学越南语 - Học Tiếng Trung",
    subtitle: "越南语 ↔ 中文语言学习平台",
    vietnamese: {
      title: "Tiếng Việt",
      description: "通过6个级别(A1-C1)学习越南语词汇和中文翻译",
      browseVocabulary: "📚 浏览词汇",
      practiceFlashcards: "🧠 练习闪卡",
      features: "语音发音、间隔重复、文化背景",
    },
    hsk: {
      title: "汉语 HSK",
      description: "通过6个HSK级别掌握中文词汇",
      browseVocabulary: "📚 浏览词汇",
      practiceFlashcards: "🧠 练习闪卡",
      features: "拼音、语音、汉字练习、语法笔记",
    },
    reading: {
      title: "📖 阅读练习",
      description: "通过词汇查找练习阅读",
      startReading: "开始阅读练习",
    },
  },

  // Settings
  settings: {
    title: "设置",
    interfaceLanguage: {
      title: "🌐 界面语言",
      description: "选择您偏好的界面语言",
    },
    audio: {
      title: "🔊 音频设置",
      volume: "音量",
      speechRate: "语音速度",
      speechPitch: "语音音调",
      vietnameseVoice: "越南语语音",
      chineseVoice: "中文语音",
      test: "测试",
      testing: "正在测试...",
      resetDefaults: "重置为默认值",
      autoSelectVoice: "自动选择最佳语音",
      noVietnameseVoices: "没有可用的越南语语音",
      noChineseVoices: "没有可用的中文语音",
      tips: {
        title: "💡 音频提示：",
        items: [
          "较慢的语音速度(0.7x)有助于发音学习",
          "调整音调以找到最舒适的语音音色",
          "使用'自动选择最佳语音'来找到最高质量的语音",
          "测试语音以找到最适合您设备的语音",
        ],
      },
    },
  },

  // Vocabulary
  vocabulary: {
    searchPlaceholder: "搜索词汇（中文、越南语、英语、拼音或类别）...",
    total: "总计",
    favorites: "收藏",
    showing: "显示",
    search: "搜索",
    loadingLevel: "正在加载{level}扩展词汇...",
    noVocabularyLoaded: "尚未加载词汇",
    loadLevel: "加载{level}",
    clearFilters: "清除筛选",
    retryLoading: "重试加载",
    
    // HSK Vocabulary Page
    hsk: {
      title: "HSK词汇",
      description: "浏览带有越南语翻译的HSK词汇",
      practiceFlashcards: "🧠 练习闪卡",
      allVocabulary: "所有词汇",
      favoritesButton: "★ 收藏",
      about: {
        title: "关于HSK词汇",
        description: "HSK是标准化的中文水平考试。学习带有越南语翻译、详细含义和例句的词汇。",
        availableContent: {
          title: "可用内容：",
          items: [
            "HSK 1-6级：总计5000+词汇",
            "越南语翻译和含义",
            "拼音发音和例句",
            "使用频率指标"
          ]
        },
        features: {
          title: "功能特色：",
          items: [
            "语音发音",
            "间隔重复练习",
            "汉字笔画学习",
            "进度跟踪系统"
          ]
        }
      }
    },

    // Vietnamese Vocabulary Page
    vietnamese: {
      title: "越南语词汇",
      description: "浏览带有中文翻译的越南语词汇",
      practiceFlashcards: "🧠 练习闪卡",
      allVocabulary: "所有词汇",
      favoritesButton: "★ 收藏",
      about: {
        title: "关于越南语词汇",
        description: "通过6个CEFR级别从A1到C1学习带有全面中文翻译的越南语词汇。",
        availableContent: {
          title: "可用内容：",
          items: [
            "CEFR A1-C1级：总计6000+词汇",
            "中文翻译和含义",
            "语音发音和例句",
            "文化背景和使用说明"
          ]
        },
        features: {
          title: "功能特色：",
          items: [
            "母语发音",
            "间隔重复系统",
            "文化背景学习",
            "进度跟踪和分析"
          ]
        }
      }
    }
  },

  // Common
  common: {
    loading: "加载中...",
    error: "错误",
    retry: "重试",
    close: "关闭",
    back: "返回",
    next: "下一页",
    previous: "上一页",
    save: "保存",
    cancel: "取消",
    confirm: "确认",
  },

  // Languages
  languages: {
    en: "English",
    vi: "Tiếng Việt",
    zh: "简体中文",
    "zh-tw": "繁體中文",
  },
};