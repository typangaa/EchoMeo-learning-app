#!/usr/bin/env python
"""
Vietnamese Vocabulary Generator from HSK Data

This script:
1. Reads Chinese vocabulary from HSK JSON files
2. Uses Ollama to generate corresponding Vietnamese vocabulary entries
3. Creates structured Vietnamese vocabulary following the updated Vietnamese JSON Structure
4. Saves data as separate files for each HSK level (vietnamese_raw_1.json, etc.)

Usage:
  python vietnamese_vocabulary_generator.py [--level LEVEL] [--model MODEL] [--batch SIZE]
"""

import os
import json
import time
import argparse
import sys
import logging
import re
from typing import Dict, List, Any, Set, Optional, Tuple
from pathlib import Path
import requests
from datetime import datetime

# Import prompts from separate module
from vietnamese_prompts import create_vietnamese_system_prompt, create_vietnamese_user_prompt_template

# Get the script directory for relative path calculations
SCRIPT_DIR = Path(__file__).parent.parent
# Go up two levels to reach project root
PROJECT_ROOT = SCRIPT_DIR.parent.parent

# Setup logging with timestamped files in logs directory


def setup_logging():
    """Setup logging with timestamped files in logs directory."""
    # Create logs directory relative to script location
    logs_dir = SCRIPT_DIR / "logs"
    logs_dir.mkdir(exist_ok=True)

    # Clean up old log files (keep only last 10)
    cleanup_old_logs(logs_dir)

    # Create timestamp for log files
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_filename = logs_dir / f"vietnamese_generator_{timestamp}.log"

    # Configure logging
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_filename, encoding='utf-8'),
            logging.StreamHandler(sys.stdout)
        ]
    )

    return str(log_filename)


def cleanup_old_logs(logs_dir: Path, keep_count: int = 10):
    """Clean up old log files, keeping only the most recent ones.

    Args:
        logs_dir: Path to logs directory
        keep_count: Number of recent log files to keep (default: 10)
    """
    try:
        # Get all vietnamese generator log files
        log_files = list(logs_dir.glob("vietnamese_generator_*.log"))

        if len(log_files) <= keep_count:
            return  # Nothing to clean up

        # Sort by modification time (newest first)
        log_files.sort(key=lambda x: x.stat().st_mtime, reverse=True)

        # Remove older files
        files_to_remove = log_files[keep_count:]
        for old_log in files_to_remove:
            try:
                old_log.unlink()
                print(f"Cleaned up old log file: {old_log.name}")
            except Exception as e:
                print(
                    f"Warning: Could not remove old log file {old_log.name}: {e}")

    except Exception as e:
        print(f"Warning: Error during log cleanup: {e}")


# Initialize logging and get log file path
log_file_path = setup_logging()

# Add a filter to the stdout handler to only show INFO and above


class InfoFilter(logging.Filter):
    def filter(self, record):
        return record.levelno >= logging.INFO


# Apply filter to stdout handler
for handler in logging.getLogger().handlers:
    if isinstance(handler, logging.StreamHandler) and handler.stream == sys.stdout:
        handler.addFilter(InfoFilter())


class VietnameseGeneratorConfig:
    """Configuration for the Vietnamese vocabulary generator."""

    def __init__(self):
        # API settings
        self.api_url = "http://localhost:11434/api/generate"
        self.model = "qwen3:latest"
        self.max_retries = 3
        self.retry_delay = 5  # seconds
        self.temperature = 0.3

        # Processing settings
        self.batch_size = 3  # Process fewer items per batch for Vietnamese generation

        # File paths - relative to script location
        self.raw_dir = str(SCRIPT_DIR / "data" / "raw" / "exclusive")
        self.output_dir = str(SCRIPT_DIR / "data" / "vietnamese_generated")


def generate_vietnamese_entry(chinese_word: str, chinese_pinyin: str, chinese_meanings: List[str],
                              config: VietnameseGeneratorConfig, hsk_level: int = None) -> Dict[str, Any]:
    """
    Generate a Vietnamese vocabulary entry corresponding to a Chinese word.

    Args:
        chinese_word: The Chinese word/character
        chinese_pinyin: Pinyin pronunciation
        chinese_meanings: List of Chinese word meanings
        config: Configuration settings
        hsk_level: HSK level for context

    Returns:
        Dictionary with Vietnamese vocabulary entry following the updated structure
    """
    system_prompt = create_vietnamese_system_prompt()
    user_prompt_template = create_vietnamese_user_prompt_template()

    # Create detailed context for the Vietnamese generation
    meanings_str = "; ".join(
        chinese_meanings) if chinese_meanings else "meanings not provided"

    # Add HSK context if available
    hsk_context = ""
    if hsk_level:
        hsk_context = f"\nHSK Level: {hsk_level} (consider frequency appropriate for this level)"

    # Format the user prompt
    user_prompt = user_prompt_template.format(
        chinese_word=chinese_word,
        chinese_pinyin=chinese_pinyin,
        chinese_meanings=meanings_str,
        hsk_context=hsk_context
    )

    logging.info(f"Generating Vietnamese entry for: {chinese_word}")
    logging.debug(f"System prompt length: {len(system_prompt)} chars")
    logging.debug(f"User prompt: {user_prompt}")

    # Prepare payload for Ollama API
    payload = {
        "model": config.model,
        "prompt": user_prompt,
        "system": system_prompt,
        "stream": False,
        "options": {
            "temperature": config.temperature,
            "num_predict": 15000  # Allow for detailed Vietnamese entries
        }
    }

    for attempt in range(config.max_retries):
        try:
            logging.info(
                f"API request for {chinese_word} (attempt {attempt+1})")

            response = requests.post(config.api_url, json=payload)
            logging.debug(f"API response status: {response.status_code}")

            if response.status_code == 200:
                result = response.json()
                response_text = result.get("response", "")

                logging.info(
                    f"Response received for {chinese_word} ({len(response_text)} chars)")
                logging.debug(f"Full response: {response_text}")

                # Clean up response text
                if response_text.startswith("<think>") and "</think>" in response_text:
                    thinking_text = response_text.split(
                        "</think>")[0].replace("<think>", "").strip()
                    response_text = response_text.split("</think>")[1].strip()
                    logging.debug(
                        f"Removed thinking section ({len(thinking_text)} chars)")

                # Extract JSON
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1

                if json_start >= 0 and json_end > json_start:
                    json_str = response_text[json_start:json_end]
                    logging.debug(f"Extracted JSON ({len(json_str)} chars)")

                    try:
                        vietnamese_entry = json.loads(json_str)

                        # Validate required fields for the updated structure
                        required_fields = [
                            "vietnamese", "syllables", "frequency", "pos", "etymology", "forms"]
                        if all(field in vietnamese_entry for field in required_fields):
                            # Additional validation for nested required fields
                            etymology = vietnamese_entry.get("etymology", {})
                            if (etymology.get("origin") and
                                    vietnamese_entry.get("forms") and len(vietnamese_entry["forms"]) > 0):

                                form = vietnamese_entry["forms"][0]
                                required_form_fields = [
                                    "standard", "transcriptions", "regional_variants", "meanings"]

                                if all(field in form for field in required_form_fields):
                                    logging.info(
                                        f"Successfully generated Vietnamese entry for {chinese_word}")
                                    return vietnamese_entry
                                else:
                                    missing = [
                                        f for f in required_form_fields if f not in form]
                                    logging.warning(
                                        f"Missing required form fields for {chinese_word}: {missing}")
                            else:
                                logging.warning(
                                    f"Missing required nested fields for {chinese_word}")
                        else:
                            missing = [
                                f for f in required_fields if f not in vietnamese_entry]
                            logging.warning(
                                f"Missing required fields for {chinese_word}: {missing}")

                    except json.JSONDecodeError as e:
                        logging.error(
                            f"JSON parse error for {chinese_word}: {e}")
                        logging.error(f"Problematic JSON: {json_str[:200]}...")

                else:
                    logging.error(
                        f"No valid JSON found in response for {chinese_word}")

            else:
                logging.error(
                    f"API error for {chinese_word}: {response.status_code} - {response.text}")

            # Wait before retry
            if attempt < config.max_retries - 1:
                logging.info(
                    f"Waiting {config.retry_delay} seconds before retry...")
                time.sleep(config.retry_delay)

        except Exception as e:
            logging.error(f"Error processing {chinese_word}: {e}")
            if attempt < config.max_retries - 1:
                logging.info(
                    f"Waiting {config.retry_delay} seconds before retry...")
                time.sleep(config.retry_delay)

    # Return error entry if all attempts failed (following the updated structure)
    logging.warning(f"Failed to generate Vietnamese entry for {chinese_word}")
    return {
        "vietnamese": f"[FAILED: {chinese_word}]",
        "syllables": ["failed"],
        "frequency": 9999,
        "pos": ["x"],
        "etymology": {
            "origin": "unknown",
            "source_language": "unknown",
            "chu_nom": "null",
            "notes": f"Failed to generate entry for Chinese word: {chinese_word}"
        },
        "forms": [
            {
                "standard": f"[FAILED: {chinese_word}]",
                "transcriptions": {
                    "ipa": "/unknown/",
                    "simplified_pronunciation": "unknown",
                    "tone_pattern": "unknown"
                },
                "regional_variants": {
                    "northern": f"[FAILED: {chinese_word}]",
                    "central": f"[FAILED: {chinese_word}]",
                    "southern": f"[FAILED: {chinese_word}]"
                },
                "meanings": [f"Failed to generate meaning for {chinese_word}"]
            }
        ]
    }


def extract_chinese_vocabulary(hsk_file_path: str) -> List[Dict[str, Any]]:
    """
    Extract Chinese vocabulary items from HSK JSON file.

    Args:
        hsk_file_path: Path to HSK JSON file

    Returns:
        List of dictionaries with Chinese vocabulary data
    """
    logging.info(f"Extracting Chinese vocabulary from: {hsk_file_path}")

    try:
        with open(hsk_file_path, 'r', encoding='utf-8') as f:
            hsk_data = json.load(f)

        vocabulary_items = []

        for item in hsk_data:
            simplified = item.get("simplified", "")
            if not simplified:
                continue

            # Extract pinyin and meanings
            pinyin = ""
            meanings = []

            if "forms" in item and len(item["forms"]) > 0:
                for form in item["forms"]:
                    # Get pinyin
                    if "transcriptions" in form and "pinyin" in form["transcriptions"]:
                        pinyin = form["transcriptions"]["pinyin"]

                    # Get meanings
                    if "meanings" in form and isinstance(form["meanings"], list):
                        meanings.extend(form["meanings"])

            vocabulary_items.append({
                "chinese_word": simplified,
                "pinyin": pinyin,
                "meanings": meanings,
                "traditional": item.get("traditional", ""),
                "frequency": item.get("frequency", 1000),
                "pos": item.get("pos", [])
            })

        logging.info(
            f"Extracted {len(vocabulary_items)} Chinese vocabulary items")
        return vocabulary_items

    except Exception as e:
        logging.error(f"Error extracting from {hsk_file_path}: {e}")
        return []


def process_hsk_level(level: int, config: VietnameseGeneratorConfig):
    """
    Process a complete HSK level and generate Vietnamese vocabulary.

    Args:
        level: HSK level to process
        config: Configuration settings
    """
    logging.info(f"Processing HSK level {level}")

    # Input file path
    hsk_file_path = os.path.join(config.raw_dir, f"{level}.json")

    if not os.path.exists(hsk_file_path):
        logging.error(f"HSK level {level} file not found: {hsk_file_path}")
        return

    # Extract Chinese vocabulary
    chinese_vocabulary = extract_chinese_vocabulary(hsk_file_path)

    if not chinese_vocabulary:
        logging.warning(f"No vocabulary found in HSK level {level}")
        return

    # Set up output directory and file
    os.makedirs(config.output_dir, exist_ok=True)
    output_file = os.path.join(
        config.output_dir, f"vietnamese_raw_{level}.json")
    progress_file = os.path.join(
        config.output_dir, f"vietnamese_raw_{level}_progress.json")

    logging.info(
        f"Generating Vietnamese vocabulary for {len(chinese_vocabulary)} items from HSK {level}")

    # Process items in batches
    vietnamese_vocabulary = []
    processed_count = 0

    for i in range(0, len(chinese_vocabulary), config.batch_size):
        batch = chinese_vocabulary[i:i+config.batch_size]
        batch_num = i//config.batch_size + 1
        total_batches = (len(chinese_vocabulary) +
                         config.batch_size - 1) // config.batch_size

        logging.info(
            f"Processing batch {batch_num}/{total_batches} (items {i+1}-{min(i+config.batch_size, len(chinese_vocabulary))})")

        for item in batch:
            vietnamese_entry = generate_vietnamese_entry(
                chinese_word=item["chinese_word"],
                chinese_pinyin=item["pinyin"],
                chinese_meanings=item["meanings"],
                config=config,
                hsk_level=level
            )

            if vietnamese_entry:
                vietnamese_vocabulary.append(vietnamese_entry)
                processed_count += 1
                logging.info(
                    f"Generated entry {processed_count}/{len(chinese_vocabulary)}: {vietnamese_entry.get('vietnamese', 'Unknown')}")

            # Small delay between items
            time.sleep(1)

        # Save progress after each batch
        with open(progress_file, 'w', encoding='utf-8') as f:
            json.dump(vietnamese_vocabulary, f, ensure_ascii=False, indent=2)
        logging.info(f"Saved progress: {len(vietnamese_vocabulary)} entries")

        # Longer delay between batches
        if batch_num < total_batches:
            logging.info("Waiting 5 seconds between batches...")
            time.sleep(5)

    # Save final results
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(vietnamese_vocabulary, f, ensure_ascii=False, indent=2)

    logging.info(
        f"Completed HSK level {level}: Generated {len(vietnamese_vocabulary)} Vietnamese vocabulary entries")
    logging.info(f"Output saved to: {output_file}")


def check_ollama_connection(config: VietnameseGeneratorConfig) -> bool:
    """Check if Ollama server is running and model is available."""
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code != 200:
            logging.error("Ollama server is not running")
            return False

        models = response.json().get("models", [])
        model_name = config.model.split(':')[0]

        if not any(model["name"].startswith(model_name) for model in models):
            logging.warning(
                f"Model {model_name} may not be available. Please run: ollama pull {model_name}")
            return False

        logging.info(
            f"Successfully connected to Ollama with model: {config.model}")
        return True
    except requests.ConnectionError:
        logging.error(
            "Could not connect to Ollama. Please ensure it's running.")
        return False
    except Exception as e:
        logging.error(f"Error checking Ollama connection: {e}")
        return False


def main():
    """Main execution function."""
    # Initialize configuration
    config = VietnameseGeneratorConfig()

    # Parse command line arguments
    parser = argparse.ArgumentParser(
        description='Vietnamese Vocabulary Generator from HSK Data')
    parser.add_argument('--level', type=int, help='HSK level to process (1-7)')
    parser.add_argument('--model', type=str, default=config.model,
                        help=f'Ollama model to use (default: {config.model})')
    parser.add_argument('--batch', type=int, default=config.batch_size,
                        help=f'Batch size (default: {config.batch_size})')
    parser.add_argument('--raw-dir', type=str, default=config.raw_dir,
                        help='Directory with raw HSK JSON files')
    parser.add_argument('--output-dir', type=str, default=config.output_dir,
                        help='Directory for Vietnamese output files')
    parser.add_argument('--debug', action='store_true',
                        help='Show debug logs in console output')
    args = parser.parse_args()

    # Update configuration from arguments
    if args.model:
        config.model = args.model
    if args.batch:
        config.batch_size = args.batch
    if args.raw_dir:
        config.raw_dir = args.raw_dir
    if args.output_dir:
        config.output_dir = args.output_dir
    if args.debug:
        # Remove filter from stdout handler to show all log levels
        for handler in logging.getLogger().handlers:
            if isinstance(handler, logging.StreamHandler) and handler.stream == sys.stdout:
                handler.removeFilter(InfoFilter())

    # Print startup information
    logging.info("=" * 70)
    logging.info("Vietnamese Vocabulary Generator from HSK Data")
    logging.info("=" * 70)
    logging.info(f"Script location: {SCRIPT_DIR}")
    logging.info(f"Project root: {PROJECT_ROOT}")
    logging.info(f"Log file: {log_file_path}")
    logging.info(f"Using Ollama model: {config.model}")
    logging.info(f"Raw HSK data directory: {config.raw_dir}")
    logging.info(f"Output directory: {config.output_dir}")
    logging.info(f"Batch size: {config.batch_size}")

    # Check if directories exist
    if not os.path.exists(config.raw_dir):
        logging.error(f"Raw data directory does not exist: {config.raw_dir}")
        logging.info(
            "Please ensure the HSK JSON files are in the correct location.")
        return

    # Check Ollama connection
    if not check_ollama_connection(config):
        logging.error("Failed to connect to Ollama. Exiting.")
        return

    start_time = time.time()

    # Process HSK levels
    if args.level:
        if 1 <= args.level <= 7:
            process_hsk_level(args.level, config)
        else:
            logging.error("HSK level must be between 1 and 7")
    else:
        # Process all levels
        for level in range(1, 8):
            logging.info(f"\n{'='*50}")
            logging.info(f"Starting HSK Level {level}")
            logging.info(f"{'='*50}")
            process_hsk_level(level, config)

    # Print completion summary
    elapsed_time = time.time() - start_time
    hours, remainder = divmod(elapsed_time, 3600)
    minutes, seconds = divmod(remainder, 60)

    logging.info("=" * 70)
    logging.info("Vietnamese vocabulary generation completed!")
    logging.info(
        f"Total processing time: {int(hours)}h {int(minutes)}m {int(seconds)}s")
    logging.info(f"Check the log file for details: {log_file_path}")
    logging.info(f"Output files saved in: {config.output_dir}")
    logging.info("=" * 70)


if __name__ == "__main__":
    main()
