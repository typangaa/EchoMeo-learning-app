import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import VietnameseVocabularyPage from './pages/VietnameseVocabularyPage';
import VietnameseVocabularyViewPage from './pages/VietnameseVocabularyViewPage';
import HSKVocabularyPage from './pages/HSKVocabularyPage';
import HSKVocabularyViewPage from './pages/HSKVocabularyViewPage';
import ReadingPage from './pages/ReadingPage';
import PassageDetailPage from './pages/PassageDetailPage';
import HSKFlashcardPage from './pages/HSKFlashcardPage';
import VietnameseFlashcardPage from './pages/VietnameseFlashcardPage';
import SettingsPage from './pages/SettingsPage';
import ProgressPage from './pages/ProgressPage';
import WelcomePage from './pages/WelcomePage';

import Layout from './components/common/Layout';
import NotFoundPage from './pages/NotFoundPage';
import StoreInitializer from './components/StoreInitializer';
import FirstVisitHandler from './components/FirstVisitHandler';
import { performDataMigration, validateMigration } from './utils/migrateStorageData';
import { useTheme } from './stores';

function App() {
  const theme = useTheme();

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

  // Sync theme with document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <StoreInitializer />
      <HashRouter>
        <FirstVisitHandler />
        <Routes>
          {/* Landing page route */}
          <Route path="/welcome" element={<WelcomePage />} />
          
          {/* Main app routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="vietnamese" element={<VietnameseVocabularyPage />} />
            <Route path="vietnamese-study" element={<VietnameseVocabularyViewPage />} />
            <Route path="hsk" element={<HSKVocabularyPage />} />
            <Route path="hsk-study" element={<HSKVocabularyViewPage />} />
            <Route path="hsk-flashcards" element={<HSKFlashcardPage />} />
            <Route path="vietnamese-flashcards" element={<VietnameseFlashcardPage />} />
            <Route path="reading" element={<ReadingPage />} />
            <Route path="reading/:id" element={<PassageDetailPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
