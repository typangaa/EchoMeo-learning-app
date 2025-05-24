import { VocabularyItem } from '../types';

// Configuration
const HSK_SPLIT_DIR = '/data/raw/splits'; // Update this path to match your actual public folder structure

// Map for caching loaded vocabulary to avoid repeated fetches
const vocabularyCache: Record<string, VocabularyItem[]> = {};

// Interface for mapping HSK levels to part counts (update these based on your actual split files)
interface HSKPartCounts {
  [key: number]: number;
}

// Will be populated after initialization
let hskPartCounts: HSKPartCounts = {};

/**
 * Initialize the HSK vocabulary loader by fetching part information
 * Alternatively, you could hardcode this information if it doesn't change often
 */
export async function initializeHSKLoader(): Promise<boolean> {
  try {
    // For real implementation, fetch this from an API or generate a manifest file
    // For now, we'll hard-code a starting point based on word counts and can adjust after running the script
    hskPartCounts = {
      1: 7,  // HSK 1 (approx 500kb / 150 words) → 2-3 parts
      2: 17, // HSK 2 (approx 1.2MB / 300 words) → 4-5 parts
      3: 30, // HSK 3 (approx 2MB / 600 words) → 8-9 parts
      4: 43, // HSK 4 (much larger) → estimate 15-20 parts
      5: 57, // HSK 5 → estimate 25-30 parts
      6: 72, // HSK 6 → estimate 35-40 parts
      7: 147  // HSK 7 → estimate 40-50 parts
    };
    return true;
  } catch (error) {
    console.error('Failed to initialize HSK loader:', error);
    return false;
  }
}

/**
 * Maps an HSK word to a VocabularyItem in your application format
 */
function mapHSKToVocabularyItem(hskWord: any): VocabularyItem {
  // Get the main form (first one)
  const mainForm = hskWord.forms[0];
  
  // Create a unique ID based on the simplified character
  const id = hskWord.simplified.charCodeAt(0) * 1000 + (hskWord.frequency % 1000);
  
  // Map HSK level to CEFR level (approximate mapping)
  const cefrLevelMap: Record<string, "A1" | "A2" | "B1" | "B2" | "C1" | "C2"> = {
    "1": "A1",
    "2": "A2",
    "3": "B1",
    "4": "B1",
    "5": "B2",
    "6": "C1",
    "7": "C2"
  };
  
  // Extract HSK level from the source or use a default
  const hskLevel = hskWord.level?.[0]?.match(/(\d+)/)?.[1] || "1";
  const cefrLevel = cefrLevelMap[hskLevel] || "A1";
  
  // Map the HSK data to your vocabulary item format
  return {
    id,
    chinese: hskWord.simplified,
    vietnamese: "", // You'll need to add Vietnamese translations separately
    pinyin: mainForm.transcriptions.pinyin,
    english: mainForm.meanings.join('; '),
    level: cefrLevel,
    category: hskWord.radical || "Other", // Using radical as category for now
    examples: []
  };
}

/**
 * Load a specific part of an HSK level
 */
export async function loadHSKLevelPart(level: number, part: number): Promise<VocabularyItem[]> {
  const cacheKey = `hsk${level}-part${part}`;
  
  // Check if we already have this data cached
  if (vocabularyCache[cacheKey]) {
    return vocabularyCache[cacheKey];
  }
  
  try {
    // Fetch the data
    const response = await fetch(`${HSK_SPLIT_DIR}/hsk${level}-part${part}.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to load HSK ${level} part ${part}: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to your vocabulary format
    const vocabularyItems = data.map(mapHSKToVocabularyItem);
    
    // Cache the result
    vocabularyCache[cacheKey] = vocabularyItems;
    
    return vocabularyItems;
  } catch (error) {
    console.error(`Error loading HSK ${level} part ${part}:`, error);
    return [];
  }
}

/**
 * Load all parts for a specific HSK level
 */
export async function loadHSKLevel(level: number): Promise<VocabularyItem[]> {
  // Check if this level exists
  if (!hskPartCounts[level]) {
    console.error(`Unknown HSK level: ${level}`);
    return [];
  }
  
  const totalParts = hskPartCounts[level];
  let allVocabulary: VocabularyItem[] = [];
  
  // Load initial part first to show some data quickly
  const initialPart = await loadHSKLevelPart(level, 1);
  allVocabulary = [...initialPart];
  
  // Now load the rest in parallel
  if (totalParts > 1) {
    const promises = [];
    for (let part = 2; part <= totalParts; part++) {
      promises.push(loadHSKLevelPart(level, part));
    }
    
    // Wait for all parts to load
    const remainingParts = await Promise.all(promises);
    
    // Add all loaded parts to the vocabulary list
    remainingParts.forEach(part => {
      allVocabulary = [...allVocabulary, ...part];
    });
  }
  
  return allVocabulary;
}

/**
 * Progressive loading function - loads parts incrementally with a callback
 * This is useful for showing loading progress to the user
 */
export function loadHSKLevelProgressively(
  level: number, 
  onPartLoaded: (part: VocabularyItem[], progress: number) => void,
  onComplete: (allVocabulary: VocabularyItem[]) => void
): void {
  // Check if this level exists
  if (!hskPartCounts[level]) {
    console.error(`Unknown HSK level: ${level}`);
    onComplete([]);
    return;
  }
  
  const totalParts = hskPartCounts[level];
  const allVocabulary: VocabularyItem[] = [];
  let loadedParts = 0;
  
  // Load each part sequentially to show progress
  const loadNextPart = async (part: number) => {
    try {
      const vocabularyPart = await loadHSKLevelPart(level, part);
      
      // Add to our collection
      allVocabulary.push(...vocabularyPart);
      
      // Update progress
      loadedParts++;
      const progress = (loadedParts / totalParts) * 100;
      
      // Call the callback with the newly loaded part and progress
      onPartLoaded(vocabularyPart, progress);
      
      // Load the next part or finish
      if (part < totalParts) {
        loadNextPart(part + 1);
      } else {
        onComplete(allVocabulary);
      }
    } catch (error) {
      console.error(`Error loading HSK ${level} part ${part}:`, error);
      // Continue with the next part despite errors
      if (part < totalParts) {
        loadNextPart(part + 1);
      } else {
        onComplete(allVocabulary);
      }
    }
  };
  
  // Start loading with the first part
  loadNextPart(1);
}

/**
 * Search across all loaded HSK vocabulary
 */
export function searchHSKVocabulary(
  query: string, 
  levels: number[] = [1, 2, 3, 4, 5, 6, 7]
): VocabularyItem[] {
  const queryLower = query.toLowerCase();
  
  // Collect all vocabulary from specified levels that is cached
  let allVocabulary: VocabularyItem[] = [];
  
  levels.forEach(level => {
    // Check all parts for this level
    const totalParts = hskPartCounts[level] || 0;
    
    for (let part = 1; part <= totalParts; part++) {
      const cacheKey = `hsk${level}-part${part}`;
      
      // Only search in parts that are already loaded
      if (vocabularyCache[cacheKey]) {
        allVocabulary = [...allVocabulary, ...vocabularyCache[cacheKey]];
      }
    }
  });
  
  // Filter the vocabulary based on the query
  return allVocabulary.filter(item => 
    item.chinese.includes(query) || 
    item.pinyin.toLowerCase().includes(queryLower) || 
    item.english?.toLowerCase().includes(queryLower) ||
    (item.vietnamese && item.vietnamese.toLowerCase().includes(queryLower))
  );
}

// Initialize the loader when this module is imported
initializeHSKLoader().catch(error => {
  console.error('Failed to initialize HSK vocabulary loader:', error);
});
