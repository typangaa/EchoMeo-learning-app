import { useState, useEffect } from 'react';
import { VocabularyItem } from '../types';

// Spaced repetition intervals in days
const INTERVALS = [1, 3, 7, 14, 30, 90];

export interface SpacedRepetitionItem {
  id: number;
  vocabularyId: number;
  level: number; // 0-5 corresponding to INTERVALS
  nextReviewDate: Date;
  lastReviewDate: Date | null;
}

export function useSpacedRepetition(vocabularyItems: VocabularyItem[]) {
  const [srItems, setSrItems] = useState<SpacedRepetitionItem[]>([]);
  const [dueItems, setDueItems] = useState<VocabularyItem[]>([]);
  
  // Initialize or load SR items from localStorage
  useEffect(() => {
    const storedItems = localStorage.getItem('spaced_repetition_items');
    
    if (storedItems) {
      // Parse stored items, ensuring dates are properly converted back from strings
      const parsedItems: SpacedRepetitionItem[] = JSON.parse(storedItems).map((item: any) => ({
        ...item,
        nextReviewDate: new Date(item.nextReviewDate),
        lastReviewDate: item.lastReviewDate ? new Date(item.lastReviewDate) : null
      }));
      setSrItems(parsedItems);
    } else {
      // Initialize with empty array if no stored items exist
      setSrItems([]);
    }
  }, []);
  
  // Save SR items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('spaced_repetition_items', JSON.stringify(srItems));
  }, [srItems]);
  
  // Update due items whenever SR items or vocabulary changes
  useEffect(() => {
    const now = new Date();
    
    // Get all items due for review
    const dueItemIds = srItems
      .filter(item => new Date(item.nextReviewDate) <= now)
      .map(item => item.vocabularyId);
    
    // Find the corresponding vocabulary items
    const dueVocabItems = vocabularyItems.filter(item => 
      dueItemIds.includes(item.id)
    );
    
    setDueItems(dueVocabItems);
  }, [srItems, vocabularyItems]);
  
  // Add a new vocabulary item to the SR system
  const addItem = (vocabularyId: number) => {
    // Check if item already exists
    if (srItems.some(item => item.vocabularyId === vocabularyId)) {
      return;
    }
    
    const newItem: SpacedRepetitionItem = {
      id: Date.now(), // Use timestamp as a simple unique ID
      vocabularyId,
      level: 0,
      nextReviewDate: new Date(), // Due immediately
      lastReviewDate: null
    };
    
    setSrItems(prevItems => [...prevItems, newItem]);
  };
  
  // Record a correct answer and update the item's level and next review date
  const recordCorrectAnswer = (vocabularyId: number) => {
    setSrItems(prevItems => 
      prevItems.map(item => {
        if (item.vocabularyId === vocabularyId) {
          const newLevel = Math.min(item.level + 1, INTERVALS.length - 1);
          const now = new Date();
          const nextDate = new Date(now);
          nextDate.setDate(now.getDate() + INTERVALS[newLevel]);
          
          return {
            ...item,
            level: newLevel,
            lastReviewDate: now,
            nextReviewDate: nextDate
          };
        }
        return item;
      })
    );
  };
  
  // Record an incorrect answer and reset the item's level
  const recordIncorrectAnswer = (vocabularyId: number) => {
    setSrItems(prevItems => 
      prevItems.map(item => {
        if (item.vocabularyId === vocabularyId) {
          const now = new Date();
          const nextDate = new Date(now);
          nextDate.setDate(now.getDate() + INTERVALS[0]); // Reset to first interval
          
          return {
            ...item,
            level: 0,
            lastReviewDate: now,
            nextReviewDate: nextDate
          };
        }
        return item;
      })
    );
  };
  
  // Add all vocabulary items at once
  const addAllItems = (vocabularyIds: number[]) => {
    const now = new Date();
    const newItems: SpacedRepetitionItem[] = vocabularyIds
      .filter(id => !srItems.some(item => item.vocabularyId === id))
      .map(id => ({
        id: Date.now() + id, // Create a unique ID
        vocabularyId: id,
        level: 0,
        nextReviewDate: now,
        lastReviewDate: null
      }));
    
    if (newItems.length > 0) {
      setSrItems(prevItems => [...prevItems, ...newItems]);
    }
  };
  
  // Get the number of items due today
  const getDueCount = () => dueItems.length;
  
  // Remove an item from the SR system
  const removeItem = (vocabularyId: number) => {
    setSrItems(prevItems => prevItems.filter(item => item.vocabularyId !== vocabularyId));
  };
  
  return {
    dueItems,
    getDueCount,
    addItem,
    addAllItems,
    removeItem,
    recordCorrectAnswer,
    recordIncorrectAnswer
  };
}
