import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VietnameseVocabularyList from '../components/vocabulary/VietnameseVocabularyList';
import VietnameseDebugInfo from '../components/debug/VietnameseDebugInfo';

const VietnameseVocabularyPage: React.FC = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Temporary debug info */}
      <VietnameseDebugInfo />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Vietnamese Vocabulary</h1>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">About Vietnamese Vocabulary</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Learn Vietnamese vocabulary with comprehensive Chinese translations, pronunciation guides, and example sentences. 
            Our enriched vocabulary database includes etymology information, frequency ratings, and detailed usage examples to help you master Vietnamese effectively. 
            Perfect for Chinese speakers learning Vietnamese or Vietnamese speakers learning Chinese.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Available Content:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>Vietnamese Level 1 (A1): 500+ beginner words with Chinese translations</li>
                <li>Vietnamese Level 2 (A2): 500+ intermediate words with Chinese translations</li>
                <li>Multiple meanings and usage contexts per word</li>
                <li>Etymology information (Sino-Vietnamese, Native Vietnamese, etc.)</li>
                <li>Frequency ratings to help prioritize learning</li>
                <li>Example sentences in Vietnamese, Chinese, and English</li>
                <li>IPA pronunciation guides for Vietnamese</li>
                <li>Pinyin pronunciation for Chinese translations</li>
                <li>Category-based organization (verbs, nouns, adjectives, etc.)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Features:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>Audio pronunciations for Vietnamese and Chinese</li>
                <li>Advanced search and filtering</li>
                <li>Favorites system for personalized learning</li>
                <li>CEFR level progression tracking</li>
                <li>Interactive vocabulary cards with examples</li>
                <li>Responsive design for mobile learning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            Explore Vietnamese vocabulary with detailed Chinese translations and cultural context
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link
            to="/vietnamese-flashcards"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            🧠 Practice Flashcards
          </Link>
          
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              !showFavorites 
                ? 'bg-green-600 text-white' 
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
      
      <VietnameseVocabularyList 
        initialLevel={1}
        showFavoritesOnly={showFavorites}
      />
    </div>
  );
};

export default VietnameseVocabularyPage;
