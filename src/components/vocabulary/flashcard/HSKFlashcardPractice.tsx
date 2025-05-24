import { useState, useEffect } from 'react';
import { VocabularyItem } from '../../../types';
import HSKFlashcard from './HSKFlashcard';
import { LanguageDirection } from '../../common/LanguageDirectionToggle';
import { updateVocabularyProgress, updateStudyTime } from '../../../utils/progressTracking';

interface HSKFlashcardPracticeProps {
  vocabularyItems: VocabularyItem[];
  onComplete: () => void;
  hskLevel?: number;
}

const HSKFlashcardPractice: React.FC<HSKFlashcardPracticeProps> = ({ 
  vocabularyItems,
  onComplete,
  hskLevel = 1
}) => {
  // Make sure we have a full copy of all vocabulary items
  const [practiceItems, setPracticeItems] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [totalSeen, setTotalSeen] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  
  // Language direction state - for HSK Level 1, always Chinese to Vietnamese
  const direction: LanguageDirection = 'cn-to-vn';
  
  // HSK Level 1 is fixed to Chinese → Vietnamese direction
  
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
  
  // Direction is fixed for HSK Level 1 - no user control needed
  
  // Reset practice session
  const resetPractice = () => {
    // Reshuffle the practice items
    const shuffled = [...vocabularyItems].sort(() => Math.random() - 0.5);
    setPracticeItems(shuffled);
    setCurrentIndex(0);
    setTotalSeen(0);
    setCorrectAnswers(0);
    setShowSummary(false);
    setStartTime(new Date());
  };
  
  // Handle moving to the next card
  const handleNext = () => {
    // Mark current item as seen
    setTotalSeen(prev => prev + 1);
    
    // For HSK vocabulary, we'll track this as a correct answer for now
    // In the future, we could add user feedback for difficulty
    const wasCorrect = true; // Simplified for now
    
    if (wasCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Record practice for the current item
    if (practiceItems.length > 0) {
      const currentItem = practiceItems[currentIndex];
      updateVocabularyProgress(currentItem.id, wasCorrect);
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
        <div className="text-6xl mb-4">📚</div>
        <p className="text-lg mb-4">No HSK vocabulary items available for practice.</p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Make sure HSK Level {hskLevel} vocabulary is loaded.
        </p>
        <button
          onClick={onComplete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Back to HSK Vocabulary
        </button>
      </div>
    );
  }
  
  if (showSummary) {
    const accuracy = Math.round((correctAnswers / totalSeen) * 100);
    
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">HSK Practice Complete!</h2>
        
        <div className="mb-6 text-center">
          <span className="block text-3xl font-bold text-red-600 dark:text-red-400">
            {totalSeen}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            HSK {hskLevel} Words Practiced
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {correctAnswers}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Reviewed</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {accuracy}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Completion</div>
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Great job practicing HSK {hskLevel} vocabulary! Keep up the excellent work.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <button
              onClick={resetPractice}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Practice Again
            </button>
            
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to HSK Vocabulary
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">HSK {hskLevel} Flashcard Practice</h3>
          <p className="text-sm text-red-700 dark:text-red-300">
            Practice Chinese HSK vocabulary with spaced repetition. 
            <span className="font-medium">Direction: Chinese Characters → Vietnamese Translation</span>
          </p>
        </div>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Card {currentIndex + 1} of {practiceItems.length}
          </span>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            HSK Level {hskLevel} • {practiceItems[currentIndex]?.category || 'Vocabulary'}
          </div>
        </div>
        
        <button
          onClick={onComplete}
          className="text-sm text-gray-600 dark:text-gray-400 underline hover:text-gray-800 dark:hover:text-gray-200"
        >
          Exit Practice
        </button>
      </div>
      
      <HSKFlashcard 
        item={practiceItems[currentIndex]} 
        onNext={handleNext}
        direction={direction}
      />
      
      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-sm bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / practiceItems.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Progress stats */}
      <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
        <div>Reviewed: {totalSeen}</div>
        <div>Remaining: {practiceItems.length - currentIndex - 1}</div>
      </div>
    </div>
  );
};

export default HSKFlashcardPractice;