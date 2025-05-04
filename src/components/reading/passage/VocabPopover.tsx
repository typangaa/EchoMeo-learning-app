import { useEffect, useRef } from 'react';
import { VocabularyItem } from '../../../types';

interface VocabPopoverProps {
  vocabItem: VocabularyItem;
  position: { top: number; left: number };
  onClose: () => void;
}

const VocabPopover: React.FC<VocabPopoverProps> = ({ 
  vocabItem, 
  position, 
  onClose 
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  
  // Close popover when escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);
  
  // Play audio if available
  const playAudio = () => {
    if (vocabItem.audioUrl) {
      const audio = new Audio(vocabItem.audioUrl);
      audio.play();
    }
  };
  
  // Calculate proper position to ensure popover stays within viewport
  const calculatePosition = () => {
    let { top, left } = position;
    
    // Check if popover exists in the DOM
    if (popoverRef.current) {
      const popoverWidth = popoverRef.current.offsetWidth;
      const popoverHeight = popoverRef.current.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Adjust horizontal position if needed
      if (left + popoverWidth > viewportWidth - 20) {
        left = Math.max(20, viewportWidth - popoverWidth - 20);
      }
      
      // Adjust vertical position if needed
      if (top + popoverHeight > viewportHeight + window.scrollY - 20) {
        // Place above the word if there's not enough space below
        top = position.top - popoverHeight - 10;
      }
    }
    
    return { top, left };
  };
  
  const adjustedPosition = calculatePosition();
  
  return (
    <div 
      ref={popoverRef}
      className="vocab-popover absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 border border-gray-200 dark:border-gray-700 w-72 max-w-xs"
      style={{ 
        top: `${adjustedPosition.top}px`, 
        left: `${adjustedPosition.left}px`
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold vietnamese-text">{vocabItem.vietnamese}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md mb-2">
        <p className="mb-1 text-lg chinese-text">{vocabItem.chinese}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{vocabItem.pinyin}</p>
      </div>
      
      {vocabItem.english && (
        <div className="mb-2">
          <span className="font-medium text-sm">English:</span> 
          <span className="text-gray-700 dark:text-gray-300"> {vocabItem.english}</span>
        </div>
      )}
      
      {vocabItem.examples && vocabItem.examples.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-semibold mb-1">Example:</h4>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
            <p className="text-sm vietnamese-text">{vocabItem.examples[0].vietnamese}</p>
            <p className="text-sm chinese-text mt-1">{vocabItem.examples[0].chinese}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{vocabItem.examples[0].pinyin}</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {vocabItem.level} • {vocabItem.category}
        </div>
        
        {vocabItem.audioUrl && (
          <button 
            onClick={playAudio}
            className="text-blue-600 dark:text-blue-400 text-sm flex items-center"
          >
            🔊 Listen
          </button>
        )}
      </div>
    </div>
  );
};

export default VocabPopover;