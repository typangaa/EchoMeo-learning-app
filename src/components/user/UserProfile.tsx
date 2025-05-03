import { useState, useEffect } from 'react';
import { getUserStatistics, resetProgress } from '../../utils/progressTracking';

const UserProfile = () => {
  const [statistics, setStatistics] = useState({
    totalVocabularyMastered: 0,
    totalReadingCompleted: 0,
    lastLoginDate: '',
    streakDays: 0,
    totalStudyTime: 0
  });
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  useEffect(() => {
    // Load user statistics
    setStatistics(getUserStatistics());
    
    // This would be a good place to call updateLoginStreak()
    // But for demo purposes, we'll skip it to avoid manipulating the streak artificially
  }, []);
  
  const handleResetProgress = () => {
    if (showResetConfirm) {
      resetProgress();
      setStatistics(getUserStatistics());
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format minutes as hours and minutes
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    
    return `${mins}m`;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Current Streak
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold mr-2">{statistics.streakDays}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">days</span>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Vocabulary Mastered
            </h3>
            <p className="text-2xl font-bold">{statistics.totalVocabularyMastered}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Reading Passages Completed
            </h3>
            <p className="text-2xl font-bold">{statistics.totalReadingCompleted}</p>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Last Login
            </h3>
            <p className="text-lg">{formatDate(statistics.lastLoginDate)}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Study Time
            </h3>
            <p className="text-2xl font-bold">{formatStudyTime(statistics.totalStudyTime)}</p>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleResetProgress}
              className={`px-4 py-2 rounded ${
                showResetConfirm
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {showResetConfirm ? 'Confirm Reset' : 'Reset Progress'}
            </button>
            
            {showResetConfirm && (
              <button
                onClick={() => setShowResetConfirm(false)}
                className="ml-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;