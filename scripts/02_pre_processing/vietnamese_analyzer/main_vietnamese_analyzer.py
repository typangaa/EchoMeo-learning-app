#!/usr/bin/env python3
"""
Main Vietnamese Vocabulary Analyzer
Processes Vietnamese vocabulary datasets and provides comprehensive linguistic analysis.
Updated for specific Windows path structure.
"""

import sys
from pathlib import Path
from datetime import datetime

# Import our modularized components
from data_extractor import process_dataset, get_dataset_path, print_data_structure_info, validate_data_structure
from data_analyzer import analyze_combined_data
from file_output import create_comprehensive_output
from report_generator import create_individual_file_reports
from console_output import (
    print_detailed_statistics,
    print_final_summary,
    print_output_locations,
    print_usage_recommendations,
    print_error_summary
)
from collections import defaultdict, Counter

def validate_environment():
    """Validate that all required directories and files exist."""
    
    # Updated path for your specific directory structure
    # The script is in: C:\...\scripts\02_pre_processing\vietnamese_analyzer
    # The data is in: C:\...\scripts\data\vietnamese_generated
    script_dir = Path(__file__).parent  # vietnamese_analyzer directory
    base_scripts_dir = script_dir.parent.parent  # Go up to scripts directory
    
    print("🔍 Validating environment...")
    print(f"Script running from: {script_dir}")
    print(f"Base scripts directory: {base_scripts_dir}")
    
    # Print detailed data structure info
    validation = print_data_structure_info(base_scripts_dir)
    
    data_dir = get_dataset_path(base_scripts_dir)
    
    # Check if we can proceed
    if not validation['valid']:
        return False, None
    
    # Count available files
    available_files = sum(1 for file_num, info in validation['files'].items() if info['exists'])
    
    if available_files == 0:
        print("❌ No Vietnamese vocabulary files found!")
        return False, None
    
    if available_files < 7:
        print(f"⚠️  Only {available_files}/7 vocabulary files found - will process available files")
    
    print("✅ Environment validation completed")
    return True, data_dir

def setup_output_directories(base_scripts_dir):
    """Create necessary output directories."""
    
    print("📁 Setting up output directories...")
    
    # Create output in the scripts/analysis_output directory
    base_output_dir = base_scripts_dir / "analysis_output" / "vietnamese_comprehensive"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    timestamped_output = base_output_dir / f"vietnamese_analysis_{timestamp}"
    
    # Main output directory
    timestamped_output.mkdir(parents=True, exist_ok=True)
    
    print(f"   ✅ Main output: {timestamped_output}")
    
    return timestamped_output

def main():
    """Main function to process Vietnamese vocabulary dataset and create analysis."""
    
    print("VIETNAMESE VOCABULARY COMPREHENSIVE ANALYZER")
    print("="*60)
    print("Processing Vietnamese vocabulary dataset for language learning")
    print("Analyzing linguistic patterns, etymology, tones, and learning recommendations")
    print()
    
    # Validate environment
    env_valid, data_dir = validate_environment()
    if not env_valid:
        print("\n❌ Environment validation failed. Please check your data directories and files.")
        sys.exit(1)
    
    # Setup output directories
    script_dir = Path(__file__).parent  # vietnamese_analyzer directory
    base_scripts_dir = script_dir.parent.parent  # Go up to scripts directory
    timestamped_output = setup_output_directories(base_scripts_dir)
    
    try:
        # Process Vietnamese vocabulary dataset
        print(f"\n{'='*60}")
        print(f"🔄 PROCESSING VIETNAMESE VOCABULARY DATASET")
        print(f"{'='*60}")
        
        # Extract data from all Vietnamese files
        all_results = process_dataset(data_dir)
        
        # Check if we got any successful results
        successful_results = [r for r in all_results if r['success']]
        if not successful_results:
            print(f"⚠️  No successful extractions from Vietnamese dataset")
            sys.exit(1)
        
        # Analyze combined data
        print(f"\n🔍 Analyzing Vietnamese vocabulary dataset...")
        analysis = analyze_combined_data(all_results)
        
        if 'error' in analysis:
            print(f"❌ Analysis failed: {analysis['error']}")
            sys.exit(1)
        
        analysis['source_results'] = all_results  # Keep track of source results
        
        # Create comprehensive output files
        print(f"\n📄 Creating Vietnamese vocabulary output files...")
        create_comprehensive_output(analysis, timestamped_output, all_results)
        
        # Create individual file reports
        create_individual_file_reports(analysis, timestamped_output, all_results)
        
        # Perform duplicate analysis and add to output
        print(f"\n🔍 Performing duplicate analysis...")
        duplicate_analysis = perform_duplicate_analysis(analysis, timestamped_output)
        analysis['duplicate_analysis'] = duplicate_analysis
        
        # Print statistics to console
        print_detailed_statistics(analysis, all_results)
        
        # Print final comprehensive summary
        print_final_summary(analysis)
        
        # Print output locations and usage recommendations
        print_output_locations(timestamped_output)
        print_usage_recommendations()
        
        # Print error summary if any
        print_error_summary(all_results)
        
        print(f"\n🎉 VIETNAMESE VOCABULARY ANALYSIS COMPLETED SUCCESSFULLY!")
        print(f"📁 All results saved to: {timestamped_output}")
        
    except Exception as e:
        print(f"\n❌ Error during processing: {e}")
        print("Please check the error details above and ensure all data files are properly formatted.")
        import traceback
        traceback.print_exc()
        sys.exit(1)

def perform_duplicate_analysis(analysis, output_dir):
    """Perform comprehensive duplicate analysis on Vietnamese vocabulary."""
    
    vocabulary_items = analysis.get('vocabulary_items', [])
    if not vocabulary_items:
        return {'error': 'No vocabulary items to analyze for duplicates'}
    
    # Categorize words by frequency levels (CEFR approximation)
    level_words = categorize_words_by_frequency(vocabulary_items)
    
    # Find duplicates within and across levels
    within_level_duplicates, cross_level_duplicates = find_duplicates_in_levels(level_words)
    
    # Generate duplicate reports
    generated_files = generate_duplicate_reports(within_level_duplicates, cross_level_duplicates, output_dir)
    
    # Generate master duplicate report
    master_report = generate_master_duplicate_report(within_level_duplicates, cross_level_duplicates, output_dir)
    
    # Create summary for main analysis
    total_within = sum(len(dups) for dups in within_level_duplicates.values())
    total_cross = len(cross_level_duplicates)
    
    duplicate_summary = {
        'within_level_duplicates': within_level_duplicates,
        'cross_level_duplicates': cross_level_duplicates,
        'summary': {
            'total_within_level_duplicates': total_within,
            'total_cross_level_duplicates': total_cross,
            'total_unique_duplicate_words': total_within + total_cross
        },
        'generated_files': generated_files + [master_report],
        'level_distribution': {level: len(words) for level, words in level_words.items()}
    }
    
    print(f"   ✅ Found {total_within} within-level and {total_cross} cross-level duplicates")
    return duplicate_summary

def categorize_words_by_frequency(vocabulary_items):
    """Categorize Vietnamese words by frequency into CEFR levels."""
    
    frequency_thresholds = {
        'A1': (80, 100),    # Very high frequency
        'A2': (60, 79),     # High frequency  
        'B1': (40, 59),     # Medium frequency
        'B2': (30, 39),     # Low-medium frequency
        'C1': (15, 29),     # Low frequency
        'C2': (0, 14)       # Very low frequency
    }
    
    level_words = defaultdict(list)
    
    for item in vocabulary_items:
        word = item.get('vietnamese', '')
        frequency = item.get('frequency', 0)
        
        if not word:
            continue
            
        # Find appropriate level
        assigned_level = 'C2'  # Default
        for level, (min_freq, max_freq) in frequency_thresholds.items():
            if min_freq <= frequency <= max_freq:
                assigned_level = level
                break
        
        level_words[assigned_level].append({
            'word': word,
            'frequency': frequency,
            'pos': item.get('pos', []),
            'item_data': item
        })
    
    return level_words

def find_duplicates_in_levels(level_words):
    """Find duplicate words within each level and across levels."""
    
    # Within-level duplicates
    within_level_duplicates = {}
    
    for level, words in level_words.items():
        word_counts = Counter(word_data['word'] for word_data in words)
        duplicates = [word for word, count in word_counts.items() if count > 1]
        
        if duplicates:
            within_level_duplicates[level] = []
            for word in duplicates:
                # Get all instances of this duplicate word
                instances = [wd for wd in words if wd['word'] == word]
                within_level_duplicates[level].append({
                    'word': word,
                    'count': len(instances),
                    'instances': instances
                })
    
    # Cross-level duplicates
    all_words = {}  # word -> [levels where it appears]
    for level, words in level_words.items():
        for word_data in words:
            word = word_data['word']
            if word not in all_words:
                all_words[word] = []
            all_words[word].append(level)
    
    cross_level_duplicates = {}
    for word, levels in all_words.items():
        if len(set(levels)) > 1:  # Appears in multiple levels
            cross_level_duplicates[word] = list(set(levels))
    
    return within_level_duplicates, cross_level_duplicates

def generate_duplicate_reports(within_level_duplicates, cross_level_duplicates, output_dir):
    """Generate detailed duplicate reports for each level."""
    
    generated_files = []
    
    # Generate within-level duplicate files
    for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
        filename = f"vietnamese_level_{level.lower()}_duplicates.txt"
        filepath = output_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"# Vietnamese Vocabulary - CEFR Level {level} Duplicates\n")
            f.write(f"# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            
            if level in within_level_duplicates:
                duplicates = within_level_duplicates[level]
                f.write(f"# Total duplicate words: {len(duplicates)}\n")
                f.write(f"# Frequency range: Level {level} words\n")
                f.write("\n")
                f.write("# Within-level duplicates (same word appears multiple times in this level):\n")
                
                for dup_info in duplicates:
                    word = dup_info['word']
                    count = dup_info['count']
                    frequencies = [inst['frequency'] for inst in dup_info['instances']]
                    f.write(f"{word}  # appears {count} times, frequencies: {frequencies}\n")
                
                f.write("\n")
            else:
                f.write(f"# Total duplicate words: 0\n")
                f.write(f"# Frequency range: Level {level} words\n")
                f.write("\n")
                f.write("# No within-level duplicates found\n")
            
            # Add cross-level information
            cross_level_words = [word for word, levels in cross_level_duplicates.items() if level in levels]
            if cross_level_words:
                f.write(f"\n# Cross-level duplicates (words that also appear in other levels):\n")
                for word in sorted(cross_level_words):
                    other_levels = [l for l in cross_level_duplicates[word] if l != level]
                    f.write(f"{word}  # also in levels: {', '.join(sorted(other_levels))}\n")
        
        generated_files.append(str(filepath))
        
        # Count duplicates for reporting
        within_count = len(within_level_duplicates.get(level, []))
        cross_count = len([word for word, levels in cross_level_duplicates.items() if level in levels])
        print(f"   📄 Generated {filename}: {within_count} within-level, {cross_count} cross-level duplicates")
    
    return generated_files

def generate_master_duplicate_report(within_level_duplicates, cross_level_duplicates, output_dir):
    """Generate a master report of all duplicates."""
    
    report_path = output_dir / "vietnamese_duplicates_master_report.txt"
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# Vietnamese Vocabulary Master Duplicates Report\n")
        f.write(f"# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("# This report shows all duplicate words found across the Vietnamese vocabulary dataset\n")
        f.write("\n")
        
        # Summary statistics
        total_within_duplicates = sum(len(dups) for dups in within_level_duplicates.values())
        total_cross_duplicates = len(cross_level_duplicates)
        
        f.write("="*60 + "\n")
        f.write("DUPLICATE ANALYSIS SUMMARY\n")
        f.write("="*60 + "\n")
        f.write(f"Within-level duplicates: {total_within_duplicates}\n")
        f.write(f"Cross-level duplicates: {total_cross_duplicates}\n")
        f.write(f"Total unique duplicate words: {total_within_duplicates + total_cross_duplicates}\n")
        f.write("\n")
        
        # Within-level duplicates by level
        f.write("WITHIN-LEVEL DUPLICATES BY LEVEL:\n")
        f.write("-" * 40 + "\n")
        for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
            if level in within_level_duplicates:
                count = len(within_level_duplicates[level])
                f.write(f"Level {level}: {count} duplicate words\n")
                for dup_info in within_level_duplicates[level]:
                    word = dup_info['word']
                    count = dup_info['count']
                    f.write(f"  - {word} (appears {count} times)\n")
            else:
                f.write(f"Level {level}: 0 duplicate words\n")
        f.write("\n")
        
        # Cross-level duplicates
        f.write("CROSS-LEVEL DUPLICATES:\n")
        f.write("-" * 40 + "\n")
        if cross_level_duplicates:
            for word, levels in sorted(cross_level_duplicates.items()):
                f.write(f"{word}: appears in levels {', '.join(sorted(levels))}\n")
        else:
            f.write("No cross-level duplicates found.\n")
        f.write("\n")
        
        # Recommendations
        f.write("RECOMMENDATIONS:\n")
        f.write("-" * 40 + "\n")
        f.write("1. Review within-level duplicates - these may indicate data entry errors\n")
        f.write("2. Evaluate cross-level duplicates - high frequency words may legitimately appear across levels\n")
        f.write("3. Consider frequency-based deduplication for cross-level words\n")
        f.write("4. Verify that duplicate entries have consistent definitions and metadata\n")
    
    print(f"   📄 Generated master report: {report_path.name}")
    return str(report_path)

if __name__ == "__main__":
    main()
