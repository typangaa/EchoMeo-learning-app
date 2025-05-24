#!/usr/bin/env python
"""
Vocabulary Enrichment Module using Qwen3

This module provides functions to:
1. Enrich Chinese vocabulary items (characters or words) with detailed meanings and translations
2. Generate example sentences for each meaning
3. Structure data for language learning applications
"""

import json
import time
import logging
import requests
import re
from typing import Dict, List, Any, Optional

class EnrichmentConfig:
    """Configuration for the enrichment process."""
    def __init__(self):
        self.api_url = "http://localhost:11434/api/generate"
        self.model = "qwen3:latest"
        self.max_retries = 3
        self.retry_delay = 5  # seconds
        self.temperature = 0.2
        self.standard_separator = " ; "  # Standard separator for alternative meanings

def create_system_prompt():
    """Create a detailed system prompt for Qwen3 to generate structured vocabulary meanings."""
    return """You are a Chinese language expert (中文语言专家) with deep knowledge of Chinese vocabulary, their meanings, and Vietnamese translations. Your task is to provide clear, accurate, and structured information about Chinese vocabulary items for language learners.

请首先用中文思考词汇的含义和用法，因为从中文思考可以更准确地把握词义。Think in Chinese first to better grasp the meaning before translating.

For each Chinese vocabulary item provided, you will:
1. Identify the most common 2-4 meanings (in Chinese, English, and Vietnamese)
2. Provide Chinese definitions for each meaning
3. Provide English translations for each meaning
4. Provide Vietnamese translations for each meaning
5. Create simple example sentences that show how the vocabulary item is used
6. Rank the meanings by frequency of usage

FOLLOW THIS EXACT JSON STRUCTURE:
{
  "item": "汉字",
  "pinyin": "hàn zì",
  "meanings": [
    {
      "chinese": "中文含义；另一个中文含义；第三个含义",
      "english": "primary meaning in English; alternative meaning; another alternative",
      "vietnamese": "Vietnamese translation; alternative translation; another alternative",
      "part_of_speech": "n/v/adj/etc",
      "usage_frequency": "very common/common/less common",
      "examples": [
        {
          "chinese": "Example sentence in Chinese",
          "pinyin": "Example sentence pinyin with tones",
          "english": "English translation of the example",
          "vietnamese": "Vietnamese translation of the example"
        },
        {
          "chinese": "Second example sentence",
          "pinyin": "Second example with pinyin",
          "english": "English translation",
          "vietnamese": "Vietnamese translation"
        }
      ]
    },
    {
      "chinese": "第二个中文含义；替代含义",
      "english": "secondary meaning; alternative meaning",
      "vietnamese": "Vietnamese translation; alternative translation",
      "part_of_speech": "n/v/adj/etc",
      "usage_frequency": "common/less common",
      "examples": [...]
    }
  ]
}

CRITICAL GUIDELINES:
* Begin by thinking in Chinese (中文) about the vocabulary item's meanings and usage
* MUST include 2-4 most common meanings - quality over quantity
* MUST separate alternative meanings with semicolons and spaces " ; " (e.g., "好的；不错的；很棒的")
* NEVER use forward slashes (/) to separate meanings
* ALL "chinese", "english" and "vietnamese" fields MUST follow the semicolon format for alternatives
* Chinese definitions should be natural and clear, as if explaining to a Chinese learner
* Examples MUST be simple and suitable for beginners (HSK1-3 level)
* MUST provide full Vietnamese translations for ALL examples
* MUST use the correct pinyin with tones for ALL Chinese text
* NEVER truncate or abbreviate any part of the JSON structure
* ALWAYS include complete JSON with proper closing brackets

EXAMPLE:
For vocabulary item "好":
{
  "item": "好",
  "pinyin": "hǎo",
  "meanings": [
    {
      "chinese": "好的；不错的；很棒的",
      "english": "good ; nice ; fine",
      "vietnamese": "tốt ; hay ; được",
      "part_of_speech": "adj",
      "usage_frequency": "very common",
      "examples": [
        {
          "chinese": "这本书很好。",
          "pinyin": "Zhè běn shū hěn hǎo.",
          "english": "This book is very good.",
          "vietnamese": "Cuốn sách này rất hay."
        },
        {
          "chinese": "天气好。",
          "pinyin": "Tiānqì hǎo.",
          "english": "The weather is nice.",
          "vietnamese": "Thời tiết tốt."
        }
      ]
    },
    {
      "chinese": "身体健康；状态良好",
      "english": "to be okay ; to be well",
      "vietnamese": "khỏe ; ổn",
      "part_of_speech": "v",
      "usage_frequency": "common",
      "examples": [
        {
          "chinese": "你好吗？",
          "pinyin": "Nǐ hǎo ma?",
          "english": "How are you?",
          "vietnamese": "Bạn khỏe không?"
        }
      ]
    }
  ]
}"""

def standardize_format(text: str, config: EnrichmentConfig) -> str:
    """
    Standardize the format of text to use a consistent separator.
    
    Args:
        text: The text to standardize
        config: Configuration with standard separator
        
    Returns:
        Standardized text
    """
    # Replace forward slashes with the standard separator
    standardized = text.replace(' / ', config.standard_separator)
    
    # Replace semicolons without spaces with the standard separator
    standardized = standardized.replace(';', config.standard_separator)
    
    # Clean up any double spaces
    while '  ' in standardized:
        standardized = standardized.replace('  ', ' ')
    
    # Clean up any doubled separators
    while config.standard_separator + config.standard_separator in standardized:
        standardized = standardized.replace(config.standard_separator + config.standard_separator, config.standard_separator)
    
    return standardized.strip()

def enrich_vocabulary_item(item: str, config: EnrichmentConfig, 
                          provided_pinyin: str = "", hsk_level: int = None) -> Dict[str, Any]:
    """
    Call Qwen3 via Ollama to get enriched meanings for a Chinese vocabulary item.
    
    Args:
        item: The Chinese vocabulary item to enrich
        config: Configuration settings
        provided_pinyin: Optional pinyin if already known
        hsk_level: Optional HSK level for context
        
    Returns:
        Dictionary with enriched data
    """
    system_prompt = create_system_prompt()
    
    # Create context-rich prompt
    context = f"Provide detailed meanings, Chinese definitions, English translations, Vietnamese translations, and examples for this Chinese vocabulary item:\n\nItem: {item}"
    
    if provided_pinyin:
        context += f"\nPinyin: {provided_pinyin}"
    
    if hsk_level:
        context += f"\nHSK Level: {hsk_level}"
    
    user_prompt = f"""{context}

请先用中文思考这个词的含义和用法，然后再翻译。首先理解这个词在中文中的确切含义，然后提供中文定义、精确的英语和越南语翻译。

Remember:
1. Provide Chinese definitions for each meaning (use " ; " between alternatives)
2. Use " ; " (semicolons with spaces) between alternative meanings in all languages
3. Provide complete Vietnamese translations for ALL examples
4. Include 2-4 meanings maximum, ordered by frequency of use
5. Keep examples simple (HSK1-3 level)
6. Respond ONLY with the complete JSON structure with no additional text"""
    
    # Always log input prompts
    logging.info(f"Processing vocabulary item: {item}")
    logging.debug(f"System prompt:")
    logging.debug("-" * 50)
    logging.debug(system_prompt)
    logging.debug("-" * 50)
    
    logging.debug(f"User prompt:")
    logging.debug("-" * 50)
    logging.debug(user_prompt)
    logging.debug("-" * 50)
    
    # Prepare payload for Ollama API
    payload = {
        "model": config.model,
        "prompt": user_prompt,
        "system": system_prompt,
        "stream": False,
        "options": {
            "temperature": config.temperature,
            "num_predict": 20000  # Set to a high value to avoid truncation
        }
    }
    
    logging.debug(f"API payload:")
    logging.debug(json.dumps(payload, ensure_ascii=False, indent=2))
    
    first_attempt_response = None
    
    for attempt in range(config.max_retries):
        try:
            logging.info(f"Requesting data for vocabulary item: {item} (attempt {attempt+1})")
            
            # If this is a retry and we have a previous response, use a specialized system prompt
            if attempt > 0 and first_attempt_response:
                # Create a new system prompt that includes the first attempt's response
                retry_system_prompt = f"""You are a Chinese language expert (中文语言专家) with deep knowledge of Chinese vocabulary and Vietnamese translations.

In a previous attempt to generate JSON for the vocabulary item "{item}", your response was truncated or had errors. Here is the incomplete response:

{first_attempt_response}

请再次用中文思考这个词的含义，然后提供完整的JSON响应，包括中文定义。

Please provide a COMPLETE and VALID JSON response for this vocabulary item. Pay special attention to:
1. Including Chinese definitions for each meaning
2. Ensuring ALL Vietnamese translations are complete (especially in the examples section)
3. Including all closing quotes and brackets
4. Using proper JSON formatting throughout
5. Using semicolons with spaces " ; " between alternative meanings in ALL languages (NOT forward slashes)
6. Including ALL fields in the requested structure

The JSON MUST be complete and valid. Do not truncate or abbreviate any part of it."""

                # Update the payload with the new system prompt
                payload["system"] = retry_system_prompt
                logging.debug(f"Retry system prompt:")
                logging.debug("-" * 50)
                logging.debug(retry_system_prompt)
                logging.debug("-" * 50)
            
            response = requests.post(config.api_url, json=payload)
            
            # Always log the response status
            logging.debug(f"API response status code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get("response", "")
                
                # Store the first attempt's response for potential use in retry
                if attempt == 0:
                    first_attempt_response = response_text
                
                # Always log the full response text
                logging.info(f"Response received for {item} ({len(response_text)} chars)")
                logging.debug(f"Full API response text:")
                logging.debug("-" * 50)
                logging.debug(response_text)
                logging.debug("-" * 50)
                
                # Check for <think> tags and extract content between them if present
                if response_text.startswith("<think>") and "</think>" in response_text:
                    thinking_text = response_text.split("</think>")[0].replace("<think>", "").strip()
                    response_text = response_text.split("</think>")[1].strip()
                    logging.debug(f"Thinking text detected and removed ({len(thinking_text)} chars)")
                
                # Extract JSON from response
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                
                if json_start >= 0 and json_end > json_start:
                    json_str = response_text[json_start:json_end]
                    logging.debug(f"Extracted JSON string ({len(json_str)} chars)")
                    
                    try:
                        # Try to parse the JSON
                        enriched_data = json.loads(json_str)
                        
                        # Standardize formats for all language fields
                        if "meanings" in enriched_data:
                            for meaning in enriched_data["meanings"]:
                                if "chinese" in meaning:
                                    meaning["chinese"] = standardize_format(meaning["chinese"], config)
                                if "english" in meaning:
                                    meaning["english"] = standardize_format(meaning["english"], config)
                                if "vietnamese" in meaning:
                                    meaning["vietnamese"] = standardize_format(meaning["vietnamese"], config)
                        
                        logging.info(f"Successfully parsed JSON for {item}")
                        return enriched_data
                    
                    except json.JSONDecodeError as e:
                        logging.error(f"JSON parse error for {item}: {e}")
                        logging.error(f"JSON string with error:")
                        logging.error("-" * 50)
                        logging.error(json_str)
                        logging.error("-" * 50)
                        
                        # Log the problematic line
                        if hasattr(e, 'lineno') and hasattr(e, 'colno'):
                            lines = json_str.split('\n')
                            if e.lineno <= len(lines):
                                problematic_line = lines[e.lineno - 1]
                                logging.error(f"Problematic line ({e.lineno}): {problematic_line}")
                                logging.error(f"Position: {' ' * (e.colno - 1)}^")
                
                else:
                    logging.error(f"No valid JSON found in response for {item}")
                
            else:
                logging.error(f"API error for {item}: {response.status_code}")
                logging.error(f"Error response: {response.text}")
            
            # Wait before retrying
            if attempt < config.max_retries - 1:
                logging.info(f"Waiting {config.retry_delay} seconds before retry #{attempt+2}...")
                time.sleep(config.retry_delay)
                
        except Exception as e:
            logging.error(f"Error processing {item}: {e}")
            logging.error("Exception details:", exc_info=True)
            if attempt < config.max_retries - 1:
                logging.info(f"Waiting {config.retry_delay} seconds before retry #{attempt+2}...")
                time.sleep(config.retry_delay)
    
    # Return empty data if all attempts failed
    logging.warning(f"All attempts failed for {item}, returning empty structure")
    return {
        "item": item,
        "pinyin": provided_pinyin,
        "error": "Failed to get enriched data",
        "meanings": []
    }

def batch_process_items(items: List[str], config: EnrichmentConfig, 
                        pinyin_map: Dict[str, str] = None, 
                        hsk_levels: Dict[str, int] = None) -> List[Dict[str, Any]]:
    """
    Process a batch of Chinese vocabulary items and enrich their meanings.
    
    Args:
        items: List of Chinese vocabulary items
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
        enriched_data = enrich_vocabulary_item(item, config, pinyin, hsk_level)
        
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