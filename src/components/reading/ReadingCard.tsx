import { Link } from 'react-router-dom';
import { ReadingPassage } from '../../types';
import { getReadingCompletion } from '../../utils/progressTracking';

interface ReadingCardProps {
  passage: ReadingPassage;
}

const ReadingCard: React.FC<ReadingCardProps> = ({ passage }) => {
  // Get the saved completion percentage
  const completionPercentage = getReadingCompletion(passage.id);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div>
          <h3 className="text-base md:text-lg font-bold vietnamese-text mb-1">{passage.title.vietnamese}</h3>
          <h4 className="text-sm md:text-base chinese-text">{passage.title.chinese}</h4>
        </div>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded flex-shrink-0">
          {passage.level}
        </span>
      </div>
      
      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">

        {/* Completion progress bar */}
        {completionPercentage > 0 && (
          <div className="mt-2">
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Progress:</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  completionPercentage >= 100
                    ? 'bg-green-600'
                    : completionPercentage >= 50
                      ? 'bg-blue-600'
                      : 'bg-yellow-600'
                }`}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
        <div>
          <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 vietnamese-text">
            {passage.paragraphs[0].vietnamese.length > 40 
              ? `${passage.paragraphs[0].vietnamese.substring(0, 40)}...` 
              : passage.paragraphs[0].vietnamese}
          </p>
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 chinese-text">
            {passage.paragraphs[0].chinese.length > 40 
              ? `${passage.paragraphs[0].chinese.substring(0, 40)}...` 
              : passage.paragraphs[0].chinese}
          </p>
        </div>
      </div>
      
      <Link 
        to={`/reading/${passage.id}`} 
        className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-xs md:text-sm hover:bg-blue-700 transition-colors"
      >
        Read Passage
      </Link>
    </div>
  );
};

export default ReadingCard;