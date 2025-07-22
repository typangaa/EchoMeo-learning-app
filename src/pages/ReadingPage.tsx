import { useState } from 'react';
import { allReadings } from '../data/reading';
import ReadingList from '../components/reading/ReadingList';
import ReadingFilters from '../components/reading/ReadingFilters';

const ReadingPage = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');

  return (
    <div className="h-full max-h-full flex flex-col md:max-w-6xl md:mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-3 md:mb-6 flex-shrink-0">
        <span className="vietnamese-text">Đọc hiểu</span> - <span className="chinese-text">阅读理解</span>
      </h1>
      
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-6">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <ReadingFilters 
              selectedLevel={selectedLevel} 
              setSelectedLevel={setSelectedLevel} 
            />
          </div>
          
          <div className="lg:col-span-3 order-1 lg:order-2">
            <ReadingList 
              passages={allReadings} 
              selectedLevel={selectedLevel} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;