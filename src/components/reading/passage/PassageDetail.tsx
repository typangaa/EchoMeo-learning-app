import { useState } from 'react';
import { ReadingPassage, VocabularyItem } from '../../../types';
import VocabPopover from './VocabPopover';
import PassageQuiz from './PassageQuiz';

interface PassageDetailProps {
  passage: ReadingPassage;
  onQuizComplete?: (score: number) => void;
}

const PassageDetail: React.FC<PassageDetailProps> = ({ 
  passage,
  onQuizComplete 
}) => {
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Function to handle word click and display vocabulary popover
  const handleWordClick = (word: string, event: React.MouseEvent) => {
    const matchingVocabItem = passage.vocabulary.find(
      item => item.vietnamese.toLowerCase() === word.toLowerCase() || 
              item.chinese === word
    );
    
    if (matchingVocabItem) {
      setSelectedWord(matchingVocabItem);
      
      // Calculate popover position based on the clicked element
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setPopoverPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  };
  
  // Close popover when clicking outside
  const closePopover = () => {
    setSelectedWord(null);
  };
  
  // Handle quiz completion
  const handleQuizComplete = (score: number) => {
    if (onQuizComplete) {
      onQuizComplete(score);
    }
  };

  // Process paragraph text to make words clickable
  const processText = (text: string, isVietnamese: boolean) => {
    // Simple word splitting by spaces (can be improved for better segmentation)
    const words = text.split(' ');
    
    return words.map((word, index) => {
      // Clean the word of punctuation for matching but keep original for display
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      const isInVocabulary = passage.vocabulary.some(item => 
        isVietnamese 
          ? item.vietnamese.toLowerCase() === cleanWord.toLowerCase()
          : item.chinese === cleanWord
      );
      
      return (
        <span 
          key={index} 
          className={`${isInVocabulary ? 'cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900' : ''} ${isVietnamese ? 'vietnamese-text' : 'chinese-text'}`}
          onClick={isInVocabulary ? (e) => handleWordClick(cleanWord, e) : undefined}
        >
          {word}{' '}
        </span>
      );
    });
  };

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
            onClick={() => setShowQuiz(!showQuiz)}
          >
            {showQuiz ? 'Back to Reading' : 'Take Quiz'}
          </button>
        </div>
      </div>
      
      {!showQuiz ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b pb-2 vietnamese-text">Tiếng Việt</h3>
            {passage.paragraphs.map((para, index) => (
              <p 
                key={`vn-${index}`} 
                className="leading-relaxed" 
                onClick={closePopover}
              >
                {processText(para.vietnamese, true)}
              </p>
            ))}
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b pb-2 chinese-text">中文</h3>
            {passage.paragraphs.map((para, index) => (
              <p 
                key={`cn-${index}`} 
                className="leading-relaxed" 
                onClick={closePopover}
              >
                {processText(para.chinese, false)}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <PassageQuiz passage={passage} onComplete={handleQuizComplete} />
      )}
      
      {/* Vocabulary popover */}
      {selectedWord && (
        <VocabPopover 
          vocabItem={selectedWord} 
          position={popoverPosition}
          onClose={closePopover}
        />
      )}
      
      <div className="mt-8 border-t pt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Click on highlighted words to see translations and details.</p>
      </div>
    </div>
  );
};

export default PassageDetail;