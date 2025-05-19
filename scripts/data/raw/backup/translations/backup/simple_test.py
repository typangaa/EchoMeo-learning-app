#!/usr/bin/env python
"""
Simple direct test for Ollama translation from Chinese to Vietnamese.
Run this script to test if the model can follow the JSON output format correctly.
"""

import json
import requests
import sys

OLLAMA_API_URL = "http://localhost:11434/api/generate"

def test_simple_translation(model="qwen3:latest"):
    """Test a single translation with a simplified prompt."""
    
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
    
    user_prompt = "Translate this Chinese word to Vietnamese: 学校 (meaning: school)"
    
    print(f"Testing model: {model}")
    print(f"Prompt: {user_prompt}")
    
    payload = {
        "model": model,
        "prompt": user_prompt,
        "system": system_prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 50,
            "mirostat": 0,
            "top_p": 0.9,
            "repeat_penalty": 1.1,
            "stop": ["<think>"]
        }
    }
    
    try:
        print("\nSending request to Ollama...")
        response = requests.post(OLLAMA_API_URL, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            response_text = result.get("response", "")
            
            print(f"\nRaw response:\n{response_text}")
            
            # Try to parse as JSON
            try:
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                
                if json_start >= 0 and json_end > json_start:
                    json_str = response_text[json_start:json_end]
                    print(f"\nExtracted JSON:\n{json_str}")
                    
                    translation_data = json.loads(json_str)
                    print(f"\nSuccessfully parsed JSON:")
                    print(f"Translation: {translation_data.get('translation', 'N/A')}")
                    print(f"Confidence: {translation_data.get('confidence', 'N/A')}")
                    print("\nTest PASSED ✓")
                else:
                    print("\nFailed to extract JSON from response")
                    print("Test FAILED ✗")
            except json.JSONDecodeError as e:
                print(f"\nJSON parsing error: {e}")
                print("Test FAILED ✗")
        else:
            print(f"\nError from Ollama API: {response.status_code} - {response.text}")
            print("Test FAILED ✗")
    except Exception as e:
        print(f"\nError: {e}")
        print("Test FAILED ✗")

def check_models():
    """Check which models are available in Ollama."""
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            models = response.json().get("models", [])
            print("Available models:")
            for model in models:
                print(f"- {model['name']}")
            return True
        else:
            print(f"Error getting models: {response.status_code}")
            return False
    except Exception as e:
        print(f"Error checking models: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("SIMPLE OLLAMA TRANSLATION TEST")
    print("=" * 50)
    
    if not check_models():
        print("Failed to check available models. Is Ollama running?")
        sys.exit(1)
    
    model = "qwen3:latest"
    if len(sys.argv) > 1:
        model = sys.argv[1]
    
    print("\nThis script will test if Ollama can follow the JSON format correctly.")
    print("If this test fails, try using a different model or checking Ollama settings.")
    
    test_simple_translation(model)
