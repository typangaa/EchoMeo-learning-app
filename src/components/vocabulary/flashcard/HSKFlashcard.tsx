import { useState, useEffect, useRef } from 'react';
import { VocabularyItem } from '../../../types';
import { LanguageDirection } from '../../common/LanguageDirectionToggle';
import AudioButton from '../../common/AudioButton';
import audioService from '../../../utils/audioService';
import useAutoplayPreference from '../../../hooks/useAutoplayPreference';
import { useAppStore } from '../../../stores';
import './flashcard.css';

interface HSKFlashcardProps {
  item: VocabularyItem;
  onNext: () => void;
  direction?: LanguageDirection;
}

const HSKFlashcard: React.FC<HSKFlashcardProps> = ({ 
  item, 
  onNext,
  direction = 'cn-to-vn' // Default to Chinese to Vietnamese for HSK
}) => {
  const [flipped, setFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  
  // Use autoplay preferences hook
  const { preferences } = useAutoplayPreference();
  
  // Get English supplement setting
  const showEnglishSupplement = useAppStore((state) => state.languagePairPreferences.showEnglishSupplement);
  
  // Use a ref to track when the item changes to auto-play audio
  const itemRef = useRef(item);
  
  // Determine front language based on direction prop
  const isFrontChinese = direction === 'cn-to-vn';
  
  // Play the audio when a new card is shown (only if autoplay is enabled)
  useEffect(() => {
    // Only play audio when the item actually changes (not on initial render)
    // and when autoplay on card change is enabled
    if (itemRef.current.id !== item.id && preferences.autoplayOnCardChange) {
      playCardAudio();
    }
    
    // Update the ref
    itemRef.current = item;
  }, [item.id, preferences.autoplayOnCardChange]); // Add autoplay preference as dependency
  
  // Function to play audio for the current card
  const playCardAudio = () => {
    // Stop any currently playing audio before starting new audio
    audioService.stop();
    
    // Determine the text and language based on the current direction
    const text = isFrontChinese ? item.chinese : item.vietnamese;
    const language = isFrontChinese ? 'chinese' : 'vietnamese';
    
    audioService.playText(text, language)
      .then(() => {
      })
      .catch(error => {
        console.error('Error playing audio:', error);
      });
  };
  
  const handleFlip = () => {
    setFlipped(!flipped);
    
    // Play audio on flip if autoplay on flip is enabled
    if (!flipped && preferences.autoplayOnFlip) {
      // Play audio for the back side when flipping
      const backText = isFrontChinese ? item.vietnamese : item.chinese;
      const backLanguage = isFrontChinese ? 'vietnamese' : 'chinese';
      
      // Small delay to let the card flip first
      setTimeout(() => {
        audioService.playText(backText, backLanguage)
          .catch(error => console.error('Error playing audio on flip:', error));
      }, 600); // Match this with the flip animation duration
    }
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
    <div className="flex flex-col justify-between h-full bg-white dark:bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          HSK {item.category.includes('HSK') ? item.category : '1'} • {item.level}
        </span>
        <AudioButtonWrapper 
          text={isFrontChinese ? item.chinese : item.vietnamese} 
          language={isFrontChinese ? "chinese" : "vietnamese"} 
          className="ml-1" 
          size="sm" 
        />
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
        Click to see {isFrontChinese ? 'Vietnamese translation' : 'Chinese characters'}
      </p>
    </div>
  );
  
  // Back content changes based on direction
  const renderBackContent = () => (
    <div className="flex flex-col justify-between h-full bg-white dark:bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          HSK {item.category.includes('HSK') ? item.category : '1'} • {item.level}
        </span>
        <div className="flex space-x-3">
          <AudioButtonWrapper 
            text={isFrontChinese ? item.vietnamese : item.chinese} 
            language={isFrontChinese ? "vietnamese" : "chinese"} 
            className="ml-1" 
            size="sm" 
          />
          {item.examples && item.examples.length > 0 && (
            <button 
              onClick={toggleExample}
              className="text-blue-600 dark:text-blue-400 text-sm"
            >
              {showExample ? 'Hide Example' : 'Show Example'}
            </button>
          )}
        </div>
      </div>
      
      <div className="text-center">
        {/* Show first two Vietnamese meanings (target language) with optional English supplement */}
        {item.meanings && item.meanings.length > 0 ? (
          <div className="mt-3 space-y-3">
            {item.meanings.slice(0, 2).map((meaning, index) => (
              <div key={index}>
                <div className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-medium">
                  <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mr-2">
                    {index + 1}.
                  </span>
                  <span className="vietnamese-text text-green-700 dark:text-green-400">{meaning.vietnamese}</span>
                  {!isFrontChinese && item.pinyin && (
                    <span className="block text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-1 ml-6 chinese-text">
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
            <div className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-medium vietnamese-text text-green-700 dark:text-green-400">
              {item.vietnamese}
              {!isFrontChinese && item.pinyin && (
                <span className="block text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-1 chinese-text">
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.examples[0].pinyin}</p>
          </div>
        )}
      </div>
      
      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
        Click to see {isFrontChinese ? 'Chinese characters' : 'Vietnamese translation'}
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
          className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HSKFlashcard;