import { useState, useEffect, useCallback } from 'react';
import { VocabularyItem } from '../types';
import { 
  loadHSKLevel, 
  loadHSKLevelProgressively
} from '../data/hskVocabularyLoader';

interface UseHSKVocabularyOptions {
  loadProgressively?: boolean;
}

interface UseHSKVocabularyResult {
  vocabulary: VocabularyItem[];
  loading: boolean;
  progress: number;
  error: Error | null;
  loadLevel: (level: number) => void;
}

/**
 * Hook for loading and managing HSK vocabulary
 */
export function useHSKVocabulary(
  initialLevel?: number,
  options: UseHSKVocabularyOptions = {}
): UseHSKVocabularyResult {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number | null>(initialLevel || null);
  
  // Default options
  const { loadProgressively = true } = options;
  
  // Function to load a specific HSK level
  const loadLevel = useCallback((level: number) => {
    // Reset state
    setLoading(true);
    setProgress(0);
    setError(null);
    setCurrentLevel(level);
    
    if (loadProgressively) {
      // Use progressive loading with callbacks
      loadHSKLevelProgressively(
        level,
        (newPart, currentProgress) => {
          setProgress(currentProgress);
          // Append new vocabulary to existing set
          setVocabulary(prev => [...prev, ...newPart]);
        },
        (allVocabulary) => {
          setLoading(false);
          setProgress(100);
          // Replace with complete set (just to be safe)
          setVocabulary(allVocabulary);
        }
      );
    } else {
      // Load all parts at once
      loadHSKLevel(level)
        .then((data) => {
          setVocabulary(data);
          setProgress(100);
        })
        .catch((err) => {
          setError(err instanceof Error ? err : new Error('Failed to load vocabulary'));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loadProgressively]);
  
  // Load initial level if provided
  useEffect(() => {
    if (initialLevel) {
      loadLevel(initialLevel);
    }
  }, [initialLevel, loadLevel]);
  
  return {
    vocabulary,
    loading,
    progress,
    error,
    loadLevel
  };
}

export default useHSKVocabulary;
