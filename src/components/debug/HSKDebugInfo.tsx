/**
 * Quick integration test for HSK functionality
 * Add this temporarily to the HSK page to debug issues
 */

import React from 'react';
import { useVocabulary } from '../../context/VocabularyContext';

const HSKDebugInfo: React.FC = () => {
  const { 
    hskVocabulary, 
    hskFavorites, 
    isFavorite, 
    toggleFavorite 
  } = useVocabulary();

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">🔧 Debug Information</h3>
      <div className="text-sm space-y-1">
        <p><strong>HSK Vocabulary Count:</strong> {hskVocabulary.length}</p>
        <p><strong>HSK Favorites Count:</strong> {hskFavorites.length}</p>
        <p><strong>HSK Favorites:</strong> [{hskFavorites.join(', ')}]</p>
        {hskVocabulary.length > 0 && (
          <>
            <p><strong>Sample Item:</strong> {hskVocabulary[0].chinese} - {hskVocabulary[0].vietnamese}</p>
            <p><strong>Sample Item ID:</strong> {hskVocabulary[0].id}</p>
            <p><strong>Is Sample Favorite:</strong> {isFavorite(hskVocabulary[0].id, 'hsk') ? 'Yes' : 'No'}</p>
            <button 
              onClick={() => toggleFavorite(hskVocabulary[0].id, 'hsk')}
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
