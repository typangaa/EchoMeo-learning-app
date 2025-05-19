#!/usr/bin/env python
"""
Direct Translation Script - For translating a single Chinese word
"""

import requests
import sys
import json
import re
import time

def translate_word(chinese, model="llama3:latest"):
    """Translate a single Chinese word to Vietnamese using the most reliable method."""
    print(f"Translating: {chinese}")
    
    # Step 1: Let the model think about the translation
    system_prompt = """You are a highly skilled translator from Chinese to Vietnamese.
Think carefully about the best translation for the given Chinese word.
Consider all possible meanings and cultural nuances."""
    
    user_prompt = f"Translate this Chinese word to Vietnamese: {chinese}\n\nProvide ONLY the Vietnamese translation, nothing else:"
    
    try:
        # API call to get translation
        payload = {
            "model": model,
            "prompt": user_prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": 0.1,
                "num_predict": 50
            }
        }
        
        print("Sending request to Ollama...")
        response = requests.post("http://localhost:11434/api/generate", json=payload)
        
        if response.status_code == 200:
            result = response.json()
            translation = result.get("response", "").strip()
            
            # Clean up the translation
            translation = clean_translation(translation)
            
            print(f"Raw translation: '{translation}'")
            return translation
        else:
            print(f"API error: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def clean_translation(text):
    """Clean up the translation response."""
    # Remove any prefixes like "Vietnamese:" or "Translation:"
    for prefix in ["Vietnamese:", "Translation:", "Vietnamese translation:"]:
        if text.lower().startswith(prefix.lower()):
            text = text[len(prefix):].strip()
    
    # Take only the first line
    text = text.split('\n')[0].strip()
    
    # Remove quotes if present
    text = text.strip('"\'')
    
    return text

def translate_from_csv(csv_path, output_path, model="llama3:latest"):
    """Extract words from CSV and translate them one by one."""
    import csv
    
    try:
        # Read CSV
        with open(csv_path, 'r', encoding='utf-8', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            rows = list(reader)
        
        print(f"Found {len(rows)} words to translate")
        
        # Create a dictionary mapping Chinese words to Vietnamese translations
        translations = {}
        
        for i, row in enumerate(rows):
            chinese = row['simplified']
            existing = row.get('vietnamese', '')
            
            # Skip if already has a proper translation
            if existing and not (existing.startswith('"') or existing.startswith("'") or "wait" in existing.lower()):
                translations[chinese] = existing
                print(f"[{i+1}/{len(rows)}] {chinese} → {existing} (existing)")
                continue
            
            # Translate
            translation = translate_word(chinese, model)
            
            if translation:
                translations[chinese] = translation
                print(f"[{i+1}/{len(rows)}] {chinese} → {translation} (new)")
            else:
                print(f"[{i+1}/{len(rows)}] {chinese} → Translation failed")
            
            # Save after each translation
            with open(output_path, 'w', encoding='utf-8') as outfile:
                json.dump(translations, outfile, ensure_ascii=False, indent=2)
            
            # Pause to prevent overloading Ollama
            time.sleep(0.5)
        
        print(f"Saved {len(translations)} translations to {output_path}")
        return translations
    
    except Exception as e:
        print(f"Error processing CSV: {e}")
        return {}

def update_csv_with_translations(csv_path, translations):
    """Update the CSV file with the translations."""
    import csv
    
    try:
        # Read CSV
        with open(csv_path, 'r', encoding='utf-8', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            fieldnames = reader.fieldnames
            rows = list(reader)
        
        # Create a backup
        backup_path = f"{csv_path}.backup"
        with open(backup_path, 'w', encoding='utf-8', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        
        # Update translations
        updated = 0
        for row in rows:
            chinese = row['simplified']
            if chinese in translations:
                row['vietnamese'] = translations[chinese]
                updated += 1
        
        # Save updated CSV
        with open(csv_path, 'w', encoding='utf-8', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        
        print(f"Updated {updated} translations in {csv_path}")
        print(f"Backup saved to {backup_path}")
        
        return updated
    
    except Exception as e:
        print(f"Error updating CSV: {e}")
        return 0

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python direct_translate.py <chinese_word>")
        print("  python direct_translate.py --csv <csv_file>")
        print("  python direct_translate.py --fix <csv_file>")
        return
    
    model = "qwen3:latest"
    
    # Check if model specified
    for i, arg in enumerate(sys.argv):
        if arg == "--model" and i+1 < len(sys.argv):
            model = sys.argv[i+1]
            break
    
    if sys.argv[1] == "--csv" and len(sys.argv) > 2:
        # Process CSV file
        csv_path = sys.argv[2]
        output_path = f"translations_{int(time.time())}.json"
        
        # Translate all words
        translations = translate_from_csv(csv_path, output_path, model)
        
        # Update the CSV with translations
        update_csv_with_translations(csv_path, translations)
    
    elif sys.argv[1] == "--fix" and len(sys.argv) > 2:
        # Import the fix_csv module and run it
        from fix_csv import fix_csv
        fix_csv(sys.argv[2])
    
    else:
        # Translate single word
        word = sys.argv[1]
        translation = translate_word(word, model)
        if translation:
            print(f"\nTranslation: {translation}")

if __name__ == "__main__":
    main()
