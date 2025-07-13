import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HSKVocabularyList from '../components/vocabulary/HSKVocabularyList';

const HSKVocabularyPage: React.FC = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto">
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">HSK Vocabulary</h1>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">About HSK Vocabulary</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            The Hanyu Shuiping Kaoshi (HSK) is a standardized test of Standard Chinese language proficiency. 
            Our vocabulary list includes enriched content with Vietnamese translations, detailed meanings, and example sentences.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Available Content:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>HSK Level 1: 150+ words with Vietnamese translations</li>
                <li>HSK Level 2: 150+ words with Vietnamese translations</li>
                <li>HSK Level 3: 300+ words with Vietnamese translations</li>
                <li>HSK Level 4: 600+ words with Vietnamese translations</li>
                <li>HSK Level 5: 1300+ words with Vietnamese translations</li>
                <li>HSK Level 6: 2500+ words with Vietnamese translations</li>
                <li>Multiple meanings per word</li>
                <li>Usage frequency indicators</li>
                <li>Example sentences in Chinese, Vietnamese, and English</li>
                <li>Pinyin pronunciation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Coming Soon:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>HSK Level 7 with Vietnamese translations</li>
                <li>Audio pronunciations</li>
                <li>Spaced repetition practice</li>
                <li>Character stroke order</li>
                <li>Progress tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            Browse vocabulary from the Hanyu Shuiping Kaoshi (HSK) standardized test
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link
            to="/hsk-flashcards"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🧠 Practice Flashcards
          </Link>
          
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              !showFavorites 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => setShowFavorites(false)}
          >
            All Vocabulary
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
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
      
      <HSKVocabularyList 
        initialLevel={1}
        showFavoritesOnly={showFavorites}
      />
    </div>
  );
};

export default HSKVocabularyPage;
