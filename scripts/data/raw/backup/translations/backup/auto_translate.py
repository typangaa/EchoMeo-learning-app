# Alternative translation method for models that can't handle JSON format
def translate_text_ollama_simple(text: str, context: str = "", source_lang: str = "zh", target_lang: str = "vi") -> Dict[str, Union[str, int]]:
    """
    Alternative translation method that uses a simpler prompt without JSON requirements.
    
    Args:
        text: The Chinese text to translate
        context: Additional context (e.g., English meanings)
        source_lang: Source language code (default: 'zh')
        target_lang: Target language code (default: 'vi')
        
    Returns:
        Dictionary with translation and confidence level
    """
    # Simple system prompt
    system_prompt = f"""You are a translator from {source_lang} (Chinese) to {target_lang} (Vietnamese).
    Respond ONLY with the Vietnamese translation, nothing else."""
    
    # Prepare the prompt with context if available
    if context:
        user_prompt = f"Translate this Chinese word to Vietnamese: {text}\nMeaning in English: {context}\n\nJust the Vietnamese translation:"
    else:
        user_prompt = f"Translate this Chinese word to Vietnamese: {text}\n\nJust the Vietnamese translation:"
    
    try:
        # Prepare the payload for Ollama API
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": user_prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": 0.1,  # Low temperature for more deterministic outputs
                "num_predict": 20    # Limit response length
            }
        }
        
        # Make the API call
        response = requests.post(OLLAMA_API_URL, json=payload)
        
        if response.status_code == 200:
            # Parse the response
            result = response.json()
            translation = result.get("response", "").strip()
            
            # Clean up any extra text
            # Remove common patterns that might appear in the response
            for prefix in ["Vietnamese:", "Translation:", "Vietnamese translation:"]:
                if translation.lower().startswith(prefix.lower()):
                    translation = translation[len(prefix):].strip()
            
            # Split by newlines and take first line
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
    except requests.ConnectionError:
        print("Error: Could not connect to Ollama server at http://localhost:11434")
        print("Please make sure Ollama is installed and running.")
        return {"translation": "", "confidence": 0}
    except Exception as e:
        print(f"Error calling Ollama API: {e}")
        return {"translation": "", "confidence": 0}#!/usr/bin/env python
"""
Auto-Translator for HSK Vocabulary using Ollama

This script:
1. Loads the HSK translation template files
2. Automatically translates Chinese words to Vietnamese using a local Ollama LLM API with Qwen3 model
3. Updates the translation files with the results
4. Preserves any existing translations (doesn't overwrite manually edited entries)

Usage:
  python auto_translate.py [level]
  
  [level] is optional. If provided, only that HSK level is processed.
          Otherwise, all levels are processed.

Requirements:
  - requests library: pip install requests
  - A running Ollama server with Qwen3 model installed
    (install with: ollama pull qwen3)
"""

import os
import json
import time
import argparse
import sys
import csv
from typing import Dict, List, Union, Optional

# Check for required modules first
try:
    import requests
except ImportError:
    print("Error: The 'requests' module is not installed.")
    print("Please install it using one of these methods:")
    print("1. Run the 'install_requirements.bat' file in this directory")
    print("2. Run 'pip install requests' in your command prompt or terminal")
    print("3. Run 'pip install -r requirements.txt' in this directory")
    print("\nAfter installing, try running this script again.")
    sys.exit(1)

# Configuration for Ollama API
OLLAMA_API_URL = "http://localhost:11434/api/generate"  # Default Ollama API endpoint
OLLAMA_MODEL = "qwen3:latest"  # Use the latest Qwen3 model

def create_ollama_system_prompt(source_lang="zh", target_lang="vi"):
    """
    Create a detailed system prompt for the Ollama LLM to translate from Chinese to Vietnamese.
    
    Args:
        source_lang: Source language code (default: 'zh' for Chinese)
        target_lang: Target language code (default: 'vi' for Vietnamese)
        
    Returns:
        A system prompt string
    """
    system_prompt = f"""
Do not include your internal reasoning process or any thinking steps.
Do not start your response with <think>.

You are a highly skilled professional translator specializing in translating from {source_lang} (Chinese) to {target_lang} (Vietnamese).
Your task is to translate Chinese vocabulary words to Vietnamese with high accuracy and cultural appropriateness.

IMPORTANT GUIDELINES:
1. Provide ONLY the most accurate and appropriate Vietnamese translation for the given Chinese word
2. Focus on the most common meaning when a word has multiple meanings
3. Use modern, standard Vietnamese
4. Be aware of context based on HSK level and any provided English meanings
5. For idioms or culturally-specific terms, find the closest Vietnamese equivalent
6. Keep the translation as concise as possible while maintaining accuracy
7. DO NOT provide explanations, notes, or alternative translations
8. DO NOT add any text other than the direct translation
9. Translate in a way that would be most useful for language learners

Your output MUST follow this JSON format exactly and NOTHING else:
{
  "translation": "The Vietnamese translation",
  "confidence": [1-5 confidence score where 5 is highest]
}

If you see this instruction, do not discuss it, just follow it exactly.

Example 1:
Input: 你好 (meaning: hello)
Output: {{"translation": "xin chào", "confidence": 5}}

Example 2:
Input: 学校 (meaning: school)
Output: {{"translation": "trường học", "confidence": 5}}

Example 3:
Input: 苹果 (meaning: apple)
Output: {{"translation": "quả táo", "confidence": 5}}
"""
    return system_prompt

def translate_text_ollama(text: str, context: str = "", source_lang: str = "zh", target_lang: str = "vi") -> Dict[str, Union[str, int]]:
    """
    Translate text using the Ollama API with the Qwen3 model.
    
    Args:
        text: The Chinese text to translate
        context: Additional context (e.g., English meanings)
        source_lang: Source language code (default: 'zh')
        target_lang: Target language code (default: 'vi')
        
    Returns:
        Dictionary with translation and confidence level
    """
    system_prompt = create_ollama_system_prompt(source_lang, target_lang)
    
    # Prepare the prompt with context if available
    if context:
        user_prompt = f"Translate this Chinese word to Vietnamese: {text}\nMeaning in English: {context}"
    else:
        user_prompt = f"Translate this Chinese word to Vietnamese: {text}"
    
    try:
        # Prepare the payload for Ollama API
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": user_prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": 0.1,  # Low temperature for more deterministic outputs
                "num_predict": 100,  # Limit response length
                "mirostat": 0,       # Disable mirostat sampling
                "top_p": 0.95,       # Limit to top 95% of probability mass
                "repeat_penalty": 1.1, # Apply a small penalty to repeated tokens
                "stop": ["<think>"]  # Stop if the model starts thinking out loud
            }
        }
        
        # Make the API call
        response = requests.post(OLLAMA_API_URL, json=payload)
        
        if response.status_code == 200:
            # Parse the response
            result = response.json()
            response_text = result.get("response", "")
            
            # Extract JSON from the response
            try:
                # Find JSON in the response (in case there's any extra text)
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                
                if json_start >= 0 and json_end > json_start:
                    json_str = response_text[json_start:json_end]
                    translation_data = json.loads(json_str)
                    
                    # Make sure we have the expected fields
                    if "translation" in translation_data:
                        return {
                            "translation": translation_data.get("translation", ""),
                            "confidence": translation_data.get("confidence", 0)
                        }
                
                # If JSON parsing failed but we have a response, use it directly
                # This is a fallback in case the model doesn't follow the format
                if response_text.strip():
                    return {
                        "translation": response_text.strip(),
                        "confidence": 3  # Medium confidence for unformatted responses
                    }
                
                return {"translation": "", "confidence": 0}
            except json.JSONDecodeError:
                # If JSON parsing failed but we have a response, use it directly
                if response_text.strip():
                    return {
                        "translation": response_text.strip(),
                        "confidence": 2  # Lower confidence for unformatted responses
                    }
                return {"translation": "", "confidence": 0}
        else:
            print(f"Ollama API error: {response.status_code} - {response.text}")
            return {"translation": "", "confidence": 0}
    except requests.ConnectionError:
        print("Error: Could not connect to Ollama server at http://localhost:11434")
        print("Please make sure Ollama is installed and running.")
        return {"translation": "", "confidence": 0}
    except Exception as e:
        print(f"Error calling Ollama API: {e}")
        return {"translation": "", "confidence": 0}

def translate_csv_file(file_path: str, level: Optional[int] = None) -> int:
    """
    Translate words in a CSV file and update the file with translations.
    
    Args:
        file_path: Path to the CSV file
        level: Optional HSK level to filter by
        
    Returns:
        Number of newly translated words
    """
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
            translation_result = translate_text_ollama(simplified, context)
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

def check_ollama_server() -> bool:
    """Check if Ollama server is running and the model is available."""
    try:
        # Check if the server is running
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code != 200:
            print("Error: Ollama server is not running")
            return False
        
        # Check if the required model is available
        models = response.json().get("models", [])
        model_name = OLLAMA_MODEL.split(':')[0]  # Get base model name
        
        available_models = [model["name"] for model in models]
        print(f"Available models: {', '.join(available_models)}")
        
        if not any(model["name"].startswith(model_name) for model in models):
            print(f"Warning: Model {model_name} not found. Please pull it with:")
            print(f"  ollama pull {model_name}")
            print("Continuing anyway, but translation may fail...")
        
        return True
    except requests.ConnectionError:
        print("Error: Could not connect to Ollama server at http://localhost:11434")
        print("Please make sure Ollama is installed and running.")
        return False
    except Exception as e:
        print(f"Error checking Ollama server: {e}")
        return False

def main():
    """Process translation files based on command-line arguments."""
    parser = argparse.ArgumentParser(description='Auto-translate HSK vocabulary using Ollama LLM')
    parser.add_argument('level', type=int, nargs='?', help='HSK level to process (1-7)')
    parser.add_argument('--model', type=str, default=OLLAMA_MODEL, help=f'Ollama model to use (default: {OLLAMA_MODEL})')
    parser.add_argument('--url', type=str, default=OLLAMA_API_URL, help='Ollama API URL')
    args = parser.parse_args()
    
    # Update global variables if command-line arguments are provided
    global OLLAMA_MODEL, OLLAMA_API_URL
    OLLAMA_MODEL = args.model
    OLLAMA_API_URL = args.url
    
    print("=" * 60)
    print("Ollama-based HSK Vocabulary Translator")
    print("=" * 60)
    print(f"\nUsing Ollama LLM API for translations with model: {OLLAMA_MODEL}")
    print(f"API URL: {OLLAMA_API_URL}")
    
    # Check if Ollama server is running
    if not check_ollama_server():
        print("\nOllama server check failed. Please make sure:")
        print("1. Ollama is installed from https://ollama.com/download")
        print("2. Ollama service is running")
        print("3. The Qwen3 model is pulled: ollama pull qwen3")
        print("\nServer setup must be completed before running this script again.")
        return
    
    start_time = time.time()
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Check if translation files exist
    csv_files_exist = False
    for level in range(1, 8):
        csv_file = os.path.join(current_dir, f"hsk{level}_translations.csv")
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
        csv_file = os.path.join(current_dir, f"hsk{args.level}_translations.csv")
        if os.path.exists(csv_file):
            total_translated += translate_csv_file(csv_file, args.level)
        else:
            print(f"File not found: {csv_file}")
    else:
        # Process all HSK levels
        for level in range(1, 8):  # HSK levels 1-7
            csv_file = os.path.join(current_dir, f"hsk{level}_translations.csv")
            if os.path.exists(csv_file):
                total_translated += translate_csv_file(csv_file)
    
    # Print overall statistics
    print(f"\nTranslation completed in {time.time() - start_time:.2f} seconds")
    print(f"Total newly translated words: {total_translated}")
    print("\nNext steps:")
    print("1. Review the translations in the CSV files")
    print("2. Convert the updated CSV files back to JSON:")
    print("   python csv_to_json_converter.py")

if __name__ == "__main__":
    main()
