import { useState } from 'react';
import { Link } from 'react-router-dom';
import AutoplayToggle from '../components/common/AutoplayToggle';
import { useAppStore } from '../stores';

const FlashcardPage = () => {
  const languagePairPreferences = useAppStore((state) => state.languagePairPreferences);
  const [selectedHSKLevel, setSelectedHSKLevel] = useState<number>(1);
  const [selectedVietnameseLevel, setSelectedVietnameseLevel] = useState<number>(1);

  // Determine which flashcard options to show based on target language
  const showHSK = languagePairPreferences.toLanguage === 'mandarin';
  const showVietnamese = languagePairPreferences.toLanguage === 'vi';

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 lg:mb-6 flex-shrink-0">Flashcard Practice</h1>
      
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 sm:space-y-4 lg:space-y-6">
      
        {/* Audio Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4">🔊 Audio Settings</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 lg:mb-4">
            Configure your audio preferences for flashcard practice.
          </p>
          <AutoplayToggle showAdvancedOptions={true} />
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
          {/* HSK Flashcards - Show only when target language is Mandarin */}
          {showHSK && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 lg:p-6 border-2 border-red-200 dark:border-red-800 max-w-2xl mx-auto">
              <div className="flex items-center mb-2 sm:mb-3 lg:mb-4">
                <span className="text-lg sm:text-xl lg:text-2xl mr-2 sm:mr-3">🇨🇳</span>
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold">
                  <span className="chinese-text text-red-600">HSK 汉语水平考试</span>
                </h2>
              </div>
              
              {/* HSK Level Selection */}
              <div className="mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm lg:text-base font-medium mb-2">Choose HSK Level:</h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedHSKLevel(level)}
                      className={`px-2 sm:px-3 py-1 rounded transition-colors text-xs sm:text-sm ${
                        selectedHSKLevel === level
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      HSK {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <Link 
                to={`/hsk-flashcards?level=${selectedHSKLevel}`}
                className="inline-block bg-red-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-700 transition-colors w-full text-center text-xs sm:text-sm lg:text-base"
              >
                Practice HSK {selectedHSKLevel} Flashcards
              </Link>
            </div>
          )}
        
          {/* Vietnamese Vocabulary Flashcards - Show only when target language is Vietnamese */}
          {showVietnamese && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 lg:p-6 border-2 border-green-200 dark:border-green-800 max-w-2xl mx-auto">
              <div className="flex items-center mb-2 sm:mb-3 lg:mb-4">
                <span className="text-lg sm:text-xl lg:text-2xl mr-2 sm:mr-3">🇻🇳</span>
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold">
                  <span className="vietnamese-text text-green-600">Từ vựng tiếng Việt</span>
                </h2>
              </div>
              
              {/* Vietnamese Level Selection */}
              <div className="mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm lg:text-base font-medium mb-2">Choose Vietnamese Level:</h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5, 6].map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedVietnameseLevel(level)}
                      className={`px-2 sm:px-3 py-1 rounded transition-colors text-xs sm:text-sm ${
                        selectedVietnameseLevel === level
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      VN {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <Link 
                to={`/vietnamese-flashcards?level=${selectedVietnameseLevel}`}
                className="inline-block bg-green-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-green-700 transition-colors w-full text-center text-xs sm:text-sm lg:text-base"
              >
                Practice Vietnamese {selectedVietnameseLevel} Flashcards
              </Link>
            </div>
          )}

          {/* Fallback message if no language is configured */}
          {!showHSK && !showVietnamese && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 sm:p-6 text-center max-w-2xl mx-auto">
              <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-4">⚙️</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                No Flashcards Available
              </h3>
              <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 mb-3 sm:mb-4">
                Please configure your learning language preferences in Settings to access flashcards.
              </p>
              <Link 
                to="/settings"
                className="inline-block bg-yellow-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-yellow-700 transition-colors text-xs sm:text-sm lg:text-base"
              >
                Go to Settings
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;