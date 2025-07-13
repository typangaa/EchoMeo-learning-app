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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        <span className="chinese-text text-red-600">HSK 汉语水平考试</span> Flashcard Practice
      </h1>
      
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">About HSK Flashcards</h2>
        <p className="text-red-700 dark:text-red-300 text-sm">
          Practice Chinese vocabulary from the Hanyu Shuiping Kaoshi (HSK) standardized test. 
          Our flashcards include Vietnamese translations, pinyin pronunciation, and example sentences 
          to help you master Chinese vocabulary effectively.
        </p>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p>Loading HSK {selectedLevel} vocabulary...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error.message}</span>
        </div>
      )}
      
      {/* Options selection */}
      {!loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Practice Options</h2>
          
          <div className="space-y-6">
            {/* HSK Level Selection */}
            <div>
              <h3 className="text-lg font-medium mb-3">Choose HSK Level</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {availableLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedLevel === level
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    HSK {level}
                  </button>
                ))}
                
                {/* Show unavailable levels */}
                {[4, 5, 6, 7].map(level => (
                  <button
                    key={level}
                    disabled
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    title="Coming soon"
                  >
                    HSK {level}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Currently HSK Levels 1-3 are available with enriched Vietnamese translations.
              </p>
            </div>
            
            {/* Practice options for selected level */}
            {hskVocabulary.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">What to Practice</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => startPractice('all', selectedLevel)}
                    className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <h4 className="font-medium mb-1">All HSK {selectedLevel} Vocabulary</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Practice all {hskVocabulary.length} words from HSK Level {selectedLevel}
                    </p>
                  </button>
                  
                  {favoriteHSKItems.length > 0 && (
                    <button
                      onClick={() => startPractice('favorites', selectedLevel)}
                      className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                    >
                      <h4 className="font-medium mb-1">★ Favorite HSK Words</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Practice your {favoriteHSKItems.length} favorite HSK words
                      </p>
                    </button>
                  )}
                </div>
                
                {/* Audio Settings - moved here for better visibility */}
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">
                    🔊 Audio Settings
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Configure your audio preferences for flashcard practice.
                  </p>
                  <AutoplayToggle showAdvancedOptions={true} />
                </div>
              </div>
            )}
            
            {/* Statistics */}
            {hskVocabulary.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Your Progress</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total HSK {selectedLevel}:</span>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {hskVocabulary.length}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Favorites:</span>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {favoriteHSKItems.length}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Available Levels:</span>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
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
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">💡 HSK Study Tips:</h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-1">
          <li>Focus on high-frequency words first - they appear most often in the HSK test</li>
          <li>HSK Level 1 practices Chinese → Vietnamese recognition (one direction only)</li>
          <li>Use the audio settings above to configure automatic pronunciation</li>
          <li>Review your favorite words regularly for better retention</li>
          <li>Pay attention to pinyin pronunciation - it's crucial for speaking Chinese</li>
        </ul>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Back to HSK Vocabulary
        </button>
      </div>
    </div>
  );
};

export default HSKFlashcardPage;