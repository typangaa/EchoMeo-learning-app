import { useState, useEffect, useCallback } from 'react';
import { ReadingPassage, VocabularyItem } from '../../../types';
import VocabPopover from './VocabPopover';
import AudioButton from '../../common/AudioButton';
import { useAudio } from '../../../contexts/AudioContext';

interface PassageDetailProps {
  passage: ReadingPassage;
}

type LayoutMode = 'parallel' | 'alternating';

const PassageDetail: React.FC<PassageDetailProps> = ({ passage }) => {
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('parallel');
  const [showPinyin, setShowPinyin] = useState(true);
  
  // Use the audio context
  const { state: audioState, playPassage, stopPlayback } = useAudio();
  
  // Determine if this passage is currently being played
  const isCurrentPassagePlaying = audioState.isPlaying && audioState.passageId === passage.id;
  
  // Function to handle word click and display vocabulary popover
  const handleWordClick = useCallback((vocabItem: VocabularyItem, event: React.MouseEvent) => {
    setSelectedWord(vocabItem);
    
    // Calculate popover position based on the clicked element
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    
    // Position the popover centered below the word if possible
    const left = rect.left + (rect.width / 2) - 150; // Half the popover width
    
    setPopoverPosition({
      top: rect.bottom + window.scrollY + 5, // 5px below the word
      left: Math.max(10, left) // Ensure it's not too far to the left
    });
  }, []);
  
  // Close popover when clicking outside
  const closePopover = useCallback(() => {
    setSelectedWord(null);
  }, []);
  
  // Add global click handler to close popover when clicking outside
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      // Check if click is outside a highlighted word and outside the popover
      const target = event.target as HTMLElement;
      if (
        !target.closest('.vocab-word') && 
        !target.closest('.vocab-popover')
      ) {
        closePopover();
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [closePopover]);

  // Clean up any playing audio when component unmounts
  useEffect(() => {
    return () => {
      console.log('[DEBUG PassageDetail] Component unmounting, cleaning up audio');
      // Audio cleanup is handled by the AudioContext
    };
  }, []);

  // Handler for playing/stopping full passage
  const handlePassagePlayback = async (language: 'vietnamese' | 'chinese') => {
    console.log(`[DEBUG PassageDetail] Handle playback for ${language}`);
    
    if (isCurrentPassagePlaying && audioState.language === language) {
      console.log('[DEBUG PassageDetail] Stopping current playback');
      stopPlayback();
    } else {
      console.log('[DEBUG PassageDetail] Starting new playback');
      await playPassage(passage, language);
    }
  };

  // Process Vietnamese text to make vocabulary words clickable
  const processVietnameseText = useCallback((text: string) => {
    const vocabMap = new Map<string, VocabularyItem>();
    
    // Add single words
    passage.vocabulary.forEach(item => {
      vocabMap.set(item.vietnamese.toLowerCase(), item);
    });
    
    // Add multi-word phrases (for phrases like "xin chào", "cảm ơn")
    passage.vocabulary.forEach(item => {
      const words = item.vietnamese.split(/\s+/);
      if (words.length > 1) {
        vocabMap.set(item.vietnamese.toLowerCase(), item);
      }
    });
    
    // First, try to match multi-word phrases
    let result: React.ReactNode[] = [];
    let currentIndex = 0;
    let remainingText = text;
    
    // Flag to track if we found any multi-word matches
    let foundMultiWord = false;
    
    // Try to match multi-word phrases first
    passage.vocabulary.forEach(item => {
      const vietnameseWords = item.vietnamese.toLowerCase().split(/\s+/);
      if (vietnameseWords.length > 1) {
        const phrase = item.vietnamese.toLowerCase();
        const phraseRegex = new RegExp(`\\b${phrase.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        
        let match;
        while ((match = phraseRegex.exec(remainingText.toLowerCase())) !== null) {
          // Get the actual phrase with original casing
          const actualPhrase = remainingText.substring(match.index, match.index + phrase.length);
          
          // Add text before the phrase
          if (match.index > 0) {
            // Process the text before the phrase for single words
            const beforeText = remainingText.substring(0, match.index);
            result = result.concat(processSingleWordsVietnamese(beforeText, vocabMap));
          }
          
          // Add the phrase as a clickable span
          result.push(
            <span 
              key={`phrase-${currentIndex}-${match.index}`}
              className="vocab-word cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded pr-1 vietnamese-text"
              onClick={(e) => handleWordClick(item, e)}
            >
              {actualPhrase}
            </span>
          );
          
          // Update remaining text and index
          remainingText = remainingText.substring(match.index + phrase.length);
          currentIndex += match.index + phrase.length;
          foundMultiWord = true;
          
          // Break after finding first match to avoid overlapping matches
          break;
        }
      }
    });
    
    // If we found multi-word matches, process any remaining text for single words
    if (foundMultiWord && remainingText.length > 0) {
      result = result.concat(processSingleWordsVietnamese(remainingText, vocabMap));
      return result;
    }
    
    // If no multi-word matches were found, process the entire text for single words
    return processSingleWordsVietnamese(text, vocabMap);
  }, [passage.vocabulary, handleWordClick]);
  
  // Helper function to process single Vietnamese words
  const processSingleWordsVietnamese = useCallback((text: string, vocabMap: Map<string, VocabularyItem>) => {
    const wordRegex = /([^\s.,;:!?()]+)([.,;:!?()]*)(\s*)/g;
    const result: React.ReactNode[] = [];
    let match;
    
    // Reset regex
    wordRegex.lastIndex = 0;
    
    while ((match = wordRegex.exec(text)) !== null) {
      const [, word, punctuation, space] = match;
      const wordLower = word.toLowerCase();
      
      // Check if word is in vocabulary
      if (vocabMap.has(wordLower)) {
        const vocabItem = vocabMap.get(wordLower)!;
        
        // Add clickable word
        result.push(
          <span 
            key={`word-${match.index}`}
            className="vocab-word cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded vietnamese-text"
            onClick={(e) => handleWordClick(vocabItem, e)}
          >
            {word}
          </span>
        );
        
        // Add punctuation and space
        if (punctuation) result.push(punctuation);
        if (space) result.push(space);
      } else {
        // Add non-vocabulary word as-is
        result.push(match[0]);
      }
    }
    
    return result;
  }, [handleWordClick]);

  // Process Chinese text to make vocabulary words clickable
  const processChineseText = useCallback((text: string) => {
    // Create a map for Chinese vocabulary lookup
    const vocabMap = new Map<string, VocabularyItem>();
    passage.vocabulary.forEach(item => {
      vocabMap.set(item.chinese, item);
    });
    
    const result: React.ReactNode[] = [];
    
    // Chinese characters don't have spaces, so we need to check each character
    // and also look for multi-character words in vocabulary
    let currentIndex = 0;
    
    while (currentIndex < text.length) {
      let foundMatch = false;
      
      // Try to find the longest matching vocabulary word starting at current position
      // Start with longer phrases and work down to single characters
      for (let length = Math.min(10, text.length - currentIndex); length > 0; length--) {
        const substring = text.substring(currentIndex, currentIndex + length);
        
        if (vocabMap.has(substring)) {
          // Found a match in vocabulary
          const vocabItem = vocabMap.get(substring)!;
          
          result.push(
            <span 
              key={`cn-${currentIndex}`}
              className="vocab-word cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded chinese-text"
              onClick={(e) => handleWordClick(vocabItem, e)}
            >
              {substring}
            </span>
          );
          
          currentIndex += length;
          foundMatch = true;
          break;
        }
      }
      
      // If no match was found, add the character as-is
      if (!foundMatch) {
        // Check for punctuation
        const char = text[currentIndex];
        const isPunctuation = /[.,;:!?()]/.test(char);
        
        if (isPunctuation) {
          result.push(<span key={`punct-${currentIndex}`}>{char}</span>);
        } else {
          result.push(<span key={`plain-${currentIndex}`}>{char}</span>);
        }
        
        currentIndex++;
      }
    }
    
    return result;
  }, [passage.vocabulary, handleWordClick]);

  // Toggle between parallel and alternating layouts
  const toggleLayout = () => {
    setLayoutMode(prevMode => prevMode === 'parallel' ? 'alternating' : 'parallel');
  };

  // Toggle pinyin display
  const togglePinyin = () => {
    setShowPinyin(prev => !prev);
  };

  // Render parallel layout
  const renderParallelLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg border-b pb-2 flex items-center vietnamese-text">
          Tiếng Việt
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePassagePlayback('vietnamese');
            }}
            className={`ml-2 inline-flex items-center justify-center rounded-full 
                     ${isCurrentPassagePlaying && audioState.language === 'vietnamese' ? 
                      'text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50' : 
                      'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'} 
                     transition-colors p-1`}
            title="Play full passage in Vietnamese"
            aria-label="Play full passage in Vietnamese"
          >
            {isCurrentPassagePlaying && audioState.language === 'vietnamese' ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5 animate-pulse"
              >
                <rect x="1" y="7" width="3" height="10" rx="1.5"></rect>
                <rect x="6" y="5" width="3" height="14" rx="1.5"></rect>
                <rect x="11" y="3" width="3" height="18" rx="1.5"></rect>
                <rect x="16" y="5" width="3" height="14" rx="1.5"></rect>
                <rect x="21" y="7" width="3" height="10" rx="1.5"></rect>
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
        </h3>
        {passage.paragraphs.map((para, index) => (
          <div 
            key={`vn-${index}`}
            className="group flex items-start"
          >
            <p className="leading-relaxed vietnamese-text flex-grow">
              {processVietnameseText(para.vietnamese)}
            </p>
            <AudioButton 
              text={para.vietnamese}
              language="vietnamese"
              className="ml-2 self-start mt-1 opacity-0 group-hover:opacity-100"
              size="sm"
            />
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg border-b pb-2 flex items-center chinese-text">
          中文
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePassagePlayback('chinese');
            }}
            className={`ml-2 inline-flex items-center justify-center rounded-full 
                     ${isCurrentPassagePlaying && audioState.language === 'chinese' ? 
                      'text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50' : 
                      'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'} 
                     transition-colors p-1`}
            title="Play full passage in Chinese"
            aria-label="Play full passage in Chinese"
          >
            {isCurrentPassagePlaying && audioState.language === 'chinese' ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5 animate-pulse"
              >
                <rect x="1" y="7" width="3" height="10" rx="1.5"></rect>
                <rect x="6" y="5" width="3" height="14" rx="1.5"></rect>
                <rect x="11" y="3" width="3" height="18" rx="1.5"></rect>
                <rect x="16" y="5" width="3" height="14" rx="1.5"></rect>
                <rect x="21" y="7" width="3" height="10" rx="1.5"></rect>
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
        </h3>
        {passage.paragraphs.map((para, index) => (
          <div key={`cn-${index}`} className="mb-4 group">
            <div className="flex items-start">
              <p className="leading-relaxed chinese-text flex-grow">
                {processChineseText(para.chinese)}
              </p>
              <AudioButton 
                text={para.chinese}
                language="chinese"
                className="ml-2 self-start mt-1 opacity-0 group-hover:opacity-100"
                size="sm"
              />
            </div>
            {showPinyin && para.pinyin && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                {para.pinyin}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render alternating layout
  const renderAlternatingLayout = () => (
    <div className="space-y-6 mb-6">
      {passage.paragraphs.map((para, index) => (
        <div key={`alt-${index}`} className="border-b dark:border-gray-700 pb-4">
          <div className="flex items-start group mb-2">
            <p className="leading-relaxed vietnamese-text flex-grow">
              {processVietnameseText(para.vietnamese)}
            </p>
            <AudioButton 
              text={para.vietnamese}
              language="vietnamese"
              className="ml-2 self-start mt-1 opacity-0 group-hover:opacity-100"
              size="sm"
            />
          </div>
          <div className="pl-4 border-l-4 border-gray-200 dark:border-gray-700">
            <div className="flex items-start group">
              <p className="leading-relaxed chinese-text flex-grow">
                {processChineseText(para.chinese)}
              </p>
              <AudioButton 
                text={para.chinese}
                language="chinese"
                className="ml-2 self-start mt-1 opacity-0 group-hover:opacity-100"
                size="sm"
              />
            </div>
            {showPinyin && para.pinyin && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                {para.pinyin}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h1 className="text-2xl font-bold vietnamese-text mr-2">{passage.title.vietnamese}</h1>
          <AudioButton 
            text={passage.title.vietnamese}
            language="vietnamese"
            size="md"
          />
        </div>
        <div className="flex items-center mb-1">
          <h2 className="text-xl chinese-text mr-2">{passage.title.chinese}</h2>
          <AudioButton 
            text={passage.title.chinese}
            language="chinese"
            size="md"
          />
        </div>
        {showPinyin && passage.title.pinyin && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {passage.title.pinyin}
          </p>
        )}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
            Level: {passage.level}
          </span>
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm"
              onClick={togglePinyin}
            >
              {showPinyin ? 'Hide Pinyin' : 'Show Pinyin'}
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              onClick={toggleLayout}
            >
              {layoutMode === 'parallel' ? 'Switch to Alternating Layout' : 'Switch to Parallel Layout'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Content based on selected layout */}
      {layoutMode === 'parallel' ? renderParallelLayout() : renderAlternatingLayout()}
      
      {/* Vocabulary popover */}
      {selectedWord && (
        <VocabPopover 
          vocabItem={selectedWord} 
          position={popoverPosition}
          onClose={closePopover}
        />
      )}
      
      <div className="mt-8 border-t pt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Hover over vocabulary words and click to see translations and details. Click the play button next to "Tiếng Việt" or "中文" to listen to the entire passage.</p>
      </div>
    </div>
  );
};

export default PassageDetail;