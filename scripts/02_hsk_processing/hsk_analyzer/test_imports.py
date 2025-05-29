#!/usr/bin/env python3
"""
Test script to check if all imports work correctly.
"""

print("Testing imports...")

try:
    from data_extractor import process_dataset, get_dataset_paths
    print("✅ data_extractor imports OK")
except ImportError as e:
    print(f"❌ data_extractor import failed: {e}")

try:
    from data_analyzer import analyze_combined_data, compare_datasets
    print("✅ data_analyzer imports OK")
except ImportError as e:
    print(f"❌ data_analyzer import failed: {e}")

try:
    from file_output import create_comprehensive_output, create_comparison_report
    print("✅ file_output imports OK")
except ImportError as e:
    print(f"❌ file_output import failed: {e}")

try:
    from report_generator import create_individual_level_reports
    print("✅ report_generator imports OK")
except ImportError as e:
    print(f"❌ report_generator import failed: {e}")

try:
    from console_output import print_detailed_statistics
    print("✅ console_output imports OK")
except ImportError as e:
    print(f"❌ console_output import failed: {e}")

print("\nAll import tests completed!")
