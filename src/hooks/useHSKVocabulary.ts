import { useState, useEffect, useCallback, useRef } from 'react';
import { VocabularyItem } from '../types';
import { 
  loadEnrichedHSKLevel, 
  loadEnrichedHSKProgressively
} from '../data/enrichedHSKLoader';

interface UseHSKVocabularyOptions {
  loadProgressively?: boolean;
}

interface UseHSKVocabularyResult {
  vocabulary: VocabularyItem[];
  loading: boolean;
  progress: number;
  error: Error | null;
  loadLevel: (level: number) => void;
  availableLevels: number[];
}

/**
 * Hook for loading and managing enriched HSK vocabulary
 * Currently supports HSK Levels 1-6 with enriched data
 */
export function useHSKVocabulary(
  initialLevel?: number,
  options: UseHSKVocabularyOptions = {}
): UseHSKVocabularyResult {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  // Current level is tracked via selectedLevel in components that use this hook
  
  // Use refs to track loading state and prevent duplicate loads
  const loadingLevelRef = useRef<number | null>(null);
  const initializedRef = useRef<boolean>(false);
  
  // Currently HSK 1-6 are available with enriched data
  const availableLevels = [1, 2, 3, 4, 5, 6];
  
  // Default options
  const { loadProgressively = true } = options;
  
  // Function to load a specific HSK level
  const loadLevel = useCallback((level: number) => {
    console.log(`[useHSKVocabulary] Loading level ${level}`);
    
    // Prevent loading if already loading this level
    if (loadingLevelRef.current === level && loading) {
      console.log(`[useHSKVocabulary] Already loading level ${level}, skipping...`);
      return;
    }
    
    // Check if level is available
    if (!availableLevels.includes(level)) {
      setError(new Error(`HSK Level ${level} is not available. Only HSK Levels 1-3 have enriched data.`));
      setLoading(false);
      return;
    }
    
    // Reset state
    setLoading(true);
    setProgress(0);
    setError(null);
    loadingLevelRef.current = level;
    setVocabulary([]); // Clear existing vocabulary
    
    if (loadProgressively) {
      console.log(`[useHSKVocabulary] Starting progressive loading for level ${level}`);
      // Use progressive loading with callbacks
      loadEnrichedHSKProgressively(
        level,
        (newChunk, currentProgress) => {
          // Only update if we're still loading the same level
          if (loadingLevelRef.current === level) {
            console.log(`[useHSKVocabulary] Received chunk with ${newChunk.length} items, progress: ${currentProgress}%`);
            setProgress(currentProgress);
            // Accumulate vocabulary items (append new chunk)
            setVocabulary(prev => {
              const updated = [...prev, ...newChunk];
              console.log(`[useHSKVocabulary] Total vocabulary items now: ${updated.length}`);
              return updated;
            });
          }
        },
        (allVocabulary) => {
          // Only complete if we're still loading the same level
          if (loadingLevelRef.current === level) {
            console.log(`[useHSKVocabulary] Progressive loading complete with ${allVocabulary.length} items`);
            setLoading(false);
            loadingLevelRef.current = null;
            setProgress(100);
            // Set the final complete vocabulary (to ensure consistency)
            setVocabulary(allVocabulary);
          }
        }
      );
    } else {
      console.log(`[useHSKVocabulary] Loading all at once for level ${level}`);
      // Load all at once
      loadEnrichedHSKLevel(level)
        .then((data) => {
          // Only update if we're still loading the same level
          if (loadingLevelRef.current === level) {
            console.log(`[useHSKVocabulary] Loaded ${data.length} items`);
            setVocabulary(data);
            setProgress(100);
          }
        })
        .catch((err) => {
          if (loadingLevelRef.current === level) {
            console.error(`[useHSKVocabulary] Error loading:`, err);
            setError(err instanceof Error ? err : new Error('Failed to load vocabulary'));
          }
        })
        .finally(() => {
          if (loadingLevelRef.current === level) {
            setLoading(false);
            loadingLevelRef.current = null;
          }
        });
    }
  }, [loadProgressively, availableLevels, loading]);
  
  // Load initial level if provided (only once)
  useEffect(() => {
    if (!initializedRef.current && initialLevel && availableLevels.includes(initialLevel)) {
      console.log(`[useHSKVocabulary] Loading initial level ${initialLevel}`);
      initializedRef.current = true;
      loadLevel(initialLevel);
    } else if (!initializedRef.current && initialLevel && !availableLevels.includes(initialLevel)) {
      initializedRef.current = true;
      setError(new Error(`HSK Level ${initialLevel} is not available. Only HSK Levels 1-3 have enriched data.`));
    }
  }, [initialLevel, loadLevel, availableLevels]);
  
  return {
    vocabulary,
    loading,
    progress,
    error,
    loadLevel,
    availableLevels
  };
}

export default useHSKVocabulary;
