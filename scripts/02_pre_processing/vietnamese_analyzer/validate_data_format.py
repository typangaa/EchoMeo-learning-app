#!/usr/bin/env python3
"""
Quick validation script for Vietnamese data format.
Tests the sample data to ensure the analyzer can process it correctly.
"""

import json
import sys
from pathlib import Path

def validate_vietnamese_data_format(file_path):
    """Validate a single Vietnamese vocabulary file format."""
    
    print(f"🔍 Validating {file_path}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            print(f"   ❌ Expected array, got {type(data)}")
            return False
        
        print(f"   📊 Found {len(data)} vocabulary items")
        
        # Check required fields
        valid_items = 0
        for i, item in enumerate(data):
            if not isinstance(item, dict):
                print(f"   ⚠️  Item {i}: Not a dictionary")
                continue
            
            if 'vietnamese' not in item:
                print(f"   ⚠️  Item {i}: Missing required 'vietnamese' field")
                continue
            
            vietnamese_text = item['vietnamese']
            if not isinstance(vietnamese_text, str) or not vietnamese_text.strip():
                print(f"   ⚠️  Item {i}: Invalid 'vietnamese' field: {vietnamese_text}")
                continue
            
            valid_items += 1
            
            # Test first few items in detail
            if i < 3:
                print(f"   ✅ Item {i}: '{vietnamese_text}'")
                
                # Check optional fields
                optional_fields = ['syllables', 'frequency', 'pos', 'etymology', 'forms']
                for field in optional_fields:
                    if field in item:
                        print(f"      📋 Has {field}: {type(item[field])}")
        
        print(f"   📈 {valid_items}/{len(data)} items are valid")
        
        if valid_items == 0:
            print(f"   ❌ No valid vocabulary items found")
            return False
        
        print(f"   ✅ File format validation passed")
        return True
        
    except json.JSONDecodeError as e:
        print(f"   ❌ JSON parsing error: {e}")
        return False
    except UnicodeDecodeError as e:
        print(f"   ❌ Unicode encoding error: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False

def test_sample_data():
    """Test the sample Vietnamese data."""
    
    print("Vietnamese Data Format Validation")
    print("=" * 40)
    print()
    
    # Test the sample data file
    current_dir = Path(__file__).parent
    sample_file = current_dir / "sample_vietnamese_data.json"
    
    if not sample_file.exists():
        print(f"❌ Sample data file not found: {sample_file}")
        return False
    
    return validate_vietnamese_data_format(sample_file)

def test_data_analyzer_functions():
    """Test key data analyzer functions with sample data."""
    
    print("\n🔍 Testing data analyzer functions...")
    
    try:
        # Import the analyzer
        from data_analyzer import analyze_etymology, analyze_tone_patterns, analyze_combined_data
        
        # Load sample data
        current_dir = Path(__file__).parent
        sample_file = current_dir / "sample_vietnamese_data.json"
        
        with open(sample_file, 'r', encoding='utf-8') as f:
            sample_data = json.load(f)
        
        print(f"   📊 Testing with {len(sample_data)} sample vocabulary items")
        
        # Test etymology analysis
        print("   🔍 Testing etymology analysis...")
        etymology_result = analyze_etymology(sample_data)
        print(f"      ✅ Etymology analysis: {etymology_result['etymology_distribution']}")
        
        # Test tone analysis
        print("   🔍 Testing tone pattern analysis...")
        tone_result = analyze_tone_patterns(sample_data)
        print(f"      ✅ Tone analysis: {len(tone_result['tone_distribution'])} patterns found")
        
        # Test the main combined analysis function
        print("   🔍 Testing combined analysis...")
        
        # Create mock results structure
        mock_results = [{
            'file_number': 1,
            'vocabulary_items': sample_data,
            'total_count': len(sample_data),
            'success': True,
            'file_path': str(sample_file)
        }]
        
        combined_result = analyze_combined_data(mock_results)
        
        if 'error' in combined_result:
            print(f"      ❌ Combined analysis failed: {combined_result['error']}")
            return False
        
        print(f"      ✅ Combined analysis successful")
        print(f"         Total vocabulary: {combined_result['total_vocabulary']}")
        print(f"         Unique words: {combined_result['unique_words']}")
        
        # Check Chinese learner insights
        if 'learning_analysis' in combined_result:
            learning = combined_result['learning_analysis']
            sino_ratio = learning['chinese_learner_insights']['sino_vietnamese_ratio']
            print(f"         Sino-Vietnamese ratio: {sino_ratio:.1%}")
        
        return True
        
    except ImportError as e:
        print(f"   ❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Analysis error: {e}")
        return False

if __name__ == "__main__":
    print("Vietnamese Data Format Quick Validation\n")
    
    # Test sample data format
    format_valid = test_sample_data()
    
    if not format_valid:
        print("\n❌ Sample data format validation failed")
        sys.exit(1)
    
    # Test analyzer functions
    analysis_valid = test_data_analyzer_functions()
    
    if format_valid and analysis_valid:
        print("\n🎉 All validations passed!")
        print("✅ Vietnamese data format is correct")
        print("✅ Analyzer functions work with the data")
        print("\nNext steps:")
        print("1. Create your Vietnamese vocabulary files in the expected format")
        print("2. Place them in scripts/data/vietnamese_generated/")
        print("3. Run the full analyzer: python main_vietnamese_analyzer.py")
    else:
        print("\n❌ Some validations failed")
        print("Please check the errors above")
    
    sys.exit(0 if (format_valid and analysis_valid) else 1)
