import React, { useState } from 'react';
import useVietnameseVocabulary from '../../hooks/useVietnameseVocabulary';
import VietnameseVocabularyCard from './VietnameseVocabularyCard';
import { useFavorites } from '../../stores';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CEFRLevel } from '../../types';

interface VietnameseVocabularyListProps {
  initialLevel?: number;
  showFavoritesOnly?: boolean;
}

const VietnameseVocabularyList: React.FC<VietnameseVocabularyListProps> = ({ 
  initialLevel = 1,
  showFavoritesOnly = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number>(initialLevel);
  const [levelFilter, setLevelFilter] = useState<CEFRLevel | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Use Zustand stores
  const favorites = useFavorites();
  
  // Use the Vietnamese vocabulary hook
  const {
    vocabulary,
    loading,
    progress,
    error,
    loadLevel,
    availableLevels
  } = useVietnameseVocabulary(initialLevel, { loadProgressively: true });
  
  // Handle level change
  const handleLevelChange = (level: number) => {
    if (level !== selectedLevel) {
      console.log(`Changing Vietnamese level from ${selectedLevel} to ${level}`);
      setSelectedLevel(level);
      loadLevel(level);
    }
  };
  
  // Get unique categories from vocabulary
  const categories = Array.from(new Set(vocabulary.map(item => item.category))).sort();
  
  // Filter vocabulary based on search term, level, category, and favorites
  const filteredVocabulary = vocabulary.filter(item => {
    // Skip items with missing required fields
    if (!item || !item.id) {
      console.warn('Vietnamese vocabulary item missing required fields:', item);
      return false;
    }
    
    // Apply favorites filter if requested
    if (showFavoritesOnly && !favorites.vietnamese.has(item.id)) {
      return false;
    }
    
    // Apply level filter
    if (levelFilter !== 'all' && item.level !== levelFilter) {
      return false;
    }
    
    // Apply category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    
    // Apply search term filter if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (item.vietnamese && item.vietnamese.toLowerCase().includes(term)) ||
        (item.chinese && item.chinese.includes(searchTerm)) ||
        (item.pinyin && item.pinyin.toLowerCase().includes(term)) ||
        (item.english && item.english.toLowerCase().includes(term)) ||
        (item.category && item.category.toLowerCase().includes(term))
      );
    }
    
    return true;
  });
  
  return (
    <div className="space-y-4">
      {/* Level selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-4">Vietnamese Level</h2>
        <div className="flex flex-wrap gap-2">
          {availableLevels.map(level => {
            const cefrLevel = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B1', 5: 'B2', 6: 'C1'}[level] || 'A1';
            return (
              <button
                key={level}
                className={`px-3 py-2 rounded-md transition-colors ${
                  selectedLevel === level
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleLevelChange(level)}
                disabled={loading} // Disable during loading
                title={`Vietnamese Level ${level} (${cefrLevel})`}
              >
                <div className="text-center">
                  <div className="font-semibold">VN {level}</div>
                  <div className="text-xs opacity-75">{cefrLevel}</div>
                </div>
              </button>
            );
          })}
          
        </div>
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            All Vietnamese Levels 1-6 are available with enriched Chinese translations
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            A1 (Beginner) → A2 (Elementary) → B1 (Intermediate) → B2 (Advanced) → C1 (Proficient)
          </p>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search input */}
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search vocabulary..."
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
          
          {/* CEFR Level filter */}
          <div>
            <label className="block text-sm font-medium mb-2">CEFR Level</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as CEFRLevel | 'all')}
              disabled={loading}
            >
              <option value="all">All Levels</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>
          
          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              disabled={loading}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      {vocabulary.length > 0 && !loading && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <span>
              <strong>Total Vietnamese {selectedLevel}:</strong> {vocabulary.length} words
            </span>
            <span>
              <strong>Favorites:</strong> {favorites.vietnamese.size} words
            </span>
            <span>
              <strong>Showing:</strong> {filteredVocabulary.length} words
            </span>
            {searchTerm && (
              <span className="text-green-600 dark:text-green-400">
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
            <div className="w-full mr-4">
              <Progress 
                value={progress} 
                variant="success"
                className="transition-all duration-300"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <p className="text-center mt-2">
            Loading Vietnamese {selectedLevel} enriched vocabulary...
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
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error.message}</span>
            <Button
              onClick={() => handleLevelChange(selectedLevel)}
              variant="destructive"
              size="sm"
              className="mt-2"
            >
              Retry Loading
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Empty state */}
      {!loading && filteredVocabulary.length === 0 && vocabulary.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            No vocabulary loaded yet.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Vietnamese Level {selectedLevel} should load automatically.
          </p>
          <button
            onClick={() => handleLevelChange(selectedLevel)}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Load Vietnamese {selectedLevel}
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
          {(showFavoritesOnly || searchTerm || levelFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setLevelFilter('all');
                setCategoryFilter('all');
              }}
              className="mt-2 text-green-600 dark:text-green-400 underline hover:text-green-700 dark:hover:text-green-300"
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
            <VietnameseVocabularyCard 
              key={`vn-${selectedLevel}-${item.id}-${index}`} // Unique key with level, ID, and index
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
            <li>Try searching for words in different languages (Vietnamese, Chinese, English, Pinyin)</li>
            <li>Filter by CEFR level to focus on vocabulary appropriate for your level</li>
            <li>Use category filters to study specific types of words (verbs, nouns, etc.)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default VietnameseVocabularyList;
