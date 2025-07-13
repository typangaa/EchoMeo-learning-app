import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { VocabularyItem, CEFRLevel } from '../types';
import { allVocabulary, getAllCategories } from '../data/vocabulary';

// Vocabulary source types
export type VocabularySource = 'regular' | 'hsk' | 'vietnamese';

interface VocabularyContextType {
  // Regular vocabulary
  vocabularyItems: VocabularyItem[];
  filteredItems: VocabularyItem[];
  selectedLevel: CEFRLevel | 'all';
  selectedCategory: string | 'all';
  setSelectedLevel: (level: CEFRLevel | 'all') => void;
  setSelectedCategory: (category: string | 'all') => void;
  searchVocabulary: (term: string) => void;
  categories: string[];
  
  // HSK vocabulary
  hskVocabulary: VocabularyItem[];
  setHskVocabulary: (items: VocabularyItem[]) => void;
  
  // Vietnamese vocabulary
  vietnameseVocabulary: VocabularyItem[];
  setVietnameseVocabulary: (items: VocabularyItem[]) => void;
  
  // Unified favorites system
  addToFavorites: (id: number, source?: VocabularySource) => void;
  removeFromFavorites: (id: number, source?: VocabularySource) => void;
  favorites: number[];
  hskFavorites: number[];
  vietnameseFavorites: number[];
  
  // Check if item is favorite
  isFavorite: (id: number, source?: VocabularySource) => boolean;
  toggleFavorite: (id: number, source?: VocabularySource) => void;
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
}

export const VocabularyProvider = ({ children }: VocabularyProviderProps) => {
  // Regular vocabulary state
  const [vocabularyItems] = useState<VocabularyItem[]>(allVocabulary);
  const [filteredItems, setFilteredItems] = useState<VocabularyItem[]>(allVocabulary);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // HSK vocabulary state
  const [hskVocabulary, setHskVocabulary] = useState<VocabularyItem[]>([]);
  
  // Vietnamese vocabulary state
  const [vietnameseVocabulary, setVietnameseVocabulary] = useState<VocabularyItem[]>([]);
  
  // Separate favorites for regular, HSK, and Vietnamese vocabulary
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('vocabulary_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [hskFavorites, setHskFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('hsk_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [vietnameseFavorites, setVietnameseFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('vietnamese_favorites');
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
    localStorage.setItem('vocabulary_favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  useEffect(() => {
    localStorage.setItem('hsk_favorites', JSON.stringify(hskFavorites));
  }, [hskFavorites]);
  
  useEffect(() => {
    localStorage.setItem('vietnamese_favorites', JSON.stringify(vietnameseFavorites));
  }, [vietnameseFavorites]);

  const searchVocabulary = (term: string) => {
    setSearchTerm(term);
  };

  const addToFavorites = (id: number, source: VocabularySource = 'regular') => {
    if (source === 'hsk') {
      if (!hskFavorites.includes(id)) {
        setHskFavorites([...hskFavorites, id]);
      }
    } else if (source === 'vietnamese') {
      if (!vietnameseFavorites.includes(id)) {
        setVietnameseFavorites([...vietnameseFavorites, id]);
      }
    } else {
      if (!favorites.includes(id)) {
        setFavorites([...favorites, id]);
      }
    }
  };

  const removeFromFavorites = (id: number, source: VocabularySource = 'regular') => {
    if (source === 'hsk') {
      setHskFavorites(hskFavorites.filter(favId => favId !== id));
    } else if (source === 'vietnamese') {
      setVietnameseFavorites(vietnameseFavorites.filter(favId => favId !== id));
    } else {
      setFavorites(favorites.filter(favId => favId !== id));
    }
  };
  
  const isFavorite = (id: number, source: VocabularySource = 'regular') => {
    if (source === 'hsk') {
      return hskFavorites.includes(id);
    } else if (source === 'vietnamese') {
      return vietnameseFavorites.includes(id);
    }
    return favorites.includes(id);
  };
  
  const toggleFavorite = (id: number, source: VocabularySource = 'regular') => {
    if (isFavorite(id, source)) {
      removeFromFavorites(id, source);
    } else {
      addToFavorites(id, source);
    }
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
    hskVocabulary,
    setHskVocabulary,
    vietnameseVocabulary,
    setVietnameseVocabulary,
    addToFavorites,
    removeFromFavorites,
    favorites,
    hskFavorites,
    vietnameseFavorites,
    isFavorite,
    toggleFavorite
  };

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
};
