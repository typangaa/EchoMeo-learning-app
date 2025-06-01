/**
 * Quick integration test for Vietnamese functionality
 * Add this temporarily to the Vietnamese page to debug issues
 */

import React from 'react';
import { useVocabulary } from '../../context/VocabularyContext';

const VietnameseDebugInfo: React.FC = () => {
  const { 
    vietnameseVocabulary, 
    vietnameseFavorites, 
    isFavorite, 
    toggleFavorite 
  } = useVocabulary();

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">🔧 Vietnamese Debug Information</h3>
      <div className="text-sm space-y-1">
        <p><strong>Vietnamese Vocabulary Count:</strong> {vietnameseVocabulary.length}</p>
        <p><strong>Vietnamese Favorites Count:</strong> {vietnameseFavorites.length}</p>
        <p><strong>Vietnamese Favorites:</strong> [{vietnameseFavorites.join(', ')}]</p>
        {vietnameseVocabulary.length > 0 && (
          <>
            <p><strong>Sample Item:</strong> {vietnameseVocabulary[0].vietnamese} - {vietnameseVocabulary[0].chinese}</p>
            <p><strong>Sample Item ID:</strong> {vietnameseVocabulary[0].id}</p>
            <p><strong>Sample Item Level:</strong> {vietnameseVocabulary[0].level}</p>
            <p><strong>Sample Item Category:</strong> {vietnameseVocabulary[0].category}</p>
            <p><strong>Is Sample Favorite:</strong> {isFavorite(vietnameseVocabulary[0].id, 'vietnamese') ? 'Yes' : 'No'}</p>
            <button 
              onClick={() => toggleFavorite(vietnameseVocabulary[0].id, 'vietnamese')}
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
