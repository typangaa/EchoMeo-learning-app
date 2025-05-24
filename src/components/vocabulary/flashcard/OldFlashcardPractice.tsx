import { useState, useEffect } from 'react';
import { VocabularyItem } from '../../../types';
import OldFlashcard from './OldFlashcard';
import LanguageDirectionToggle, { LanguageDirection } from '../../common/LanguageDirectionToggle';
import { updateVocabularyProgress, updateStudyTime } from '../../../utils/progressTracking';

interface FlashcardPracticeProps {
  vocabularyItems: VocabularyItem[];
  onComplete: () => void;
}

const FlashcardPractice: React.FC<FlashcardPracticeProps> = ({ 
  vocabularyItems,
  onComplete
}) => {
  // Make sure we have a full copy of all vocabulary items
  const [practiceItems, setPracticeItems] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [totalSeen, setTotalSeen] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  
  // Language direction state
  const [direction, setDirection] = useState<LanguageDirection>(() => {
    // Get saved direction preference from localStorage or default to Vietnamese to Chinese
    const saved = localStorage.getItem('language_direction');
    return (saved as LanguageDirection) || 'vn-to-cn';
  });
  
  // Save direction preference when it changes
  useEffect(() => {
    localStorage.setItem('language_direction', direction);
  }, [direction]);
  
  // Initialize practice session with shuffled vocabulary items
  useEffect(() => {
    if (vocabularyItems.length > 0) {
      // Create a shuffled copy of the vocabulary items
      const shuffled = [...vocabularyItems].sort(() => Math.random() - 0.5);
      setPracticeItems(shuffled);
    }
    
    // Record start time for study time tracking
    setStartTime(new Date());
    
    // Cleanup function to record study time on unmount
    return () => {
      const now = new Date();
      const elapsedMinutes = Math.max(1, Math.round((now.getTime() - startTime.getTime()) / 60000));
      updateStudyTime(elapsedMinutes);
    };
  }, [vocabularyItems]);
  
  // Handle direction change
  const handleDirectionChange = (newDirection: LanguageDirection) => {
    setDirection(newDirection);
  };
  
  // Reset practice session
  const resetPractice = () => {
    // Reshuffle the practice items
    const shuffled = [...vocabularyItems].sort(() => Math.random() - 0.5);
    setPracticeItems(shuffled);
    setCurrentIndex(0);
    setTotalSeen(0);
    setShowSummary(false);
    setStartTime(new Date());
  };
  
  // Handle moving to the next card
  const handleNext = () => {
    // Mark current item as seen
    setTotalSeen(prev => prev + 1);
    
    // Record practice for the current item (neutral progress)
    if (practiceItems.length > 0) {
      const currentItem = practiceItems[currentIndex];
      updateVocabularyProgress(currentItem.id, true);
    }
    
    // Move to the next card or show summary if finished
    if (currentIndex < practiceItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Record study time when practice session completes
      const now = new Date();
      const elapsedMinutes = Math.max(1, Math.round((now.getTime() - startTime.getTime()) / 60000));
      updateStudyTime(elapsedMinutes);
      
      setShowSummary(true);
    }
  };
  
  if (practiceItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg mb-4">No vocabulary items available for practice.</p>
        <button
          onClick={onComplete}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back
        </button>
      </div>
    );
  }
  
  if (showSummary) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Practice Complete!</h2>
        
        <div className="mb-6 text-center">
          <span className="block text-3xl font-bold text-blue-600 dark:text-blue-400">
            {totalSeen}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Words Practiced
          </span>
        </div>
        
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Great job! You've completed this practice session.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <button
              onClick={resetPractice}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Practice Again
            </button>
            
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <LanguageDirectionToggle 
          direction={direction} 
          onChange={handleDirectionChange} 
        />
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Card {currentIndex + 1} of {practiceItems.length}
          </span>
        </div>
        
        <button
          onClick={onComplete}
          className="text-sm text-gray-600 dark:text-gray-400 underline"
        >
          Exit Practice
        </button>
      </div>
      
      <OldFlashcard 
        item={practiceItems[currentIndex]} 
        onNext={handleNext}
        direction={direction}
      />
      
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-sm bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${((currentIndex + 1) / practiceItems.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPractice;