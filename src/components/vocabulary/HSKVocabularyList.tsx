import React, { useState } from 'react';
import useHSKVocabulary from '../../hooks/useHSKVocabulary';
import VocabularyCard from './VocabularyCard';
import { VocabularyItem } from '../../types';

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
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('hsk_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Use the HSK vocabulary hook
  const {
    vocabulary,
    loading,
    progress,
    error,
    loadLevel
  } = useHSKVocabulary(initialLevel, { loadProgressively: true });
  
  // Handle level change
  const handleLevelChange = (level: number) => {
    setSelectedLevel(level);
    loadLevel(level);
  };
  
  // Add/remove from favorites
  const toggleFavorite = (id: number) => {
    let newFavorites: number[];
    
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(favId => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('hsk_favorites', JSON.stringify(newFavorites));
  };
  
  // Filter vocabulary based on search term and favorites
  const filteredVocabulary = vocabulary.filter(item => {
    // Apply favorites filter if requested
    if (showFavoritesOnly && !favorites.includes(item.id)) {
      return false;
    }
    
    // Apply search term filter if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.chinese.includes(searchTerm) ||
        item.pinyin.toLowerCase().includes(term) ||
        item.english?.toLowerCase().includes(term) ||
        (item.vietnamese && item.vietnamese.toLowerCase().includes(term))
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
          {[1, 2, 3, 4, 5, 6, 7].map(level => (
            <button
              key={level}
              className={`px-3 py-1 rounded-md ${
                selectedLevel === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleLevelChange(level)}
            >
              HSK {level}
            </button>
          ))}
        </div>
      </div>
      
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search vocabulary..."
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}%
            </span>
          </div>
          <p className="text-center mt-2">
            Loading HSK {selectedLevel} vocabulary...
          </p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error.message}</span>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && filteredVocabulary.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400">
            {showFavoritesOnly 
              ? "No favorite vocabulary items found." 
              : "No vocabulary items found matching your search."}
          </p>
        </div>
      )}
      
      {/* Vocabulary list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVocabulary.map(item => (
          <VocabularyCardWithFavorite 
            key={item.id} 
            item={item} 
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        ))}
      </div>
      
      {/* Show more button if we have more to load */}
      {!loading && vocabulary.length > 0 && filteredVocabulary.length >= 20 && (
        <div className="flex justify-center mt-6">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

// Extend the VocabularyCard to include favorite functionality
interface VocabularyCardWithFavoriteProps {
  item: VocabularyItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const VocabularyCardWithFavorite: React.FC<VocabularyCardWithFavoriteProps> = ({ 
  item, 
  isFavorite,
  onToggleFavorite
}) => {
  // You'll need to modify your existing VocabularyCard or create a wrapper
  return (
    <div className="relative">
      <VocabularyCard item={item} />
      <button
        className="absolute top-2 right-2 text-xl"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </div>
  );
};

export default HSKVocabularyList;
