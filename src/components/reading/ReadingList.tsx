import { ReadingPassage } from '../../types';
import ReadingCard from './ReadingCard';

interface ReadingListProps {
  passages: ReadingPassage[];
  selectedLevel: string;
}

const ReadingList: React.FC<ReadingListProps> = ({ passages, selectedLevel }) => {
  const filteredPassages = selectedLevel === 'all'
    ? passages
    : passages.filter(passage => passage.level === selectedLevel);

  if (filteredPassages.length === 0) {
    return (
      <div className="text-center py-6 md:py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          No reading passages found for the selected level.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      {filteredPassages.map((passage) => (
        <ReadingCard key={passage.id} passage={passage} />
      ))}
    </div>
  );
};

export default ReadingList;