import { en } from './en';
import { vi } from './vi';
import { zh } from './zh';
import { zhTw } from './zh-tw';

export const translations = {
  en,
  vi,
  zh,
  'zh-tw': zhTw,
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof en;