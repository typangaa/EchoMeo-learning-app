/**
 * Quick integration test for Vietnamese functionality
 * Add this temporarily to the Vietnamese page to debug issues
 */

import React from 'react';
import { useVietnameseVocabulary, useFavorites, useIsFavorite, useFavoritesActions } from '../../stores';

const VietnameseDebugInfo: React.FC = () => {
  const vietnameseVocabulary = useVietnameseVocabulary();
  const favorites = useFavorites();
  const { toggleFavorite } = useFavoritesActions();
  const vietnameseVocabularyArray = Array.from(vietnameseVocabulary.values()).flat();
  const sampleItem = vietnameseVocabularyArray[0];
  const isFirstItemFavorite = useIsFavorite('vietnamese', sampleItem?.id || 0);

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">🔧 Vietnamese Debug Information</h3>
      <div className="text-sm space-y-1">
        <p><strong>Vietnamese Vocabulary Count:</strong> {vietnameseVocabularyArray.length}</p>
        <p><strong>Vietnamese Favorites Count:</strong> {favorites.vietnamese.size}</p>
        <p><strong>Vietnamese Favorites:</strong> [{Array.from(favorites.vietnamese).join(', ')}]</p>
        {sampleItem && (
          <>
            <p><strong>Sample Item:</strong> {sampleItem.vietnamese} - {sampleItem.chinese}</p>
            <p><strong>Sample Item ID:</strong> {sampleItem.id}</p>
            <p><strong>Sample Item Level:</strong> {sampleItem.level}</p>
            <p><strong>Sample Item Category:</strong> {sampleItem.category}</p>
            <p><strong>Is Sample Favorite:</strong> {isFirstItemFavorite ? 'Yes' : 'No'}</p>
            <button 
              onClick={() => toggleFavorite('vietnamese', sampleItem.id)}
              className="mt-2 px-2 py-1 bg-green-600 text-white rounded text-xs"
            >
              Toggle Sample Favorite
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VietnameseDebugInfo;
