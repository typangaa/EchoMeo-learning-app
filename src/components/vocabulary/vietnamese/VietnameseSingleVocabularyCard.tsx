import React from 'react';
import { VocabularyItem } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import AudioButton from '../../common/AudioButton';
import { createBugReport } from '../../../utils/bugReport';

interface VietnameseSingleVocabularyCardProps {
  item: VocabularyItem;
  onToggleFavorite: (item: VocabularyItem) => void;
  isFavorite: boolean;
}

const VietnameseSingleVocabularyCard: React.FC<VietnameseSingleVocabularyCardProps> = ({
  item,
  onToggleFavorite,
  isFavorite
}) => {
  const { t } = useTranslation();

  const handleFavoriteClick = () => {
    onToggleFavorite(item);
  };

  const handleBugReport = () => {
    createBugReport(item, 'vietnamese');
  };

  return (
    <div className="max-w-xl sm:max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header with favorite and bug report buttons */}
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {t('vocabulary.vietnamese.level')} {item.level}
          </span>
          {item.category && (
            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
              {item.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Bug Report Button */}
          <button
            onClick={handleBugReport}
            title={t('common.reportBug')}
            className="p-1.5 sm:p-2 rounded-full transition-all duration-200 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </button>
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            title={isFavorite ? t('vocabulary.removeFromFavorites') : t('vocabulary.addToFavorites')}
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
      </div>

      {/* Vietnamese Word */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-600 dark:text-red-400 break-words">
            {item.vietnamese}
          </div>
          <AudioButton
            text={item.vietnamese}
            language="vietnamese"
            className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          />
        </div>
      </div>

      {/* Translations */}
      <div className="space-y-3 sm:space-y-4">
        {/* Chinese */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                {t('vocabulary.chinese')}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800 dark:text-blue-300 mb-1 break-words">
                {item.chinese}
              </div>
              <div className="text-sm sm:text-base md:text-lg text-blue-600 dark:text-blue-400">
                {item.pinyin}
              </div>
            </div>
            <AudioButton
              text={item.chinese}
              language="chinese"
              className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 self-center sm:self-start"
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

      {/* Examples */}
      {item.examples && item.examples.length > 0 && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            {t('vocabulary.examples')}
          </h4>
          <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-40 overflow-y-auto">
            {item.examples.map((example, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
                <div className="space-y-1">
                  <div className="text-sm sm:text-base text-red-600 dark:text-red-400 font-medium">
                    {example.vietnamese}
                  </div>
                  <div className="text-sm sm:text-base text-blue-600 dark:text-blue-400">
                    {example.chinese}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-500 dark:text-blue-300">
                    {example.pinyin}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VietnameseSingleVocabularyCard;