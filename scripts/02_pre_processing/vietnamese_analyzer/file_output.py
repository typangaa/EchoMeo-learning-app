#!/usr/bin/env python3
"""
File output module for Vietnamese vocabulary analysis.
Handles creation of various output formats (JSON, CSV, TXT).
"""

import json
import os
from pathlib import Path
from datetime import datetime

def create_comprehensive_output(analysis, output_dir, all_results):
    """Create comprehensive output files with all analysis."""
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Main comprehensive JSON output
    main_output = {
        "analysis_summary": {
            "timestamp": timestamp,
            "total_files_processed": len([r for r in all_results if r['success']]),
            "total_vocabulary_items": analysis['total_vocabulary'],
            "unique_words": analysis['unique_words'],
            "duplicate_words": analysis['duplicate_count']
        },
        "file_breakdown": analysis['file_statistics'],
        "linguistic_analysis": {
            "etymology": analysis['etymology_analysis'],
            "tone_patterns": analysis['tone_analysis'],
            "regional_variants": analysis['regional_analysis'],
            "syllable_structure": analysis['syllable_analysis'],
            "pos_distribution": analysis['pos_analysis'],
            "frequency_patterns": analysis['frequency_analysis']
        },
        "duplicate_analysis": analysis.get('duplicate_analysis', {}),
        "vocabulary_data": {
            "unique_words": analysis['word_list'],
            "complete_items": analysis['vocabulary_items']
        },
        "source_files": {
            f"file_{result['file_number']}": {
                "file": os.path.basename(result['file_path']) if isinstance(result['file_path'], str) else result['file_path'].name,
                "status": "success" if result['success'] else "failed",
                "item_count": result['total_count'] if result['success'] else 0,
                "error": result.get('error', None)
            }
            for result in all_results
        }
    }
    
    # Save main output
    main_file = output_dir / "vietnamese_vocabulary_complete.json"
    with open(main_file, 'w', encoding='utf-8') as f:
        json.dump(main_output, f, ensure_ascii=False, indent=2)
    print(f"📄 Main output: {main_file}")
    
    # Create simple word list with duplicate info
    words_file = output_dir / "vietnamese_words_list.json"
    duplicate_info = analysis.get('duplicate_analysis', {}).get('summary', {})
    words_output = {
        "total_unique_words": len(analysis['word_list']),
        "vietnamese_words": analysis['word_list'],
        "extraction_info": {
            "description": "Unique Vietnamese words from all processed files",
            "timestamp": timestamp,
            "duplicates_removed": analysis['duplicate_count']
        },
        "duplicate_analysis_summary": {
            "within_level_duplicates": duplicate_info.get('total_within_level_duplicates', 0),
            "cross_level_duplicates": duplicate_info.get('total_cross_level_duplicates', 0),
            "total_duplicate_words": duplicate_info.get('total_unique_duplicate_words', 0)
        }
    }
    with open(words_file, 'w', encoding='utf-8') as f:
        json.dump(words_output, f, ensure_ascii=False, indent=2)
    print(f"📄 Word list: {words_file}")
    
    # Create learning-focused output
    learning_output = create_learning_focused_output(analysis)
    learning_file = output_dir / "vietnamese_learning_data.json"
    with open(learning_file, 'w', encoding='utf-8') as f:
        json.dump(learning_output, f, ensure_ascii=False, indent=2)
    print(f"📄 Learning data: {learning_file}")
    
    # Create CSV files
    create_csv_outputs(analysis, output_dir)
    
    # Create text files
    create_text_outputs(analysis, output_dir, timestamp)
    
    # Create special file for just the duplicate words list
    create_duplicate_words_file(analysis, output_dir)

def create_learning_focused_output(analysis):
    """Create output specifically focused on language learning needs."""
    
    etymology = analysis['etymology_analysis']
    tone = analysis['tone_analysis']
    frequency = analysis['frequency_analysis']
    learning = analysis['learning_analysis']
    
    return {
        "learning_statistics": {
            "sino_vietnamese_ratio": learning['chinese_learner_insights']['sino_vietnamese_ratio'],
            "native_vietnamese_ratio": learning['chinese_learner_insights']['native_vietnamese_count'] / analysis['total_vocabulary']
        },
        "chinese_learner_focus": {
            "sino_vietnamese_words": [item['vietnamese'] for item in learning['sino_vietnamese_words']],
            "native_vietnamese_words": [item['vietnamese'] for item in learning['native_vietnamese_words']],
            "sino_vietnamese_examples": [item for item in learning['sino_vietnamese_words'][:20]],
            "learning_priority": "sino_vietnamese" if learning['chinese_learner_insights']['sino_vietnamese_ratio'] > 0.5 else "mixed"
        },
        "study_recommendations": generate_study_recommendations(analysis),
        "tone_learning_guide": {
            "tone_distribution": tone['tone_distribution'],
            "most_common_tones": sorted(tone['tone_distribution'].items(), key=lambda x: x[1], reverse=True)[:5]
        }
    }

def generate_study_recommendations(analysis):
    """Generate study recommendations based on analysis."""
    
    recommendations = []
    etymology = analysis['etymology_analysis']
    frequency = analysis['frequency_analysis']
    learning = analysis['learning_analysis']
    
    # Etymology-based recommendations
    sino_ratio = learning['chinese_learner_insights']['sino_vietnamese_ratio']
    if sino_ratio > 0.6:
        recommendations.append({
            "category": "Etymology Focus",
            "recommendation": f"High Sino-Vietnamese content ({sino_ratio:.1%}). Leverage your Chinese knowledge to understand word meanings.",
            "priority": "high"
        })
    elif sino_ratio > 0.3:
        recommendations.append({
            "category": "Mixed Approach",
            "recommendation": f"Balanced mix of Sino-Vietnamese ({sino_ratio:.1%}) and native words. Study both etymology types.",
            "priority": "medium"
        })
    else:
        recommendations.append({
            "category": "Native Focus", 
            "recommendation": f"Mostly native Vietnamese words ({1-sino_ratio:.1%}). Focus on Vietnamese-specific patterns.",
            "priority": "high"
        })
    
    # Frequency-based recommendations
    high_freq_count = frequency['frequency_ranges']['very_high'] + frequency['frequency_ranges']['high']
    if high_freq_count > 0:
        recommendations.append({
            "category": "Priority Learning",
            "recommendation": f"Focus on {high_freq_count} high-frequency words first for maximum impact.",
            "priority": "high"
        })
    
    # Tone-based recommendations
    tone_analysis = analysis['tone_analysis']
    if tone_analysis['tone_distribution']:
        most_common_tone = max(tone_analysis['tone_distribution'].items(), key=lambda x: x[1])
        recommendations.append({
            "category": "Tone Practice",
            "recommendation": f"Most common tone pattern: {most_common_tone[0]} ({most_common_tone[1]} words). Master this first.",
            "priority": "medium"
        })
    
    return recommendations

def create_csv_outputs(analysis, output_dir):
    """Create CSV files for data analysis."""
    
    # Main vocabulary CSV
    vocab_csv = output_dir / "vietnamese_vocabulary_analysis.csv"
    with open(vocab_csv, 'w', encoding='utf-8') as f:
        f.write("word,syllable_count,frequency,pos,etymology_origin,tone_pattern,file_sources\n")
        
        for item in analysis['vocabulary_items']:
            word = item['vietnamese']
            syllable_count = len(item.get('syllables', []))
            frequency = item.get('frequency', 0)
            pos_list = "|".join(item.get('pos', []))
            etymology_origin = item.get('etymology', {}).get('origin', 'unknown')
            
            # Get tone pattern from first form
            tone_pattern = 'unknown'
            forms = item.get('forms', [])
            if forms:
                tone_pattern = forms[0].get('transcriptions', {}).get('tone_pattern', 'unknown')
            
            # Find which files contain this word (simplified for now)
            file_sources = "multiple"  # Could be enhanced to track actual sources
            
            f.write(f"{word},{syllable_count},{frequency},{pos_list},{etymology_origin},{tone_pattern},{file_sources}\n")
    
    print(f"📄 Vocabulary CSV: {vocab_csv}")

def create_text_outputs(analysis, output_dir, timestamp):
    """Create human-readable text files."""
    
    # Main summary
    summary_file = output_dir / "vietnamese_analysis_summary.txt"
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("VIETNAMESE VOCABULARY ANALYSIS SUMMARY\n")
        f.write("="*50 + "\n")
        f.write(f"Generated: {timestamp}\n\n")
        
        f.write("OVERVIEW:\n")
        f.write(f"  Total Vocabulary Items: {analysis['total_vocabulary']}\n")
        f.write(f"  Unique Words: {analysis['unique_words']}\n")
        f.write(f"  Duplicate Entries: {analysis['duplicate_count']}\n\n")
        
        # Etymology breakdown
        etymology = analysis['etymology_analysis']
        f.write("ETYMOLOGY DISTRIBUTION:\n")
        for origin, count in etymology['etymology_distribution'].items():
            percentage = (count / analysis['total_vocabulary']) * 100
            f.write(f"  {origin.replace('_', ' ').title()}: {count} ({percentage:.1f}%)\n")
        f.write("\n")
        
        # Chinese learner insights
        learning = analysis['learning_analysis']
        sino_ratio = learning['chinese_learner_insights']['sino_vietnamese_ratio']
        f.write("CHINESE LEARNER INSIGHTS:\n")
        f.write(f"  Sino-Vietnamese ratio: {sino_ratio:.1%}\n")
        f.write(f"  Recommended approach: {'Leverage Chinese knowledge' if sino_ratio > 0.5 else 'Mixed learning approach'}\n")
        f.write("\n")
        
        # Top recommendations
        recommendations = generate_study_recommendations(analysis)
        f.write("TOP STUDY RECOMMENDATIONS:\n")
        for i, rec in enumerate(recommendations[:3], 1):
            f.write(f"  {i}. {rec['recommendation']}\n")
    
    print(f"📄 Summary: {summary_file}")
    
    # Sino-Vietnamese words for Chinese learners
    sino_vietnamese_words = analysis['learning_analysis']['sino_vietnamese_words']
    if sino_vietnamese_words:
        sino_file = output_dir / "vietnamese_sino_vietnamese_words.txt"
        with open(sino_file, 'w', encoding='utf-8') as f:
            f.write("# Sino-Vietnamese Words (Chinese Origin)\n")
            f.write("# These words may be easier for Chinese speakers to learn\n\n")
            for item in sorted(sino_vietnamese_words, key=lambda x: x.get('frequency', 0), reverse=True):
                chu_nom = item.get('etymology', {}).get('chu_nom', '')
                notes = item.get('etymology', {}).get('notes', '')
                f.write(f"{item['vietnamese']}")
                if chu_nom:
                    f.write(f" (Chu Nom: {chu_nom})")
                if notes:
                    f.write(f" - {notes}")
                f.write("\n")
        print(f"📄 Sino-Vietnamese words: {sino_file}")

def create_duplicate_words_file(analysis, output_dir):
    """Create a special JSON file containing just the list of duplicate words."""
    
    duplicate_analysis = analysis.get('duplicate_analysis', {})
    if not duplicate_analysis or 'error' in duplicate_analysis:
        return
    
    # Collect all duplicate words
    all_duplicate_words = set()
    
    # Within-level duplicates
    within_level_duplicates = duplicate_analysis.get('within_level_duplicates', {})
    for level, duplicates in within_level_duplicates.items():
        for dup_info in duplicates:
            all_duplicate_words.add(dup_info['word'])
    
    # Cross-level duplicates
    cross_level_duplicates = duplicate_analysis.get('cross_level_duplicates', {})
    for word in cross_level_duplicates.keys():
        all_duplicate_words.add(word)
    
    # Create the output
    duplicates_file = output_dir / "vietnamese_file_1_analysis.json"
    duplicate_words_output = {
        "analysis_type": "vietnamese_vocabulary_duplicates",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "summary": duplicate_analysis.get('summary', {}),
        "duplicate_words": sorted(list(all_duplicate_words)),
        "level_distribution": duplicate_analysis.get('level_distribution', {}),
        "detailed_analysis": {
            "within_level_duplicates": within_level_duplicates,
            "cross_level_duplicates": cross_level_duplicates
        }
    }
    
    with open(duplicates_file, 'w', encoding='utf-8') as f:
        json.dump(duplicate_words_output, f, ensure_ascii=False, indent=2)
    
    print(f"📄 Duplicate words analysis: {duplicates_file}")

# Remove the duplicate function since learning categories no longer exist
