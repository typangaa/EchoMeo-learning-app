#!/usr/bin/env python
"""
Test script for the Ollama translation integration.
This script tests if Ollama is properly configured and can translate Chinese to Vietnamese.
"""

import sys
import json
import time

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

# Configuration
OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL = "qwen3:latest"  # Default model

def create_system_prompt():
    """Create the system prompt for translation."""
    return """
Do not include your internal reasoning process or any thinking steps.
Do not start your response with <think>.

You are a highly skilled professional translator specializing in translating from Chinese to Vietnamese.
Your task is to translate Chinese vocabulary words to Vietnamese with high accuracy and cultural appropriateness.

IMPORTANT GUIDELINES:
1. Provide ONLY the most accurate and appropriate Vietnamese translation for the given Chinese word
2. Focus on the most common meaning when a word has multiple meanings
3. Use modern, standard Vietnamese
4. Be aware of context based on any provided English meanings
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
"""

def test_translation(text, context="", debug=True):
    """
    Test translating a Chinese word to Vietnamese using Ollama.
    
    Args:
        text: The Chinese text to translate
        context: Optional English context
    """
    system_prompt = create_system_prompt()
    
    # Prepare the prompt
    if context:
        user_prompt = f"Translate this Chinese word to Vietnamese: {text}\nMeaning in English: {context}"
    else:
        user_prompt = f"Translate this Chinese word to Vietnamese: {text}"
    
    print(f"\nTesting translation of: {text}")
    if context:
        print(f"Context: {context}")
    
    # Prepare the payload
    payload = {
        "model": MODEL,
        "prompt": user_prompt,
        "system": system_prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 100,
            "mirostat": 0,       # Disable mirostat sampling
            "top_p": 0.95,       # Limit to top 95% of probability mass
            "repeat_penalty": 1.1, # Apply a small penalty to repeated tokens
            "stop": ["<think>"]  # Stop if the model starts thinking out loud
        }
    }
    
    try:
        # Call the Ollama API
        print("Calling Ollama API...")
        start_time = time.time()
        response = requests.post(OLLAMA_API_URL, json=payload)
        elapsed_time = time.time() - start_time
        
        if response.status_code == 200:
            # Parse the response
            result = response.json()
            response_text = result.get("response", "")
            
            # Print the complete raw response for debugging
            print(f"Raw response: {response_text}")
            print(f"Response time: {elapsed_time:.2f} seconds")
            print(f"Complete response object: {json.dumps(result, indent=2)}")
            
            # Try to extract JSON
            try:
                # Find JSON in the response
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                
                if json_start >= 0 and json_end > json_start:
                    json_str = response_text[json_start:json_end]
                    translation_data = json.loads(json_str)
                    
                    print("\nExtracted JSON:")
                    print(json.dumps(translation_data, indent=2, ensure_ascii=False))
                    
                    # Check if expected fields are present
                    if "translation" in translation_data:
                        print(f"\nTranslation: {translation_data['translation']}")
                        print(f"Confidence: {translation_data.get('confidence', 'Not provided')}")
                        return True
                    else:
                        print("Error: JSON response doesn't contain 'translation' field")
                        return False
                else:
                    print("Error: Couldn't extract JSON from response")
                    return False
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON: {e}")
                return False
        else:
            print(f"Ollama API error: {response.status_code} - {response.text}")
            return False
    except requests.ConnectionError:
        print("Error: Could not connect to Ollama server at http://localhost:11434")
        print("Please make sure Ollama is installed and running.")
        return False
    except Exception as e:
        print(f"Error calling Ollama API: {e}")
        return False

def check_ollama_server():
    """Check if Ollama server is running and the model is available."""
    print("Checking Ollama server...")
    try:
        # Check if the server is running
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code != 200:
            print("Error: Ollama server is not running")
            return False
        
        print("Ollama server is running!")
        
        # Check if the required model is available
        models = response.json().get("models", [])
        model_name = MODEL.split(':')[0]  # Get base model name
        
        available_models = [model["name"] for model in models]
        print(f"Available models: {', '.join(available_models)}")
        
        if not any(model["name"].startswith(model_name) for model in models):
            print(f"Warning: Model {model_name} not found. Please pull it with:")
            print(f"  ollama pull {model_name}")
            print("Continuing anyway, but translation may fail...")
        else:
            print(f"Model {model_name} is available")
        
        return True
    except requests.ConnectionError:
        print("Error: Could not connect to Ollama server at http://localhost:11434")
        print("Please make sure Ollama is installed and running.")
        return False
    except Exception as e:
        print(f"Error checking Ollama server: {e}")
        return False

def main():
    """Run translation tests."""
    global MODEL
    
    print("=" * 60)
    print("Ollama Translation Test for HSK Vocabulary")
    print("=" * 60)
    print("\nThis script tests if Ollama is correctly configured")
    print("to translate Chinese vocabulary to Vietnamese.")
    
    # Check for command-line arguments
    if len(sys.argv) > 1:
        MODEL = sys.argv[1]
    
    print(f"\nUsing model: {MODEL}")
    
    # Check if Ollama server is running
    if not check_ollama_server():
        print("\nOllama server check failed. Please make sure:")
        print("1. Ollama is installed from https://ollama.com/download")
        print("2. Ollama service is running")
        print("3. The Qwen3 model is pulled: ollama pull qwen3")
        print("\nServer setup must be completed before running this test again.")
        return
    
    # Test words with different complexities
    test_words = [
        {"text": "你好", "context": "hello, greeting"},
        {"text": "学校", "context": "school, educational institution"},
        {"text": "电脑", "context": "computer"},
        {"text": "工作", "context": "work, job, to work"},
        {"text": "图书馆", "context": "library"}
    ]
    
    # Run the tests
    results = []
    for word in test_words:
        print("\n" + "="*50)
        success = test_translation(word["text"], word["context"])
        results.append({"word": word["text"], "success": success})
    
    # Print summary
    print("\n" + "="*50)
    print("Test Summary:")
    successful = sum(1 for r in results if r["success"])
    print(f"Successful translations: {successful}/{len(results)}")
    
    if successful == len(results):
        print("\nAll tests passed! Ollama translation is working correctly.")
        print("You can now use auto_translate.py to translate HSK vocabulary.")
    else:
        print("\nSome tests failed. Please check:")
        print("1. Is Ollama running? (Check system tray or run Ollama manually)")
        print("2. Is the model available? (Run 'ollama list' to check)")
        print("3. Does the model support the expected JSON output format?")
        print("   (Try using qwen3:latest which is recommended)")

if __name__ == "__main__":
    main()
