import { Link } from 'react-router-dom';
import { ReadingPassage } from '../../types';

interface ReadingCardProps {
  passage: ReadingPassage;
}

const ReadingCard: React.FC<ReadingCardProps> = ({ passage }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold vietnamese-text mb-1">{passage.title.vietnamese}</h3>
          <h4 className="text-md chinese-text">{passage.title.chinese}</h4>
        </div>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
          {passage.level}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        <p>Paragraphs: {passage.paragraphs.length}</p>
        <p>Vocabulary: {passage.vocabulary.length} words</p>
        {passage.questions && <p>Questions: {passage.questions.length}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300 vietnamese-text">
            {passage.paragraphs[0].vietnamese.length > 50 
              ? `${passage.paragraphs[0].vietnamese.substring(0, 50)}...` 
              : passage.paragraphs[0].vietnamese}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300 chinese-text">
            {passage.paragraphs[0].chinese.length > 50 
              ? `${passage.paragraphs[0].chinese.substring(0, 50)}...` 
              : passage.paragraphs[0].chinese}
          </p>
        </div>
      </div>
      
      <Link 
        to={`/reading/${passage.id}`} 
        className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
      >
        Read Passage
      </Link>
    </div>
  );
};

export default ReadingCard;