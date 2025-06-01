#!/usr/bin/env python3
"""
Report generator module for HSK vocabulary analysis.
Creates comprehensive reports and output files.
"""

import json
import os
from pathlib import Path
from datetime import datetime
from data_analyzer import analyze_individual_level

def generate_learning_recommendations(level, level_analysis):
    """Generate learning recommendations based on level analysis."""
    
    recommendations = []
    stats = level_analysis['statistics']
    insights = level_analysis['learning_insights']
    
    # Recommendations based on word composition
    if stats['single_characters'] > stats['compound_words']:
        recommendations.append({
            "category": "Character Focus",
            "recommendation": f"This level has {stats['single_characters']} single characters vs {stats['compound_words']} compounds. Focus on mastering individual character meanings first.",
            "priority": "high"
        })
    else:
        recommendations.append({
            "category": "Compound Words",
            "recommendation": f"This level emphasizes compound words ({stats['compound_words']} compounds vs {stats['single_characters']} single chars). Practice understanding how characters combine.",
            "priority": "high"
        })
    
    # Recommendations based on uniqueness
    if insights['uniqueness']['uniqueness_percentage'] > 80:
        recommendations.append({
            "category": "Level-Specific Focus",
            "recommendation": f"High uniqueness ({insights['uniqueness']['uniqueness_percentage']:.1f}%) - most words are specific to HSK {level}. Master these thoroughly.",
            "priority": "medium"
        })
    elif insights['uniqueness']['uniqueness_percentage'] < 40:
        recommendations.append({
            "category": "Foundation Building", 
            "recommendation": f"Many words appear in other levels. This level builds on previous foundations. Review earlier levels if struggling.",
            "priority": "medium"
        })
    
    # Recommendations based on complexity
    avg_length = stats['average_word_length']
    if avg_length > 2.5:
        recommendations.append({
            "category": "Complex Vocabulary",
            "recommendation": f"Average word length is {avg_length:.1f} characters. Break down complex words into component meanings.",
            "priority": "medium"
        })
    
    # Character frequency recommendations
    if len(stats['most_common_characters']) > 0:
        top_char = stats['most_common_characters'][0][0]
        char_count = stats['most_common_characters'][0][1]
        recommendations.append({
            "category": "Key Characters",
            "recommendation": f"The character '{top_char}' appears in {char_count} words at this level. Master this character first.",
            "priority": "low"
        })
    
    return recommendations

def generate_level_comparison(current_level, level_analysis, all_analysis):
    """Generate comparison with other HSK levels."""
    
    comparisons = {}
    current_words = set(level_analysis['word_list'])
    
    for other_level, other_words in all_analysis['words_by_level'].items():
        if other_level == current_level:
            continue
            
        other_words_set = set(other_words)
        
        # Calculate overlap
        common_words = current_words.intersection(other_words_set)
        overlap_percentage = (len(common_words) / len(current_words)) * 100 if current_words else 0
        
        comparisons[f"hsk_{other_level}"] = {
            "level": other_level,
            "common_words_count": len(common_words),
            "overlap_percentage": round(overlap_percentage, 1),
            "common_words": sorted(list(common_words))[:10] if len(common_words) <= 10 else sorted(list(common_words))[:10] + [f"... and {len(common_words) - 10} more"]
        }
    
    return comparisons

def create_individual_level_reports(analysis, output_dir, all_results, dataset_name):
    """Create individual analysis reports for each HSK level."""
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    level_reports_dir = output_dir / "level_reports"
    level_reports_dir.mkdir(exist_ok=True)
    
    print(f"\n📋 Creating individual level reports for {dataset_name}...")
    
    for level, words in analysis['words_by_level'].items():
        if not words:
            continue
            
        print(f"   📄 Generating report for HSK Level {level} ({dataset_name})...")
        
        # Analyze this specific level
        level_analysis = analyze_individual_level(level, words, analysis)
        
        if level_analysis is None:
            continue
        
        # Create comprehensive report
        level_report = {
            "report_info": {
                "hsk_level": level,
                "dataset": dataset_name,
                "generation_timestamp": timestamp,
                "report_type": f"Individual HSK Level Analysis - {dataset_name.title()}",
                "description": f"Comprehensive analysis of HSK Level {level} vocabulary from {dataset_name} dataset"
            },
            "summary": {
                "total_words_in_level": level_analysis['total_words'],
                "single_characters": level_analysis['statistics']['single_characters'],
                "compound_words": level_analysis['statistics']['compound_words'],
                "unique_characters": level_analysis['statistics']['unique_characters_count'],
                "average_word_length": round(level_analysis['statistics']['average_word_length'], 2),
                "words_unique_to_this_level": level_analysis['learning_insights']['uniqueness']['words_unique_to_level'],
                "uniqueness_percentage": round(level_analysis['learning_insights']['uniqueness']['uniqueness_percentage'], 1)
            },
            "detailed_analysis": level_analysis,
            "learning_recommendations": generate_learning_recommendations(level, level_analysis),
            "comparison_with_other_levels": generate_level_comparison(level, level_analysis, analysis)
        }
        
        # Save JSON report
        report_file = level_reports_dir / f"hsk_level_{level}_{dataset_name}_analysis.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(level_report, f, ensure_ascii=False, indent=2)
        
        # Create a summary text report
        summary_file = level_reports_dir / f"hsk_level_{level}_{dataset_name}_summary.txt"
        create_level_summary_text(level_analysis, summary_file, timestamp, dataset_name)
        
        # Create CSV with word details
        csv_file = level_reports_dir / f"hsk_level_{level}_{dataset_name}_words.csv"
        create_level_csv(level, words, analysis, csv_file)
        
        print(f"      ✅ HSK {level} ({dataset_name}): {len(words)} words analyzed")
    
    print(f"\n📁 {dataset_name.title()} level reports saved in: {level_reports_dir}")

def create_level_summary_text(level_analysis, output_file, timestamp, dataset_name):
    """Create a human-readable text summary for a level."""
    
    level = level_analysis['hsk_level']
    stats = level_analysis['statistics']
    insights = level_analysis['learning_insights']
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"HSK LEVEL {level} - {dataset_name.upper()} DATASET ANALYSIS\n")
        f.write(f"={'=' * 60}\n")
        f.write(f"Generated: {timestamp}\n\n")
        
        f.write(f"OVERVIEW:\n")
        f.write(f"  Dataset: {dataset_name.title()}\n")
        f.write(f"  Total Words: {level_analysis['total_words']}\n")
        f.write(f"  Single Characters: {stats['single_characters']} ({(stats['single_characters']/level_analysis['total_words']*100):.1f}%)\n")
        f.write(f"  Compound Words: {stats['compound_words']} ({(stats['compound_words']/level_analysis['total_words']*100):.1f}%)\n")
        f.write(f"  Average Word Length: {stats['average_word_length']:.2f} characters\n")
        f.write(f"  Unique Characters: {stats['unique_characters_count']}\n\n")
        
        f.write(f"WORD LENGTH DISTRIBUTION:\n")
        for length, count in sorted(stats['word_length_distribution'].items()):
            percentage = (count / level_analysis['total_words']) * 100
            f.write(f"  {length} character(s): {count} words ({percentage:.1f}%)\n")
        f.write(f"\n")
        
        f.write(f"MOST COMMON CHARACTERS IN THIS LEVEL:\n")
        for char, count in stats['most_common_characters']:
            f.write(f"  {char}: appears in {count} words\n")
        f.write(f"\n")
        
        f.write(f"UNIQUENESS ANALYSIS:\n")
        f.write(f"  Words unique to HSK {level}: {insights['uniqueness']['words_unique_to_level']}\n")
        f.write(f"  Words shared with other levels: {insights['uniqueness']['words_shared_with_others']}\n")
        f.write(f"  Uniqueness percentage: {insights['uniqueness']['uniqueness_percentage']:.1f}%\n\n")
        
        f.write(f"LONGEST WORDS IN THIS LEVEL:\n")
        for i, word in enumerate(level_analysis['word_analysis']['longest_words'][:5], 1):
            f.write(f"  {i}. {word} ({len(word)} characters)\n")
        f.write(f"\n")
        
        if level_analysis['word_analysis']['unique_to_this_level']:
            f.write(f"WORDS UNIQUE TO HSK {level} (first 20):\n")
            unique_words = level_analysis['word_analysis']['unique_to_this_level'][:20]
            for word in unique_words:
                f.write(f"  {word}\n")
            if len(level_analysis['word_analysis']['unique_to_this_level']) > 20:
                remaining = len(level_analysis['word_analysis']['unique_to_this_level']) - 20
                f.write(f"  ... and {remaining} more unique words\n")

def create_level_csv(level, words, all_analysis, output_file):
    """Create a detailed CSV file for a specific level."""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("word,length,type,unique_to_level,also_appears_in_levels,character_count\n")
        
        for word in sorted(words):
            length = len(word)
            word_type = "single" if length == 1 else "compound"
            
            # Check which other levels contain this word
            other_levels = []
            for other_level, other_words in all_analysis['words_by_level'].items():
                if other_level != level and word in other_words:
                    other_levels.append(str(other_level))
            
            unique_to_level = "yes" if not other_levels else "no"
            also_in_levels = "|".join(other_levels) if other_levels else "none"
            character_count = len(set(word))  # Unique characters in this word
            
            f.write(f"{word},{length},{word_type},{unique_to_level},{also_in_levels},{character_count}\n")
