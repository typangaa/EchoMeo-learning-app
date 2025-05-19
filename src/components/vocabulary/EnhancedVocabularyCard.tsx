import { useState } from 'react';
import { EnhancedVocabularyItem } from '../../utils/translations';

interface EnhancedVocabularyCardProps {
  item: EnhancedVocabularyItem;
  onFavorite?: (simplified: string) => void;
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
      onFavorite(item.simplified);
    }
  };
  
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.audio_url) {
      const audio = new Audio(item.audio_url);
      audio.play();
    }
  };

  // Get the primary meaning (or first if none marked as primary)
  const primaryMeaning = item.meanings.find((m) => m.primary) || 
                         (item.meanings.length > 0 ? item.meanings[0] : null);
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer transition-all duration-300 hover:shadow-lg"
      onClick={toggleDetails}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold chinese-text">{item.simplified}</h3>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
            HSK {item.hsk_level}
          </span>
          {onFavorite && (
            <button
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="text-lg"
            >
              {isFavorite ? "★" : "☆"}
            </button>
          )}
        </div>
      </div>
      
      {/* Primary meaning */}
      {primaryMeaning && (
        <>
          <p className="text-lg mb-1 vietnamese-text">{primaryMeaning.vietnamese}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.pinyin}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{primaryMeaning.english}</p>
        </>
      )}
      
      {/* Multiple meanings toggle button */}
      {item.meanings.length > 1 && (
        <button 
          onClick={toggleAllMeanings}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400 flex items-center"
        >
          {showAllMeanings ? "Show only primary meaning" : `Show all meanings (${item.meanings.length})`}
        </button>
      )}
      
      {/* Additional meanings */}
      {showAllMeanings && item.meanings.length > 1 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold mb-2">All Meanings:</h4>
          <ul className="space-y-2">
            {item.meanings.map((meaning, index: number) => (
              <li key={index} className={`text-sm ${meaning.primary ? 'font-medium' : ''}`}>
                <span className="vietnamese-text">{meaning.vietnamese}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  — {meaning.english}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Examples when details are shown */}
      {showDetails && item.examples && item.examples.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold mb-2">Examples:</h4>
          {item.examples.map((example, index: number) => (
            <div key={index} className="mb-2">
              <p className="text-sm chinese-text">{example.chinese}</p>
              <p className="text-sm vietnamese-text">{example.vietnamese}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{example.pinyin}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Audio button */}
      {item.audio_url && (
        <button 
          className="mt-2 text-blue-600 dark:text-blue-400 text-sm flex items-center"
          onClick={playAudio}
        >
          🔊 Listen
        </button>
      )}
    </div>
  );
};

export default EnhancedVocabularyCard;