#!/usr/bin/env python3
"""
Missing Vocabulary Analysis Script (Optimized)
==============================================

This script analyzes HSK vocabulary data to find words that exist in raw JSON files
but are missing from the enriched vocabulary files.

Optimized version with performance improvements and progress tracking.

Author: AI Assistant
Date: 2025
"""

import json
import os
from datetime import datetime
from collections import defaultdict
import csv
import time

class VocabularyAnalyzer:
    def __init__(self, raw_data_dir, enriched_data_dir, output_dir):
        self.raw_data_dir = raw_data_dir
        self.enriched_data_dir = enriched_data_dir
        self.output_dir = output_dir
        self.raw_vocabulary = {}  # HSK level -> set of simplified words
        self.enriched_vocabulary = {}  # HSK level -> set of items
        self.hsk_level_mapping = {}  # word -> HSK level from raw data
        self.raw_data_cache = {}  # HSK level -> full data for efficient lookups
        
    def load_raw_data(self):
        """Load vocabulary from raw HSK JSON files (1.json - 7.json)"""
        print("Loading raw HSK data...")
        
        for hsk_level in range(1, 8):
            raw_file = os.path.join(self.raw_data_dir, f"{hsk_level}.json")
            
            if not os.path.exists(raw_file):
                print(f"Warning: Raw file {raw_file} not found, skipping HSK {hsk_level}")
                continue
                
            try:
                print(f"  Loading HSK {hsk_level}...", end=" ")
                with open(raw_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Cache the raw data for efficient lookups later
                self.raw_data_cache[hsk_level] = data
                
                words = set()
                for item in data:
                    if 'simplified' in item:
                        word = item['simplified']
                        words.add(word)
                        self.hsk_level_mapping[word] = hsk_level
                
                self.raw_vocabulary[hsk_level] = words
                print(f"{len(words)} words loaded")
                
            except Exception as e:
                print(f"Error loading {raw_file}: {e}")
                
    def load_enriched_data(self):
        """Load vocabulary from enriched JSON files"""
        print("\nLoading enriched HSK data...")
        
        for hsk_level in range(1, 8):
            enriched_file = os.path.join(self.enriched_data_dir, f"hsk{hsk_level}_enriched.json")
            
            if not os.path.exists(enriched_file):
                print(f"Info: Enriched file hsk{hsk_level}_enriched.json not found, skipping HSK {hsk_level}")
                continue
                
            try:
                print(f"  Loading HSK {hsk_level}...", end=" ")
                with open(enriched_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                words = set()
                for item in data:
                    if 'item' in item:
                        words.add(item['item'])
                
                self.enriched_vocabulary[hsk_level] = words
                print(f"{len(words)} words loaded")
                
            except Exception as e:
                print(f"Error loading {enriched_file}: {e}")
    
    def find_missing_words(self):
        """Find words that exist in raw data but missing from enriched data"""
        print("\nAnalyzing missing vocabulary...")
        
        missing_by_level = {}
        extra_by_level = {}
        
        for hsk_level in range(1, 8):
            raw_words = self.raw_vocabulary.get(hsk_level, set())
            enriched_words = self.enriched_vocabulary.get(hsk_level, set())
            
            if not raw_words and not enriched_words:
                continue
            
            print(f"  HSK {hsk_level}: {len(raw_words)} raw, {len(enriched_words)} enriched", end=" ")
                
            missing_words = raw_words - enriched_words
            extra_words = enriched_words - raw_words
            
            print(f"-> {len(missing_words)} missing")
            
            if missing_words:
                missing_by_level[hsk_level] = missing_words
            if extra_words:
                extra_by_level[hsk_level] = extra_words
        
        return missing_by_level, extra_by_level
    
    def get_word_details_fast(self, word, hsk_level):
        """Get detailed information about a word from cached raw data"""
        if hsk_level not in self.raw_data_cache:
            return None
            
        try:
            data = self.raw_data_cache[hsk_level]
            
            for item in data:
                if item.get('simplified') == word:
                    details = {
                        'simplified': word,
                        'hsk_level': hsk_level,
                        'frequency': item.get('frequency', 'N/A'),
                        'pos': item.get('pos', []),
                        'pinyin': '',
                        'meanings': []
                    }
                    
                    # Extract pinyin and meanings from forms
                    if 'forms' in item and item['forms']:
                        form = item['forms'][0]
                        if 'transcriptions' in form and 'pinyin' in form['transcriptions']:
                            details['pinyin'] = form['transcriptions']['pinyin']
                        if 'meanings' in form:
                            details['meanings'] = form['meanings'][:3]  # First 3 meanings
                    
                    return details
                    
        except Exception as e:
            print(f"Error getting details for {word}: {e}")
            
        return None
    
    def generate_reports(self, missing_by_level, extra_by_level):
        """Generate comprehensive analysis reports"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Calculate totals
        total_raw = sum(len(words) for words in self.raw_vocabulary.values())
        total_enriched = sum(len(words) for words in self.enriched_vocabulary.values())
        total_missing = sum(len(words) for words in missing_by_level.values())
        total_extra = sum(len(words) for words in extra_by_level.values())
        
        print(f"\nGenerating reports for {total_missing} missing words...")
        
        # Create reports directory
        reports_dir = os.path.join(self.output_dir, "missing_reports")
        os.makedirs(reports_dir, exist_ok=True)
        
        # Generate text report
        report_file = os.path.join(reports_dir, f"missing_vocabulary_report_{timestamp}.txt")
        print(f"  Creating text report...")
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("Missing Vocabulary Analysis Report\n")
            f.write("=" * 40 + "\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            f.write("SUMMARY STATISTICS\n")
            f.write("-" * 20 + "\n")
            f.write(f"Total Raw Vocabulary: {total_raw:,} words\n")
            f.write(f"Total Enriched Vocabulary: {total_enriched:,} words\n")
            f.write(f"Missing Words: {total_missing:,} words ({total_missing/total_raw*100:.1f}% gap)\n")
            f.write(f"Extra Words: {total_extra:,} words\n\n")
            
            # Missing by level
            f.write("MISSING WORDS BY HSK LEVEL\n")
            f.write("-" * 30 + "\n")
            for hsk_level in sorted(missing_by_level.keys()):
                raw_count = len(self.raw_vocabulary.get(hsk_level, set()))
                missing_count = len(missing_by_level[hsk_level])
                percentage = missing_count / raw_count * 100 if raw_count > 0 else 0
                f.write(f"HSK {hsk_level}: {missing_count:,} missing out of {raw_count:,} ({percentage:.1f}%)\n")
            
            f.write("\n")
            
            # Detailed missing words (limit to prevent huge files)
            f.write("DETAILED MISSING WORDS (Sample)\n")
            f.write("-" * 35 + "\n")
            for hsk_level in sorted(missing_by_level.keys()):
                missing_words = list(missing_by_level[hsk_level])
                sample_size = min(50, len(missing_words))  # Limit to 50 words per level
                
                f.write(f"\nHSK Level {hsk_level} - Missing Words (showing {sample_size} of {len(missing_words)}):\n")
                
                for i, word in enumerate(sorted(missing_words)[:sample_size]):
                    details = self.get_word_details_fast(word, hsk_level)
                    if details:
                        f.write(f"  • {word} ({details['pinyin']}) - Freq: {details['frequency']}\n")
                        if details['meanings']:
                            meanings_text = '; '.join(details['meanings'][:2])
                            if len(meanings_text) > 100:
                                meanings_text = meanings_text[:100] + "..."
                            f.write(f"    Meanings: {meanings_text}\n")
                    else:
                        f.write(f"  • {word}\n")
                
                if len(missing_words) > sample_size:
                    f.write(f"    ... and {len(missing_words) - sample_size} more words\n")
        
        # Generate CSV report for missing words
        print(f"  Creating CSV report...")
        csv_file = os.path.join(reports_dir, f"missing_vocabulary_{timestamp}.csv")
        
        processed_count = 0
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['HSK_Level', 'Simplified', 'Pinyin', 'Frequency', 'POS', 'Meanings'])
            
            for hsk_level in sorted(missing_by_level.keys()):
                missing_words = list(missing_by_level[hsk_level])
                print(f"    Processing HSK {hsk_level}: {len(missing_words)} words...", end=" ")
                
                for word in sorted(missing_words):
                    details = self.get_word_details_fast(word, hsk_level)
                    if details:
                        writer.writerow([
                            hsk_level,
                            word,
                            details['pinyin'],
                            details['frequency'],
                            ', '.join(details['pos']),
                            ' | '.join(details['meanings'][:3])
                        ])
                    else:
                        writer.writerow([hsk_level, word, '', '', '', ''])
                    
                    processed_count += 1
                    if processed_count % 100 == 0:
                        print(".", end="", flush=True)
                
                print(f" Done!")
        
        # Generate JSON summary
        print(f"  Creating JSON summary...")
        json_file = os.path.join(reports_dir, f"analysis_summary_{timestamp}.json")
        summary = {
            'analysis_date': datetime.now().isoformat(),
            'statistics': {
                'total_raw_vocabulary': total_raw,
                'total_enriched_vocabulary': total_enriched,
                'total_missing_words': total_missing,
                'total_extra_words': total_extra,
                'completion_percentage': (total_enriched / total_raw * 100) if total_raw > 0 else 0
            },
            'missing_by_level': {str(k): list(v) for k, v in missing_by_level.items()},
            'extra_by_level': {str(k): list(v) for k, v in extra_by_level.items()},
            'level_statistics': {}
        }
        
        for hsk_level in range(1, 8):
            raw_count = len(self.raw_vocabulary.get(hsk_level, set()))
            enriched_count = len(self.enriched_vocabulary.get(hsk_level, set()))
            missing_count = len(missing_by_level.get(hsk_level, set()))
            
            if raw_count > 0 or enriched_count > 0:
                summary['level_statistics'][str(hsk_level)] = {
                    'raw_words': raw_count,
                    'enriched_words': enriched_count,
                    'missing_words': missing_count,
                    'completion_percentage': (enriched_count / raw_count * 100) if raw_count > 0 else 0
                }
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        return report_file, csv_file, json_file
    
    def run_analysis(self):
        """Run the complete vocabulary analysis"""
        start_time = time.time()
        
        print("Starting Missing Vocabulary Analysis (Optimized)")
        print("=" * 50)
        
        # Load data
        self.load_raw_data()
        self.load_enriched_data()
        
        # Analyze
        missing_by_level, extra_by_level = self.find_missing_words()
        
        # Generate reports
        report_file, csv_file, json_file = self.generate_reports(missing_by_level, extra_by_level)
        
        # Print summary
        total_missing = sum(len(words) for words in missing_by_level.values())
        total_raw = sum(len(words) for words in self.raw_vocabulary.values())
        elapsed_time = time.time() - start_time
        
        print(f"\nAnalysis Complete! (took {elapsed_time:.1f} seconds)")
        print(f"Reports generated in missing_reports/ folder:")
        print(f"  • Text Report: {os.path.basename(report_file)}")
        print(f"  • CSV Data: {os.path.basename(csv_file)}")
        print(f"  • JSON Summary: {os.path.basename(json_file)}")
        print(f"\nSummary: {total_missing:,} missing words out of {total_raw:,} total ({total_missing/total_raw*100:.1f}% gap)")
        
        # Print level breakdown
        print(f"\nLevel breakdown:")
        for hsk_level in range(1, 8):
            raw_count = len(self.raw_vocabulary.get(hsk_level, set()))
            enriched_count = len(self.enriched_vocabulary.get(hsk_level, set()))
            missing_count = len(missing_by_level.get(hsk_level, set()))
            
            if raw_count > 0:
                completion = (enriched_count / raw_count * 100) if raw_count > 0 else 0
                print(f"  HSK {hsk_level}: {completion:5.1f}% complete ({enriched_count:,}/{raw_count:,} words)")

def main():
    # Define paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    raw_data_dir = os.path.join(script_dir, 'data', 'raw')
    enriched_data_dir = os.path.join(script_dir, 'data', 'enriched', 'vocabulary')
    output_dir = os.path.join(script_dir, 'analysis_output')
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Run analysis
    analyzer = VocabularyAnalyzer(raw_data_dir, enriched_data_dir, output_dir)
    analyzer.run_analysis()

if __name__ == "__main__":
    main()
