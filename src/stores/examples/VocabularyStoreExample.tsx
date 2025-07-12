// Example component showing how to use the new Zustand Vocabulary Store
// This demonstrates vocabulary loading, filtering, search, and favorites

import React, { useEffect, useState } from 'react';
import { 
  useRegularVocabulary,
  useHSKVocabulary,
  useVietnameseVocabulary,
  useFavorites,
  useVocabularyFilters,
  useVocabularySearchTerm,
  useVocabularyLoading,
  useVocabularyLoader,
  useFavoritesActions,
  useVocabularyFilterActions,
  useFilteredVocabulary,
  useFavoriteCount
} from '../index';

const VocabularyStoreExample: React.FC = () => {
  // Vocabulary data
  const regularVocabulary = useRegularVocabulary();
  const hskVocabulary = useHSKVocabulary();
  const vietnameseVocabulary = useVietnameseVocabulary();
  
  // State
  const favorites = useFavorites();
  const filters = useVocabularyFilters();
  const searchTerm = useVocabularySearchTerm();
  const loading = useVocabularyLoading();
  
  // Actions
  const { loadVocabulary } = useVocabularyLoader();
  const { toggleFavorite } = useFavoritesActions();
  const { setFilters, setSearchTerm } = useVocabularyFilterActions();
  
  // Filtered data
  const filteredRegular = useFilteredVocabulary('regular');
  const filteredHSK1 = useFilteredVocabulary('hsk', 1);
  const filteredVietnamese1 = useFilteredVocabulary('vietnamese', '1');
  
  // Favorite counts
  const regularFavoriteCount = useFavoriteCount('regular');
  const hskFavoriteCount = useFavoriteCount('hsk');
  const vietnameseFavoriteCount = useFavoriteCount('vietnamese');
  
  // Local state for demo
  const [selectedVocabType, setSelectedVocabType] = useState<'regular' | 'hsk' | 'vietnamese'>('regular');

  // Load initial data
  useEffect(() => {
    loadVocabulary('hsk', 1);
    loadVocabulary('vietnamese', 1);
  }, [loadVocabulary]);

  // Get current vocabulary based on selection
  const getCurrentVocabulary = () => {
    switch (selectedVocabType) {
      case 'regular':
        return filteredRegular;
      case 'hsk':
        return filteredHSK1;
      case 'vietnamese':
        return filteredVietnamese1;
      default:
        return [];
    }
  };

  const currentVocabulary = getCurrentVocabulary();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Zustand Vocabulary Store Example</h1>

      {/* Store State Overview */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <h3>Store State Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <div>
            <strong>Regular Vocabulary:</strong> {regularVocabulary.length} items
            <br />
            <strong>Favorites:</strong> {regularFavoriteCount}
          </div>
          <div>
            <strong>HSK Vocabulary:</strong> {hskVocabulary.get(1)?.length || 0} items (Level 1)
            <br />
            <strong>Favorites:</strong> {hskFavoriteCount}
          </div>
          <div>
            <strong>Vietnamese Vocabulary:</strong> {vietnameseVocabulary.get('1')?.length || 0} items (Level 1)
            <br />
            <strong>Favorites:</strong> {vietnameseFavoriteCount}
          </div>
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <strong>Loading States:</strong> 
          {' '}Regular: {loading.regular ? '⏳' : '✅'}
          {' '}HSK: {loading.hsk ? '⏳' : '✅'}
          {' '}Vietnamese: {loading.vietnamese ? '⏳' : '✅'}
        </div>
      </div>

      {/* Vocabulary Type Selector */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Vocabulary Type Selection</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          {(['regular', 'hsk', 'vietnamese'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedVocabType(type)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedVocabType === type ? '#007bff' : '#e9ecef',
                color: selectedVocabType === type ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {(selectedVocabType === 'hsk' || selectedVocabType === 'vietnamese') && (
          <div>
            <button 
              onClick={() => loadVocabulary(selectedVocabType, selectedVocabType === 'hsk' ? 2 : 2)}
              disabled={loading[selectedVocabType]}
              style={{ padding: '5px 10px', marginRight: '10px' }}
            >
              Load Level 2
            </button>
            <button 
              onClick={() => loadVocabulary(selectedVocabType, selectedVocabType === 'hsk' ? 3 : 1)}
              disabled={loading[selectedVocabType]}
              style={{ padding: '5px 10px' }}
            >
              Load Level {selectedVocabType === 'hsk' ? '3' : '1'}
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Search and Filters</h3>
        
        {/* Search */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Search vocabulary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              width: '200px'
            }}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={{ 
                marginLeft: '10px', 
                padding: '8px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={filters.onlyFavorites}
              onChange={(e) => setFilters({ onlyFavorites: e.target.checked })}
              style={{ marginRight: '5px' }}
            />
            Only Favorites
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={filters.hasAudio}
              onChange={(e) => setFilters({ hasAudio: e.target.checked })}
              style={{ marginRight: '5px' }}
            />
            Has Audio
          </label>
        </div>
      </div>

      {/* Vocabulary List */}
      <div style={{ marginBottom: '20px' }}>
        <h3>
          Current Vocabulary ({selectedVocabType}) - {currentVocabulary.length} items
          {searchTerm && ` (filtered by "${searchTerm}")`}
        </h3>
        
        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto', 
          border: '1px solid #ddd', 
          borderRadius: '4px'
        }}>
          {currentVocabulary.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              {loading[selectedVocabType] ? 'Loading...' : 'No vocabulary items found'}
            </div>
          ) : (
            currentVocabulary.slice(0, 10).map((item) => {
              const isFav = favorites[selectedVocabType].has(item.id);
              
              return (
                <div 
                  key={`${selectedVocabType}-${item.id}`}
                  style={{ 
                    padding: '10px', 
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>
                      🇻🇳 {item.vietnamese} | 🇨🇳 {item.chinese}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {item.pinyin && `Pinyin: ${item.pinyin} | `}
                      {item.english && `English: ${item.english} | `}
                      Level: {item.level} | Category: {item.category}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleFavorite(selectedVocabType, item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      padding: '5px'
                    }}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                </div>
              );
            })
          )}
          
          {currentVocabulary.length > 10 && (
            <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
              ... and {currentVocabulary.length - 10} more items
            </div>
          )}
        </div>
      </div>

      {/* Migration Benefits */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '8px' 
      }}>
        <h3>🎉 Vocabulary Store Benefits</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div>
            <h4>✅ Unified Management</h4>
            <ul>
              <li>Single store for all vocabulary types</li>
              <li>Consistent favorites system</li>
              <li>Unified filtering and search</li>
            </ul>
          </div>
          
          <div>
            <h4>✅ Performance</h4>
            <ul>
              <li>Selective subscriptions</li>
              <li>Efficient Set-based favorites</li>
              <li>Computed selectors</li>
            </ul>
          </div>
          
          <div>
            <h4>✅ Developer Experience</h4>
            <ul>
              <li>Type-safe hooks</li>
              <li>Redux DevTools integration</li>
              <li>Automatic persistence</li>
            </ul>
          </div>
          
          <div>
            <h4>✅ Mobile Ready</h4>
            <ul>
              <li>React Native compatible</li>
              <li>Async data loading</li>
              <li>Offline support ready</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>Debug:</strong> Current filters: {JSON.stringify(filters)} | 
        Search: "{searchTerm}" | 
        Favorites: R:{regularFavoriteCount} H:{hskFavoriteCount} V:{vietnameseFavoriteCount}
      </div>
    </div>
  );
};

export default VocabularyStoreExample;