#!/usr/bin/env python3
"""
Vietnamese Vocabulary Duplicate Analyzer
This script analyzes Vietnamese vocabulary data to identify and list duplicate words by CEFR level.
"""

import json
import os
from collections import defaultdict, Counter
from datetime import datetime

def load_vocabulary_data():
    """Load Vietnamese vocabulary from available data sources."""
    
    # Try multiple sources
    sources = [
        "C:/Users/TY_Windows/Documents/Development/vietnamese-chinese-learning/scripts/data/enriched/vietnamese_vocabulary/vietnamese_enriched.json",
        "./sample_vietnamese_data.json",
        "sample_vietnamese_data.json"
    ]
    
    for source in sources:
        try:
            if os.path.exists(source):
                with open(source, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    print(f"✅ Loaded {len(data)} items from {source}")
                    return data
        except Exception as e:
            print(f"❌ Error loading {source}: {e}")
            continue
    
    # If no file found, create sample data based on your reference
    print("📝 Creating sample data for duplicate analysis...")
    return create_sample_data()

def create_sample_data():
    """Create sample Vietnamese vocabulary data with duplicates for testing."""
    
    sample_data = [
        # A1 Level - Very high frequency (80-100)
        {"vietnamese": "tôi", "frequency": 95, "pos": ["pronoun"]},
        {"vietnamese": "bạn", "frequency": 92, "pos": ["pronoun"]},
        {"vietnamese": "cảm ơn", "frequency": 90, "pos": ["interjection"]},
        {"vietnamese": "xin chào", "frequency": 88, "pos": ["interjection"]},
        {"vietnamese": "tôi", "frequency": 94, "pos": ["pronoun"]},  # Duplicate
        {"vietnamese": "là", "frequency": 96, "pos": ["verb"]},
        {"vietnamese": "có", "frequency": 93, "pos": ["verb"]},
        {"vietnamese": "không", "frequency": 91, "pos": ["adverb"]},
        {"vietnamese": "cảm ơn", "frequency": 89, "pos": ["interjection"]},  # Duplicate
        
        # A2 Level - High frequency (60-79)
        {"vietnamese": "học sinh", "frequency": 78, "pos": ["noun"]},
        {"vietnamese": "gia đình", "frequency": 75, "pos": ["noun"]},
        {"vietnamese": "thích", "frequency": 72, "pos": ["verb"]},
        {"vietnamese": "học", "frequency": 70, "pos": ["verb"]},
        {"vietnamese": "xin chào", "frequency": 76, "pos": ["interjection"]},  # Duplicate from A1
        {"vietnamese": "nhà", "frequency": 74, "pos": ["noun"]},
        {"vietnamese": "học sinh", "frequency": 77, "pos": ["noun"]},  # Duplicate
        {"vietnamese": "yêu", "frequency": 68, "pos": ["verb"]},
        {"vietnamese": "thích", "frequency": 71, "pos": ["verb"]},  # Duplicate
        
        # B1 Level - Medium frequency (40-59)
        {"vietnamese": "giáo viên", "frequency": 58, "pos": ["noun"]},
        {"vietnamese": "trường học", "frequency": 55, "pos": ["noun"]},
        {"vietnamese": "công việc", "frequency": 52, "pos": ["noun"]},
        {"vietnamese": "sinh viên", "frequency": 48, "pos": ["noun"]},
        {"vietnamese": "giáo viên", "frequency": 56, "pos": ["noun"]},  # Duplicate
        {"vietnamese": "bệnh viện", "frequency": 45, "pos": ["noun"]},
        {"vietnamese": "học", "frequency": 50, "pos": ["verb"]},  # Duplicate from A2
        
        # B2 Level - Low-medium frequency (30-39)
        {"vietnamese": "chính phủ", "frequency": 38, "pos": ["noun"]},
        {"vietnamese": "kinh tế", "frequency": 35, "pos": ["noun"]},
        {"vietnamese": "văn hóa", "frequency": 32, "pos": ["noun"]},
        {"vietnamese": "xã hội", "frequency": 36, "pos": ["noun"]},
        {"vietnamese": "chính phủ", "frequency": 37, "pos": ["noun"]},  # Duplicate
        
        # C1 Level - Low frequency (15-29)
        {"vietnamese": "triết học", "frequency": 25, "pos": ["noun"]},
        {"vietnamese": "nghiên cứu", "frequency": 22, "pos": ["noun", "verb"]},
        {"vietnamese": "phát triển", "frequency": 28, "pos": ["verb"]},
        {"vietnamese": "khoa học", "frequency": 20, "pos": ["noun"]},
        
        # C2 Level - Very low frequency (0-14)
        {"vietnamese": "siêu hình học", "frequency": 8, "pos": ["noun"]},
        {"vietnamese": "nhân chủng học", "frequency": 5, "pos": ["noun"]},
        {"vietnamese": "vũ trụ học", "frequency": 12, "pos": ["noun"]},
        {"vietnamese": "triết lý", "frequency": 10, "pos": ["noun"]},
    ]
    
    return sample_data

def categorize_by_frequency(vocabulary_items):
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
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    generated_files = []
    
    # Generate within-level duplicate files
    for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
        filename = f"vietnamese_level_{level.lower()}_duplicates.txt"
        filepath = os.path.join(output_dir, filename)
        
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
        
        generated_files.append(filepath)
        
        # Count duplicates for reporting
        within_count = len(within_level_duplicates.get(level, []))
        cross_count = len([word for word, levels in cross_level_duplicates.items() if level in levels])
        print(f"Generated {filename}: {within_count} within-level, {cross_count} cross-level duplicates")
    
    return generated_files

def generate_master_duplicate_report(within_level_duplicates, cross_level_duplicates, output_dir):
    """Generate a master report of all duplicates."""
    
    report_path = os.path.join(output_dir, "vietnamese_duplicates_master_report.txt")
    
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
    
    print(f"Generated master report: {report_path}")
    return report_path

def main():
    """Main function to analyze Vietnamese vocabulary duplicates."""
    
    print("🔍 Vietnamese Vocabulary Duplicate Analyzer")
    print("="*50)
    
    # Load data
    print("📚 Loading vocabulary data...")
    vocabulary_data = load_vocabulary_data()
    
    if not vocabulary_data:
        print("❌ No vocabulary data available. Exiting.")
        return
    
    print(f"✅ Loaded {len(vocabulary_data)} vocabulary items")
    
    # Categorize by frequency levels
    print("📊 Categorizing words by CEFR levels...")
    level_words = categorize_by_frequency(vocabulary_data)
    
    # Show level distribution
    for level in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
        count = len(level_words.get(level, []))
        print(f"  Level {level}: {count} words")
    
    # Find duplicates
    print("🔍 Analyzing duplicates...")
    within_level_duplicates, cross_level_duplicates = find_duplicates_in_levels(level_words)
    
    # Set output directory
    output_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Generate reports
    print("📝 Generating duplicate reports...")
    generated_files = generate_duplicate_reports(within_level_duplicates, cross_level_duplicates, output_dir)
    
    # Generate master report
    master_report = generate_master_duplicate_report(within_level_duplicates, cross_level_duplicates, output_dir)
    
    # Summary
    print("\n" + "="*60)
    print("✅ DUPLICATE ANALYSIS COMPLETE!")
    print("="*60)
    
    total_within = sum(len(dups) for dups in within_level_duplicates.values())
    total_cross = len(cross_level_duplicates)
    
    print(f"📊 Summary:")
    print(f"  - Within-level duplicates: {total_within}")
    print(f"  - Cross-level duplicates: {total_cross}")
    print(f"  - Generated files: {len(generated_files) + 1}")
    print(f"\n📁 All files saved to: {output_dir}")
    
    if total_within > 0 or total_cross > 0:
        print(f"\n⚠️  Found duplicates that may need review!")
        print(f"   Check the generated reports for details.")

if __name__ == "__main__":
    main()
