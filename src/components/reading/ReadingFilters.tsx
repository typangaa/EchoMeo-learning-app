import { CEFRLevel } from '../../types';

interface ReadingFiltersProps {
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
}

const ReadingFilters: React.FC<ReadingFiltersProps> = ({ 
  selectedLevel, 
  setSelectedLevel 
}) => {
  const levels: Array<CEFRLevel> = [
    "A1", "A2", "B1", "B2", "C1", "C2"
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-4">
      <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Filters</h2>
      
      <div className="mb-3 md:mb-4">
        <label className="block text-xs md:text-sm font-medium mb-2">CEFR Level</label>
        <select 
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm md:text-base"
          value={selectedLevel}
          onChange={e => setSelectedLevel(e.target.value)}
        >
          <option value="all">All Levels</option>
          {levels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      
      <div className="pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xs md:text-sm font-medium mb-2">Reading Tips</h3>
        <ul className="text-xs md:text-sm text-gray-600 dark:text-gray-400 space-y-1 md:space-y-2">
          <li>• Click on highlighted words to see translations</li>
          <li>• Toggle between parallel and alternating layouts</li>
          <li>• Practice reading aloud for pronunciation</li>
          <li>• Try to understand the context before checking vocabulary</li>
        </ul>
      </div>
    </div>
  );
};

export default ReadingFilters;