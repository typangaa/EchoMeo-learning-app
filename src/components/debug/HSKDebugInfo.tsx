/**
 * Quick integration test for HSK functionality
 * Add this temporarily to the HSK page to debug issues
 */

import React from 'react';
import { useHSKVocabulary, useFavorites, useIsFavorite, useFavoritesActions } from '../../stores';

const HSKDebugInfo: React.FC = () => {
  const hskVocabulary = useHSKVocabulary();
  const favorites = useFavorites();
  const { toggleFavorite } = useFavoritesActions();
  const hskVocabularyArray = Array.from(hskVocabulary.values()).flat();
  const sampleItem = hskVocabularyArray[0];
  
  // Only call useIsFavorite if we have a valid sample item
  const sampleItemId = sampleItem?.id;
  const isFirstItemFavorite = useIsFavorite('hsk', sampleItemId || -1);

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">🔧 Debug Information</h3>
      <div className="text-sm space-y-1">
        <p><strong>HSK Vocabulary Count:</strong> {hskVocabularyArray.length}</p>
        <p><strong>HSK Favorites Count:</strong> {favorites.hsk.size}</p>
        <p><strong>HSK Favorites:</strong> [{Array.from(favorites.hsk).join(', ')}]</p>
        {sampleItem && (
          <>
            <p><strong>Sample Item:</strong> {sampleItem.chinese} - {sampleItem.vietnamese}</p>
            <p><strong>Sample Item ID:</strong> {sampleItem.id}</p>
            <p><strong>Is Sample Favorite:</strong> {isFirstItemFavorite ? 'Yes' : 'No'}</p>
            <button 
              onClick={() => toggleFavorite('hsk', sampleItem.id)}
              className="mt-2 px-2 py-1 bg-yellow-600 text-white rounded text-xs"
            >
              Toggle Sample Favorite
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HSKDebugInfo;
