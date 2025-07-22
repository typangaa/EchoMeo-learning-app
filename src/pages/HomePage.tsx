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
    <div className="h-full max-h-full md:min-h-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -mx-4 -my-4 md:mx-auto md:my-0 md:bg-none flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col px-4 py-4 md:max-w-4xl md:mx-auto md:px-4 md:py-8">
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('home.title')}
          </h1>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 mb-2 md:mb-4 px-2">
            {t('home.subtitle')}
          </p>
          
          {/* PWA Install Button - Compact */}
          <div className="flex justify-center">
            <InstallButton 
              variant="secondary" 
              size="sm"
              showIcon={false}
            />
          </div>
        </div>

        {routes ? (
          // Show menu for user's chosen language
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-3 md:mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg">
                <span className="text-base md:text-xl">{routes.languageIcon}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 text-xs md:text-base">
                  Learning {routes.languageLabel}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 max-w-sm mx-auto md:max-w-lg md:gap-6">
              {/* Browse Vocabulary */}
              <Link 
                to={routes.browse}
                className={`group p-4 md:p-6 ${routes.browseClasses} rounded-xl md:rounded-2xl border shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200`}
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">📚</div>
                  <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-800 dark:text-gray-200">Browse</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed hidden md:block">
                    Explore vocabulary by levels
                  </p>
                </div>
              </Link>

              {/* Vocabulary Study */}
              <Link 
                to={routes.study}
                className="group p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl md:rounded-2xl border border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">📖</div>
                  <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-800 dark:text-gray-200">Study</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed hidden md:block">
                    Interactive mode with audio
                  </p>
                </div>
              </Link>

              {/* Flashcard Practice */}
              <Link 
                to={routes.flashcards}
                className="group p-4 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl md:rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">🧠</div>
                  <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-800 dark:text-gray-200">Flashcards</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed hidden md:block">
                    Practice with spaced repetition
                  </p>
                </div>
              </Link>

              {/* Settings */}
              <Link 
                to="/settings"
                className="group p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-3">⚙️</div>
                  <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-800 dark:text-gray-200">Settings</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed hidden md:block">
                    Audio, language, and app preferences
                  </p>
                </div>
              </Link>
          </div>
          </div>
        ) : (
          // Fallback: Show language selection if no preference set
          <div className="flex-1 flex flex-col text-center">
            <div className="mb-4 md:mb-6">
              <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-gray-800 dark:text-gray-200">Choose Your Learning Language</h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6 px-2">
                Select which language you'd like to learn
              </p>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-3 max-w-xs mx-auto md:grid-cols-2 md:max-w-lg md:gap-4">
              <Link 
                to="/welcome"
                className="group p-4 md:p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl md:rounded-2xl border border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3">🇨🇳</div>
                  <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-800 dark:text-gray-200">Learn Chinese</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden md:block">
                    HSK vocabulary and study tools
                  </p>
                </div>
              </Link>

              <Link 
                to="/welcome"
                className="group p-4 md:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl md:rounded-2xl border border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3">🇻🇳</div>
                  <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-800 dark:text-gray-200">Learn Vietnamese</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden md:block">
                    Vietnamese vocabulary by CEFR levels
                  </p>
                </div>
              </Link>
            </div>

            <div className="mt-4 md:mt-6">
              <Link 
                to="/settings"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-xs md:text-base"
              >
                <span className="mr-1">⚙️</span>
                Set up your learning preferences
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;