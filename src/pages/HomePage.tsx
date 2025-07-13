import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          <span className="vietnamese-text">Học Tiếng Việt</span> - <span className="chinese-text">学越南语</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Vietnamese ↔ Chinese Language Learning Platform
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
        
        {/* Vietnamese Section */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-4 sm:p-6 lg:p-8 border border-green-200 dark:border-green-700">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="text-2xl sm:text-3xl mr-3">🇻🇳</div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold vietnamese-text text-green-700 dark:text-green-300">
              Tiếng Việt
            </h2>
          </div>
          
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
            Learn Vietnamese vocabulary with Chinese translations across 6 levels (A1-C1)
          </p>
          
          <div className="space-y-2 sm:space-y-3">
            <Link 
              to="/vietnamese" 
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors font-medium text-sm sm:text-base"
            >
              📚 Browse Vocabulary
            </Link>
            <Link 
              to="/vietnamese-flashcards" 
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors font-medium text-sm sm:text-base"
            >
              🧠 Practice Flashcards
            </Link>
          </div>
          
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-green-700 dark:text-green-300">
            ✨ Audio pronunciation, spaced repetition, cultural context
          </div>
        </div>
        
        {/* Chinese HSK Section */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-xl p-4 sm:p-6 lg:p-8 border border-red-200 dark:border-red-700">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="text-2xl sm:text-3xl mr-3">🇨🇳</div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold chinese-text text-red-700 dark:text-red-300">
              汉语 HSK
            </h2>
          </div>
          
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
            Master Chinese vocabulary with Vietnamese translations for HSK levels 1-6
          </p>
          
          <div className="space-y-2 sm:space-y-3">
            <Link 
              to="/hsk" 
              className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors font-medium text-sm sm:text-base"
            >
              📚 Browse HSK Vocabulary
            </Link>
            <Link 
              to="/hsk-flashcards" 
              className="block w-full bg-red-500 hover:bg-red-600 text-white text-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors font-medium text-sm sm:text-base"
            >
              🧠 Practice HSK Flashcards
            </Link>
          </div>
          
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-red-700 dark:text-red-300">
            ✨ Pinyin, audio, traditional & simplified characters
          </div>
        </div>
        
      </div>
      
      {/* Reading Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-8">
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            📖 <span className="vietnamese-text">Đọc hiểu</span> - <span className="chinese-text">阅读理解</span>
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            Improve reading comprehension with parallel texts
          </p>
          <Link 
            to="/reading" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors font-medium text-sm sm:text-base"
          >
            Start Reading Practice
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;