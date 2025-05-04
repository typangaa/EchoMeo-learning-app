import { useState } from 'react';
import { Link } from 'react-router-dom';
import { VocabularyProvider } from '../context/VocabularyContext';
import VocabularyList from '../components/vocabulary/VocabularyList';
import VocabularyFilters from '../components/vocabulary/VocabularyFilters';
// No need to import sampleVocabulary anymore

const VocabularyPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <VocabularyProvider>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <h1 className="text-3xl font-bold mb-2 md:mb-0">
            <span className="vietnamese-text">Từ vựng</span> - <span className="chinese-text">词汇</span>
          </h1>
          
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded ${
                !showFavorites 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setShowFavorites(false)}
            >
              All Items
            </button>
            <button
              className={`px-4 py-2 rounded ${
                showFavorites 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setShowFavorites(true)}
            >
              Favorites
            </button>
            <Link
              to="/flashcards"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Practice Flashcards
            </Link>
          </div>
        </div>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search vocabulary..."
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <VocabularyFilters />
          </div>
          
          <div className="md:col-span-3">
            <VocabularyList searchTerm={searchTerm} showFavoritesOnly={showFavorites} />
          </div>
        </div>
      </div>
    </VocabularyProvider>
  );
};

export default VocabularyPage;