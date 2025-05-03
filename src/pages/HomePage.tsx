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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            <span className="vietnamese-text">Từ vựng</span> - <span className="chinese-text">词汇</span>
          </h2>
          <p className="mb-4">Learn vocabulary organized by CEFR levels and categories, with examples and audio pronunciation.</p>
          <Link 
            to="/vocabulary" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Browse Vocabulary
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            <span className="vietnamese-text">Thẻ ghi nhớ</span> - <span className="chinese-text">记忆卡片</span>
          </h2>
          <p className="mb-4">Practice vocabulary with flashcards using a spaced repetition system to optimize learning.</p>
          <Link 
            to="/flashcards" 
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Start Practicing
          </Link>
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
              <li>Organized vocabulary by CEFR levels</li>
              <li>Flashcards with spaced repetition</li>
              <li>Interactive reading practice</li>
              <li>Progress tracking</li>
              <li>Dark/light mode support</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Coming Soon:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Audio pronunciation</li>
              <li>Writing practice</li>
              <li>Listening exercises</li>
              <li>User accounts and progress sync</li>
              <li>Community features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;