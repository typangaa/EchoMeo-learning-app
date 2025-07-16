import React from 'react';
import { VocabularyItem } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import AudioButton from '../../common/AudioButton';

interface HSKSingleVocabularyCardProps {
  item: VocabularyItem;
  onToggleFavorite: (item: VocabularyItem) => void;
  isFavorite: boolean;
}

const HSKSingleVocabularyCard: React.FC<HSKSingleVocabularyCardProps> = ({
  item,
  onToggleFavorite,
  isFavorite
}) => {
  const { t } = useTranslation();

  const handleFavoriteClick = () => {
    onToggleFavorite(item);
  };

  return (
    <div className="max-w-xl sm:max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header with favorite button */}
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            HSK {item.level}
          </span>
          {item.frequency && (
            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
              {t('vocabulary.frequency')}: {item.frequency}
            </span>
          )}
        </div>
        <button
          onClick={handleFavoriteClick}
          className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
            isFavorite
              ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
          }`}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      </div>

      {/* Chinese Characters */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-4">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white break-words">
            {item.simplified || item.chinese}
          </div>
          {item.traditional && item.traditional !== (item.simplified || item.chinese) && (
            <>
              <div className="text-lg sm:text-xl md:text-2xl text-gray-400 dark:text-gray-600">/</div>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 dark:text-gray-300">
                {item.traditional}
              </div>
            </>
          )}
        </div>
        
        {/* Pinyin with audio */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="text-lg sm:text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-medium">
            {item.pinyin}
          </div>
          <AudioButton
            text={item.simplified || item.chinese}
            language="chinese"
            className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          />
        </div>
      </div>

      {/* Translations */}
      <div className="space-y-3 sm:space-y-4">
        {/* Vietnamese */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                {t('vocabulary.vietnamese')}
              </div>
              <div className="text-sm sm:text-base md:text-lg text-red-800 dark:text-red-300">
                {item.vietnamese}
              </div>
            </div>
            <AudioButton
              text={item.vietnamese}
              language="vietnamese"
              className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 self-center sm:self-start"
            />
          </div>
        </div>

        {/* English */}
        {item.english && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400 mb-1">
              {t('vocabulary.english')}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-green-800 dark:text-green-300">
              {item.english}
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      {(item.examples || item.synonyms || item.antonyms) && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {item.examples && (
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  {t('vocabulary.examples')}
                </h4>
                <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-40 overflow-y-auto">
                  {item.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
                      <div className="space-y-1">
                        <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">
                          {example.chinese}
                        </div>
                        {example.pinyin && (
                          <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                            {example.pinyin}
                          </div>
                        )}
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {example.vietnamese}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {item.synonyms && item.synonyms.length > 0 && (
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('vocabulary.synonyms')}
                </h4>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {item.synonyms.join(', ')}
                </div>
              </div>
            )}
            
            {item.antonyms && item.antonyms.length > 0 && (
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('vocabulary.antonyms')}
                </h4>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {item.antonyms.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HSKSingleVocabularyCard;