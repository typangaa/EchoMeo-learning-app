#!/usr/bin/env python3
"""
File output utilities for HSK vocabulary analysis.
Creates various output files and formats.
"""

import json
import os
from datetime import datetime

def create_comprehensive_output(analysis, output_dir, all_results, dataset_name):
    """Create comprehensive output files with all analysis for a dataset."""
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Main comprehensive JSON output
    main_output = {
        "extraction_summary": {
            "dataset": dataset_name,
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
                "file": os.path.basename(result['file_path']) if isinstance(result['file_path'], str) else result['file_path'].name,
                "status": "success" if result['success'] else "failed",
                "word_count": result['total_count'] if result['success'] else 0,
                "error": result.get('error', None)
            }
            for result in all_results
        }
    }
    
    # Save main output
    main_file = output_dir / f"hsk_all_levels_{dataset_name}_complete.json"
    with open(main_file, 'w', encoding='utf-8') as f:
        json.dump(main_output, f, ensure_ascii=False, indent=2)
    print(f"📄 {dataset_name.title()} main output: {main_file}")
    
    # Create simple unique words list
    unique_words_file = output_dir / f"hsk_unique_words_{dataset_name}.json"
    unique_output = {
        "total_unique_words": len(analysis['unique_word_list']),
        "simplified_words": analysis['unique_word_list'],
        "extraction_info": {
            "description": f"Unique simplified Chinese words from HSK levels 1-7 ({dataset_name} dataset)",
            "source": f"HSK vocabulary levels 1-7 combined - {dataset_name} dataset",
            "timestamp": timestamp,
            "duplicates_removed": analysis['duplicate_count']
        }
    }
    with open(unique_words_file, 'w', encoding='utf-8') as f:
        json.dump(unique_output, f, ensure_ascii=False, indent=2)
    print(f"📄 {dataset_name.title()} unique words: {unique_words_file}")
    
    # Create text file with unique words
    text_file = output_dir / f"hsk_unique_words_{dataset_name}.txt"
    with open(text_file, 'w', encoding='utf-8') as f:
        for word in analysis['unique_word_list']:
            f.write(word + '\n')
    print(f"📄 {dataset_name.title()} text file: {text_file}")
    
    # Create CSV with detailed analysis
    csv_file = output_dir / f"hsk_word_analysis_{dataset_name}.csv"
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
    
    print(f"📄 {dataset_name.title()} CSV analysis: {csv_file}")
    
    # Create level-specific files
    for level, words in analysis['words_by_level'].items():
        level_file = output_dir / f"hsk_level_{level}_{dataset_name}_words.txt"
        with open(level_file, 'w', encoding='utf-8') as f:
            for word in sorted(words):
                f.write(word + '\n')
        print(f"📄 HSK {level} ({dataset_name}): {level_file} ({len(words)} words)")

def create_comparison_report(comparison_data, output_dir):
    """Create comprehensive comparison report between exclusive and inclusive datasets."""
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Create main comparison JSON
    comparison_report = {
        "report_info": {
            "title": "HSK Raw Data Analysis - Exclusive vs Inclusive Comparison",
            "timestamp": timestamp,
            "description": "Comprehensive comparison between exclusive and inclusive HSK datasets"
        },
        "overall_summary": comparison_data['overall_comparison'],
        "dataset_differences": {
            "words_only_in_exclusive": {
                "count": comparison_data['overall_comparison']['exclusive_only_count'],
                "percentage": (comparison_data['overall_comparison']['exclusive_only_count'] / comparison_data['overall_comparison']['total_combined_unique']) * 100,
                "sample_words": comparison_data['detailed_comparison']['exclusive_only_words'][:20]
            },
            "words_only_in_inclusive": {
                "count": comparison_data['overall_comparison']['inclusive_only_count'],
                "percentage": (comparison_data['overall_comparison']['inclusive_only_count'] / comparison_data['overall_comparison']['total_combined_unique']) * 100,
                "sample_words": comparison_data['detailed_comparison']['inclusive_only_words'][:20]
            },
            "common_words": {
                "count": comparison_data['overall_comparison']['common_words_count'],
                "percentage": (comparison_data['overall_comparison']['common_words_count'] / comparison_data['overall_comparison']['total_combined_unique']) * 100,
                "sample_words": comparison_data['detailed_comparison']['common_words'][:20]
            }
        },
        "level_by_level_analysis": comparison_data['level_by_level_comparison'],
        "character_analysis": comparison_data['character_analysis'],
        "recommendations": generate_comparison_recommendations(comparison_data)
    }
    
    # Save comprehensive comparison report
    comparison_file = output_dir / "hsk_exclusive_vs_inclusive_comparison.json"
    with open(comparison_file, 'w', encoding='utf-8') as f:
        json.dump(comparison_report, f, ensure_ascii=False, indent=2)
    print(f"📄 Dataset comparison report: {comparison_file}")
    
    # Create human-readable summary
    summary_file = output_dir / "hsk_comparison_summary.txt"
    create_comparison_summary_text(comparison_data, summary_file, timestamp)
    print(f"📄 Comparison summary: {summary_file}")
    
    # Create level comparison CSV
    csv_file = output_dir / "hsk_level_comparison.csv"
    create_level_comparison_csv(comparison_data, csv_file)
    print(f"📄 Level comparison CSV: {csv_file}")

def generate_comparison_recommendations(comparison_data):
    """Generate recommendations based on dataset comparison."""
    
    recommendations = []
    overall = comparison_data['overall_comparison']
    
    # Overall overlap analysis
    if overall['overlap_percentage'] > 80:
        recommendations.append({
            "category": "Dataset Similarity",
            "recommendation": f"High overlap ({overall['overlap_percentage']:.1f}%) between datasets suggests good consistency. Either dataset could be used reliably.",
            "priority": "low"
        })
    elif overall['overlap_percentage'] < 50:
        recommendations.append({
            "category": "Dataset Differences",
            "recommendation": f"Significant differences ({overall['overlap_percentage']:.1f}% overlap) between datasets. Consider combining both for comprehensive coverage.",
            "priority": "high"
        })
    
    # Dataset size recommendations
    if overall['exclusive_only_count'] > overall['inclusive_only_count'] * 2:
        recommendations.append({
            "category": "Dataset Selection",
            "recommendation": "Exclusive dataset contains significantly more unique words. Consider using exclusive dataset as primary source.",
            "priority": "medium"
        })
    elif overall['inclusive_only_count'] > overall['exclusive_only_count'] * 2:
        recommendations.append({
            "category": "Dataset Selection",
            "recommendation": "Inclusive dataset contains significantly more unique words. Consider using inclusive dataset as primary source.",
            "priority": "medium"
        })
    
    # Level analysis recommendations
    level_differences = []
    for level, data in comparison_data['level_by_level_comparison'].items():
        if data['overlap_percentage'] < 70:
            level_differences.append(level)
    
    if level_differences:
        recommendations.append({
            "category": "Level-Specific Issues",
            "recommendation": f"Levels {', '.join(map(str, level_differences))} show significant differences between datasets. Review these levels carefully.",
            "priority": "medium"
        })
    
    return recommendations

def create_comparison_summary_text(comparison_data, output_file, timestamp):
    """Create human-readable comparison summary."""
    
    overall = comparison_data['overall_comparison']
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("HSK RAW DATA ANALYSIS - DATASET COMPARISON SUMMARY\n")
        f.write("=" * 60 + "\n")
        f.write(f"Generated: {timestamp}\n\n")
        
        f.write("OVERALL COMPARISON:\n")
        f.write(f"  Exclusive Dataset Total: {overall['exclusive_total_unique']:,} unique words\n")
        f.write(f"  Inclusive Dataset Total: {overall['inclusive_total_unique']:,} unique words\n")
        f.write(f"  Common Words: {overall['common_words_count']:,} ({(overall['common_words_count']/overall['total_combined_unique']*100):.1f}%)\n")
        f.write(f"  Exclusive Only: {overall['exclusive_only_count']:,} ({(overall['exclusive_only_count']/overall['total_combined_unique']*100):.1f}%)\n")
        f.write(f"  Inclusive Only: {overall['inclusive_only_count']:,} ({(overall['inclusive_only_count']/overall['total_combined_unique']*100):.1f}%)\n")
        f.write(f"  Total Combined Unique: {overall['total_combined_unique']:,}\n")
        f.write(f"  Overall Overlap: {overall['overlap_percentage']:.1f}%\n\n")
        
        f.write("LEVEL-BY-LEVEL COMPARISON:\n")
        for level in range(1, 8):
            level_data = comparison_data['level_by_level_comparison'].get(level, {})
            if level_data:
                f.write(f"  HSK {level}:\n")
                f.write(f"    Exclusive: {level_data['exclusive_count']:,} words\n")
                f.write(f"    Inclusive: {level_data['inclusive_count']:,} words\n")
                f.write(f"    Common: {level_data['common_count']:,} ({level_data['overlap_percentage']:.1f}% overlap)\n")
                f.write(f"    Exclusive only: {level_data['exclusive_only_count']:,}\n")
                f.write(f"    Inclusive only: {level_data['inclusive_only_count']:,}\n\n")
        
        f.write("CHARACTER ANALYSIS:\n")
        char_data = comparison_data['character_analysis']
        f.write(f"  Exclusive unique characters: {char_data['exclusive_unique_chars']:,}\n")
        f.write(f"  Inclusive unique characters: {char_data['inclusive_unique_chars']:,}\n")
        f.write(f"  Common characters: {char_data['common_chars_count']:,}\n")
        f.write(f"  Exclusive only characters: {char_data['exclusive_only_chars_count']:,}\n")
        f.write(f"  Inclusive only characters: {char_data['inclusive_only_chars_count']:,}\n")

def create_level_comparison_csv(comparison_data, output_file):
    """Create CSV with level-by-level comparison."""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("hsk_level,exclusive_count,inclusive_count,common_count,exclusive_only_count,inclusive_only_count,overlap_percentage\n")
        
        for level in range(1, 8):
            level_data = comparison_data['level_by_level_comparison'].get(level, {})
            if level_data:
                f.write(f"{level},{level_data['exclusive_count']},{level_data['inclusive_count']},{level_data['common_count']},{level_data['exclusive_only_count']},{level_data['inclusive_only_count']},{level_data['overlap_percentage']:.1f}\n")
