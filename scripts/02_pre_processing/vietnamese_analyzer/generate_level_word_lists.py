#!/usr/bin/env python3
"""
Generate Vietnamese word lists by difficulty level (A1-C2) based on frequency analysis
This script reads the Vietnamese enriched data and creates level-specific word lists.
"""

import json
import os
from collections import defaultdict
from datetime import datetime

def load_vietnamese_vocabulary():
    """Load Vietnamese vocabulary from enriched data file."""
    try:
        # Try the main enriched file first
        enriched_path = "C:/Users/TY_Windows/Documents/Development/vietnamese-chinese-learning/scripts/data/enriched/vietnamese_vocabulary/vietnamese_enriched.json"
        if os.path.exists(enriched_path):
            with open(enriched_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        # Fallback to sample data for testing
        sample_path = "C:/Users/TY_Windows/Documents/Development/vietnamese-chinese-learning/scripts/02_pre_processing/vietnamese_analyzer/sample_vietnamese_data.json"
        if os.path.exists(sample_path):
            with open(sample_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        print("No Vietnamese vocabulary data found!")
        return []
        
    except Exception as e:
        print(f"Error loading vocabulary data: {e}")
        return []

def categorize_by_frequency(vocabulary_items):
    """Categorize Vietnamese words by frequency into CEFR levels."""
    
    # Define frequency thresholds for CEFR levels
    # Based on frequency analysis: very_high (80-100), high (60-79), medium (40-59), low (20-39), very_low (0-19)
    frequency_thresholds = {
        'A1': (80, 100),    # Very high frequency - most common words
        'A2': (60, 79),     # High frequency - common words
        'B1': (40, 59),     # Medium frequency - intermediate words
        'B2': (30, 39),     # Low-medium frequency
        'C1': (15, 29),     # Low frequency - advanced words
        'C2': (0, 14)       # Very low frequency - rare/academic words
    }
    
    level_words = defaultdict(list)
    level_stats = defaultdict(lambda: {'count': 0, 'words': []})
    
    for item in vocabulary_items:
        word = item.get('vietnamese', '')
        frequency = item.get('frequency', 0)
        
        # Skip empty words
        if not word:
            continue
            
        # Categorize by frequency
        assigned_level = None
        for level, (min_freq, max_freq) in frequency_thresholds.items():
            if min_freq <= frequency <= max_freq:
                assigned_level = level
                break
        
        # If no level assigned (shouldn't happen), put in C2
        if not assigned_level:
            assigned_level = 'C2'
        
        level_words[assigned_level].append({
            'word': word,
            'frequency': frequency,
            'etymology': item.get('etymology', {}),
            'pos': item.get('pos', []),
            'syllables': item.get('syllables', [])
        })
        
        level_stats[assigned_level]['count'] += 1
        level_stats[assigned_level]['words'].append(word)
    
    return level_words, level_stats

def remove_duplicates_from_levels(level_words):
    """Remove duplicate words within each level and across levels."""
    seen_words = set()
    cleaned_levels = defaultdict(list)
    duplicate_info = defaultdict(list)
    
    # Process levels in order A1 -> C2 (highest to lowest priority)
    level_order = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    
    for level in level_order:
        if level not in level_words:
            continue
            
        current_level_words = []
        level_duplicates = []
        
        for word_data in level_words[level]:
            word = word_data['word']
            
            if word in seen_words:
                level_duplicates.append(word)
            else:
                seen_words.add(word)
                current_level_words.append(word_data)
        
        cleaned_levels[level] = current_level_words
        if level_duplicates:
            duplicate_info[level] = level_duplicates
    
    return cleaned_levels, duplicate_info

def generate_word_list_files(level_words, output_dir):
    """Generate .txt files for each level containing word lists."""
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    generated_files = []
    
    for level, words in level_words.items():
        # Sort words by frequency (descending) then alphabetically
        sorted_words = sorted(words, key=lambda x: (-x['frequency'], x['word']))
        
        # Extract just the word strings for the text file
        word_list = [word_data['word'] for word_data in sorted_words]
        
        # Generate filename
        filename = f"vietnamese_level_{level.lower()}_words.txt"
        filepath = os.path.join(output_dir, filename)
        
        # Write to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"# Vietnamese Vocabulary - CEFR Level {level}\n")
            f.write(f"# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"# Total words: {len(word_list)}\n")
            f.write(f"# Frequency range: Based on usage frequency analysis\n")
            f.write("\n")
            
            for word in word_list:
                f.write(f"{word}\n")
        
        generated_files.append(filepath)
        print(f"Generated {filename} with {len(word_list)} words")
    
    return generated_files

def generate_duplicate_report(duplicate_info, output_dir):
    """Generate a report of duplicate words found across levels."""
    
    if not duplicate_info:
        print("No duplicates found!")
        return None
    
    report_path = os.path.join(output_dir, "vietnamese_duplicates_report.txt")
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# Vietnamese Vocabulary Duplicates Report\n")
        f.write(f"# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("\n")
        
        total_duplicates = sum(len(dups) for dups in duplicate_info.values())
        f.write(f"Total duplicate words found: {total_duplicates}\n\n")
        
        for level, duplicates in duplicate_info.items():
            f.write(f"Level {level} duplicates ({len(duplicates)} words):\n")
            for word in sorted(duplicates):
                f.write(f"  - {word}\n")
            f.write("\n")
    
    print(f"Generated duplicates report: {report_path}")
    return report_path

def generate_summary_report(level_words, duplicate_info, output_dir):
    """Generate a summary report of the level categorization."""
    
    report_path = os.path.join(output_dir, "vietnamese_levels_summary.txt")
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# Vietnamese Vocabulary Levels Summary\n")
        f.write(f"# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("\n")
        
        f.write("LEVEL DISTRIBUTION:\n")
        f.write("-" * 50 + "\n")
        
        total_words = sum(len(words) for words in level_words.values())
        total_duplicates = sum(len(dups) for dups in duplicate_info.values())
        
        for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
            if level in level_words:
                count = len(level_words[level])
                percentage = (count / total_words * 100) if total_words > 0 else 0
                f.write(f"Level {level}: {count:4d} words ({percentage:5.1f}%)\n")
        
        f.write("-" * 50 + "\n")
        f.write(f"Total unique words: {total_words}\n")
        f.write(f"Total duplicates removed: {total_duplicates}\n")
        
        f.write("\n")
        f.write("LEVEL DESCRIPTIONS:\n")
        f.write("-" * 50 + "\n")
        f.write("A1 (Beginner): Very high frequency words (80-100)\n")
        f.write("A2 (Elementary): High frequency words (60-79)\n")
        f.write("B1 (Intermediate): Medium frequency words (40-59)\n")
        f.write("B2 (Upper-Intermediate): Low-medium frequency words (30-39)\n")
        f.write("C1 (Advanced): Low frequency words (15-29)\n")
        f.write("C2 (Proficiency): Very low frequency words (0-14)\n")
        
        f.write("\n")
        f.write("SAMPLE WORDS BY LEVEL:\n")
        f.write("-" * 50 + "\n")
        
        for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
            if level in level_words and level_words[level]:
                # Show top 10 words by frequency for each level
                sorted_words = sorted(level_words[level], key=lambda x: -x['frequency'])
                sample_words = [w['word'] for w in sorted_words[:10]]
                f.write(f"{level}: {', '.join(sample_words)}\n")
    
    print(f"Generated summary report: {report_path}")
    return report_path

def main():
    """Main function to generate Vietnamese level-based word lists."""
    
    print("🔍 Loading Vietnamese vocabulary data...")
    vocabulary_items = load_vietnamese_vocabulary()
    
    if not vocabulary_items:
        print("❌ No vocabulary data loaded. Exiting.")
        return
    
    print(f"✅ Loaded {len(vocabulary_items)} vocabulary items")
    
    print("📊 Categorizing words by frequency levels...")
    level_words, level_stats = categorize_by_frequency(vocabulary_items)
    
    print("🧹 Removing duplicate words...")
    cleaned_level_words, duplicate_info = remove_duplicates_from_levels(level_words)
    
    # Set output directory
    output_dir = "C:/Users/TY_Windows/Documents/Development/vietnamese-chinese-learning/scripts/02_pre_processing/vietnamese_analyzer"
    
    print("📝 Generating word list files...")
    generated_files = generate_word_list_files(cleaned_level_words, output_dir)
    
    print("📋 Generating reports...")
    generate_duplicate_report(duplicate_info, output_dir)
    generate_summary_report(cleaned_level_words, duplicate_info, output_dir)
    
    print("\n" + "="*60)
    print("✅ GENERATION COMPLETE!")
    print("="*60)
    print(f"Generated {len(generated_files)} level files:")
    for file_path in generated_files:
        filename = os.path.basename(file_path)
        level = filename.split('_')[2].upper()
        word_count = len(cleaned_level_words.get(level, []))
        print(f"  - {filename}: {word_count} words")
    
    if duplicate_info:
        total_dups = sum(len(dups) for dups in duplicate_info.values())
        print(f"\n⚠️  Found and removed {total_dups} duplicate words")
    
    print(f"\n📁 All files saved to: {output_dir}")

if __name__ == "__main__":
    main()
