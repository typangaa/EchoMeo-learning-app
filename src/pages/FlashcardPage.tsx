import { Link } from 'react-router-dom';

const FlashcardPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Flashcard Practice</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* HSK Flashcards - Primary option */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl mr-3">🇨🇳</span>
            <h2 className="text-lg sm:text-xl font-semibold">
              <span className="chinese-text text-red-600">HSK 汉语水平考试</span>
            </h2>
          </div>
          <Link 
            to="/hsk-flashcards" 
            className="inline-block bg-red-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-700 transition-colors w-full text-center text-sm sm:text-base"
          >
            Practice HSK Flashcards
          </Link>
        </div>
        
        {/* Vietnamese Vocabulary Flashcards - Featured option */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl mr-3">🇻🇳</span>
            <h2 className="text-lg sm:text-xl font-semibold">
              <span className="vietnamese-text text-green-600">Từ vựng tiếng Việt</span>
            </h2>
          </div>
          <Link 
            to="/vietnamese-flashcards" 
            className="inline-block bg-green-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-green-700 transition-colors w-full text-center text-sm sm:text-base"
          >
            Practice Vietnamese Flashcards
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default FlashcardPage;