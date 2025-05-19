#!/usr/bin/env python
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
