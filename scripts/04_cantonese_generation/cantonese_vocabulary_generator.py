#!/usr/bin/env python
"""
Cantonese Vocabulary Generator from HSK Data

This script:
1. Reads Chinese vocabulary from HSK JSON files
2. Uses Ollama to generate corresponding Cantonese vocabulary entries
3. Creates structured Cantonese vocabulary following Cantonese JSON Structure
4. Saves data as separate files for each HSK level (cantonese_raw_1.json, etc.)

Usage:
  python cantonese_vocabulary_generator.py [--level LEVEL] [--model MODEL] [--batch SIZE]
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
from cantonese_prompts import create_cantonese_system_prompt, create_cantonese_user_prompt_template

# Get the script directory for relative path calculations
SCRIPT_DIR = Path(__file__).parent.parent
# Go up two levels to reach project root
PROJECT_ROOT = SCRIPT_DIR.parent

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
    log_filename = logs_dir / f"cantonese_generator_{timestamp}.log"

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
        # Get all cantonese generator log files
        log_files = list(logs_dir.glob("cantonese_generator_*.log"))

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


class CantoneseGeneratorConfig:
    """Configuration for the Cantonese vocabulary generator."""

    def __init__(self):
        # File paths (relative to script location)
        self.raw_dir = SCRIPT_DIR / "data" / "raw" / "exclusive"
        self.output_dir = SCRIPT_DIR / "data" / "cantonese_generated"

        # Ollama settings
        self.ollama_base_url = "http://localhost:11434"
        self.model = "qwen3:latest"  # Default model

        # Processing settings
        self.batch_size = 3  # Process items in batches
        self.max_retries = 3  # Maximum retry attempts per item
        self.retry_delay = 2  # Seconds to wait between retries

        # Create output directory if it doesn't exist
        self.output_dir.mkdir(parents=True, exist_ok=True)


def generate_cantonese_entry(chinese_word: str, chinese_pinyin: str, chinese_meanings: List[str],
                             hsk_level: int, config: CantoneseGeneratorConfig) -> Dict[str, Any]:
    """
    Generate a Cantonese vocabulary entry for a Chinese word using Ollama.

    Args:
        chinese_word: The Chinese word to translate
        chinese_pinyin: Pinyin pronunciation
        chinese_meanings: List of meanings in Chinese
        hsk_level: HSK level for context
        config: Generator configuration

    Returns:
        Dictionary containing the Cantonese vocabulary entry
    """
    logging.debug(f"Generating Cantonese entry for: {chinese_word}")

    # Prepare the prompt
    system_prompt = create_cantonese_system_prompt()
    user_prompt_template = create_cantonese_user_prompt_template()

    # Format meanings and add HSK context
    meanings_text = "; ".join(chinese_meanings)
    hsk_context = f"\nHSK Level: {hsk_level}"

    user_prompt = user_prompt_template.format(
        chinese_word=chinese_word,
        chinese_pinyin=chinese_pinyin,
        chinese_meanings=meanings_text,
        hsk_context=hsk_context
    )

    # Prepare the request data
    request_data = {
        "model": config.model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "stream": False,
        "options": {
            "temperature": 0.3,  # Lower temperature for more consistent results
            "top_p": 0.9
        }
    }

    # Try multiple times with error handling
    for attempt in range(config.max_retries):
        try:
            logging.debug(
                f"Requesting Cantonese data for {chinese_word} (attempt {attempt+1})")

            response = requests.post(
                f"{config.ollama_base_url}/api/chat",
                json=request_data,
                timeout=120  # 2 minute timeout
            )

            if response.status_code == 200:
                response_data = response.json()
                response_text = response_data.get("message", {}).get("content", "")

                logging.debug(f"Raw response length: {len(response_text)} chars")

                # Handle thinking tags if present
                if "<think>" in response_text and "</think>" in response_text:
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
                        cantonese_entry = json.loads(json_str)

                        # Validate required fields for the Cantonese structure
                        required_fields = [
                            "cantonese", "syllables", "frequency", "pos", "etymology", "forms"]
                        if all(field in cantonese_entry for field in required_fields):
                            # Additional validation for nested required fields
                            etymology = cantonese_entry.get("etymology", {})
                            if (etymology.get("origin") and
                                    cantonese_entry.get("forms") and len(cantonese_entry["forms"]) > 0):

                                form = cantonese_entry["forms"][0]
                                required_form_fields = [
                                    "traditional", "transcriptions", "regional_variants", "meanings"]

                                if all(field in form for field in required_form_fields):
                                    logging.info(
                                        f"Successfully generated Cantonese entry for {chinese_word}")
                                    return cantonese_entry
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
                                f for f in required_fields if f not in cantonese_entry]
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

    # Return error entry if all attempts failed (following the Cantonese structure)
    logging.warning(f"Failed to generate Cantonese entry for {chinese_word}")
    return {
        "cantonese": f"[FAILED: {chinese_word}]",
        "syllables": ["failed"],
        "frequency": 9999,
        "pos": ["x"],
        "etymology": {
            "origin": "unknown",
            "source_language": "unknown",
            "traditional_character": chinese_word,
            "notes": f"Failed to generate entry for Chinese word: {chinese_word}"
        },
        "forms": [
            {
                "traditional": f"[FAILED: {chinese_word}]",
                "simplified": f"[FAILED: {chinese_word}]",
                "transcriptions": {
                    "jyutping": "unknown",
                    "yale": "unknown",
                    "ipa": "/unknown/",
                    "tone_pattern": "unknown"
                },
                "regional_variants": {
                    "hong_kong": f"[FAILED: {chinese_word}]",
                    "guangzhou": f"[FAILED: {chinese_word}]",
                    "macau": f"[FAILED: {chinese_word}]"
                },
                "meanings": [
                    f"Failed to generate meaning for: {chinese_word}"
                ]
            }
        ]
    }


def extract_chinese_words_from_hsk_file(file_path: Path) -> List[Tuple[str, str, List[str]]]:
    """
    Extract Chinese words, pinyin, and meanings from an HSK JSON file.

    Args:
        file_path: Path to the HSK JSON file

    Returns:
        List of tuples containing (chinese_word, pinyin, meanings_list)
    """
    logging.info(f"Extracting Chinese words from: {file_path}")

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            hsk_data = json.load(f)

        extracted_words = []

        for item in hsk_data:
            simplified = item.get("simplified", "")

            if simplified:
                # Extract pinyin
                pinyin = ""
                if "forms" in item and len(item["forms"]) > 0:
                    for form in item["forms"]:
                        transcriptions = form.get("transcriptions", {})
                        if transcriptions.get("pinyin"):
                            pinyin = transcriptions["pinyin"]
                            break

                # Extract meanings
                meanings = []
                if "forms" in item and len(item["forms"]) > 0:
                    for form in item["forms"]:
                        form_meanings = form.get("meanings", [])
                        meanings.extend(form_meanings)

                # Remove duplicates while preserving order
                seen = set()
                unique_meanings = []
                for meaning in meanings:
                    if meaning not in seen:
                        seen.add(meaning)
                        unique_meanings.append(meaning)

                extracted_words.append((simplified, pinyin, unique_meanings))

        logging.info(f"Extracted {len(extracted_words)} words from {file_path}")
        return extracted_words

    except Exception as e:
        logging.error(f"Error extracting words from {file_path}: {e}")
        return []


def process_hsk_level(level: int, config: CantoneseGeneratorConfig):
    """
    Process a complete HSK level: extract Chinese words and generate Cantonese entries.

    Args:
        level: HSK level to process (1-7)
        config: Generator configuration
    """
    logging.info(f"Processing HSK level {level} for Cantonese generation")

    # Find input file
    input_file = config.raw_dir / f"{level}.json"
    if not input_file.exists():
        logging.error(f"HSK level {level} file not found: {input_file}")
        return

    # Extract Chinese words
    chinese_words = extract_chinese_words_from_hsk_file(input_file)
    if not chinese_words:
        logging.warning(f"No Chinese words found in HSK level {level}")
        return

    logging.info(f"Processing {len(chinese_words)} Chinese words from HSK {level}")

    # Process words in batches
    cantonese_entries = []
    total_words = len(chinese_words)

    for i in range(0, total_words, config.batch_size):
        batch = chinese_words[i:i+config.batch_size]
        batch_num = i // config.batch_size + 1
        total_batches = (total_words + config.batch_size - 1) // config.batch_size

        logging.info(f"Processing batch {batch_num}/{total_batches} ({len(batch)} words)")

        for chinese_word, pinyin, meanings in batch:
            logging.info(f"Generating Cantonese for: {chinese_word}")

            cantonese_entry = generate_cantonese_entry(
                chinese_word, pinyin, meanings, level, config
            )

            cantonese_entries.append(cantonese_entry)

            # Small delay between items to avoid overwhelming the API
            time.sleep(0.5)

        # Save progress after each batch
        progress_file = config.output_dir / f"cantonese_raw_{level}_progress.json"
        with open(progress_file, 'w', encoding='utf-8') as f:
            json.dump(cantonese_entries, f, ensure_ascii=False, indent=2)
        logging.info(f"Saved progress to {progress_file}")

    # Save final results
    output_file = config.output_dir / f"cantonese_raw_{level}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(cantonese_entries, f, ensure_ascii=False, indent=2)

    logging.info(f"Completed HSK level {level}. Saved {len(cantonese_entries)} entries to {output_file}")


def check_ollama_connection(config: CantoneseGeneratorConfig) -> bool:
    """Check if Ollama is running and the model is available."""
    try:
        # Check if Ollama is running
        response = requests.get(f"{config.ollama_base_url}/api/tags", timeout=5)
        if response.status_code == 200:
            # Check if the specified model is available
            models_data = response.json()
            available_models = [model.get("name", "") for model in models_data.get("models", [])]
            
            if config.model in available_models:
                logging.info(f"Successfully connected to Ollama with model: {config.model}")
                return True
            else:
                logging.error(f"Model {config.model} not found. Available models: {available_models}")
                return False
        else:
            logging.error(f"Failed to connect to Ollama: {response.status_code}")
            return False
    except Exception as e:
        logging.error(f"Error connecting to Ollama: {e}")
        return False


def main():
    """Main execution function."""
    # Initialize configuration
    config = CantoneseGeneratorConfig()

    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Cantonese Vocabulary Generator from HSK Data')
    parser.add_argument('--level', type=int, help='HSK level to process (1-7)')
    parser.add_argument('--model', type=str, default=config.model, help=f'Ollama model to use (default: {config.model})')
    parser.add_argument('--batch', type=int, default=config.batch_size, help=f'Batch size (default: {config.batch_size})')
    parser.add_argument('--raw-dir', type=str, help='Directory with raw HSK JSON files')
    parser.add_argument('--output-dir', type=str, help='Directory for Cantonese output files')
    parser.add_argument('--debug', action='store_true', help='Show debug logs in console output')
    args = parser.parse_args()

    # Update configuration from arguments
    if args.model:
        config.model = args.model
    if args.batch:
        config.batch_size = args.batch
    if args.raw_dir:
        config.raw_dir = Path(args.raw_dir)
    if args.output_dir:
        config.output_dir = Path(args.output_dir)
        config.output_dir.mkdir(parents=True, exist_ok=True)

    # Update logging level if debug is requested
    if args.debug:
        # Remove filter from stdout handler to show all log levels
        for handler in logging.getLogger().handlers:
            if isinstance(handler, logging.StreamHandler) and handler.stream == sys.stdout:
                handler.removeFilter(InfoFilter())

    logging.info("=" * 60)
    logging.info("Cantonese Vocabulary Generator")
    logging.info("=" * 60)
    logging.info(f"Using Ollama model: {config.model}")
    logging.info(f"Raw data directory: {config.raw_dir}")
    logging.info(f"Output directory: {config.output_dir}")
    logging.info(f"Log file: {log_file_path}")

    # Check Ollama connection
    if not check_ollama_connection(config):
        logging.error("Failed to connect to Ollama. Exiting.")
        return

    start_time = time.time()

    # Process HSK levels
    if args.level:
        process_hsk_level(args.level, config)
    else:
        for level in range(1, 8):  # HSK levels 1-7
            process_hsk_level(level, config)

    # Print summary
    elapsed_time = time.time() - start_time
    hours, remainder = divmod(elapsed_time, 3600)
    minutes, seconds = divmod(remainder, 60)

    logging.info("=" * 60)
    logging.info("Cantonese Generation Complete!")
    logging.info(f"Total time: {int(hours)}h {int(minutes)}m {int(seconds)}s")
    logging.info(f"Output files saved to: {config.output_dir}")
    logging.info(f"Log file: {log_file_path}")
    logging.info("=" * 60)


if __name__ == "__main__":
    main()