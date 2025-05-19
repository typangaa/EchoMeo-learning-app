#!/usr/bin/env python
"""
Auto-Translator for HSK Vocabulary using Google Translate

This script:
1. Loads the HSK translation template files
2. Automatically translates Chinese words to Vietnamese using Google Translate
3. Updates the translation files with the results
4. Preserves any existing translations (doesn't overwrite manually edited entries)

Usage:
  python auto_translate_google.py [level]
  
  [level] is optional. If provided, only that HSK level is processed.
          Otherwise, all levels are processed.

Requirements:
  - requests library: pip install requests
  - googletrans library: pip install googletrans==4.0.0-rc1
"""

import os
import json
import time
import argparse
import requests
import csv

def translate_text_google(text, source_lang="zh-CN", target_lang="vi"):
    """
    Translate text using Google Translate API.
    Requires: pip install googletrans==4.0.0-rc1
    """
    try:
        from googletrans import Translator
        translator = Translator()
        result = translator.translate(text, src=source_lang, dest=target_lang)
        return result.text
    except Exception as e:
        print(f"Error using Google Translate: {e}")
        return ""

def translate_csv_file(file_path, level=None):
    """Translate words in a CSV file and update the file with translations."""
    print(f"Processing file: {file_path}")
    
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return 0
    
    # Read the CSV file
    rows = []
    try:
        with open(file_path, 'r', encoding='utf-8', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            rows = list(reader)
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return 0
    
    # Track statistics
    total_words = len(rows)
    translated_words = 0
    already_translated = 0
    errors = 0
    
    # Process each word
    for i, row in enumerate(rows):
        # Skip if not matching the requested level
        if level and int(row['hsk_level']) != level:
            continue
            
        # Skip if already has a translation
        if row['vietnamese'] and row['vietnamese'].strip():
            already_translated += 1
            continue
        
        # Get the Chinese word and English meaning for context
        simplified = row['simplified']
        context = row['english']
        
        print(f"Translating [{i+1}/{total_words}]: {simplified} ({context[:40]}{'...' if len(context) > 40 else ''})")
        
        # Translate the word
        try:
            translation = translate_text_google(simplified)
                
            if translation:
                row['vietnamese'] = translation
                translated_words += 1
                print(f"  → {translation}")
            else:
                errors += 1
                print(f"  → Translation failed")
        except Exception as e:
            errors += 1
            print(f"  → Error: {e}")
        
        # Add a small delay to avoid hitting rate limits
        time.sleep(0.5)
        
        # Save periodically (every 10 words) to preserve progress in case of interruption
        if (i + 1) % 10 == 0:
            try:
                with open(file_path, 'w', encoding='utf-8', newline='') as csvfile:
                    fieldnames = rows[0].keys()
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(rows)
                print(f"  Progress saved ({i+1}/{total_words})")
            except Exception as e:
                print(f"  Warning: Couldn't save progress: {e}")
    
    # Save the updated CSV
    try:
        with open(file_path, 'w', encoding='utf-8', newline='') as csvfile:
            fieldnames = rows[0].keys()
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        print(f"Updated CSV file saved: {file_path}")
    except Exception as e:
        print(f"Error saving CSV file: {e}")
    
    # Print statistics
    print(f"\nStatistics for {os.path.basename(file_path)}:")
    print(f"  Total words: {total_words}")
    print(f"  Already translated: {already_translated}")
    print(f"  Newly translated: {translated_words}")
    print(f"  Translation errors: {errors}")
    
    return translated_words

def check_googletrans():
    """Check if googletrans library is installed and working."""
    try:
        from googletrans import Translator
        translator = Translator()
        # Test with a simple translation
        test = translator.translate("hello", src="en", dest="vi")
        if test and test.text:
            print("Google Translate is working correctly.")
            return True
        else:
            print("Error: Google Translate test failed.")
            return False
    except ImportError:
        print("Error: googletrans library not found.")
        print("Install with: pip install googletrans==4.0.0-rc1")
        return False
    except Exception as e:
        print(f"Error testing Google Translate: {e}")
        return False

def main():
    """Process translation files based on command-line arguments."""
    parser = argparse.ArgumentParser(description='Auto-translate HSK vocabulary using Google Translate')
    parser.add_argument('level', type=int, nargs='?', help='HSK level to process (1-7)')
    args = parser.parse_args()
    
    print("Using Google Translate for translations")
    
    # Check if googletrans is installed and working
    if not check_googletrans():
        return
    
    start_time = time.time()
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    total_translated = 0
    
    if args.level:
        # Process only the specified level
        csv_file = os.path.join(current_dir, f"hsk{args.level}_translations.csv")
        if os.path.exists(csv_file):
            total_translated += translate_csv_file(csv_file, args.level)
        else:
            print(f"File not found: {csv_file}")
    else:
        # Process all HSK levels
        for level in range(1, 8):  # HSK levels 1-7
            csv_file = os.path.join(current_dir, f"hsk{level}_translations.csv")
            if os.path.exists(csv_file):
                total_translated += translate_csv_file(csv_file)
    
    # Print overall statistics
    print(f"\nTranslation completed in {time.time() - start_time:.2f} seconds")
    print(f"Total newly translated words: {total_translated}")
    print("\nDon't forget to convert the updated CSV files back to JSON using csv_to_json_converter.py")

if __name__ == "__main__":
    main()
