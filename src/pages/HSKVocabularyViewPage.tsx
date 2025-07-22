import React, { useState, useEffect, useRef } from 'react';
import { useVocabularyStore } from '../stores';
import { useTranslation } from '../hooks/useTranslation';
import { VocabularyItem } from '../types';
import HSKLevelSidebar from '../components/vocabulary/hsk/HSKLevelSidebar';
import HSKSingleVocabularyCard from '../components/vocabulary/hsk/HSKSingleVocabularyCard';
import HSKVocabularyListPanel from '../components/vocabulary/hsk/HSKVocabularyListPanel';
import HSKNavigationControls from '../components/vocabulary/hsk/HSKNavigationControls';
import { readingProgressTracker } from '../utils/readingProgress';

const HSKVocabularyViewPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showListPanel, setShowListPanel] = useState<boolean>(false);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

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
    if (showFavorites || searchTerm) {
      setCurrentIndex(0);
    } else {
      const savedIndex = readingProgressTracker.loadProgress('hsk', selectedLevel);
      if (savedIndex > 0 && savedIndex < filteredVocabulary.length) {
        setCurrentIndex(savedIndex);
      } else {
        setCurrentIndex(0);
      }
    }
  }, [selectedLevel, showFavorites, searchTerm, filteredVocabulary.length]);

  const handleLevelChange = (level: number) => {
    setSelectedLevel(level);
  };

  const handleNextItem = () => {
    if (currentIndex < filteredVocabulary.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      readingProgressTracker.saveProgress('hsk', selectedLevel, newIndex);
    }
  };

  const handlePrevItem = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      readingProgressTracker.saveProgress('hsk', selectedLevel, newIndex);
    }
  };

  const handleJumpToItem = (index: number) => {
    setCurrentIndex(index);
    setShowListPanel(false);
    readingProgressTracker.saveProgress('hsk', selectedLevel, index);
  };

  const handleToggleFavorite = (item: VocabularyItem) => {
    toggleFavorite('hsk', item.id);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setStoreSearchTerm(term);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && currentIndex < filteredVocabulary.length - 1) {
      handleNextItem();
    } else if (isRightSwipe && currentIndex > 0) {
      handlePrevItem();
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
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
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-2 sm:py-4">
            {/* Desktop Header */}
            <div className="hidden sm:flex sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {t('vocabulary.hsk.title')} {selectedLevel}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {currentIndex + 1} / {filteredVocabulary.length} {t('vocabulary.items')}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('vocabulary.search')}
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Favorites Toggle */}
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {showListPanel ? t('vocabulary.hideList') : t('vocabulary.showList')}
                </button>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="sm:hidden">
              {!isSearchExpanded ? (
                /* Compact Mobile Header */
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                      HSK {selectedLevel}
                    </h1>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {currentIndex + 1}/{filteredVocabulary.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* Level Selector */}
                    <select
                      value={selectedLevel}
                      onChange={(e) => handleLevelChange(Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-xs"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>

                    {/* Show List Button */}
                    <button
                      onClick={() => setShowListPanel(!showListPanel)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                    >
                      📋
                    </button>

                    {/* Search Toggle */}
                    <button
                      onClick={() => setIsSearchExpanded(true)}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* Expanded Mobile Header */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t('vocabulary.hsk.title')} {selectedLevel}
                    </h1>
                    <button
                      onClick={() => setIsSearchExpanded(false)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('vocabulary.search')}
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Level Selector */}
                    <select
                      value={selectedLevel}
                      onChange={(e) => handleLevelChange(Number(e.target.value))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map(level => (
                        <option key={level} value={level}>HSK {level}</option>
                      ))}
                    </select>

                    {/* Favorites Toggle */}
                    <button
                      onClick={() => setShowFavorites(!showFavorites)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
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
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      {showListPanel ? t('vocabulary.hideList') : t('vocabulary.showList')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Single Vocabulary Card */}
            <div 
              className="flex-1 flex flex-col items-center justify-start p-0 sm:p-4 lg:p-8 overflow-hidden sm:overflow-y-auto"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
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