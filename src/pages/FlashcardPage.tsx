import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VocabularyProvider } from '../context/VocabularyContext';
import { useVocabulary } from '../context/VocabularyContext';
import FlashcardPractice from '../components/vocabulary/flashcard/FlashcardPractice';

function FlashcardContent() {
  const navigate = useNavigate();
  const { vocabularyItems, filteredItems, selectedLevel, setSelectedLevel, categories, setSelectedCategory, favorites } = useVocabulary();
  const [selectingOptions, setSelectingOptions] = useState(true);
  const [itemSource, setItemSource] = useState<'all' | 'filtered' | 'favorites' | 'custom'>('all');
  
  const handleComplete = () => {
    navigate('/vocabulary');
  };
  
  const startPractice = (source: 'all' | 'filtered' | 'favorites' | 'custom') => {
    setItemSource(source);
    setSelectingOptions(false);
  };
  
  const getItemsForPractice = () => {
    switch (itemSource) {
      case 'all':
        return vocabularyItems;
      case 'filtered':
        return filteredItems;
      case 'favorites':
        // Use favorites from VocabularyContext
        return vocabularyItems.filter(item => favorites.includes(item.id));
      case 'custom':
        // Custom would be handled differently if implemented
        return filteredItems;
      default:
        return vocabularyItems;
    }
  };
  
  if (!selectingOptions) {
    return <FlashcardPractice vocabularyItems={getItemsForPractice()} onComplete={handleComplete} />;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Flashcard Practice</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Practice Options</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Choose What to Practice</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => startPractice('all')}
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <h4 className="font-medium mb-1">All Vocabulary</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Practice all {vocabularyItems.length} vocabulary items
                </p>
              </button>
              
              <button
                onClick={() => startPractice('filtered')}
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <h4 className="font-medium mb-1">Current Filtered Set</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Practice {filteredItems.length} items matching your current filters
                </p>
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Or Filter by Level</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLevel('all')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedLevel === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                All Levels
              </button>
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => (
                <button
                  key={level}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={() => setSelectedLevel(level as any)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Or Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <select
                className="w-full md:w-auto p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <button
                onClick={() => startPractice('filtered')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Practice Selected Category
              </button>
            </div>
          </div>
          
          {favorites.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Practice Favorites</h3>
              <button
                onClick={() => startPractice('favorites')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Practice {favorites.length} Favorite Items
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Back to Vocabulary
        </button>
      </div>
    </div>
  );
}

const FlashcardPage = () => {
  return (
    <VocabularyProvider>
      <FlashcardContent />
    </VocabularyProvider>
  );
};

export default FlashcardPage;