// Store type definitions for Zustand state management
import { VocabularyItem } from '../types';

// =============================================================================
// Core Types
// =============================================================================

export type VocabType = 'hsk' | 'vietnamese';
export type StudySessionType = 'flashcard' | 'reading' | 'quiz';
export type LayoutMode = 'list' | 'grid' | 'cards';
export type SupportedLanguage = 'en' | 'vi' | 'zh' | 'zh-tw';
export type LearningLanguage = 'en' | 'vi' | 'mandarin' | 'cantonese';

// Language pair preferences
export interface LanguagePairPreferences {
  fromLanguage: LearningLanguage;
  toLanguage: LearningLanguage;
  showEnglishSupplement: boolean;
}

// =============================================================================
// User Types (Future-ready)
// =============================================================================

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface StudyGoals {
  dailyMinutes: number;
  weeklyMinutes: number;
  targetLevel: string;
  focusAreas: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// =============================================================================
// Vocabulary Types
// =============================================================================

export interface VocabularyFilters {
  levels: string[];
  categories: string[];
  difficulties: string[];
  onlyFavorites: boolean;
  hasAudio: boolean;
}

export interface VocabularyLoadingState {
  hsk: boolean;
  vietnamese: boolean;
}

export interface FavoritesState {
  hsk: Set<number>;
  vietnamese: Set<number>;
}

// =============================================================================
// Progress & Spaced Repetition Types
// =============================================================================

export interface SpacedRepetitionData {
  itemId: number;
  level: number; // 0-5 (learning stages)
  nextReview: Date;
  lastReviewed: Date;
  correctCount: number;
  incorrectCount: number;
  easeFactor: number; // 1.3-2.5
}

export interface UserProgress {
  totalStudyTime: number; // minutes
  dailyStreak: number;
  lastStudyDate: string;
  levelProgress: Map<string, number>; // level -> progress %
  weakAreas: string[]; // topics needing focus
  totalWordsLearned: number;
  averageAccuracy: number;
}

export interface StudySession {
  startTime: Date | null;
  itemsStudied: number;
  correctAnswers: number;
  sessionType: StudySessionType;
  duration: number; // minutes
}

// =============================================================================
// Audio Types
// =============================================================================

export interface AudioItem {
  id: string;
  text: string;
  language: 'vi' | 'zh';
  type: 'vocabulary' | 'passage';
}

export interface AudioQueueItem extends AudioItem {
  duration?: number;
}

export interface AudioState {
  isPlaying: boolean;
  currentAudio: AudioItem | null;
  autoplay: boolean;
  playbackRate: number;
  volume: number;
  pitch: number;
  preferredVietnameseVoice?: string;
  preferredChineseVoice?: string;
  queue: AudioQueueItem[];
  queueIndex: number;
  // Passage playback state
  isPassagePlaying: boolean;
  currentPassageId: string | null;
  currentParagraphIndex: number | null; // -1 for title, >= 0 for paragraphs
  passageLanguage: 'vietnamese' | 'chinese' | null;
  // Individual audio state
  isIndividualPlaying: boolean;
  currentIndividualText: string | null;
  error: string | null;
}

// =============================================================================
// UI Types
// =============================================================================

export interface PopoverState {
  isOpen: boolean;
  position: { x: number; y: number };
  content: any;
}

export interface UIState {
  currentPage: string;
  navigationHistory: string[];
  activeModal: string | null;
  popover: PopoverState;
  layoutMode: LayoutMode;
  sidebarCollapsed: boolean;
}

// =============================================================================
// Store Slice Interfaces
// =============================================================================

export interface AppStore {
  // App-wide settings
  theme: 'light' | 'dark';
  language: 'en' | 'vi' | 'zh' | 'zh-tw';
  isOnline: boolean;
  initialized: boolean;
  languagePairPreferences: LanguagePairPreferences;
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'en' | 'vi' | 'zh' | 'zh-tw') => void;
  setOnlineStatus: (status: boolean) => void;
  initializeApp: () => void;
  setLanguagePairPreferences: (preferences: LanguagePairPreferences) => void;
}

export interface UserStore {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // User preferences
  studyGoals: StudyGoals;
  achievementLevel: number;
  streakCount: number;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  updateStudyGoals: (goals: StudyGoals) => void;
  clearError: () => void;
}

export interface VocabularyStore {
  // Data
  hskVocabulary: Map<number, VocabularyItem[]>; // Level-based
  vietnameseVocabulary: Map<string, VocabularyItem[]>; // CEFR-based
  
  // Favorites (unified)
  favorites: FavoritesState;
  
  // Filtering & Search
  filters: VocabularyFilters;
  searchTerm: string;
  
  // Loading states
  loading: VocabularyLoadingState;
  error: string | null;
  
  // Memoization cache for filtered results
  _memoizedFilters?: Record<string, VocabularyItem[]>;
  
  // Actions
  loadVocabulary: (type: VocabType, level?: number | string) => Promise<void>;
  toggleFavorite: (type: VocabType, id: number) => void;
  setFilters: (filters: Partial<VocabularyFilters>) => void;
  setSearchTerm: (term: string) => void;
  clearError: () => void;
  
  // Computed selectors
  getFilteredVocabulary: (type: VocabType, level?: number | string) => VocabularyItem[];
  getFavoriteCount: (type: VocabType) => number;
}

export interface ProgressStore {
  // Spaced repetition data
  spacedRepetition: Map<number, SpacedRepetitionData>;
  
  // User progress tracking
  userProgress: UserProgress;
  
  // Session data
  currentSession: StudySession;
  
  // Actions
  updateSpacedRepetition: (itemId: number, success: boolean) => void;
  startStudySession: (type: StudySessionType) => void;
  endStudySession: () => void;
  recordAnswer: (correct: boolean) => void;
  syncProgress: () => Promise<void>; // For user sync
  
  // Computed selectors
  getDueItems: () => number[];
  getStudyStats: () => { accuracy: number; streak: number; totalTime: number };
}

export interface AudioStore extends AudioState {
  // Actions
  play: (audio: AudioItem) => void;
  pause: () => void;
  stop: () => void;
  setAutoplay: (enabled: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  setPitch: (pitch: number) => void;
  setPreferredVoice: (language: 'vietnamese' | 'chinese', voiceName: string) => void;
  addToQueue: (items: AudioQueueItem[]) => void;
  clearQueue: () => void;
  nextInQueue: () => void;
  previousInQueue: () => void;
  // Passage playback actions
  playPassage: (passage: any, language: 'vietnamese' | 'chinese') => Promise<void>;
  stopPassage: () => void;
  pausePassage: () => void;
  // Individual audio actions
  playIndividual: (text: string, language: 'vietnamese' | 'chinese') => void;
  stopIndividual: () => void;
  stopAllAudio: () => void;
  // Error handling
  setError: (error: string) => void;
  clearError: () => void;
  // Initialization
  initializeAudioSettings: () => void;
}

export interface UIStore extends UIState {
  // Actions
  setCurrentPage: (page: string) => void;
  navigateBack: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setPopover: (popover: Partial<PopoverState>) => void;
  closePopover: () => void;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleSidebar: () => void;
}

// =============================================================================
// Combined Store Type
// =============================================================================

export interface StoreState extends 
  AppStore, 
  UserStore, 
  VocabularyStore, 
  ProgressStore, 
  AudioStore, 
  UIStore {}