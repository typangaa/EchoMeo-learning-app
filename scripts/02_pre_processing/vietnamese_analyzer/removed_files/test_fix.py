#!/usr/bin/env python3
"""
Test the fixed report generator to verify the error is resolved.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from report_generator import analyze_individual_file

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
        "vietnamese": "học sinh",
        "frequency": 60,
        "syllables": ["học", "sinh"],
        "pos": ["noun"],
        "etymology": {"origin": "sino_vietnamese"},
        "forms": [{"transcriptions": {"tone_pattern": "high_level_mid"}}]
    }
]

def test_fix():
    print("Testing fixed analyze_individual_file function...")
    
    try:
        result = analyze_individual_file(1, test_vocabulary_data, {})
        
        if result:
            print("✅ Function executed successfully!")
            print(f"Result keys: {list(result.keys())}")
            
            # Check the structure
            stats = result.get('statistics', {})
            print(f"Statistics keys: {list(stats.keys())}")
            
            # Check if tone_distribution is now a list
            tone_dist = stats.get('tone_distribution', [])
            pos_dist = stats.get('pos_distribution', [])
            
            print(f"Tone distribution type: {type(tone_dist)}")
            print(f"POS distribution type: {type(pos_dist)}")
            
            # Test slicing (this was the original error)
            if isinstance(tone_dist, list):
                print(f"✅ Tone distribution slicing test: {tone_dist[:5]}")
            else:
                print(f"❌ Tone distribution is not a list: {type(tone_dist)}")
                
            if isinstance(pos_dist, list):
                print(f"✅ POS distribution slicing test: {pos_dist[:5]}")
            else:
                print(f"❌ POS distribution is not a list: {type(pos_dist)}")
            
            return True
            
        else:
            print("❌ Function returned None")
            return False
            
    except Exception as e:
        print(f"❌ Error occurred: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_fix()
    if success:
        print("\n🎉 Fix appears to be working!")
    else:
        print("\n💥 Fix is not working yet.")
