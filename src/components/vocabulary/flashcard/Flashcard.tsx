import { useState } from 'react';
import { VocabularyItem } from '../../../types';
import './flashcard.css';

interface FlashcardProps {
  item: VocabularyItem;
  onCorrect: (id: number) => void;
  onIncorrect: (id: number) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ 
  item, 
  onCorrect, 
  onIncorrect 
}) => {
  const [flipped, setFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  const handleCorrect = () => {
    onCorrect(item.id);
  };
  
  const handleIncorrect = () => {
    onIncorrect(item.id);
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
  
  return (
    <div className="max-w-md mx-auto">
      <div className="flip-container">
        <div className={`flipper ${flipped ? 'is-flipped' : ''}`} onClick={handleFlip}>
          <div className="front">
            {/* Front of card (Vietnamese) */}
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
                <h2 className="text-3xl font-bold vietnamese-text">{item.vietnamese}</h2>
                {item.english && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{item.english}</p>
                )}
              </div>
              
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Click to see Chinese
              </p>
            </div>
          </div>
          
          <div className="back">
            {/* Back of card (Chinese) */}
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
                <h2 className="text-3xl font-bold chinese-text">{item.chinese}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{item.pinyin}</p>
                
                {showExample && item.examples && item.examples.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm vietnamese-text">{item.examples[0].vietnamese}</p>
                    <p className="text-sm chinese-text mt-1">{item.examples[0].chinese}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.examples[0].pinyin}</p>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Click to see Vietnamese
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Answer buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleIncorrect}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Incorrect
        </button>
        <button
          onClick={handleCorrect}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Correct
        </button>
      </div>
    </div>
  );
};

export default Flashcard;