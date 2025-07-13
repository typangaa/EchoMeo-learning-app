import { useState } from 'react';
import { VocabularyItem } from '../../types';
import { useToggleFavorite, useIsFavorite } from '../../stores';
import AudioButton from '../common/AudioButton';

interface VietnameseVocabularyCardProps {
  item: VocabularyItem;
}

const VietnameseVocabularyCard: React.FC<VietnameseVocabularyCardProps> = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false);
  const toggleFavorite = useToggleFavorite();
  const isItemFavorite = useIsFavorite('vietnamese', item.id);
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite('vietnamese', item.id);
  };
  
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
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 border-green-500"
      onClick={toggleDetails}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <h3 className="text-xl font-bold vietnamese-text text-green-700 dark:text-green-400">{item.vietnamese}</h3>
          <AudioButtonWrapper 
            text={item.vietnamese} 
            language="vietnamese" 
            className="ml-2" 
            size="sm" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">
            VN {item.level}
          </span>
          <button
            onClick={handleToggleFavorite}
            aria-label={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
            title={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`text-lg transition-colors ${
              isItemFavorite 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            {isItemFavorite ? "★" : "☆"}
          </button>
        </div>
      </div>
      
      <div className="mb-2">
        {item.pinyin && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span className="font-medium">Pinyin:</span> {item.pinyin}
          </p>
        )}
        <div className="flex items-center">
          <p className="text-lg chinese-text font-medium">{item.chinese}</p>
          {item.chinese && (
            <AudioButtonWrapper 
              text={item.chinese} 
              language="chinese" 
              className="ml-2" 
              size="sm" 
            />
          )}
        </div>
      </div>
      
      {item.english && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-medium">English:</span> {item.english}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {item.category}
        </span>
        {showDetails && item.examples && item.examples.length > 0 && (
          <span className="text-xs text-green-600 dark:text-green-400">
            {item.examples.length} example{item.examples.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {showDetails && item.examples && item.examples.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Examples:</h4>
          <div className="space-y-3">
            {item.examples.slice(0, 2).map((example, index) => (
              <div key={index} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                <div className="flex items-center mb-1">
                  <p className="text-sm vietnamese-text font-medium">{example.vietnamese}</p>
                  <AudioButtonWrapper 
                    text={example.vietnamese} 
                    language="vietnamese" 
                    className="ml-2" 
                    size="sm" 
                  />
                </div>
                <div className="flex items-center mb-1">
                  <p className="text-sm chinese-text">{example.chinese}</p>
                  <AudioButtonWrapper 
                    text={example.chinese} 
                    language="chinese" 
                    className="ml-2" 
                    size="sm" 
                  />
                </div>
                {example.pinyin && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">{example.pinyin}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!showDetails && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Click to see {item.examples && item.examples.length > 0 ? 'examples and ' : ''}more details
          </p>
        </div>
      )}
    </div>
  );
};

export default VietnameseVocabularyCard;
