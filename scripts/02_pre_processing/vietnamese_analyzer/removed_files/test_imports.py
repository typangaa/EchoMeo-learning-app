#!/usr/bin/env python3
"""
Test script to validate all module imports for Vietnamese Vocabulary Analyzer.
Run this before using the main analyzer to check for any import issues.
"""

import sys
from pathlib import Path

def test_imports():
    """Test all module imports and report any issues."""
    
    print("Vietnamese Vocabulary Analyzer - Import Test")
    print("=" * 50)
    print()
    
    # Test standard library imports
    print("🔍 Testing standard library imports...")
    try:
        import json
        import os
        from collections import Counter, defaultdict
        from datetime import datetime
        from pathlib import Path
        import re
        print("   ✅ Standard library imports successful")
    except ImportError as e:
        print(f"   ❌ Standard library import error: {e}")
        return False
    
    # Test local module imports
    print("\n🔍 Testing Vietnamese analyzer module imports...")
    
    modules_to_test = [
        ('data_extractor', [
            'extract_from_single_file',
            'process_dataset', 
            'get_dataset_path',
            'validate_data_structure',
            'print_data_structure_info'
        ]),
        ('data_analyzer', [
            'analyze_etymology',
            'analyze_tone_patterns',
            'analyze_regional_variants',
            'analyze_syllable_structure',
            'analyze_pos_distribution',
            'analyze_frequency_patterns',
            'analyze_combined_data',
            'analyze_for_learning'
        ]),
        ('file_output', [
            'create_comprehensive_output',
            'create_learning_focused_output',
            'generate_study_recommendations',
            'create_csv_outputs',
            'create_text_outputs'
        ]),
        ('report_generator', [
            'generate_learning_recommendations',
            'analyze_individual_file',
            'create_individual_file_reports',
            'create_file_summary_text',
            'create_file_csv'
        ]),
        ('console_output', [
            'print_detailed_statistics',
            'print_final_summary',
            'print_output_locations',
            'print_usage_recommendations',
            'print_error_summary'
        ])
    ]
    
    all_imports_successful = True
    
    for module_name, functions in modules_to_test:
        try:
            print(f"   📦 Testing {module_name}...")
            module = __import__(module_name)
            
            # Test specific functions
            missing_functions = []
            for func_name in functions:
                if not hasattr(module, func_name):
                    missing_functions.append(func_name)
            
            if missing_functions:
                print(f"      ⚠️  Missing functions: {', '.join(missing_functions)}")
                all_imports_successful = False
            else:
                print(f"      ✅ All functions found")
                
        except ImportError as e:
            print(f"      ❌ Import error: {e}")
            all_imports_successful = False
        except Exception as e:
            print(f"      ❌ Unexpected error: {e}")
            all_imports_successful = False
    
    # Test file structure
    print("\n🔍 Testing file structure...")
    current_dir = Path(__file__).parent
    
    required_files = [
        'main_vietnamese_analyzer.py',
        'data_extractor.py',
        'data_analyzer.py',
        'file_output.py',
        'report_generator.py',
        'console_output.py',
        'run_analyzer.bat',
        '__init__.py',
        'README.md'
    ]
    
    missing_files = []
    for filename in required_files:
        file_path = current_dir / filename
        if file_path.exists():
            print(f"   ✅ {filename}")
        else:
            print(f"   ❌ {filename} - NOT FOUND")
            missing_files.append(filename)
            all_imports_successful = False
    
    # Test data directory structure
    print("\n🔍 Testing data directory structure...")
    scripts_dir = current_dir.parent.parent
    vietnamese_data_dir = scripts_dir / "data" / "vietnamese_generated"
    
    print(f"   Expected Vietnamese data directory: {vietnamese_data_dir}")
    
    if vietnamese_data_dir.exists():
        print(f"   ✅ Vietnamese data directory found")
        
        # Check for Vietnamese vocabulary files
        found_files = 0
        for i in range(1, 8):
            file_path = vietnamese_data_dir / f"vietnamese_raw_{i}.json"
            if file_path.exists():
                found_files += 1
                print(f"   ✅ vietnamese_raw_{i}.json")
            else:
                print(f"   ⚠️  vietnamese_raw_{i}.json - NOT FOUND")
        
        if found_files > 0:
            print(f"   📊 {found_files}/7 Vietnamese vocabulary files found")
        else:
            print(f"   ⚠️  No Vietnamese vocabulary files found")
            
    else:
        print(f"   ⚠️  Vietnamese data directory not found")
        print(f"   💡 This is expected if you haven't generated Vietnamese data yet")
    
    # Test output directory
    print("\n🔍 Testing output directory setup...")
    output_dir = scripts_dir / "analysis_output"
    if not output_dir.exists():
        try:
            output_dir.mkdir(parents=True, exist_ok=True)
            print(f"   ✅ Created output directory: {output_dir}")
        except Exception as e:
            print(f"   ❌ Could not create output directory: {e}")
            all_imports_successful = False
    else:
        print(f"   ✅ Output directory exists: {output_dir}")
    
    # Final summary
    print("\n" + "=" * 50)
    if all_imports_successful:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Vietnamese Vocabulary Analyzer is ready to use")
        print("\nNext steps:")
        print("1. Ensure Vietnamese vocabulary data files are in place")
        print("2. Run the main analyzer: python main_vietnamese_analyzer.py")
        print("3. Or use the batch file: run_analyzer.bat")
    else:
        print("❌ SOME TESTS FAILED!")
        print("Please fix the issues above before running the main analyzer")
        
        if missing_files:
            print(f"\nMissing files: {', '.join(missing_files)}")
        
        print("\nTroubleshooting:")
        print("- Make sure all Python files are in the same directory")
        print("- Check that Vietnamese data files exist")
        print("- Verify Python path and module imports")
    
    return all_imports_successful

def test_vietnamese_encoding():
    """Test Vietnamese character encoding support."""
    
    print("\n🔍 Testing Vietnamese character encoding...")
    
    test_vietnamese_text = [
        "xin chào",      # Basic greeting
        "cảm ơn",        # Thank you
        "tôi là",        # I am
        "rất vui",       # Very happy
        "học sinh",      # Student
        "giáo viên",     # Teacher
        "Việt Nam",      # Vietnam
        "tiếng Việt",    # Vietnamese language
        "Hà Nội",        # Hanoi
        "Thành phố Hồ Chí Minh"  # Ho Chi Minh City
    ]
    
    encoding_test_passed = True
    
    for i, text in enumerate(test_vietnamese_text, 1):
        try:
            # Test encoding/decoding
            encoded = text.encode('utf-8')
            decoded = encoded.decode('utf-8')
            
            if text == decoded:
                print(f"   ✅ Test {i}: {text}")
            else:
                print(f"   ❌ Test {i}: Encoding mismatch for {text}")
                encoding_test_passed = False
                
        except Exception as e:
            print(f"   ❌ Test {i}: Error with {text} - {e}")
            encoding_test_passed = False
    
    if encoding_test_passed:
        print("   ✅ Vietnamese character encoding test passed")
    else:
        print("   ❌ Vietnamese character encoding test failed")
        print("   💡 Make sure your system supports UTF-8 encoding")
    
    return encoding_test_passed

if __name__ == "__main__":
    print("Starting Vietnamese Vocabulary Analyzer validation...\n")
    
    import_success = test_imports()
    encoding_success = test_vietnamese_encoding()
    
    if import_success and encoding_success:
        print(f"\n🎉 Vietnamese Vocabulary Analyzer is fully ready!")
        sys.exit(0)
    else:
        print(f"\n❌ Please fix the issues above before using the analyzer")
        sys.exit(1)
