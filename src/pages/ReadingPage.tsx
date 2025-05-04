import { useState } from 'react';
import { allReadings } from '../data/reading';
import ReadingList from '../components/reading/ReadingList';
import ReadingFilters from '../components/reading/ReadingFilters';

const ReadingPage = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        <span className="vietnamese-text">Đọc hiểu</span> - <span className="chinese-text">阅读理解</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ReadingFilters 
            selectedLevel={selectedLevel} 
            setSelectedLevel={setSelectedLevel} 
          />
        </div>
        
        <div className="md:col-span-3">
          <ReadingList 
            passages={allReadings} 
            selectedLevel={selectedLevel} 
          />
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;