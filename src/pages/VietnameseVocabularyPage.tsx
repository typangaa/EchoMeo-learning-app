import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VietnameseVocabularyList from '../components/vocabulary/VietnameseVocabularyList';
import { useTranslation } from '../hooks/useTranslation';

const VietnameseVocabularyPage: React.FC = () => {
  const { t } = useTranslation();
  const [showFavorites, setShowFavorites] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{t('vocabulary.vietnamese.title')}</h1>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold mb-2">{t('vocabulary.vietnamese.about.title')}</h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3">
            {t('vocabulary.vietnamese.about.description')}
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <h3 className="font-semibold mb-1">{t('vocabulary.vietnamese.about.availableContent.title')}</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-0.5">
                {t('vocabulary.vietnamese.about.availableContent.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">{t('vocabulary.vietnamese.about.features.title')}</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-0.5">
                {t('vocabulary.vietnamese.about.features.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="order-2 sm:order-1">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {t('vocabulary.vietnamese.description')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4 order-1 sm:order-2">
          <Link
            to="/vietnamese-flashcards"
            className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center text-sm sm:text-base"
          >
            {t('vocabulary.vietnamese.practiceFlashcards')}
          </Link>
          
          <div className="flex space-x-2">
            <button
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                !showFavorites 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setShowFavorites(false)}
            >
              {t('vocabulary.vietnamese.allVocabulary')}
            </button>
            
            <button
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                showFavorites 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setShowFavorites(true)}
            >
              {t('vocabulary.vietnamese.favoritesButton')}
            </button>
          </div>
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
