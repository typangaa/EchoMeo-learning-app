#!/usr/bin/env python3
"""
Test script for the modified Vietnamese analyzer.
Tests the duplicate detection functionality and verifies removal of unwanted files.
"""

import sys
from pathlib import Path
from datetime import datetime
import tempfile
import json

# Import our modified components
from data_extractor import process_dataset, get_dataset_path
from data_analyzer import analyze_combined_data
from file_output import create_comprehensive_output, create_duplicate_word_lists

def create_test_data():
    """Create sample test data with duplicates."""
    return [
        {
            'success': True,
            'file_number': 1,
            'file_path': 'test_file_1.json',
            'total_count': 6,
            'vocabulary_items': [
                {'vietnamese': 'xin chào', 'frequency': 80, 'syllables': ['xin', 'chào'], 'etymology': {'origin': 'native_vietnamese'}, 'pos': ['greeting']},
                {'vietnamese': 'cảm ơn', 'frequency': 85, 'syllables': ['cảm', 'ơn'], 'etymology': {'origin': 'native_vietnamese'}, 'pos': ['greeting']},
                {'vietnamese': 'xin chào', 'frequency': 80, 'syllables': ['xin', 'chào'], 'etymology': {'origin': 'native_vietnamese'}, 'pos': ['greeting']},  # Duplicate
                {'vietnamese': 'con mèo', 'frequency': 70, 'syllables': ['con', 'mèo'], 'etymology': {'origin': 'native_vietnamese'}, 'pos': ['noun']},
                {'vietnamese': 'trường học', 'frequency': 40, 'syllables': ['trường', 'học'], 'etymology': {'origin': 'sino_vietnamese'}, 'pos': ['noun']},
                {'vietnamese': 'con mèo', 'frequency': 70, 'syllables': ['con', 'mèo'], 'etymology': {'origin': 'native_vietnamese'}, 'pos': ['noun']},  # Duplicate
            ]
        }
    ]

def test_duplicate_detection():
    """Test the duplicate detection functionality."""
    print("🧪 Testing duplicate detection functionality...")
    
    # Create test data
    test_results = create_test_data()
    
    # Analyze the test data
    analysis = analyze_combined_data(test_results)
    
    if 'error' in analysis:
        print(f"❌ Analysis failed: {analysis['error']}")
        return False
    
    # Create a temporary directory for output
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # Test the duplicate detection function
        create_duplicate_word_lists(analysis, temp_path)
        
        # Check if duplicate files were created
        duplicate_files = list(temp_path.glob("vietnamese_duplicates_*.txt"))
        
        if duplicate_files:
            print(f"✅ Found {len(duplicate_files)} duplicate files:")
            for file in duplicate_files:
                print(f"   📄 {file.name}")
                
                # Read and display content
                with open(file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    print(f"      Content preview:\n{content[:200]}...")
        else:
            print("⚠️  No duplicate files found")
        
        return len(duplicate_files) > 0

def test_file_output_modifications():
    """Test that unwanted files are no longer generated."""
    print("🧪 Testing file output modifications...")
    
    # Create test data
    test_results = create_test_data()
    
    # Analyze the test data
    analysis = analyze_combined_data(test_results)
    
    if 'error' in analysis:
        print(f"❌ Analysis failed: {analysis['error']}")
        return False
    
    # Create a temporary directory for output
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # Run the modified output creation
        create_comprehensive_output(analysis, temp_path, test_results)
        
        # Check which files were created
        created_files = list(temp_path.glob("*"))
        created_filenames = [f.name for f in created_files]
        
        print(f"✅ Created files:")
        for filename in sorted(created_filenames):
            print(f"   📄 {filename}")
        
        # Check that unwanted files are NOT created
        unwanted_files = [
            'vietnamese_words_advanced.txt',
            'vietnamese_words_intermediate.txt',
            'vietnamese_learning_categories.csv'
        ]
        
        found_unwanted = []
        for unwanted in unwanted_files:
            if unwanted in created_filenames:
                found_unwanted.append(unwanted)
        
        if found_unwanted:
            print(f"❌ Found unwanted files: {found_unwanted}")
            return False
        else:
            print(f"✅ No unwanted files found")
        
        # Check that expected files ARE created
        expected_files = [
            'vietnamese_words_beginner.txt',
            'vietnamese_analysis_summary.txt',
            'vietnamese_vocabulary_complete.json'
        ]
        
        missing_files = []
        for expected in expected_files:
            if expected not in created_filenames:
                missing_files.append(expected)
        
        if missing_files:
            print(f"⚠️  Missing expected files: {missing_files}")
        
        # Check for duplicate files
        duplicate_files = [f for f in created_filenames if f.startswith('vietnamese_duplicates_')]
        if duplicate_files:
            print(f"✅ Found {len(duplicate_files)} duplicate files: {duplicate_files}")
        else:
            print(f"⚠️  No duplicate files found")
        
        return len(found_unwanted) == 0

def main():
    """Run all tests."""
    print("VIETNAMESE ANALYZER MODIFICATION TESTS")
    print("=" * 60)
    print("Testing the modified Vietnamese analyzer functionality")
    print()
    
    all_tests_passed = True
    
    # Test 1: Duplicate detection
    try:
        if test_duplicate_detection():
            print("✅ Test 1 PASSED: Duplicate detection works")
        else:
            print("❌ Test 1 FAILED: Duplicate detection not working")
            all_tests_passed = False
    except Exception as e:
        print(f"❌ Test 1 ERROR: {e}")
        all_tests_passed = False
    
    print()
    
    # Test 2: File output modifications
    try:
        if test_file_output_modifications():
            print("✅ Test 2 PASSED: File output modifications work")
        else:
            print("❌ Test 2 FAILED: File output modifications not working")
            all_tests_passed = False
    except Exception as e:
        print(f"❌ Test 2 ERROR: {e}")
        all_tests_passed = False
    
    print()
    print("=" * 60)
    
    if all_tests_passed:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Modifications successfully implemented:")
        print("   - Removed generation of vietnamese_words_advanced.txt")
        print("   - Removed generation of vietnamese_words_intermediate.txt") 
        print("   - Removed generation of vietnamese_learning_categories.csv")
        print("   - Added duplicate word lists for each level")
    else:
        print("❌ SOME TESTS FAILED!")
        print("Please check the errors above and fix the issues.")
    
    return all_tests_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
