import { useState, useEffect, useRef } from 'react';
import { VocabularyItem } from '../../../types';
import { LanguageDirection } from '../../common/LanguageDirectionToggle';
import AudioButton from '../../common/AudioButton';
import audioService from '../../../utils/audioService';
import { useAppStore } from '../../../stores';
import './flashcard.css';

interface VietnameseFlashcardProps {
  item: VocabularyItem;
  onNext: () => void;
  direction?: LanguageDirection;
}

const VietnameseFlashcard: React.FC<VietnameseFlashcardProps> = ({ 
  item, 
  onNext,
  direction = 'vn-to-cn' // Default to Vietnamese to Chinese for Vietnamese flashcards
}) => {
  const [flipped, setFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  
  // Get English supplement setting
  const showEnglishSupplement = useAppStore((state) => state.languagePairPreferences.showEnglishSupplement);
  
  // Use a ref to track when the item changes to auto-play audio
  const itemRef = useRef(item);
  
  // Determine front language based on direction prop
  const isFrontVietnamese = direction === 'vn-to-cn';
  
  // Play the audio when a new card is shown
  useEffect(() => {
    // Only play audio when the item actually changes (not on initial render)
    if (itemRef.current.id !== item.id) {
      playCardAudio();
    }
    
    // Update the ref
    itemRef.current = item;
  }, [item.id]); // Only run when item.id changes
  
  // Function to play audio for the current card
  const playCardAudio = () => {
    // Stop any currently playing audio before starting new audio
    audioService.stop();
    
    // Determine the text and language based on the current direction
    const text = isFrontVietnamese ? item.vietnamese : item.chinese;
    const language = isFrontVietnamese ? 'vietnamese' : 'chinese';
    
    audioService.playText(text, language)
      .then(() => {
      })
      .catch(error => {
        console.error('Error playing audio:', error);
      });
  };
  
  const handleFlip = () => {
    setFlipped(!flipped);
    // No automatic audio playback when flipping for Vietnamese flashcards
  };
  
  const handleNext = () => {
    // Reset card state before moving to next
    setFlipped(false);
    setShowExample(false);
    onNext();
  };
  
  const toggleExample = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowExample(!showExample);
  };
  
  // Create a wrapper for AudioButton that prevents event propagation
  const AudioButtonWrapper = ({ text, language, className, size }: { 
    text: string; 
    language: 'vietnamese' | 'chinese'; 
    className?: string; 
    size?: 'sm' | 'md' | 'lg' 
  }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent the click from reaching the flipper div
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
  
  // Front content changes based on direction
  const renderFrontContent = () => (
    <div className="flex flex-col justify-between h-full bg-white dark:bg-gray-800 rounded-xl p-6 border-l-4 border-green-500">
      <div className="flex justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          VN {item.level} • {item.category}
        </span>
        <AudioButtonWrapper 
          text={isFrontVietnamese ? item.vietnamese : item.chinese} 
          language={isFrontVietnamese ? "vietnamese" : "chinese"} 
          className="ml-1" 
          size="sm" 
        />
      </div>
      
      <div className="text-center">
        <h2 className={`text-5xl font-bold ${isFrontVietnamese ? 'vietnamese-text text-green-700 dark:text-green-400' : 'chinese-text'}`}>
          {isFrontVietnamese ? item.vietnamese : item.chinese}
        </h2>
        {!isFrontVietnamese && item.pinyin && (
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">{item.pinyin}</p>
        )}
      </div>
      
      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
        Click to see {isFrontVietnamese ? 'Chinese translation' : 'Vietnamese word'}
      </p>
    </div>
  );
  
  // Back content changes based on direction
  const renderBackContent = () => (
    <div className="flex flex-col justify-between h-full bg-white dark:bg-gray-800 rounded-xl p-6 border-l-4 border-green-500">
      <div className="flex justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          VN {item.level} • {item.category}
        </span>
        <div className="flex space-x-3">
          <AudioButtonWrapper 
            text={isFrontVietnamese ? item.chinese : item.vietnamese} 
            language={isFrontVietnamese ? "chinese" : "vietnamese"} 
            className="ml-1" 
            size="sm" 
          />
          {item.examples && item.examples.length > 0 && (
            <button 
              onClick={toggleExample}
              className="text-green-600 dark:text-green-400 text-sm"
            >
              {showExample ? 'Hide Example' : 'Show Example'}
            </button>
          )}
        </div>
      </div>
      
      <div className="text-center">
        {/* Show first two Chinese meanings (target language) with optional English supplement */}
        {item.meanings && item.meanings.length > 0 ? (
          <div className="mt-3 space-y-3">
            {item.meanings.slice(0, 2).map((meaning, index) => (
              <div key={index}>
                <div className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-medium">
                  <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mr-2">
                    {index + 1}.
                  </span>
                  <span className="chinese-text">{meaning.chinese}</span>
                  {isFrontVietnamese && item.pinyin && (
                    <span className="block text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-1 ml-6">
                      {item.pinyin}
                    </span>
                  )}
                </div>
                {showEnglishSupplement && meaning.english && (
                  <p className="text-sm sm:text-base text-green-600 dark:text-green-400 ml-6 mt-1 italic">
                    "{meaning.english}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <div className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-medium chinese-text">
              {item.chinese}
              {isFrontVietnamese && item.pinyin && (
                <span className="block text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {item.pinyin}
                </span>
              )}
            </div>
            {showEnglishSupplement && item.english && (
              <p className="text-sm sm:text-base text-green-600 dark:text-green-400 mt-2 italic">
                "{item.english}"
              </p>
            )}
          </div>
        )}
        
        {showExample && item.examples && item.examples.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-1">
              <p className="text-md vietnamese-text">{item.examples[0].vietnamese}</p>
              <AudioButtonWrapper 
                text={item.examples[0].vietnamese} 
                language="vietnamese" 
                className="ml-2" 
                size="sm" 
              />
            </div>
            <div className="flex items-center justify-center mb-1">
              <p className="text-md chinese-text">{item.examples[0].chinese}</p>
              <AudioButtonWrapper 
                text={item.examples[0].chinese} 
                language="chinese" 
                className="ml-2" 
                size="sm" 
              />
            </div>
            {item.examples[0].pinyin && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.examples[0].pinyin}</p>
            )}
          </div>
        )}
      </div>
      
      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
        Click to see {isFrontVietnamese ? 'Vietnamese word' : 'Chinese translation'}
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
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VietnameseFlashcard;
