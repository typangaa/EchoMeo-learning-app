#!/usr/bin/env python
"""
HSK Word Extractor - Creates translation mapping templates from HSK vocabulary files

This script:
1. Processes each HSK level JSON file (1.json through 7.json)
2. Extracts all unique Chinese words
3. Creates template translation mapping files with empty Vietnamese translations
4. Organizes words by HSK level
5. Outputs statistics on the number of words per level

Usage:
  python extract_hsk_words.py

Output:
  - Creates a 'translations' directory with template mapping files
  - Outputs statistics on extracted words
"""

import os
import json
import time

# Configuration
INPUT_DIR = os.path.dirname(os.path.abspath(__file__))  # Current directory
OUTPUT_DIR = os.path.join(INPUT_DIR, "translations")
INCLUDE_ENGLISH = True  # Include English meanings for reference

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)
    print(f"Created output directory: {OUTPUT_DIR}")

def extract_words_from_file(file_path, hsk_level):
    """Extract words from an HSK JSON file and create a translation template."""
    print(f"Processing HSK {hsk_level} file: {file_path}")
    
    try:
        # Load the HSK vocabulary file
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None, 0
    
    # Create translation mapping
    translations = {}
    
    # Process each word
    for word_data in data:
        simplified = word_data["simplified"]
        
        # Skip duplicates (shouldn't be any within a level, but just in case)
        if simplified in translations:
            continue
        
        # Get English meanings for reference
        if INCLUDE_ENGLISH and "forms" in word_data and len(word_data["forms"]) > 0:
            meanings = word_data["forms"][0].get("meanings", [])
            english = "; ".join(meanings)
        else:
            english = ""
        
        # Add to translations dict with empty Vietnamese translation
        translations[simplified] = {
            "vietnamese": "",  # Empty placeholder for translation
            "english": english,  # English reference for translators
            "pinyin": word_data["forms"][0]["transcriptions"]["pinyin"] if "forms" in word_data else "",
            "hsk_level": hsk_level
        }
    
    return translations, len(translations)

def create_combined_mapping(all_translations):
    """Create a combined mapping file with all HSK words."""
    combined = {}
    
    # Combine all levels
    for level, translations in all_translations.items():
        for word, data in translations.items():
            # If word exists in multiple levels, use the lowest level
            if word in combined:
                existing_level = combined[word]["hsk_level"]
                if level < existing_level:
                    combined[word] = data
            else:
                combined[word] = data
    
    return combined

def write_translation_file(translations, file_path):
    """Write translations to a JSON file."""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(translations, f, ensure_ascii=False, indent=2)
        print(f"Successfully wrote {len(translations)} words to {file_path}")
        return True
    except Exception as e:
        print(f"Error writing to {file_path}: {e}")
        return False

def create_csv_version(translations, file_path):
    """Create a CSV version for easier editing in spreadsheet software."""
    try:
        import csv
        with open(file_path, 'w', encoding='utf-8', newline='') as f:
            fieldnames = ['simplified', 'vietnamese', 'pinyin', 'english', 'hsk_level']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for simplified, data in translations.items():
                writer.writerow({
                    'simplified': simplified,
                    'vietnamese': data['vietnamese'],
                    'pinyin': data['pinyin'],
                    'english': data['english'],
                    'hsk_level': data['hsk_level']
                })
        print(f"Successfully wrote CSV version to {file_path}")
        return True
    except Exception as e:
        print(f"Error writing CSV to {file_path}: {e}")
        return False

def main():
    """Process all HSK JSON files and create translation mappings."""
    start_time = time.time()
    
    # Dictionary to store translations by HSK level
    all_translations = {}
    all_word_count = 0
    
    # Process each HSK level
    for i in range(1, 8):  # HSK levels 1-7
        file_path = os.path.join(INPUT_DIR, f"{i}.json")
        
        if os.path.exists(file_path):
            translations, word_count = extract_words_from_file(file_path, i)
            
            if translations:
                all_translations[i] = translations
                all_word_count += word_count
                
                # Write individual level translation files
                level_output_path = os.path.join(OUTPUT_DIR, f"hsk{i}_translations.json")
                write_translation_file(translations, level_output_path)
                
                # Create CSV version for easier editing
                csv_output_path = os.path.join(OUTPUT_DIR, f"hsk{i}_translations.csv")
                create_csv_version(translations, csv_output_path)
        else:
            print(f"HSK {i} file not found: {file_path}")
    
    # Create a combined file with all HSK words
    combined_translations = create_combined_mapping(all_translations)
    combined_output_path = os.path.join(OUTPUT_DIR, "all_hsk_translations.json")
    write_translation_file(combined_translations, combined_output_path)
    
    # Create combined CSV
    combined_csv_path = os.path.join(OUTPUT_DIR, "all_hsk_translations.csv")
    create_csv_version(combined_translations, combined_csv_path)
    
    # Print statistics
    print("\nExtraction completed!")
    print(f"Total processing time: {time.time() - start_time:.2f} seconds")
    print(f"Total unique words: {all_word_count}")
    print("\nWords per HSK level:")
    for level, translations in all_translations.items():
        print(f"  HSK {level}: {len(translations)} words")
    
    print("\nOutput files:")
    print(f"  JSON files: {OUTPUT_DIR}/*.json")
    print(f"  CSV files: {OUTPUT_DIR}/*.csv")
    
    print("\nNext steps:")
    print("1. Edit the CSV files to add Vietnamese translations")
    print("2. Use 'csv_to_json_converter.py' (created in the translations folder) to convert back to JSON")
    print("3. Update your application to use the translation files")

def create_csv_converter():
    """Create a utility script to convert CSV back to JSON after editing."""
    converter_path = os.path.join(OUTPUT_DIR, "csv_to_json_converter.py")
    
    converter_code = """#!/usr/bin/env python
import os
import json
import csv

# Convert all CSV files in this directory back to JSON
for file in os.listdir('.'):
    if file.endswith('_translations.csv'):
        print(f"Converting {file} to JSON...")
        
        translations = {}
        
        # Read the CSV file
        with open(file, 'r', encoding='utf-8', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                simplified = row['simplified']
                translations[simplified] = {
                    'vietnamese': row['vietnamese'],
                    'english': row['english'],
                    'pinyin': row['pinyin'],
                    'hsk_level': int(row['hsk_level'])
                }
        
        # Write the JSON file
        json_file = file.replace('.csv', '.json')
        with open(json_file, 'w', encoding='utf-8') as jsonfile:
            json.dump(translations, jsonfile, ensure_ascii=False, indent=2)
        
        print(f"Successfully converted to {json_file}")

print("Conversion complete!")
"""
    
    try:
        with open(converter_path, 'w', encoding='utf-8') as f:
            f.write(converter_code)
        print(f"Created CSV to JSON converter: {converter_path}")
        return True
    except Exception as e:
        print(f"Error creating converter script: {e}")
        return False

if __name__ == "__main__":
    main()
    create_csv_converter()
