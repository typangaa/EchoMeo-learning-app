// Simple test to verify HSK 7 loading
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if HSK 7 file exists and is valid JSON
const hsk7Path = path.join(__dirname, 'src/assets/data/hsk/hsk7_enriched.json');

console.log('Testing HSK 7 data loading...');

try {
  // Check if file exists
  if (!fs.existsSync(hsk7Path)) {
    console.error('❌ HSK 7 file does not exist');
    process.exit(1);
  }
  
  console.log('✅ HSK 7 file exists');
  
  // Check if it's valid JSON
  const rawData = fs.readFileSync(hsk7Path, 'utf8');
  const jsonData = JSON.parse(rawData);
  
  console.log('✅ HSK 7 file contains valid JSON');
  
  // Check structure
  if (!Array.isArray(jsonData)) {
    console.error('❌ HSK 7 data is not an array');
    process.exit(1);
  }
  
  console.log(`✅ HSK 7 data is an array with ${jsonData.length} items`);
  
  // Check first item structure
  if (jsonData.length > 0) {
    const firstItem = jsonData[0];
    const requiredFields = ['item', 'pinyin', 'meanings'];
    
    for (const field of requiredFields) {
      if (!firstItem.hasOwnProperty(field)) {
        console.error(`❌ First item missing required field: ${field}`);
        process.exit(1);
      }
    }
    
    console.log('✅ First item has required fields:', requiredFields);
    console.log('Sample item:', {
      item: firstItem.item,
      pinyin: firstItem.pinyin,
      meaningsCount: Array.isArray(firstItem.meanings) ? firstItem.meanings.length : 'not array'
    });
  }
  
  console.log('\n🎉 HSK 7 data validation successful!');
  
} catch (error) {
  console.error('❌ Error testing HSK 7 data:', error.message);
  process.exit(1);
}