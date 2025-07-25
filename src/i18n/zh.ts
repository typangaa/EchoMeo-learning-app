import { TranslationKeys } from './en';

export const zh: TranslationKeys = {
  // Navigation
  nav: {
    appTitle: "🐱 EchoMeo",
    home: "首页",
    browse: "浏览",
    study: "学习",
    vietnamese: "越南语",
    vietnameseStudy: "越南语学习",
    hsk: "HSK",
    hskStudy: "HSK学习",
    flashcards: "闪卡",
    reading: "阅读",
    progress: "学习进度",
    settings: "设置",
    language: "语言",
    toggleDarkMode: "切换深色/浅色模式",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
  },

  // Homepage
  home: {
    title: "🐱 EchoMeo",
    subtitle: "多语言学习平台",
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

  // Landing Page
  landing: {
    welcome: {
      title: "欢迎来到🐱 EchoMeo",
      subtitle: "让我们设置您的学习体验"
    },
    steps: {
      interface: "界面",
      languages: "语言",
      audio: "音频"
    },
    interface: {
      title: "选择界面语言",
      description: "选择您希望用于界面的语言"
    },
    languages: {
      title: "选择学习语言",
      description: "选择您要学习的语言",
      fromLanguage: "从语言",
      toLanguage: "到语言",
      englishSupplement: "显示英语",
      englishSupplementDescription: "在所选语言旁显示英语翻译以便更好地理解"
    },
    audio: {
      title: "配置音频设置",
      description: "调整语音设置并测试发音"
    },
    theme: {
      toggle: "切换主题"
    },
    continue: "继续",
    back: "返回",
    skip: "跳过设置",
    startLearning: "开始学习"
  },

  // Settings
  settings: {
    title: "设置",
    interfaceLanguage: {
      title: "🌐 界面语言",
      description: "选择您偏好的界面语言",
    },
    languagePair: {
      title: "📚 语言学习方向",
      description: "配置您的语言学习方向",
      fromLanguage: "从语言",
      toLanguage: "到语言",
      englishSupplement: "显示英语",
      englishSupplementDescription: "在所选语言旁显示英语翻译以便更好地理解"
    },
    theme: {
      title: "🎨 主题与外观",
      description: "使用您喜好的颜色和外观自定义学习环境",
      colorTitle: "主题颜色",
      colorDescription: "选择激发学习动力的颜色主题",
      modeTitle: "外观模式",
      modeDescription: "选择您偏好的亮度设置",
      preview: "当前选择",
    },
    audio: {
      title: "🔊 音频设置",
      volume: "音量",
      speechRate: "语音速度",
      speechPitch: "语音音调",
      pitch: "音调",
      selectVoice: "选择声音...",
      playing: "正在播放...",
      testVietnamese: "🇻🇳 测试越南语",
      testChinese: "🇨🇳 测试中文",
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
    vocabularyList: "词汇列表",
    currentItem: "当前项",
    clickToJump: "点击跳转到项目",
    showList: "显示列表",
    hideList: "隐藏列表",
    position: "位置",
    keyboardHints: "键盘快捷键",
    previous: "上一个",
    next: "下一个",
    items: "项",
    noItems: "没有可用项目",
    noSearchResults: "未找到搜索结果",
    currentLevel: "当前级别",
    totalItems: "总项目数",
    showFavorites: "显示收藏",
    addToFavorites: "添加到收藏",
    removeFromFavorites: "从收藏中移除",
    
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
            "HSK 1-7级：总计10963个词汇",
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
      },
      selectLevel: "选择级别开始学习",
      level1: {
        description: "初学者基础词汇（506个词）"
      },
      level2: {
        description: "初级词汇建设（750个词）"
      },
      level3: {
        description: "中级词汇扩展（953个词）"
      },
      level4: {
        description: "中高级词汇（971个词）"
      },
      level5: {
        description: "高级词汇掌握（1059个词）"
      },
      level6: {
        description: "优秀词汇水平（1123个词）"
      },
      level7: {
        description: "专家词汇掌握（5601个词）"
      }
    },

    // Vietnamese Vocabulary Page
    vietnamese: {
      title: "越南语词汇",
      description: "浏览带有中文翻译的越南语词汇",
      practiceFlashcards: "🧠 练习闪卡",
      allVocabulary: "所有词汇",
      favoritesButton: "★ 收藏",
      selectLevel: "选择级别开始学习",
      level: "级别",
      level1: {
        description: "初学者基础词汇（A1级）"
      },
      level2: {
        description: "初级词汇建设（A2级）"
      },
      level3: {
        description: "中级词汇扩展（B1级）"
      },
      level4: {
        description: "中高级词汇（B2级）"
      },
      level5: {
        description: "高级词汇掌握（C1级）"
      },
      level6: {
        description: "优秀词汇水平（C1+级）"
      },
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

  // Progress
  progress: {
    title: "学习进度",
    overview: {
      title: "概览",
      streak: "学习连击",
      totalWords: "总词汇量",
      studyTime: "学习时间",
      accuracy: "准确率",
    },
    hsk: {
      title: "HSK 中文",
    },
    vietnamese: {
      title: "越南语",
    },
    currentLevel: "当前级别",
    wordsProgress: "已学词汇",
    lessonsProgress: "已完成课程",
    weeklyGoal: {
      title: "每周目标",
      sessions: "本周学习次数",
    },
    achievements: {
      title: "成就",
      firstWeek: "完成第一周",
      words100: "学会100个词汇",
      accuracy90: "达到90%准确率",
    },
    statistics: {
      title: "学习统计",
      totalStudyDays: "总学习天数",
      favoriteWords: "收藏词汇",
      studyTime: "总学习时间",
    },
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
    reportBug: "报告错误",
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
    en: "英语",
    vi: "越南语",
    mandarin: "普通话", 
    cantonese: "粤语",
  },
};