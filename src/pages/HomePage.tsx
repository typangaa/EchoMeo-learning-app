import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../stores';
import { InstallButton } from '../components/pwa/InstallButton';

const HomePage = () => {
  const { t } = useTranslation();
  const languagePairPreferences = useAppStore((state) => state.languagePairPreferences);
  
  // Determine which language routes to show based on user's target language
  const isLearningChinese = languagePairPreferences.toLanguage === 'mandarin';
  const isLearningVietnamese = languagePairPreferences.toLanguage === 'vi';
  
  // Get the appropriate routes based on target language
  const getLanguageRoutes = () => {
    if (isLearningChinese) {
      return {
        browse: '/hsk',
        study: '/hsk-study', 
        flashcards: '/hsk-flashcards',
        languageLabel: 'Chinese (HSK)',
        languageIcon: '🇨🇳',
        browseClasses: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'
      };
    } else if (isLearningVietnamese) {
      return {
        browse: '/vietnamese',
        study: '/vietnamese-study',
        flashcards: '/vietnamese-flashcards', 
        languageLabel: 'Vietnamese',
        languageIcon: '🇻🇳',
        browseClasses: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'
      };
    } else {
      // Default fallback - show both options
      return null;
    }
  };

  const routes = getLanguageRoutes();
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          {t('home.title')}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6">
          {t('home.subtitle')}
        </p>
        
        {/* PWA Install Button */}
        <div className="flex justify-center">
          <InstallButton 
            variant="secondary" 
            size="sm"
            showIcon={true}
          />
        </div>
      </div>

      {routes ? (
        // Show menu for user's chosen language
        <div className="space-y-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <span className="text-2xl">{routes.languageIcon}</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Learning {routes.languageLabel}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Browse Vocabulary */}
            <Link 
              to={routes.browse}
              className={`group p-6 ${routes.browseClasses} rounded-xl border hover:shadow-lg transition-all duration-200`}
            >
              <div className="text-center">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-lg font-semibold mb-2">Browse Vocabulary</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore vocabulary by levels and topics
                </p>
              </div>
            </Link>

            {/* Vocabulary Study */}
            <Link 
              to={routes.study}
              className={`group p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-200`}
            >
              <div className="text-center">
                <div className="text-3xl mb-3">📖</div>
                <h3 className="text-lg font-semibold mb-2">Vocabulary Study</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interactive study mode with audio
                </p>
              </div>
            </Link>

            {/* Flashcard Practice */}
            <Link 
              to={routes.flashcards}
              className={`group p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-200`}
            >
              <div className="text-center">
                <div className="text-3xl mb-3">🧠</div>
                <h3 className="text-lg font-semibold mb-2">Flashcard Practice</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Practice with spaced repetition
                </p>
              </div>
            </Link>

            {/* Settings */}
            <Link 
              to="/settings"
              className={`group p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200`}
            >
              <div className="text-center">
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="text-lg font-semibold mb-2">Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Audio, language, and app preferences
                </p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        // Fallback: Show language selection if no preference set
        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Choose Your Learning Language</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Select which language you'd like to learn to access your personalized menu
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <Link 
              to="/welcome"
              className="group p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-200"
            >
              <div className="text-center">
                <div className="text-3xl mb-3">🇨🇳</div>
                <h3 className="text-lg font-semibold mb-2">Learn Chinese</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  HSK vocabulary and study tools
                </p>
              </div>
            </Link>

            <Link 
              to="/welcome"
              className="group p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-200"
            >
              <div className="text-center">
                <div className="text-3xl mb-3">🇻🇳</div>
                <h3 className="text-lg font-semibold mb-2">Learn Vietnamese</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vietnamese vocabulary by CEFR levels
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-8">
            <Link 
              to="/settings"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <span className="mr-2">⚙️</span>
              Set up your learning preferences
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;