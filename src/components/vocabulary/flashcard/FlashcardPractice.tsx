import { useState, useEffect } from 'react';
import { VocabularyItem } from '../../../types';
import Flashcard from './Flashcard';
import { useSpacedRepetition } from '../../../hooks/useSpacedRepetition';
import { updateVocabularyProgress, updateStudyTime } from '../../../utils/progressTracking';

interface FlashcardPracticeProps {
  vocabularyItems: VocabularyItem[];
  onComplete: () => void;
}

const FlashcardPractice: React.FC<FlashcardPracticeProps> = ({ 
  vocabularyItems,
  onComplete
}) => {
  const {
    dueItems,
    getDueCount,
    addAllItems,
    recordCorrectAnswer,
    recordIncorrectAnswer
  } = useSpacedRepetition(vocabularyItems);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiceItems, setPracticeItems] = useState<VocabularyItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [results, setResults] = useState<{correct: number, incorrect: number}>({
    correct: 0,
    incorrect: 0
  });
  const [startTime, setStartTime] = useState<Date>(new Date());
  
  // Initialize all vocabulary items into the spaced repetition system
  useEffect(() => {
    if (vocabularyItems.length > 0) {
      addAllItems(vocabularyItems.map(item => item.id));
    }
    
    // Record start time for study time tracking
    setStartTime(new Date());
    
    // Cleanup function to record study time on unmount
    return () => {
      const now = new Date();
      const elapsedMinutes = Math.max(1, Math.round((now.getTime() - startTime.getTime()) / 60000));
      updateStudyTime(elapsedMinutes);
    };
  }, [vocabularyItems, addAllItems]);
  
  // Set up practice session
  useEffect(() => {
    // If we have due items, use those
    if (dueItems.length > 0) {
      setPracticeItems(dueItems);
    } 
    // Otherwise use a subset of all items (for demo purposes)
    else if (vocabularyItems.length > 0) {
      // For demo, just use up to 10 random items
      const randomItems = [...vocabularyItems]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(10, vocabularyItems.length));
      
      setPracticeItems(randomItems);
    }
  }, [dueItems, vocabularyItems]);
  
  const handleCorrect = (id: number) => {
    recordCorrectAnswer(id);
    updateVocabularyProgress(id, true);
    
    setResults(prev => ({
      ...prev,
      correct: prev.correct + 1
    }));
    moveToNextCard();
  };
  
  const handleIncorrect = (id: number) => {
    recordIncorrectAnswer(id);
    updateVocabularyProgress(id, false);
    
    setResults(prev => ({
      ...prev,
      incorrect: prev.incorrect + 1
    }));
    moveToNextCard();
  };
  
  const moveToNextCard = () => {
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
  
  const resetPractice = () => {
    setCurrentIndex(0);
    setShowSummary(false);
    setResults({ correct: 0, incorrect: 0 });
    setStartTime(new Date());
    
    // Re-shuffle practice items
    setPracticeItems(prevItems => [...prevItems].sort(() => Math.random() - 0.5));
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
    const accuracy = results.correct + results.incorrect > 0
      ? Math.round((results.correct / (results.correct + results.incorrect)) * 100)
      : 0;
      
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Practice Complete!</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <span className="block text-2xl font-bold text-green-600 dark:text-green-400">
              {results.correct}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Correct</span>
          </div>
          
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center">
            <span className="block text-2xl font-bold text-red-600 dark:text-red-400">
              {results.incorrect}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Incorrect</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Accuracy</h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div 
              className={`h-4 rounded-full ${
                accuracy >= 80 
                  ? 'bg-green-600' 
                  : accuracy >= 60 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${accuracy}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">{accuracy}%</p>
        </div>
        
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Items you answered incorrectly will appear again sooner in your practice schedule.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
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
      
      <Flashcard 
        item={practiceItems[currentIndex]} 
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
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