import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../stores';

const Navbar = () => {
  const { t, language } = useTranslation();
  const setLanguage = useAppStore((state) => state.setLanguage);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const languagePairPreferences = useAppStore((state) => state.languagePairPreferences);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isDarkMode = theme === 'dark';
  
  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Language icons mapping
  const languageIcons: Record<string, string> = {
    'en': '🇺🇸',
    'vi': '🇻🇳', 
    'zh': '🇨🇳',
    'zh-tw': '🇹🇼'
  };

  // Cycle through languages
  const cycleLanguage = () => {
    const languages = ['en', 'vi', 'zh', 'zh-tw'] as const;
    const currentIndex = languages.indexOf(language as any);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Determine which navigation items to show based on language learning preferences
  const getVisibleNavItems = () => {
    const { toLanguage } = languagePairPreferences;
    
    const navItems = {
      showVietnamese: toLanguage === 'vi',
      showVietnameseStudy: toLanguage === 'vi', 
      showHSK: toLanguage === 'mandarin',
      showHSKStudy: toLanguage === 'mandarin'
    };

    return navItems;
  };

  const visibleNavItems = getVisibleNavItems();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <NavLink to="/" className="text-xl font-bold vietnamese-text">
            {t('nav.appTitle')}
          </NavLink>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-500 dark:text-gray-400"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {visibleNavItems.showVietnamese && (
              <NavLink 
                to="/vietnamese" 
                className={({ isActive }) => 
                  isActive ? "text-green-600 dark:text-green-400" : "hover:text-green-600 dark:hover:text-green-400"
                }
              >
                {t('nav.vietnamese')}
              </NavLink>
            )}
            
            {visibleNavItems.showVietnameseStudy && (
              <NavLink 
                to="/vietnamese-study" 
                className={({ isActive }) => 
                  isActive ? "text-emerald-600 dark:text-emerald-400" : "hover:text-emerald-600 dark:hover:text-emerald-400"
                }
              >
                🇻🇳 {t('nav.vietnameseStudy')}
              </NavLink>
            )}
            
            {visibleNavItems.showHSK && (
              <NavLink 
                to="/hsk" 
                className={({ isActive }) => 
                  isActive ? "text-red-600 dark:text-red-400" : "hover:text-red-600 dark:hover:text-red-400"
                }
              >
                {t('nav.hsk')}
              </NavLink>
            )}
            
            {visibleNavItems.showHSKStudy && (
              <NavLink 
                to="/hsk-study" 
                className={({ isActive }) => 
                  isActive ? "text-orange-600 dark:text-orange-400" : "hover:text-orange-600 dark:hover:text-orange-400"
                }
              >
                📚 {t('nav.hskStudy')}
              </NavLink>
            )}
            
            <NavLink 
              to="/flashcards" 
              className={({ isActive }) => 
                isActive ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
              }
            >
              {t('nav.flashcards')}
            </NavLink>
            
            <NavLink 
              to="/reading" 
              className={({ isActive }) => 
                isActive ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
              }
            >
              {t('nav.reading')}
            </NavLink>
            
            
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                isActive ? "text-gray-800 dark:text-gray-200" : "hover:text-gray-600 dark:hover:text-gray-400"
              }
            >
              ⚙️ {t('nav.settings')}
            </NavLink>
            
            <button 
              onClick={cycleLanguage}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
              aria-label={`${t('nav.language')}: ${language}`}
              title={`${t('nav.language')}: ${language}`}
            >
              {languageIcons[language] || '🌐'}
            </button>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
              aria-label={t('nav.toggleDarkMode')}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            
            {/* Developer link - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <NavLink 
                to="/admin/translations" 
                className={({ isActive }) => 
                  isActive ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
                }
              >
                🔧 Admin
              </NavLink>
            )}
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              {visibleNavItems.showVietnamese && (
                <NavLink 
                  to="/vietnamese" 
                  className={({ isActive }) => 
                    isActive ? "text-green-600 dark:text-green-400" : "hover:text-green-600 dark:hover:text-green-400"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.vietnamese')}
                </NavLink>
              )}
              
              {visibleNavItems.showVietnameseStudy && (
                <NavLink 
                  to="/vietnamese-study" 
                  className={({ isActive }) => 
                    isActive ? "text-emerald-600 dark:text-emerald-400" : "hover:text-emerald-600 dark:hover:text-emerald-400"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  🇻🇳 {t('nav.vietnameseStudy')}
                </NavLink>
              )}
              
              {visibleNavItems.showHSK && (
                <NavLink 
                  to="/hsk" 
                  className={({ isActive }) => 
                    isActive ? "text-red-600 dark:text-red-400" : "hover:text-red-600 dark:hover:text-red-400"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.hsk')}
                </NavLink>
              )}
              
              {visibleNavItems.showHSKStudy && (
                <NavLink 
                  to="/hsk-study" 
                  className={({ isActive }) => 
                    isActive ? "text-orange-600 dark:text-orange-400" : "hover:text-orange-600 dark:hover:text-orange-400"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  📚 {t('nav.hskStudy')}
                </NavLink>
              )}
              
              <NavLink 
                to="/flashcards" 
                className={({ isActive }) => 
                  isActive ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.flashcards')}
              </NavLink>
              
              <NavLink 
                to="/reading" 
                className={({ isActive }) => 
                  isActive ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.reading')}
              </NavLink>
              
              
              <NavLink 
                to="/settings" 
                className={({ isActive }) => 
                  isActive ? "text-gray-800 dark:text-gray-200" : "hover:text-gray-600 dark:hover:text-gray-400"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                ⚙️ {t('nav.settings')}
              </NavLink>
              
              <div className="flex items-center space-x-3 self-start">
                <button 
                  onClick={cycleLanguage}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
                  aria-label={`${t('nav.language')}: ${language}`}
                  title={`${t('nav.language')}: ${language}`}
                >
                  {languageIcons[language] || '🌐'}
                </button>
                
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
                  aria-label={t('nav.toggleDarkMode')}
                >
                  {isDarkMode ? "☀️" : "🌙"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;