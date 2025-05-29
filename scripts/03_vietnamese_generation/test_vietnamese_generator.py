#!/usr/bin/env python
"""
Test script for Vietnamese Vocabulary Generator

This script tests the Vietnamese vocabulary generation with a small sample
to verify the system is working correctly before processing full HSK levels.
"""

import json
import logging
from vietnamese_vocabulary_generator import (
    VietnameseGeneratorConfig, 
    generate_vietnamese_entry,
    check_ollama_connection
)

def test_vietnamese_generation():
    """Test the Vietnamese generation with sample Chinese words."""
    
    # Setup logging for test
    logging.basicConfig(level=logging.INFO, 
                       format='%(asctime)s - %(levelname)s - %(message)s')
    
    config = VietnameseGeneratorConfig()
    
    # Check Ollama connection first
    if not check_ollama_connection(config):
        print("❌ Cannot connect to Ollama. Please ensure it's running.")
        return False
    
    print("✅ Connected to Ollama successfully")
    
    # Test cases - sample Chinese words from HSK
    test_cases = [
        {
            "chinese_word": "好",
            "pinyin": "hǎo", 
            "meanings": ["good", "well", "fine"],
            "expected_vietnamese": "tốt"
        },
        {
            "chinese_word": "你好",
            "pinyin": "nǐ hǎo",
            "meanings": ["hello", "how are you"],
            "expected_vietnamese": "xin chào"
        },
        {
            "chinese_word": "我",
            "pinyin": "wǒ",
            "meanings": ["I", "me"],
            "expected_vietnamese": "tôi"
        }
    ]
    
    print(f"\n🧪 Testing Vietnamese generation with {len(test_cases)} sample words...")
    
    results = []
    success_count = 0
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n--- Test {i}/{len(test_cases)}: {test_case['chinese_word']} ---")
        
        try:
            vietnamese_entry = generate_vietnamese_entry(
                chinese_word=test_case["chinese_word"],
                chinese_pinyin=test_case["pinyin"],
                chinese_meanings=test_case["meanings"],
                config=config,
                hsk_level=1
            )
            
            if vietnamese_entry and vietnamese_entry.get("vietnamese") != f"[FAILED: {test_case['chinese_word']}]":
                print(f"✅ Success: {test_case['chinese_word']} → {vietnamese_entry['vietnamese']}")
                print(f"   Syllables: {vietnamese_entry.get('syllables', [])}")
                print(f"   Frequency: {vietnamese_entry.get('frequency', 'N/A')}")
                print(f"   Etymology: {vietnamese_entry.get('etymology', {}).get('origin', 'N/A')}")
                
                results.append(vietnamese_entry)
                success_count += 1
            else:
                print(f"❌ Failed: {test_case['chinese_word']}")
                
        except Exception as e:
            print(f"❌ Error processing {test_case['chinese_word']}: {e}")
    
    # Save test results
    if results:
        output_file = "test_vietnamese_results.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print(f"\n💾 Test results saved to: {output_file}")
    
    # Summary
    print(f"\n📊 Test Summary:")
    print(f"   Total tests: {len(test_cases)}")
    print(f"   Successful: {success_count}")
    print(f"   Failed: {len(test_cases) - success_count}")
    print(f"   Success rate: {(success_count/len(test_cases)*100):.1f}%")
    
    if success_count == len(test_cases):
        print("🎉 All tests passed! Ready to process full HSK levels.")
        return True
    else:
        print("⚠️  Some tests failed. Check the logs and system setup.")
        return False

if __name__ == "__main__":
    test_vietnamese_generation()
