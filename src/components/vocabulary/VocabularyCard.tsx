import { useState } from 'react';
import { VocabularyItem } from '../../types';
import { useVocabulary } from '../../context/VocabularyContext';

interface VocabularyCardProps {
  item: VocabularyItem;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { addToFavorites, removeFromFavorites, favorites } = useVocabulary();
  const isFavorite = favorites.includes(item.id);
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item.id);
    }
  };
  
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audio.play();
    }
  };
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer transition-all duration-300 hover:shadow-lg"
      onClick={toggleDetails}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold vietnamese-text">{item.vietnamese}</h3>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
            {item.level}
          </span>
          <button
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="text-lg"
          >
            {isFavorite ? "★" : "☆"}
          </button>
        </div>
      </div>
      
      <p className="text-lg mb-1 chinese-text">{item.chinese}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.pinyin}</p>
      
      {item.english && (
        <p className="text-sm text-gray-700 dark:text-gray-300">{item.english}</p>
      )}
      
      {showDetails && item.examples && item.examples.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold mb-2">Examples:</h4>
          {item.examples.map((example, index) => (
            <div key={index} className="mb-2">
              <p className="text-sm vietnamese-text">{example.vietnamese}</p>
              <p className="text-sm chinese-text">{example.chinese}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{example.pinyin}</p>
            </div>
          ))}
        </div>
      )}
      
      {item.audioUrl && (
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

export default VocabularyCard;