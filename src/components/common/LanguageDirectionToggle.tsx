import React from 'react';

export type LanguageDirection = 'vn-to-cn' | 'cn-to-vn';

interface LanguageDirectionToggleProps {
  direction: LanguageDirection;
  onChange: (direction: LanguageDirection) => void;
}

const LanguageDirectionToggle: React.FC<LanguageDirectionToggleProps> = ({
  direction,
  onChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Learning Direction</h3>
      
      <div className="flex flex-col space-y-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-600"
            checked={direction === 'vn-to-cn'}
            onChange={() => onChange('vn-to-cn')}
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">
            Learn Chinese from Vietnamese
          </span>
        </label>
        
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-600"
            checked={direction === 'cn-to-vn'}
            onChange={() => onChange('cn-to-vn')}
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">
            Learn Vietnamese from Chinese
          </span>
        </label>
      </div>
    </div>
  );
};

export default LanguageDirectionToggle;