#!/usr/bin/env python
"""
Character and Word Meanings Enrichment Module using Qwen3

This module provides functions to:
1. Enrich Chinese characters with detailed meanings and translations
2. Generate example sentences for each meaning
3. Structure data for language learning applications
"""

import json
import time
import logging
import requests
from typing import Dict, List, Any, Optional, Tuple

class EnrichmentConfig:
    """Configuration for the enrichment process."""
    def __init__(self):
        self.api_url = "http://localhost:11434/api/generate"
        self.model = "qwen3:latest"
        self.max_retries = 3
        self.retry_delay = 5  # seconds
        self.temperature = 0.2
        self.single_char_prompting = True  # Whether to prompt for single characters or words
        self.standard_separator = " / "  # Standard separator for alternative meanings

def create_character_system_prompt():
    """Create a detailed system prompt for Qwen3 to generate structured character meanings."""
    return """You are a Chinese language expert with deep knowledge of Chinese characters, their meanings, 
and Vietnamese translations. Your task is to provide clear, accurate, and structured information about 
Chinese characters for language learners.

For each Chinese character provided, you will:
1. Identify the most common 2-4 meanings (in English)
2. Provide Vietnamese translations for each meaning
3. Create simple example sentences that show how the character is used
4. Rank the meanings by frequency of usage

FORMAT YOUR RESPONSE IN THIS EXACT JSON STRUCTURE:
{
  "character": "汉字",
  "pinyin": "hàn zì",
  "meanings": [
    {
      "english": "primary meaning in English",
      "vietnamese": "Vietnamese translation",
      "part_of_speech": "n/v/adj/etc",
      "usage_frequency": "very common/common/less common",
      "examples": [
        {
          "chinese": "Example sentence in Chinese",
          "pinyin": "Example sentence pinyin",
          "english": "English translation",
          "vietnamese": "Vietnamese translation"
        }
      ]
    },
    {
      "english": "secondary meaning in English",
      ...
    }
  ]
}

IMPORTANT GUIDELINES:
- Only include 2-4 most common meanings - focus on quality over quantity
- Keep examples simple, suitable for language learners (HSK1-3 level)
- For Vietnamese translations, use modern, standard Vietnamese
- Do not include rare or archaic meanings
- Provide the correct pinyin with tones
- Focus only on the given character, not compounds
- ALWAYS use forward slashes with spaces " / " to separate alternative meanings (e.g., "good / nice / fine")
- DO NOT use semicolons to separate meanings
"""

def create_word_system_prompt():
    """Create a detailed system prompt for Qwen3 to generate structured word meanings."""
    return """You are a Chinese language expert with deep knowledge of Chinese words, their meanings, 
and Vietnamese translations. Your task is to provide clear, accurate, and structured information about 
Chinese words for language learners.

For each Chinese word provided, you will:
1. Identify the most common 2-4 meanings (in English)
2. Provide Vietnamese translations for each meaning
3. Create simple example sentences that show how the word is used
4. Rank the meanings by frequency of usage

FORMAT YOUR RESPONSE IN THIS EXACT JSON STRUCTURE:
{
  "word": "汉字",
  "pinyin": "hàn zì",
  "meanings": [
    {
      "english": "primary meaning in English",
      "vietnamese": "Vietnamese translation",
      "part_of_speech": "n/v/adj/etc",
      "usage_frequency": "very common/common/less common",
      "examples": [
        {
          "chinese": "Example sentence in Chinese",
          "pinyin": "Example sentence pinyin",
          "english": "English translation",
          "vietnamese": "Vietnamese translation"
        }
      ]
    },
    {
      "english": "secondary meaning in English",
      ...
    }
  ]
}

IMPORTANT GUIDELINES:
- Only include 2-4 most common meanings - focus on quality over quantity
- Keep examples simple, suitable for language learners (HSK1-3 level)
- For Vietnamese translations, use modern, standard Vietnamese
- Do not include rare or archaic meanings
- Provide the correct pinyin with tones
- ALWAYS use forward slashes with spaces " / " to separate alternative meanings (e.g., "good / nice / fine")
- DO NOT use semicolons to separate meanings
"""

def standardize_english_format(english_text: str, config: EnrichmentConfig) -> str:
    """
    Standardize the format of English meanings to use a consistent separator.
    
    Args:
        english_text: The English meaning text
        config: Configuration with standard separator
        
    Returns:
        Standardized English text
    """
    # Replace semicolons with the standard separator
    standardized = english_text.replace(';', config.standard_separator)
    
    # Replace slashes without spaces with the standard separator
    standardized = standardized.replace('/', config.standard_separator)
    
    # Clean up any double spaces
    while '  ' in standardized:
        standardized = standardized.replace('  ', ' ')
    
    # Clean up any doubled separators
    while config.standard_separator + config.standard_separator in standardized:
        standardized = standardized.replace(config.standard_separator + config.standard_separator, config.standard_separator)
    
    return standardized.strip()

def enrich_chinese_item(chinese_item: str, config: EnrichmentConfig, 
                        provided_pinyin: str = "", hsk_level: int = None) -> Dict[str, Any]:
    """
    Call Qwen3 via Ollama to get enriched meanings for a Chinese character or word.
    
    Args:
        chinese_item: The Chinese character or word to enrich
        config: Configuration settings
        provided_pinyin: Optional pinyin if already known
        hsk_level: Optional HSK level for context
        
    Returns:
        Dictionary with enriched data
    """
    # Choose appropriate system prompt based on item length and config
    if len(chinese_item) == 1 and config.single_char_prompting:
        system_prompt = create_character_system_prompt()
        item_type = "character"
    else:
        system_prompt = create_word_system_prompt()
        item_type = "word"
    
    # Create context-rich prompt
    context = f"Provide detailed meanings, Vietnamese translations, and examples for this Chinese {item_type}:\n\n{item_type.capitalize()}: {chinese_item}"
    
    if provided_pinyin:
        context += f"\nPinyin: {provided_pinyin}"
    
    if hsk_level:
        context += f"\nHSK Level: {hsk_level}"
    
    user_prompt = f"{context}\n\nRespond only with the requested JSON structure. Remember to use forward slashes with spaces \" / \" to separate alternative meanings."
    
    # Prepare payload for Ollama API
    payload = {
        "model": config.model,
        "prompt": user_prompt,
        "system": system_prompt,
        "stream": False,
        "options": {
            "temperature": config.temperature,
            "num_predict": 1000  # Reasonable token length for detailed response
        }
    }
    
    for attempt in range(config.max_retries):
        try:
            logging.info(f"Requesting data for {item_type}: {chinese_item} (attempt {attempt+1})")
            response = requests.post(config.api_url, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get("response", "")
                
                # Extract JSON from response
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                
                if json_start >= 0 and json_end > json_start:
                    json_str = response_text[json_start:json_end]
                    try:
                        enriched_data = json.loads(json_str)
                        
                        # Standardize English meanings format
                        if "meanings" in enriched_data:
                            for meaning in enriched_data["meanings"]:
                                if "english" in meaning:
                                    meaning["english"] = standardize_english_format(meaning["english"], config)
                        
                        return enriched_data
                    except json.JSONDecodeError as e:
                        logging.error(f"JSON parse error for {chinese_item}: {e}")
                        logging.debug(f"Response text: {response_text}")
                
                logging.error(f"Failed to extract valid JSON for {chinese_item}")
                
            else:
                logging.error(f"API error for {chinese_item}: {response.status_code}")
            
            # Wait before retrying
            if attempt < config.max_retries - 1:
                time.sleep(config.retry_delay)
                
        except Exception as e:
            logging.error(f"Error processing {chinese_item}: {e}")
            if attempt < config.max_retries - 1:
                time.sleep(config.retry_delay)
    
    # Return empty data if all attempts failed
    return {
        "character" if len(chinese_item) == 1 else "word": chinese_item,
        "pinyin": provided_pinyin,
        "error": "Failed to get enriched data",
        "meanings": []
    }

def batch_process_items(items: List[str], config: EnrichmentConfig, 
                        pinyin_map: Dict[str, str] = None, 
                        hsk_levels: Dict[str, int] = None) -> List[Dict[str, Any]]:
    """
    Process a batch of Chinese items and enrich their meanings.
    
    Args:
        items: List of Chinese characters or words
        config: Configuration settings
        pinyin_map: Optional dictionary mapping items to pinyin
        hsk_levels: Optional dictionary mapping items to HSK levels
        
    Returns:
        List of enriched data
    """
    enriched_items = []
    
    for item in items:
        # Get pinyin and HSK level if provided
        pinyin = pinyin_map.get(item, "") if pinyin_map else ""
        hsk_level = hsk_levels.get(item) if hsk_levels else None
        
        # Enrich the item
        enriched_data = enrich_chinese_item(item, config, pinyin, hsk_level)
        
        if enriched_data and "error" not in enriched_data:
            enriched_items.append(enriched_data)
            logging.info(f"Successfully enriched: {item}")
        else:
            logging.warning(f"Failed to enrich: {item}")
        
        # Small delay to avoid overwhelming the API
        time.sleep(1)
    
    return enriched_items

def check_ollama_connection(config: EnrichmentConfig) -> bool:
    """
    Check if Ollama server is running and the model is available.
    
    Args:
        config: Configuration settings
        
    Returns:
        Boolean indicating if connection is successful
    """
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code != 200:
            logging.error("Ollama server is not running")
            return False
        
        models = response.json().get("models", [])
        model_name = config.model.split(':')[0]
        
        if not any(model["name"].startswith(model_name) for model in models):
            logging.warning(f"Model {model_name} may not be available. Please run: ollama pull {model_name}")
            return False
        
        logging.info(f"Successfully connected to Ollama with model: {config.model}")
        return True
    except requests.ConnectionError:
        logging.error("Could not connect to Ollama. Please ensure it's running.")
        return False
    except Exception as e:
        logging.error(f"Error checking Ollama connection: {e}")
        return False