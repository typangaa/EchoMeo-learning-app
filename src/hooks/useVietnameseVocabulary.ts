import { useState, useEffect, useCallback, useRef } from 'react';
import { VocabularyItem } from '../types';
import { 
  loadEnrichedVietnameseLevel, 
  loadEnrichedVietnameseProgressively
} from '../data/enrichedVietnameseLoader';

interface UseVietnameseVocabularyOptions {
  loadProgressively?: boolean;
  preloadAdjacentLevels?: boolean;
}

interface UseVietnameseVocabularyResult {
  vocabulary: VocabularyItem[];
  loading: boolean;
  progress: number;
  error: Error | null;
  loadLevel: (level: number) => void;
  availableLevels: number[];
}

/**
 * Hook for loading and managing enriched Vietnamese vocabulary
 * Currently supports Vietnamese Levels 1-2 with enriched data
 */
export function useVietnameseVocabulary(
  initialLevel?: number,
  options: UseVietnameseVocabularyOptions = {}
): UseVietnameseVocabularyResult {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  
  // Use refs to track loading state and prevent duplicate loads
  const loadingLevelRef = useRef<number | null>(null);
  const initializedRef = useRef<boolean>(false);
  
  // Currently Vietnamese 1-6 are available with enriched data
  const availableLevels = [1, 2, 3, 4, 5, 6];
  
  // Store options in ref to avoid dependency issues
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  
  // Function to load a specific Vietnamese level - memoized to prevent infinite re-renders
  const loadLevel = useCallback((level: number) => {
    const { loadProgressively = true } = optionsRef.current;
    console.log(`[useVietnameseVocabulary] Loading level ${level}`);
    
    // Prevent loading if already loading this level
    if (loadingLevelRef.current === level && loading) {
      console.log(`[useVietnameseVocabulary] Already loading level ${level}, skipping...`);
      return;
    }
    
    // Check if level is available
    if (!availableLevels.includes(level)) {
      setError(new Error(`Vietnamese Level ${level} is not available. Only Vietnamese Levels 1-6 have enriched data.`));
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
      console.log(`[useVietnameseVocabulary] Starting progressive loading for level ${level}`);
      // Use progressive loading with callbacks
      loadEnrichedVietnameseProgressively(
        level,
        (newChunk, currentProgress) => {
          // Only update if we're still loading the same level
          if (loadingLevelRef.current === level) {
            console.log(`[useVietnameseVocabulary] Received chunk with ${newChunk.length} items, progress: ${currentProgress}%`);
            setProgress(currentProgress);
            // Accumulate vocabulary items (append new chunk)
            setVocabulary(prev => {
              const updated = [...prev, ...newChunk];
              console.log(`[useVietnameseVocabulary] Total vocabulary items now: ${updated.length}`);
              return updated;
            });
          }
        },
        (allVocabulary) => {
          // Only complete if we're still loading the same level
          if (loadingLevelRef.current === level) {
            console.log(`[useVietnameseVocabulary] Progressive loading complete with ${allVocabulary.length} items`);
            setLoading(false);
            loadingLevelRef.current = null;
            setProgress(100);
            // Set the final complete vocabulary (to ensure consistency)
            setVocabulary(allVocabulary);
          }
        }
      );
    } else {
      console.log(`[useVietnameseVocabulary] Loading all at once for level ${level}`);
      // Load all at once
      loadEnrichedVietnameseLevel(level)
        .then((data) => {
          // Only update if we're still loading the same level
          if (loadingLevelRef.current === level) {
            console.log(`[useVietnameseVocabulary] Loaded ${data.length} items`);
            setVocabulary(data);
            setProgress(100);
          }
        })
        .catch((err) => {
          if (loadingLevelRef.current === level) {
            console.error(`[useVietnameseVocabulary] Error loading:`, err);
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
  }, []); // Empty deps array - all needed variables are from refs or stable functions
  
  // Load initial level if provided (only once)
  useEffect(() => {
    const staticAvailableLevels = [1, 2, 3, 4, 5, 6]; // Use static array to avoid dependency
    if (!initializedRef.current && initialLevel && staticAvailableLevels.includes(initialLevel)) {
      console.log(`[useVietnameseVocabulary] Loading initial level ${initialLevel}`);
      initializedRef.current = true;
      loadLevel(initialLevel);
    } else if (!initializedRef.current && initialLevel && !staticAvailableLevels.includes(initialLevel)) {
      initializedRef.current = true;
      setError(new Error(`Vietnamese Level ${initialLevel} is not available. Available levels: ${staticAvailableLevels.join(', ')}`));
    }
  }, [initialLevel]); // Remove unstable dependencies to prevent infinite loops
  
  return {
    vocabulary,
    loading,
    progress,
    error,
    loadLevel,
    availableLevels
  };
}

export default useVietnameseVocabulary;
