import React, { useState } from 'react';
import HSKVocabularyList from '../components/vocabulary/HSKVocabularyList';

const HSKVocabularyPage: React.FC = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">HSK Vocabulary</h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Browse vocabulary from the Hanyu Shuiping Kaoshi (HSK) standardized test
        </p>
        
        <button
          className={`px-4 py-2 rounded-lg ${
            showFavorites 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? 'Show All' : 'Show Favorites'}
        </button>
      </div>
      
      <HSKVocabularyList 
        initialLevel={1}
        showFavoritesOnly={showFavorites}
      />
    </div>
  );
};

export default HSKVocabularyPage;
