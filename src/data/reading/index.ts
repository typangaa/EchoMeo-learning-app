import { ReadingPassage } from '../../types';
import { a1Readings } from './a1Readings';
// Import future reading levels as they're added
// import { a2Readings } from './a2Readings';
// import { b1Readings } from './b1Readings';

// Combine all reading passages
export const allReadings: ReadingPassage[] = [
  ...a1Readings,
  // Add more reading levels as they're created
  // ...a2Readings,
  // ...b1Readings,
];

// Get readings by level
export const getReadingsByLevel = (level: string): ReadingPassage[] => {
  if (level === 'all') {
    return allReadings;
  }
  return allReadings.filter(reading => reading.level === level);
};

// Get reading by ID
export const getReadingById = (id: string): ReadingPassage | undefined => {
  return allReadings.find(reading => reading.id === id);
};

// Export individual reading levels for direct access
export { a1Readings };