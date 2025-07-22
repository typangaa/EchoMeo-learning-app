import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ReadingPassage } from '../types';
import { getReadingById, allReadings } from '../data/reading';
import PassageDetail from '../components/reading/passage/PassageDetail';
import { updateReadingProgress, getReadingCompletion } from '../utils/progressTracking';

const PassageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real app with a backend, this would fetch from an API
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const foundPassage = getReadingById(id || '');
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
    }, 300); // Brief loading delay for UX
  }, [id]);
  
  // Track scrolling to update completion percentage
  const handleScroll = () => {
    if (passage && completionPercentage < 100 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      if (scrollHeight > clientHeight) {
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        // Only update if the new percentage is higher
        if (scrollPercent > completionPercentage) {
          const newCompletion = Math.min(100, Math.round(scrollPercent));
          updateReadingProgress(passage.id, newCompletion);
          setCompletionPercentage(newCompletion);
        }
      }
    }
  };
  
  // Add scroll listener to the container
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [passage, completionPercentage]);
  
  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 md:mt-4 text-sm md:text-base">Loading passage...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!passage) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">Passage Not Found</h1>
            <p className="mb-4 md:mb-6 text-sm md:text-base text-gray-600 dark:text-gray-400">
              The reading passage you requested could not be found.
            </p>
            <Link 
              to="/reading" 
              className="inline-block bg-blue-600 text-white px-3 py-2 md:px-4 text-sm md:text-base rounded hover:bg-blue-700 transition-colors"
            >
              Back to Reading List
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Find previous and next passages
  const allIds = allReadings.map(p => p.id);
  const currentIndex = allIds.indexOf(passage.id);
  const prevId = currentIndex > 0 ? allIds[currentIndex - 1] : null;
  const nextId = currentIndex < allIds.length - 1 ? allIds[currentIndex + 1] : null;
  
  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="px-2 md:px-4 py-2 md:py-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 max-w-4xl mx-auto">
            <Link 
              to="/reading" 
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm md:text-base"
            >
              ← Back to Reading List
            </Link>
            
            <div className="flex items-center text-xs md:text-sm">
              <span className="text-gray-600 dark:text-gray-400 mr-1 md:mr-2">Completion:</span>
              <div className="w-20 md:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 md:h-2.5">
                <div 
                  className={`h-1.5 md:h-2.5 rounded-full transition-all duration-300 ${
                    completionPercentage >= 100
                      ? 'bg-green-600'
                      : completionPercentage >= 50
                        ? 'bg-blue-600'
                        : 'bg-yellow-600'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <span className="ml-1 md:ml-2">{completionPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto"
      >
        <div className="max-w-4xl mx-auto px-2 md:px-4 py-2 md:py-4">
          <PassageDetail passage={passage} />
          
          {/* Navigation Footer */}
          <div className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                {prevId && (
                  <Link 
                    to={`/reading/${prevId}`}
                    className="inline-block w-full sm:w-auto text-center bg-gray-200 dark:bg-gray-700 px-3 py-2 md:px-4 text-sm md:text-base rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    ← Previous Passage
                  </Link>
                )}
              </div>
              
              <div className="flex-1 flex justify-end">
                {nextId && (
                  <Link 
                    to={`/reading/${nextId}`}
                    className="inline-block w-full sm:w-auto text-center bg-blue-600 text-white px-3 py-2 md:px-4 text-sm md:text-base rounded hover:bg-blue-700 transition-colors"
                  >
                    Next Passage →
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Bottom padding for mobile */}
          <div className="pb-4 md:pb-6"></div>
        </div>
      </div>
    </div>
  );
};

export default PassageDetailPage;