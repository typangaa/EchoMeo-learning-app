import { Link } from 'react-router-dom';
import UserProfile from '../components/user/UserProfile';

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        <span className="vietnamese-text">Học Tiếng Việt</span> - <span className="chinese-text">学越南语</span>
      </h1>
      <p className="mb-8 text-center text-lg">
        A platform for learning Vietnamese and Chinese languages
      </p>
      
      <div className="mb-10">
        <UserProfile />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-green-200 dark:border-green-800">
          <h2 className="text-xl font-semibold mb-4">
            <span className="vietnamese-text text-green-600">Từ vựng tiếng Việt</span> - <span className="chinese-text">越南语词汇</span>
          </h2>
          <p className="mb-4">Study Vietnamese vocabulary with comprehensive Chinese translations, etymology, and frequency-based learning.</p>
          <div className="flex space-x-2 mb-2">
            <Link 
              to="/vietnamese" 
              className="inline-block bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors text-sm"
            >
              Browse Vocabulary
            </Link>
            <Link 
              to="/vietnamese-flashcards" 
              className="inline-block bg-green-700 text-white px-3 py-2 rounded hover:bg-green-800 transition-colors text-sm"
            >
              🧠 Practice
            </Link>
          </div>
          <div className="mt-2">
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
              Rich Cultural Context
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            <span className="chinese-text">HSK 词汇</span> - <span className="vietnamese-text">Từ vựng HSK</span>
          </h2>
          <p className="mb-4">Study Chinese vocabulary from HSK levels 1-3 with Vietnamese translations, pinyin, and detailed information.</p>
          <Link 
            to="/hsk" 
            className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            HSK Vocabulary
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-purple-200 dark:border-purple-800">
          <h2 className="text-xl font-semibold mb-4">
            <span className="chinese-text text-purple-600">HSK 闪卡</span> - <span className="vietnamese-text">Thẻ ghi nhớ HSK</span>
          </h2>
          <p className="mb-4">Practice Chinese HSK vocabulary with advanced flashcards featuring Vietnamese translations, pinyin, and spaced repetition.</p>
          <Link 
            to="/hsk-flashcards" 
            className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Practice HSK Flashcards
          </Link>
          <div className="mt-2">
            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
              Enhanced with Audio
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            <span className="vietnamese-text">Đọc hiểu</span> - <span className="chinese-text">阅读理解</span>
          </h2>
          <p className="mb-4">Improve your language skills with graded reading passages in both Vietnamese and Chinese.</p>
          <Link 
            to="/reading" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Start Reading
          </Link>
        </div>
      </div>
      
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">About This Platform</h2>
        <p className="mb-4">
          This Vietnamese-Chinese language learning platform is designed to help users learn either Vietnamese from Chinese or Chinese from Vietnamese.
          The application features vocabulary lists organized by CEFR levels and categories, as well as reading practice with parallel texts.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-medium mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Vietnamese vocabulary with Chinese translations</li>
              <li>HSK vocabulary with Vietnamese translations</li>
              <li>Audio pronunciation (Chinese & Vietnamese)</li>
              <li>Flashcards with spaced repetition</li>
              <li>Interactive reading practice</li>
              <li>Progress tracking & favorites</li>
              <li>Etymology and frequency information</li>
              <li>Dark/light mode support</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Coming Soon:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>HSK Levels 4-7 vocabulary</li>
              <li>Writing practice with stroke order</li>
              <li>Listening comprehension exercises</li>
              <li>User accounts and progress sync</li>
              <li>Community features & leaderboards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;