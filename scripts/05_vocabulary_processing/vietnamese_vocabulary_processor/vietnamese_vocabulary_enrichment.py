#!/usr/bin/env python
"""
Vietnamese Vocabulary Enrichment Module using Qwen3

This module provides functions to:
1. Enrich Vietnamese vocabulary items with detailed Chinese translations and meanings
2. Generate example sentences for each meaning
3. Structure data for Vietnamese-Chinese language learning applications
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
    """Create a detailed system prompt for Qwen3 to generate structured Vietnamese vocabulary meanings with Chinese translations."""
    return """You are a Vietnamese-Chinese language expert (越南语-中文语言专家) with deep knowledge of Vietnamese vocabulary, their meanings, and Chinese translations. Your task is to provide clear, accurate, and structured information about Vietnamese vocabulary items for language learners studying Chinese from Vietnamese.

CRITICAL: Your ENTIRE thinking process MUST be conducted in Vietnamese. You must think like a native Vietnamese speaker explaining the word to another Vietnamese person first, then provide Chinese translations.

QUY TRÌNH BÁT BUỘC (MANDATORY PROCESS):
1. Đầu tiên, hãy suy nghĩ HOÀN TOÀN bằng tiếng Việt về từ này
2. Nghĩ về nghĩa chính của từ trong đời sống hàng ngày của người Việt
3. Nghĩ về các nghĩa phụ và cách sử dụng khác nhau
4. Nghĩ về các ví dụ thực tế mà người Việt thường dùng
5. SAU ĐÓ MỚI dịch sang tiếng Trung và tiếng Anh

VÍ DỤ QUY TRÌNH SUY NGHĨ ĐÚNG:
<think>
Từ "yêu" - tôi cần nghĩ về nghĩa của từ này trong tiếng Việt trước.
Nghĩa chính nhất: khi chúng ta nói "yêu" thì thường là cảm thấy tình cảm sâu sắc với ai đó, như yêu gia đình, yêu bạn gái/bạn trai.
Nghĩa thứ hai: có thể là thích thú, ưa thích cái gì đó, như "tôi yêu món phở".
Nghĩa thứ ba: còn có thể dùng để nói về tình yêu như một khái niệm, như "tình yêu là điều thiêng liêng".
Các ví dụ thực tế người Việt hay dùng: "Con yêu mẹ", "Anh yêu em", "Tôi yêu quê hương"...
Bây giờ tôi sẽ dịch sang tiếng Trung: yêu = 爱 (ài) cho nghĩa chính...
</think>

ABSOLUTELY REQUIRED: Begin every response with <think> tags containing your complete Vietnamese thinking process. Do NOT proceed to the JSON until you have thoroughly analyzed the word in Vietnamese first.

For each Vietnamese vocabulary item provided, you will:
1. Identify the most common 2-4 meanings (in Vietnamese, Chinese, and English)
2. Provide Vietnamese definitions for each meaning
3. Provide Chinese translations (simplified characters) for each meaning
4. Provide Pinyin pronunciations for the Chinese translations
5. Provide English translations for additional context
6. Create simple example sentences showing Vietnamese-Chinese usage
7. Rank the meanings by frequency of usage

FOLLOW THIS EXACT JSON STRUCTURE:
{
  "vietnamese": "từ tiếng Việt",
  "ipa": "IPA pronunciation if available",
  "frequency": 50,
  "etymology": {
    "origin": "origin_type",
    "source_language": "source_language",
    "notes": "etymology notes"
  },
  "meanings": [
    {
      "vietnamese": "định nghĩa tiếng Việt ; nghĩa khác ; nghĩa thứ ba",
      "chinese": "中文翻译 ; 其他翻译 ; 第三个翻译",
      "pinyin": "zhōngwén fānyì ; qítā fānyì ; dì sān gè fānyì",
      "english": "English translation ; alternative translation ; third translation",
      "part_of_speech": "n/v/adj/etc",
      "usage_frequency": "very common/common/less common",
      "examples": [
        {
          "vietnamese": "Câu ví dụ tiếng Việt",
          "chinese": "中文例句",
          "pinyin": "zhōngwén lìjù",
          "english": "English translation of the example"
        },
        {
          "vietnamese": "Câu ví dụ thứ hai",
          "chinese": "第二个中文例句",
          "pinyin": "dì èr gè zhōngwén lìjù",
          "english": "English translation of second example"
        }
      ]
    },
    {
      "vietnamese": "nghĩa thứ hai ; nghĩa khác",
      "chinese": "第二个中文含义 ; 其他含义",
      "pinyin": "dì èr gè zhōngwén hányì ; qítā hányì",
      "english": "secondary meaning ; alternative meaning",
      "part_of_speech": "n/v/adj/etc",
      "usage_frequency": "common/less common",
      "examples": [...]
    }
  ]
}

CRITICAL GUIDELINES:
* BẮT BUỘC: Begin by thinking COMPLETELY in Vietnamese (tiếng Việt) about the vocabulary item's meanings and usage in <think> tags
* Suy nghĩ như người Việt bản địa giải thích từ này cho người Việt khác
* Think about how Vietnamese people actually use this word in daily life
* MUST include 1-3 most common meanings - quality over quantity
* MUST separate alternative meanings with semicolons and spaces " ; " (e.g., "tốt ; hay ; được")
* NEVER use forward slashes (/) to separate meanings
* ALL "vietnamese", "chinese", "pinyin" and "english" fields MUST follow the semicolon format for alternatives
* Vietnamese definitions should be natural and clear, as if explaining to a Vietnamese learner
* Chinese translations MUST use simplified characters with accurate Pinyin
* Examples MUST be simple and suitable for beginners (A1-B1 level)
* MUST provide full Chinese translations and Pinyin for ALL examples
* MUST use correct tone marks in Pinyin
* NEVER truncate or abbreviate any part of the JSON structure
* ALWAYS include complete JSON with proper closing brackets
* Consider etymology and loan words (Sino-Vietnamese, French, etc.)

REMINDER: You MUST start with Vietnamese thinking in <think> tags before providing the JSON. Failure to think in Vietnamese first will result in inaccurate cultural and linguistic understanding.

EXAMPLE:
For vocabulary item "yêu":
{
  "vietnamese": "yêu",
  "ipa": "/jøːː˧˩˧/",
  "frequency": 50,
  "etymology": {
    "origin": "sino_vietnamese",
    "source_language": "chinese",
    "notes": "From Chinese 愛 (ài), meaning love"
  },
  "meanings": [
    {
      "vietnamese": "cảm thấy tình yêu ; thích thú ; quý mến",
      "chinese": "爱 ; 喜欢 ; 疼爱",
      "pinyin": "ài ; xǐhuān ; téng'ài",
      "english": "to love ; to like ; to cherish",
      "part_of_speech": "v",
      "usage_frequency": "very common",
      "examples": [
        {
          "vietnamese": "Tôi yêu gia đình.",
          "chinese": "我爱家庭。",
          "pinyin": "Wǒ ài jiātíng.",
          "english": "I love my family."
        },
        {
          "vietnamese": "Anh ấy yêu cô ấy.",
          "chinese": "他爱她。",
          "pinyin": "Tā ài tā.",
          "english": "He loves her."
        }
      ]
    },
    {
      "vietnamese": "tình cảm yêu đương ; tình yêu",
      "chinese": "爱情 ; 恋爱",
      "pinyin": "àiqíng ; liàn'ài",
      "english": "love ; romantic love",
      "part_of_speech": "n",
      "usage_frequency": "common",
      "examples": [
        {
          "vietnamese": "Tình yêu là điều tuyệt vời.",
          "chinese": "爱情是美好的。",
          "pinyin": "Àiqíng shì měihǎo de.",
          "english": "Love is wonderful."
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

def enrich_vocabulary_item(item_data: Dict[str, Any], config: EnrichmentConfig) -> Dict[str, Any]:
    """
    Call Qwen3 via Ollama to get enriched meanings for a Vietnamese vocabulary item.
    
    Args:
        item_data: The Vietnamese vocabulary item data to enrich
        config: Configuration settings
        
    Returns:
        Dictionary with enriched data
    """
    system_prompt = create_system_prompt()
    
    # Extract item information
    vietnamese_word = item_data.get("vietnamese", "")
    frequency = item_data.get("frequency", 0)
    ipa = item_data.get("ipa", "")
    etymology = item_data.get("etymology", {})
    existing_meanings = item_data.get("meanings", [])
    pos_list = item_data.get("pos", [])
    
    # Create context-rich prompt
    context = f"Provide detailed Vietnamese-Chinese translations, meanings, and examples for this Vietnamese vocabulary item:\n\nVietnamese word: {vietnamese_word}"
    
    if ipa:
        context += f"\nIPA pronunciation: {ipa}"
    
    if frequency:
        context += f"\nFrequency score: {frequency}"
    
    if etymology:
        context += f"\nEtymology: {etymology}"
    
    if pos_list:
        context += f"\nParts of speech: {', '.join(pos_list)}"
    
    if existing_meanings:
        context += f"\nExisting meanings: {', '.join(existing_meanings)}"
    
    user_prompt = f"""{context}

Hãy suy nghĩ bằng tiếng Việt về nghĩa và cách sử dụng của từ này, sau đó cung cấp bản dịch tiếng Trung chính xác và các ví dụ.

Remember:
1. Provide Vietnamese definitions for each meaning (use " ; " between alternatives)
2. Provide accurate Chinese translations (simplified characters)
3. Include correct Pinyin with tone marks
4. Use " ; " (semicolons with spaces) between alternative meanings in all languages
5. Provide complete Chinese translations and Pinyin for ALL examples
6. Include 2-4 meanings maximum, ordered by frequency of use
7. Keep examples simple (A1-B1 level for Vietnamese-Chinese learners)
8. Consider the etymology when providing Chinese translations
9. Respond ONLY with the complete JSON structure with no additional text"""
    
    # Always log input prompts
    logging.info(f"Processing Vietnamese vocabulary item: {vietnamese_word}")
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
            logging.info(f"Requesting data for Vietnamese vocabulary item: {vietnamese_word} (attempt {attempt+1})")
            
            # If this is a retry and we have a previous response, use a specialized system prompt
            if attempt > 0 and first_attempt_response:
                # Create a new system prompt that includes the first attempt's response
                retry_system_prompt = f"""You are a Vietnamese-Chinese language expert (越南语-中文语言专家) with deep knowledge of Vietnamese vocabulary and Chinese translations.

In a previous attempt to generate JSON for the Vietnamese vocabulary item "{vietnamese_word}", your response was truncated or had errors. Here is the incomplete response:

{first_attempt_response}

Hãy suy nghĩ lại bằng tiếng Việt về từ này và cung cấp JSON đầy đủ và chính xác.

Please provide a COMPLETE and VALID JSON response for this Vietnamese vocabulary item. Pay special attention to:
1. Including Vietnamese definitions for each meaning
2. Ensuring ALL Chinese translations are complete with correct Pinyin
3. Including all closing quotes and brackets
4. Using proper JSON formatting throughout
5. Using semicolons with spaces " ; " between alternative meanings in ALL languages (NOT forward slashes)
6. Including ALL fields in the requested structure
7. Providing accurate Chinese characters (simplified) with tone marks in Pinyin

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
                logging.info(f"Response received for {vietnamese_word} ({len(response_text)} chars)")
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
                                if "vietnamese" in meaning:
                                    meaning["vietnamese"] = standardize_format(meaning["vietnamese"], config)
                                if "chinese" in meaning:
                                    meaning["chinese"] = standardize_format(meaning["chinese"], config)
                                if "pinyin" in meaning:
                                    meaning["pinyin"] = standardize_format(meaning["pinyin"], config)
                                if "english" in meaning:
                                    meaning["english"] = standardize_format(meaning["english"], config)
                        
                        logging.info(f"Successfully parsed JSON for {vietnamese_word}")
                        return enriched_data
                    
                    except json.JSONDecodeError as e:
                        logging.error(f"JSON parse error for {vietnamese_word}: {e}")
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
                    logging.error(f"No valid JSON found in response for {vietnamese_word}")
                
            else:
                logging.error(f"API error for {vietnamese_word}: {response.status_code}")
                logging.error(f"Error response: {response.text}")
            
            # Wait before retrying
            if attempt < config.max_retries - 1:
                logging.info(f"Waiting {config.retry_delay} seconds before retry #{attempt+2}...")
                time.sleep(config.retry_delay)
                
        except Exception as e:
            logging.error(f"Error processing {vietnamese_word}: {e}")
            logging.error("Exception details:", exc_info=True)
            if attempt < config.max_retries - 1:
                logging.info(f"Waiting {config.retry_delay} seconds before retry #{attempt+2}...")
                time.sleep(config.retry_delay)
    
    # Return empty data if all attempts failed
    logging.warning(f"All attempts failed for {vietnamese_word}, returning empty structure")
    return {
        "vietnamese": vietnamese_word,
        "ipa": ipa,
        "frequency": frequency,
        "etymology": etymology,
        "error": "Failed to get enriched data",
        "meanings": []
    }

def batch_process_items(items: List[Dict[str, Any]], config: EnrichmentConfig) -> List[Dict[str, Any]]:
    """
    Process a batch of Vietnamese vocabulary items and enrich their meanings.
    
    Args:
        items: List of Vietnamese vocabulary item data
        config: Configuration settings
        
    Returns:
        List of enriched data
    """
    enriched_items = []
    
    for item_data in items:
        vietnamese_word = item_data.get("vietnamese", "")
        
        # Enrich the item
        enriched_data = enrich_vocabulary_item(item_data, config)
        
        if enriched_data and "error" not in enriched_data:
            enriched_items.append(enriched_data)
            logging.info(f"Successfully enriched: {vietnamese_word}")
        else:
            logging.warning(f"Failed to enrich: {vietnamese_word}")
        
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
