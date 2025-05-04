import { useState } from 'react';
import { VocabularyItem } from '../../../types';
import { LanguageDirection } from '../../common/LanguageDirectionToggle';
import './flashcard.css';

interface FlashcardProps {
  item: VocabularyItem;
  onNext: () => void;
  direction: LanguageDirection;
}

const Flashcard: React.FC<FlashcardProps> = ({ 
  item, 
  onNext,
  direction
}) => {
  const [flipped, setFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  
  const isFrontChinese = direction === 'vn-to-cn';
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  const handleNext = () => {
    // Reset card state before moving to next
    setFlipped(false);
    setShowExample(showExample);
    onNext();
  };
  
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audio.play();
    }
  };
  
  const toggleExample = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowExample(!showExample);
  };
  
  // Front content changes based on direction
  const renderFrontContent = () => (
    <div className="flex flex-col justify-between h-full bg-white dark:bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">{item.level} • {item.category}</span>
        {item.audioUrl && (
          <button 
            onClick={playAudio}
            className="text-blue-600 dark:text-blue-400 text-sm"
            aria-label="Listen"
          >
            🔊
          </button>
        )}
      </div>
      
      <div className="text-center">
        <h2 className={`text-5xl font-bold ${isFrontChinese ? 'chinese-text' : 'vietnamese-text'}`}>
          {isFrontChinese ? item.chinese : item.vietnamese}
        </h2>
        {isFrontChinese && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">{item.pinyin}</p>
        )}
        {item.english && !isFrontChinese && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">{item.english}</p>
        )}
      </div>
      
      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
        Click to see {isFrontChinese ? 'Vietnamese' : 'Chinese'}
      </p>
    </div>
  );
  
  // Back content changes based on direction
  const renderBackContent = () => (
    <div className="flex flex-col justify-between h-full bg-white dark:bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">{item.level} • {item.category}</span>
        {item.examples && item.examples.length > 0 && (
          <button 
            onClick={toggleExample}
            className="text-blue-600 dark:text-blue-400 text-sm"
          >
            {showExample ? 'Hide Example' : 'Show Example'}
          </button>
        )}
      </div>
      
      <div className="text-center">
        <h2 className={`text-4xl font-bold ${isFrontChinese ? 'vietnamese-text' : 'chinese-text'}`}>
          {isFrontChinese ? item.vietnamese : item.chinese}
        </h2>
        {!isFrontChinese && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">{item.pinyin}</p>
        )}
        
        {showExample && item.examples && item.examples.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-md vietnamese-text">{item.examples[0].vietnamese}</p>
            <p className="text-md chinese-text mt-1">{item.examples[0].chinese}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.examples[0].pinyin}</p>
          </div>
        )}
      </div>
      
      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
        Click to see {isFrontChinese ? 'Chinese' : 'Vietnamese'}
      </p>
    </div>
  );
  
  return (
    <div className="max-w-md mx-auto">
      <div className="flip-container">
        <div className={`flipper ${flipped ? 'is-flipped' : ''}`} onClick={handleFlip}>
          <div className="front">
            {renderFrontContent()}
          </div>
          
          <div className="back">
            {renderBackContent()}
          </div>
        </div>
      </div>
      
      {/* Next button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Flashcard;