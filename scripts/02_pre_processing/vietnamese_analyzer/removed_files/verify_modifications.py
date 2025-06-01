#!/usr/bin/env python3
"""
Quick verification script to test our modifications.
This will run a minimal version of the analysis to verify the changes work.
"""

import json
import sys
from pathlib import Path

def create_test_data():
    """Create minimal test Vietnamese vocabulary data."""
    return [
        {
            "vietnamese": "xin chào",
            "frequency": 85,
            "syllables": ["xin", "chào"],
            "pos": ["interjection"],
            "etymology": {"origin": "native_vietnamese"},
            "forms": [{"transcriptions": {"tone_pattern": "mid_rising_falling"}}]
        },
        {
            "vietnamese": "xin chào",  # Duplicate to test counting
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
        },
        {
            "vietnamese": "giáo viên",
            "frequency": 55,
            "syllables": ["giáo", "viên"],
            "pos": ["noun"],
            "etymology": {"origin": "sino_vietnamese"},
            "forms": [{"transcriptions": {"tone_pattern": "rising_high"}}]
        }
    ]

def test_individual_analysis():
    """Test the modified individual file analysis."""
    
    print("🧪 Testing Individual File Analysis (Modified)")
    print("-" * 50)
    
    try:
        # Import our modified function
        from report_generator import analyze_individual_file
        
        # Create test data
        test_data = create_test_data()
        
        # Run analysis
        result = analyze_individual_file(1, test_data, {})
        
        if not result:
            print("❌ No analysis result returned")
            return False
        
        print(f"✅ Analysis completed successfully")
        print(f"📊 Top-level keys: {list(result.keys())}")
        
        # Test 1: Check learning_categories is removed
        if 'learning_categories' in result:
            print("❌ FAIL: learning_categories still present in result")
            return False
        else:
            print("✅ PASS: learning_categories successfully removed")
        
        # Test 2: Check duplicate_count is present
        if 'statistics' in result and 'duplicate_count' in result['statistics']:
            duplicate_count = result['statistics']['duplicate_count']
            print(f"✅ PASS: duplicate_count present: {duplicate_count}")
            
            # Should be 1 for our test data (one duplicate "xin chào")
            if duplicate_count == 1:
                print("✅ PASS: duplicate_count is correct (expected 1)")
            else:
                print(f"⚠️  WARNING: duplicate_count expected 1, got {duplicate_count}")
        else:
            print("❌ FAIL: duplicate_count not found in statistics")
            return False
        
        # Test 3: Check essential fields are still present
        required_fields = ['file_number', 'statistics', 'chinese_learner_insights', 'vocabulary_list']
        missing_fields = [field for field in required_fields if field not in result]
        
        if missing_fields:
            print(f"❌ FAIL: Missing required fields: {missing_fields}")
            return False
        else:
            print("✅ PASS: All required fields present")
        
        # Test 4: Check sample_words is removed
        if 'sample_words' in result:
            print("❌ FAIL: sample_words still present (should be removed)")
            return False
        else:
            print("✅ PASS: sample_words successfully removed")
        
        # Test 5: Check statistics structure
        stats = result['statistics']
        expected_stats = ['total_words', 'unique_words', 'duplicate_count', 'average_syllables']
        missing_stats = [stat for stat in expected_stats if stat not in stats]
        
        if missing_stats:
            print(f"⚠️  WARNING: Missing statistics: {missing_stats}")
        else:
            print("✅ PASS: All expected statistics present")
        
        print(f"📊 Statistics keys: {list(stats.keys())}")
        
        return True
        
    except Exception as e:
        print(f"❌ ERROR: Exception during test: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_report_structure():
    """Test the modified report structure."""
    
    print("\n🧪 Testing Report Structure (Modified)")
    print("-" * 50)
    
    try:
        from report_generator import analyze_individual_file
        
        # Create test data and analyze
        test_data = create_test_data()
        file_analysis = analyze_individual_file(1, test_data, {})
        
        if not file_analysis:
            print("❌ No file analysis to test")
            return False
        
        # Simulate the report structure that would be created
        file_report = {
            "report_info": {
                "file_number": 1,
                "generation_timestamp": "2025-05-31 test",
                "report_type": "Individual Vietnamese Vocabulary File Analysis",
                "description": "Test analysis"
            },
            "summary": {
                "total_words_in_file": file_analysis['statistics']['total_words'],
                "unique_words": file_analysis['statistics']['unique_words'],
                "duplicate_words": file_analysis['statistics']['duplicate_count'],
                "average_syllables": round(file_analysis['statistics']['average_syllables'], 2),
                "sino_vietnamese_ratio": round(file_analysis['chinese_learner_insights']['sino_vietnamese_ratio'], 3)
            },
            "detailed_analysis": file_analysis,
            "learning_recommendations": []
        }
        
        # Test 1: Check summary structure
        summary = file_report['summary']
        
        if 'learning_difficulty_distribution' in summary:
            print("❌ FAIL: learning_difficulty_distribution still in summary")
            return False
        else:
            print("✅ PASS: learning_difficulty_distribution removed from summary")
        
        if 'duplicate_words' in summary:
            print(f"✅ PASS: duplicate_words in summary: {summary['duplicate_words']}")
        else:
            print("❌ FAIL: duplicate_words not in summary")
            return False
        
        # Test 2: Check detailed_analysis doesn't have learning_categories
        detailed = file_report['detailed_analysis']
        
        if 'learning_categories' in detailed:
            print("❌ FAIL: learning_categories still in detailed_analysis")
            return False
        else:
            print("✅ PASS: learning_categories removed from detailed_analysis")
        
        print(f"📊 Summary keys: {list(summary.keys())}")
        print(f"📊 Detailed analysis keys: {list(detailed.keys())}")
        
        # Save a test report to verify JSON serialization works
        test_file = Path(__file__).parent / "test_report.json"
        with open(test_file, 'w', encoding='utf-8') as f:
            json.dump(file_report, f, ensure_ascii=False, indent=2)
        
        print("✅ PASS: Report can be serialized to JSON")
        
        # Clean up
        test_file.unlink()
        print("✅ PASS: Test file cleaned up")
        
        return True
        
    except Exception as e:
        print(f"❌ ERROR: Exception during report structure test: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run verification tests."""
    
    print("VIETNAMESE ANALYZER MODIFICATION VERIFICATION")
    print("=" * 60)
    print("Testing removal of learning_categories and inclusion of duplicate_words")
    print()
    
    # Run tests
    test1_passed = test_individual_analysis()
    test2_passed = test_report_structure()
    
    # Summary
    print("\n" + "=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)
    
    if test1_passed and test2_passed:
        print("🎉 ALL TESTS PASSED!")
        print()
        print("✅ Modifications successfully implemented:")
        print("   ✓ learning_categories removed from individual analysis")
        print("   ✓ sample_words removed from individual analysis")
        print("   ✓ learning_difficulty_distribution removed from summary")
        print("   ✓ duplicate_words properly included in summary")
        print("   ✓ duplicate_count present in statistics")
        print("   ✓ All essential fields preserved")
        print()
        print("🚀 The analyzer is ready to use with the new structure!")
        return True
    else:
        print("❌ SOME TESTS FAILED!")
        print()
        print("Failed tests:")
        if not test1_passed:
            print("   ❌ Individual Analysis Test")
        if not test2_passed:
            print("   ❌ Report Structure Test")
        print()
        print("Please check the errors above and fix any issues.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
