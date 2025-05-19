#!/usr/bin/env python
"""
Debug script for Ollama API calls.
This script provides detailed debugging information for Ollama API responses.
"""

import json
import requests
import sys
import time

OLLAMA_API_URL = "http://localhost:11434/api/generate"

def debug_ollama_response(model="qwen3:latest", word="图书馆", meaning="library"):
    """Make an API call to Ollama and print detailed debug information."""
    
    print("=" * 60)
    print(f"DETAILED OLLAMA RESPONSE DEBUG FOR: {word} ({meaning})")
    print("=" * 60)
    print(f"Using model: {model}")
    
    # Create system prompt
    system_prompt = """
DO NOT start your response with <think>. 
DO NOT include any reasoning or thinking steps in your response.

You are translating Chinese words to Vietnamese.
ONLY return the translation in this EXACT JSON format and nothing else:
{"translation": "Vietnamese translation", "confidence": 5}

Example:
Input: 你好
Output: {"translation": "xin chào", "confidence": 5}
"""
    
    # Create user prompt
    user_prompt = f"Translate this Chinese word to Vietnamese: {word} (meaning: {meaning})"
    print(f"\nUser prompt: {user_prompt}")
    print(f"\nSystem prompt excerpt: {system_prompt[:100]}...")
    
    # Create payload
    payload = {
        "model": model,
        "prompt": user_prompt,
        "system": system_prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 50,
            "top_k": 40,
            "top_p": 0.9,
            "mirostat": 0,
            "repeat_penalty": 1.1,
            "stop": ["<think>"]
        }
    }
    
    print("\nSending request to Ollama API...")
    print(f"URL: {OLLAMA_API_URL}")
    print(f"Model: {model}")
    print(f"Options: {json.dumps(payload['options'], indent=2)}")
    
    try:
        # Make API call and time it
        start_time = time.time()
        response = requests.post(OLLAMA_API_URL, json=payload)
        elapsed_time = time.time() - start_time
        
        print(f"\nResponse received in {elapsed_time:.2f} seconds")
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            # Parse response
            result = response.json()
            
            # Print full response object
            print("\nFULL RESPONSE OBJECT:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            
            # Get the text response
            response_text = result.get("response", "")
            
            # Print text response with character analysis
            print("\nTEXT RESPONSE ANALYSIS:")
            print(f"Response length: {len(response_text)} characters")
            print("First 10 characters (hex):", " ".join(f"{ord(c):02x}" for c in response_text[:10]))
            print(f"Full response text: '{response_text}'")
            
            # Check for JSON
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                print(f"\nExtracted JSON string: '{json_str}'")
                
                try:
                    parsed_json = json.loads(json_str)
                    print("\nParsed JSON:")
                    print(json.dumps(parsed_json, indent=2, ensure_ascii=False))
                    
                    if "translation" in parsed_json:
                        print("\nFound translation:", parsed_json["translation"])
                    else:
                        print("\nWARNING: No 'translation' field in JSON")
                except json.JSONDecodeError as e:
                    print(f"\nJSON parsing error: {e}")
                    print(f"JSON string that failed to parse: '{json_str}'")
            else:
                print("\nNo JSON found in response")
        else:
            print(f"\nError response: {response.text}")
    except Exception as e:
        print(f"\nException occurred: {e}")

def list_models():
    """List all available models in Ollama."""
    try:
        print("Checking available models...")
        response = requests.get("http://localhost:11434/api/tags")
        
        if response.status_code == 200:
            data = response.json()
            models = data.get("models", [])
            
            print(f"Found {len(models)} models:")
            for i, model in enumerate(models, 1):
                print(f"{i}. {model['name']}")
            
            return [model["name"] for model in models]
        else:
            print(f"Error getting models: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        print(f"Exception occurred while listing models: {e}")
        return []

if __name__ == "__main__":
    print("Ollama API Debug Tool")
    print("=====================\n")
    
    # List available models
    available_models = list_models()
    
    if not available_models:
        print("ERROR: No models found or Ollama server is not running.")
        print("Please make sure Ollama is installed and running.")
        sys.exit(1)
    
    # Get model from command line or ask user
    model = None
    if len(sys.argv) > 1:
        model = sys.argv[1]
    else:
        print("\nPlease select a model to test:")
        for i, model_name in enumerate(available_models, 1):
            print(f"{i}. {model_name}")
        
        choice = input("\nEnter model number or name: ")
        try:
            # Try to parse as index
            idx = int(choice) - 1
            if 0 <= idx < len(available_models):
                model = available_models[idx]
            else:
                # If not a valid index, use as direct model name
                model = choice
        except ValueError:
            # Not a number, use as direct model name
            model = choice
    
    # Get test word
    word = "图书馆"
    meaning = "library"
    
    if len(sys.argv) > 3:
        word = sys.argv[2]
        meaning = sys.argv[3]
    else:
        custom = input(f"\nTest with word '{word}' (meaning: '{meaning}')? Enter to accept or type a new word: ")
        if custom:
            word = custom
            meaning = input("Enter the meaning: ")
    
    # Run debug
    debug_ollama_response(model, word, meaning)
    
    print("\nDebug complete.")
