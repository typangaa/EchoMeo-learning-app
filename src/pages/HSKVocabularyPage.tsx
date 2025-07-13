import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HSKVocabularyList from '../components/vocabulary/HSKVocabularyList';

const HSKVocabularyPage: React.FC = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">HSK Vocabulary</h1>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold mb-2">About HSK Vocabulary</h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3">
            HSK is the standardized Chinese proficiency test. Learn vocabulary with Vietnamese translations, 
            detailed meanings, and example sentences.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <h3 className="font-semibold mb-1">Available Content:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-0.5">
                <li>HSK Levels 1-6: 5000+ words total</li>
                <li>Vietnamese translations & meanings</li>
                <li>Pinyin pronunciation & examples</li>
                <li>Usage frequency indicators</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Features:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-0.5">
                <li>Audio pronunciations</li>
                <li>Spaced repetition practice</li>
                <li>Character stroke learning</li>
                <li>Progress tracking system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="order-2 sm:order-1">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Browse HSK vocabulary with Vietnamese translations
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4 order-1 sm:order-2">
          <Link
            to="/hsk-flashcards"
            className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm sm:text-base"
          >
            🧠 Practice Flashcards
          </Link>
          
          <div className="flex space-x-2">
            <button
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                !showFavorites 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setShowFavorites(false)}
            >
              All Vocabulary
            </button>
            
            <button
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                showFavorites 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setShowFavorites(true)}
            >
              ★ Favorites
            </button>
          </div>
        </div>
      </div>
      
      <HSKVocabularyList 
        initialLevel={1}
        showFavoritesOnly={showFavorites}
      />
    </div>
  );
};

export default HSKVocabularyPage;
