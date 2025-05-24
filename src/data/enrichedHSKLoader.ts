import { VocabularyItem } from '../types';

// Interface for the enriched HSK JSON structure
export interface EnrichedHSKItem {
  item: string;
  pinyin: string;
  meanings: Array<{
    chinese: string;
    english: string;
    vietnamese: string;
    part_of_speech: string;
    usage_frequency: string;
    examples: Array<{
      chinese: string;
      pinyin: string;
      english: string;
      vietnamese: string;
    }>;
  }>;
}

// Cache for enriched HSK data
const enrichedCache: Record<number, VocabularyItem[]> = {};

// Simple counter to ensure unique IDs
let hskIdCounter = 100000;

/**
 * Generate a unique ID for HSK vocabulary items
 * Using a simple counter approach to guarantee uniqueness
 */
function generateUniqueHSKId(item: string, index: number, level: number): number {
  // Simple unique ID: base + level + counter + index
  // This guarantees uniqueness across all HSK levels and items
  const uniqueId = 100000 + (level * 10000) + hskIdCounter + index;
  hskIdCounter++;
  return uniqueId;
}

/**
 * Maps an enriched HSK item to a VocabularyItem
 */
function mapEnrichedHSKToVocabularyItem(
  enrichedItem: EnrichedHSKItem, 
  hskLevel: number,
  itemIndex: number
): VocabularyItem {
  // Get the primary meaning (first one, or the most common one)
  const primaryMeaning = enrichedItem.meanings.find(m => m.usage_frequency === 'very common') || 
                         enrichedItem.meanings[0];
  
  // Generate a unique ID
  const id = generateUniqueHSKId(enrichedItem.item, itemIndex, hskLevel);
  
  // Map HSK level to CEFR level
  const cefrLevelMap: Record<number, "A1" | "A2" | "B1" | "B2" | "C1" | "C2"> = {
    1: "A1",
    2: "A2", 
    3: "B1",
    4: "B1",
    5: "B2",
    6: "C1",
    7: "C2"
  };
  
  // Get category from part of speech
  const categoryMap: Record<string, string> = {
    'num': 'Numbers',
    'num/adj': 'Numbers',
    'pronoun': 'Pronouns',
    'adj': 'Adjectives',
    'adv': 'Adverbs',
    'v': 'Verbs',
    'n': 'Nouns',
    'prep': 'Prepositions',
    'aux': 'Grammar',
    'measure word': 'Measure Words',
    'part': 'Particles',
    'int': 'Interjections',
    'conj': 'Conjunctions',
    'modal': 'Grammar'
  };
  
  const category = categoryMap[primaryMeaning.part_of_speech] || 'Other';
  
  // Convert examples to the format expected by VocabularyItem
  const examples = enrichedItem.meanings.flatMap(meaning => 
    meaning.examples.slice(0, 2) // Take max 2 examples per meaning
  ).slice(0, 3).map(example => ({ // Take max 3 examples total
    vietnamese: example.vietnamese,
    chinese: example.chinese,
    pinyin: example.pinyin
  }));
  
  return {
    id,
    chinese: enrichedItem.item,
    vietnamese: primaryMeaning.vietnamese,
    pinyin: enrichedItem.pinyin,
    english: primaryMeaning.english,
    level: cefrLevelMap[hskLevel] || "A1",
    category,
    examples: examples.length > 0 ? examples : undefined
  };
}

/**
 * Load enriched HSK vocabulary for a specific level
 */
export async function loadEnrichedHSKLevel(level: number): Promise<VocabularyItem[]> {
  // Check cache first
  if (enrichedCache[level]) {
    console.log(`Loading HSK ${level} from cache (${enrichedCache[level].length} items)`);
    return enrichedCache[level];
  }
  
  try {
    // Currently only HSK 1 is available in enriched format
    if (level !== 1) {
      console.warn(`Enriched HSK data only available for level 1, requested level ${level}`);
      return [];
    }
    
    console.log(`Fetching enriched HSK ${level} data...`);
    const response = await fetch(`/data/hsk/hsk${level}_enriched.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to load enriched HSK ${level}: ${response.status} ${response.statusText}`);
    }
    
    const enrichedData: EnrichedHSKItem[] = await response.json();
    console.log(`Loaded ${enrichedData.length} enriched HSK ${level} items from JSON`);
    
    // Reset the counter for this level to ensure consistent IDs
    hskIdCounter = level * 1000; // Each level gets its own range
    
    // Transform the data to VocabularyItem format
    const vocabularyItems = enrichedData.map((item, index) => 
      mapEnrichedHSKToVocabularyItem(item, level, index)
    );
    
    // Verify unique IDs
    const ids = vocabularyItems.map(item => item.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.error('Duplicate IDs detected in vocabulary items!');
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      console.error('Duplicate IDs:', duplicates);
    } else {
      console.log('✅ All vocabulary items have unique IDs');
    }
    
    // Cache the result
    enrichedCache[level] = vocabularyItems;
    console.log(`Processed and cached ${vocabularyItems.length} vocabulary items for HSK ${level}`);
    
    return vocabularyItems;
  } catch (error) {
    console.error(`Error loading enriched HSK ${level}:`, error);
    throw error;
  }
}

/**
 * Progressive loading for enriched HSK data
 * Simulates progressive loading by delivering items in chunks for better UX
 */
// Track active loading operations
const activeLoads = new Set<string>();

export function loadEnrichedHSKProgressively(
  level: number,
  onProgress: (items: VocabularyItem[], progress: number) => void,
  onComplete: (allItems: VocabularyItem[]) => void
): void {
  console.log(`Starting progressive loading for HSK ${level}`);
  
  // Prevent multiple simultaneous loads
  const loadingKey = `hsk_${level}_loading`;
  if (activeLoads.has(loadingKey)) {
    console.log(`Progressive loading already in progress for HSK ${level}, skipping...`);
    return;
  }
  
  activeLoads.add(loadingKey);
  
  loadEnrichedHSKLevel(level)
    .then(items => {
      if (items.length === 0) {
        console.log(`No items loaded for HSK ${level}`);
        onComplete([]);
        return;
      }
      
      // Simulate progressive loading by delivering items in chunks
      const chunkSize = Math.max(15, Math.floor(items.length / 6)); // 6 chunks, minimum 15 items per chunk
      let currentIndex = 0;
      const deliveredItems: VocabularyItem[] = [];
      
      const deliverChunk = () => {
        if (currentIndex >= items.length) {
          console.log(`Progressive loading complete: ${deliveredItems.length} items delivered`);
          activeLoads.delete(loadingKey); // Clear the loading flag
          onComplete(deliveredItems);
          return;
        }
        
        const remainingItems = items.length - currentIndex;
        const actualChunkSize = Math.min(chunkSize, remainingItems);
        const chunk = items.slice(currentIndex, currentIndex + actualChunkSize);
        
        deliveredItems.push(...chunk);
        currentIndex += actualChunkSize;
        
        const progress = Math.min(100, (deliveredItems.length / items.length) * 100);
        console.log(`Progressive loading: ${deliveredItems.length}/${items.length} items (${Math.round(progress)}%)`);
        
        onProgress(chunk, progress);
        
        // Small delay to show progress and avoid blocking UI
        setTimeout(deliverChunk, 100); // Faster delivery for better UX
      };
      
      deliverChunk();
    })
    .catch(error => {
      console.error('Error in progressive loading:', error);
      activeLoads.delete(loadingKey); // Clear the loading flag
      onComplete([]);
    });
}

/**
 * Search enriched HSK vocabulary
 */
export function searchEnrichedHSKVocabulary(
  query: string,
  items: VocabularyItem[]
): VocabularyItem[] {
  if (!query.trim()) {
    return items;
  }
  
  const queryLower = query.toLowerCase();
  
  return items.filter(item =>
    item.chinese.includes(query) ||
    item.pinyin.toLowerCase().includes(queryLower) ||
    item.english?.toLowerCase().includes(queryLower) ||
    item.vietnamese.toLowerCase().includes(queryLower) ||
    item.category.toLowerCase().includes(queryLower)
  );
}

/**
 * Get vocabulary statistics
 */
export function getEnrichedHSKStatistics(items: VocabularyItem[]) {
  const categoryCounts: Record<string, number> = {};
  
  items.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  
  return {
    totalItems: items.length,
    categories: Object.keys(categoryCounts).length,
    categoryCounts,
    itemsWithExamples: items.filter(item => item.examples && item.examples.length > 0).length
  };
}

// Enhanced VocabularyItem interface for display purposes (keeping for potential future use)
export interface EnhancedVocabularyItem {
  id: number;
  simplified: string;
  pinyin: string;
  hsk_level: number;
  meanings: Array<{
    vietnamese: string;
    english: string;
    chinese: string;
    part_of_speech: string;
    usage_frequency: 'very common' | 'common' | 'less common';
    primary?: boolean;
  }>;
  examples: Array<{
    chinese: string;
    pinyin: string;
    english: string;
    vietnamese: string;
  }>;
}

/**
 * Load enriched HSK vocabulary preserving all meanings (for potential future advanced features)
 */
export async function loadEnhancedHSKLevelFull(level: number): Promise<EnhancedVocabularyItem[]> {
  try {
    if (level !== 1) {
      console.warn(`Enriched HSK data only available for level 1, requested level ${level}`);
      return [];
    }
    
    const response = await fetch(`/data/hsk/hsk${level}_enriched.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to load enriched HSK ${level}: ${response.status}`);
    }
    
    const enrichedData: EnrichedHSKItem[] = await response.json();
    
    // Transform to enhanced format preserving all meanings
    const enhancedItems = enrichedData.map((item, index) => ({
      id: generateUniqueHSKId(item.item, index, level),
      simplified: item.item,
      pinyin: item.pinyin,
      hsk_level: level,
      meanings: item.meanings.map((meaning, meaningIndex) => ({
        vietnamese: meaning.vietnamese,
        english: meaning.english,
        chinese: meaning.chinese,
        part_of_speech: meaning.part_of_speech,
        usage_frequency: meaning.usage_frequency as 'very common' | 'common' | 'less common',
        primary: meaningIndex === 0 || meaning.usage_frequency === 'very common'
      })),
      examples: item.meanings.flatMap(meaning => meaning.examples)
    }));
    
    return enhancedItems;
  } catch (error) {
    console.error(`Error loading enriched HSK ${level}:`, error);
    throw error;
  }
}
