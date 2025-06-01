#!/usr/bin/env python
"""
Vietnamese Vocabulary Processor

This script:
1. Extracts vocabulary from Vietnamese JSON files
2. Enriches vocabulary with detailed meanings, Chinese translations, and examples
3. Saves the enriched data in structured formats suitable for the language learning app

Usage:
  python vietnamese_vocabulary_processor.py [--input FILE] [--model MODEL] [--batch SIZE]
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
import vietnamese_vocabulary_enrichment as ve
from vietnamese_vocabulary_enrichment import EnrichmentConfig

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Change from INFO to DEBUG for more detailed logs
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("vietnamese_processor_debug.log", encoding='utf-8'),  # Separate debug log
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
    """Configuration for the Vietnamese vocabulary processor."""
    def __init__(self):
        # Base directories
        self.input_file = "../../data/vietnamese_generated/vietnamese_raw_1.json"
        self.output_dir = "../../data/enriched"
        
        # Processing settings
        self.batch_size = 5  # Process items in batches
        self.create_csv = True  # Whether to create CSV files in addition to JSON
        self.output_prefix = "vietnamese"  # Prefix for output files

def extract_from_vietnamese_file(file_path: str) -> Tuple[List[Dict[str, Any]], Dict[str, str], Dict[str, int]]:
    """
    Extract vocabulary from a Vietnamese JSON file.
    
    Args:
        file_path: Path to Vietnamese JSON file
        
    Returns:
        Tuple of:
        - List of Vietnamese vocabulary items with metadata
        - Dictionary mapping items to IPA pronunciation
        - Dictionary mapping items to frequency scores
    """
    logging.info(f"Extracting from file: {file_path}")
    
    try:
        # Load the JSON file
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Process vocabulary items
        vocabulary_items = []
        ipa_map = {}
        frequency_map = {}
        
        for item in data:
            vietnamese_word = item.get("vietnamese", "")
            
            # Skip if no Vietnamese word
            if not vietnamese_word:
                continue
            
            # Extract basic information
            frequency = item.get("frequency", 0)
            pos_list = item.get("pos", [])
            etymology = item.get("etymology", {})
            forms = item.get("forms", [])
            
            # Extract IPA from forms if available
            ipa_pronunciation = ""
            regional_variants = {}
            meanings = []
            
            if forms and len(forms) > 0:
                form = forms[0]  # Use first form
                transcriptions = form.get("transcriptions", {})
                ipa_pronunciation = transcriptions.get("ipa", "")
                regional_variants = form.get("regional_variants", {})
                meanings = form.get("meanings", [])
            
            # Create vocabulary item
            vocab_item = {
                "vietnamese": vietnamese_word,
                "syllables": item.get("syllables", [vietnamese_word]),
                "frequency": frequency,
                "pos": pos_list,
                "etymology": etymology,
                "ipa": ipa_pronunciation,
                "regional_variants": regional_variants,
                "meanings": meanings
            }
            
            vocabulary_items.append(vocab_item)
            
            # Map for quick lookup
            if ipa_pronunciation:
                ipa_map[vietnamese_word] = ipa_pronunciation
            frequency_map[vietnamese_word] = frequency
        
        logging.info(f"Extracted {len(vocabulary_items)} Vietnamese vocabulary items")
        
        return vocabulary_items, ipa_map, frequency_map
    
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
                vietnamese_word = item_data.get("vietnamese", "")
                ipa = item_data.get("ipa", "")
                frequency = item_data.get("frequency", 0)
                
                # Process each meaning
                for i, meaning in enumerate(item_data.get("meanings", [])):
                    # Add main row for the meaning
                    row = {
                        "vietnamese": vietnamese_word,
                        "ipa": ipa,
                        "frequency": frequency,
                        "meaning_index": i,
                        "chinese": meaning.get("chinese", ""),
                        "pinyin": meaning.get("pinyin", ""),
                        "english": meaning.get("english", ""),
                        "part_of_speech": meaning.get("part_of_speech", ""),
                        "usage_frequency": meaning.get("usage_frequency", ""),
                        "etymology_origin": item_data.get("etymology", {}).get("origin", ""),
                        "etymology_source": item_data.get("etymology", {}).get("source_language", "")
                    }
                    csv_rows.append(row)
                    
                    # Add rows for examples
                    for j, example in enumerate(meaning.get("examples", [])):
                        example_row = {
                            "vietnamese": vietnamese_word,
                            "ipa": ipa,
                            "frequency": frequency,
                            "meaning_index": i,
                            "example_index": j,
                            "example_vietnamese": example.get("vietnamese", ""),
                            "example_chinese": example.get("chinese", ""),
                            "example_pinyin": example.get("pinyin", ""),
                            "example_english": example.get("english", "")
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

def process_vietnamese_vocabulary(input_file: str, process_config: ProcessorConfig, enrich_config: EnrichmentConfig):
    """
    Process Vietnamese vocabulary: extract, enrich, and save.
    
    Args:
        input_file: Path to input Vietnamese JSON file
        process_config: Processing configuration
        enrich_config: Enrichment configuration
    """
    logging.info(f"Processing Vietnamese vocabulary from {input_file}")
    
    if not os.path.exists(input_file):
        logging.error(f"Input file not found: {input_file}")
        return
    
    # Extract vocabulary items
    vocabulary_items, ipa_map, frequency_map = extract_from_vietnamese_file(input_file)
    
    if not vocabulary_items:
        logging.warning(f"No vocabulary items found in {input_file}")
        return
    
    # Set up output directories
    output_dir = os.path.join(process_config.output_dir, "vietnamese_vocabulary")
    os.makedirs(output_dir, exist_ok=True)
    
    # Output paths
    json_path = os.path.join(output_dir, f"{process_config.output_prefix}_enriched.json")
    csv_path = os.path.join(output_dir, f"{process_config.output_prefix}_enriched.csv") if process_config.create_csv else None
    
    logging.info(f"Enriching {len(vocabulary_items)} Vietnamese vocabulary items")
    
    # Process items in batches
    all_enriched_items = []
    for i in range(0, len(vocabulary_items), process_config.batch_size):
        batch = vocabulary_items[i:i+process_config.batch_size]
        logging.info(f"Processing batch {i//process_config.batch_size + 1}/{(len(vocabulary_items) + process_config.batch_size - 1)//process_config.batch_size}")
        
        # Enrich the batch
        enriched_batch = ve.batch_process_items(batch, enrich_config)
        all_enriched_items.extend(enriched_batch)
        
        # Save progress
        progress_path = os.path.join(output_dir, f"{process_config.output_prefix}_progress.json")
        with open(progress_path, 'w', encoding='utf-8') as f:
            json.dump(all_enriched_items, f, ensure_ascii=False, indent=2)
        logging.info(f"Saved progress to {progress_path}")
    
    # Save final results
    save_enriched_data(all_enriched_items, json_path, csv_path)
    logging.info(f"Completed processing Vietnamese vocabulary")

def main():
    """Main execution function."""
    # Initialize configurations
    process_config = ProcessorConfig()
    enrich_config = EnrichmentConfig()
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Vietnamese Vocabulary Processor')
    parser.add_argument('--input', type=str, default=process_config.input_file, help='Input Vietnamese JSON file')
    parser.add_argument('--model', type=str, default=enrich_config.model, help=f'Ollama model to use (default: {enrich_config.model})')
    parser.add_argument('--batch', type=int, default=process_config.batch_size, help=f'Batch size (default: {process_config.batch_size})')
    parser.add_argument('--no-csv', action='store_true', help='Do not create CSV files')
    parser.add_argument('--output-dir', type=str, default=process_config.output_dir, help='Directory for enriched output files')
    parser.add_argument('--output-prefix', type=str, default=process_config.output_prefix, help=f'Prefix for output files (default: {process_config.output_prefix})')
    parser.add_argument('--debug', action='store_true', help='Show debug logs in console output')
    args = parser.parse_args()
    
    # Update configurations from arguments
    if args.model:
        enrich_config.model = args.model
    if args.batch:
        process_config.batch_size = args.batch
    if args.input:
        process_config.input_file = args.input
    if args.output_dir:
        process_config.output_dir = args.output_dir
    if args.output_prefix:
        process_config.output_prefix = args.output_prefix
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
    logging.info("Vietnamese Vocabulary Processor")
    logging.info("=" * 60)
    logging.info(f"Using Ollama model: {enrich_config.model}")
    logging.info(f"Input file: {process_config.input_file}")
    logging.info(f"Output directory: {process_config.output_dir}")
    logging.info(f"Output prefix: {process_config.output_prefix}")
    
    # Check Ollama connection
    if not ve.check_ollama_connection(enrich_config):
        logging.error("Failed to connect to Ollama. Exiting.")
        return
    
    start_time = time.time()
    
    # Process Vietnamese vocabulary
    process_vietnamese_vocabulary(process_config.input_file, process_config, enrich_config)
    
    # Print summary
    elapsed_time = time.time() - start_time
    hours, remainder = divmod(elapsed_time, 3600)
    minutes, seconds = divmod(remainder, 60)
    
    logging.info("=" * 60)
    logging.info("Processing completed!")
    logging.info(f"Total processing time: {int(hours)}h {int(minutes)}m {int(seconds)}s")
    logging.info(f"Check the log file for details: vietnamese_processor_debug.log")
    logging.info("=" * 60)

if __name__ == "__main__":
    main()
