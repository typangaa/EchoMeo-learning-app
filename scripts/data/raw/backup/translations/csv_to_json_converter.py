#!/usr/bin/env python
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
