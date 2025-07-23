import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore, useVocabularyStore, useProgressStore } from '../stores';
import { readingProgressTracker } from '../utils/readingProgress';
import { lessonCompletionTracker } from '../utils/lessonCompletion';
import { levelPersistenceTracker } from '../utils/levelPersistence';
import useHSKVocabulary from '../hooks/useHSKVocabulary';
import useVietnameseVocabulary from '../hooks/useVietnameseVocabulary';

const ProgressPage = () => {
  const { t } = useTranslation();
  const languagePairPreferences = useAppStore((state) => state.languagePairPreferences);
  const { favorites } = useVocabularyStore();
  const { userProgress } = useProgressStore();
  const [realProgressData, setRealProgressData] = useState<any>(null);
  
  // Load vocabulary data to calculate total words
  const { vocabulary: hskVocabulary } = useHSKVocabulary(1, { loadProgressively: false });
  const { vocabulary: vietnameseVocabulary } = useVietnameseVocabulary(1, { loadProgressively: false });
  
  useEffect(() => {
    const calculateRealProgress = () => {
      // Get all progress data from localStorage
      const readingProgress = readingProgressTracker.getAllProgress();
      const levelPersistence = levelPersistenceTracker.getAllLevels();
      
      // Calculate HSK progress
      const hskLevelsWithProgress = Object.keys(readingProgress.hsk).length;
      const hskTotalReadingProgress = Object.values(readingProgress.hsk).reduce((sum, pos) => sum + pos, 0);
      const hskCompletedLessons = lessonCompletionTracker.getOverallProgress('hsk');
      const hskFavoritesCount = favorites.hsk.size;
      
      // Calculate Vietnamese progress
      const vietnameseLevelsWithProgress = Object.keys(readingProgress.vietnamese).length;
      const vietnameseTotalReadingProgress = Object.values(readingProgress.vietnamese).reduce((sum, pos) => sum + pos, 0);
      const vietnameseCompletedLessons = lessonCompletionTracker.getOverallProgress('vietnamese');
      const vietnameseFavoritesCount = favorites.vietnamese.size;
      
      // Calculate totals
      const totalFavorites = hskFavoritesCount + vietnameseFavoritesCount;
      const totalLevelsStudied = hskLevelsWithProgress + vietnameseLevelsWithProgress;
      const totalWordsStudied = hskTotalReadingProgress + vietnameseTotalReadingProgress;
      
      const progressData = {
        hsk: {
          wordsStudied: hskTotalReadingProgress,
          levelsWithProgress: hskLevelsWithProgress,
          lessonsCompleted: hskCompletedLessons.totalCompleted,
          totalLessonsAvailable: Math.max(hskCompletedLessons.totalCompleted + 10, 50),
          currentLevel: levelPersistence.hsk.study,
          currentFlashcardLevel: levelPersistence.hsk.flashcards,
          favoritesCount: hskFavoritesCount,
          averageAccuracy: userProgress.averageAccuracy || 85
        },
        vietnamese: {
          wordsStudied: vietnameseTotalReadingProgress,
          levelsWithProgress: vietnameseLevelsWithProgress,
          lessonsCompleted: vietnameseCompletedLessons.totalCompleted,
          totalLessonsAvailable: Math.max(vietnameseCompletedLessons.totalCompleted + 10, 50),
          currentLevel: levelPersistence.vietnamese.study,
          currentFlashcardLevel: levelPersistence.vietnamese.flashcards,
          favoritesCount: vietnameseFavoritesCount,
          averageAccuracy: userProgress.averageAccuracy || 90
        },
        overall: {
          totalWordsStudied,
          totalLevelsStudied,
          totalFavorites,
          dailyStreak: userProgress.dailyStreak || 0,
          totalStudyTime: userProgress.totalStudyTime || 0,
          totalWordsLearned: userProgress.totalWordsLearned || totalWordsStudied,
          weeklyGoal: 5, // Default goal
          weeklyProgress: Math.min(userProgress.dailyStreak, 7) // Cap at 7 for weekly view
        }
      };
      
      setRealProgressData(progressData);
    };
    
    calculateRealProgress();
  }, [favorites, userProgress, hskVocabulary, vietnameseVocabulary]);

  const getLanguageSpecificProgress = () => {
    if (!realProgressData) return null;
    const { toLanguage } = languagePairPreferences;
    if (toLanguage === 'mandarin') return realProgressData.hsk;
    if (toLanguage === 'vi') return realProgressData.vietnamese;
    return null;
  };

  const languageProgress = getLanguageSpecificProgress();
  
  // Show loading state while calculating progress
  if (!realProgressData) {
    return (
      <div className="h-full max-h-full flex flex-col md:max-w-4xl md:mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-3xl font-bold mb-3 md:mb-6 flex-shrink-0">
          {t('progress.title')}
        </h1>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Calculating your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon, title, value, subtitle, color }: {
    icon: string;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className={`text-right ${color}`}>
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && <div className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</div>}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
    </div>
  );

  const ProgressBar = ({ current, total, label, color }: {
    current: number;
    total: number;
    label: string;
    color: string;
  }) => {
    const percentage = Math.round((current / total) * 100);
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {current} / {total} ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full max-h-full flex flex-col md:max-w-4xl md:mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-3 md:mb-6 flex-shrink-0">
        {t('progress.title')}
      </h1>
      
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 md:space-y-6">
        
        {/* Overall Progress Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {t('progress.overview.title')}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              icon="🔥"
              title={t('progress.overview.streak')}
              value={realProgressData.overall.dailyStreak}
              subtitle="days"
              color="text-orange-600 dark:text-orange-400"
            />
            <StatCard
              icon="📚"
              title={t('progress.overview.totalWords')}
              value={realProgressData.overall.totalWordsStudied}
              subtitle="studied"
              color="text-blue-600 dark:text-blue-400"
            />
            <StatCard
              icon="⏱️"
              title={t('progress.overview.studyTime')}
              value={`${Math.round(realProgressData.overall.totalStudyTime / 60) || 0}h`}
              subtitle="total"
              color="text-green-600 dark:text-green-400"
            />
            <StatCard
              icon="⭐"
              title={t('progress.overview.accuracy')}
              value={`${Math.round(languageProgress?.averageAccuracy || 0)}%`}
              subtitle="average"
              color="text-purple-600 dark:text-purple-400"
            />
          </div>
        </div>

        {/* Language-Specific Progress */}
        {languageProgress && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {languagePairPreferences.toLanguage === 'mandarin' 
                ? `${t('progress.hsk.title')} - Current Level ${languageProgress.currentLevel}`
                : `${t('progress.vietnamese.title')} - Current Level ${languageProgress.currentLevel}`
              }
            </h2>
            
            <div className="space-y-4">
              <ProgressBar
                current={languageProgress.wordsStudied}
                total={languageProgress.wordsStudied + 100} // Estimated based on progress
                label="Words Studied"
                color="bg-blue-500"
              />
              
              <ProgressBar
                current={languageProgress.lessonsCompleted}
                total={Math.max(languageProgress.totalLessonsAvailable, languageProgress.lessonsCompleted + 10)}
                label="Flashcard Lessons Completed"
                color="bg-green-500"
              />
              
              <ProgressBar
                current={languageProgress.levelsWithProgress}
                total={languagePairPreferences.toLanguage === 'mandarin' ? 7 : 6}
                label="Levels With Progress"
                color="bg-purple-500"
              />
            </div>
          </div>
        )}

        {/* Weekly Goal Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {t('progress.weeklyGoal.title')}
          </h2>
          
          <ProgressBar
            current={realProgressData.overall.weeklyProgress}
            total={realProgressData.overall.weeklyGoal}
            label={t('progress.weeklyGoal.sessions')}
            color="bg-indigo-500"
          />
          
          <div className="grid grid-cols-7 gap-2 mt-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-500 mb-1">{day}</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < realProgressData.overall.weeklyProgress
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  {index < realProgressData.overall.weeklyProgress ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {t('progress.achievements.title')}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className={`text-center p-3 rounded-lg ${
              realProgressData.overall.dailyStreak >= 7 
                ? 'bg-yellow-50 dark:bg-yellow-900/20' 
                : 'bg-gray-50 dark:bg-gray-800/50'
            }`}>
              <div className="text-3xl mb-2">{realProgressData.overall.dailyStreak >= 7 ? '🏆' : '🔒'}</div>
              <div className={`text-sm font-medium ${
                realProgressData.overall.dailyStreak >= 7
                  ? 'text-yellow-800 dark:text-yellow-200'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {t('progress.achievements.firstWeek')}
              </div>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${
              realProgressData.overall.totalWordsStudied >= 100
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'bg-gray-50 dark:bg-gray-800/50'
            }`}>
              <div className="text-3xl mb-2">{realProgressData.overall.totalWordsStudied >= 100 ? '📖' : '🔒'}</div>
              <div className={`text-sm font-medium ${
                realProgressData.overall.totalWordsStudied >= 100
                  ? 'text-blue-800 dark:text-blue-200'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {t('progress.achievements.words100')}
              </div>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${
              (languageProgress?.averageAccuracy || 0) >= 90
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-gray-50 dark:bg-gray-800/50'
            }`}>
              <div className="text-3xl mb-2">{(languageProgress?.averageAccuracy || 0) >= 90 ? '🎯' : '🔒'}</div>
              <div className={`text-sm font-medium ${
                (languageProgress?.averageAccuracy || 0) >= 90
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {t('progress.achievements.accuracy90')}
              </div>
            </div>
          </div>
        </div>

        {/* Study Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {t('progress.statistics.title')}
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('progress.statistics.totalStudyDays')}</span>
              <span className="font-semibold">{Math.max(realProgressData.overall.dailyStreak, 1)} days</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('progress.statistics.favoriteWords')}</span>
              <span className="font-semibold">{realProgressData.overall.totalFavorites} words</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('progress.statistics.studyTime')}</span>
              <span className="font-semibold">{Math.round(realProgressData.overall.totalStudyTime / 60) || 0} minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;