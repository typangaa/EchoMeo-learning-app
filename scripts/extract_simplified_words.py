#!/usr/bin/env python3
"""
Enhanced script to extract simplified Chinese characters from multiple HSK vocabulary JSON files.
Processes HSK levels 1-7 and provides comprehensive analysis.
"""

import json
import os
from pathlib import Path
from collections import Counter, defaultdict
import sys
from datetime import datetime

def extract_from_single_file(file_path, hsk_level):
    """
    Extract simplified characters from a single HSK level file.
    
    Args:
        file_path (str): Path to the JSON file
        hsk_level (int): HSK level number
        
    Returns:
        dict: Extraction results with words and metadata
    """
    result = {
        'hsk_level': hsk_level,
        'file_path': file_path,
        'simplified_words': [],
        'total_count': 0,
        'success': False,
        'error': None
    }
    
    try:
        if not os.path.exists(file_path):
            result['error'] = f"File not found: {file_path}"
            return result
            
        print(f"📖 Processing HSK {hsk_level}: {os.path.basename(file_path)}")
        
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        if not isinstance(data, list):
            result['error'] = f"Expected array, got {type(data)}"
            return result
        
        simplified_words = []
        valid_entries = 0
        
        for entry in data:
            if isinstance(entry, dict) and 'simplified' in entry:
                simplified_words.append(entry['simplified'])
                valid_entries += 1
        
        result['simplified_words'] = simplified_words
        result['total_count'] = len(simplified_words)
        result['valid_entries'] = valid_entries
        result['total_entries'] = len(data)
        result['success'] = True
        
        print(f"   ✅ {result['total_count']} words extracted from {result['total_entries']} entries")
        
        return result
        
    except json.JSONDecodeError as e:
        result['error'] = f"JSON parsing error: {e}"
        return result
    except Exception as e:
        result['error'] = f"Error: {e}"
        return result

def analyze_combined_data(all_results):
    """
    Analyze the combined data from all HSK levels.
    
    Args:
        all_results (list): List of extraction results from all files
        
    Returns:
        dict: Combined analysis results
    """
    
    # Combine all words with their HSK levels
    all_words_with_levels = []
    words_by_level = defaultdict(list)
    level_stats = {}
    
    for result in all_results:
        if result['success']:
            level = result['hsk_level']
            words = result['simplified_words']
            
            # Track words by level
            words_by_level[level] = words
            level_stats[level] = {
                'count': len(words),
                'file': os.path.basename(result['file_path'])
            }
            
            # Add to combined list
            for word in words:
                all_words_with_levels.append({
                    'word': word,
                    'hsk_level': level
                })
    
    # Combine all words
    all_words = [item['word'] for item in all_words_with_levels]
    
    # Find duplicates across levels
    word_occurrences = defaultdict(list)
    for item in all_words_with_levels:
        word_occurrences[item['word']].append(item['hsk_level'])
    
    # Separate unique and duplicate words
    unique_words = []
    duplicate_words = {}
    
    for word, levels in word_occurrences.items():
        if len(levels) == 1:
            unique_words.append(word)
        else:
            duplicate_words[word] = sorted(list(set(levels)))
    
    # Character analysis
    character_frequency = Counter()
    word_length_dist = Counter()
    single_chars = []
    compound_words = []
    
    for word in set(all_words):  # Use set to avoid counting duplicates
        # Word length analysis
        length = len(word)
        word_length_dist[length] += 1
        
        if length == 1:
            single_chars.append(word)
        else:
            compound_words.append(word)
        
        # Character frequency
        for char in word:
            character_frequency[char] += 1
    
    return {
        'total_words': len(all_words),
        'unique_words': len(set(all_words)),
        'unique_word_list': sorted(list(set(all_words))),
        'duplicate_count': len(duplicate_words),
        'duplicate_words': duplicate_words,
        'words_by_level': dict(words_by_level),
        'level_statistics': level_stats,
        'character_frequency': character_frequency,
        'word_length_distribution': dict(word_length_dist),
        'single_characters': sorted(single_chars),
        'compound_words': sorted(compound_words),
        'unique_characters_count': len(character_frequency)
    }

def create_comprehensive_output(analysis, output_dir, all_results):
    """Create comprehensive output files with all analysis."""
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Main comprehensive JSON output
    main_output = {
        "extraction_summary": {
            "timestamp": timestamp,
            "total_files_processed": len([r for r in all_results if r['success']]),
            "total_words_found": analysis['total_words'],
            "unique_words": analysis['unique_words'],
            "duplicate_words_across_levels": analysis['duplicate_count']
        },
        "hsk_level_breakdown": analysis['level_statistics'],
        "all_simplified_words": {
            "unique_words_only": analysis['unique_word_list'],
            "words_by_hsk_level": analysis['words_by_level']
        },
        "statistics": {
            "word_counts": {
                "total_words": analysis['total_words'],
                "unique_words": analysis['unique_words'],
                "single_characters": len(analysis['single_characters']),
                "compound_words": len(analysis['compound_words'])
            },
            "word_length_distribution": analysis['word_length_distribution'],
            "character_analysis": {
                "unique_characters_used": analysis['unique_characters_count'],
                "most_common_characters": analysis['character_frequency'].most_common(30)
            }
        },
        "duplicate_analysis": {
            "words_appearing_in_multiple_levels": analysis['duplicate_words'],
            "duplicate_count": analysis['duplicate_count']
        },
        "source_files": {
            f"hsk_{result['hsk_level']}": {
                "file": os.path.basename(result['file_path']),
                "status": "success" if result['success'] else "failed",
                "word_count": result['total_count'] if result['success'] else 0,
                "error": result.get('error', None)
            }
            for result in all_results
        }
    }
    
    # Save main output
    main_file = output_dir / "hsk_all_levels_complete.json"
    with open(main_file, 'w', encoding='utf-8') as f:
        json.dump(main_output, f, ensure_ascii=False, indent=2)
    print(f"📄 Main output: {main_file}")
    
    # Create simple unique words list (most useful for the app)
    unique_words_file = output_dir / "hsk_unique_words.json"
    unique_output = {
        "total_unique_words": len(analysis['unique_word_list']),
        "simplified_words": analysis['unique_word_list'],
        "extraction_info": {
            "description": "Unique simplified Chinese words from HSK levels 1-7",
            "source": "HSK vocabulary levels 1-7 combined",
            "timestamp": timestamp,
            "duplicates_removed": analysis['duplicate_count']
        }
    }
    with open(unique_words_file, 'w', encoding='utf-8') as f:
        json.dump(unique_output, f, ensure_ascii=False, indent=2)
    print(f"📄 Unique words: {unique_words_file}")
    
    # Create text file with unique words
    text_file = output_dir / "hsk_unique_words.txt"
    with open(text_file, 'w', encoding='utf-8') as f:
        for word in analysis['unique_word_list']:
            f.write(word + '\n')
    print(f"📄 Text file: {text_file}")
    
    # Create CSV with detailed analysis
    csv_file = output_dir / "hsk_word_analysis.csv"
    with open(csv_file, 'w', encoding='utf-8') as f:
        f.write("word,length,type,hsk_levels,appears_in_multiple_levels\n")
        
        # Process unique words
        for word in analysis['unique_word_list']:
            length = len(word)
            word_type = "single" if length == 1 else "compound"
            
            # Find which levels this word appears in
            levels = []
            for level, words in analysis['words_by_level'].items():
                if word in words:
                    levels.append(str(level))
            
            hsk_levels = "|".join(levels)
            multiple_levels = "yes" if len(levels) > 1 else "no"
            
            f.write(f"{word},{length},{word_type},{hsk_levels},{multiple_levels}\n")
    
    print(f"📄 CSV analysis: {csv_file}")
    
    # Create level-specific files
    for level, words in analysis['words_by_level'].items():
        level_file = output_dir / f"hsk_level_{level}_words.txt"
        with open(level_file, 'w', encoding='utf-8') as f:
            for word in sorted(words):
                f.write(word + '\n')
        print(f"📄 HSK {level}: {level_file} ({len(words)} words)")

def print_detailed_statistics(analysis, all_results):
    """Print comprehensive statistics to console."""
    
    print(f"\n{'='*60}")
    print(f"📊 COMPREHENSIVE HSK VOCABULARY ANALYSIS")
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

def main():
    """Main function to process all HSK levels."""
    
    print("HSK Vocabulary Multi-Level Extractor")
    print("="*50)
    print("Processing HSK levels 1-7...")
    print()
    
    # Setup paths
    script_dir = Path(__file__).parent
    data_dir = script_dir / "data" / "raw"
    output_dir = script_dir / "output"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Process all HSK levels
    all_results = []
    
    for hsk_level in range(1, 8):  # HSK 1 through 7
        file_path = data_dir / f"{hsk_level}.json"
        result = extract_from_single_file(str(file_path), hsk_level)
        all_results.append(result)
    
    # Check if we got any successful results
    successful_results = [r for r in all_results if r['success']]
    
    if not successful_results:
        print("\n❌ No files were successfully processed!")
        print("Please check that the JSON files exist in the data/raw directory.")
        return
    
    print(f"\n🔄 Analyzing combined data from {len(successful_results)} successful files...")
    
    # Analyze combined data
    analysis = analyze_combined_data(all_results)
    
    # Create output files
    print(f"\n📁 Creating output files...")
    create_comprehensive_output(analysis, output_dir, all_results)
    
    # Print detailed statistics
    print_detailed_statistics(analysis, all_results)
    
    # Final summary
    print(f"\n{'='*60}")
    print(f"🎉 EXTRACTION COMPLETED SUCCESSFULLY!")
    print(f"{'='*60}")
    print(f"📊 Results Summary:")
    print(f"   • {len(successful_results)}/7 HSK levels processed")
    print(f"   • {analysis['unique_words']:,} unique Chinese words extracted")
    print(f"   • {analysis['total_words']:,} total words (including duplicates)")
    print(f"   • {analysis['duplicate_count']:,} words appear in multiple levels")
    print(f"   • {analysis['unique_characters_count']:,} unique characters used")
    print(f"\n📁 Output files created in: {output_dir}")
    print(f"   • hsk_all_levels_complete.json (comprehensive data)")
    print(f"   • hsk_unique_words.json (unique words only)")
    print(f"   • hsk_unique_words.txt (simple text list)")
    print(f"   • hsk_word_analysis.csv (detailed analysis)")
    print(f"   • hsk_level_X_words.txt (individual level files)")

if __name__ == "__main__":
    main()
