import { VocabularyItem } from '../types';

/**
 * HSK Vocabulary Loader - Handles enriched HSK vocabulary data
 * Supports HSK Levels 1-7 with Vietnamese translations, examples, and detailed meanings
 */

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

// Flexible interface to handle different possible JSON structures
interface FlexibleHSKItem {
  item?: string;
  word?: string; // Alternative field name
  pinyin?: string;
  meanings?: any; // Can be array or object or other structure
  [key: string]: any; // Allow any additional properties
}

// Cache for enriched HSK data
const enrichedCache: Record<number, VocabularyItem[]> = {};

// Track active loading operations to prevent duplicates
const activeLoads = new Set<string>();

// Simple counter to ensure unique IDs
let hskIdCounter = 100000;

/**
 * Generate a unique ID for HSK vocabulary items
 * Using a simple counter approach to guarantee uniqueness
 */
function generateUniqueHSKId(_item: string | undefined, index: number, level: number): number {
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
  enrichedItem: FlexibleHSKItem, 
  hskLevel: number,
  itemIndex: number
): VocabularyItem {
  // Debug: Log the structure of the first few items and any problematic items
  if (itemIndex < 3 || !Array.isArray(enrichedItem.meanings)) {
    console.log(`[DEBUG] Processing item ${itemIndex}: ${enrichedItem.item}`);
    console.log(`[DEBUG] Meanings type:`, typeof enrichedItem.meanings);
    console.log(`[DEBUG] Meanings is array:`, Array.isArray(enrichedItem.meanings));
    if (!Array.isArray(enrichedItem.meanings)) {
      console.log(`[DEBUG] Problematic meanings structure:`, enrichedItem.meanings);
    }
  }
  
  // Handle different possible structures of meanings
  let meanings: Array<any> = [];
  
  if (enrichedItem.meanings && Array.isArray(enrichedItem.meanings)) {
    meanings = enrichedItem.meanings;
  } else if (enrichedItem.meanings && typeof enrichedItem.meanings === 'object') {
    // Handle numbered object structure like {"1": {...}, "2": {...}}
    const meaningKeys = Object.keys(enrichedItem.meanings).sort();
    meanings = meaningKeys.map(key => {
      const meaning = enrichedItem.meanings[key];
      
      // Convert old field names to new field names
      const convertedMeaning = {
        chinese: meaning.chinese_definitions || meaning.chinese || '',
        english: meaning.english_translations || meaning.english || '',
        vietnamese: meaning.vietnamese_translations || meaning.vietnamese || '',
        part_of_speech: meaning.part_of_speech || 'n', // Default to noun
        usage_frequency: meaning.usage_frequency || (meaningKeys.indexOf(key) === 0 ? 'very common' : 'common'),
        examples: []
      };
      
      // Convert examples from string format to object format
      if (meaning.examples && Array.isArray(meaning.examples)) {
        convertedMeaning.examples = meaning.examples.map((exampleStr: string) => {
          const parts = exampleStr.split(' ; ');
          if (parts.length >= 2) {
            return {
              chinese: parts[0].trim(),
              pinyin: '', // Will be empty, user needs to add manually
              english: '', // Will be empty, user needs to add manually  
              vietnamese: parts[1].trim()
            };
          } else {
            return {
              chinese: exampleStr.trim(),
              pinyin: '',
              english: '',
              vietnamese: ''
            };
          }
        });
      }
      
      return convertedMeaning;
    });
  } else {
    console.warn(`[WARNING] Item ${enrichedItem.item} has invalid meanings structure:`, enrichedItem.meanings);
    // Create a fallback meaning
    meanings = [{
      chinese: enrichedItem.item,
      english: 'Definition not available',
      vietnamese: 'Chưa có định nghĩa',
      part_of_speech: 'unknown',
      usage_frequency: 'common',
      examples: []
    }];
  }
  
  // Get the primary meaning (first one, or the most common one)
  const primaryMeaning = meanings.find(m => m.usage_frequency === 'very common') || 
                         meanings[0];
  
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
  const examples = meanings.flatMap(meaning => {
    if (!meaning.examples || !Array.isArray(meaning.examples)) {
      return [];
    }
    return meaning.examples.slice(0, 2); // Take max 2 examples per meaning
  }).slice(0, 3).map(example => ({ // Take max 3 examples total
    vietnamese: (example && example.vietnamese) || '',
    chinese: (example && example.chinese) || '',
    pinyin: (example && example.pinyin) || '',
    english: (example && example.english) || ''
  })).filter(example => example.vietnamese || example.chinese); // Filter out empty examples
  
  const chineseText = enrichedItem.item || enrichedItem.word || '';
  const pinyinText = enrichedItem.pinyin || '';
  
  return {
    id,
    chinese: chineseText,
    simplified: chineseText, // HSK words are in simplified Chinese
    traditional: chineseText, // For now, use same as simplified - could be enhanced later
    vietnamese: primaryMeaning.vietnamese,
    pinyin: pinyinText || chineseText, // Use chinese as fallback if pinyin missing
    english: primaryMeaning.english,
    level: cefrLevelMap[hskLevel] || "A1",
    category,
    examples: examples.length > 0 ? examples : undefined,
    // Store first two meanings for flashcard display
    meanings: meanings.slice(0, 2).map(meaning => ({
      chinese: meaning.chinese,
      english: meaning.english,
      vietnamese: meaning.vietnamese,
      part_of_speech: meaning.part_of_speech,
      usage_frequency: meaning.usage_frequency
    }))
  };
}

/**
 * Dynamic import function for HSK levels - enables better code splitting
 */
async function dynamicImportHSKLevel(level: number): Promise<FlexibleHSKItem[]> {
  switch (level) {
    case 1:
      return (await import(`../assets/data/hsk/hsk1_enriched.json`)).default;
    case 2:
      return (await import(`../assets/data/hsk/hsk2_enriched.json`)).default;
    case 3:
      return (await import(`../assets/data/hsk/hsk3_enriched.json`)).default;
    case 4:
      return (await import(`../assets/data/hsk/hsk4_enriched.json`)).default;
    case 5:
      return (await import(`../assets/data/hsk/hsk5_enriched.json`)).default;
    case 6:
      return (await import(`../assets/data/hsk/hsk6_enriched.json`)).default;
    case 7:
      return (await import(`../assets/data/hsk/hsk7_enriched.json`)).default;
    default:
      throw new Error(`HSK level ${level} not supported`);
  }
}

/**
 * Load enriched HSK vocabulary for a specific level using optimized dynamic imports
 */
export async function loadEnrichedHSKLevel(level: number): Promise<VocabularyItem[]> {
  // Check cache first
  if (enrichedCache[level]) {
    // Reduce console spam - only log cache hits for debugging when needed
    // console.log(`Loading HSK ${level} from cache (${enrichedCache[level].length} items)`);
    return enrichedCache[level];
  }
  
  try {
    // Currently HSK levels 1-7 are available in enriched format
    if (![1, 2, 3, 4, 5, 6, 7].includes(level)) {
      console.warn(`Enriched HSK data only available for levels 1-7, requested level ${level}`);
      return [];
    }
    
    console.log(`Loading enriched HSK ${level} data from assets...`);
    
    // Use optimized dynamic import for better code splitting
    const enrichedData: FlexibleHSKItem[] = await dynamicImportHSKLevel(level);
    
    console.log(`Loaded ${enrichedData.length} enriched HSK ${level} items from assets`);
    
    // Log structure of first item for debugging
    if (enrichedData.length > 0) {
      console.log(`[DEBUG] First item structure:`, {
        item: enrichedData[0].item,
        pinyin: enrichedData[0].pinyin,
        meaningsType: typeof enrichedData[0].meanings,
        meaningsIsArray: Array.isArray(enrichedData[0].meanings),
        meaningsSample: enrichedData[0].meanings
      });
    }
    
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
    console.log(`✅ Successfully processed and cached ${vocabularyItems.length} vocabulary items for HSK ${level}`);
    
    // Log sample of first processed item for verification
    if (vocabularyItems.length > 0) {
      console.log(`[DEBUG] Sample processed item: ${vocabularyItems[0].chinese} (${vocabularyItems[0].vietnamese}) - ${vocabularyItems[0].examples?.length || 0} examples`);
    }
    
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
  
  return items.filter(item => {
    // Support both item.item (raw HSK data) and item.chinese (transformed data)
    const chineseText = (item as any).item || item.chinese;
    return (
      (chineseText && chineseText.includes(query)) ||
      (item.pinyin && item.pinyin.toLowerCase().includes(queryLower)) ||
      (item.english && item.english.toLowerCase().includes(queryLower)) ||
      (item.vietnamese && item.vietnamese.toLowerCase().includes(queryLower)) ||
      (item.category && item.category.toLowerCase().includes(queryLower))
    );
  });
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
 * Get the primary meaning from an EnhancedVocabularyItem
 */
export function getPrimaryMeaning(item: EnhancedVocabularyItem) {
  return item.meanings.find(meaning => meaning.primary) || 
         (item.meanings.length > 0 ? item.meanings[0] : {
           vietnamese: '',
           english: '',
           chinese: '',
           part_of_speech: '',
           usage_frequency: 'common' as const
         });
}

/**
 * Load enriched HSK vocabulary preserving all meanings (for potential future advanced features)
 */
export async function loadEnhancedHSKLevelFull(level: number): Promise<EnhancedVocabularyItem[]> {
  try {
    if (![1, 2, 3, 4, 5, 6, 7].includes(level)) {
      console.warn(`Enriched HSK data only available for levels 1-7, requested level ${level}`);
      return [];
    }
    
    // Use dynamic import instead of fetch
    const module = await import(`../assets/data/hsk/hsk${level}_enriched.json`);
    const enrichedData: FlexibleHSKItem[] = module.default;
    
    // Transform to enhanced format preserving all meanings
    const enhancedItems = enrichedData.map((item, index) => {
      // Handle different possible structures of meanings
      let meanings: Array<any> = [];
      
      if (item.meanings && Array.isArray(item.meanings)) {
        meanings = item.meanings;
      } else if (item.meanings && typeof item.meanings === 'object') {
        // Handle numbered object structure like {"1": {...}, "2": {...}}
        const meaningKeys = Object.keys(item.meanings).sort();
        meanings = meaningKeys.map(key => {
          const meaning = item.meanings[key];
          
          // Convert old field names to new field names
          return {
            chinese: meaning.chinese_definitions || meaning.chinese || '',
            english: meaning.english_translations || meaning.english || '',
            vietnamese: meaning.vietnamese_translations || meaning.vietnamese || '',
            part_of_speech: meaning.part_of_speech || 'n',
            usage_frequency: meaning.usage_frequency || (meaningKeys.indexOf(key) === 0 ? 'very common' : 'common'),
            examples: meaning.examples && Array.isArray(meaning.examples) ? 
              meaning.examples.map((exampleStr: string) => {
                const parts = exampleStr.split(' ; ');
                if (parts.length >= 2) {
                  return {
                    chinese: parts[0].trim(),
                    pinyin: '',
                    english: '',
                    vietnamese: parts[1].trim()
                  };
                } else {
                  return {
                    chinese: exampleStr.trim(),
                    pinyin: '',
                    english: '',
                    vietnamese: ''
                  };
                }
              }) : []
          };
        });
      } else {
        meanings = [{
          chinese: item.item,
          english: 'Definition not available',
          vietnamese: 'Chưa có định nghĩa',
          part_of_speech: 'unknown',
          usage_frequency: 'common',
          examples: []
        }];
      }
      
      const chineseText = item.item || item.word || '';
      const pinyinText = item.pinyin || '';
      
      return {
        id: generateUniqueHSKId(chineseText, index, level),
        simplified: chineseText,
        pinyin: pinyinText,
        hsk_level: level,
        meanings: meanings.map((meaning, meaningIndex) => ({
          vietnamese: meaning.vietnamese || '',
          english: meaning.english || '',
          chinese: meaning.chinese || '',
          part_of_speech: meaning.part_of_speech || 'unknown',
          usage_frequency: meaning.usage_frequency as 'very common' | 'common' | 'less common' || 'common',
          primary: meaningIndex === 0 || meaning.usage_frequency === 'very common'
        })),
        examples: meanings.flatMap(meaning => {
          if (!meaning.examples || !Array.isArray(meaning.examples)) {
            return [];
          }
          return meaning.examples.filter((ex: any) => ex && (ex.vietnamese || ex.chinese));
        })
      };
    });
    
    return enhancedItems;
  } catch (error) {
    console.error(`Error loading enriched HSK ${level}:`, error);
    throw error;
  }
}
