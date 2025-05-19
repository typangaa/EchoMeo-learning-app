#!/usr/bin/env python
"""
Enriched Data Converter for Vietnamese-Chinese Learning App

This script:
1. Reads enriched vocabulary data (characters and words)
2. Converts it to the format used by the Vietnamese-Chinese learning application
3. Maps HSK levels to CEFR levels (A1-C2)
4. Organizes vocabulary into categories
5. Standardizes format of English meanings

Usage:
  python convert_to_app_format.py [--input-dir INPUT_DIR] [--output-file OUTPUT_FILE]
"""

import os
import json
import argparse
import logging
from typing import Dict, List, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Define mapping from HSK to CEFR levels
HSK_TO_CEFR = {
    1: "A1",
    2: "A1",
    3: "A2",
    4: "B1",
    5: "B2",
    6: "C1",
    7: "C2"
}

# Standard separator for English meanings
STANDARD_SEPARATOR = " / "

def standardize_english_format(english_text: str) -> str:
    """
    Standardize the format of English meanings to use a consistent separator.
    
    Args:
        english_text: The English meaning text
        
    Returns:
        Standardized English text
    """
    # Replace semicolons with the standard separator
    standardized = english_text.replace(';', STANDARD_SEPARATOR)
    
    # Replace slashes without spaces with the standard separator
    standardized = standardized.replace('/', STANDARD_SEPARATOR)
    standardized = standardized.replace(' /  / ', STANDARD_SEPARATOR)
    
    # Clean up any double spaces
    while '  ' in standardized:
        standardized = standardized.replace('  ', ' ')
    
    # Clean up any doubled separators
    while STANDARD_SEPARATOR + STANDARD_SEPARATOR in standardized:
        standardized = standardized.replace(STANDARD_SEPARATOR + STANDARD_SEPARATOR, STANDARD_SEPARATOR)
    
    return standardized.strip()

def load_enriched_data(input_dir: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Load all enriched data from the input directory.
    
    Args:
        input_dir: Directory containing enriched data
        
    Returns:
        Dictionary with loaded data
    """
    result = {
        "characters": [],
        "words": [],
        "combined": []  # For order-preserved combined files
    }
    
    # First try to load from combined directory (order-preserved)
    combined_dir = os.path.join(input_dir, "combined")
    if os.path.exists(combined_dir):
        for filename in os.listdir(combined_dir):
            if filename.endswith("_enriched.json"):
                try:
                    file_path = os.path.join(combined_dir, filename)
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    result["combined"].extend(data)
                    logging.info(f"Loaded {len(data)} items from {filename}")
                except Exception as e:
                    logging.error(f"Error loading {filename}: {e}")
    
    # If no combined data found, try loading from separate dirs
    if not result["combined"]:
        # Load characters
        char_dir = os.path.join(input_dir, "characters")
        if os.path.exists(char_dir):
            for filename in os.listdir(char_dir):
                if filename.endswith("_enriched.json"):
                    try:
                        file_path = os.path.join(char_dir, filename)
                        with open(file_path, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                        result["characters"].extend(data)
                        logging.info(f"Loaded {len(data)} characters from {filename}")
                    except Exception as e:
                        logging.error(f"Error loading {filename}: {e}")
        
        # Load words
        word_dir = os.path.join(input_dir, "words")
        if os.path.exists(word_dir):
            for filename in os.listdir(word_dir):
                if filename.endswith("_enriched.json"):
                    try:
                        file_path = os.path.join(word_dir, filename)
                        with open(file_path, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                        result["words"].extend(data)
                        logging.info(f"Loaded {len(data)} words from {filename}")
                    except Exception as e:
                        logging.error(f"Error loading {filename}: {e}")
    
    return result

def determine_hsk_level(item: Dict[str, Any]) -> int:
    """
    Determine the HSK level from an enriched item.
    
    Args:
        item: Enriched character or word data
        
    Returns:
        HSK level (1-7)
    """
    # Check if there's an explicit HSK level
    if "hsk_level" in item:
        return item["hsk_level"]
    
    # Check if there's metadata
    if "_metadata" in item and "hsk_level" in item["_metadata"]:
        return item["_metadata"]["hsk_level"]
    
    # Try to extract from the filename pattern in the original data
    if "source_file" in item:
        file_name = item["source_file"]
        if file_name.startswith("hsk") and len(file_name) > 3:
            try:
                return int(file_name[3])
            except ValueError:
                pass
    
    # Default to HSK 7 (most advanced) if unknown
    return 7

def determine_category(item: Dict[str, Any]) -> str:
    """
    Determine a category for the vocabulary item based on meanings.
    
    Args:
        item: Enriched character or word data
        
    Returns:
        Category string
    """
    # Use a mapping of common words to categories
    categories = {
        "time": ["time", "hour", "minute", "day", "month", "year", "week", "season"],
        "people": ["person", "people", "family", "friend", "student", "teacher"],
        "daily life": ["eat", "drink", "sleep", "work", "study", "buy", "sell"],
        "numbers": ["number", "one", "two", "three", "count", "many", "few"],
        "food": ["food", "eat", "drink", "restaurant", "cook", "meal"],
        "clothing": ["clothes", "wear", "shirt", "pants", "dress", "hat"],
        "travel": ["go", "come", "travel", "transportation", "car", "bus", "train"],
        "communication": ["speak", "talk", "say", "write", "read", "language"],
        "feelings": ["happy", "sad", "angry", "feel", "emotion", "like", "love"],
        "education": ["study", "learn", "school", "student", "teacher", "book"]
    }
    
    # Check if any meaning matches a category
    for meaning in item.get("meanings", []):
        english = meaning.get("english", "").lower()
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword in english:
                    return category
    
    # Default to "general" if no specific category is found
    return "general"

def convert_to_app_format(enriched_data: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """
    Convert enriched data to application format.
    
    Args:
        enriched_data: Dictionary with 'characters', 'words', and 'combined' lists
        
    Returns:
        List of vocabulary items in application format
    """
    app_vocab = []
    id_counter = 1
    processed_items = set()  # Track processed items to avoid duplicates
    
    # Use combined data if available (preserves order)
    items_to_process = []
    if enriched_data["combined"]:
        items_to_process = enriched_data["combined"]
    else:
        # Otherwise process characters and words
        items_to_process = enriched_data["characters"] + enriched_data["words"]
    
    # Process all items
    for item_data in items_to_process:
        # Determine if it's a character or word
        is_character = "character" in item_data
        item_text = item_data.get("character" if is_character else "word", "")
        
        # Skip empty or already processed items
        if not item_text or item_text in processed_items:
            continue
        
        processed_items.add(item_text)
        
        # Get meanings and examples
        meanings = item_data.get("meanings", [])
        if not meanings:
            continue
        
        # Standardize English format in meanings
        for meaning in meanings:
            if "english" in meaning:
                meaning["english"] = standardize_english_format(meaning["english"])
        
        # Get HSK level and map to CEFR
        hsk_level = determine_hsk_level(item_data)
        cefr_level = HSK_TO_CEFR.get(hsk_level, "C2")
        
        # Determine category
        category = determine_category(item_data)
        
        # Create examples list
        examples = []
        for meaning in meanings:
            for example in meaning.get("examples", []):
                examples.append({
                    "vietnamese": example.get("vietnamese", ""),
                    "chinese": example.get("chinese", ""),
                    "pinyin": example.get("pinyin", "")
                })
        
        # Create the vocabulary item
        vocab_item = {
            "id": id_counter,
            "vietnamese": meanings[0].get("vietnamese", ""),  # Primary meaning
            "chinese": item_text,
            "pinyin": item_data.get("pinyin", ""),
            "english": meanings[0].get("english", ""),  # Primary meaning
            "level": cefr_level,
            "category": category,
            "examples": examples,
            "audioUrl": ""  # Placeholder for audio
        }
        
        app_vocab.append(vocab_item)
        id_counter += 1
    
    return app_vocab

def main():
    """Main execution function."""
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Convert enriched data to application format')
    parser.add_argument('--input-dir', type=str, default='../enriched', help='Directory containing enriched data')
    parser.add_argument('--output-file', type=str, default='../app/vocabulary.json', help='Output file for application data')
    args = parser.parse_args()
    
    # Ensure input directory exists
    if not os.path.exists(args.input_dir):
        logging.error(f"Input directory not found: {args.input_dir}")
        return
    
    # Ensure output directory exists
    output_dir = os.path.dirname(args.output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Load enriched data
    logging.info(f"Loading enriched data from {args.input_dir}")
    enriched_data = load_enriched_data(args.input_dir)
    
    # Convert to application format
    logging.info("Converting to application format")
    app_vocab = convert_to_app_format(enriched_data)
    
    # Save to output file
    logging.info(f"Saving {len(app_vocab)} vocabulary items to {args.output_file}")
    with open(args.output_file, 'w', encoding='utf-8') as f:
        json.dump(app_vocab, f, ensure_ascii=False, indent=2)
    
    logging.info("Conversion completed successfully!")

if __name__ == "__main__":
    main()