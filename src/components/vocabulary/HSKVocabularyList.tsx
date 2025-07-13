import React, { useState } from 'react';
import useHSKVocabulary from '../../hooks/useHSKVocabulary';
import HSKVocabularyCard from './HSKVocabularyCard';
import { useFavorites } from '../../stores';

interface HSKVocabularyListProps {
  initialLevel?: number;
  showFavoritesOnly?: boolean;
}

const HSKVocabularyList: React.FC<HSKVocabularyListProps> = ({ 
  initialLevel = 1,
  showFavoritesOnly = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number>(initialLevel);
  
  // Use Zustand stores
  const favorites = useFavorites();
  
  // Use the HSK vocabulary hook
  const {
    vocabulary,
    loading,
    progress,
    error,
    loadLevel,
    availableLevels
  } = useHSKVocabulary(initialLevel, { loadProgressively: true });
  
  // Handle level change
  const handleLevelChange = (level: number) => {
    if (level !== selectedLevel) {
      console.log(`Changing HSK level from ${selectedLevel} to ${level}`);
      setSelectedLevel(level);
      loadLevel(level);
    }
  };
  
  // Filter vocabulary based on search term and favorites
  const filteredVocabulary = vocabulary.filter(item => {
    // Skip items with missing required fields
    if (!item || !item.id) {
      console.warn('HSK vocabulary item missing required fields:', item);
      return false;
    }
    
    // Apply favorites filter if requested
    if (showFavoritesOnly && !favorites.hsk.has(item.id)) {
      return false;
    }
    
    // Apply search term filter if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      // Support both item.item (raw HSK data) and item.chinese (transformed data)
      const chineseText = (item as any).item || item.chinese;
      return (
        (chineseText && chineseText.includes(searchTerm)) ||
        (item.pinyin && item.pinyin.toLowerCase().includes(term)) ||
        (item.english && item.english.toLowerCase().includes(term)) ||
        (item.vietnamese && item.vietnamese.toLowerCase().includes(term)) ||
        (item.category && item.category.toLowerCase().includes(term))
      );
    }
    
    return true;
  });
  
  return (
    <div className="space-y-4">
      {/* HSK Level selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-4">HSK Level</h2>
        <div className="flex flex-wrap gap-2">
          {availableLevels.map(level => (
            <button
              key={level}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedLevel === level
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleLevelChange(level)}
              disabled={loading} // Disable during loading
            >
              HSK {level}
            </button>
          ))}
          
          {/* Show disabled buttons for unavailable levels */}
          {[7].map(level => (
            <button
              key={level}
              className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              disabled
              title="Not available yet"
            >
              HSK {level}
            </button>
          ))}
        </div>
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">
            All HSK Levels 1-6 are available with enriched Vietnamese translations
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Beginner (HSK 1-2) → Intermediate (HSK 3-4) → Advanced (HSK 5-6)
          </p>
        </div>
      </div>
      
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search vocabulary (Chinese, Vietnamese, English, Pinyin, or Category)..."
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>
      
      {/* Statistics */}
      {vocabulary.length > 0 && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <span>
              <strong>Total HSK {selectedLevel}:</strong> {vocabulary.length} words
            </span>
            <span>
              <strong>Favorites:</strong> {favorites.hsk.size} words
            </span>
            <span>
              <strong>Showing:</strong> {filteredVocabulary.length} words
            </span>
            {searchTerm && (
              <span className="text-red-600 dark:text-red-400">
                <strong>Search:</strong> "{searchTerm}"
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-4">
              <div 
                className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}%
            </span>
          </div>
          <p className="text-center mt-2">
            Loading HSK {selectedLevel} enriched vocabulary...
          </p>
          {vocabulary.length > 0 && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
              Loaded {vocabulary.length} items so far...
            </p>
          )}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error.message}</span>
          <button
            onClick={() => handleLevelChange(selectedLevel)}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry Loading
          </button>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && filteredVocabulary.length === 0 && vocabulary.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            No vocabulary loaded yet.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            HSK Level {selectedLevel} should load automatically.
          </p>
          <button
            onClick={() => handleLevelChange(selectedLevel)}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Load HSK {selectedLevel}
          </button>
        </div>
      )}
      
      {/* No results state */}
      {!loading && filteredVocabulary.length === 0 && vocabulary.length > 0 && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {showFavoritesOnly 
              ? "No favorite vocabulary items found." 
              : searchTerm 
                ? `No vocabulary items found matching "${searchTerm}".`
                : "No vocabulary items found matching your filters."}
          </p>
          {(showFavoritesOnly || searchTerm) && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-red-600 dark:text-red-400 underline hover:text-red-700 dark:hover:text-red-300"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
      
      {/* Vocabulary grid */}
      {!loading && filteredVocabulary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVocabulary.map((item, index) => (
            <HSKVocabularyCard 
              key={`hsk-${selectedLevel}-${item.id}-${index}`} // Unique key with level, ID, and index
              item={item} 
            />
          ))}
        </div>
      )}
      
      {/* Show pagination info if we have lots of results */}
      {!loading && filteredVocabulary.length > 50 && (
        <div className="flex justify-center mt-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span>📊</span>
            <span>Showing {filteredVocabulary.length} vocabulary items</span>
          </div>
        </div>
      )}
      
      {/* Tips section for when vocabulary is loaded */}
      {!loading && vocabulary.length > 0 && filteredVocabulary.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mt-6">
          <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">💡 Learning Tips:</h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-1">
            <li>Click on vocabulary cards to see detailed examples</li>
            <li>Use the star (☆) to bookmark words for later review</li>
            <li>Try searching for words in different languages (Chinese, Vietnamese, English, Pinyin)</li>
            <li>Focus on high-frequency words first for better learning efficiency</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HSKVocabularyList;
