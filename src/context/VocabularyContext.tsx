import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { VocabularyItem, CEFRLevel } from '../types';
import { allVocabulary, getAllCategories } from '../data/vocabulary';

interface VocabularyContextType {
  vocabularyItems: VocabularyItem[];
  filteredItems: VocabularyItem[];
  selectedLevel: CEFRLevel | 'all';
  selectedCategory: string | 'all';
  setSelectedLevel: (level: CEFRLevel | 'all') => void;
  setSelectedCategory: (category: string | 'all') => void;
  searchVocabulary: (term: string) => void;
  categories: string[];
  addToFavorites: (id: number) => void;
  removeFromFavorites: (id: number) => void;
  favorites: number[];
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (context === undefined) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};

interface VocabularyProviderProps {
  children: ReactNode;
  initialVocabulary?: VocabularyItem[]; // Make this optional
}

export const VocabularyProvider = ({ 
  children, 
  initialVocabulary = allVocabulary // Default to all vocabulary if not provided
}: VocabularyProviderProps) => {
  const [vocabularyItems] = useState<VocabularyItem[]>(initialVocabulary);
  const [filteredItems, setFilteredItems] = useState<VocabularyItem[]>(initialVocabulary);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Get unique categories from vocabulary items
  const categories = getAllCategories();

  // Apply filters when dependencies change
  useEffect(() => {
    let result = [...vocabularyItems];
    
    if (selectedLevel !== 'all') {
      result = result.filter(item => item.level === selectedLevel);
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.vietnamese.toLowerCase().includes(term) ||
        item.chinese.includes(term) ||
        item.pinyin.toLowerCase().includes(term) ||
        item.english?.toLowerCase().includes(term)
      );
    }
    
    setFilteredItems(result);
  }, [vocabularyItems, selectedLevel, selectedCategory, searchTerm]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const searchVocabulary = (term: string) => {
    setSearchTerm(term);
  };

  const addToFavorites = (id: number) => {
    if (!favorites.includes(id)) {
      setFavorites([...favorites, id]);
    }
  };

  const removeFromFavorites = (id: number) => {
    setFavorites(favorites.filter(favId => favId !== id));
  };

  const value = {
    vocabularyItems,
    filteredItems,
    selectedLevel,
    selectedCategory,
    setSelectedLevel,
    setSelectedCategory,
    searchVocabulary,
    categories,
    addToFavorites,
    removeFromFavorites,
    favorites
  };

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
};