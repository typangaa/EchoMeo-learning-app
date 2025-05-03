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
  
  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Play audio if available
  const playAudio = () => {
    if (vocabItem.audioUrl) {
      const audio = new Audio(vocabItem.audioUrl);
      audio.play();
    }
  };
  
  return (
    <div 
      ref={popoverRef}
      className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 w-64 border border-gray-200 dark:border-gray-700"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        maxWidth: '300px' 
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
      
      <p className="mb-1 text-lg chinese-text">{vocabItem.chinese}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{vocabItem.pinyin}</p>
      
      {vocabItem.english && (
        <p className="text-sm mb-2 border-t pt-2 border-gray-200 dark:border-gray-700">
          <span className="font-medium">English:</span> {vocabItem.english}
        </p>
      )}
      
      {vocabItem.examples && vocabItem.examples.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-semibold mb-1">Example:</h4>
          <p className="text-sm vietnamese-text">{vocabItem.examples[0].vietnamese}</p>
          <p className="text-sm chinese-text">{vocabItem.examples[0].chinese}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{vocabItem.examples[0].pinyin}</p>
        </div>
      )}
      
      {vocabItem.audioUrl && (
        <button 
          onClick={playAudio}
          className="mt-3 text-blue-600 dark:text-blue-400 text-sm flex items-center"
        >
          🔊 Listen
        </button>
      )}
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Level: {vocabItem.level} • Category: {vocabItem.category}
      </div>
    </div>
  );
};

export default VocabPopover;