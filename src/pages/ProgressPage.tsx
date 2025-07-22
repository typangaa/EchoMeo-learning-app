import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../stores';

const ProgressPage = () => {
  const { t } = useTranslation();
  const languagePairPreferences = useAppStore((state) => state.languagePairPreferences);

  // Dummy progress data - replace with actual data from stores later
  const dummyProgressData = {
    hsk: {
      wordsLearned: 247,
      totalWords: 5000,
      lessonsCompleted: 12,
      totalLessons: 250,
      averageAccuracy: 87,
      streak: 7,
      studyTimeMinutes: 180,
      level: 3
    },
    vietnamese: {
      wordsLearned: 156,
      totalWords: 3000,
      lessonsCompleted: 8,
      totalLessons: 150,
      averageAccuracy: 92,
      streak: 4,
      studyTimeMinutes: 120,
      level: 2
    },
    overall: {
      totalStudyDays: 15,
      totalWords: 403,
      averageSessionTime: 20,
      favoriteWords: 34,
      weeklyGoal: 5, // sessions per week
      weeklyProgress: 3 // sessions completed this week
    }
  };

  const getLanguageSpecificProgress = () => {
    const { toLanguage } = languagePairPreferences;
    if (toLanguage === 'mandarin') return dummyProgressData.hsk;
    if (toLanguage === 'vi') return dummyProgressData.vietnamese;
    return null;
  };

  const languageProgress = getLanguageSpecificProgress();

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
              value={languageProgress?.streak || 0}
              subtitle="days"
              color="text-orange-600 dark:text-orange-400"
            />
            <StatCard
              icon="📚"
              title={t('progress.overview.totalWords')}
              value={dummyProgressData.overall.totalWords}
              subtitle="learned"
              color="text-blue-600 dark:text-blue-400"
            />
            <StatCard
              icon="⏱️"
              title={t('progress.overview.studyTime')}
              value={`${dummyProgressData.overall.averageSessionTime}m`}
              subtitle="avg/session"
              color="text-green-600 dark:text-green-400"
            />
            <StatCard
              icon="⭐"
              title={t('progress.overview.accuracy')}
              value={`${languageProgress?.averageAccuracy || 90}%`}
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
                ? `${t('progress.hsk.title')} ${t('progress.currentLevel')} ${languageProgress.level}`
                : `${t('progress.vietnamese.title')} ${t('progress.currentLevel')} ${languageProgress.level}`
              }
            </h2>
            
            <div className="space-y-4">
              <ProgressBar
                current={languageProgress.wordsLearned}
                total={languageProgress.totalWords}
                label={t('progress.wordsProgress')}
                color="bg-blue-500"
              />
              
              <ProgressBar
                current={languageProgress.lessonsCompleted}
                total={languageProgress.totalLessons}
                label={t('progress.lessonsProgress')}
                color="bg-green-500"
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
            current={dummyProgressData.overall.weeklyProgress}
            total={dummyProgressData.overall.weeklyGoal}
            label={t('progress.weeklyGoal.sessions')}
            color="bg-indigo-500"
          />
          
          <div className="grid grid-cols-7 gap-2 mt-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-500 mb-1">{day}</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < dummyProgressData.overall.weeklyProgress
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  {index < dummyProgressData.overall.weeklyProgress ? '✓' : '○'}
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
            <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {t('progress.achievements.firstWeek')}
              </div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-3xl mb-2">📖</div>
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {t('progress.achievements.words100')}
              </div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-sm font-medium text-green-800 dark:text-green-200">
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
              <span className="font-semibold">{dummyProgressData.overall.totalStudyDays} days</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('progress.statistics.favoriteWords')}</span>
              <span className="font-semibold">{dummyProgressData.overall.favoriteWords} words</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('progress.statistics.studyTime')}</span>
              <span className="font-semibold">{languageProgress?.studyTimeMinutes || 0} minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;