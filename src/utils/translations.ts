/**
 * Type definitions and utilities for vocabulary translations
 */

export interface Translation {
  vietnamese: string;
  english: string;
  primary?: boolean;
}

export interface Example {
  chinese: string;
  vietnamese: string;
  pinyin: string;
}

export interface EnhancedVocabularyItem {
  simplified: string;
  traditional?: string;
  pinyin: string;
  hsk_level: number;
  meanings: Translation[];
  examples?: Example[];
  audio_url?: string;
}

/**
 * Gets the primary translation or first translation if none marked as primary
 */
export const getPrimaryTranslation = (item: EnhancedVocabularyItem): Translation | null => {
  return item.meanings.find(meaning => meaning.primary) || 
         (item.meanings.length > 0 ? item.meanings[0] : null);
};
