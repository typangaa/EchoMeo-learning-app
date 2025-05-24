import { useState } from 'react';
import { EnhancedVocabularyItem, getPrimaryMeaning } from '../../data/enrichedHSKLoader';
import AudioButton from '../common/AudioButton';

interface EnhancedVocabularyCardProps {
  item: EnhancedVocabularyItem;
  onFavorite?: (id: number) => void;
  isFavorite?: boolean;
}

const EnhancedVocabularyCard: React.FC<EnhancedVocabularyCardProps> = ({ 
  item, 
  onFavorite,
  isFavorite = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAllMeanings, setShowAllMeanings] = useState(false);
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const toggleAllMeanings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllMeanings(!showAllMeanings);
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(item.id);
    }
  };
  
  // Get the primary meaning
  const primaryMeaning = getPrimaryMeaning(item);
  
  // Create a wrapper for AudioButton that prevents event propagation
  const AudioButtonWrapper = ({ text, language, className, size }: { 
    text: string; 
    language: 'vietnamese' | 'chinese'; 
    className?: string; 
    size?: 'sm' | 'md' | 'lg' 
  }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
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
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer transition-all duration-300 hover:shadow-lg"
      onClick={toggleDetails}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <h3 className="text-lg font-bold chinese-text mr-2">{item.simplified}</h3>
          <AudioButtonWrapper 
            text={item.simplified} 
            language="chinese" 
            className="ml-1" 
            size="sm" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
            HSK {item.hsk_level}
          </span>
          {onFavorite && (
            <button
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`text-lg transition-colors ${
                isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              {isFavorite ? "★" : "☆"}
            </button>
          )}
        </div>
      </div>
      
      {/* Primary meaning */}
      <div className="flex items-center mb-1">
        <p className="text-lg vietnamese-text mr-2">{primaryMeaning.vietnamese}</p>
        <AudioButtonWrapper 
          text={primaryMeaning.vietnamese} 
          language="vietnamese" 
          className="ml-1" 
          size="sm" 
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.pinyin}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{primaryMeaning.english}</p>
      
      {/* Part of speech and frequency */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
          {primaryMeaning.part_of_speech}
        </span>
        <span className={`text-xs px-2 py-1 rounded ${
          primaryMeaning.usage_frequency === 'very common' 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            : primaryMeaning.usage_frequency === 'common'
              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}>
          {primaryMeaning.usage_frequency}
        </span>
      </div>
      
      {/* Multiple meanings toggle button */}
      {item.meanings.length > 1 && (
        <button 
          onClick={toggleAllMeanings}
          className="mb-2 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
        >
          {showAllMeanings ? "Show primary meaning only" : `Show all meanings (${item.meanings.length})`}
          <span className="ml-1">{showAllMeanings ? "▲" : "▼"}</span>
        </button>
      )}
      
      {/* Additional meanings */}
      {showAllMeanings && item.meanings.length > 1 && (
        <div className="mb-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold mb-2">All Meanings:</h4>
          <div className="space-y-2">
            {item.meanings.map((meaning, index) => (
              <div 
                key={index} 
                className={`p-2 rounded text-sm ${
                  meaning.primary 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center mb-1">
                  <span className="vietnamese-text font-medium mr-2">{meaning.vietnamese}</span>
                  <AudioButtonWrapper 
                    text={meaning.vietnamese} 
                    language="vietnamese" 
                    size="sm" 
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {meaning.english}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded">
                    {meaning.part_of_speech}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    meaning.usage_frequency === 'very common' 
                      ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                      : meaning.usage_frequency === 'common'
                        ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {meaning.usage_frequency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Examples when details are shown */}
      {showDetails && item.examples && item.examples.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold mb-2">Examples:</h4>
          <div className="space-y-3">
            {item.examples.slice(0, 3).map((example, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                <div className="flex items-center mb-1">
                  <p className="text-sm chinese-text mr-2">{example.chinese}</p>
                  <AudioButtonWrapper 
                    text={example.chinese} 
                    language="chinese" 
                    size="sm" 
                  />
                </div>
                <div className="flex items-center mb-1">
                  <p className="text-sm vietnamese-text mr-2">{example.vietnamese}</p>
                  <AudioButtonWrapper 
                    text={example.vietnamese} 
                    language="vietnamese" 
                    size="sm" 
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{example.pinyin}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{example.english}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Click hint */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        {showDetails ? "Click to hide details" : "Click to show examples and details"}
      </div>
    </div>
  );
};

export default EnhancedVocabularyCard;
