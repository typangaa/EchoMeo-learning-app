#!/usr/bin/env python
"""
CSV Fix Script - Repairs improperly formatted Vietnamese translations
"""

import csv
import os
import json
import sys
import re

# Vietnamese translation mappings for known words
KNOWN_TRANSLATIONS = {
    "爱": "yêu",
    "爱好": "sở thích",
    "八": "tám",
    "爸": "ba",
    "爸爸": "bố",
    "吧": "đi",
    "白": "trắng",
    "白天": "ban ngày",
    "百": "trăm",
    "班": "lớp",
    "半": "nửa",
    "半年": "nửa năm",
    "半天": "nửa ngày",
    "帮": "giúp",
    "帮忙": "giúp đỡ",
    "包": "gói",
    "包子": "bánh bao",
    "杯": "cốc"
}

def clean_vietnamese_translation(text):
    """Clean Vietnamese translation from explanatory text."""
    
    # If the text contains quotes, try to extract the Vietnamese word within quotes
    match = re.search(r'"([^"]+)"', text)
    if match:
        return match.group(1)
    
    # Try alternate quote styles
    match = re.search(r"'([^']+)'", text)
    if match:
        return match.group(1)
    
    # Look for patterns like "is X" or "means X"
    match = re.search(r"is\s+[\"']?([^\"',]+)[\"']?", text)
    if match:
        return match.group(1)
    
    # Try to find any Vietnamese-looking word
    # Vietnamese words often contain diacritics
    match = re.search(r'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]\w+', text, re.IGNORECASE)
    if match:
        return match.group(0)
    
    # If we can't extract a clear Vietnamese word, return empty
    return ""

def fix_csv(file_path):
    """Fix the Vietnamese translations in the CSV file."""
    try:
        # Read the current CSV file
        rows = []
        with open(file_path, 'r', encoding='utf-8', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            fieldnames = reader.fieldnames
            rows = list(reader)
        
        # Create a backup of the original file
        backup_path = f"{file_path}.backup"
        with open(backup_path, 'w', encoding='utf-8', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        
        print(f"Created backup at: {backup_path}")
        
        # Fix the Vietnamese translations
        fixed_count = 0
        for row in rows:
            simplified = row['simplified']
            
            # Check if we have a known translation
            if simplified in KNOWN_TRANSLATIONS:
                row['vietnamese'] = KNOWN_TRANSLATIONS[simplified]
                fixed_count += 1
            # Otherwise try to clean the existing translation
            elif row['vietnamese'] and len(row['vietnamese']) > 0:
                cleaned = clean_vietnamese_translation(row['vietnamese'])
                if cleaned:
                    row['vietnamese'] = cleaned
                    fixed_count += 1
        
        # Write the fixed CSV
        with open(file_path, 'w', encoding='utf-8', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        
        print(f"Fixed {fixed_count} translations in {file_path}")
        
        return fixed_count
    except Exception as e:
        print(f"Error fixing CSV: {e}")
        return 0

def main():
    # Get the CSV file path from command line argument or use default
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        # Try to find any HSK translation CSV in the current directory
        for level in range(1, 8):
            potential_file = f"hsk{level}_translations.csv"
            if os.path.exists(potential_file):
                file_path = potential_file
                break
        else:
            print("No HSK translation CSV found. Please specify the file path.")
            return
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    
    # Fix the CSV file
    fix_csv(file_path)

if __name__ == "__main__":
    main()
