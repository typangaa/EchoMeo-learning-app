import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useFavorites } from '../stores';
import { useHSKVocabulary } from '../hooks/useHSKVocabulary';
import { useVietnameseVocabulary } from '../hooks/useVietnameseVocabulary';
import PronunciationPractice from '../components/pronunciation/PronunciationPractice';
import type { VocabularyItem } from '../types';
import type { PronunciationResult } from '../utils/pronunciationService';

interface PracticeModeConfig {
  id: string;
  title: string;
  description: string;
  vocabularyType: 'regular' | 'hsk' | 'vietnamese';
  language: 'vietnamese' | 'chinese';
  icon: string;
}

const PronunciationPracticePage = () => {
  const { t: _t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedMode, setSelectedMode] = useState<PracticeModeConfig | null>(null);
  const [practiceVocabulary, setPracticeVocabulary] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get favorites from store
  const favorites = useFavorites();
  
  // Use vocabulary hooks to automatically load data - these already work!
  const { 
    vocabulary: hskVocabulary,
    loadLevel: loadHSKLevel,
    availableLevels: hskAvailableLevels 
  } = useHSKVocabulary(1, { loadProgressively: false });
  
  const { 
    vocabulary: vietnameseVocabulary,
    loadLevel: loadVietnameseLevel,
    availableLevels: vietnameseAvailableLevels 
  } = useVietnameseVocabulary(1, { loadProgressively: false });

  // Practice mode configurations
  const practiceModes: PracticeModeConfig[] = [
    {
      id: 'hsk_chinese',
      title: 'HSK Chinese',
      description: 'Practice Chinese pronunciation with HSK vocabulary',
      vocabularyType: 'hsk',
      language: 'chinese',
      icon: '🇨🇳 📚'
    },
    {
      id: 'vietnamese_levels',
      title: 'Vietnamese Levels',
      description: 'Practice Vietnamese pronunciation with level-based vocabulary',
      vocabularyType: 'vietnamese',
      language: 'vietnamese',
      icon: '🇻🇳 📚'
    },
    {
      id: 'hsk_favorites',
      title: 'HSK Favorites',
      description: 'Practice Chinese pronunciation with your favorite HSK words',
      vocabularyType: 'hsk',
      language: 'chinese',
      icon: '🇨🇳 ⭐'
    },
    {
      id: 'vietnamese_favorites',
      title: 'Vietnamese Favorites',
      description: 'Practice Vietnamese pronunciation with your favorite words',
      vocabularyType: 'vietnamese',
      language: 'vietnamese',
      icon: '🇻🇳 ⭐'
    }
  ];

  // Load some initial vocabulary data
  useEffect(() => {
    // Load HSK Level 1 and Vietnamese Level 1 by default to show available vocabulary
    if (hskAvailableLevels.includes(1)) {
      loadHSKLevel(1);
    }
    if (vietnameseAvailableLevels.includes(1)) {
      loadVietnameseLevel(1);
    }
  }, [loadHSKLevel, loadVietnameseLevel, hskAvailableLevels, vietnameseAvailableLevels]);

  // Check for auto-start mode from URL params
  useEffect(() => {
    const mode = searchParams.get('mode');
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    
    if (mode && type) {
      const autoMode = practiceModes.find(m => m.id === mode);
      if (autoMode) {
        handleModeSelect(autoMode, level || undefined);
      }
    }
  }, [searchParams]);

  const handleModeSelect = async (mode: PracticeModeConfig, _level?: string) => {
    setIsLoading(true);
    setSelectedMode(mode);

    try {
      let vocabulary: VocabularyItem[] = [];

      switch (mode.id) {
        case 'hsk_chinese':
          vocabulary = [...hskVocabulary];
          break;
        case 'vietnamese_levels':
          vocabulary = [...vietnameseVocabulary];
          break;
        case 'hsk_favorites':
          vocabulary = hskVocabulary.filter((item: VocabularyItem) => 
            favorites.hsk.has(item.id)
          );
          break;
        case 'vietnamese_favorites':
          vocabulary = vietnameseVocabulary.filter((item: VocabularyItem) => 
            favorites.vietnamese.has(item.id)
          );
          break;
      }

      // Limit to reasonable practice size (max 20 words)
      if (vocabulary.length > 20) {
        vocabulary = vocabulary.slice(0, 20);
      }

      setPracticeVocabulary(vocabulary);
    } catch (error) {
      console.error('Failed to load vocabulary for pronunciation practice:', error);
      setPracticeVocabulary([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePracticeComplete = (results: PronunciationResult[]) => {
    console.log('Pronunciation practice completed:', results);
    // Could save results to localStorage or analytics here
  };

  const handleBackToSelection = () => {
    setSelectedMode(null);
    setPracticeVocabulary([]);
    navigate('/pronunciation-practice', { replace: true });
  };

  // If a mode is selected and vocabulary is loaded, show practice component
  if (selectedMode && practiceVocabulary.length > 0 && !isLoading) {
    return (
      <PronunciationPractice
        vocabulary={practiceVocabulary}
        language={selectedMode.language}
        onComplete={handlePracticeComplete}
        onClose={handleBackToSelection}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  // Show mode selection
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎤</div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Pronunciation Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Improve your Vietnamese and Chinese pronunciation with speech recognition feedback. 
            Choose a practice mode to get started.
          </p>
        </div>

        {/* Practice Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {practiceModes.map((mode) => {
            // Get vocabulary count for this mode
            let vocabularyCount = 0;
            switch (mode.id) {
              case 'hsk_chinese':
                vocabularyCount = hskVocabulary.length;
                break;
              case 'vietnamese_levels':
                vocabularyCount = vietnameseVocabulary.length;
                break;
              case 'hsk_favorites':
                vocabularyCount = hskVocabulary.filter((item: VocabularyItem) => 
                  favorites.hsk.has(item.id)
                ).length;
                break;
              case 'vietnamese_favorites':
                vocabularyCount = vietnameseVocabulary.filter((item: VocabularyItem) => 
                  favorites.vietnamese.has(item.id)
                ).length;
                break;
            }

            return (
              <div
                key={mode.id}
                onClick={() => {
                  if (vocabularyCount > 0) {
                    handleModeSelect(mode);
                  }
                }}
                className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 transition-all duration-200 ${
                  vocabularyCount > 0 
                    ? 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-xl cursor-pointer' 
                    : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{mode.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {mode.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {mode.description}
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {vocabularyCount} words
                    </span>
                    {vocabularyCount === 0 && (
                      <span className="text-xs text-red-500">(No vocabulary loaded)</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-900 dark:text-blue-100">
            💡 Pronunciation Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="font-bold">🎧</span>
                <span>Use headphones for better audio quality</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold">🔇</span>
                <span>Practice in a quiet environment</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold">🗣️</span>
                <span>Speak clearly and at normal volume</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="font-bold">🎯</span>
                <span>Focus on tone and intonation</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold">🔄</span>
                <span>Repeat until you get 85%+ accuracy</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold">📱</span>
                <span>Allow microphone access when prompted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PronunciationPracticePage;