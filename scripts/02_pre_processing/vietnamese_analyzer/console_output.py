#!/usr/bin/env python3
"""
Console output module for Vietnamese vocabulary analysis.
Handles printing detailed statistics and summaries to console.
"""

def print_detailed_statistics(analysis, all_results):
    """Print comprehensive statistics to console."""
    
    print(f"\n{'='*60}")
    print(f"📊 COMPREHENSIVE VIETNAMESE VOCABULARY ANALYSIS")
    print(f"{'='*60}")
    
    # File processing summary
    successful_files = [r for r in all_results if r['success']]
    failed_files = [r for r in all_results if not r['success']]
    
    print(f"\n📁 FILE PROCESSING SUMMARY:")
    print(f"   Successfully processed: {len(successful_files)}/7 files")
    if failed_files:
        print(f"   Failed files:")
        for result in failed_files:
            print(f"      File {result['file_number']}: {result['error']}")
    
    # Vocabulary summary
    print(f"\n📈 VOCABULARY SUMMARY:")
    print(f"   Total vocabulary items: {analysis['total_vocabulary']:,}")
    print(f"   Unique words: {analysis['unique_words']:,}")
    print(f"   Duplicate entries: {analysis['duplicate_count']:,}")
    
    # Etymology analysis
    etymology = analysis['etymology_analysis']
    print(f"\n🏛️ ETYMOLOGY ANALYSIS:")
    for origin, count in etymology['etymology_distribution'].items():
        percentage = (count / analysis['total_vocabulary']) * 100
        print(f"   {origin.replace('_', ' ').title()}: {count:,} ({percentage:.1f}%)")
    
    # Chinese learner insights
    learning = analysis['learning_analysis']
    sino_ratio = learning['chinese_learner_insights']['sino_vietnamese_ratio']
    print(f"\n🇨🇳 CHINESE LEARNER INSIGHTS:")
    print(f"   Sino-Vietnamese words: {learning['chinese_learner_insights']['sino_vietnamese_count']:,} ({sino_ratio:.1%})")
    print(f"   Native Vietnamese words: {learning['chinese_learner_insights']['native_vietnamese_count']:,} ({1-sino_ratio:.1%})")
    print(f"   Learning approach: {'Leverage Chinese knowledge' if sino_ratio > 0.5 else 'Mixed approach recommended'}")
    
    # Tone analysis
    tone = analysis['tone_analysis']
    print(f"\n🎵 TONE PATTERN ANALYSIS:")
    for tone_pattern, count in sorted(tone['tone_distribution'].items(), key=lambda x: x[1], reverse=True)[:10]:
        percentage = (count / analysis['total_vocabulary']) * 100
        print(f"   {tone_pattern}: {count:,} ({percentage:.1f}%)")
    
    # Learning difficulty distribution
    print(f"\n📚 LEARNING DIFFICULTY DISTRIBUTION:")
    for level, items in learning['learning_categories'].items():
        percentage = (len(items) / analysis['total_vocabulary']) * 100
        print(f"   {level.title()}: {len(items):,} ({percentage:.1f}%)")
    
    # Frequency analysis
    frequency = analysis['frequency_analysis']
    print(f"\n📊 FREQUENCY DISTRIBUTION:")
    for freq_range, count in frequency['frequency_ranges'].items():
        percentage = (count / analysis['total_vocabulary']) * 100
        print(f"   {freq_range.replace('_', ' ').title()}: {count:,} ({percentage:.1f}%)")
    
    # Syllable analysis
    syllable = analysis['syllable_analysis']
    print(f"\n🔤 SYLLABLE STRUCTURE ANALYSIS:")
    print(f"   Average syllables per word: {syllable['average_syllables']:.2f}")
    for syl_count, count in sorted(syllable['syllable_distribution'].items())[:5]:
        percentage = (count / analysis['total_vocabulary']) * 100
        print(f"   {syl_count} syllable(s): {count:,} ({percentage:.1f}%)")
    
    # POS analysis
    pos = analysis['pos_analysis']
    print(f"\n📝 PART-OF-SPEECH DISTRIBUTION:")
    total_pos_counts = sum(pos['pos_distribution'].values())
    for pos_type, count in sorted(pos['pos_distribution'].items(), key=lambda x: x[1], reverse=True)[:10]:
        percentage = (count / total_pos_counts) * 100
        print(f"   {pos_type}: {count:,} ({percentage:.1f}%)")
    
    # Regional variants
    regional = analysis['regional_analysis']
    print(f"\n🗺️ REGIONAL VARIANT ANALYSIS:")
    for region_pair, count in regional['regional_differences'].items():
        print(f"   {region_pair.replace('_', '-').title()} differences: {count:,}")

def print_final_summary(analysis):
    """Print final summary with key insights."""
    
    print(f"\n{'='*60}")
    print(f"🎉 VIETNAMESE VOCABULARY ANALYSIS COMPLETED!")
    print(f"{'='*60}")
    
    learning = analysis['learning_analysis']
    sino_ratio = learning['chinese_learner_insights']['sino_vietnamese_ratio']
    
    print(f"📊 Key Results:")
    print(f"   • {analysis['unique_words']:,} unique Vietnamese words analyzed")
    print(f"   • {analysis['total_vocabulary']:,} total vocabulary items processed")
    print(f"   • {sino_ratio:.1%} Sino-Vietnamese words (great for Chinese learners!)")
    print(f"   • {len(learning['learning_categories']['beginner']):,} beginner-friendly words")
    
    print(f"\n💡 Learning Recommendations:")
    if sino_ratio > 0.6:
        print(f"   • High Sino-Vietnamese content - leverage your Chinese knowledge")
        print(f"   • Focus on character-meaning connections")
        print(f"   • Study Chu Nom characters for deeper understanding")
    elif sino_ratio > 0.3:
        print(f"   • Balanced approach - learn both Sino-Vietnamese and native patterns")
        print(f"   • Group words by etymology for efficient learning")
    else:
        print(f"   • Focus on native Vietnamese patterns and sounds")
        print(f"   • Pay special attention to tone patterns")
    
    # Top study priorities
    frequency = analysis['frequency_analysis']
    high_freq_count = frequency['frequency_ranges']['very_high'] + frequency['frequency_ranges']['high']
    print(f"   • Prioritize {high_freq_count:,} high-frequency words for immediate impact")
    
    print(f"\n🚀 Next Steps:")
    print(f"   • Use generated word lists for vocabulary practice")
    print(f"   • Integrate Sino-Vietnamese words with Chinese character study")
    print(f"   • Focus on beginner words for quick progress")
    print(f"   • Practice tone patterns systematically")

def print_output_locations(output_dir):
    """Print information about output file locations."""
    
    print(f"\n📁 OUTPUT FILES CREATED:")
    print(f"   Main directory: {output_dir}")
    print(f"\n   📄 For App Integration:")
    print(f"      • vietnamese_words_list.json - Clean word list for React app")
    print(f"      • vietnamese_learning_data.json - Learning-focused data")
    
    print(f"\n   📊 For Analysis:")
    print(f"      • vietnamese_vocabulary_complete.json - Complete analysis")
    print(f"      • vietnamese_vocabulary_analysis.csv - Detailed data for Excel")
    print(f"      • vietnamese_learning_categories.csv - Learning difficulty data")
    
    print(f"\n   📚 For Study:")
    print(f"      • vietnamese_analysis_summary.txt - Human-readable summary")
    print(f"      • vietnamese_words_beginner.txt - Beginner word list")
    print(f"      • vietnamese_words_intermediate.txt - Intermediate word list")
    print(f"      • vietnamese_words_advanced.txt - Advanced word list")
    print(f"      • vietnamese_sino_vietnamese_words.txt - Chinese-origin words")

def print_usage_recommendations():
    """Print recommendations for using the analysis results."""
    
    print(f"\n🎯 USAGE RECOMMENDATIONS:")
    print(f"\n   For Vietnamese-Chinese Learning App:")
    print(f"      • Import vietnamese_words_list.json for vocabulary data")
    print(f"      • Use learning categories for difficulty grading")
    print(f"      • Prioritize Sino-Vietnamese words for Chinese speakers")
    print(f"      • Implement tone pattern practice based on frequency data")
    
    print(f"\n   For Curriculum Development:")
    print(f"      • Start with beginner-level high-frequency words")
    print(f"      • Group Sino-Vietnamese words with Chinese character lessons")
    print(f"      • Use regional variant data for pronunciation training")
    print(f"      • Apply frequency data for spaced repetition scheduling")
    
    print(f"\n   For Research & Analysis:")
    print(f"      • Use CSV files for statistical analysis")
    print(f"      • Reference etymology data for linguistic research")
    print(f"      • Analyze tone patterns for phonetic studies")

def print_error_summary(all_results):
    """Print summary of any errors encountered."""
    
    failed_results = [r for r in all_results if not r['success']]
    
    if failed_results:
        print(f"\n⚠️  ERROR SUMMARY:")
        print(f"   {len(failed_results)} file(s) could not be processed:")
        
        for result in failed_results:
            print(f"      File {result['file_number']}: {result['error']}")
        
        print(f"\n   💡 Troubleshooting Tips:")
        print(f"      • Check that JSON files are valid UTF-8 encoded")
        print(f"      • Verify Vietnamese data structure matches expected format")
        print(f"      • Ensure 'vietnamese' field exists in all vocabulary items")
    else:
        print(f"\n✅ All files processed successfully - no errors encountered!")
