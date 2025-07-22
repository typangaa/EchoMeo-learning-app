import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HSKVocabularyList from '../components/vocabulary/HSKVocabularyList';
import { useTranslation } from '../hooks/useTranslation';

const HSKVocabularyPage: React.FC = () => {
  const { t } = useTranslation();
  const [showFavorites, setShowFavorites] = useState(false);
  
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 pb-2 sm:pb-4">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">{t('vocabulary.hsk.title')}</h1>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-3 lg:p-4 mb-2 sm:mb-3">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">{t('vocabulary.hsk.about.title')}</h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            {t('vocabulary.hsk.about.description')}
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
            <div>
              <h3 className="font-semibold mb-1">{t('vocabulary.hsk.about.availableContent.title')}</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-0.5">
                {t('vocabulary.hsk.about.availableContent.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">{t('vocabulary.hsk.about.features.title')}</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-0.5">
                {t('vocabulary.hsk.about.features.items').map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div className="order-2 sm:order-1">
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">
              {t('vocabulary.hsk.description')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 order-1 sm:order-2">
            <Link
              to="/hsk-flashcards"
              className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-xs sm:text-sm lg:text-base"
            >
              {t('vocabulary.hsk.practiceFlashcards')}
            </Link>
            
            <div className="flex space-x-1 sm:space-x-2">
              <button
                className={`flex-1 sm:flex-none px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm lg:text-base ${
                  !showFavorites 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setShowFavorites(false)}
              >
                {t('vocabulary.hsk.allVocabulary')}
              </button>
              
              <button
                className={`flex-1 sm:flex-none px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm lg:text-base ${
                  showFavorites 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setShowFavorites(true)}
              >
                {t('vocabulary.hsk.favoritesButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <HSKVocabularyList 
          initialLevel={1}
          showFavoritesOnly={showFavorites}
        />
      </div>
    </div>
  );
};

export default HSKVocabularyPage;
