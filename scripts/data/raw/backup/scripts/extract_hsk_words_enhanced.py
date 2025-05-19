#!/usr/bin/env python
"""
Enhanced HSK Word Extractor with Multi-Meaning Support

This script:
1. Processes each HSK level JSON file (1.json through 7.json)
2. Extracts all unique Chinese words
3. Preserves ALL meanings for each word
4. Creates template translation mapping files with empty Vietnamese translations
5. Organizes words by HSK level
6. Outputs statistics on the number of words per level

Usage:
  python extract_hsk_words_enhanced.py

Output:
  - Creates an 'output' directory with template mapping files
  - Outputs statistics on extracted words
"""

import os
import json
import time
import csv

# Configuration
INPUT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Parent directory
OUTPUT_DIR = os.path.join(INPUT_DIR, "output")
INCLUDE_ENGLISH = True  # Include English meanings for reference

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)
    print(f"Created output directory: {OUTPUT_DIR}")

def extract_words_from_file(file_path, hsk_level):
    """Extract words from an HSK JSON file and create a translation template with multiple meanings."""
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
        
        # Get pinyin for reference
        pinyin = ""
        if "forms" in word_data and len(word_data["forms"]) > 0:
            pinyin = word_data["forms"][0]["transcriptions"].get("pinyin", "")
        
        # Get traditional form if available
        traditional = ""
        if "forms" in word_data and len(word_data["forms"]) > 0:
            traditional = word_data["forms"][0].get("traditional", "")
        
        # Process multiple meanings
        meanings = []
        if INCLUDE_ENGLISH and "forms" in word_data:
            for form in word_data["forms"]:
                for meaning_idx, eng_meaning in enumerate(form.get("meanings", [])):
                    meanings.append({
                        "english": eng_meaning,
                        "vietnamese": "",  # Empty placeholder for translation
                        "primary": meaning_idx == 0,  # First meaning is primary by default
                    })
        
        # If no meanings were found, add a placeholder
        if not meanings:
            meanings.append({
                "english": "",
                "vietnamese": "",
                "primary": True
            })
        
        # Add examples placeholders
        examples = []
        
        # Add to translations dict 
        translations[simplified] = {
            "simplified": simplified,
            "traditional": traditional,
            "pinyin": pinyin,
            "hsk_level": hsk_level,
            "meanings": meanings,
            "examples": examples,
            "audio_url": ""  # Empty placeholder for audio URL
        }
    
    return translations, len(translations)

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
    """Create a flat CSV version for easier editing in spreadsheet software."""
    try:
        # Create a flattened version for CSV
        flattened_rows = []
        for simplified, data in translations.items():
            for meaning_idx, meaning in enumerate(data["meanings"]):
                row = {
                    'simplified': simplified,
                    'traditional': data["traditional"],
                    'pinyin': data["pinyin"],
                    'hsk_level': data["hsk_level"],
                    'meaning_index': meaning_idx,
                    'english': meaning["english"],
                    'vietnamese': meaning["vietnamese"],
                    'primary': 1 if meaning["primary"] else 0
                }
                flattened_rows.append(row)
        
        # Write to CSV
        with open(file_path, 'w', encoding='utf-8', newline='') as f:
            fieldnames = ['simplified', 'traditional', 'pinyin', 'hsk_level', 
                          'meaning_index', 'english', 'vietnamese', 'primary']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(flattened_rows)
        
        print(f"Successfully wrote CSV version to {file_path}")
        return True
    except Exception as e:
        print(f"Error writing CSV to {file_path}: {e}")
        return False

def create_examples_csv(translations, file_path):
    """Create a CSV template for adding example sentences."""
    try:
        rows = []
        for simplified, data in translations.items():
            row = {
                'simplified': simplified,
                'pinyin': data["pinyin"],
                'hsk_level': data["hsk_level"],
                'chinese_example': '',
                'pinyin_example': '',
                'vietnamese_example': '',
                'meaning_index': 0  # Default to first meaning
            }
            rows.append(row)
        
        with open(file_path, 'w', encoding='utf-8', newline='') as f:
            fieldnames = ['simplified', 'pinyin', 'hsk_level', 
                         'chinese_example', 'pinyin_example', 
                         'vietnamese_example', 'meaning_index']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        
        print(f"Successfully wrote examples CSV template to {file_path}")
        return True
    except Exception as e:
        print(f"Error writing examples CSV to {file_path}: {e}")
        return False

def create_csv_converter():
    """Create a utility script to convert CSV back to JSON after editing."""
    converter_path = os.path.join(OUTPUT_DIR, "csv_to_json_converter.py")
    
    converter_code = """#!/usr/bin/env python
import os
import json
import csv

# Convert meanings CSV back to structured JSON
def convert_meanings_to_json(meanings_csv, examples_csv=None):
    print(f"Converting {meanings_csv} to JSON...")
    
    # Create a dictionary to store the data
    translations = {}
    
    # Read the meanings CSV file
    with open(meanings_csv, 'r', encoding='utf-8', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            simplified = row['simplified']
            
            # Initialize the word entry if it doesn't exist
            if simplified not in translations:
                translations[simplified] = {
                    'simplified': simplified,
                    'traditional': row['traditional'],
                    'pinyin': row['pinyin'],
                    'hsk_level': int(row['hsk_level']),
                    'meanings': [],
                    'examples': [],
                    'audio_url': ''
                }
            
            # Add the meaning
            translations[simplified]['meanings'].append({
                'english': row['english'],
                'vietnamese': row['vietnamese'],
                'primary': bool(int(row['primary']))
            })
    
    # Read the examples CSV file if provided
    if examples_csv and os.path.exists(examples_csv):
        with open(examples_csv, 'r', encoding='utf-8', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                simplified = row['simplified']
                
                # Skip if the word is not in translations or if example is empty
                if simplified not in translations or not row['chinese_example']:
                    continue
                
                # Add the example
                translations[simplified]['examples'].append({
                    'chinese': row['chinese_example'],
                    'pinyin': row['pinyin_example'],
                    'vietnamese': row['vietnamese_example'],
                    'meaning_index': int(row.get('meaning_index', 0))
                })
    
    # Write the JSON file
    json_file = meanings_csv.replace('.csv', '.json')
    with open(json_file, 'w', encoding='utf-8') as jsonfile:
        json.dump(translations, jsonfile, ensure_ascii=False, indent=2)
    
    print(f"Successfully converted to {json_file}")
    return json_file

# Process all CSV files in this directory
for file in os.listdir('.'):
    if file.endswith('_meanings.csv'):
        # Check if there's a matching examples file
        examples_file = file.replace('_meanings.csv', '_examples.csv')
        examples_path = examples_file if os.path.exists(examples_file) else None
        
        # Convert the file
        convert_meanings_to_json(file, examples_path)

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

def main():
    """Process all HSK JSON files and create translation mappings with multi-meaning support."""
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
                
                # Create CSV version for meanings
                csv_output_path = os.path.join(OUTPUT_DIR, f"hsk{i}_meanings.csv")
                create_csv_version(translations, csv_output_path)
                
                # Create CSV template for examples
                examples_output_path = os.path.join(OUTPUT_DIR, f"hsk{i}_examples.csv")
                create_examples_csv(translations, examples_output_path)
        else:
            print(f"HSK {i} file not found: {file_path}")
    
    # Create a combined file with all HSK words
    combined_translations = {}
    for level, translations in all_translations.items():
        combined_translations.update(translations)
    
    combined_output_path = os.path.join(OUTPUT_DIR, "all_hsk_translations.json")
    write_translation_file(combined_translations, combined_output_path)
    
    # Create combined CSV
    combined_csv_path = os.path.join(OUTPUT_DIR, "all_hsk_meanings.csv")
    create_csv_version(combined_translations, combined_csv_path)
    
    # Create combined examples CSV
    combined_examples_path = os.path.join(OUTPUT_DIR, "all_hsk_examples.csv")
    create_examples_csv(combined_translations, combined_examples_path)
    
    # Create CSV to JSON converter
    create_csv_converter()
    
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
    print("2. Use 'csv_to_json_converter.py' to convert back to JSON")
    print("3. Update your application to use the translation files")

if __name__ == "__main__":
    main()
