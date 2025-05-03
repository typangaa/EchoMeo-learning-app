import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
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
            Học Tiếng Việt - 学越南语
          </NavLink>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-500 dark:text-gray-400"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/vocabulary" 
              className={({ isActive }) => 
                isActive ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
              }
            >
              Vocabulary
            </NavLink>
            
            <NavLink 
              to="/flashcards" 
              className={({ isActive }) => 
                isActive ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
              }
            >
              Flashcards
            </NavLink>
            
            <NavLink 
              to="/reading" 
              className={({ isActive }) => 
                isActive ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
              }
            >
              Reading
            </NavLink>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <NavLink 
                to="/vocabulary" 
                className={({ isActive }) => 
                  isActive ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Vocabulary
              </NavLink>
              
              <NavLink 
                to="/flashcards" 
                className={({ isActive }) => 
                  isActive ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Flashcards
              </NavLink>
              
              <NavLink 
                to="/reading" 
                className={({ isActive }) => 
                  isActive ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Reading
              </NavLink>
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 self-start"
                aria-label="Toggle dark mode"
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