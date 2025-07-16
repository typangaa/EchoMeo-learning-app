import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

interface VietnameseNavigationControlsProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const VietnameseNavigationControls: React.FC<VietnameseNavigationControlsProps> = ({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            canGoPrevious
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{t('vocabulary.previous')}</span>
        </button>

        {/* Progress Info */}
        <div className="flex items-center space-x-4">
          {/* Progress Bar */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalItems) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-max">
              {((currentIndex + 1) / totalItems * 100).toFixed(0)}%
            </span>
          </div>

          {/* Current Position */}
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentIndex + 1} / {totalItems}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t('vocabulary.position')}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            canGoNext
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
          }`}
        >
          <span>{t('vocabulary.next')}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-3 text-center">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t('vocabulary.keyboardHints')}: 
          <span className="ml-2 inline-flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">←</kbd>
            <span>{t('vocabulary.previous')}</span>
          </span>
          <span className="ml-3 inline-flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">→</kbd>
            <span>{t('vocabulary.next')}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default VietnameseNavigationControls;