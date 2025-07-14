import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const Navbar = () => {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Initialize dark mode state based on document class
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    
    // Save preference to localStorage
    if (document.documentElement.classList.contains('dark')) {
      localStorage.theme = 'dark';
    } else {
      localStorage.theme = 'light';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            <NavLink 
              to="/vietnamese" 
              className={({ isActive }) => 
                isActive ? "text-green-600 dark:text-green-400" : "hover:text-green-600 dark:hover:text-green-400"
              }
            >
              {t('nav.vietnamese')}
            </NavLink>
            
            <NavLink 
              to="/hsk" 
              className={({ isActive }) => 
                isActive ? "text-red-600 dark:text-red-400" : "hover:text-red-600 dark:hover:text-red-400"
              }
            >
              {t('nav.hsk')}
            </NavLink>
            
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
              <NavLink 
                to="/vietnamese" 
                className={({ isActive }) => 
                  isActive ? "text-green-600 dark:text-green-400" : "hover:text-green-600 dark:hover:text-green-400"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.vietnamese')}
              </NavLink>
              
              <NavLink 
                to="/hsk" 
                className={({ isActive }) => 
                  isActive ? "text-red-600 dark:text-red-400" : "hover:text-red-600 dark:hover:text-red-400"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.hsk')}
              </NavLink>
              
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
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 self-start"
                aria-label={t('nav.toggleDarkMode')}
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;