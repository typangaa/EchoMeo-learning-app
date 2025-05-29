#!/usr/bin/env python3
"""
Statistics and console output utilities for HSK vocabulary analysis.
Handles printing detailed statistics and console reporting.
"""

def print_detailed_statistics(analysis, all_results, dataset_name):
    """Print comprehensive statistics to console for a dataset."""
    
    print(f"\n{'='*60}")
    print(f"📊 {dataset_name.upper()} DATASET ANALYSIS")
    print(f"{'='*60}")
    
    # File processing summary
    successful_files = [r for r in all_results if r['success']]
    failed_files = [r for r in all_results if not r['success']]
    
    print(f"\n📁 FILE PROCESSING SUMMARY:")
    print(f"   Successfully processed: {len(successful_files)}/7 files")
    if failed_files:
        print(f"   Failed files:")
        for result in failed_files:
            print(f"      HSK {result['hsk_level']}: {result['error']}")
    
    # Word count summary
    print(f"\n📈 WORD COUNT SUMMARY:")
    print(f"   Total words found: {analysis['total_words']:,}")
    print(f"   Unique words: {analysis['unique_words']:,}")
    print(f"   Duplicate words across levels: {analysis['duplicate_count']:,}")
    print(f"   Single characters: {len(analysis['single_characters']):,}")
    print(f"   Compound words: {len(analysis['compound_words']):,}")
    
    # Level breakdown
    print(f"\n📚 HSK LEVEL BREAKDOWN:")
    total_across_levels = 0
    for level in sorted(analysis['level_statistics'].keys()):
        stats = analysis['level_statistics'][level]
        total_across_levels += stats['count']
        print(f"   HSK {level}: {stats['count']:,} words")
    
    print(f"   Total (with duplicates): {total_across_levels:,}")
    
    # Word length analysis
    print(f"\n📏 WORD LENGTH DISTRIBUTION:")
    for length in sorted(analysis['word_length_distribution'].keys()):
        count = analysis['word_length_distribution'][length]
        percentage = (count / analysis['unique_words']) * 100
        print(f"   {length} character(s): {count:,} words ({percentage:.1f}%)")
    
    # Character analysis
    print(f"\n🔤 CHARACTER ANALYSIS:")
    print(f"   Unique characters used: {analysis['unique_characters_count']:,}")
    print(f"   Most common characters:")
    for char, count in analysis['character_frequency'].most_common(10):
        percentage = (count / sum(analysis['character_frequency'].values())) * 100
        print(f"      {char}: {count:,} times ({percentage:.1f}%)")
    
    # Duplicate analysis
    if analysis['duplicate_count'] > 0:
        print(f"\n🔄 DUPLICATE WORDS ANALYSIS:")
        print(f"   Words appearing in multiple HSK levels: {analysis['duplicate_count']:,}")
        print(f"   Examples (first 10):")
        
        duplicate_examples = list(analysis['duplicate_words'].items())[:10]
        for word, levels in duplicate_examples:
            levels_str = ", ".join([f"HSK{l}" for l in levels])
            print(f"      {word}: {levels_str}")
        
        if len(analysis['duplicate_words']) > 10:
            remaining = len(analysis['duplicate_words']) - 10
            print(f"      ... and {remaining} more")

def print_comparison_statistics(comparison_data):
    """Print comprehensive comparison statistics to console."""
    
    print(f"\n{'='*60}")
    print(f"📊 DATASET COMPARISON ANALYSIS")
    print(f"{'='*60}")
    
    overall = comparison_data['overall_comparison']
    
    print(f"\n📈 OVERALL COMPARISON:")
    print(f"   Exclusive dataset: {overall['exclusive_total_unique']:,} unique words")
    print(f"   Inclusive dataset: {overall['inclusive_total_unique']:,} unique words")
    print(f"   Common words: {overall['common_words_count']:,}")
    print(f"   Exclusive only: {overall['exclusive_only_count']:,}")
    print(f"   Inclusive only: {overall['inclusive_only_count']:,}")
    print(f"   Total combined unique: {overall['total_combined_unique']:,}")
    print(f"   Overall overlap: {overall['overlap_percentage']:.1f}%")
    
    print(f"\n📚 LEVEL-BY-LEVEL COMPARISON:")
    print(f"   Level | Exclusive | Inclusive | Common | Overlap %")
    print(f"   ------|-----------|-----------|--------|----------")
    
    for level in range(1, 8):
        level_data = comparison_data['level_by_level_comparison'].get(level, {})
        if level_data:
            print(f"   HSK {level} | {level_data['exclusive_count']:>9} | {level_data['inclusive_count']:>9} | {level_data['common_count']:>6} | {level_data['overlap_percentage']:>6.1f}%")
    
    print(f"\n🔤 CHARACTER ANALYSIS:")
    char_data = comparison_data['character_analysis']
    print(f"   Exclusive unique characters: {char_data['exclusive_unique_chars']:,}")
    print(f"   Inclusive unique characters: {char_data['inclusive_unique_chars']:,}")
    print(f"   Common characters: {char_data['common_chars_count']:,}")
    print(f"   Exclusive only characters: {char_data['exclusive_only_chars_count']:,}")
    print(f"   Inclusive only characters: {char_data['inclusive_only_chars_count']:,}")

def print_final_summary(exclusive_analysis, inclusive_analysis, comparison_data):
    """Print final comprehensive summary."""
    
    print(f"\n{'='*60}")
    print(f"🎉 HSK RAW DATA ANALYSIS COMPLETED!")
    print(f"{'='*60}")
    
    print(f"\n📊 FINAL SUMMARY:")
    print(f"   📁 Datasets processed: 2 (Exclusive & Inclusive)")
    print(f"   📚 Total HSK levels: 7 (HSK 1-7)")
    
    # Exclusive dataset summary
    exclusive_successful = len([r for r in exclusive_analysis.get('source_results', []) if r.get('success', False)])
    print(f"\n   🎯 EXCLUSIVE DATASET:")
    print(f"      • Files processed: {exclusive_successful}/7")
    print(f"      • Unique words: {exclusive_analysis['unique_words']:,}")
    print(f"      • Total words (with duplicates): {exclusive_analysis['total_words']:,}")
    print(f"      • Unique characters: {exclusive_analysis['unique_characters_count']:,}")
    
    # Inclusive dataset summary
    inclusive_successful = len([r for r in inclusive_analysis.get('source_results', []) if r.get('success', False)])
    print(f"\n   🎯 INCLUSIVE DATASET:")
    print(f"      • Files processed: {inclusive_successful}/7")
    print(f"      • Unique words: {inclusive_analysis['unique_words']:,}")
    print(f"      • Total words (with duplicates): {inclusive_analysis['total_words']:,}")
    print(f"      • Unique characters: {inclusive_analysis['unique_characters_count']:,}")
    
    # Comparison summary
    overall = comparison_data['overall_comparison']
    print(f"\n   🔄 DATASET COMPARISON:")
    print(f"      • Total combined unique words: {overall['total_combined_unique']:,}")
    print(f"      • Common words between datasets: {overall['common_words_count']:,}")
    print(f"      • Overall overlap percentage: {overall['overlap_percentage']:.1f}%")
    print(f"      • Words only in exclusive: {overall['exclusive_only_count']:,}")
    print(f"      • Words only in inclusive: {overall['inclusive_only_count']:,}")

def print_output_locations(base_output_dir):
    """Print information about where output files are located."""
    
    print(f"\n📁 OUTPUT LOCATIONS:")
    print(f"   Main directory: {base_output_dir}")
    
    exclusive_dir = base_output_dir / "exclusive_analysis"
    inclusive_dir = base_output_dir / "inclusive_analysis"
    
    print(f"\n   📂 EXCLUSIVE DATASET FILES:")
    print(f"      • Main analysis: {exclusive_dir}")
    print(f"      • Level reports: {exclusive_dir / 'level_reports'}")
    print(f"      • Key files:")
    print(f"        - hsk_all_levels_exclusive_complete.json")
    print(f"        - hsk_unique_words_exclusive.json")
    print(f"        - hsk_unique_words_exclusive.txt")
    print(f"        - hsk_word_analysis_exclusive.csv")
    
    print(f"\n   📂 INCLUSIVE DATASET FILES:")
    print(f"      • Main analysis: {inclusive_dir}")
    print(f"      • Level reports: {inclusive_dir / 'level_reports'}")
    print(f"      • Key files:")
    print(f"        - hsk_all_levels_inclusive_complete.json")
    print(f"        - hsk_unique_words_inclusive.json")
    print(f"        - hsk_unique_words_inclusive.txt")
    print(f"        - hsk_word_analysis_inclusive.csv")
    
    print(f"\n   📂 COMPARISON FILES:")
    print(f"      • Location: {base_output_dir}")
    print(f"      • Key files:")
    print(f"        - hsk_exclusive_vs_inclusive_comparison.json")
    print(f"        - hsk_comparison_summary.txt")
    print(f"        - hsk_level_comparison.csv")
    
    print(f"\n   📋 INDIVIDUAL LEVEL REPORTS:")
    print(f"      • For each HSK level (1-7) and each dataset:")
    print(f"        - hsk_level_X_[dataset]_analysis.json")
    print(f"        - hsk_level_X_[dataset]_summary.txt")
    print(f"        - hsk_level_X_[dataset]_words.csv")

def print_usage_recommendations():
    """Print recommendations for using the generated reports."""
    
    print(f"\n💡 USAGE RECOMMENDATIONS:")
    print(f"   📊 For quick overview:")
    print(f"      • Check hsk_comparison_summary.txt")
    print(f"      • Review console output above")
    
    print(f"\n   📈 For detailed analysis:")
    print(f"      • Use hsk_exclusive_vs_inclusive_comparison.json")
    print(f"      • Examine individual level analysis files")
    
    print(f"\n   🔧 For development:")
    print(f"      • Use hsk_unique_words_[dataset].json for app integration")
    print(f"      • CSV files for data processing and statistics")
    
    print(f"\n   📚 For learning insights:")
    print(f"      • Individual level summary.txt files")
    print(f"      • Learning recommendations in analysis.json files")
    
    print(f"\n   🎯 For dataset selection:")
    if True:  # This would be determined by actual comparison results
        print(f"      • Check overall overlap percentage in comparison")
        print(f"      • Review level-by-level differences")
        print(f"      • Consider combining datasets if overlap is low")

def print_error_summary(all_exclusive_results, all_inclusive_results):
    """Print summary of any errors encountered during processing."""
    
    exclusive_errors = [r for r in all_exclusive_results if not r['success']]
    inclusive_errors = [r for r in all_inclusive_results if not r['success']]
    
    if exclusive_errors or inclusive_errors:
        print(f"\n⚠️  ERROR SUMMARY:")
        
        if exclusive_errors:
            print(f"   📂 EXCLUSIVE DATASET ERRORS:")
            for error in exclusive_errors:
                print(f"      • HSK {error['hsk_level']}: {error['error']}")
        
        if inclusive_errors:
            print(f"   📂 INCLUSIVE DATASET ERRORS:")
            for error in inclusive_errors:
                print(f"      • HSK {error['hsk_level']}: {error['error']}")
        
        print(f"\n   💡 Note: Only successfully processed files were included in the analysis.")
    else:
        print(f"\n✅ No errors encountered during processing!")
