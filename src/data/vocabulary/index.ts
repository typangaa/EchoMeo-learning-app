import { VocabularyItem } from '../../types';
import { a1Vocabulary } from './a1Vocabulary';
// Import future vocabulary levels as they're added
// import { a2Vocabulary } from './a2Vocabulary';
// import { b1Vocabulary } from './b1Vocabulary';
// etc.

// Combine all vocabulary items
export const allVocabulary: VocabularyItem[] = [
  ...a1Vocabulary,
  // Add more vocabulary levels as they're created
  // ...a2Vocabulary,
  // ...b1Vocabulary,
];

// Get vocabulary by level
export const getVocabularyByLevel = (level: string): VocabularyItem[] => {
  if (level === 'all') {
    return allVocabulary;
  }
  return allVocabulary.filter(item => item.level === level);
};

// Get vocabulary by category
export const getVocabularyByCategory = (category: string): VocabularyItem[] => {
  if (category === 'all') {
    return allVocabulary;
  }
  return allVocabulary.filter(item => item.category === category);
};

// Get all categories
export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  allVocabulary.forEach(item => categories.add(item.category));
  return Array.from(categories).sort();
};

// Export individual vocabulary levels for direct access
export { a1Vocabulary };