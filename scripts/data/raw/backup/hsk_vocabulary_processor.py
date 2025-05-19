#!/usr/bin/env python
"""
Integrated HSK Vocabulary Processor

This script combines:
1. HSK word extraction
2. Character/word meaning enrichment with Qwen3
3. Structured output for Vietnamese-Chinese learning

Usage:
  python hsk_vocabulary_processor.py [--level LEVEL] [--model MODEL] [--batch SIZE]
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
from character_enrichment import EnrichmentConfig, check_ollama_connection, batch_process_items

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
        self.process_single_chars = True  # Whether to process individual characters
        self.process_words = True  # Whether to process words

def extract_from_hsk_file(file_path: str, process_config: ProcessorConfig) -> Tuple[List[str], List[str], Dict[str, str], Dict[str, int]]:
    """
    Extract characters and words from an HSK JSON file.
    
    Args:
        file_path: Path to HSK JSON file
        process_config: Processing configuration
        
    Returns:
        Tuple of:
        - List of unique characters
        - List of unique words
        - Dictionary mapping items to pinyin
        - Dictionary mapping items to HSK levels
    """
    logging.info(f"Extracting from file: {file_path}")
    
    try:
        # Load the JSON file
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract HSK level from filename
        hsk_level = int(os.path.basename(file_path).split('.')[0])
        
        # Extract unique characters and words
        unique_chars = set()
        unique_words = set()
        pinyin_map = {}
        hsk_levels = {}
        
        for item in data:
            simplified = item.get("simplified", "")
            
            # Add to words list
            if simplified and len(simplified) >= 1:
                unique_words.add(simplified)
                hsk_levels[simplified] = hsk_level
                
                # Extract pinyin if available
                if "forms" in item and len(item["forms"]) > 0:
                    for form in item["forms"]:
                        if form.get("traditional", "") == simplified or not form.get("traditional", ""):
                            pinyin = form.get("transcriptions", {}).get("pinyin", "")
                            if pinyin:
                                pinyin_map[simplified] = pinyin
                                break
            
            # Extract individual characters if configured
            if process_config.process_single_chars:
                for char in simplified:
                    unique_chars.add(char)
                    hsk_levels[char] = min(hsk_levels.get(char, 7), hsk_level)  # Use the lowest HSK level
        
        logging.info(f"Extracted {len(unique_chars)} unique characters and {len(unique_words)} unique words")
        
        # Convert sets to sorted lists
        char_list = sorted(list(unique_chars))
        word_list = sorted(list(unique_words))
        
        return char_list, word_list, pinyin_map, hsk_levels
    
    except Exception as e:
        logging.error(f"Error extracting from {file_path}: {e}")
        return [], [], {}, {}

def save_enriched_data(enriched_data: List[Dict[str, Any]], output_path: str, csv_path: Optional[str] = None):
    """
    Save enriched data to JSON and optionally CSV.
    
    Args:
        enriched_data: List of enriched character/word data
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
                # Get the main fields
                item_key = "character" if "character" in item_data else "word"
                item_value = item_data.get(item_key, "")
                pinyin = item_data.get("pinyin", "")
                
                # Process each meaning
                for i, meaning in enumerate(item_data.get("meanings", [])):
                    # Add main row for the meaning
                    row = {
                        item_key: item_value,
                        "pinyin": pinyin,
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
                            item_key: item_value,
                            "pinyin": pinyin,
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
    
    # Extract characters and words
    char_list, word_list, pinyin_map, hsk_levels = extract_from_hsk_file(file_path, process_config)
    
    # Process characters if enabled
    if process_config.process_single_chars and char_list:
        char_output_dir = os.path.join(process_config.output_dir, "characters")
        os.makedirs(char_output_dir, exist_ok=True)
        
        # Output paths
        char_json_path = os.path.join(char_output_dir, f"hsk{level}_chars_enriched.json")
        char_csv_path = os.path.join(char_output_dir, f"hsk{level}_chars_enriched.csv") if process_config.create_csv else None
        
        logging.info(f"Enriching {len(char_list)} characters from HSK {level}")
        
        # Process characters in batches
        all_enriched_chars = []
        for i in range(0, len(char_list), process_config.batch_size):
            batch = char_list[i:i+process_config.batch_size]
            logging.info(f"Processing character batch {i//process_config.batch_size + 1}/{(len(char_list) + process_config.batch_size - 1)//process_config.batch_size}")
            
            # Enrich the batch
            enriched_batch = batch_process_items(batch, enrich_config, pinyin_map, hsk_levels)
            all_enriched_chars.extend(enriched_batch)
            
            # Save progress
            progress_path = os.path.join(char_output_dir, f"hsk{level}_chars_progress.json")
            with open(progress_path, 'w', encoding='utf-8') as f:
                json.dump(all_enriched_chars, f, ensure_ascii=False, indent=2)
            logging.info(f"Saved character progress to {progress_path}")
        
        # Save final results
        save_enriched_data(all_enriched_chars, char_json_path, char_csv_path)
    
    # Process words if enabled
    if process_config.process_words and word_list:
        word_output_dir = os.path.join(process_config.output_dir, "words")
        os.makedirs(word_output_dir, exist_ok=True)
        
        # Output paths
        word_json_path = os.path.join(word_output_dir, f"hsk{level}_words_enriched.json")
        word_csv_path = os.path.join(word_output_dir, f"hsk{level}_words_enriched.csv") if process_config.create_csv else None
        
        logging.info(f"Enriching {len(word_list)} words from HSK {level}")
        
        # Process words in batches
        all_enriched_words = []
        for i in range(0, len(word_list), process_config.batch_size):
            batch = word_list[i:i+process_config.batch_size]
            logging.info(f"Processing word batch {i//process_config.batch_size + 1}/{(len(word_list) + process_config.batch_size - 1)//process_config.batch_size}")
            
            # Enrich the batch
            enriched_batch = batch_process_items(batch, enrich_config, pinyin_map, hsk_levels)
            all_enriched_words.extend(enriched_batch)
            
            # Save progress
            progress_path = os.path.join(word_output_dir, f"hsk{level}_words_progress.json")
            with open(progress_path, 'w', encoding='utf-8') as f:
                json.dump(all_enriched_words, f, ensure_ascii=False, indent=2)
            logging.info(f"Saved word progress to {progress_path}")
        
        # Save final results
        save_enriched_data(all_enriched_words, word_json_path, word_csv_path)

def main():
    """Main execution function."""
    # Initialize configurations
    process_config = ProcessorConfig()
    enrich_config = EnrichmentConfig()
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Integrated HSK Vocabulary Processor')
    parser.add_argument('--level', type=int, help='HSK level to process (1-7)')
    parser.add_argument('--model', type=str, default=process_config.model, help=f'Ollama model to use (default: {process_config.model})')
    parser.add_argument('--batch', type=int, default=process_config.batch_size, help=f'Batch size (default: {process_config.batch_size})')
    parser.add_argument('--chars-only', action='store_true', help='Process only characters, not words')
    parser.add_argument('--words-only', action='store_true', help='Process only words, not characters')
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
    if args.chars_only:
        process_config.process_words = False
    if args.words_only:
        process_config.process_single_chars = False
    if args.no_csv:
        process_config.create_csv = False
    
    # Ensure output directory exists
    os.makedirs(process_config.output_dir, exist_ok=True)
    
    logging.info("=" * 60)
    logging.info("Integrated HSK Vocabulary Processor")
    logging.info("=" * 60)
    logging.info(f"Using Ollama model: {process_config.model}")
    logging.info(f"Raw data directory: {process_config.raw_dir}")
    logging.info(f"Output directory: {process_config.output_dir}")
    logging.info(f"Processing characters: {process_config.process_single_chars}")
    logging.info(f"Processing words: {process_config.process_words}")
    
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