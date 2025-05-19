#!/usr/bin/env python
"""
Test Script for JSON Extraction and Repair

This script tests the JSON extraction and repair functionality for handling Ollama API responses.
It can be used to debug issues with malformed JSON responses.

Usage:
  python test_json_extraction.py
"""

import json
import logging
import argparse
import requests
from character_enrichment import extract_json_from_text, repair_json, EnrichmentConfig

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("json_extraction_debug.log", encoding='utf-8'),
        logging.StreamHandler()
    ]
)

def test_extraction_with_example(example_text, description):
    """Test JSON extraction with a given example text."""
    logging.info(f"Testing JSON extraction: {description}")
    logging.debug(f"Example text:\n{example_text}")
    
    # Extract JSON
    json_str = extract_json_from_text(example_text)
    logging.debug(f"Extracted JSON:\n{json_str}")
    
    # Repair JSON
    repaired_json = repair_json(json_str)
    logging.debug(f"Repaired JSON:\n{repaired_json}")
    
    # Try to parse
    try:
        json_obj = json.loads(repaired_json)
        logging.info("✓ JSON successfully parsed!")
        return True
    except json.JSONDecodeError as e:
        logging.error(f"✗ JSON parsing failed: {e}")
        return False

def test_with_ollama(word, model="qwen3:latest"):
    """Test JSON extraction with a real Ollama API call."""
    logging.info(f"Testing with Ollama API for word: {word}")
    
    config = EnrichmentConfig()
    config.model = model
    
    # Create prompts
    system_prompt = """You are a Chinese language expert. Provide detailed meanings for Chinese words in JSON format:
{
  "word": "汉字",
  "pinyin": "hàn zì",
  "meanings": [
    {
      "english": "meaning in English",
      "vietnamese": "Vietnamese translation",
      "part_of_speech": "n/v/adj/etc",
      "examples": [
        {
          "chinese": "Example sentence",
          "pinyin": "Example pinyin",
          "english": "English translation",
          "vietnamese": "Vietnamese translation"
        }
      ]
    }
  ]
}"""

    user_prompt = f"Provide meanings for this Chinese word: {word}\n\nRespond only with JSON."
    
    # Prepare payload for Ollama API
    payload = {
        "model": config.model,
        "prompt": user_prompt,
        "system": system_prompt,
        "stream": False,
        "options": {
            "temperature": 0.2,
            "num_predict": 1000
        }
    }
    
    try:
        # Make API call
        response = requests.post("http://localhost:11434/api/generate", json=payload)
        
        if response.status_code == 200:
            result = response.json()
            response_text = result.get("response", "")
            
            logging.info("Response received from Ollama")
            logging.debug(f"Raw response:\n{response_text}")
            
            # Test extraction
            return test_extraction_with_example(response_text, f"Real API response for {word}")
        else:
            logging.error(f"API error: {response.status_code}")
            return False
            
    except Exception as e:
        logging.error(f"Error calling Ollama API: {e}")
        return False

def run_predefined_tests():
    """Run tests with predefined examples of problematic JSON."""
    examples = [
        # Example 1: Missing comma
        ("""
        {
          "word": "爱好",
          "pinyin": "ài hào",
          "meanings": [
            {
              "english": "hobby / interest",
              "vietnamese": "sở thích",
              "part_of_speech": "n"
              "usage_frequency": "very common"
            }
          ]
        }
        """, "Missing comma after part_of_speech"),
        
        # Example 2: Extra comma
        ("""
        {
          "word": "爱好",
          "pinyin": "ài hào",
          "meanings": [
            {
              "english": "hobby / interest",
              "vietnamese": "sở thích",
              "part_of_speech": "n",
              "usage_frequency": "very common",
            }
          ]
        }
        """, "Extra comma after last property"),
        
        # Example 3: Unquoted property names
        ("""
        {
          word: "爱好",
          pinyin: "ài hào",
          meanings: [
            {
              english: "hobby / interest",
              vietnamese: "sở thích",
              part_of_speech: "n",
              usage_frequency: "very common"
            }
          ]
        }
        """, "Unquoted property names"),
        
        # Example 4: Mixed single and double quotes
        ("""
        {
          "word": "爱好",
          "pinyin": "ài hào",
          "meanings": [
            {
              "english": 'hobby / interest',
              "vietnamese": 'sở thích',
              "part_of_speech": "n",
              "usage_frequency": "very common"
            }
          ]
        }
        """, "Mixed single and double quotes"),
        
        # Example 5: JSON embedded in text
        ("""
        Here's the information about 爱好:
        
        {
          "word": "爱好",
          "pinyin": "ài hào",
          "meanings": [
            {
              "english": "hobby / interest",
              "vietnamese": "sở thích",
              "part_of_speech": "n",
              "usage_frequency": "very common"
            }
          ]
        }
        
        I hope this helps!
        """, "JSON embedded in text"),
    ]
    
    success_count = 0
    for example_text, description in examples:
        if test_extraction_with_example(example_text, description):
            success_count += 1
    
    logging.info(f"Passed {success_count} out of {len(examples)} predefined tests")

def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(description='Test JSON extraction and repair')
    parser.add_argument('--word', type=str, help='Test with a specific Chinese word')
    parser.add_argument('--model', type=str, default='qwen3:latest', help='Ollama model to use')
    args = parser.parse_args()
    
    logging.info("Starting JSON extraction and repair tests")
    
    # Run predefined tests
    run_predefined_tests()
    
    # Test with Ollama if a word is provided
    if args.word:
        test_with_ollama(args.word, args.model)
    
    logging.info("Tests completed")

if __name__ == "__main__":
    main()