#!/usr/bin/env python
"""
Integrated HSK Vocabulary Processor (Unified Version)

This script processes Chinese vocabulary items (both characters and words) into a unified format
with detailed meanings, Vietnamese translations, and example sentences.

Usage:
  python hsk_vocabulary_processor_unified.py [--level LEVEL] [--model MODEL] [--batch SIZE]
"""

import os
import json
import time
import argparse
import sys
import csv
import logging
from typing import Dict, List, Any, Set, Optional, Tuple
from pathlib import Path
import requests

# Import the enrichment module
from character_enrichment import EnrichmentConfig, check_ollama_connection, enrich_chinese_item

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("hsk_processor.log", encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)

class ProcessorConfig:
    """Configuration for the HSK vocabulary processor."""
    def __init__(self):
        self.raw_dir = r"C:\Users\TY_Windows\Documents\Development\vietnamese-chinese-learning\src\data\raw"
        self.output_dir = r"C:\Users\TY_Windows\Documents\Development\vietnamese-chinese-learning\src\data\enriched"
        self.api_url = "http://localhost:11434/api/generate"
        self.model = "qwen3:latest"
        self.batch_size = 5  # Process items in batches
        self.create_csv = True  # Whether to create CSV files in addition to JSON
        self.include_single_chars = True  # Whether to include individual characters from words
        self.dedup_vocabulary = True  # Remove duplicate items (characters that appear in words)

def extract_from_hsk_file(file_path: str, process_config: ProcessorConfig) -> List[Dict[str, Any]]:
    """
    Extract vocabulary items from an HSK JSON file while preserving order.
    
    Args:
        file_path: Path to HSK JSON file
        process_config: Processing configuration
        
    Returns:
        List of vocabulary item info dictionaries preserving order
    """
    logging.info(f"Extracting from file: {file_path}")
    
    try:
        # Load the JSON file
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract HSK level from filename
        hsk_level = int(os.path.basename(file_path).split('.')[0])
        
        # Extract items in order
        vocab_items = []
        processed_items = set()  # Track items to avoid duplicates
        
        # Process items in original order
        for idx, item in enumerate(data):
            simplified = item.get("simplified", "")
            if not simplified:
                continue
            
            # Extract pinyin if available
            pinyin = ""
            if "forms" in item and len(item["forms"]) > 0:
                for form in item["forms"]:
                    if form.get("traditional", "") == simplified or not form.get("traditional", ""):
                        pinyin = form.get("transcriptions", {}).get("pinyin", "")
                        if pinyin:
                            break
            
            # Add vocabulary item if not already processed
            if simplified not in processed_items:
                processed_items.add(simplified)
                vocab_items.append({
                    "text": simplified,
                    "pinyin": pinyin,
                    "hsk_level": hsk_level,
                    "is_single_char": len(simplified) == 1,
                    "original_index": idx
                })
            
            # Add individual characters if configured and not already processed
            if process_config.include_single_chars:
                for char in simplified:
                    if char not in processed_items:
                        processed_items.add(char)
                        # Try to get character pinyin (simplified approach)
                        char_pinyin = ""
                        vocab_items.append({
                            "text": char,
                            "pinyin": char_pinyin,
                            "hsk_level": hsk_level,
                            "is_single_char": True,
                            "original_index": idx + 0.1  # Slight offset to keep after the word
                        })
        
        # Sort by original index to preserve order
        vocab_items.sort(key=lambda x: x["original_index"])
        
        logging.info(f"Extracted {len(vocab_items)} vocabulary items from {os.path.basename(file_path)}")
        
        return vocab_items
    
    except Exception as e:
        logging.error(f"Error extracting from {file_path}: {e}")
        return []

def batch_process_items(vocab_items: List[Dict[str, Any]], enrich_config: EnrichmentConfig) -> List[Dict[str, Any]]:
    """
    Process a batch of vocabulary items and enrich their meanings.
    
    Args:
        vocab_items: List of vocabulary item info dictionaries
        enrich_config: Enrichment configuration
        
    Returns:
        List of enriched vocabulary items
    """
    enriched_items = []
    
    for item_info in vocab_items:
        # Extract item info
        text = item_info["text"]
        pinyin = item_info["pinyin"]
        hsk_level = item_info["hsk_level"]
        
        # Enrich the item
        enriched_data = enrich_chinese_item(text, enrich_config, pinyin, hsk_level)
        
        # Add metadata for tracking
        if enriched_data:
            # Determine the key based on length (for consistent field names)
            key_name = "word"
            if len(text) == 1:
                key_name = "character"
            
            # Ensure the key exists
            if key_name not in enriched_data:
                enriched_data[key_name] = text
            
            # Add metadata
            enriched_data["_metadata"] = {
                "hsk_level": hsk_level,
                "original_index": item_info["original_index"],
                "is_single_char": item_info["is_single_char"]
            }
            
            enriched_items.append(enriched_data)
            logging.info(f"Successfully enriched: {text}")
        else:
            logging.warning(f"Failed to enrich: {text}")
        
        # Small delay to avoid overwhelming the API
        time.sleep(1)
    
    return enriched_items

def save_enriched_data(enriched_data: List[Dict[str, Any]], output_path: str, csv_path: Optional[str] = None):
    """
    Save enriched data to JSON and optionally CSV.
    
    Args:
        enriched_data: List of enriched vocabulary data
        output_path: Path to save JSON file
        csv_path: Optional path to save CSV file
    """
    try:
        # Save JSON
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(enriched_data, f, ensure_ascii=False, indent=2)
        logging.info(f"Saved enriched data to {output_path}")
        
        # Save CSV if requested
        if csv_path:
            # Create flattened data for CSV
            csv_rows = []
            for item_data in enriched_data:
                # Get the key for this item
                key_name = "vocabulary"
                item_value = ""
                
                if "character" in item_data:
                    key_name = "character"
                    item_value = item_data["character"]
                elif "word" in item_data:
                    key_name = "word"
                    item_value = item_data["word"]
                
                pinyin = item_data.get("pinyin", "")
                hsk_level = item_data.get("_metadata", {}).get("hsk_level", "")
                
                # Process each meaning
                for i, meaning in enumerate(item_data.get("meanings", [])):
                    # Add main row for the meaning
                    row = {
                        "vocabulary": item_value,
                        "type": key_name,
                        "pinyin": pinyin,
                        "hsk_level": hsk_level,
                        "meaning_index": i,
                        "english": meaning.get("english", ""),
                        "vietnamese": meaning.get("vietnamese", ""),
                        "part_of_speech": meaning.get("part_of_speech", ""),
                        "usage_frequency": meaning.get("usage_frequency", "")
                    }
                    csv_rows.append(row)
                    
                    # Add rows for examples
                    for j, example in enumerate(meaning.get("examples", [])):
                        example_row = {
                            "vocabulary": item_value,
                            "type": key_name,
                            "pinyin": pinyin,
                            "hsk_level": hsk_level,
                            "meaning_index": i,
                            "example_index": j,
                            "example_chinese": example.get("chinese", ""),
                            "example_pinyin": example.get("pinyin", ""),
                            "example_english": example.get("english", ""),
                            "example_vietnamese": example.get("vietnamese", "")
                        }
                        csv_rows.append(example_row)
            
            # Write to CSV
            if csv_rows:
                with open(csv_path, 'w', encoding='utf-8', newline='') as f:
                    writer = csv.DictWriter(f, fieldnames=csv_rows[0].keys())
                    writer.writeheader()
                    writer.writerows(csv_rows)
                logging.info(f"Saved CSV data to {csv_path}")
            else:
                logging.warning(f"No data to write to CSV: {csv_path}")
    
    except Exception as e:
        logging.error(f"Error saving data: {e}")

def process_hsk_level(level: int, process_config: ProcessorConfig, enrich_config: EnrichmentConfig):
    """
    Process a complete HSK level: extract, enrich, and save.
    
    Args:
        level: HSK level to process
        process_config: Processing configuration
        enrich_config: Enrichment configuration
    """
    logging.info(f"Processing HSK level {level}")
    
    # Set up file paths
    file_path = os.path.join(process_config.raw_dir, f"{level}.json")
    
    if not os.path.exists(file_path):
        logging.error(f"HSK level {level} file not found: {file_path}")
        return
    
    # Extract vocabulary items
    vocab_items = extract_from_hsk_file(file_path, process_config)
    
    if not vocab_items:
        logging.warning(f"No vocabulary items to process for HSK level {level}")
        return
    
    # Create output directory for vocabulary
    output_dir = os.path.join(process_config.output_dir, "vocabulary")
    os.makedirs(output_dir, exist_ok=True)
    
    # Output paths
    json_path = os.path.join(output_dir, f"hsk{level}_vocabulary.json")
    csv_path = os.path.join(output_dir, f"hsk{level}_vocabulary.csv") if process_config.create_csv else None
    
    # Process items in batches
    all_enriched_items = []
    items_dict = {}  # To track items for deduplication
    
    # Group items by batch for processing
    for batch_start in range(0, len(vocab_items), process_config.batch_size):
        batch_info = vocab_items[batch_start:batch_start + process_config.batch_size]
        
        logging.info(f"Processing batch {batch_start//process_config.batch_size + 1}/{(len(vocab_items) + process_config.batch_size - 1)//process_config.batch_size}")
        
        # Enrich the batch
        enriched_batch = batch_process_items(batch_info, enrich_config)
        
        # Add to items dictionary (for deduplication if needed)
        for enriched_item in enriched_batch:
            item_text = ""
            if "character" in enriched_item:
                item_text = enriched_item["character"]
            elif "word" in enriched_item:
                item_text = enriched_item["word"]
            
            # Skip empty items
            if not item_text:
                continue
                
            # Handle deduplication if requested
            if process_config.dedup_vocabulary:
                # If we've already seen this item, keep the one with the lower HSK level
                # or the one that's not a single character in a tie
                if item_text in items_dict:
                    existing_item = items_dict[item_text]
                    existing_level = existing_item.get("_metadata", {}).get("hsk_level", 99)
                    existing_is_single = existing_item.get("_metadata", {}).get("is_single_char", False)
                    
                    new_level = enriched_item.get("_metadata", {}).get("hsk_level", 99)
                    new_is_single = enriched_item.get("_metadata", {}).get("is_single_char", False)
                    
                    # Keep if lower HSK level, or same level but not single char when existing is
                    if new_level < existing_level or (new_level == existing_level and not new_is_single and existing_is_single):
                        items_dict[item_text] = enriched_item
                else:
                    items_dict[item_text] = enriched_item
            else:
                # Just add with a suffix to ensure uniqueness
                original_idx = enriched_item.get("_metadata", {}).get("original_index", 0)
                items_dict[f"{item_text}_{original_idx}"] = enriched_item
        
        # Convert dictionary to list
        current_items = list(items_dict.values())
        
        # Sort by original index to preserve order
        current_items.sort(key=lambda x: x.get("_metadata", {}).get("original_index", 0))
        
        # Save progress
        progress_path = os.path.join(output_dir, f"hsk{level}_progress.json")
        with open(progress_path, 'w', encoding='utf-8') as f:
            json.dump(current_items, f, ensure_ascii=False, indent=2)
        logging.info(f"Saved progress to {progress_path} ({len(current_items)} items)")
    
    # Finalize the enriched items
    all_enriched_items = list(items_dict.values())
    
    # Sort by original index to preserve order
    all_enriched_items.sort(key=lambda x: x.get("_metadata", {}).get("original_index", 0))
    
    # Create a unified "vocabulary" field for all items
    for item in all_enriched_items:
        if "character" in item:
            item["vocabulary"] = item["character"]
        elif "word" in item:
            item["vocabulary"] = item["word"]
    
    # Save final results
    save_enriched_data(all_enriched_items, json_path, csv_path)

def main():
    """Main execution function."""
    # Initialize configurations
    process_config = ProcessorConfig()
    enrich_config = EnrichmentConfig()
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Unified HSK Vocabulary Processor')
    parser.add_argument('--level', type=int, help='HSK level to process (1-7)')
    parser.add_argument('--model', type=str, default=process_config.model, help=f'Ollama model to use (default: {process_config.model})')
    parser.add_argument('--batch', type=int, default=process_config.batch_size, help=f'Batch size (default: {process_config.batch_size})')
    parser.add_argument('--no-single-chars', action='store_true', help='Do not extract individual characters from words')
    parser.add_argument('--no-dedup', action='store_true', help='Do not deduplicate vocabulary items')
    parser.add_argument('--no-csv', action='store_true', help='Do not create CSV files')
    parser.add_argument('--raw-dir', type=str, default=process_config.raw_dir, help='Directory with raw HSK JSON files')
    parser.add_argument('--output-dir', type=str, default=process_config.output_dir, help='Directory for enriched output files')
    args = parser.parse_args()
    
    # Update configurations from arguments
    if args.model:
        process_config.model = args.model
        enrich_config.model = args.model
    if args.batch:
        process_config.batch_size = args.batch
    if args.raw_dir:
        process_config.raw_dir = args.raw_dir
    if args.output_dir:
        process_config.output_dir = args.output_dir
    if args.no_single_chars:
        process_config.include_single_chars = False
    if args.no_dedup:
        process_config.dedup_vocabulary = False
    if args.no_csv:
        process_config.create_csv = False
    
    # Ensure output directory exists
    os.makedirs(process_config.output_dir, exist_ok=True)
    
    logging.info("=" * 60)
    logging.info("Unified HSK Vocabulary Processor")
    logging.info("=" * 60)
    logging.info(f"Using Ollama model: {process_config.model}")
    logging.info(f"Raw data directory: {process_config.raw_dir}")
    logging.info(f"Output directory: {process_config.output_dir}")
    logging.info(f"Including single characters: {process_config.include_single_chars}")
    logging.info(f"Deduplicating vocabulary: {process_config.dedup_vocabulary}")
    
    # Check Ollama connection
    if not check_ollama_connection(enrich_config):
        logging.error("Failed to connect to Ollama. Exiting.")
        return
    
    start_time = time.time()
    
    # Process HSK levels
    if args.level:
        process_hsk_level(args.level, process_config, enrich_config)
    else:
        for level in range(1, 8):  # HSK levels 1-7
            process_hsk_level(level, process_config, enrich_config)
    
    # Print summary
    elapsed_time = time.time() - start_time
    hours, remainder = divmod(elapsed_time, 3600)
    minutes, seconds = divmod(remainder, 60)
    
    logging.info("=" * 60)
    logging.info("Processing completed!")
    logging.info(f"Total processing time: {int(hours)}h {int(minutes)}m {int(seconds)}s")
    logging.info(f"Check the log file for details: hsk_processor.log")
    logging.info("=" * 60)

if __name__ == "__main__":
    main()