#!/usr/bin/env python
"""
Enhanced Multi-Meaning Translation Script for HSK Vocabulary using Ollama

This script:
1. Uses a two-step translation approach:
   - First step: Let the model think about the translation with context awareness
   - Second step: Extract the final translation from the thinking
2. Processes CSV files with multi-meaning support
3. Translates each meaning separately with appropriate context
4. Updates the CSV files with Vietnamese translations

Usage:
  python translate_meanings.py [level] [--model MODEL]
  
  [level] is optional. If provided, only that HSK level is processed.
          Otherwise, all levels are processed.

Requirements:
  - requests library: pip install requests
  - A running Ollama server with a suitable LLM model
"""

import os
import json
import time
import argparse
import sys
import csv
import re
import logging
import io
from typing import Dict, List, Union, Optional, Tuple

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("translation_debug.log", encoding='utf-8'),
        # Use a custom StreamHandler with UTF-8 encoding
        logging.StreamHandler(io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8'))
    ]
)

# Check for required modules first
try:
    import requests
except ImportError:
    logging.error("The 'requests' module is not installed. Please install it using: pip install requests")
    sys.exit(1)

class TranslationConfig:
    """Configuration for the translation process."""
    def __init__(self):
        self.api_url = "http://localhost:11434/api/generate"
        self.model = "qwen3:latest"
        self.current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.output_dir = os.path.join(self.current_dir, "output")
        self.show_full_response = True

def step1_thinking_phase(word: str, english_meaning: str, pinyin: str, config: TranslationConfig) -> str:
    """
    First step of the two-step translation process.
    Let the model think about translating a specific meaning of a Chinese word.
    
    Args:
        word: The Chinese word
        english_meaning: The specific English meaning to translate
        pinyin: Pinyin transcription for additional context
        config: Translation configuration
        
    Returns:
        The thinking response text
    """
    # System prompt for thinking
    system_prompt = """You are a highly skilled translator from Chinese to Vietnamese.
    Think carefully about the best translation for the given Chinese word with its specific meaning.
    Consider all cultural nuances and the context provided.
    You can think out loud about different possible translations.
    Be detailed in your reasoning, but conclude with a clear final translation."""
    
    # Create a context-aware prompt
    context = f"Chinese word: {word}"
    if pinyin:
        context += f"\nPinyin: {pinyin}"
    context += f"\nSpecific meaning in English: {english_meaning}"
    
    user_prompt = f"Think about how to translate this specific meaning of a Chinese word to Vietnamese:\n\n{context}\n\nThink step by step about the best translation:"
    
    # Make API call for thinking
    try:
        thinking_payload = {
            "model": config.model,
            "prompt": user_prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,  # Higher temperature to encourage exploration
                "num_predict": 300  # Allow more tokens for thinking
            }
        }
        
        logging.info("STEP 1: Asking model to think about translation...")
        logging.debug(f"Thinking system prompt: {system_prompt}")
        logging.debug(f"Thinking user prompt: {user_prompt}")
        
        thinking_response = requests.post(config.api_url, json=thinking_payload)
        
        if thinking_response.status_code != 200:
            logging.error(f"Error in thinking step: {thinking_response.status_code}")
            logging.error(f"Response: {thinking_response.text}")
            return ""
            
        thinking_result = thinking_response.json()
        thinking_text = thinking_result.get("response", "")
        
        # Log the full thinking response
        logging.info(f"Thinking step response code: {thinking_response.status_code}")
        if config.show_full_response:
            logging.info("FULL THINKING RESPONSE:")
            logging.info("-" * 50)
            logging.info(thinking_text)
            logging.info("-" * 50)
        else:
            logging.info(f"Thinking response (abbreviated): {thinking_text[:100]}...")
        
        # Check if thinking response is empty or just <think>
        if not thinking_text or thinking_text.strip() == "<think>":
            logging.warning("Empty thinking response or just <think> tag.")
            return ""
        
        return thinking_text
        
    except Exception as e:
        logging.error(f"Error in thinking step: {e}")
        return ""

def step2_extraction_phase(thinking_text: str, word: str, config: TranslationConfig) -> Dict[str, Union[str, int]]:
    """
    Second step of the two-step translation process.
    Ask the model to extract the final translation from the thinking.
    
    Args:
        thinking_text: The thinking response from step 1
        word: The original Chinese word
        config: The translation configuration
        
    Returns:
        Dictionary with translation and confidence
    """
    # Check if thinking text is empty
    if not thinking_text:
        logging.warning("No thinking text to extract from. Using direct translation as fallback.")
        return direct_translation_fallback(word, "", config)
    
    # System prompt for extraction
    system_prompt = """You are a Vietnamese translation extractor.
    I'll give you a detailed thinking process about translating a Chinese word to Vietnamese.
    Your job is to extract ONLY the final Vietnamese translation from this thinking process.
    
    Output format:
    {
      "translation": "the Vietnamese translation word or phrase",
      "confidence": a number from 1-5 where 5 is highest confidence
    }
    
    Just output the JSON object, nothing else."""
    
    # User prompt for extraction
    user_prompt = f"""Below is a detailed thinking process about translating a Chinese word to Vietnamese. 
Extract ONLY the final Vietnamese translation word or phrase.

Thinking process:
{thinking_text}

Output the Vietnamese translation in JSON format:"""
    
    # Make API call for extraction
    try:
        extraction_payload = {
            "model": config.model,
            "prompt": user_prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": 0.1,  # Low temperature for consistent output
                "num_predict": 100  # Enough tokens for JSON response
            }
        }
        
        logging.info("STEP 2: Asking model to extract final translation...")
        logging.debug(f"Extraction system prompt: {system_prompt}")
        logging.debug(f"Extraction user prompt: {user_prompt}")
        
        extraction_response = requests.post(config.api_url, json=extraction_payload)
        
        if extraction_response.status_code != 200:
            logging.error(f"Error in extraction step: {extraction_response.status_code}")
            logging.error(f"Response: {extraction_response.text}")
            return direct_translation_fallback(word, "", config)
            
        extraction_result = extraction_response.json()
        extraction_text = extraction_result.get("response", "")
        
        # Log the full extraction response
        logging.info(f"Extraction step response code: {extraction_response.status_code}")
        if config.show_full_response:
            logging.info("FULL EXTRACTION RESPONSE:")
            logging.info("-" * 50)
            logging.info(extraction_text)
            logging.info("-" * 50)
        else:
            logging.info(f"Extraction response: {extraction_text}")
        
        # Try to parse JSON output
        try:
            # Find JSON in the response (in case there's any extra text)
            json_start = extraction_text.find('{')
            json_end = extraction_text.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = extraction_text[json_start:json_end]
                translation_data = json.loads(json_str)
                
                # Make sure we have the expected fields
                if "translation" in translation_data:
                    return {
                        "translation": translation_data.get("translation", ""),
                        "confidence": translation_data.get("confidence", 3)
                    }
            
            # If JSON parsing failed but we have a response, try to use it directly
            logging.warning("Failed to parse JSON response. Attempting to extract translation directly.")
            cleaned_text = extraction_text.strip().strip('`').strip()
            
            # If it looks like just a word, use it
            if len(cleaned_text.split()) <= 5 and len(cleaned_text) < 50:
                return {
                    "translation": cleaned_text,
                    "confidence": 2
                }
                
            # Otherwise fall back to direct translation
            return direct_translation_fallback(word, "", config)
            
        except json.JSONDecodeError:
            logging.warning("JSON decode error. Falling back to direct translation.")
            return direct_translation_fallback(word, "", config)
            
    except Exception as e:
        logging.error(f"Error in extraction step: {e}")
        return direct_translation_fallback(word, "", config)

def direct_translation_fallback(word: str, english_meaning: str, config: TranslationConfig) -> Dict[str, Union[str, int]]:
    """Fallback method with direct translation request."""
    system_prompt = """You are a translator from Chinese to Vietnamese.
    Your task is to provide ONLY the Vietnamese translation of the Chinese word.
    Just the translated word or phrase, no explanation, no formatting, no JSON."""
    
    user_prompt = f"Translate this Chinese word to Vietnamese: {word}"
    if english_meaning:
        user_prompt += f"\nMeaning in English: {english_meaning}"
        
    user_prompt += "\n\nJust respond with the Vietnamese translation, nothing else:"
    
    try:
        payload = {
            "model": config.model,
            "prompt": user_prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": 0.1,
                "num_predict": 20
            }
        }
        
        logging.info("Using direct translation fallback...")
        logging.debug(f"Fallback system prompt: {system_prompt}")
        logging.debug(f"Fallback user prompt: {user_prompt}")
        
        response = requests.post(config.api_url, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            translation = result.get("response", "").strip()
            
            # Log the full fallback response
            logging.info(f"Fallback response code: {response.status_code}")
            if config.show_full_response:
                logging.info("FULL FALLBACK RESPONSE:")
                logging.info("-" * 50)
                logging.info(translation)
                logging.info("-" * 50)
            else:
                logging.info(f"Fallback response: {translation}")
            
            # Clean up any extra text
            for prefix in ["Vietnamese:", "Translation:", "Vietnamese translation:"]:
                if translation.lower().startswith(prefix.lower()):
                    translation = translation[len(prefix):].strip()
            
            # Take just the first line
            translation = translation.split('\n')[0].strip()
            
            if translation:
                return {
                    "translation": translation,
                    "confidence": 2  # Medium-low confidence for fallback
                }
        
        logging.error(f"Fallback failed: {response.status_code}")
        logging.error(f"Response: {response.text}")
        return {"translation": "", "confidence": 0}
    except Exception as e:
        logging.error(f"Error in fallback translation: {e}")
        return {"translation": "", "confidence": 0}

def translate_meaning_two_step(word: str, english_meaning: str, pinyin: str, config: TranslationConfig) -> Dict[str, Union[str, int]]:
    """
    Perform two-step translation for a specific meaning of a Chinese word:
    1. First step: Let the model think about the translation
    2. Second step: Ask the model to extract the translation from the thinking
    
    Args:
        word: The Chinese word
        english_meaning: The specific English meaning to translate
        pinyin: Pinyin transcription for additional context
        config: Translation configuration
        
    Returns:
        Dictionary with translation and confidence
    """
    # Step 1: Thinking phase
    thinking_text = step1_thinking_phase(word, english_meaning, pinyin, config)
    
    # Step 2: Extraction phase (only if thinking succeeded)
    if thinking_text:
        return step2_extraction_phase(thinking_text, word, config)
    else:
        logging.warning("Thinking phase failed. Using direct translation fallback.")
        return direct_translation_fallback(word, english_meaning, config)

def process_meanings_csv(file_path: str, level: Optional[int], config: TranslationConfig) -> int:
    """
    Process a CSV file with multi-meaning support using the two-step approach.
    
    Args:
        file_path: Path to the CSV file
        level: Optional HSK level to filter by
        config: Translation configuration
        
    Returns:
        Number of newly translated meanings
    """
    logging.info(f"Processing file: {file_path}")
    
    # Check if file exists
    if not os.path.exists(file_path):
        logging.error(f"File not found: {file_path}")
        return 0
    
    # Create a backup of the original file first
    backup_path = f"{file_path}.backup"
    try:
        with open(file_path, 'r', encoding='utf-8', newline='') as src:
            content = src.read()
            
        with open(backup_path, 'w', encoding='utf-8', newline='') as dst:
            dst.write(content)
            
        logging.info(f"Created backup: {backup_path}")
    except Exception as e:
        logging.warning(f"Failed to create backup: {e}")
    
    # Read the CSV file
    rows = []
    try:
        with open(file_path, 'r', encoding='utf-8', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            fieldnames = reader.fieldnames
            rows = list(reader)
    except Exception as e:
        logging.error(f"Error reading CSV file: {e}")
        return 0
    
    # Track statistics
    total_meanings = len(rows)
    translated_meanings = 0
    already_translated = 0
    errors = 0
    
    # Process each row (meaning)
    for i, row in enumerate(rows):
        # Skip if not matching the requested level
        if level and int(row.get('hsk_level', '1')) != level:
            continue
            
        # Skip if already has a translation
        if row.get('vietnamese', '') and row.get('vietnamese', '').strip():
            already_translated += 1
            continue
        
        # Get the Chinese word and English meaning
        simplified = row.get('simplified', '')
        english = row.get('english', '')
        pinyin = row.get('pinyin', '')
        meaning_index = row.get('meaning_index', '0')
        
        logging.info(f"Translating [{i+1}/{total_meanings}]: {simplified} (meaning {meaning_index}: {english[:50]}{'...' if len(english) > 50 else ''})")
        
        # Translate the meaning using two-step approach
        try:
            result = translate_meaning_two_step(simplified, english, pinyin, config)
            translation = result.get("translation", "")
            confidence = result.get("confidence", 0)
            
            if translation:
                row['vietnamese'] = translation
                translated_meanings += 1
                logging.info(f"  → {translation} (confidence: {confidence}/5)")
            else:
                errors += 1
                logging.error(f"  → Translation failed")
        except Exception as e:
            errors += 1
            logging.error(f"  → Error: {e}")
        
        # Add a small delay to avoid overwhelming the local LLM server
        time.sleep(0.2)
        
        # Save periodically (every 5 words) to preserve progress in case of interruption
        if (i + 1) % 5 == 0:
            try:
                with open(file_path, 'w', encoding='utf-8', newline='') as csvfile:
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(rows)
                logging.info(f"  Progress saved ({i+1}/{total_meanings})")
            except Exception as e:
                logging.warning(f"  Couldn't save progress: {e}")
    
    # Save the final updated CSV
    try:
        with open(file_path, 'w', encoding='utf-8', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        logging.info(f"Updated CSV file saved: {file_path}")
    except Exception as e:
        logging.error(f"Error saving CSV file: {e}")
    
    # Print statistics
    logging.info(f"\nStatistics for {os.path.basename(file_path)}:")
    logging.info(f"  Total meanings: {total_meanings}")
    logging.info(f"  Already translated: {already_translated}")
    logging.info(f"  Newly translated: {translated_meanings}")
    logging.info(f"  Translation errors: {errors}")
    
    return translated_meanings

def check_ollama_server(config: TranslationConfig) -> bool:
    """Check if Ollama server is running and the model is available."""
    try:
        # Check if the server is running
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code != 200:
            logging.error("Ollama server is not running")
            return False
        
        # Check if the required model is available
        models = response.json().get("models", [])
        model_name = config.model.split(':')[0]  # Get base model name
        
        available_models = [model["name"] for model in models]
        logging.info(f"Available models: {', '.join(available_models)}")
        
        if not any(model["name"].startswith(model_name) for model in models):
            logging.warning(f"Model {model_name} not found. Please pull it with:")
            logging.warning(f"  ollama pull {model_name}")
            logging.warning("Continuing anyway, but translation may fail...")
        
        return True
    except requests.ConnectionError:
        logging.error("Could not connect to Ollama server at http://localhost:11434")
        logging.error("Please make sure Ollama is installed and running.")
        return False
    except Exception as e:
        logging.error(f"Error checking Ollama server: {e}")
        return False

def main():
    """Process translation files based on command-line arguments."""
    # Initialize config
    config = TranslationConfig()
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Enhanced multi-meaning translation for HSK vocabulary')
    parser.add_argument('level', type=int, nargs='?', help='HSK level to process (1-7)')
    parser.add_argument('--model', type=str, default=config.model, help=f'Ollama model to use (default: {config.model})')
    parser.add_argument('--url', type=str, default=config.api_url, help='Ollama API URL')
    parser.add_argument('--hide-responses', action='store_true', help='Hide full LLM responses in logs')
    args = parser.parse_args()
    
    # Update config based on arguments
    config.model = args.model
    config.api_url = args.url
    config.show_full_response = not args.hide_responses
    
    logging.info("=" * 60)
    logging.info("Enhanced Multi-Meaning HSK Vocabulary Translator (Two-Step Approach)")
    logging.info("=" * 60)
    logging.info(f"Using Ollama model: {config.model}")
    logging.info(f"API URL: {config.api_url}")
    logging.info(f"Debug log file: translation_debug.log")
    
    # Check if Ollama server is running
    if not check_ollama_server(config):
        logging.error("\nOllama server check failed. Please make sure:")
        logging.error("1. Ollama is installed from https://ollama.com/download")
        logging.error("2. Ollama service is running")
        logging.error("3. The required model is pulled: ollama pull", config.model)
        logging.error("\nServer setup must be completed before running this script again.")
        return
    
    start_time = time.time()
    
    # Check if translation files exist
    csv_files_exist = False
    for level in range(1, 8):
        csv_file = os.path.join(config.output_dir, f"hsk{level}_meanings.csv")
        if os.path.exists(csv_file):
            csv_files_exist = True
            break
    
    if not csv_files_exist:
        logging.error("\nError: No translation CSV files found in the output directory.")
        logging.error(f"Checked directory: {config.output_dir}")
        logging.error("Please run the extract_hsk_words_enhanced.py script first.")
        return
    
    total_translated = 0
    
    if args.level:
        # Process only the specified level
        csv_file = os.path.join(config.output_dir, f"hsk{args.level}_meanings.csv")
        if os.path.exists(csv_file):
            total_translated += process_meanings_csv(csv_file, args.level, config)
        else:
            logging.error(f"File not found: {csv_file}")
    else:
        # Process all HSK levels
        for level in range(1, 8):  # HSK levels 1-7
            csv_file = os.path.join(config.output_dir, f"hsk{level}_meanings.csv")
            if os.path.exists(csv_file):
                total_translated += process_meanings_csv(csv_file, level, config)
    
    # Print overall statistics
    logging.info(f"\nTranslation completed in {time.time() - start_time:.2f} seconds")
    logging.info(f"Total newly translated meanings: {total_translated}")
    logging.info("\nNext steps:")
    logging.info("1. Review the translations in the CSV files")
    logging.info("2. Use 'csv_to_json_converter.py' in the output directory to convert back to JSON")
    logging.info("\nCheck translation_debug.log for detailed logs.")

if __name__ == "__main__":
    main()
