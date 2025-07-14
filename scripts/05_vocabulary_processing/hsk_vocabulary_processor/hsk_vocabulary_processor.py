#!/usr/bin/env python
"""
HSK Vocabulary Processor

This script:
1. Extracts vocabulary from HSK JSON files
2. Enriches vocabulary with detailed meanings and translations
3. Saves the enriched data in structured formats

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

# Import the vocabulary enrichment module
import vocabulary_enrichment as ve
from vocabulary_enrichment import EnrichmentConfig

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Change from INFO to DEBUG for more detailed logs
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("hsk_processor_debug.log", encoding='utf-8'),  # Separate debug log
        logging.StreamHandler(sys.stdout)
    ]
)

# Add a filter to the stdout handler to only show INFO and above
class InfoFilter(logging.Filter):
    def filter(self, record):
        return record.levelno >= logging.INFO

# Apply filter to stdout handler
for handler in logging.getLogger().handlers:
    if isinstance(handler, logging.StreamHandler) and handler.stream == sys.stdout:
        handler.addFilter(InfoFilter())

class ProcessorConfig:
    """Configuration for the HSK vocabulary processor."""
    def __init__(self):
        # Base directories
        self.raw_dir = "../../data/raw/exclusive"
        self.output_dir = "../../data/enriched"
        
        # Processing settings
        self.batch_size = 5  # Process items in batches
        self.create_csv = True  # Whether to create CSV files in addition to JSON

def extract_from_hsk_split_files(raw_dir: str, level: int) -> Tuple[List[str], Dict[str, str], Dict[str, int]]:
    """
    Extract vocabulary from HSK split JSON files (for level 7).
    
    Args:
        raw_dir: Directory containing the split files
        level: HSK level (should be 7 for split files)
        
    Returns:
        Tuple of:
        - List of unique vocabulary items
        - Dictionary mapping items to pinyin
        - Dictionary mapping items to HSK levels
    """
    logging.info(f"Extracting from split files for HSK level {level}")
    
    # Find all part files for this level
    part_files = []
    for i in range(1, 5):  # parts 1-4
        part_file = os.path.join(raw_dir, f"{level}_part{i}.json")
        if os.path.exists(part_file):
            part_files.append(part_file)
    
    if not part_files:
        logging.error(f"No split files found for HSK level {level}")
        return [], {}, {}
    
    # Extract from all parts
    unique_items = set()
    pinyin_map = {}
    hsk_levels = {}
    
    for part_file in part_files:
        logging.info(f"Processing part file: {part_file}")
        try:
            with open(part_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            for item in data:
                simplified = item.get("simplified", "")
                
                # Add to vocabulary list if not empty
                if simplified:
                    unique_items.add(simplified)
                    hsk_levels[simplified] = level
                    
                    # Extract pinyin if available
                    if "forms" in item and len(item["forms"]) > 0:
                        for form in item["forms"]:
                            if form.get("traditional", "") == simplified or not form.get("traditional", ""):
                                pinyin = form.get("transcriptions", {}).get("pinyin", "")
                                if pinyin:
                                    pinyin_map[simplified] = pinyin
                                    break
        except Exception as e:
            logging.error(f"Error processing {part_file}: {e}")
            continue
    
    logging.info(f"Extracted {len(unique_items)} unique items from {len(part_files)} split files")
    return list(unique_items), pinyin_map, hsk_levels

def extract_from_hsk_file(file_path: str) -> Tuple[List[str], Dict[str, str], Dict[str, int]]:
    """
    Extract vocabulary from an HSK JSON file.
    
    Args:
        file_path: Path to HSK JSON file
        
    Returns:
        Tuple of:
        - List of unique vocabulary items
        - Dictionary mapping items to pinyin
        - Dictionary mapping items to HSK levels
    """
    logging.info(f"Extracting from file: {file_path}")
    
    try:
        # Load the JSON file
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract HSK level from filename
        filename = os.path.basename(file_path).split('.')[0]
        if '_part' in filename:
            # Handle part files like "7_part1" -> level 7
            hsk_level = int(filename.split('_')[0])
        else:
            # Handle regular files like "7" -> level 7
            hsk_level = int(filename)
        
        # Extract unique vocabulary items
        unique_items = set()
        pinyin_map = {}
        hsk_levels = {}
        
        for item in data:
            simplified = item.get("simplified", "")
            
            # Add to vocabulary list if not empty
            if simplified:
                unique_items.add(simplified)
                hsk_levels[simplified] = hsk_level
                
                # Extract pinyin if available
                if "forms" in item and len(item["forms"]) > 0:
                    for form in item["forms"]:
                        if form.get("traditional", "") == simplified or not form.get("traditional", ""):
                            pinyin = form.get("transcriptions", {}).get("pinyin", "")
                            if pinyin:
                                pinyin_map[simplified] = pinyin
                                break
        
        logging.info(f"Extracted {len(unique_items)} unique vocabulary items")
        
        # Convert set to sorted list
        items_list = sorted(list(unique_items))
        
        return items_list, pinyin_map, hsk_levels
    
    except Exception as e:
        logging.error(f"Error extracting from {file_path}: {e}")
        return [], {}, {}

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
                # Get the main fields
                item_value = item_data.get("item", "")
                pinyin = item_data.get("pinyin", "")
                
                # Process each meaning
                for i, meaning in enumerate(item_data.get("meanings", [])):
                    # Add main row for the meaning
                    row = {
                        "item": item_value,
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
                            "item": item_value,
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
    
    # Handle level 7 split files differently
    if level == 7:
        # Check if split files exist
        part1_path = os.path.join(process_config.raw_dir, "7_part1.json")
        if os.path.exists(part1_path):
            logging.info(f"Using split files for HSK level {level}")
            items_list, pinyin_map, hsk_levels = extract_from_hsk_split_files(process_config.raw_dir, level)
        else:
            # Fall back to original file if split files don't exist
            file_path = os.path.join(process_config.raw_dir, f"{level}.json")
            if not os.path.exists(file_path):
                logging.error(f"HSK level {level} file not found (neither split nor original): {file_path}")
                return
            logging.info(f"Using original file for HSK level {level}")
            items_list, pinyin_map, hsk_levels = extract_from_hsk_file(file_path)
    else:
        # Set up file paths for levels 1-6
        file_path = os.path.join(process_config.raw_dir, f"{level}.json")
        
        if not os.path.exists(file_path):
            logging.error(f"HSK level {level} file not found: {file_path}")
            return
        
        # Extract vocabulary items
        items_list, pinyin_map, hsk_levels = extract_from_hsk_file(file_path)
    
    if not items_list:
        logging.warning(f"No vocabulary items found in HSK level {level}")
        return
    
    # Set up output directories
    output_dir = os.path.join(process_config.output_dir, "vocabulary")
    os.makedirs(output_dir, exist_ok=True)
    
    # Output paths
    json_path = os.path.join(output_dir, f"hsk{level}_enriched.json")
    csv_path = os.path.join(output_dir, f"hsk{level}_enriched.csv") if process_config.create_csv else None
    
    logging.info(f"Enriching {len(items_list)} vocabulary items from HSK {level}")
    
    # Process items in batches
    all_enriched_items = []
    for i in range(0, len(items_list), process_config.batch_size):
        batch = items_list[i:i+process_config.batch_size]
        logging.info(f"Processing batch {i//process_config.batch_size + 1}/{(len(items_list) + process_config.batch_size - 1)//process_config.batch_size}")
        
        # Enrich the batch
        enriched_batch = ve.batch_process_items(batch, enrich_config, pinyin_map, hsk_levels)
        all_enriched_items.extend(enriched_batch)
        
        # Save progress
        progress_path = os.path.join(output_dir, f"hsk{level}_progress.json")
        with open(progress_path, 'w', encoding='utf-8') as f:
            json.dump(all_enriched_items, f, ensure_ascii=False, indent=2)
        logging.info(f"Saved progress to {progress_path}")
    
    # Save final results
    save_enriched_data(all_enriched_items, json_path, csv_path)
    logging.info(f"Completed processing HSK level {level}")

def process_hsk_level7_part(part: int, process_config: ProcessorConfig, enrich_config: EnrichmentConfig):
    """
    Process a specific part of HSK level 7.
    
    Args:
        part: Part number to process (1-4)
        process_config: Processing configuration
        enrich_config: Enrichment configuration
    """
    if part < 1 or part > 4:
        logging.error(f"Invalid part number: {part}. Must be 1-4.")
        return
    
    logging.info(f"Processing HSK level 7 part {part}")
    
    # Set up file path for the specific part
    part_file = os.path.join(process_config.raw_dir, f"7_part{part}.json")
    
    if not os.path.exists(part_file):
        logging.error(f"HSK level 7 part {part} file not found: {part_file}")
        return
    
    # Extract vocabulary items from the specific part
    items_list, pinyin_map, hsk_levels = extract_from_hsk_file(part_file)
    
    if not items_list:
        logging.warning(f"No vocabulary items found in HSK level 7 part {part}")
        return
    
    # Set up output directories
    output_dir = os.path.join(process_config.output_dir, "vocabulary")
    os.makedirs(output_dir, exist_ok=True)
    
    # Output paths with part suffix
    json_path = os.path.join(output_dir, f"hsk7_part{part}_enriched.json")
    csv_path = os.path.join(output_dir, f"hsk7_part{part}_enriched.csv") if process_config.create_csv else None
    
    logging.info(f"Enriching {len(items_list)} vocabulary items from HSK 7 part {part}")
    
    # Process items in batches
    all_enriched_items = []
    for i in range(0, len(items_list), process_config.batch_size):
        batch = items_list[i:i+process_config.batch_size]
        logging.info(f"Processing batch {i//process_config.batch_size + 1}/{(len(items_list) + process_config.batch_size - 1)//process_config.batch_size}")
        
        # Enrich the batch
        enriched_batch = ve.batch_process_items(batch, enrich_config, pinyin_map, hsk_levels)
        all_enriched_items.extend(enriched_batch)
        
        # Save progress
        progress_path = os.path.join(output_dir, f"hsk7_part{part}_progress.json")
        with open(progress_path, 'w', encoding='utf-8') as f:
            json.dump(all_enriched_items, f, ensure_ascii=False, indent=2)
        logging.info(f"Saved progress to {progress_path}")
    
    # Save final results
    save_enriched_data(all_enriched_items, json_path, csv_path)
    logging.info(f"Completed processing HSK level 7 part {part}")

def main():
    """Main execution function."""
    # Initialize configurations
    process_config = ProcessorConfig()
    enrich_config = EnrichmentConfig()
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='HSK Vocabulary Processor')
    parser.add_argument('--level', type=int, help='HSK level to process (1-7)')
    parser.add_argument('--part', type=int, help='HSK level 7 part to process (1-4)')
    parser.add_argument('--model', type=str, default=enrich_config.model, help=f'Ollama model to use (default: {enrich_config.model})')
    parser.add_argument('--batch', type=int, default=process_config.batch_size, help=f'Batch size (default: {process_config.batch_size})')
    parser.add_argument('--no-csv', action='store_true', help='Do not create CSV files')
    parser.add_argument('--raw-dir', type=str, default=process_config.raw_dir, help='Directory with raw HSK JSON files')
    parser.add_argument('--output-dir', type=str, default=process_config.output_dir, help='Directory for enriched output files')
    parser.add_argument('--debug', action='store_true', help='Show debug logs in console output')
    args = parser.parse_args()
    
    # Update configurations from arguments
    if args.model:
        enrich_config.model = args.model
    if args.batch:
        process_config.batch_size = args.batch
    if args.raw_dir:
        process_config.raw_dir = args.raw_dir
    if args.output_dir:
        process_config.output_dir = args.output_dir
    if args.no_csv:
        process_config.create_csv = False
    if args.debug:
        # Remove filter from stdout handler to show all log levels
        for handler in logging.getLogger().handlers:
            if isinstance(handler, logging.StreamHandler) and handler.stream == sys.stdout:
                handler.removeFilter(InfoFilter())
    
    # Ensure output directory exists
    os.makedirs(process_config.output_dir, exist_ok=True)
    
    logging.info("=" * 60)
    logging.info("HSK Vocabulary Processor")
    logging.info("=" * 60)
    logging.info(f"Using Ollama model: {enrich_config.model}")
    logging.info(f"Raw data directory: {process_config.raw_dir}")
    logging.info(f"Output directory: {process_config.output_dir}")
    
    # Check Ollama connection
    if not ve.check_ollama_connection(enrich_config):
        logging.error("Failed to connect to Ollama. Exiting.")
        return
    
    start_time = time.time()
    
    # Process HSK levels
    if args.level and args.part:
        # Process specific part of HSK level 7
        if args.level == 7:
            process_hsk_level7_part(args.part, process_config, enrich_config)
        else:
            logging.error("Part processing is only available for HSK level 7")
            return
    elif args.level:
        # Process specific HSK level
        process_hsk_level(args.level, process_config, enrich_config)
    else:
        # Process all HSK levels
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