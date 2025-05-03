import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ReadingPassage } from '../types';
import { sampleReadings } from '../data/sampleReadings';
import PassageDetail from '../components/reading/passage/PassageDetail';
import { updateReadingProgress, getReadingCompletion } from '../utils/progressTracking';

const PassageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use the sample data
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const foundPassage = sampleReadings.find(p => p.id === id);
      setPassage(foundPassage || null);
      
      if (foundPassage) {
        // Get the saved completion percentage
        const savedCompletion = getReadingCompletion(foundPassage.id);
        setCompletionPercentage(savedCompletion);
        
        // Update the reading progress to mark it as at least viewed
        if (savedCompletion < 10) {
          updateReadingProgress(foundPassage.id, 10);
          setCompletionPercentage(10);
        }
      }
      
      setLoading(false);
    }, 500); // Simulate loading delay
  }, [id]);
  
  // When a quiz is completed, update the progress
  const handleQuizCompletion = (score: number) => {
    if (passage) {
      // Mark as 100% completed when quiz is done
      updateReadingProgress(passage.id, 100, score);
      setCompletionPercentage(100);
    }
  };
  
  // Track scrolling to update completion percentage
  const handleScroll = () => {
    if (passage && completionPercentage < 90) {
      // Calculate a new completion percentage based on scroll position
      // This is a simple implementation - can be improved
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight, 
        document.documentElement.clientHeight, 
        document.documentElement.scrollHeight, 
        document.documentElement.offsetHeight
      );
      const windowHeight = window.innerHeight;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      // Only update if the new percentage is higher
      if (scrollPercent > completionPercentage) {
        const newCompletion = Math.min(90, Math.round(scrollPercent));
        updateReadingProgress(passage.id, newCompletion);
        setCompletionPercentage(newCompletion);
      }
    }
  };
  
  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [passage, completionPercentage]);
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading passage...</p>
      </div>
    );
  }
  
  if (!passage) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Passage Not Found</h1>
        <p className="mb-6">The reading passage you requested could not be found.</p>
        <Link to="/reading" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          Back to Reading List
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <Link to="/reading" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
          ← Back to Reading List
        </Link>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Completion:</span>
          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                completionPercentage >= 100
                  ? 'bg-green-600'
                  : completionPercentage >= 50
                    ? 'bg-blue-600'
                    : 'bg-yellow-600'
              }`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm">{completionPercentage}%</span>
        </div>
      </div>
      
      <PassageDetail passage={passage} onQuizComplete={handleQuizCompletion} />
      
      <div className="mt-8 flex justify-between">
        <div>
          {/* If there's a previous passage */}
          {parseInt(passage.id) > 1 && (
            <Link 
              to={`/reading/${parseInt(passage.id) - 1}`}
              className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ← Previous Passage
            </Link>
          )}
        </div>
        
        <div>
          {/* If there's a next passage */}
          {parseInt(passage.id) < sampleReadings.length && (
            <Link 
              to={`/reading/${parseInt(passage.id) + 1}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Next Passage →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassageDetailPage;