import { Link } from 'react-router-dom';
import AutoplayToggle from '../components/common/AutoplayToggle';

const FlashcardPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Flashcard Practice</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HSK Flashcards - Primary option */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🇨🇳</span>
            <h2 className="text-xl font-semibold">
              <span className="chinese-text text-red-600">HSK 汉语水平考试</span>
            </h2>
          </div>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Practice Chinese vocabulary from the official HSK standardized test. 
            Includes Vietnamese translations, pinyin, and example sentences.
          </p>
          <div className="mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Features:</div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside mt-1">
              <li>Structured by HSK levels (1-6)</li>
              <li>Rich Vietnamese translations</li>
              <li>Audio pronunciation</li>
              <li>Progress tracking</li>
            </ul>
          </div>
          <Link 
            to="/hsk-flashcards" 
            className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors w-full text-center"
          >
            Practice HSK Flashcards
          </Link>
          <div className="mt-2 text-center">
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
              Chinese Learning
            </span>
          </div>
        </div>
        
        {/* Vietnamese Vocabulary Flashcards - Featured option */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🇻🇳</span>
            <h2 className="text-xl font-semibold">
              <span className="vietnamese-text text-green-600">Từ vựng tiếng Việt</span>
            </h2>
          </div>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Study Vietnamese vocabulary with comprehensive Chinese translations, etymology information, and cultural context. 
            Perfect for understanding Vietnamese language structure.
          </p>
          <div className="mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Features:</div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside mt-1">
              <li>Etymology and frequency information</li>
              <li>Rich Chinese translations</li>
              <li>Cultural context and usage</li>
              <li>Audio pronunciation</li>
            </ul>
          </div>
          <Link 
            to="/vietnamese-flashcards" 
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors w-full text-center"
          >
            Practice Vietnamese Flashcards
          </Link>
          <div className="mt-2 text-center">
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
              Vietnamese Learning
            </span>
          </div>
        </div>
      </div>
      
      {/* Additional information */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">
          Which flashcard system should I use?
        </h3>
        <div className="space-y-3 text-blue-700 dark:text-blue-300">
          <p>
            <strong>HSK Flashcards:</strong> Perfect for learning Chinese systematically. 
            If you're serious about Chinese proficiency and want to prepare for official tests, 
            HSK flashcards follow standardized curriculum with rich Vietnamese translations.
          </p>
          <p>
            <strong>Vietnamese Vocabulary:</strong> Ideal for understanding Vietnamese language 
            structure, etymology, and cultural context. These flashcards provide comprehensive 
            Chinese translations with frequency and origin information.
          </p>
        </div>
      </div>
      
      {/* Study tips */}
      <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-green-800 dark:text-green-200">
          📚 Effective Flashcard Study Tips
        </h3>
        <ul className="text-green-700 dark:text-green-300 list-disc list-inside space-y-2">
          <li>Practice regularly - even 10-15 minutes daily is better than long sporadic sessions</li>
          <li>Use both learning directions (Chinese→Vietnamese and Vietnamese→Chinese)</li>
          <li>Don't just memorize - try to understand the context and usage</li>
          <li>Use the audio feature to improve pronunciation and listening skills</li>
          <li>Review your mistakes and favorite difficult words more frequently</li>
          <li>Set realistic goals - master 10-20 new words per week consistently</li>
        </ul>
      </div>
      
      {/* Audio Settings Demo */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          🔊 Audio Settings Demo
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Configure your audio preferences here. These settings will apply to all flashcard systems.
        </p>
        <AutoplayToggle showAdvancedOptions={true} />
      </div>
    </div>
  );
};

export default FlashcardPage;