import React from 'react';
import { VocabularyItem } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import AudioButton from '../../common/AudioButton';

interface VietnameseVocabularyListPanelProps {
  vocabulary: VocabularyItem[];
  currentIndex: number;
  onJumpToItem: (index: number) => void;
  onClose: () => void;
  favorites: Set<number>;
  onToggleFavorite: (item: VocabularyItem) => void;
}

const VietnameseVocabularyListPanel: React.FC<VietnameseVocabularyListPanelProps> = ({
  vocabulary,
  currentIndex,
  onJumpToItem,
  onClose,
  favorites,
  onToggleFavorite
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-80 sm:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {t('vocabulary.vocabularyList')}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          {vocabulary.length} {t('vocabulary.items')}
        </p>
      </div>

      {/* Vocabulary List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-1 sm:p-2 space-y-1">
          {vocabulary.map((item, index) => (
            <div
              key={item.id}
              className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                index === currentIndex
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => onJumpToItem(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {/* Vietnamese Word */}
                  <div className="text-sm sm:text-base md:text-lg font-semibold text-red-600 dark:text-red-400 mb-1 truncate">
                    {item.vietnamese}
                  </div>
                  
                  {/* Chinese */}
                  <div className="text-xs sm:text-sm md:text-base text-blue-600 dark:text-blue-400 mb-1 truncate">
                    {item.chinese}
                  </div>
                  
                  {/* Pinyin */}
                  <div className="text-xs sm:text-sm text-blue-500 dark:text-blue-300 mb-1 truncate">
                    {item.pinyin}
                  </div>
                  
                  {/* English translation */}
                  {item.english && (
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {item.english}
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center space-y-1 ml-1 sm:ml-2">
                  {/* Vietnamese Audio Button */}
                  <AudioButton
                    text={item.vietnamese}
                    language="vietnamese"
                    className="p-0.5 sm:p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  />
                  
                  {/* Chinese Audio Button */}
                  <AudioButton
                    text={item.chinese}
                    language="chinese"
                    className="p-0.5 sm:p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item);
                    }}
                    className={`p-0.5 sm:p-1 rounded transition-colors ${
                      favorites.has(item.id)
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Current Item Indicator */}
              {index === currentIndex && (
                <div className="mt-1 sm:mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {t('vocabulary.currentItem')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
          {t('vocabulary.clickToJump')}
        </div>
      </div>
    </div>
  );
};

export default VietnameseVocabularyListPanel;