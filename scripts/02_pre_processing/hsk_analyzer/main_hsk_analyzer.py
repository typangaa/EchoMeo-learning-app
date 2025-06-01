#!/usr/bin/env python3
"""
Main HSK Vocabulary Analyzer
Processes both exclusive and inclusive HSK datasets and provides comprehensive analysis.
Updated for specific Windows path structure.
"""

import sys
from pathlib import Path
from datetime import datetime

# Import our modularized components
from data_extractor import process_dataset, get_dataset_paths, print_data_structure_info, validate_data_structure
from data_analyzer import analyze_combined_data, compare_datasets
from file_output import (
    create_comprehensive_output, 
    create_comparison_report
)
from report_generator import create_individual_level_reports
from console_output import (
    print_detailed_statistics, 
    print_comparison_statistics,
    print_final_summary,
    print_output_locations,
    print_usage_recommendations,
    print_error_summary
)

def validate_environment():
    """Validate that all required directories and files exist."""
    
    # Updated path for your specific directory structure
    # The script is in: C:\...\scripts\02_hsk_processing\hsk_analyzer
    # The data is in: C:\...\scripts\data\raw\{exclusive,inclusive}
    script_dir = Path(__file__).parent  # hsk_analyzer directory
    base_scripts_dir = script_dir.parent.parent  # Go up to scripts directory
    
    print("🔍 Validating environment...")
    print(f"Script running from: {script_dir}")
    print(f"Base scripts directory: {base_scripts_dir}")
    
    # Print detailed data structure info
    validation = print_data_structure_info(base_scripts_dir)
    
    exclusive_dir, inclusive_dir = get_dataset_paths(base_scripts_dir)
    
    # Check if we can proceed
    if not validation['valid']:
        return False, None, None
    
    # Count available files
    exclusive_files = sum(1 for level, info in validation['exclusive_files'].items() if info['exists'])
    inclusive_files = sum(1 for level, info in validation['inclusive_files'].items() if info['exists'])
    
    if exclusive_files == 0 and inclusive_files == 0:
        print("❌ No HSK data files found in either dataset!")
        return False, None, None
    
    if exclusive_files == 0:
        print("⚠️  No exclusive dataset files found - will process inclusive only")
    
    if inclusive_files == 0:
        print("⚠️  No inclusive dataset files found - will process exclusive only")
    
    print("✅ Environment validation completed")
    return True, exclusive_dir, inclusive_dir

def setup_output_directories(base_scripts_dir):
    """Create necessary output directories."""
    
    print("📁 Setting up output directories...")
    
    # Create output in the scripts/analysis_output directory
    base_output_dir = base_scripts_dir / "analysis_output" / "hsk_comprehensive"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    timestamped_output = base_output_dir / f"hsk_analysis_{timestamp}"
    
    # Main output directory
    timestamped_output.mkdir(parents=True, exist_ok=True)
    
    # Dataset-specific directories
    exclusive_output = timestamped_output / "exclusive_analysis"
    inclusive_output = timestamped_output / "inclusive_analysis"
    
    exclusive_output.mkdir(exist_ok=True)
    inclusive_output.mkdir(exist_ok=True)
    
    print(f"   ✅ Main output: {timestamped_output}")
    print(f"   ✅ Exclusive analysis: {exclusive_output}")
    print(f"   ✅ Inclusive analysis: {inclusive_output}")
    
    return timestamped_output, exclusive_output, inclusive_output

def process_single_dataset(dataset_name, data_dir, output_dir):
    """Process a single dataset (exclusive or inclusive)."""
    
    print(f"\n{'='*60}")
    print(f"🔄 PROCESSING {dataset_name.upper()} DATASET")
    print(f"{'='*60}")
    
    # Check if dataset directory has any files
    has_files = any((data_dir / f"{level}.json").exists() for level in range(1, 8))
    
    if not has_files:
        print(f"⚠️  No files found in {dataset_name} dataset directory: {data_dir}")
        return None, []
    
    # Extract data from all HSK levels
    all_results = process_dataset(data_dir, dataset_name)
    
    # Check if we got any successful results
    successful_results = [r for r in all_results if r['success']]
    if not successful_results:
        print(f"⚠️  No successful extractions from {dataset_name} dataset")
        return None, all_results
    
    # Analyze combined data
    print(f"\n🔍 Analyzing {dataset_name} dataset...")
    analysis = analyze_combined_data(all_results)
    analysis['source_results'] = all_results  # Keep track of source results
    
    # Create comprehensive output files
    print(f"\n📄 Creating {dataset_name} output files...")
    create_comprehensive_output(analysis, output_dir, all_results, dataset_name)
    
    # Create individual level reports
    create_individual_level_reports(analysis, output_dir, all_results, dataset_name)
    
    # Print statistics to console
    print_detailed_statistics(analysis, all_results, dataset_name)
    
    return analysis, all_results

def main():
    """Main function to process both datasets and create comparison."""
    
    print("HSK VOCABULARY COMPREHENSIVE ANALYZER")
    print("="*60)
    print("Processing both Exclusive and Inclusive HSK datasets")
    print("Analyzing HSK levels 1-7 with comprehensive comparison")
    print()
    
    # Validate environment
    env_valid, exclusive_dir, inclusive_dir = validate_environment()
    if not env_valid:
        print("\n❌ Environment validation failed. Please check your data directories and files.")
        sys.exit(1)
    
    # Setup output directories
    script_dir = Path(__file__).parent  # hsk_analyzer directory
    base_scripts_dir = script_dir.parent.parent  # Go up to scripts directory
    timestamped_output, exclusive_output, inclusive_output = setup_output_directories(base_scripts_dir)
    
    try:
        # Process datasets
        exclusive_analysis = None
        inclusive_analysis = None
        exclusive_results = []
        inclusive_results = []
        
        # Process Exclusive Dataset (if available)
        if exclusive_dir.exists():
            result = process_single_dataset("exclusive", exclusive_dir, exclusive_output)
            if result[0] is not None:  # If analysis was successful
                exclusive_analysis, exclusive_results = result
        
        # Process Inclusive Dataset (if available)
        if inclusive_dir.exists():
            result = process_single_dataset("inclusive", inclusive_dir, inclusive_output)
            if result[0] is not None:  # If analysis was successful
                inclusive_analysis, inclusive_results = result
        
        # Check if we have at least one successful analysis
        if exclusive_analysis is None and inclusive_analysis is None:
            print("\n❌ No datasets could be processed successfully!")
            sys.exit(1)
        
        # Compare datasets (only if we have both)
        if exclusive_analysis is not None and inclusive_analysis is not None:
            print(f"\n{'='*60}")
            print(f"🔄 COMPARING EXCLUSIVE VS INCLUSIVE DATASETS")
            print(f"{'='*60}")
            
            print("\n🔍 Performing comprehensive dataset comparison...")
            comparison_data = compare_datasets(exclusive_analysis, inclusive_analysis)
            
            # Create comparison reports
            print("\n📄 Creating comparison reports...")
            create_comparison_report(comparison_data, timestamped_output)
            
            # Print comparison statistics
            print_comparison_statistics(comparison_data)
            
            # Print final comprehensive summary
            print_final_summary(exclusive_analysis, inclusive_analysis, comparison_data)
        else:
            print("\n⚠️  Only one dataset was processed - skipping comparison")
            if exclusive_analysis:
                print("✅ Exclusive dataset processed successfully")
            if inclusive_analysis:
                print("✅ Inclusive dataset processed successfully")
        
        # Print output locations and usage recommendations
        print_output_locations(timestamped_output)
        print_usage_recommendations()
        
        # Print error summary if any
        print_error_summary(exclusive_results, inclusive_results)
        
        print(f"\n🎉 ANALYSIS COMPLETED SUCCESSFULLY!")
        print(f"📁 All results saved to: {timestamped_output}")
        
    except Exception as e:
        print(f"\n❌ Error during processing: {e}")
        print("Please check the error details above and ensure all data files are properly formatted.")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
