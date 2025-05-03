import { useVocabulary } from '../../context/VocabularyContext';
import { CEFRLevel } from '../../types';

const VocabularyFilters = () => {
  const { 
    selectedLevel, 
    setSelectedLevel,
    selectedCategory,
    setSelectedCategory,
    categories,
    favorites
  } = useVocabulary();
  
  const levels: CEFRLevel[] = [
    "A1", "A2", "B1", "B2", "C1", "C2"
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">CEFR Level</label>
        <select 
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          value={selectedLevel}
          onChange={e => setSelectedLevel(e.target.value as CEFRLevel | 'all')}
        >
          <option value="all">All Levels</option>
          {levels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Category</label>
        <select 
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm mb-2">
          <span className="font-medium">Favorites:</span> {favorites.length} items
        </p>
      </div>
    </div>
  );
};

export default VocabularyFilters;