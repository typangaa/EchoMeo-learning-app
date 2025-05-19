#!/usr/bin/env python
"""
Alternative approach for Ollama API translations.
This script takes a different approach to get translations from Ollama.
"""

import json
import requests
import sys
import time

OLLAMA_API_URL = "http://localhost:11434/api/generate"

def translate_with_completion(model="qwen3:latest", word="图书馆", meaning="library"):
    """
    Use a completion-style approach without JSON formatting requirements.
    This can work better with models that struggle with strict JSON output.
    """
    print(f"Testing simple translation of {word} ({meaning}) with model {model}")
    
    # Simpler prompt without JSON requirements
    prompt = f"""You are a Chinese to Vietnamese translator.

Translate the following Chinese word to Vietnamese:
Chinese: {word}
English meaning: {meaning}

Return ONLY the Vietnamese translation, nothing else. 
Do not include any explanation, notes, or other text.
Just the single Vietnamese word or phrase:"""
    
    # Create payload with minimal constraints
    payload = {
        "model": model,
        "prompt": prompt,
        "system": "",  # No system prompt
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 10,  # Only need a few tokens
            "stop": ["\n"]      # Stop at newline
        }
    }
    
    try:
        # Make API call
        print("Sending request...")
        response = requests.post(OLLAMA_API_URL, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            translation = result.get("response", "").strip()
            
            print(f"Raw response: '{translation}'")
            
            if translation:
                print(f"Success! Translation: {translation}")
                return translation
            else:
                print("Error: Empty response received")
                return None
        else:
            print(f"API error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Exception: {e}")
        return None

def raw_ollama_chat(model="qwen3:latest", word="图书馆", meaning="library"):
    """
    Use the Ollama chat API instead of the generate API.
    This can sometimes work better for certain models.
    """
    print(f"Trying chat API for {word} ({meaning}) with model {model}")
    
    # Chat API URL
    chat_url = "http://localhost:11434/api/chat"
    
    messages = [
        {
            "role": "system",
            "content": "You are a Chinese to Vietnamese translator. Respond with only the Vietnamese translation, nothing else."
        },
        {
            "role": "user",
            "content": f"Translate this Chinese word to Vietnamese: {word} (meaning: {meaning})"
        }
    ]
    
    # Create payload
    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": 0.1
        }
    }
    
    try:
        # Make API call
        print("Sending chat request...")
        response = requests.post(chat_url, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            print("Full response:", json.dumps(result, indent=2, ensure_ascii=False))
            
            message = result.get("message", {})
            translation = message.get("content", "").strip()
            
            print(f"Raw response: '{translation}'")
            
            if translation:
                # Extract just the Vietnamese word if there's extra text
                lines = translation.split('\n')
                cleaned = lines[0].strip()
                
                # Remove common prefixes
                prefixes = ["Vietnamese:", "Translation:", "Vietnamese translation:"]
                for prefix in prefixes:
                    if cleaned.startswith(prefix):
                        cleaned = cleaned[len(prefix):].strip()
                
                print(f"Success! Translation: {cleaned}")
                return cleaned
            else:
                print("Error: Empty response received")
                return None
        else:
            print(f"API error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Exception: {e}")
        return None

def test_ollama_models(word="图书馆", meaning="library"):
    """Test translation with different models and approaches."""
    # Get available models
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            models = response.json().get("models", [])
            model_names = [model["name"] for model in models]
        else:
            print("Error getting models list")
            model_names = ["qwen3:latest", "llama3:latest", "llama3.1:latest", "gemma:latest"]
    except:
        print("Error accessing Ollama API, using default model list")
        model_names = ["qwen3:latest", "llama3:latest", "llama3.1:latest", "gemma:latest"]
    
    # Create a table header
    print("\n" + "=" * 80)
    print(f"{'Model':<20} | {'Completion API':<30} | {'Chat API':<30}")
    print("=" * 80)
    
    results = {}
    
    # Test each model with both approaches
    for model in model_names:
        completion_result = translate_with_completion(model, word, meaning)
        chat_result = raw_ollama_chat(model, word, meaning)
        
        # Store results
        results[model] = {
            "completion": completion_result,
            "chat": chat_result
        }
        
        # Print results in table
        completion_str = completion_result if completion_result else "FAILED"
        chat_str = chat_result if chat_result else "FAILED"
        
        print(f"{model:<20} | {completion_str:<30} | {chat_str:<30}")
    
    # Print summary
    print("\n" + "=" * 80)
    print("SUMMARY OF WORKING APPROACHES:")
    print("=" * 80)
    
    working_models = []
    for model, result in results.items():
        if result["completion"] or result["chat"]:
            approach = []
            if result["completion"]:
                approach.append("completion")
            if result["chat"]:
                approach.append("chat")
            
            working_models.append(f"{model} ({', '.join(approach)})")
    
    if working_models:
        for i, model in enumerate(working_models, 1):
            print(f"{i}. {model}")
        
        print("\nRecommendations:")
        if any(result["completion"] for result in results.values()):
            print("1. Use the completion API approach but without JSON requirements")
        if any(result["chat"] for result in results.values()):
            print("2. Use the chat API instead of the generate API")
        print("3. Try one of the working models shown above")
    else:
        print("No working models found. Consider using Google Translate instead.")
    
    return results

if __name__ == "__main__":
    print("Alternative Ollama Translation Approaches")
    print("=========================================")
    
    # Get word from command line if provided
    word = "图书馆"
    meaning = "library"
    if len(sys.argv) > 2:
        word = sys.argv[1]
        meaning = sys.argv[2]
    
    # Test all models
    test_ollama_models(word, meaning)
