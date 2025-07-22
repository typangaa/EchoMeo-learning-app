import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFavorites } from '../stores';
import useVietnameseVocabulary from '../hooks/useVietnameseVocabulary';
import VietnameseFlashcardPractice from '../components/vocabulary/flashcard/VietnameseFlashcardPractice';
import { VocabularyItem } from '../types';
import { lessonCompletionTracker } from '../utils/lessonCompletion';

const VietnameseFlashcardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const favorites = useFavorites();
  const [selectingOptions, setSelectingOptions] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [itemSource, setItemSource] = useState<'all' | 'favorites'>('all');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  
  const WORDS_PER_LESSON = 20;
  
  // Use the Vietnamese vocabulary hook
  const {
    vocabulary: vietnameseVocabulary,
    loading,
    error,
    loadLevel,
    availableLevels
  } = useVietnameseVocabulary(1, { loadProgressively: false });
  
  // Initialize level from URL params
  useEffect(() => {
    const levelParam = searchParams.get('level');
    if (levelParam) {
      const level = parseInt(levelParam, 10);
      if (level >= 1 && level <= 6) {
        setSelectedLevel(level);
      }
    }
  }, [searchParams]);
  
  
  // Load selected level when it changes
  useEffect(() => {
    if (availableLevels.includes(selectedLevel)) {
      loadLevel(selectedLevel);
    }
  }, [selectedLevel, loadLevel, availableLevels]);
  
  
  const handleComplete = () => {
    // Return to lesson selection for the current level
    setSelectingOptions(true);
    setSelectedLesson(null);
  };
  
  const startPractice = (source: 'all' | 'favorites', level: number, lesson?: number) => {
    setItemSource(source);
    setSelectedLevel(level);
    setSelectedLesson(lesson || null);
    setSelectingOptions(false);
  };
  
  const getItemsForPractice = (): VocabularyItem[] => {
    let items: VocabularyItem[] = [];
    
    switch (itemSource) {
      case 'all':
        items = vietnameseVocabulary;
        break;
      case 'favorites':
        items = vietnameseVocabulary.filter(item => favorites.vietnamese.has(item.id));
        break;
      default:
        items = vietnameseVocabulary;
    }
    
    // If a specific lesson is selected, return only that lesson's words
    if (selectedLesson !== null && itemSource === 'all') {
      const startIndex = (selectedLesson - 1) * WORDS_PER_LESSON;
      const endIndex = startIndex + WORDS_PER_LESSON;
      return items.slice(startIndex, endIndex);
    }
    
    return items;
  };
  
  const getLessonsForLevel = (): number => {
    return Math.ceil(vietnameseVocabulary.length / WORDS_PER_LESSON);
  };
  
  const getLessonWords = (lessonNumber: number): VocabularyItem[] => {
    const startIndex = (lessonNumber - 1) * WORDS_PER_LESSON;
    const endIndex = startIndex + WORDS_PER_LESSON;
    return vietnameseVocabulary.slice(startIndex, endIndex);
  };
  
  const getAllLessons = (): number[] => {
    const totalLessons = getLessonsForLevel();
    return Array.from({ length: totalLessons }, (_, i) => i + 1);
  };
  
  
  if (!selectingOptions) {
    return (
      <VietnameseFlashcardPractice 
        vocabularyItems={getItemsForPractice()} 
        onComplete={handleComplete}
        vietnameseLevel={selectedLevel}
        lessonNumber={selectedLesson || undefined}
      />
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        <span className="vietnamese-text text-green-600">Vietnamese Level {selectedLevel}</span> Lessons
      </h1>
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading lessons...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6 text-center">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error.message}</span>
        </div>
      )}
      
      {/* Level selector */}
      {!loading && !error && (
        <div className="mb-6 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {availableLevels.map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedLevel === level
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                VN {level}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Progress Summary */}
      {!loading && !error && vietnameseVocabulary.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Level {selectedLevel} Progress</h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                {lessonCompletionTracker.getCompletedLessons('vietnamese', selectedLevel).length} of {getLessonsForLevel()} lessons completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {lessonCompletionTracker.getLevelProgress('vietnamese', selectedLevel, getLessonsForLevel()).percentage}%
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-400">Complete</div>
            </div>
          </div>
          <div className="mt-3 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${lessonCompletionTracker.getLevelProgress('vietnamese', selectedLevel, getLessonsForLevel()).percentage}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Lesson grid */}
      {!loading && !error && vietnameseVocabulary.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-6">
            {getAllLessons().map(lessonNumber => {
              const lessonWords = getLessonWords(lessonNumber);
              const isCompleted = lessonCompletionTracker.isLessonCompleted('vietnamese', selectedLevel, lessonNumber);
              
              return (
                <button
                  key={lessonNumber}
                  onClick={() => startPractice('all', selectedLevel, lessonNumber)}
                  className={`relative p-4 border-2 rounded-lg transition-all duration-200 text-center group ${
                    isCompleted 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                >
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  )}
                  <div className={`text-lg font-bold mb-1 ${
                    isCompleted 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    Lesson {lessonNumber}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {lessonWords.length} words
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isCompleted ? 'Practice again' : 'Click to start'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Back button */}
      <div className="text-center">
        <button
          onClick={() => navigate('/flashcards')}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ← Back to Main Flashcard Selection
        </button>
      </div>
    </div>
  );
};

export default VietnameseFlashcardPage;