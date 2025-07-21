import { useState, useEffect, useCallback, useRef } from 'react';
import { VocabularyItem } from '../types';
import { 
  loadEnrichedHSKLevel, 
  loadEnrichedHSKProgressively
} from '../data/enrichedHSKLoader';
import { trackLoadingPerformance, preloadVocabularyData } from '../utils/performanceUtils';

interface UseHSKVocabularyOptions {
  loadProgressively?: boolean;
  preloadAdjacentLevels?: boolean;
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
 * Currently supports HSK Levels 1-7 with enriched data
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
  
  // Currently HSK 1-7 are available with enriched data
  const availableLevels = [1, 2, 3, 4, 5, 6, 7];
  
  // Store options in ref to avoid dependency issues
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  
  // Function to load a specific HSK level - memoized to prevent infinite re-renders
  const loadLevel = useCallback((level: number) => {
    const { loadProgressively = true, preloadAdjacentLevels = true } = optionsRef.current;
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
            
            // Track performance
            trackLoadingPerformance(`hsk-level-${level}`, allVocabulary.length);
            
            // Temporarily disable adjacent level preloading to fix infinite loop issue
            // TODO: Fix preloading mechanism to prevent infinite cache access loops
            if (false && preloadAdjacentLevels) {
              const staticAvailableLevels = [1, 2, 3, 4, 5, 6, 7]; // Use static array to avoid dependency
              const adjacentLevels = [level - 1, level + 1].filter(l => 
                staticAvailableLevels.includes(l) && l !== level
              );
              if (adjacentLevels.length > 0) {
                console.log(`[useHSKVocabulary] Preloading adjacent levels: ${adjacentLevels.join(', ')}`);
                preloadVocabularyData(loadEnrichedHSKLevel, adjacentLevels, 'low');
              }
            }
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
            
            // Track performance
            trackLoadingPerformance(`hsk-level-${level}`, data.length);
            
            // Temporarily disable adjacent level preloading to fix infinite loop issue
            // TODO: Fix preloading mechanism to prevent infinite cache access loops
            if (false && preloadAdjacentLevels) {
              const staticAvailableLevels = [1, 2, 3, 4, 5, 6, 7]; // Use static array to avoid dependency
              const adjacentLevels = [level - 1, level + 1].filter(l => 
                staticAvailableLevels.includes(l) && l !== level
              );
              if (adjacentLevels.length > 0) {
                console.log(`[useHSKVocabulary] Preloading adjacent levels: ${adjacentLevels.join(', ')}`);
                preloadVocabularyData(loadEnrichedHSKLevel, adjacentLevels, 'low');
              }
            }
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
  }, []); // Empty deps array - all needed variables are from refs or stable functions
  
  // Load initial level if provided (only once)
  useEffect(() => {
    const staticAvailableLevels = [1, 2, 3, 4, 5, 6, 7]; // Use static array to avoid dependency
    if (!initializedRef.current && initialLevel && staticAvailableLevels.includes(initialLevel)) {
      console.log(`[useHSKVocabulary] Loading initial level ${initialLevel}`);
      initializedRef.current = true;
      loadLevel(initialLevel);
    } else if (!initializedRef.current && initialLevel && !staticAvailableLevels.includes(initialLevel)) {
      initializedRef.current = true;
      setError(new Error(`HSK Level ${initialLevel} is not available. Available levels: ${staticAvailableLevels.join(', ')}`));
    }
  }, [initialLevel]); // Remove loadLevel dependency to prevent infinite loops
  
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
