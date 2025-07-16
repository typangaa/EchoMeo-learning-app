export interface VocabularyItem {
  id: number;
  vietnamese: string;
  chinese: string;
  pinyin: string;
  english?: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  category: string;
  examples?: Array<{
    vietnamese: string;
    chinese: string;
    pinyin: string;
  }>;
  audioUrl?: string;
  // Optional properties for HSK vocabulary
  simplified?: string;
  traditional?: string;
  frequency?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface ReadingPassage {
  id: string;
  title: {
    vietnamese: string;
    chinese: string;
    pinyin?: string;
  };
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  paragraphs: Array<{
    vietnamese: string;
    chinese: string;
    pinyin?: string;
  }>;
  vocabulary?: VocabularyItem[];
  questions?: Array<{
    question: {
      vietnamese: string;
      chinese: string;
      pinyin?: string;
    };
    options: Array<{
      vietnamese: string;
      chinese: string;
      pinyin?: string;
      isCorrect: boolean;
    }>;
  }>;
}

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";