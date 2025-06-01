#!/usr/bin/env python3
"""
Report generator module for Vietnamese vocabulary analysis.
Creates comprehensive reports and output files for individual vocabulary files.
"""

import json
import os
from pathlib import Path
from datetime import datetime
from collections import Counter

def generate_learning_recommendations(file_analysis):
    """Generate learning recommendations based on file analysis."""
    
    recommendations = []
    etymology = file_analysis.get('etymology_analysis', {})
    frequency = file_analysis.get('frequency_analysis', {})
    tone = file_analysis.get('tone_analysis', {})
    learning = file_analysis.get('learning_analysis', {})
    
    # Etymology-based recommendations
    if 'chinese_learner_insights' in learning:
        sino_ratio = learning['chinese_learner_insights'].get('sino_vietnamese_ratio', 0)
        
        if sino_ratio > 0.6:
            recommendations.append({
                "category": "Etymology Focus for Chinese Learners",
                "recommendation": f"High Sino-Vietnamese content ({sino_ratio:.1%}). Chinese speakers should leverage their character knowledge to understand word meanings.",
                "priority": "high"
            })
        elif sino_ratio > 0.3:
            recommendations.append({
                "category": "Mixed Learning Approach",
                "recommendation": f"Balanced mix of Sino-Vietnamese ({sino_ratio:.1%}) and native words. Study etymology patterns for efficient learning.",
                "priority": "medium"
            })
        else:
            recommendations.append({
                "category": "Native Vietnamese Focus",
                "recommendation": f"Mostly native Vietnamese words ({1-sino_ratio:.1%}). Focus on Vietnamese-specific sound patterns and meanings.",
                "priority": "high"
            })
    
    # Frequency-based recommendations
    if 'frequency_ranges' in frequency:
        high_freq_count = frequency['frequency_ranges'].get('very_high', 0) + frequency['frequency_ranges'].get('high', 0)
        if high_freq_count > 0:
            recommendations.append({
                "category": "Priority Learning",
                "recommendation": f"Focus on {high_freq_count} high-frequency words first for maximum communication impact.",
                "priority": "high"
            })
    
    # Tone pattern recommendations
    if 'tone_distribution' in tone and tone['tone_distribution']:
        most_common_tone = max(tone['tone_distribution'].items(), key=lambda x: x[1])
        recommendations.append({
            "category": "Tone Practice",
            "recommendation": f"Most common tone pattern: '{most_common_tone[0]}' ({most_common_tone[1]} words). Master this pattern first.",
            "priority": "medium"
        })
    
    # Syllable structure recommendations
    syllable_analysis = file_analysis.get('syllable_analysis', {})
    if 'average_syllables' in syllable_analysis:
        avg_syllables = syllable_analysis['average_syllables']
        if avg_syllables > 2.5:
            recommendations.append({
                "category": "Complex Vocabulary",
                "recommendation": f"Average word length is {avg_syllables:.1f} syllables. Practice breaking down complex words into meaningful components.",
                "priority": "medium"
            })
        elif avg_syllables < 1.5:
            recommendations.append({
                "category": "Simple Vocabulary",
                "recommendation": f"Many single-syllable words ({avg_syllables:.1f} avg). Focus on tone accuracy for clear pronunciation.",
                "priority": "medium"
            })
    
    return recommendations

def analyze_individual_file(file_number, vocabulary_items, total_analysis):
    """Analyze a single Vietnamese vocabulary file in detail."""
    
    if not vocabulary_items:
        return None
    
    # Basic statistics
    word_count = len(vocabulary_items)
    unique_words = list(set([item['vietnamese'] for item in vocabulary_items]))
    duplicate_count = word_count - len(unique_words)
    
    # Etymology analysis for this file
    etymology_stats = Counter()
    for item in vocabulary_items:
        origin = item.get('etymology', {}).get('origin', 'unknown')
        etymology_stats[origin] += 1
    
    # Frequency distribution for this file
    frequencies = [item.get('frequency', 0) for item in vocabulary_items]
    frequency_ranges = {
        'very_high': sum(1 for f in frequencies if f >= 80),
        'high': sum(1 for f in frequencies if 60 <= f < 80),
        'medium': sum(1 for f in frequencies if 40 <= f < 60),
        'low': sum(1 for f in frequencies if 20 <= f < 40),
        'very_low': sum(1 for f in frequencies if f < 20)
    }
    
    # Syllable analysis
    syllable_counts = []
    for item in vocabulary_items:
        syllables = item.get('syllables', [])
        syllable_counts.append(len(syllables))
    
    avg_syllables = sum(syllable_counts) / len(syllable_counts) if syllable_counts else 0
    syllable_distribution = Counter(syllable_counts)
    
    # Part-of-speech analysis
    pos_counter = Counter()
    for item in vocabulary_items:
        pos_list = item.get('pos', [])
        for pos in pos_list:
            pos_counter[pos] += 1
    
    # Tone pattern analysis
    tone_patterns = Counter()
    for item in vocabulary_items:
        forms = item.get('forms', [])
        if forms:
            tone_pattern = forms[0].get('transcriptions', {}).get('tone_pattern', 'unknown')
            tone_patterns[tone_pattern] += 1
    
    # Learning categorization
    beginner_words = []
    intermediate_words = []
    advanced_words = []
    sino_vietnamese_words = []
    
    for item in vocabulary_items:
        freq = item.get('frequency', 0)
        syllable_count = len(item.get('syllables', []))
        etymology = item.get('etymology', {})
        
        # Track etymology for Chinese learners
        if etymology.get('origin') == 'sino_vietnamese':
            sino_vietnamese_words.append(item)
        
        # Simple difficulty classification
        if freq >= 60 and syllable_count <= 2:
            beginner_words.append(item)
        elif freq >= 30 and syllable_count <= 3:
            intermediate_words.append(item)
        else:
            advanced_words.append(item)
    
    return {
        'file_number': file_number,
        'statistics': {
            'total_words': word_count,
            'unique_words': len(unique_words),
            'duplicate_count': duplicate_count,
            'average_syllables': avg_syllables,
            'syllable_distribution': dict(syllable_distribution),
            'etymology_distribution': dict(etymology_stats),
            'frequency_ranges': frequency_ranges,
            'pos_distribution': list(pos_counter.most_common()),  # Keep as list for slicing
            'tone_distribution': list(tone_patterns.most_common())  # Keep as list for slicing
        },

        'chinese_learner_insights': {
            'sino_vietnamese_count': len(sino_vietnamese_words),
            'sino_vietnamese_ratio': len(sino_vietnamese_words) / word_count if word_count else 0,
            'sino_vietnamese_words': [item['vietnamese'] for item in sino_vietnamese_words[:10]]
        },
        'vocabulary_list': unique_words
    }

def create_individual_file_reports(analysis, output_dir, all_results):
    """Create individual analysis reports for each Vietnamese vocabulary file."""
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    file_reports_dir = output_dir / "file_reports"
    file_reports_dir.mkdir(exist_ok=True)
    
    print(f"\n📋 Creating individual file reports...")
    
    # Group vocabulary items by file
    vocabulary_by_file = {}
    for result in all_results:
        if result['success']:
            file_num = result['file_number']
            vocabulary_by_file[file_num] = result['vocabulary_items']
    
    for file_num, vocabulary_items in vocabulary_by_file.items():
        if not vocabulary_items:
            continue
            
        print(f"   📄 Generating report for Vietnamese file {file_num}...")
        
        # Analyze this specific file
        file_analysis = analyze_individual_file(file_num, vocabulary_items, analysis)
        
        if file_analysis is None:
            continue
        
        # Create comprehensive report
        file_report = {
            "report_info": {
                "file_number": file_num,
                "generation_timestamp": timestamp,
                "report_type": "Individual Vietnamese Vocabulary File Analysis",
                "description": f"Comprehensive analysis of Vietnamese vocabulary file {file_num}"
            },
            "summary": {
                "total_words_in_file": file_analysis['statistics']['total_words'],
                "unique_words": file_analysis['statistics']['unique_words'],
                "duplicate_words": file_analysis['statistics']['duplicate_count'],
                "average_syllables": round(file_analysis['statistics']['average_syllables'], 2),
                "sino_vietnamese_ratio": round(file_analysis['chinese_learner_insights']['sino_vietnamese_ratio'], 3)
            },
            "detailed_analysis": file_analysis,
            "learning_recommendations": generate_learning_recommendations(file_analysis)
        }
        
        # Save JSON report
        report_file = file_reports_dir / f"vietnamese_file_{file_num}_analysis.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(file_report, f, ensure_ascii=False, indent=2)
        
        # Create a summary text report
        summary_file = file_reports_dir / f"vietnamese_file_{file_num}_summary.txt"
        create_file_summary_text(file_analysis, summary_file, timestamp)
        
        # Create CSV with word details
        csv_file = file_reports_dir / f"vietnamese_file_{file_num}_words.csv"
        create_file_csv(file_num, vocabulary_items, csv_file)
        
        print(f"      ✅ File {file_num}: {file_analysis['statistics']['total_words']} words analyzed")
    
    print(f"\n📁 File reports saved in: {file_reports_dir}")

def create_file_summary_text(file_analysis, output_file, timestamp):
    """Create a human-readable text summary for a file."""
    
    file_num = file_analysis['file_number']
    stats = file_analysis['statistics']
    insights = file_analysis['chinese_learner_insights']
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"VIETNAMESE VOCABULARY FILE {file_num} ANALYSIS\n")
        f.write(f"={'=' * 50}\n")
        f.write(f"Generated: {timestamp}\n\n")
        
        f.write(f"OVERVIEW:\n")
        f.write(f"  Total Words: {stats['total_words']}\n")
        f.write(f"  Unique Words: {stats['unique_words']}\n")
        f.write(f"  Duplicate Entries: {stats['duplicate_count']}\n")
        f.write(f"  Average Syllables: {stats['average_syllables']:.2f}\n\n")
        
        f.write(f"ETYMOLOGY DISTRIBUTION:\n")
        for origin, count in stats['etymology_distribution'].items():
            percentage = (count / stats['total_words']) * 100
            f.write(f"  {origin.replace('_', ' ').title()}: {count} ({percentage:.1f}%)\n")
        f.write(f"\n")
        
        f.write(f"CHINESE LEARNER INSIGHTS:\n")
        f.write(f"  Sino-Vietnamese words: {insights['sino_vietnamese_count']} ({insights['sino_vietnamese_ratio']:.1%})\n")
        f.write(f"  Learning approach: {'Leverage Chinese knowledge' if insights['sino_vietnamese_ratio'] > 0.5 else 'Mixed approach recommended'}\n")
        if insights['sino_vietnamese_words']:
            f.write(f"  Sample Sino-Vietnamese words: {', '.join(insights['sino_vietnamese_words'])}\n")
        f.write(f"\n")
        
        f.write(f"FREQUENCY DISTRIBUTION:\n")
        for freq_range, count in stats['frequency_ranges'].items():
            percentage = (count / stats['total_words']) * 100
            f.write(f"  {freq_range.replace('_', ' ').title()}: {count} ({percentage:.1f}%)\n")
        f.write(f"\n")
        
        f.write(f"SYLLABLE STRUCTURE:\n")
        for syl_count, count in sorted(stats['syllable_distribution'].items())[:5]:
            percentage = (count / stats['total_words']) * 100
            f.write(f"  {syl_count} syllable(s): {count} ({percentage:.1f}%)\n")
        f.write(f"\n")
        
        f.write(f"MOST COMMON TONE PATTERNS:\n")
        # Now tone_distribution is a list of tuples, so we can slice it
        for tone_pattern, count in stats['tone_distribution'][:5]:
            percentage = (count / stats['total_words']) * 100
            f.write(f"  {tone_pattern}: {count} ({percentage:.1f}%)\n")
        f.write(f"\n")
        
        f.write(f"TOP PART-OF-SPEECH TAGS:\n")
        # Now pos_distribution is a list of tuples, so we can slice it
        for pos, count in stats['pos_distribution'][:5]:
            f.write(f"  {pos}: {count}\n")

def create_file_csv(file_num, vocabulary_items, output_file):
    """Create a detailed CSV file for a specific vocabulary file."""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("word,syllable_count,frequency,etymology_origin,tone_pattern,pos_tags\n")
        
        for item in vocabulary_items:
            word = item['vietnamese']
            syllable_count = len(item.get('syllables', []))
            frequency = item.get('frequency', 0)
            etymology_origin = item.get('etymology', {}).get('origin', 'unknown')
            
            # Get tone pattern from first form
            tone_pattern = 'unknown'
            forms = item.get('forms', [])
            if forms:
                tone_pattern = forms[0].get('transcriptions', {}).get('tone_pattern', 'unknown')
            
            pos_tags = "|".join(item.get('pos', []))
            
            f.write(f"{word},{syllable_count},{frequency},{etymology_origin},{tone_pattern},{pos_tags}\n")
