import { useState, useEffect, useCallback } from 'react';
import { ReadingPassage, VocabularyItem } from '../../../types';
import VocabPopover from './VocabPopover';

interface PassageDetailProps {
  passage: ReadingPassage;
}

type LayoutMode = 'parallel' | 'alternating';

const PassageDetail: React.FC<PassageDetailProps> = ({ passage }) => {
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('parallel');
  
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

  // Process Vietnamese text to make vocabulary words clickable
  const processVietnameseText = useCallback((text: string) => {
    // Create vocabulary map for faster lookups
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

  // Render parallel layout
  const renderParallelLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg border-b pb-2 vietnamese-text">Tiếng Việt</h3>
        {passage.paragraphs.map((para, index) => (
          <p 
            key={`vn-${index}`} 
            className="leading-relaxed vietnamese-text" 
          >
            {processVietnameseText(para.vietnamese)}
          </p>
        ))}
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg border-b pb-2 chinese-text">中文</h3>
        {passage.paragraphs.map((para, index) => (
          <p 
            key={`cn-${index}`} 
            className="leading-relaxed chinese-text" 
          >
            {processChineseText(para.chinese)}
          </p>
        ))}
      </div>
    </div>
  );

  // Render alternating layout
  const renderAlternatingLayout = () => (
    <div className="space-y-6 mb-6">
      {passage.paragraphs.map((para, index) => (
        <div key={`alt-${index}`} className="border-b dark:border-gray-700 pb-4">
          <p className="leading-relaxed vietnamese-text mb-2">
            {processVietnameseText(para.vietnamese)}
          </p>
          <p className="leading-relaxed chinese-text pl-4 border-l-4 border-gray-200 dark:border-gray-700">
            {processChineseText(para.chinese)}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 vietnamese-text">{passage.title.vietnamese}</h1>
        <h2 className="text-xl mb-4 chinese-text">{passage.title.chinese}</h2>
        <div className="flex justify-between items-center">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
            Level: {passage.level}
          </span>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            onClick={toggleLayout}
          >
            {layoutMode === 'parallel' ? 'Switch to Alternating Layout' : 'Switch to Parallel Layout'}
          </button>
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
        <p>Hover over vocabulary words and click to see translations and details.</p>
      </div>
    </div>
  );
};

export default PassageDetail;