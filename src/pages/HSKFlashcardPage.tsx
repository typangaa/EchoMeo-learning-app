import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFavorites } from '../stores';
import useHSKVocabulary from '../hooks/useHSKVocabulary';
import HSKFlashcardPractice from '../components/vocabulary/flashcard/HSKFlashcardPractice';
import { VocabularyItem } from '../types';
import { lessonCompletionTracker } from '../utils/lessonCompletion';

const HSKFlashcardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const favorites = useFavorites();
  const [selectingOptions, setSelectingOptions] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [itemSource, setItemSource] = useState<'all' | 'favorites'>('all');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  const WORDS_PER_LESSON = 20;
  const LESSONS_PER_PAGE_MOBILE = 5;
  const LESSONS_PER_PAGE_DESKTOP = 10;
  
  // Use the HSK vocabulary hook
  const {
    vocabulary: hskVocabulary,
    loading,
    error,
    loadLevel,
    availableLevels
  } = useHSKVocabulary(1, { loadProgressively: false });
  
  // Initialize level from URL params
  useEffect(() => {
    const levelParam = searchParams.get('level');
    if (levelParam) {
      const level = parseInt(levelParam, 10);
      if (level >= 1 && level <= 7) {
        setSelectedLevel(level);
      }
    }
  }, [searchParams]);
  
  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Load selected level when it changes
  useEffect(() => {
    if (availableLevels.includes(selectedLevel)) {
      loadLevel(selectedLevel);
    }
  }, [selectedLevel, loadLevel, availableLevels]);
  
  // Reset page when mobile state changes to avoid pagination issues
  useEffect(() => {
    setCurrentPage(1);
  }, [isMobile]);
  
  const handleComplete = () => {
    // Return to HSK level practice selection
    setSelectingOptions(true);
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
        items = hskVocabulary;
        break;
      case 'favorites':
        items = hskVocabulary.filter(item => favorites.hsk.has(item.id));
        break;
      default:
        items = hskVocabulary;
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
    return Math.ceil(hskVocabulary.length / WORDS_PER_LESSON);
  };
  
  const getLessonWords = (lessonNumber: number): VocabularyItem[] => {
    const startIndex = (lessonNumber - 1) * WORDS_PER_LESSON;
    const endIndex = startIndex + WORDS_PER_LESSON;
    return hskVocabulary.slice(startIndex, endIndex);
  };
  
  const getVisibleLessons = (): number[] => {
    const totalLessons = getLessonsForLevel();
    const lessonsPerPage = isMobile ? LESSONS_PER_PAGE_MOBILE : LESSONS_PER_PAGE_DESKTOP;
    const startIndex = (currentPage - 1) * lessonsPerPage;
    const endIndex = Math.min(startIndex + lessonsPerPage, totalLessons);
    
    return Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i + 1);
  };
  
  const getTotalPages = (): number => {
    const totalLessons = getLessonsForLevel();
    const lessonsPerPage = isMobile ? LESSONS_PER_PAGE_MOBILE : LESSONS_PER_PAGE_DESKTOP;
    return Math.ceil(totalLessons / lessonsPerPage);
  };
  
  if (!selectingOptions) {
    return (
      <HSKFlashcardPractice 
        vocabularyItems={getItemsForPractice()} 
        onComplete={handleComplete}
        hskLevel={selectedLevel}
        lessonNumber={selectedLesson || undefined}
      />
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        <span className="chinese-text text-red-600">HSK Level {selectedLevel}</span> Lessons
      </h1>
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
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
                onClick={() => {
                  setSelectedLevel(level);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedLevel === level
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                HSK {level}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Progress Summary */}
      {!loading && !error && hskVocabulary.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">HSK Level {selectedLevel} Progress</h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                {lessonCompletionTracker.getCompletedLessons('hsk', selectedLevel).length} of {getLessonsForLevel()} lessons completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {lessonCompletionTracker.getLevelProgress('hsk', selectedLevel, getLessonsForLevel()).percentage}%
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-400">Complete</div>
            </div>
          </div>
          <div className="mt-3 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${lessonCompletionTracker.getLevelProgress('hsk', selectedLevel, getLessonsForLevel()).percentage}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Lesson grid */}
      {!loading && !error && hskVocabulary.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {getVisibleLessons().map(lessonNumber => {
              const lessonWords = getLessonWords(lessonNumber);
              const isCompleted = lessonCompletionTracker.isLessonCompleted('hsk', selectedLevel, lessonNumber);
              
              return (
                <button
                  key={lessonNumber}
                  onClick={() => startPractice('all', selectedLevel, lessonNumber)}
                  className={`relative p-4 border-2 rounded-lg transition-all duration-200 text-center group ${
                    isCompleted 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  )}
                  <div className={`text-lg font-bold mb-1 ${
                    isCompleted 
                      ? 'text-red-700 dark:text-red-300' 
                      : 'text-red-600 dark:text-red-400'
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
          
          {/* Pagination */}
          {getTotalPages() > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {getTotalPages()}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
                disabled={currentPage === getTotalPages()}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
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

export default HSKFlashcardPage;