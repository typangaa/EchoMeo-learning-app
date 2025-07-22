import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../stores';

const MobileBottomNav = () => {
  const { t } = useTranslation();
  const languagePairPreferences = useAppStore((state) => state.languagePairPreferences);
  
  // Determine which navigation items to show based on language learning preferences
  const getNavItems = () => {
    const { toLanguage } = languagePairPreferences;
    
    const baseItems = [
      {
        to: '/',
        icon: '🏠',
        label: t('nav.home'),
        color: 'text-blue-600 dark:text-blue-400'
      }
    ];

    // Add language-specific items
    if (toLanguage === 'vi') {
      baseItems.push({
        to: '/vietnamese-study',
        icon: '🇻🇳',
        label: t('nav.study'),
        color: 'text-green-600 dark:text-green-400'
      });
    } else if (toLanguage === 'mandarin') {
      baseItems.push({
        to: '/hsk-study',
        icon: '🇨🇳',
        label: t('nav.study'),
        color: 'text-red-600 dark:text-red-400'
      });
    } else {
      // Default fallback - show both options or generic study
      baseItems.push({
        to: '/vocabulary',
        icon: '📚',
        label: t('nav.browse'),
        color: 'text-purple-600 dark:text-purple-400'
      });
    }

    // Add flashcards
    if (toLanguage === 'vi') {
      baseItems.push({
        to: '/vietnamese-flashcards',
        icon: '🧠',
        label: t('nav.flashcards'),
        color: 'text-purple-600 dark:text-purple-400'
      });
    } else if (toLanguage === 'mandarin') {
      baseItems.push({
        to: '/hsk-flashcards',
        icon: '🧠',
        label: t('nav.flashcards'),
        color: 'text-purple-600 dark:text-purple-400'
      });
    } else {
      baseItems.push({
        to: '/flashcards',
        icon: '🧠',
        label: t('nav.flashcards'),
        color: 'text-purple-600 dark:text-purple-400'
      });
    }

    // Add settings
    baseItems.push({
      to: '/settings',
      icon: '⚙️',
      label: t('nav.settings'),
      color: 'text-gray-600 dark:text-gray-400'
    });

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) => {
              const baseClasses = "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1";
              const activeClasses = isActive 
                ? `${item.color} bg-gray-100 dark:bg-gray-700 shadow-sm` 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300";
              return `${baseClasses} ${activeClasses}`;
            }}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="text-xs font-medium truncate w-full text-center leading-tight">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;