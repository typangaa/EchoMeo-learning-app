import { useAppStore } from '../stores';
import { translations, type Language } from '../i18n';

// Create a stable translation function outside the component
function createTranslationFunction(language: string) {
  return function t(key: string, params?: Record<string, string>) {
    const keys = key.split('.');
    let value: any = translations[language as Language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string' && !Array.isArray(value)) {
      // Fallback to English if translation not found
      const fallbackKeys = key.split('.');
      let fallbackValue: any = translations.en;
      
      for (const k of fallbackKeys) {
        fallbackValue = fallbackValue?.[k];
      }
      
      if (typeof fallbackValue === 'string' || Array.isArray(fallbackValue)) {
        value = fallbackValue;
      } else {
        // If even English doesn't have the key, return the key itself
        value = key;
      }
    }
    
    // Replace parameters if provided
    if (params) {
      if (typeof value === 'string') {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] || match;
        });
      } else if (Array.isArray(value)) {
        return value.map(item => 
          typeof item === 'string' 
            ? item.replace(/\{(\w+)\}/g, (match, paramKey) => {
                return params[paramKey] || match;
              })
            : item
        );
      }
    }
    
    return value;
  };
}

export function useTranslation() {
  // Use Zustand's direct store access to avoid re-render issues
  const language = useAppStore((state) => state.language);
  
  // Create a stable translation function for this language
  const t = createTranslationFunction(language);
  
  return { t, language };
}