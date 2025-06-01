#!/usr/bin/env python3
"""
Production Vietnamese Duplicate Analyzer
This script is designed to work with the actual vietnamese_enriched.json file
when it becomes available, and will generate comprehensive duplicate reports.
"""

import json
import os
from collections import defaultdict, Counter
from datetime import datetime

def load_vietnamese_enriched_data():
    """Load Vietnamese vocabulary from the enriched data file."""
    
    enriched_path = "C:/Users/TY_Windows/Documents/Development/vietnamese-chinese-learning/scripts/data/enriched/vietnamese_vocabulary/vietnamese_enriched.json"
    
    try:
        if os.path.exists(enriched_path):
            with open(enriched_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                print(f"✅ Loaded {len(data)} items from vietnamese_enriched.json")
                return data
        else:
            print(f"❌ File not found: {enriched_path}")
            print("📝 This script is designed to work with the actual enriched data file.")
            print("   When the file is available, run this script again for complete analysis.")
            return None
            
    except Exception as e:
        print(f"❌ Error loading {enriched_path}: {e}")
        return None

def analyze_vocabulary_structure(vocabulary_data):
    """Analyze the structure of vocabulary data to understand the format."""
    
    if not vocabulary_data:
        return
    
    print(f"\n📊 VOCABULARY DATA STRUCTURE ANALYSIS:")
    print(f"=" * 50)
    
    # Sample first item to understand structure
    if len(vocabulary_data) > 0:
        sample_item = vocabulary_data[0]
        print(f"Sample item structure:")
        for key, value in sample_item.items():
            value_type = type(value).__name__
            if isinstance(value, list) and len(value) > 0:
                value_preview = f"[{type(value[0]).__name__}...] (length: {len(value)})"
            elif isinstance(value, dict):
                value_preview = f"dict with keys: {list(value.keys())}"
            else:
                value_preview = f"{value}" if len(str(value)) < 50 else f"{str(value)[:47]}..."
            print(f"  {key}: {value_type} = {value_preview}")
    
    # Analyze frequency distribution if available
    frequencies = []
    pos_tags = []
    origins = []
    
    for item in vocabulary_data[:100]:  # Sample first 100 items
        if 'frequency' in item:
            frequencies.append(item['frequency'])
        if 'pos' in item:
            if isinstance(item['pos'], list):
                pos_tags.extend(item['pos'])
            else:
                pos_tags.append(item['pos'])
        if 'etymology' in item and isinstance(item['etymology'], dict):
            if 'origin' in item['etymology']:
                origins.append(item['etymology']['origin'])
    
    if frequencies:
        print(f"\nFrequency analysis (first 100 items):")
        print(f"  Min frequency: {min(frequencies)}")
        print(f"  Max frequency: {max(frequencies)}")
        print(f"  Average frequency: {sum(frequencies)/len(frequencies):.1f}")
    
    if pos_tags:
        pos_counter = Counter(pos_tags)
        print(f"\nTop POS tags: {dict(pos_counter.most_common(5))}")
    
    if origins:
        origin_counter = Counter(origins)
        print(f"Etymology origins: {dict(origin_counter.most_common(5))}")

def extract_vietnamese_words(vocabulary_data):
    """Extract Vietnamese words and their metadata from the enriched data."""
    
    words_data = []
    
    for item in vocabulary_data:
        # Extract the Vietnamese word
        vietnamese_word = item.get('vietnamese', '')
        
        if not vietnamese_word:
            continue
        
        # Extract frequency (default to 0 if not available)
        frequency = item.get('frequency', 0)
        
        # Extract other metadata
        pos = item.get('pos', [])
        syllables = item.get('syllables', [])
        etymology = item.get('etymology', {})
        forms = item.get('forms', [])
        
        words_data.append({
            'word': vietnamese_word,
            'frequency': frequency,
            'pos': pos,
            'syllables': syllables,
            'etymology': etymology,
            'forms': forms,
            'original_item': item
        })
    
    return words_data

def categorize_by_advanced_frequency(words_data):
    """Categorize words using more sophisticated frequency analysis."""
    
    frequencies = [item['frequency'] for item in words_data if item['frequency'] > 0]
    
    if not frequencies:
        print("⚠️ No frequency data available, using default categorization")
        return categorize_by_default_frequency(words_data)
    
    # Calculate dynamic thresholds based on frequency distribution
    frequencies.sort(reverse=True)
    total_words = len(frequencies)
    
    # Dynamic thresholds based on percentiles
    percentiles = {
        'A1': frequencies[int(total_words * 0.1)],   # Top 10%
        'A2': frequencies[int(total_words * 0.25)],  # Top 25%
        'B1': frequencies[int(total_words * 0.5)],   # Top 50%
        'B2': frequencies[int(total_words * 0.75)],  # Top 75%
        'C1': frequencies[int(total_words * 0.9)],   # Top 90%
        'C2': 0  # Bottom 10%
    }
    
    print(f"📊 Dynamic frequency thresholds:")
    for level, threshold in percentiles.items():
        print(f"  {level}: {threshold}+")
    
    # Categorize words
    level_words = defaultdict(list)
    
    for word_data in words_data:
        frequency = word_data['frequency']
        
        # Assign to highest applicable level
        assigned_level = 'C2'  # Default
        
        for level in ['A1', 'A2', 'B1', 'B2', 'C1']:
            if frequency >= percentiles[level]:
                assigned_level = level
                break
        
        level_words[assigned_level].append(word_data)
    
    return level_words

def categorize_by_default_frequency(words_data):
    """Fallback categorization when no frequency data is available."""
    
    # Default thresholds
    frequency_thresholds = {
        'A1': (80, 100),
        'A2': (60, 79),
        'B1': (40, 59),
        'B2': (30, 39),
        'C1': (15, 29),
        'C2': (0, 14)
    }
    
    level_words = defaultdict(list)
    
    for word_data in words_data:
        frequency = word_data['frequency']
        
        assigned_level = 'C2'  # Default
        for level, (min_freq, max_freq) in frequency_thresholds.items():
            if min_freq <= frequency <= max_freq:
                assigned_level = level
                break
        
        level_words[assigned_level].append(word_data)
    
    return level_words

def perform_comprehensive_duplicate_analysis(level_words):
    """Perform comprehensive duplicate analysis."""
    
    print(f"\n🔍 COMPREHENSIVE DUPLICATE ANALYSIS:")
    print(f"=" * 50)
    
    # Within-level duplicates
    within_level_duplicates = {}
    
    for level, words in level_words.items():
        word_counts = Counter(word_data['word'] for word_data in words)
        duplicates = [(word, count) for word, count in word_counts.items() if count > 1]
        
        if duplicates:
            within_level_duplicates[level] = []
            for word, count in duplicates:
                instances = [wd for wd in words if wd['word'] == word]
                within_level_duplicates[level].append({
                    'word': word,
                    'count': count,
                    'instances': instances,
                    'frequency_range': [inst['frequency'] for inst in instances],
                    'pos_variants': list(set(str(inst['pos']) for inst in instances))
                })
    
    # Cross-level duplicates
    all_words = {}
    for level, words in level_words.items():
        for word_data in words:
            word = word_data['word']
            if word not in all_words:
                all_words[word] = []
            all_words[word].append((level, word_data))
    
    cross_level_duplicates = {}
    for word, level_data in all_words.items():
        levels = [ld[0] for ld in level_data]
        if len(set(levels)) > 1:
            cross_level_duplicates[word] = {
                'levels': list(set(levels)),
                'instances': level_data,
                'frequency_range': [ld[1]['frequency'] for ld in level_data]
            }
    
    return within_level_duplicates, cross_level_duplicates

def generate_production_duplicate_reports(within_level_duplicates, cross_level_duplicates, level_words, output_dir):
    """Generate production-quality duplicate reports."""
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Generate individual level reports
    for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
        filename = f"vietnamese_level_{level.lower()}_duplicates.txt"
        filepath = os.path.join(output_dir, filename)
        
        level_word_count = len(level_words.get(level, []))
        within_dups = within_level_duplicates.get(level, [])
        cross_dups = [word for word, data in cross_level_duplicates.items() if level in data['levels']]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"# Vietnamese Vocabulary - CEFR Level {level} Duplicates\n")
            f.write(f"# Generated: {timestamp}\n")
            f.write(f"# Total words in level: {level_word_count}\n")
            f.write(f"# Within-level duplicates: {len(within_dups)}\n")
            f.write(f"# Cross-level duplicates: {len(cross_dups)}\n")
            f.write(f"# Frequency range: Level {level} words\n")
            f.write("\n")
            
            if within_dups:
                f.write("# Within-level duplicates (same word appears multiple times in this level):\n")
                for dup_info in within_dups:
                    word = dup_info['word']
                    count = dup_info['count']
                    freq_range = dup_info['frequency_range']
                    pos_variants = dup_info['pos_variants']
                    f.write(f"{word}  # appears {count} times, frequencies: {freq_range}, POS: {pos_variants}\n")
                f.write("\n")
            else:
                f.write("# No within-level duplicates found\n\n")
            
            if cross_dups:
                f.write("# Cross-level duplicates (words that also appear in other levels):\n")
                for word in sorted(cross_dups):
                    other_levels = [l for l in cross_level_duplicates[word]['levels'] if l != level]
                    freq_range = cross_level_duplicates[word]['frequency_range']
                    f.write(f"{word}  # also in levels: {', '.join(sorted(other_levels))}, frequencies: {freq_range}\n")
            else:
                f.write("# No cross-level duplicates found for this level\n")
        
        print(f"✅ Generated {filename}: {len(within_dups)} within-level, {len(cross_dups)} cross-level duplicates")
    
    # Generate master report
    master_path = os.path.join(output_dir, "vietnamese_duplicates_master_report.txt")
    
    total_within = sum(len(dups) for dups in within_level_duplicates.values())
    total_cross = len(cross_level_duplicates)
    total_words = sum(len(words) for words in level_words.values())
    
    with open(master_path, 'w', encoding='utf-8') as f:
        f.write("# Vietnamese Vocabulary Master Duplicates Report\n")
        f.write(f"# Generated: {timestamp}\n")
        f.write("# This report shows all duplicate words found across the Vietnamese vocabulary dataset\n")
        f.write(f"# Source: vietnamese_enriched.json\n")
        f.write("\n")
        f.write("="*60 + "\n")
        f.write("DUPLICATE ANALYSIS SUMMARY\n")
        f.write("="*60 + "\n")
        f.write(f"Total vocabulary items analyzed: {total_words}\n")
        f.write(f"Within-level duplicates: {total_within}\n")
        f.write(f"Cross-level duplicates: {total_cross}\n")
        f.write(f"Duplicate rate: {((total_within + total_cross) / total_words * 100):.1f}%\n")
        f.write("\n")
        
        # Level distribution
        f.write("VOCABULARY DISTRIBUTION BY LEVEL:\n")
        f.write("-" * 40 + "\n")
        for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
            count = len(level_words.get(level, []))
            percentage = (count / total_words * 100) if total_words > 0 else 0
            f.write(f"Level {level}: {count:4d} words ({percentage:5.1f}%)\n")
        f.write("\n")
        
        # Detailed duplicate information
        f.write("DETAILED DUPLICATE ANALYSIS:\n")
        f.write("-" * 40 + "\n")
        
        for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
            if level in within_level_duplicates:
                f.write(f"\n{level} Within-Level Duplicates:\n")
                for dup_info in within_level_duplicates[level]:
                    f.write(f"  - {dup_info['word']} (appears {dup_info['count']} times)\n")
                    f.write(f"    Frequencies: {dup_info['frequency_range']}\n")
                    f.write(f"    POS variants: {dup_info['pos_variants']}\n")
        
        if cross_level_duplicates:
            f.write(f"\nCross-Level Duplicates:\n")
            for word, data in sorted(cross_level_duplicates.items()):
                f.write(f"  - {word}: levels {', '.join(sorted(data['levels']))}\n")
                f.write(f"    Frequencies: {data['frequency_range']}\n")
    
    print(f"✅ Generated master report: {master_path}")
    
    return len(within_level_duplicates) + 1  # Number of files generated

def main():
    """Main function for production duplicate analysis."""
    
    print("🔍 PRODUCTION VIETNAMESE VOCABULARY DUPLICATE ANALYZER")
    print("="*60)
    
    # Load enriched data
    vocabulary_data = load_vietnamese_enriched_data()
    
    if not vocabulary_data:
        print("\n📝 Note: This script requires the vietnamese_enriched.json file.")
        print("   Place the file at:")
        print("   C:/Users/TY_Windows/Documents/Development/vietnamese-chinese-learning/scripts/data/enriched/vietnamese_vocabulary/vietnamese_enriched.json")
        print("\n   Once available, run this script again for complete analysis.")
        return
    
    # Analyze data structure
    analyze_vocabulary_structure(vocabulary_data)
    
    # Extract words
    print(f"\n📚 Extracting Vietnamese words...")
    words_data = extract_vietnamese_words(vocabulary_data)
    print(f"✅ Extracted {len(words_data)} Vietnamese words")
    
    # Categorize by frequency
    print(f"\n📊 Categorizing by CEFR levels...")
    level_words = categorize_by_advanced_frequency(words_data)
    
    # Show distribution
    print(f"\nLevel distribution:")
    for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
        count = len(level_words.get(level, []))
        print(f"  {level}: {count} words")
    
    # Analyze duplicates
    within_level_duplicates, cross_level_duplicates = perform_comprehensive_duplicate_analysis(level_words)
    
    # Generate reports
    output_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"\n📝 Generating comprehensive duplicate reports...")
    
    files_generated = generate_production_duplicate_reports(
        within_level_duplicates, 
        cross_level_duplicates, 
        level_words, 
        output_dir
    )
    
    # Final summary
    total_within = sum(len(dups) for dups in within_level_duplicates.values())
    total_cross = len(cross_level_duplicates)
    
    print(f"\n" + "="*60)
    print(f"✅ PRODUCTION ANALYSIS COMPLETE!")
    print(f"="*60)
    print(f"📊 Results Summary:")
    print(f"  - Total vocabulary items: {len(words_data)}")
    print(f"  - Within-level duplicates: {total_within}")
    print(f"  - Cross-level duplicates: {total_cross}")
    print(f"  - Files generated: {files_generated}")
    print(f"\n📁 Reports saved to: {output_dir}")
    
    if total_within > 0 or total_cross > 0:
        print(f"\n⚠️  Duplicates found - review reports for details")

if __name__ == "__main__":
    main()
