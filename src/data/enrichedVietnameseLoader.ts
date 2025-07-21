import { VocabularyItem } from '../types';

/**
 * Vietnamese Vocabulary Loader - Handles enriched Vietnamese vocabulary data
 * Supports Vietnamese Levels 1-6 with Chinese translations, examples, and detailed meanings
 */

// Interface for the enriched Vietnamese JSON structure
export interface EnrichedVietnameseItem {
  vietnamese?: string;
  word?: string; // Some items might use 'word' instead of 'vietnamese'
  ipa?: string;
  pronunciation?: string; // Some items might use 'pronunciation' instead of 'ipa'
  frequency: number;
  etymology: {
    origin: string;
    source_language: string;
    chu_nom: string;
    notes: string;
  };
  meanings: Array<{
    vietnamese?: string;
    vietnamese_definition?: string; // Alternative field name
    chinese: string;
    chinese_translation?: string; // Alternative field name
    pinyin: string;
    english: string;
    part_of_speech: string;
    usage_frequency: string;
    examples: Array<{
      vietnamese?: string;
      vietnamese_example?: string; // Alternative field name
      chinese?: string;
      chinese_example?: string; // Alternative field name
      pinyin?: string;
      english?: string;
    }>;
  }>;
  parts_of_speech?: string; // Some items might have this at root level
}

// Flexible interface to handle different possible JSON structures
interface FlexibleVietnameseItem {
  vietnamese?: string;
  word?: string;
  ipa?: string;
  pronunciation?: string;
  frequency?: number;
  frequency_score?: number; // Alternative field name
  etymology?: any;
  meanings?: any; // Can be array or object or other structure
  parts_of_speech?: string | string[]; // Can be string or array
  [key: string]: any; // Allow any additional properties
}

// Cache for enriched Vietnamese data
const enrichedVietnameseCache: Record<number, VocabularyItem[]> = {};

// Track active loading operations to prevent duplicates
const activeVietnameseLoads = new Set<string>();

// Simple counter to ensure unique IDs
let vietnameseIdCounter = 200000; // Start at 200000 to avoid conflicts with HSK IDs

/**
 * Generate a unique ID for Vietnamese vocabulary items
 * Using a simple counter approach to guarantee uniqueness
 */
function generateUniqueVietnameseId(_word: string, index: number, level: number): number {
  // Simple unique ID: base + level + counter + index
  // This guarantees uniqueness across all Vietnamese levels and items
  const uniqueId = 200000 + (level * 10000) + vietnameseIdCounter + index;
  vietnameseIdCounter++;
  return uniqueId;
}

/**
 * Normalize the Vietnamese item structure to handle variations
 */
function normalizeVietnameseItem(item: FlexibleVietnameseItem): {
  vietnamese: string;
  // ipa: string;
  meanings: Array<any>;
} {
  // Get the Vietnamese word (could be 'vietnamese' or 'word')
  const vietnamese = item.vietnamese || item.word || '';
  
  // Get the pronunciation (could be 'ipa' or 'pronunciation')
  // const ipa = item.ipa || item.pronunciation || '';
  
  // Normalize meanings array
  let meanings: Array<any> = [];
  
  if (Array.isArray(item.meanings)) {
    meanings = item.meanings;
  } else if (item.meanings && typeof item.meanings === 'object') {
    // Handle numbered object structure like {"1": {...}, "2": {...}}
    const meaningKeys = Object.keys(item.meanings).sort();
    meanings = meaningKeys.map(key => item.meanings[key]);
  } else {
    // Fallback: create a basic meaning
    meanings = [{
      vietnamese_definition: vietnamese,
      chinese_translation: '',
      english: 'Definition not available',
      part_of_speech: item.parts_of_speech || 'unknown',
      usage_frequency: 'common',
      examples: []
    }];
  }
  
  return { vietnamese, meanings };

}

/**
 * Maps an enriched Vietnamese item to a VocabularyItem
 */
function mapEnrichedVietnameseToVocabularyItem(
  enrichedItem: FlexibleVietnameseItem, 
  vietnameseLevel: number,
  itemIndex: number
): VocabularyItem {
  // Debug: Log the structure of the first few items and any problematic items
  if (itemIndex < 3) {
    console.log(`[DEBUG Vietnamese] Processing item ${itemIndex}:`, {
      vietnamese: enrichedItem.vietnamese || enrichedItem.word,
      meaningsType: typeof enrichedItem.meanings,
      meaningsIsArray: Array.isArray(enrichedItem.meanings)
    });
  }
  
  // Normalize the item structure
  const { vietnamese, meanings } = normalizeVietnameseItem(enrichedItem);
  
  if (!vietnamese) {
    console.warn(`[WARNING] Vietnamese item ${itemIndex} has no Vietnamese word`);
    return {
      id: generateUniqueVietnameseId('unknown', itemIndex, vietnameseLevel),
      vietnamese: 'Unknown word',
      chinese: '',
      pinyin: '',
      english: 'Unknown definition',
      level: vietnameseLevel === 1 ? "A1" : "A2",
      category: 'Other',
    };
  }
  
  // Process meanings to extract primary meaning and examples
  const processedMeanings = meanings.map(meaning => {
    // Handle different field name variations
    const vietnameseDefinition = meaning.vietnamese_definition || meaning.vietnamese || '';
    const chineseTranslation = meaning.chinese_translation || meaning.chinese || '';
    const pinyin = meaning.pinyin || '';
    const english = meaning.english || '';
    const partOfSpeech = meaning.part_of_speech || enrichedItem.parts_of_speech || 'unknown';
    const usageFrequency = meaning.usage_frequency || 'common';
    
    // Process examples
    const examples = (meaning.examples || []).map((example: any) => ({
      vietnamese: example.vietnamese_example || example.vietnamese || '',
      chinese: example.chinese_example || example.chinese || '',
      pinyin: example.pinyin || '',
      english: example.english || ''
    })).filter((ex: any) => ex.vietnamese || ex.chinese); // Filter out empty examples
    
    return {
      vietnamese: vietnameseDefinition,
      chinese: chineseTranslation,
      pinyin,
      english,
      part_of_speech: partOfSpeech,
      usage_frequency: usageFrequency,
      examples
    };
  });
  
  // Get the primary meaning (first one, or the most common one)
  const primaryMeaning = processedMeanings.find(m => m.usage_frequency === 'very common') || 
                         processedMeanings[0] || {
                           vietnamese: '',
                           chinese: '',
                           pinyin: '',
                           english: 'Definition not available',
                           part_of_speech: 'unknown',
                           usage_frequency: 'common',
                           examples: []
                         };
  
  // Generate a unique ID
  const id = generateUniqueVietnameseId(vietnamese, itemIndex, vietnameseLevel);
  
  // Map Vietnamese level to CEFR level
  const cefrLevelMap: Record<number, "A1" | "A2" | "B1" | "B2" | "C1" | "C2"> = {
    1: "A1",
    2: "A2", 
    3: "B1",
    4: "B1",
    5: "B2",
    6: "C1"
  };
  
  // Get category from part of speech
  const categoryMap: Record<string, string> = {
    'v': 'Verbs',
    'verb': 'Verbs',
    'n': 'Nouns',
    'noun': 'Nouns',
    'adj': 'Adjectives',
    'adjective': 'Adjectives',
    'adv': 'Adverbs',
    'adverb': 'Adverbs',
    'prep': 'Prepositions',
    'preposition': 'Prepositions',
    'conj': 'Conjunctions',
    'conjunction': 'Conjunctions',
    'int': 'Interjections',
    'interjection': 'Interjections',
    'pron': 'Pronouns',
    'pronoun': 'Pronouns',
    'num': 'Numbers',
    'number': 'Numbers',
    'part': 'Particles',
    'particle': 'Particles'
  };
  
  const category = categoryMap[primaryMeaning.part_of_speech?.toLowerCase?.()] || 'Other';
  
  // Convert examples to the format expected by VocabularyItem
  const examples = processedMeanings.flatMap(meaning => {
    if (!meaning.examples || !Array.isArray(meaning.examples)) {
      return [];
    }
    return meaning.examples.slice(0, 2); // Take max 2 examples per meaning
  }).slice(0, 3).map(example => ({ // Take max 3 examples total
    vietnamese: example.vietnamese || '',
    chinese: example.chinese || '',
    pinyin: example.pinyin || ''
  })).filter(example => example.vietnamese && example.chinese); // Filter out incomplete examples
  
  return {
    id,
    vietnamese,
    chinese: primaryMeaning.chinese,
    pinyin: primaryMeaning.pinyin,
    english: primaryMeaning.english,
    level: cefrLevelMap[vietnameseLevel] || "A1",
    category,
    examples: examples.length > 0 ? examples : undefined
  };
}

/**
 * Dynamic import function for Vietnamese levels - enables better code splitting
 */
async function dynamicImportVietnameseLevel(level: number): Promise<FlexibleVietnameseItem[]> {
  switch (level) {
    case 1:
      return (await import(`../assets/data/vietnamese/vietnamese_1_enriched.json`)).default;
    case 2:
      return (await import(`../assets/data/vietnamese/vietnamese_2_enriched.json`)).default;
    case 3:
      return (await import(`../assets/data/vietnamese/vietnamese_3_enriched.json`)).default;
    case 4:
      return (await import(`../assets/data/vietnamese/vietnamese_4_enriched.json`)).default;
    case 5:
      return (await import(`../assets/data/vietnamese/vietnamese_5_enriched.json`)).default;
    case 6:
      return (await import(`../assets/data/vietnamese/vietnamese_6_enriched.json`)).default;
    default:
      throw new Error(`Vietnamese level ${level} not supported`);
  }
}

/**
 * Load enriched Vietnamese vocabulary for a specific level using optimized dynamic imports
 */
export async function loadEnrichedVietnameseLevel(level: number): Promise<VocabularyItem[]> {
  // Check cache first
  if (enrichedVietnameseCache[level]) {
    console.log(`Loading Vietnamese ${level} from cache (${enrichedVietnameseCache[level].length} items)`);
    return enrichedVietnameseCache[level];
  }
  
  try {
    // Currently Vietnamese levels 1-6 are available in enriched format
    if (![1, 2, 3, 4, 5, 6].includes(level)) {
      console.warn(`Enriched Vietnamese data only available for levels 1-6, requested level ${level}`);
      return [];
    }
    
    console.log(`Loading enriched Vietnamese ${level} data from assets...`);
    
    // Use optimized dynamic import for better code splitting
    const enrichedData: FlexibleVietnameseItem[] = await dynamicImportVietnameseLevel(level);
    
    console.log(`Loaded ${enrichedData.length} enriched Vietnamese ${level} items from assets`);
    
    // Debug: Log the structure of the first few items and any problematic items
    if (enrichedData.length > 0) {
      console.log(`Vietnamese ${level} first item structure:`, {
        vietnamese: enrichedData[0].vietnamese || enrichedData[0].word,
        meaningsCount: Array.isArray(enrichedData[0].meanings) ? enrichedData[0].meanings.length : 'not array'
      });
    }
    
    // Reset the counter for this level to ensure consistent IDs
    vietnameseIdCounter = (200000 + level * 1000); // Each level gets its own range
    
    // Transform the data to VocabularyItem format
    const vocabularyItems = enrichedData.map((item, index) => 
      mapEnrichedVietnameseToVocabularyItem(item, level, index)
    );
    
    // Filter out invalid items
    const validItems = vocabularyItems.filter(item => item.vietnamese && item.vietnamese !== 'Unknown word');
    
    // Verify unique IDs
    const ids = validItems.map(item => item.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.error('Duplicate IDs detected in Vietnamese vocabulary items!');
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      console.error('Duplicate IDs:', duplicates);
    } else {
      console.log('✅ All Vietnamese vocabulary items have unique IDs');
    }
    
    // Cache the result
    enrichedVietnameseCache[level] = validItems;
    console.log(`✅ Successfully processed and cached ${validItems.length} vocabulary items for Vietnamese ${level}`);
    
    // Log sample of first processed item for verification
    if (validItems.length > 0) {
      console.log(`[DEBUG Vietnamese] Sample processed item: ${validItems[0].vietnamese} (${validItems[0].chinese}) - ${validItems[0].examples?.length || 0} examples`);
    }
    
    return validItems;
  } catch (error) {
    console.error(`Error loading enriched Vietnamese ${level}:`, error);
    throw error;
  }
}

/**
 * Progressive loading for enriched Vietnamese data
 * Simulates progressive loading by delivering items in chunks for better UX
 */
export function loadEnrichedVietnameseProgressively(
  level: number,
  onProgress: (items: VocabularyItem[], progress: number) => void,
  onComplete: (allItems: VocabularyItem[]) => void
): void {
  console.log(`Starting progressive loading for Vietnamese ${level}`);
  
  // Prevent multiple simultaneous loads
  const loadingKey = `vietnamese_${level}_loading`;
  if (activeVietnameseLoads.has(loadingKey)) {
    console.log(`Progressive loading already in progress for Vietnamese ${level}, skipping...`);
    return;
  }
  
  activeVietnameseLoads.add(loadingKey);
  
  loadEnrichedVietnameseLevel(level)
    .then(items => {
      if (items.length === 0) {
        console.log(`No items loaded for Vietnamese ${level}`);
        onComplete([]);
        return;
      }
      
      // Simulate progressive loading by delivering items in chunks
      const chunkSize = Math.max(20, Math.floor(items.length / 8)); // 8 chunks, minimum 20 items per chunk
      let currentIndex = 0;
      const deliveredItems: VocabularyItem[] = [];
      
      const deliverChunk = () => {
        if (currentIndex >= items.length) {
          console.log(`Vietnamese progressive loading complete: ${deliveredItems.length} items delivered`);
          activeVietnameseLoads.delete(loadingKey); // Clear the loading flag
          onComplete(deliveredItems);
          return;
        }
        
        const remainingItems = items.length - currentIndex;
        const actualChunkSize = Math.min(chunkSize, remainingItems);
        const chunk = items.slice(currentIndex, currentIndex + actualChunkSize);
        
        deliveredItems.push(...chunk);
        currentIndex += actualChunkSize;
        
        const progress = Math.min(100, (deliveredItems.length / items.length) * 100);
        console.log(`Vietnamese progressive loading: ${deliveredItems.length}/${items.length} items (${Math.round(progress)}%)`);
        
        onProgress(chunk, progress);
        
        // Small delay to show progress and avoid blocking UI
        setTimeout(deliverChunk, 120); // Slightly slower for Vietnamese to show progress
      };
      
      deliverChunk();
    })
    .catch(error => {
      console.error('Error in Vietnamese progressive loading:', error);
      activeVietnameseLoads.delete(loadingKey); // Clear the loading flag
      onComplete([]);
    });
}

/**
 * Search enriched Vietnamese vocabulary
 */
export function searchEnrichedVietnameseVocabulary(
  query: string,
  items: VocabularyItem[]
): VocabularyItem[] {
  if (!query.trim()) {
    return items;
  }
  
  const queryLower = query.toLowerCase();
  
  return items.filter(item => {
    return (
      (item.vietnamese && item.vietnamese.toLowerCase().includes(queryLower)) ||
      (item.chinese && item.chinese.includes(query)) ||
      (item.pinyin && item.pinyin.toLowerCase().includes(queryLower)) ||
      (item.english && item.english.toLowerCase().includes(queryLower)) ||
      (item.category && item.category.toLowerCase().includes(queryLower))
    );
  });
}

/**
 * Get vocabulary statistics
 */
export function getEnrichedVietnameseStatistics(items: VocabularyItem[]) {
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
