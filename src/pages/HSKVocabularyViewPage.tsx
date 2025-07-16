import React, { useState, useEffect } from 'react';
import { useVocabularyStore } from '../stores';
import { useTranslation } from '../hooks/useTranslation';
import { VocabularyItem } from '../types';
import HSKLevelSidebar from '../components/vocabulary/hsk/HSKLevelSidebar';
import HSKSingleVocabularyCard from '../components/vocabulary/hsk/HSKSingleVocabularyCard';
import HSKVocabularyListPanel from '../components/vocabulary/hsk/HSKVocabularyListPanel';
import HSKNavigationControls from '../components/vocabulary/hsk/HSKNavigationControls';

const HSKVocabularyViewPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showListPanel, setShowListPanel] = useState<boolean>(false);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const {
    hskVocabulary,
    favorites,
    loadVocabulary,
    toggleFavorite,
    loading,
    error,
    setSearchTerm: setStoreSearchTerm
  } = useVocabularyStore();

  const currentVocabulary = hskVocabulary.get(selectedLevel) || [];
  const filteredVocabulary = currentVocabulary.filter((item: VocabularyItem) => {
    const matchesSearch = !searchTerm || 
      (item.simplified && item.simplified.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.traditional && item.traditional.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.chinese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vietnamese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.english && item.english.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFavorites = !showFavorites || favorites.hsk.has(item.id);
    
    return matchesSearch && matchesFavorites;
  });

  const currentItem = filteredVocabulary[currentIndex];

  useEffect(() => {
    loadVocabulary('hsk', selectedLevel);
  }, [selectedLevel, loadVocabulary]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedLevel, showFavorites, searchTerm]);

  const handleLevelChange = (level: number) => {
    setSelectedLevel(level);
    setCurrentIndex(0);
  };

  const handleNextItem = () => {
    if (currentIndex < filteredVocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevItem = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleJumpToItem = (index: number) => {
    setCurrentIndex(index);
    setShowListPanel(false);
  };

  const handleToggleFavorite = (item: VocabularyItem) => {
    toggleFavorite('hsk', item.id);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setStoreSearchTerm(term);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">{t('common.error')}</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Level Selection Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <HSKLevelSidebar
            selectedLevel={selectedLevel}
            onLevelChange={handleLevelChange}
            vocabularyCount={currentVocabulary.length}
            favoriteCount={favorites.hsk.size}
            isLoading={loading.hsk}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {t('vocabulary.hsk.title')} {selectedLevel}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {currentIndex + 1} / {filteredVocabulary.length} {t('vocabulary.items')}
                  </p>
                </div>
                
                {/* Mobile Level Selector */}
                <div className="lg:hidden">
                  <select
                    value={selectedLevel}
                    onChange={(e) => handleLevelChange(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map(level => (
                      <option key={level} value={level}>HSK {level}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('vocabulary.search')}
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {/* Favorites Toggle */}
                  <button
                    onClick={() => setShowFavorites(!showFavorites)}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                      showFavorites
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    ⭐ {showFavorites ? t('vocabulary.favorites') : t('vocabulary.showFavorites')}
                  </button>

                  {/* List Panel Toggle */}
                  <button
                    onClick={() => setShowListPanel(!showListPanel)}
                    className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    {showListPanel ? t('vocabulary.hideList') : t('vocabulary.showList')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Single Vocabulary Card */}
            <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 lg:p-8 overflow-y-auto">
              {loading.hsk ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
                </div>
              ) : currentItem ? (
                <HSKSingleVocabularyCard
                  item={currentItem}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.hsk.has(currentItem.id)}
                />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <p className="text-lg">{t('vocabulary.noItems')}</p>
                  {searchTerm && (
                    <p className="text-sm mt-2">{t('vocabulary.noSearchResults')}</p>
                  )}
                </div>
              )}
            </div>

            {/* Vocabulary List Panel */}
            {showListPanel && (
              <HSKVocabularyListPanel
                vocabulary={filteredVocabulary}
                currentIndex={currentIndex}
                onJumpToItem={handleJumpToItem}
                onClose={() => setShowListPanel(false)}
                favorites={favorites.hsk}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </div>

          {/* Navigation Controls */}
          {filteredVocabulary.length > 0 && (
            <HSKNavigationControls
              currentIndex={currentIndex}
              totalItems={filteredVocabulary.length}
              onPrevious={handlePrevItem}
              onNext={handleNextItem}
              canGoPrevious={currentIndex > 0}
              canGoNext={currentIndex < filteredVocabulary.length - 1}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HSKVocabularyViewPage;