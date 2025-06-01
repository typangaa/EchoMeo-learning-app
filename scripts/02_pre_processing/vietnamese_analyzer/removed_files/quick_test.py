#!/usr/bin/env python3
"""
Simple test to verify our modifications work.
"""

# Test data
test_vocabulary_data = [
    {
        "vietnamese": "xin chào",
        "frequency": 85,
        "syllables": ["xin", "chào"],
        "pos": ["interjection"],
        "etymology": {"origin": "native_vietnamese"},
        "forms": [{"transcriptions": {"tone_pattern": "mid_rising_falling"}}]
    },
    {
        "vietnamese": "xin chào",  # Duplicate
        "frequency": 85,
        "syllables": ["xin", "chào"],
        "pos": ["interjection"],
        "etymology": {"origin": "native_vietnamese"},
        "forms": [{"transcriptions": {"tone_pattern": "mid_rising_falling"}}]
    },
    {
        "vietnamese": "học sinh",
        "frequency": 60,
        "syllables": ["học", "sinh"],
        "pos": ["noun"],
        "etymology": {"origin": "sino_vietnamese"},
        "forms": [{"transcriptions": {"tone_pattern": "high_level_mid"}}]
    }
]

# Test the modified analyze_individual_file function
from report_generator import analyze_individual_file

print("Testing modified individual file analysis...")
result = analyze_individual_file(1, test_vocabulary_data, {})

if result:
    print(f"Success! Analysis structure: {list(result.keys())}")
    
    # Check for learning_categories removal
    if 'learning_categories' in result:
        print("ERROR: learning_categories still present!")
    else:
        print("✅ learning_categories successfully removed")
    
    # Check for duplicate_count
    if 'statistics' in result and 'duplicate_count' in result['statistics']:
        print(f"✅ duplicate_count present: {result['statistics']['duplicate_count']}")
    else:
        print("ERROR: duplicate_count missing!")
        
    print(f"Statistics keys: {list(result['statistics'].keys())}")
else:
    print("ERROR: No result returned")
