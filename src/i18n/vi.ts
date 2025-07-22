import { TranslationKeys } from './en';

export const vi: TranslationKeys = {
  // Navigation
  nav: {
    appTitle: "🐱 EchoMeo",
    vietnamese: "Tiếng Việt",
    vietnameseStudy: "Học Tiếng Việt",
    hsk: "HSK",
    hskStudy: "Học HSK",
    flashcards: "Thẻ ghi nhớ",
    reading: "Đọc hiểu",
    settings: "Cài đặt",
    language: "Ngôn ngữ",
    toggleDarkMode: "Chế độ tối/sáng",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
  },

  // Homepage
  home: {
    title: "🐱 EchoMeo",
    subtitle: "Nền tảng học đa ngôn ngữ",
    vietnamese: {
      title: "Tiếng Việt",
      description: "Học từ vựng tiếng Việt với bản dịch tiếng Trung qua 6 cấp độ (A1-C1)",
      browseVocabulary: "📚 Duyệt từ vựng",
      practiceFlashcards: "🧠 Luyện thẻ ghi nhớ",
      features: "Phát âm, lặp lại theo khoảng cách, bối cảnh văn hóa",
    },
    hsk: {
      title: "汉语 HSK",
      description: "Thành thạo tiếng Trung với từ vựng HSK qua 6 cấp độ",
      browseVocabulary: "📚 Duyệt từ vựng",
      practiceFlashcards: "🧠 Luyện thẻ ghi nhớ",
      features: "Pinyin, âm thanh, luyện chữ Hán, ghi chú ngữ pháp",
    },
    reading: {
      title: "📖 Luyện đọc",
      description: "Luyện đọc với tra cứu từ vựng",
      startReading: "Bắt đầu luyện đọc",
    },
  },

  // Landing Page
  landing: {
    welcome: {
      title: "Chào mừng đến với 🐱 EchoMeo",
      subtitle: "Hãy thiết lập trải nghiệm học tập của bạn"
    },
    steps: {
      language: "Ngôn ngữ",
      audio: "Âm thanh"
    },
    language: {
      title: "Chọn Ngôn Ngữ Giao Diện",
      description: "Chọn ngôn ngữ bạn muốn sử dụng cho giao diện"
    },
    audio: {
      title: "Cấu Hình Cài Đặt Âm Thanh",
      description: "Điều chỉnh cài đặt giọng nói và kiểm tra phát âm"
    },
    theme: {
      toggle: "Chuyển Chế Độ"
    },
    continue: "Tiếp tục",
    back: "Quay lại",
    skip: "Bỏ qua thiết lập",
    startLearning: "Bắt đầu học"
  },

  // Settings
  settings: {
    title: "Cài đặt",
    interfaceLanguage: {
      title: "🌐 Ngôn ngữ giao diện",
      description: "Chọn ngôn ngữ giao diện ưa thích",
    },
    audio: {
      title: "🔊 Cài đặt âm thanh",
      volume: "Âm lượng",
      speechRate: "Tốc độ phát âm",
      speechPitch: "Cao độ giọng",
      pitch: "Cao độ",
      selectVoice: "Chọn giọng đọc...",
      playing: "Đang phát...",
      testVietnamese: "🇻🇳 Thử tiếng Việt",
      testChinese: "🇨🇳 Thử tiếng Trung",
      vietnameseVoice: "Giọng tiếng Việt",
      chineseVoice: "Giọng tiếng Trung",
      test: "Kiểm tra",
      testing: "Đang kiểm tra...",
      resetDefaults: "Khôi phục mặc định",
      autoSelectVoice: "Tự động chọn giọng tốt nhất",
      noVietnameseVoices: "Không có giọng tiếng Việt",
      noChineseVoices: "Không có giọng tiếng Trung",
      tips: {
        title: "💡 Mẹo âm thanh:",
        items: [
          "Tốc độ chậm hơn (0.7x) giúp học phát âm tốt hơn",
          "Điều chỉnh cao độ để tìm giọng thoải mái nhất",
          "Dùng 'Tự động chọn giọng tốt nhất' để tìm giọng chất lượng cao",
          "Kiểm tra giọng để tìm giọng phù hợp với thiết bị của bạn",
        ],
      },
    },
  },

  // Vocabulary
  vocabulary: {
    searchPlaceholder: "Tìm kiếm từ vựng (tiếng Trung, tiếng Việt, tiếng Anh, Pinyin, hoặc danh mục)...",
    total: "Tổng",
    favorites: "Yêu thích",
    showing: "Hiển thị",
    search: "Tìm kiếm",
    loadingLevel: "Đang tải từ vựng {level} được mở rộng...",
    noVocabularyLoaded: "Chưa tải từ vựng nào",
    loadLevel: "Tải {level}",
    clearFilters: "Xóa bộ lọc",
    retryLoading: "Thử lại",
    vocabularyList: "Danh sách từ vựng",
    currentItem: "Mục hiện tại",
    clickToJump: "Click để nhảy đến mục",
    showList: "Hiện danh sách",
    hideList: "Ẩn danh sách",
    position: "Vị trí",
    keyboardHints: "Phím tắt",
    previous: "Trước",
    next: "Tiếp theo",
    items: "mục",
    noItems: "Không có mục nào",
    noSearchResults: "Không tìm thấy kết quả",
    currentLevel: "Cấp độ hiện tại",
    totalItems: "Tổng số mục",
    showFavorites: "Hiện yêu thích",
    addToFavorites: "Thêm vào yêu thích",
    removeFromFavorites: "Xóa khỏi yêu thích",
    
    // HSK Vocabulary Page
    hsk: {
      title: "Từ vựng HSK",
      description: "Duyệt từ vựng HSK với bản dịch tiếng Việt",
      practiceFlashcards: "🧠 Luyện thẻ ghi nhớ",
      allVocabulary: "Tất cả từ vựng",
      favoritesButton: "★ Yêu thích",
      about: {
        title: "Về từ vựng HSK",
        description: "HSK là kỳ thi năng lực tiếng Trung chuẩn hóa. Học từ vựng với bản dịch tiếng Việt, ý nghĩa chi tiết và câu ví dụ.",
        availableContent: {
          title: "Nội dung có sẵn:",
          items: [
            "HSK cấp 1-7: Tổng cộng 10963 từ",
            "Bản dịch và ý nghĩa tiếng Việt",
            "Phát âm Pinyin và ví dụ",
            "Chỉ số tần suất sử dụng"
          ]
        },
        features: {
          title: "Tính năng:",
          items: [
            "Phát âm bằng giọng nói",
            "Luyện tập lặp lại theo khoảng cách",
            "Học nét chữ Hán",
            "Hệ thống theo dõi tiến độ"
          ]
        }
      },
      selectLevel: "Chọn cấp độ để bắt đầu học",
      level1: {
        description: "Từ vựng cơ bản cho người mới bắt đầu (506 từ)"
      },
      level2: {
        description: "Xây dựng từ vựng sơ cấp (750 từ)"
      },
      level3: {
        description: "Mở rộng từ vựng trung cấp (953 từ)"
      },
      level4: {
        description: "Từ vựng trung cấp cao (971 từ)"
      },
      level5: {
        description: "Thành thạo từ vựng nâng cao (1059 từ)"
      },
      level6: {
        description: "Thành thạo từ vựng cao cấp (1123 từ)"
      },
      level7: {
        description: "Thành thạo từ vựng chuyên gia (5601 từ)"
      }
    },

    // Vietnamese Vocabulary Page
    vietnamese: {
      title: "Từ vựng tiếng Việt",
      description: "Duyệt từ vựng tiếng Việt với bản dịch tiếng Trung",
      practiceFlashcards: "🧠 Luyện thẻ ghi nhớ",
      allVocabulary: "Tất cả từ vựng",
      favoritesButton: "★ Yêu thích",
      selectLevel: "Chọn cấp độ để bắt đầu học",
      level: "Cấp độ",
      level1: {
        description: "Từ vựng cơ bản cho người mới bắt đầu (cấp A1)"
      },
      level2: {
        description: "Xây dựng từ vựng sơ cấp (cấp A2)"
      },
      level3: {
        description: "Mở rộng từ vựng trung cấp (cấp B1)"
      },
      level4: {
        description: "Từ vựng trung cấp cao (cấp B2)"
      },
      level5: {
        description: "Thành thạo từ vựng nâng cao (cấp C1)"
      },
      level6: {
        description: "Thành thạo từ vựng cao cấp (cấp C1+)"
      },
      about: {
        title: "Về từ vựng tiếng Việt",
        description: "Học từ vựng tiếng Việt với bản dịch tiếng Trung toàn diện qua 6 cấp độ CEFR từ A1 đến C1.",
        availableContent: {
          title: "Nội dung có sẵn:",
          items: [
            "CEFR cấp A1-C1: Tổng cộng hơn 6000 từ",
            "Bản dịch và ý nghĩa tiếng Trung",
            "Phát âm và ví dụ",
            "Ghi chú bối cảnh văn hóa và cách sử dụng"
          ]
        },
        features: {
          title: "Tính năng:",
          items: [
            "Giọng người bản ngữ",
            "Hệ thống lặp lại theo khoảng cách",
            "Học bối cảnh văn hóa",
            "Theo dõi tiến độ và phân tích"
          ]
        }
      }
    }
  },

  // Common
  common: {
    loading: "Đang tải...",
    error: "Lỗi",
    retry: "Thử lại",
    close: "Đóng",
    back: "Quay lại",
    next: "Tiếp theo",
    previous: "Trước",
    save: "Lưu",
    cancel: "Hủy",
    confirm: "Xác nhận",
    reportBug: "Báo lỗi",
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
    en: "Tiếng Anh",
    vi: "Tiếng Việt",
    mandarin: "Tiếng Quan Thoại", 
    cantonese: "Tiếng Quảng Đông",
  },
};