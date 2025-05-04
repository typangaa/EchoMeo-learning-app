import { useState, useEffect } from 'react';
import { ReadingPassage } from '../../../types';

interface PassageQuizProps {
  passage: ReadingPassage;
  onComplete?: (score: number) => void;
}

const PassageQuiz: React.FC<PassageQuizProps> = ({ passage, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hasReportedCompletion, setHasReportedCompletion] = useState(false);
  
  // If no questions are available, show a message
  if (!passage.questions || passage.questions.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p>No questions available for this reading passage.</p>
      </div>
    );
  }
  
  const currentQuestion = passage.questions[currentQuestionIndex];
  
  useEffect(() => {
    // Report quiz completion when showing results
    if (showResults && !hasReportedCompletion && onComplete) {
      const result = calculateScore();
      onComplete(result.percentage);
      setHasReportedCompletion(true);
    }
  }, [showResults, hasReportedCompletion, onComplete]);
  
  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < passage.questions!.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setHasReportedCompletion(false);
  };
  
  // Calculate results
  const calculateScore = () => {
    let correctAnswers = 0;
    
    selectedAnswers.forEach((answer, index) => {
      if (passage.questions![index].options[answer]?.isCorrect) {
        correctAnswers++;
      }
    });
    
    return {
      score: correctAnswers,
      total: passage.questions!.length,
      percentage: Math.round((correctAnswers / passage.questions!.length) * 100)
    };
  };
  
  if (showResults) {
    const result = calculateScore();
    
    return (
      <div className="text-center py-6">
        <h2 className="text-xl font-bold mb-4">Quiz Results</h2>
        
        <div className="mb-6 bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
          <p className="text-2xl font-bold mb-2">
            {result.score} / {result.total} correct
          </p>
          <p className="text-lg">
            Score: {result.percentage}%
          </p>
          
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 mt-4">
            <div 
              className={`h-4 rounded-full ${
                result.percentage >= 80 
                  ? 'bg-green-600' 
                  : result.percentage >= 60 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${result.percentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-6 mt-6 text-left">
          {passage.questions!.map((question, index) => {
            const selectedOption = selectedAnswers[index];
            const isCorrect = question.options[selectedOption]?.isCorrect;
            
            // Find the correct option index
            const correctOptionIndex = question.options.findIndex(option => option.isCorrect);
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  selectedOption !== undefined
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                <p className="font-medium mb-2">
                  {index + 1}. {question.question.vietnamese}
                </p>
                <p className="text-sm mb-3 chinese-text">
                  {question.question.chinese}
                </p>
                
                <div className="space-y-2 ml-4">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex}
                      className={`p-2 rounded ${
                        selectedOption === optionIndex
                          ? option.isCorrect
                            ? 'bg-green-200 dark:bg-green-800'
                            : 'bg-red-200 dark:bg-red-800'
                          : optionIndex === correctOptionIndex && selectedOption !== undefined
                            ? 'bg-green-100 dark:bg-green-900'
                            : ''
                      }`}
                    >
                      <p className="vietnamese-text">{option.vietnamese}</p>
                      <p className="text-sm chinese-text">{option.chinese}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <button
          onClick={resetQuiz}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry Quiz
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-inner p-6">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Question {currentQuestionIndex + 1} of {passage.questions.length}
        </span>
        <div className="flex space-x-1">
          {passage.questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestionIndex
                  ? 'bg-blue-600'
                  : selectedAnswers[index] !== undefined
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2 vietnamese-text">
          {currentQuestion.question.vietnamese}
        </h3>
        <p className="text-lg chinese-text">
          {currentQuestion.question.chinese}
        </p>
      </div>
      
      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border cursor-pointer hover:border-blue-500 ${
              selectedAnswers[currentQuestionIndex] === index
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => handleAnswerSelect(index)}
          >
            <p className="vietnamese-text">{option.vietnamese}</p>
            <p className="text-sm mt-1 chinese-text">{option.chinese}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded ${
            currentQuestionIndex === 0
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestionIndex] === undefined}
          className={`px-4 py-2 rounded ${
            selectedAnswers[currentQuestionIndex] === undefined
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {currentQuestionIndex < passage.questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default PassageQuiz;