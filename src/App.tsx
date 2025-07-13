import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import VietnameseVocabularyPage from './pages/VietnameseVocabularyPage';
import HSKVocabularyPage from './pages/HSKVocabularyPage';
import ReadingPage from './pages/ReadingPage';
import PassageDetailPage from './pages/PassageDetailPage';
import FlashcardPage from './pages/FlashcardPage';
import HSKFlashcardPage from './pages/HSKFlashcardPage';
import VietnameseFlashcardPage from './pages/VietnameseFlashcardPage';

import Layout from './components/common/Layout';
import NotFoundPage from './pages/NotFoundPage';
import { performDataMigration, validateMigration } from './utils/migrateStorageData';

function App() {
  // Initialize Zustand stores and perform data migration on app startup
  useEffect(() => {
    const initializeStores = async () => {
      // Perform data migration from Context to Zustand format
      const migrationSuccess = performDataMigration();
      
      if (migrationSuccess) {
        // Validate migration
        validateMigration();
      }
    };

    initializeStores();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="vietnamese" element={<VietnameseVocabularyPage />} />
          <Route path="hsk" element={<HSKVocabularyPage />} />
          <Route path="flashcards" element={<FlashcardPage />} />
          <Route path="hsk-flashcards" element={<HSKFlashcardPage />} />
          <Route path="vietnamese-flashcards" element={<VietnameseFlashcardPage />} />
          <Route path="reading" element={<ReadingPage />} />
          <Route path="reading/:id" element={<PassageDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
