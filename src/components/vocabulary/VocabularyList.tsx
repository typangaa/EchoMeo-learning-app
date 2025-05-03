import { useEffect } from 'react';
import { useVocabulary } from '../../context/VocabularyContext';
import VocabularyCard from './VocabularyCard';

interface VocabularyListProps {
  searchTerm: string;
  showFavoritesOnly?: boolean;
}

const VocabularyList: React.FC<VocabularyListProps> = ({ 
  searchTerm, 
  showFavoritesOnly = false 
}) => {
  const { filteredItems, searchVocabulary, favorites } = useVocabulary();
  
  useEffect(() => {
    searchVocabulary(searchTerm);
  }, [searchTerm, searchVocabulary]);
  
  // Apply favorites filter if required
  const displayItems = showFavoritesOnly 
    ? filteredItems.filter(item => favorites.includes(item.id))
    : filteredItems;
  
  if (displayItems.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-600 dark:text-gray-400">
          {showFavoritesOnly 
            ? "No favorite vocabulary items found." 
            : "No vocabulary items found matching your filters."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {displayItems.map(item => (
        <VocabularyCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default VocabularyList;