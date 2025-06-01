#!/usr/bin/env python3
"""
Vietnamese Missing Vocabulary Analysis Script
===========================================

This script analyzes Vietnamese vocabulary data to find words that exist in raw Vietnamese files
but are missing from the enriched Vietnamese vocabulary files.

Author: AI Assistant
Date: 2025
"""

import json
import os
from datetime import datetime
from collections import defaultdict
import csv
import time

class VietnameseMissingVocabularyAnalyzer:
    def __init__(self, raw_data_dir, enriched_data_dir, output_dir):
        self.raw_data_dir = raw_data_dir
        self.enriched_data_dir = enriched_data_dir
        self.output_dir = output_dir
        self.raw_vocabulary = {}  # word -> full data
        self.enriched_vocabulary = set()  # set of Vietnamese words
        self.raw_words_set = set()  # set of raw Vietnamese words
        
    def load_raw_vietnamese_data(self):
        """Load vocabulary from raw Vietnamese JSON files"""
        print("Loading raw Vietnamese data...")
        
        # Check for vietnamese_raw_1.json first
        raw_file = os.path.join(self.raw_data_dir, "vietnamese_raw_1.json")
        
        if not os.path.exists(raw_file):
            print(f"Warning: Raw file {raw_file} not found")
            return
            
        try:
            print(f"  Loading {raw_file}...", end=" ")
            with open(raw_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            for item in data:
                if 'vietnamese' in item:
                    word = item['vietnamese']
                    self.raw_vocabulary[word] = item
                    self.raw_words_set.add(word)
            
            print(f"{len(self.raw_vocabulary)} words loaded")
            
        except Exception as e:
            print(f"Error loading {raw_file}: {e}")
    
    def load_enriched_vietnamese_data(self):
        """Load vocabulary from enriched Vietnamese JSON files"""
        print("\nLoading enriched Vietnamese data...")
        
        enriched_file = os.path.join(self.enriched_data_dir, "vietnamese_enriched.json")
        
        if not os.path.exists(enriched_file):
            print(f"Warning: Enriched file {enriched_file} not found")
            return
            
        try:
            print(f"  Loading {enriched_file}...", end=" ")
            with open(enriched_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            for item in data:
                if 'vietnamese' in item:
                    self.enriched_vocabulary.add(item['vietnamese'])
            
            print(f"{len(self.enriched_vocabulary)} words loaded")
            
        except Exception as e:
            print(f"Error loading {enriched_file}: {e}")
    
    def find_missing_words(self):
        """Find words that exist in raw data but missing from enriched data"""
        print("\nAnalyzing missing Vietnamese vocabulary...")
        
        missing_words = self.raw_words_set - self.enriched_vocabulary
        extra_words = self.enriched_vocabulary - self.raw_words_set
        
        print(f"  Raw Vietnamese words: {len(self.raw_words_set)}")
        print(f"  Enriched Vietnamese words: {len(self.enriched_vocabulary)}")
        print(f"  Missing words: {len(missing_words)}")
        print(f"  Extra words: {len(extra_words)}")
        
        return missing_words, extra_words
    
    def get_word_details(self, word):
        """Get detailed information about a word from raw data"""
        if word not in self.raw_vocabulary:
            return None
            
        try:
            item = self.raw_vocabulary[word]
            
            details = {
                'vietnamese': word,
                'frequency': item.get('frequency', 'N/A'),
                'pos': item.get('pos', []),
                'ipa': '',
                'meanings': [],
                'etymology': item.get('etymology', {}),
                'syllables': item.get('syllables', [])
            }
            
            # Extract pronunciation information
            if 'forms' in item and item['forms']:
                form = item['forms'][0]
                if 'transcriptions' in form:
                    transcriptions = form['transcriptions']
                    details['ipa'] = transcriptions.get('ipa', '')
                
                # Extract meanings
                if 'meanings' in form:
                    details['meanings'] = form['meanings'][:3]  # First 3 meanings
            
            return details
            
        except Exception as e:
            print(f"Error getting details for {word}: {e}")
            
        return None
    
    def categorize_missing_words(self, missing_words):
        """Categorize missing words by frequency, POS, etymology, etc."""
        print("\nCategorizing missing words...")
        
        categories = {
            'by_frequency': defaultdict(list),
            'by_pos': defaultdict(list),
            'by_etymology': defaultdict(list),
            'by_syllable_count': defaultdict(list)
        }
        
        for word in missing_words:
            details = self.get_word_details(word)
            if not details:
                continue
            
            # By frequency
            freq = details['frequency']
            if freq == 'N/A':
                freq_category = 'unknown'
            elif isinstance(freq, (int, float)):
                if freq >= 80:
                    freq_category = 'very_high'
                elif freq >= 60:
                    freq_category = 'high'
                elif freq >= 40:
                    freq_category = 'medium'
                elif freq >= 20:
                    freq_category = 'low'
                else:
                    freq_category = 'very_low'
            else:
                freq_category = 'unknown'
            
            categories['by_frequency'][freq_category].append(word)
            
            # By part of speech
            pos_list = details['pos'] if details['pos'] else ['unknown']
            for pos in pos_list:
                categories['by_pos'][pos].append(word)
            
            # By etymology
            etymology = details['etymology']
            origin = etymology.get('origin', 'unknown') if etymology else 'unknown'
            categories['by_etymology'][origin].append(word)
            
            # By syllable count
            syllable_count = len(details['syllables']) if details['syllables'] else 1
            categories['by_syllable_count'][syllable_count].append(word)
        
        return categories
    
    def generate_reports(self, missing_words, extra_words, categories):
        """Generate comprehensive analysis reports"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        print(f"\nGenerating reports for {len(missing_words)} missing Vietnamese words...")
        
        # Create reports directory
        reports_dir = os.path.join(self.output_dir, "vietnamese_missing_reports")
        os.makedirs(reports_dir, exist_ok=True)
        
        # Generate text report
        report_file = os.path.join(reports_dir, f"vietnamese_missing_report_{timestamp}.txt")
        print(f"  Creating text report...")
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("Vietnamese Missing Vocabulary Analysis Report\n")
            f.write("=" * 50 + "\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            f.write("SUMMARY STATISTICS\n")
            f.write("-" * 20 + "\n")
            f.write(f"Total Raw Vietnamese Vocabulary: {len(self.raw_words_set):,} words\n")
            f.write(f"Total Enriched Vietnamese Vocabulary: {len(self.enriched_vocabulary):,} words\n")
            f.write(f"Missing Words: {len(missing_words):,} words ({len(missing_words)/len(self.raw_words_set)*100:.1f}% gap)\n")
            f.write(f"Extra Words: {len(extra_words):,} words\n\n")
            
            # Completion percentage
            completion_percentage = (len(self.enriched_vocabulary) / len(self.raw_words_set) * 100) if self.raw_words_set else 0
            f.write(f"Completion Percentage: {completion_percentage:.1f}%\n\n")
            
            # Category analysis
            f.write("MISSING WORDS BY CATEGORY\n")
            f.write("-" * 30 + "\n")
            
            # By frequency
            f.write("By Frequency:\n")
            for freq_cat, words in sorted(categories['by_frequency'].items()):
                f.write(f"  {freq_cat}: {len(words)} words\n")
            f.write("\n")
            
            # By part of speech
            f.write("By Part of Speech:\n")
            for pos, words in sorted(categories['by_pos'].items(), key=lambda x: len(x[1]), reverse=True):
                f.write(f"  {pos}: {len(words)} words\n")
            f.write("\n")
            
            # By etymology
            f.write("By Etymology:\n")
            for origin, words in sorted(categories['by_etymology'].items(), key=lambda x: len(x[1]), reverse=True):
                f.write(f"  {origin}: {len(words)} words\n")
            f.write("\n")
            
            # By syllable count
            f.write("By Syllable Count:\n")
            for syllable_count, words in sorted(categories['by_syllable_count'].items()):
                f.write(f"  {syllable_count} syllable(s): {len(words)} words\n")
            f.write("\n")
            
            # High priority missing words (high frequency)
            f.write("HIGH PRIORITY MISSING WORDS (High Frequency)\n")
            f.write("-" * 45 + "\n")
            
            high_freq_words = categories['by_frequency'].get('very_high', []) + categories['by_frequency'].get('high', [])
            if high_freq_words:
                f.write(f"Found {len(high_freq_words)} high-frequency missing words:\n\n")
                
                for word in sorted(high_freq_words)[:50]:  # Show top 50
                    details = self.get_word_details(word)
                    if details:
                        f.write(f"• {word} (freq: {details['frequency']})\n")
                        if details['ipa']:
                            f.write(f"  IPA: {details['ipa']}\n")
                        if details['pos']:
                            f.write(f"  POS: {', '.join(details['pos'])}\n")
                        if details['meanings']:
                            meanings_text = '; '.join(details['meanings'][:2])
                            if len(meanings_text) > 100:
                                meanings_text = meanings_text[:100] + "..."
                            f.write(f"  Meanings: {meanings_text}\n")
                        f.write("\n")
                
                if len(high_freq_words) > 50:
                    f.write(f"... and {len(high_freq_words) - 50} more high-frequency words\n\n")
            else:
                f.write("No high-frequency missing words found.\n\n")
            
            # Sample of other missing words
            f.write("SAMPLE OF OTHER MISSING WORDS\n")
            f.write("-" * 35 + "\n")
            other_missing = [w for w in missing_words if w not in high_freq_words]
            sample_size = min(100, len(other_missing))
            
            if other_missing:
                f.write(f"Showing {sample_size} of {len(other_missing)} remaining missing words:\n\n")
                
                for word in sorted(other_missing)[:sample_size]:
                    details = self.get_word_details(word)
                    if details:
                        f.write(f"• {word} (freq: {details['frequency']}, pos: {', '.join(details['pos']) if details['pos'] else 'unknown'})\n")
                        if details['meanings']:
                            meanings_text = '; '.join(details['meanings'][:1])
                            if len(meanings_text) > 80:
                                meanings_text = meanings_text[:80] + "..."
                            f.write(f"  {meanings_text}\n")
                    else:
                        f.write(f"• {word}\n")
                
                if len(other_missing) > sample_size:
                    f.write(f"\n... and {len(other_missing) - sample_size} more words\n")
        
        # Generate CSV report for missing words
        print(f"  Creating CSV report...")
        csv_file = os.path.join(reports_dir, f"vietnamese_missing_{timestamp}.csv")
        
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Vietnamese', 'IPA', 'Frequency', 'POS', 'Etymology_Origin', 'Syllable_Count', 'Meanings'])
            
            for word in sorted(missing_words):
                details = self.get_word_details(word)
                if details:
                    etymology_origin = details['etymology'].get('origin', '') if details['etymology'] else ''
                    syllable_count = len(details['syllables']) if details['syllables'] else 1
                    
                    writer.writerow([
                        word,
                        details['ipa'],
                        details['frequency'],
                        ', '.join(details['pos']),
                        etymology_origin,
                        syllable_count,
                        ' | '.join(details['meanings'][:3])
                    ])
                else:
                    writer.writerow([word, '', '', '', '', '', ''])
        
        # Generate JSON summary
        print(f"  Creating JSON summary...")
        json_file = os.path.join(reports_dir, f"vietnamese_analysis_summary_{timestamp}.json")
        
        completion_percentage = (len(self.enriched_vocabulary) / len(self.raw_words_set) * 100) if self.raw_words_set else 0
        
        summary = {
            'analysis_date': datetime.now().isoformat(),
            'statistics': {
                'total_raw_vocabulary': len(self.raw_words_set),
                'total_enriched_vocabulary': len(self.enriched_vocabulary),
                'total_missing_words': len(missing_words),
                'total_extra_words': len(extra_words),
                'completion_percentage': completion_percentage
            },
            'missing_words': list(missing_words),
            'extra_words': list(extra_words),
            'categories': {
                'by_frequency': {k: list(v) for k, v in categories['by_frequency'].items()},
                'by_pos': {k: list(v) for k, v in categories['by_pos'].items()},
                'by_etymology': {k: list(v) for k, v in categories['by_etymology'].items()},
                'by_syllable_count': {k: list(v) for k, v in categories['by_syllable_count'].items()}
            }
        }
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        return report_file, csv_file, json_file
    
    def run_analysis(self):
        """Run the complete Vietnamese vocabulary analysis"""
        start_time = time.time()
        
        print("Starting Vietnamese Missing Vocabulary Analysis")
        print("=" * 55)
        
        # Load data
        self.load_raw_vietnamese_data()
        self.load_enriched_vietnamese_data()
        
        if not self.raw_words_set:
            print("No raw Vietnamese data found. Cannot proceed with analysis.")
            return
        
        # Analyze
        missing_words, extra_words = self.find_missing_words()
        
        if not missing_words:
            print("No missing words found! All raw vocabulary is already enriched.")
            return
        
        # Categorize missing words
        categories = self.categorize_missing_words(missing_words)
        
        # Generate reports
        report_file, csv_file, json_file = self.generate_reports(missing_words, extra_words, categories)
        
        # Print summary
        elapsed_time = time.time() - start_time
        completion_percentage = (len(self.enriched_vocabulary) / len(self.raw_words_set) * 100) if self.raw_words_set else 0
        
        print(f"\nAnalysis Complete! (took {elapsed_time:.1f} seconds)")
        print(f"Reports generated in vietnamese_missing_reports/ folder:")
        print(f"  • Text Report: {os.path.basename(report_file)}")
        print(f"  • CSV Data: {os.path.basename(csv_file)}")
        print(f"  • JSON Summary: {os.path.basename(json_file)}")
        print(f"\nSummary: {len(missing_words):,} missing words out of {len(self.raw_words_set):,} total ({len(missing_words)/len(self.raw_words_set)*100:.1f}% gap)")
        print(f"Completion: {completion_percentage:.1f}% of Vietnamese vocabulary enriched")
        
        # Print priority breakdown
        print(f"\nPriority breakdown:")
        high_freq_count = len(categories['by_frequency'].get('very_high', [])) + len(categories['by_frequency'].get('high', []))
        medium_freq_count = len(categories['by_frequency'].get('medium', []))
        low_freq_count = len(categories['by_frequency'].get('low', [])) + len(categories['by_frequency'].get('very_low', []))
        
        print(f"  High priority (high frequency): {high_freq_count:,} words")
        print(f"  Medium priority: {medium_freq_count:,} words")
        print(f"  Low priority (low frequency): {low_freq_count:,} words")

def main():
    # Define paths relative to the script location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Navigate to project root from scripts/04_data_analysis/vietnamese_analysis/
    project_root = os.path.join(script_dir, '..', '..', '..')
    project_root = os.path.abspath(project_root)
    
    # Define data paths for Vietnamese vocabulary
    raw_data_dir = os.path.join(project_root, 'scripts', 'data', 'vietnamese_generated')
    enriched_data_dir = os.path.join(project_root, 'scripts', 'data', 'enriched', 'vietnamese_vocabulary')
    output_dir = os.path.join(project_root, 'scripts', 'analysis_output')
    
    print(f"Project root: {project_root}")
    print(f"Raw Vietnamese data directory: {raw_data_dir}")
    print(f"Enriched Vietnamese data directory: {enriched_data_dir}")
    print(f"Output directory: {output_dir}")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Verify paths exist
    if not os.path.exists(raw_data_dir):
        print(f"Error: Raw Vietnamese data directory does not exist: {raw_data_dir}")
        return
    
    if not os.path.exists(enriched_data_dir):
        print(f"Error: Enriched Vietnamese data directory does not exist: {enriched_data_dir}")
        return
    
    # Run analysis
    analyzer = VietnameseMissingVocabularyAnalyzer(raw_data_dir, enriched_data_dir, output_dir)
    analyzer.run_analysis()

if __name__ == "__main__":
    main()
