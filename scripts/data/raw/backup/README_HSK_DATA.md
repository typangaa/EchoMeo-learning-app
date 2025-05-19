# HSK Vocabulary Data Splitting

This directory contains:
- Original HSK vocabulary JSON files (1.json through 7.json)
- A Python script `split_hsk_files.py` to split these files into smaller chunks
- A "splits" directory that will be created by the script to store the smaller files

## Why Split the Files?

The original HSK vocabulary files are quite large:
- HSK 1: ~500KB
- HSK 2: ~1.2MB
- HSK 3: ~2MB
- Higher levels are even larger

Large JSON files can cause performance issues in a web application:
- Longer initial load time
- Higher memory usage
- Potential browser performance problems on mobile devices

## Splitting Strategy

The script splits each HSK level file into smaller chunks of approximately 75 words each.
This creates manageable file sizes (typically 100-200KB per file) while reducing HTTP request overhead.

## File Naming Convention

The split files follow this naming convention:
```
hsk{level}-part{part_number}.json
```

For example:
- `hsk1-part1.json`, `hsk1-part2.json`, etc. for HSK Level 1
- `hsk2-part1.json`, `hsk2-part2.json`, etc. for HSK Level 2

## How to Use the Script

1. Ensure Python 3.6+ is installed
2. Run the script from the command line:
   ```
   python split_hsk_files.py
   ```
3. The script will:
   - Process each HSK level file (1.json through 7.json)
   - Create a "splits" directory if it doesn't exist
   - Save the split files in the "splits" directory

## How to Use the Split Files in Your Application

In the frontend application, implement a loading strategy that:
1. Loads only the HSK levels the user is studying
2. Loads the parts progressively as needed
3. Caches loaded data to minimize repeated downloads

Example loading approach in JavaScript/TypeScript:
```typescript
// Function to load all parts of a specific HSK level
async function loadHSKLevel(level: number): Promise<VocabularyItem[]> {
  // First, determine how many parts exist for this level
  const response = await fetch(`/api/hsk/${level}/parts`);
  const { totalParts } = await response.json();
  
  // Load all parts in parallel
  const partsPromises = Array.from({ length: totalParts }, (_, i) => 
    fetch(`/data/hsk/splits/hsk${level}-part${i+1}.json`).then(res => res.json())
  );
  
  // Combine all parts
  const parts = await Promise.all(partsPromises);
  return parts.flat();
}

// Or load parts incrementally as needed
async function loadHSKLevelPart(level: number, part: number): Promise<VocabularyItem[]> {
  const response = await fetch(`/data/hsk/splits/hsk${level}-part${part}.json`);
  return response.json();
}
```

## Adjusting the Chunk Size

If you want to change the number of words per file, modify the `WORDS_PER_FILE` constant in the script (default is 75).
