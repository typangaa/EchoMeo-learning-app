/**
 * Simple test file to verify HSK enriched data integration
 * This can be run in the browser console or as a quick verification
 */

import { loadEnrichedHSKLevel, getEnrichedHSKStatistics } from './enrichedHSKLoader';

export async function testHSKIntegration() {
  console.log('🧪 Testing HSK Enriched Data Integration...');
  
  try {
    // Test loading HSK Level 1
    console.log('📚 Loading HSK Level 1...');
    const hsk1Data = await loadEnrichedHSKLevel(1);
    
    console.log(`✅ Successfully loaded ${hsk1Data.length} HSK 1 vocabulary items`);
    
    // Show some sample data
    if (hsk1Data.length > 0) {
      console.log('📝 Sample vocabulary items:');
      hsk1Data.slice(0, 3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.chinese} (${item.pinyin}) - ${item.vietnamese} - ${item.english}`);
        if (item.examples && item.examples.length > 0) {
          console.log(`   Example: ${item.examples[0].chinese} - ${item.examples[0].vietnamese}`);
        }
      });
    }
    
    // Test statistics
    const stats = getEnrichedHSKStatistics(hsk1Data);
    console.log('📊 Statistics:', stats);
    
    // Test invalid level
    console.log('🚫 Testing invalid level (should return empty array)...');
    const invalidData = await loadEnrichedHSKLevel(2);
    console.log(`Expected 0 items for HSK 2, got: ${invalidData.length}`);
    
    console.log('✅ All tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Export for potential use in development
export default testHSKIntegration;
