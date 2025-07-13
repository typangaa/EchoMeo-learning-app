import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../stores';
import useHSKVocabulary from '../hooks/useHSKVocabulary';
import HSKFlashcardPractice from '../components/vocabulary/flashcard/HSKFlashcardPractice';
import AutoplayToggle from '../components/common/AutoplayToggle';

const HSKFlashcardPage = () => {
  const navigate = useNavigate();
  const favorites = useFavorites();
  const [selectingOptions, setSelectingOptions] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [itemSource, setItemSource] = useState<'all' | 'favorites'>('all');
  
  // Use the HSK vocabulary hook
  const {
    vocabulary: hskVocabulary,
    loading,
    error,
    loadLevel,
    availableLevels
  } = useHSKVocabulary(1, { loadProgressively: false });
  
  // Load selected level when it changes
  useEffect(() => {
    if (availableLevels.includes(selectedLevel)) {
      loadLevel(selectedLevel);
    }
  }, [selectedLevel, loadLevel, availableLevels]);
  
  const handleComplete = () => {
    navigate('/hsk');
  };
  
  const startPractice = (source: 'all' | 'favorites', level: number) => {
    setItemSource(source);
    setSelectedLevel(level);
    setSelectingOptions(false);
  };
  
  const getItemsForPractice = () => {
    switch (itemSource) {
      case 'all':
        return hskVocabulary;
      case 'favorites':
        return hskVocabulary.filter(item => favorites.hsk.has(item.id));
      default:
        return hskVocabulary;
    }
  };
  
  const favoriteHSKItems = hskVocabulary.filter(item => favorites.hsk.has(item.id));
  
  if (!selectingOptions) {
    return (
      <HSKFlashcardPractice 
        vocabularyItems={getItemsForPractice()} 
        onComplete={handleComplete}
        hskLevel={selectedLevel}
      />
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        <span className="chinese-text text-red-600">HSK 汉语水平考试</span> Flashcard Practice
      </h1>
      
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-red-800 dark:text-red-200">HSK Flashcards</h2>
        <p className="text-red-700 dark:text-red-300 text-xs sm:text-sm">
          Practice Chinese vocabulary with Vietnamese translations and audio pronunciation.
        </p>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-sm sm:text-base">Loading HSK {selectedLevel} vocabulary...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-3 sm:px-4 py-3 rounded mb-4 sm:mb-6">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline text-sm sm:text-base"> {error.message}</span>
        </div>
      )}
      
      {/* Options selection */}
      {!loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Practice Options</h2>
          
          <div className="space-y-4 sm:space-y-6">
            {/* HSK Level Selection */}
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Choose HSK Level</h3>
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                {availableLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                      selectedLevel === level
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    HSK {level}
                  </button>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                HSK Levels 1-6 are available with enriched Vietnamese translations.
              </p>
            </div>
            
            {/* Practice options for selected level */}
            {hskVocabulary.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">What to Practice</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => startPractice('all', selectedLevel)}
                    className="p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                  >
                    <h4 className="font-medium mb-1 text-sm sm:text-base">All HSK {selectedLevel} Vocabulary</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Practice all {hskVocabulary.length} words from HSK Level {selectedLevel}
                    </p>
                  </button>
                  
                  {favoriteHSKItems.length > 0 && (
                    <button
                      onClick={() => startPractice('favorites', selectedLevel)}
                      className="p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors text-left"
                    >
                      <h4 className="font-medium mb-1 text-sm sm:text-base">★ Favorite HSK Words</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Practice your {favoriteHSKItems.length} favorite HSK words
                      </p>
                    </button>
                  )}
                </div>
                
                {/* Audio Settings */}
                <div className="mt-4 sm:mt-6">
                  <h4 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 text-gray-700 dark:text-gray-300">
                    🔊 Audio Settings
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                    Configure your audio preferences for flashcard practice.
                  </p>
                  <AutoplayToggle showAdvancedOptions={true} />
                </div>
              </div>
            )}
            
            {/* Statistics */}
            {hskVocabulary.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
                <h4 className="font-medium mb-2 text-sm sm:text-base">Your Progress</h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="text-center">
                    <span className="font-medium block">Total HSK {selectedLevel}:</span>
                    <div className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">
                      {hskVocabulary.length}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="font-medium block">Favorites:</span>
                    <div className="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {favoriteHSKItems.length}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="font-medium block">Available Levels:</span>
                    <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {availableLevels.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Tips section */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200 text-sm sm:text-base">💡 Study Tips:</h3>
        <ul className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-1">
          <li>Practice daily for best results</li>
          <li>Listen to pronunciation carefully</li>
          <li>Review your favorite words regularly</li>
          <li>Use audio settings to customize your experience</li>
        </ul>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          className="px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
        >
          Back to HSK Vocabulary
        </button>
      </div>
    </div>
  );
};

export default HSKFlashcardPage;