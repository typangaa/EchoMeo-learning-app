import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VocabularyPage from './pages/VocabularyPage';
import ReadingPage from './pages/ReadingPage';
import PassageDetailPage from './pages/PassageDetailPage';
import FlashcardPage from './pages/FlashcardPage';
import Layout from './components/common/Layout';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="vocabulary" element={<VocabularyPage />} />
          <Route path="flashcards" element={<FlashcardPage />} />
          <Route path="reading" element={<ReadingPage />} />
          <Route path="reading/:id" element={<PassageDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;