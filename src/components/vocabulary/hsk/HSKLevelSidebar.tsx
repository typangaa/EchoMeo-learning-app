import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

interface HSKLevelSidebarProps {
  selectedLevel: number;
  onLevelChange: (level: number) => void;
  vocabularyCount: number;
  favoriteCount: number;
  isLoading: boolean;
}

const HSKLevelSidebar: React.FC<HSKLevelSidebarProps> = ({
  selectedLevel,
  onLevelChange,
  vocabularyCount,
  favoriteCount,
  isLoading
}) => {
  const { t } = useTranslation();

  const hskLevels = [
    { level: 1, name: 'HSK 1', description: t('vocabulary.hsk.level1.description'), color: 'bg-green-500' },
    { level: 2, name: 'HSK 2', description: t('vocabulary.hsk.level2.description'), color: 'bg-blue-500' },
    { level: 3, name: 'HSK 3', description: t('vocabulary.hsk.level3.description'), color: 'bg-yellow-500' },
    { level: 4, name: 'HSK 4', description: t('vocabulary.hsk.level4.description'), color: 'bg-orange-500' },
    { level: 5, name: 'HSK 5', description: t('vocabulary.hsk.level5.description'), color: 'bg-red-500' },
    { level: 6, name: 'HSK 6', description: t('vocabulary.hsk.level6.description'), color: 'bg-purple-500' }
  ];

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('vocabulary.hsk.title')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('vocabulary.hsk.selectLevel')}
        </p>
      </div>

      {/* Level Selection */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {hskLevels.map((hskLevel) => (
          <button
            key={hskLevel.level}
            onClick={() => onLevelChange(hskLevel.level)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedLevel === hskLevel.level
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${hskLevel.color}`}></div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {hskLevel.name}
                </span>
              </div>
              {selectedLevel === hskLevel.level && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {hskLevel.description}
            </p>
            {selectedLevel === hskLevel.level && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {isLoading ? (
                  <span>{t('common.loading')}</span>
                ) : (
                  <span>{vocabularyCount} {t('vocabulary.items')}</span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Statistics */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('vocabulary.currentLevel')}:
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              HSK {selectedLevel}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('vocabulary.totalItems')}:
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {isLoading ? '...' : vocabularyCount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('vocabulary.favorites')}:
            </span>
            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
              ⭐ {favoriteCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HSKLevelSidebar;