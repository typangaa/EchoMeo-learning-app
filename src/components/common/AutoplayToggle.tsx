import React from 'react';
import useAutoplayPreference from '../../hooks/useAutoplayPreference';

interface AutoplayToggleProps {
  className?: string;
  showAdvancedOptions?: boolean;
}

const AutoplayToggle: React.FC<AutoplayToggleProps> = ({ 
  className = '',
  showAdvancedOptions = false 
}) => {
  const { 
    preferences, 
    toggleAutoplayOnCardChange, 
    toggleAutoplayOnFlip,
    resetToDefaults 
  } = useAutoplayPreference();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          🔊 Audio Settings
        </h3>
        {showAdvancedOptions && (
          <button
            onClick={resetToDefaults}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
            title="Reset to default settings"
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Main autoplay toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <label htmlFor="autoplay-card-change" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Auto-play on new card
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Automatically play audio when a new flashcard appears
          </p>
        </div>
        <button
          id="autoplay-card-change"
          onClick={toggleAutoplayOnCardChange}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
            preferences.autoplayOnCardChange
              ? 'bg-blue-600'
              : 'bg-gray-200 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={preferences.autoplayOnCardChange}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              preferences.autoplayOnCardChange ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Advanced options */}
      {showAdvancedOptions && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label htmlFor="autoplay-flip" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-play on card flip
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Automatically play audio when flipping to the answer
              </p>
            </div>
            <button
              id="autoplay-flip"
              onClick={toggleAutoplayOnFlip}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                preferences.autoplayOnFlip
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={preferences.autoplayOnFlip}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  preferences.autoplayOnFlip ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}
      
      {/* Status indicator */}
      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center text-xs">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            preferences.autoplayOnCardChange || preferences.autoplayOnFlip
              ? 'bg-green-500' 
              : 'bg-gray-400'
          }`} />
          <span className="text-gray-500 dark:text-gray-400">
            {preferences.autoplayOnCardChange || preferences.autoplayOnFlip
              ? 'Autoplay enabled'
              : 'Autoplay disabled'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default AutoplayToggle;
