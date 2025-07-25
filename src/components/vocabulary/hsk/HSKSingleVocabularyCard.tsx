import React from 'react';
import { VocabularyItem } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAppStore } from '../../../stores';
import AudioButton from '../../common/AudioButton';
import { createBugReport } from '../../../utils/bugReport';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const showEnglishSupplement = useAppStore((state) => state.languagePairPreferences.showEnglishSupplement);
  const toLanguage = useAppStore((state) => state.languagePairPreferences.toLanguage);
  
  // Create a wrapper for AudioButton that prevents event propagation
  const AudioButtonWrapper = ({ text, language, className, size }: { 
    text: string; 
    language: 'vietnamese' | 'chinese'; 
    className?: string; 
    size?: 'sm' | 'md' | 'lg' 
  }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent the click from reaching the parent div
    };
    
    return (
      <span onClick={handleClick} className={className}>
        <AudioButton 
          text={text} 
          language={language} 
          size={size} 
        />
      </span>
    );
  };

  const handleFavoriteClick = () => {
    onToggleFavorite(item);
  };

  const handleBugReport = () => {
    createBugReport(item, 'hsk');
  };

  return (
    <Card size="mobile" className="max-w-xl sm:max-w-2xl w-full h-screen sm:h-auto overflow-hidden sm:overflow-visible flex flex-col">
      <CardContent className="p-2 sm:p-6 flex flex-col h-full">
      {/* Header with level and actions */}
      <div className="flex justify-between items-center mb-1 sm:mb-4 flex-shrink-0">
        <Badge variant="hsk" size="sm" className="px-2 sm:px-3 py-0.5 sm:py-1">
          HSK {item.level}
        </Badge>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleBugReport}
            title={t('common.reportBug')}
            className="p-1 sm:p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </button>
          <button
            onClick={handleFavoriteClick}
            title={isFavorite ? t('vocabulary.removeFromFavorites') : t('vocabulary.addToFavorites')}
            className={`p-1 sm:p-2 rounded-full transition-colors ${
              isFavorite
                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chinese Characters */}
      <div className="text-center mb-1 sm:mb-6 flex-shrink-0">
        <div className="text-xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-3">
          {item.simplified || item.chinese}
          {item.traditional && item.traditional !== (item.simplified || item.chinese) && (
            <span className="text-lg sm:text-3xl text-gray-500 dark:text-gray-400 ml-2">
              ({item.traditional})
            </span>
          )}
        </div>
        
        {/* Pinyin with audio */}
        <div className="flex justify-center items-center gap-1 sm:gap-3">
          <div className="text-sm sm:text-xl text-blue-600 dark:text-blue-400 font-medium">
            {item.pinyin}
          </div>
          <AudioButton
            text={item.simplified || item.chinese}
            language="chinese"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          />
        </div>
      </div>

      {/* Translations */}
      <div className="space-y-1 sm:space-y-3 flex-shrink-0">
        {/* Vietnamese */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 sm:p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-400 mb-0.5 sm:mb-1">
                Vietnamese
              </div>
              <div className="text-sm sm:text-base text-red-800 dark:text-red-300">
                {item.vietnamese}
              </div>
            </div>
            <AudioButton
              text={item.vietnamese}
              language="vietnamese"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2 sm:ml-3"
            />
          </div>
        </div>

        {/* English - Only show if supplement is enabled */}
        {item.english && showEnglishSupplement && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400 mb-0.5 sm:mb-1">
              English
            </div>
            <div className="text-sm sm:text-base text-green-800 dark:text-green-300">
              {item.english}
            </div>
          </div>
        )}
      </div>

      {/* Examples - Optimized for Mobile */}
      {item.examples && item.examples.length > 0 && (
        <div className="mt-1 sm:mt-6 pt-1 sm:pt-4 border-t border-border flex-1 min-h-0 overflow-hidden">
          <h4 className="text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-3 flex-shrink-0">
            Examples
          </h4>
          <div className="space-y-1 sm:space-y-3 overflow-y-auto max-h-full">
            {item.examples.map((example, index) => (
              <div key={index} className="bg-muted rounded p-1.5 sm:p-3">
                <div className="flex items-center mb-0.5 sm:mb-1">
                  <div className="text-xs sm:text-sm text-foreground font-medium">
                    {example.chinese}
                  </div>
                  {toLanguage === 'mandarin' && (
                    <AudioButtonWrapper 
                      text={example.chinese} 
                      language="chinese" 
                      className="ml-1 sm:ml-2" 
                      size="sm" 
                    />
                  )}
                </div>
                {example.pinyin && (
                  <div className="text-xs text-muted-foreground mb-0.5 sm:mb-1">
                    {example.pinyin}
                  </div>
                )}
                <div className="flex items-center mb-0.5 sm:mb-1">
                  <div className="text-xs text-muted-foreground">
                    {example.vietnamese}
                  </div>
                  {toLanguage === 'vi' && (
                    <AudioButtonWrapper 
                      text={example.vietnamese} 
                      language="vietnamese" 
                      className="ml-1 sm:ml-2" 
                      size="sm" 
                    />
                  )}
                </div>
                {/* Show English in examples if supplement is enabled */}
                {example.english && showEnglishSupplement && (
                  <div className="text-xs text-primary">
                    {example.english}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  );
};

export default HSKSingleVocabularyCard;