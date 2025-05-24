/**
 * Interface for enriched HSK vocabulary data
 */

export interface HSKEnrichedExample {
  chinese: string;
  pinyin: string;
  english: string;
  vietnamese: string;
}

export interface HSKEnrichedMeaning {
  chinese: string;
  english: string;
  vietnamese: string;
  part_of_speech: string;
  usage_frequency: 'very common' | 'common' | 'less common';
  examples: HSKEnrichedExample[];
}

export interface HSKEnrichedItem {
  item: string; // The Chinese character/word
  pinyin: string;
  meanings: HSKEnrichedMeaning[];
}

/**
 * Convert HSK enriched item to the standard VocabularyItem format
 */
export function convertHSKEnrichedToVocabularyItem(
  enrichedItem: HSKEnrichedItem, 
  hskLevel: number
): import('../types').VocabularyItem {
  // Get the primary meaning (most common one)
  const primaryMeaning = enrichedItem.meanings.find(m => m.usage_frequency === 'very common') 
    || enrichedItem.meanings[0];
  
  // Create a unique ID based on the Chinese character and HSK level
  const id = enrichedItem.item.charCodeAt(0) * 1000 + hskLevel * 100 + 
    Math.floor(Math.random() * 100);
  
  // Map HSK level to CEFR level (approximate mapping)
  const cefrLevelMap: Record<number, "A1" | "A2" | "B1" | "B2" | "C1" | "C2"> = {
    1: "A1",
    2: "A1", 
    3: "A2",
    4: "B1",
    5: "B2",
    6: "C1",
    7: "C2"
  };
  
  return {
    id,
    chinese: enrichedItem.item,
    vietnamese: primaryMeaning.vietnamese,
    pinyin: enrichedItem.pinyin,
    english: primaryMeaning.english,
    level: cefrLevelMap[hskLevel] || "A1",
    category: `HSK ${hskLevel}`,
    examples: primaryMeaning.examples.map(example => ({
      vietnamese: example.vietnamese,
      chinese: example.chinese,
      pinyin: example.pinyin
    }))
  };
}
