#!/usr/bin/env python
"""
Simplified Auto-Translator for HSK Vocabulary using Ollama

This script:
1. Loads the HSK translation template files
2. Automatically translates Chinese words to Vietnamese using Ollama
3. Updates the translation files with the results
4. Preserves any existing translations

Usage:
  python improved_auto_translate.py [level] [--model MODEL] [--chat] [--two-step]
"""

import os
import json
import time
import argparse
import sys
import csv
import re
from typing import Dict, List, Union, Optional

# Check for required modules first
try:
    import requests
except ImportError:
    print("Error: The 'requests' module is not installed.")
    print("Please install it using: pip install requests")
    sys.exit(1)

# Configuration class to avoid global variables
class Config:
    def __init__(self):
        self.api_url = "http://localhost:11434/api/generate"
        self.chat_api_url = "http://localhost:11434/api/chat"
        self.model = "qwen3:latest"
        self.use_chat_api = False
        self.use_two_step = False
        self.current_dir = os.path.dirname(os.path.abspath(__file__))

def translate_text_two_step(text: str, context: str, config: Config) -> Dict[str, Union[str, int]]:
    """Two-step translation method that separates thinking and output generation."""
    # Step 1: Let the model think about the translation
    system_prompt_thinking = """You are a highly skilled translator from Chinese to Vietnamese.
    Think carefully about the best translation for the given Chinese word.
    Consider all possible meanings and cultural nuances.
    You can think out loud about different possible translations."""
    
    # Create user prompt with context if available
    if context:
        user_prompt_thinking = f"Think about how to translate this Chinese word to Vietnamese: {text}\nMeaning in English: {context}\n\nThink step by step about the best translation:"
    else:
        user_prompt_thinking = f"Think about how to translate this Chinese word to Vietnamese: {text}\n\nThink step by step about the best translation:"
    
    # First API call to let the model think
    try:
        thinking_payload = {
            "model": config.model,
            "prompt": user_prompt_thinking,
            "system": system_prompt_thinking,
            "stream": False,
            "options": {
                "temperature": 0.7,  # Higher temperature to encourage exploration
                "num_predict": 200  # Allow more tokens for thinking
            }
        }
        
        print("Step 1: Asking model to think about translation...")
        thinking_response = requests.post(config.api_url, json=thinking_payload)
        
        if thinking_response.status_code != 200:
            print(f"Error in thinking step: {thinking_response.status_code}")
            return {"translation": "", "confidence": 0}
            
        thinking_result = thinking_response.json()
        thinking_text = thinking_result.get("response", "")
        
        print(f"Model thinking (abbreviated): {thinking_text[:100]}...")
        
        # Step 2: Ask for just the final translation in JSON format
        system_prompt_output = """You are a translator API that outputs results in JSON format.
        Based on your previous thinking about translating a Chinese word to Vietnamese,
        respond ONLY with a JSON object containing the final translation and confidence level.
        ONLY output valid JSON in this exact format:
        {"translation": "Vietnamese translation", "confidence": 5}
        
        The confidence should be a number from 1-5 where 5 is most confident.
        Do not include any text outside the JSON object."""
        
        user_prompt_output = "Based on your thinking, what is the final Vietnamese translation for the Chinese word in JSON format?"
        
        output_payload = {
            "model": config.model,
            "prompt": user_prompt_output,
            "system": system_prompt_output,
            "stream": False,
            "options": {
                "temperature": 0.1,  # Low temperature for consistent output
                "num_predict": 100  # Enough tokens for JSON response
            }
        }
        
        print("Step 2: Requesting final translation in JSON format...")
        output_response = requests.post(config.api_url, json=output_payload)
        
        if output_response.status_code != 200:
            print(f"Error in output step: {output_response.status_code}")
            # Fall back to extracting translation from thinking step
            return extract_translation_from_thinking(thinking_text)
            
        output_result = output_response.json()
        output_text = output_result.get("response", "")
        
        # Try to parse JSON output
        try:
            # Find JSON in the response (in case there's any extra text)
            json_start = output_text.find('{')
            json_end = output_text.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = output_text[json_start:json_end]
                translation_data = json.loads(json_str)
                
                # Make sure we have the expected fields
                if "translation" in translation_data:
                    return {
                        "translation": translation_data.get("translation", ""),
                        "confidence": translation_data.get("confidence", 3)
                    }
            
            # If JSON parsing failed but we have a response, fall back to thinking step
            return extract_translation_from_thinking(thinking_text)
            
        except json.JSONDecodeError:
            # Fall back to extracting translation from thinking step
            return extract_translation_from_thinking(thinking_text)
            
    except Exception as e:
        print(f"Error in two-step translation: {e}")
        return {"translation": "", "confidence": 0}

def extract_translation_from_thinking(thinking_text: str) -> Dict[str, Union[str, int]]:
    """Extract the final translation from the model's thinking text."""
    print("Falling back to extracting translation from thinking step...")
    
    # Look for common patterns that might indicate the final translation
    patterns = [
        r"final translation[:\s]+([^\n\.]+)",
        r"best translation[:\s]+([^\n\.]+)",
        r"vietnamese translation[:\s]+([^\n\.]+)",
        r"vietnamese:?\s+([^\n\.]+)",
        r"translation:?\s+([^\n\.]+)"
    ]
    
    for pattern in patterns:
        matches = re.search(pattern, thinking_text.lower())
        if matches:
            translation = matches.group(1).strip()
            return {"translation": translation, "confidence": 2}
    
    # If no patterns match, use the last line that isn't empty
    lines = [line.strip() for line in thinking_text.split('\n') if line.strip()]
    if lines:
        # Take the last non-empty line as it's likely to be the conclusion
        translation = lines[-1]
        
        # If the line is too long, it's probably not just the translation
        if len(translation) > 50:
            # Try to find a short sequence of words that might be the translation
            words = re.findall(r'\b\w+\b', translation)
            if words and len(words) <= 5:
                translation = ' '.join(words[:3])
            else:
                # Just take the first 30 characters as a fallback
                translation = translation[:30]
        
        return {"translation": translation, "confidence": 1}
    
    return {"translation": "", "confidence": 0}

def translate_text_simple(text: str, context: str, config: Config) -> Dict[str, Union[str, int]]:
    """Simple translation method that uses a clear prompt without JSON requirements."""
    # Simple system prompt
    system_prompt = """You are a translator from Chinese to Vietnamese.
Respond ONLY with the Vietnamese translation, nothing else.
Do not explain your translation or add notes.
Just provide the translated Vietnamese word or phrase."""
    
    # Simple user prompt
    if context:
        user_prompt = f"Translate this Chinese word to Vietnamese: {text}\nMeaning in English: {context}\n\nVietnamese translation:"
    else:
        user_prompt = f"Translate this Chinese word to Vietnamese: {text}\n\nVietnamese translation:"
    
    try:
        # Payload for generate API
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
        
        # Make the API call
        response = requests.post(config.api_url, json=payload)
        
        if response.status_code == 200:
            # Parse the response
            result = response.json()
            translation = result.get("response", "").strip()
            
            # Clean up any extra text
            for prefix in ["Vietnamese:", "Translation:", "Vietnamese translation:"]:
                if translation.lower().startswith(prefix.lower()):
                    translation = translation[len(prefix):].strip()
            
            # Just take the first line in case there's explanation text
            translation = translation.split('\n')[0].strip()
            
            if translation:
                return {
                    "translation": translation,
                    "confidence": 3  # Medium confidence for simple responses
                }
            
            return {"translation": "", "confidence": 0}
        else:
            print(f"Ollama API error: {response.status_code} - {response.text}")
            return {"translation": "", "confidence": 0}
    except Exception as e:
        print(f"Error calling Ollama API: {e}")
        return {"translation": "", "confidence": 0}

def translate_with_chat_api(text: str, context: str, config: Config) -> Dict[str, Union[str, int]]:
    """Use Ollama's chat API for translation."""
    # Prepare chat messages
    messages = [
        {
            "role": "system",
            "content": "You are a Chinese to Vietnamese translator. Respond with only the Vietnamese translation, nothing else."
        }
    ]
    
    if context:
        messages.append({
            "role": "user",
            "content": f"Translate this Chinese word to Vietnamese: {text} (meaning: {context})"
        })
    else:
        messages.append({
            "role": "user", 
            "content": f"Translate this Chinese word to Vietnamese: {text}"
        })
    
    try:
        # Create payload
        payload = {
            "model": config.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": 0.1
            }
        }
        
        # Make API call
        response = requests.post(config.chat_api_url, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            
            message = result.get("message", {})
            translation = message.get("content", "").strip()
            
            if translation:
                # Clean up the response
                lines = translation.split('\n')
                cleaned = lines[0].strip()
                
                for prefix in ["Vietnamese:", "Translation:", "Vietnamese translation:"]:
                    if cleaned.lower().startswith(prefix.lower()):
                        cleaned = cleaned[len(prefix):].strip()
                
                return {
                    "translation": cleaned,
                    "confidence": 3  # Medium confidence for chat API responses
                }
            else:
                return {"translation": "", "confidence": 0}
        else:
            print(f"Ollama Chat API error: {response.status_code} - {response.text}")
            return {"translation": "", "confidence": 0}
    except Exception as e:
        print(f"Error calling Ollama Chat API: {e}")
        return {"translation": "", "confidence": 0}

def translate_csv_file(file_path: str, level: Optional[int], config: Config) -> int:
    """Translate words in a CSV file and update the file with translations."""
    print(f"Processing file: {file_path}")
    
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return 0
    
    # Read the CSV file
    rows = []
    try:
        with open(file_path, 'r', encoding='utf-8', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            rows = list(reader)
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return 0
    
    # Track statistics
    total_words = len(rows)
    translated_words = 0
    already_translated = 0
    errors = 0
    
    # Process each word
    for i, row in enumerate(rows):
        # Skip if not matching the requested level
        if level and int(row['hsk_level']) != level:
            continue
            
        # Skip if already has a translation
        if row['vietnamese'] and row['vietnamese'].strip():
            already_translated += 1
            continue
        
        # Get the Chinese word and English meaning for context
        simplified = row['simplified']
        context = row['english']
        pinyin = row.get('pinyin', '')  # Get pinyin if available
        
        # Combine context information
        full_context = context
        if pinyin:
            full_context = f"{pinyin} - {context}"
        
        print(f"Translating [{i+1}/{total_words}]: {simplified} ({full_context[:40]}{'...' if len(full_context) > 40 else ''})")
        
        # Translate the word
        try:
            # Choose translation method based on configuration
            if config.use_two_step:
                translation_result = translate_text_two_step(simplified, context, config)
            elif config.use_chat_api:
                translation_result = translate_with_chat_api(simplified, context, config)
            else:
                translation_result = translate_text_simple(simplified, context, config)
                
            translation = translation_result.get("translation", "")
            confidence = translation_result.get("confidence", 0)
            
            if translation:
                row['vietnamese'] = translation
                translated_words += 1
                print(f"  → {translation} (confidence: {confidence}/5)")
            else:
                errors += 1
                print(f"  → Translation failed")
        except Exception as e:
            errors += 1
            print(f"  → Error: {e}")
        
        # Add a small delay to avoid overwhelming the local LLM server
        time.sleep(0.2)
        
        # Save periodically (every 10 words) to preserve progress in case of interruption
        if (i + 1) % 10 == 0:
            try:
                with open(file_path, 'w', encoding='utf-8', newline='') as csvfile:
                    fieldnames = rows[0].keys()
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(rows)
                print(f"  Progress saved ({i+1}/{total_words})")
            except Exception as e:
                print(f"  Warning: Couldn't save progress: {e}")
    
    # Save the final updated CSV
    try:
        with open(file_path, 'w', encoding='utf-8', newline='') as csvfile:
            fieldnames = rows[0].keys()
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        print(f"Updated CSV file saved: {file_path}")
    except Exception as e:
        print(f"Error saving CSV file: {e}")
    
    # Print statistics
    print(f"\nStatistics for {os.path.basename(file_path)}:")
    print(f"  Total words: {total_words}")
    print(f"  Already translated: {already_translated}")
    print(f"  Newly translated: {translated_words}")
    print(f"  Translation errors: {errors}")
    
    return translated_words

def check_ollama_server(config: Config) -> bool:
    """Check if Ollama server is running and the model is available."""
    try:
        # Check if the server is running
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code != 200:
            print("Error: Ollama server is not running")
            return False
        
        # Check if the required model is available
        models = response.json().get("models", [])
        model_name = config.model.split(':')[0]  # Get base model name
        
        available_models = [model["name"] for model in models]
        print(f"Available models: {', '.join(available_models)}")
        
        # Check if the exact model exists
        if config.model not in available_models:
            # If exact model doesn't exist, try to suggest a similar one
            similar_models = [m for m in available_models if model_name in m]
            
            if similar_models:
                print(f"Warning: Model '{config.model}' not found. Similar available models:")
                for m in similar_models:
                    print(f"  - {m}")
                
                # Ask user if they want to use a similar model instead
                print(f"\nThe exact model '{config.model}' was not found.")
                if len(similar_models) == 1:
                    # If only one similar model, suggest it automatically
                    replace = input(f"Do you want to use '{similar_models[0]}' instead? (y/n): ")
                    if replace.lower() == 'y':
                        config.model = similar_models[0]
                        print(f"Using model: {config.model}")
                        return True
                else:
                    # If multiple similar models, let user choose
                    print("Choose one of the available models:")
                    for i, m in enumerate(similar_models, 1):
                        print(f"{i}. {m}")
                    
                    choice = input("Enter number (or press Enter to cancel): ")
                    if choice.isdigit() and 1 <= int(choice) <= len(similar_models):
                        config.model = similar_models[int(choice) - 1]
                        print(f"Using model: {config.model}")
                        return True
            
            print(f"\nError: Model '{config.model}' not found and no similar models available.")
            print(f"Please choose from available models listed above or pull the model first.")
            print(f"  ollama pull {model_name}")
            return False
        
        return True
    except requests.ConnectionError:
        print("Error: Could not connect to Ollama server at http://localhost:11434")
        print("Please make sure Ollama is installed and running.")
        return False
    except Exception as e:
        print(f"Error checking Ollama server: {e}")
        return False

def main():
    # Initialize config
    config = Config()
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Auto-translate HSK vocabulary using Ollama LLM')
    parser.add_argument('level', type=int, nargs='?', help='HSK level to process (1-7)')
    parser.add_argument('--model', type=str, default=config.model, help=f'Ollama model to use (default: {config.model})')
    parser.add_argument('--url', type=str, default=config.api_url, help='Ollama API URL')
    parser.add_argument('--chat', action='store_true', help='Use chat API instead of generate API')
    parser.add_argument('--two-step', action='store_true', help='Use two-step translation process')
    args = parser.parse_args()
    
    # Update config based on arguments
    config.model = args.model
    config.api_url = args.url
    config.use_chat_api = args.chat
    config.use_two_step = args.two_step
    
    print("=" * 60)
    print("Improved Ollama-based HSK Vocabulary Translator")
    print("=" * 60)
    print(f"\nUsing Ollama LLM API for translations with model: {config.model}")
    print(f"API URL: {config.api_url}")
    
    if config.use_two_step:
        print("Using two-step translation process (think then format)")
    elif config.use_chat_api:
        print("Using Chat API instead of Generate API")
    else:
        print("Using simple direct translation")
    
    # Check if Ollama server is running
    if not check_ollama_server(config):
        print("\nOllama server check failed. Please make sure:")
        print("1. Ollama is installed from https://ollama.com/download")
        print("2. Ollama service is running")
        print("3. The model is pulled: ollama pull", config.model)
        print("\nServer setup must be completed before running this script again.")
        return
    
    start_time = time.time()
    
    # Check if translation files exist
    csv_files_exist = False
    for level in range(1, 8):
        csv_file = os.path.join(config.current_dir, f"hsk{level}_translations.csv")
        if os.path.exists(csv_file):
            csv_files_exist = True
            break
    
    if not csv_files_exist:
        print("\nError: No translation CSV files found in this directory.")
        print("Please run the extract_hsk_words.py script first to create the template files.")
        print("Run: python extract_hsk_words.py")
        return
    
    total_translated = 0
    
    if args.level:
        # Process only the specified level
        csv_file = os.path.join(config.current_dir, f"hsk{args.level}_translations.csv")
        if os.path.exists(csv_file):
            total_translated += translate_csv_file(csv_file, args.level, config)
        else:
            print(f"File not found: {csv_file}")
    else:
        # Process all HSK levels
        for level in range(1, 8):  # HSK levels 1-7
            csv_file = os.path.join(config.current_dir, f"hsk{level}_translations.csv")
            if os.path.exists(csv_file):
                total_translated += translate_csv_file(csv_file, None, config)
    
    # Print overall statistics
    print(f"\nTranslation completed in {time.time() - start_time:.2f} seconds")
    print(f"Total newly translated words: {total_translated}")
    print("\nNext steps:")
    print("1. Review the translations in the CSV files")
    print("2. Convert the updated CSV files back to JSON:")
    print("   python csv_to_json_converter.py")

if __name__ == "__main__":
    main()
