#!/usr/bin/env python
"""
Path Verification Script for Vietnamese Vocabulary Processor

This script verifies that all required files and dependencies are available
before running the Vietnamese vocabulary processor.
"""

import os
import sys
import json
import requests
from pathlib import Path

def check_file_exists(file_path: str, description: str) -> bool:
    """Check if a file exists and print status."""
    if os.path.exists(file_path):
        print(f"✓ {description}: {file_path}")
        return True
    else:
        print(f"✗ {description}: {file_path} (NOT FOUND)")
        return False

def check_directory_exists(dir_path: str, description: str) -> bool:
    """Check if a directory exists and print status."""
    if os.path.exists(dir_path) and os.path.isdir(dir_path):
        print(f"✓ {description}: {dir_path}")
        return True
    else:
        print(f"✗ {description}: {dir_path} (NOT FOUND)")
        return False

def check_python_module(module_name: str) -> bool:
    """Check if a Python module is available."""
    try:
        __import__(module_name)
        print(f"✓ Python module: {module_name}")
        return True
    except ImportError:
        print(f"✗ Python module: {module_name} (NOT AVAILABLE)")
        return False

def check_ollama_connection() -> bool:
    """Check if Ollama is running and accessible."""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            print("✓ Ollama server: Running and accessible")
            return True
        else:
            print(f"✗ Ollama server: HTTP {response.status_code}")
            return False
    except requests.ConnectionError:
        print("✗ Ollama server: Not running or not accessible")
        return False
    except Exception as e:
        print(f"✗ Ollama server: Error - {e}")
        return False

def check_ollama_model(model_name: str) -> bool:
    """Check if the specified Ollama model is available."""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get("models", [])
            model_base = model_name.split(':')[0]
            
            available_models = [model["name"] for model in models]
            
            if any(model.startswith(model_base) for model in available_models):
                print(f"✓ Ollama model: {model_name} (or similar) is available")
                print(f"  Available models: {', '.join(available_models)}")
                return True
            else:
                print(f"✗ Ollama model: {model_name} not found")
                print(f"  Available models: {', '.join(available_models)}")
                print(f"  Install with: ollama pull {model_name}")
                return False
        else:
            print(f"✗ Cannot check models: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error checking models: {e}")
        return False

def check_input_file_structure(file_path: str) -> bool:
    """Check if the input file has the expected structure."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            print(f"✗ Input file structure: Not a JSON array")
            return False
        
        if len(data) == 0:
            print(f"✗ Input file structure: Empty array")
            return False
        
        # Check first item structure
        first_item = data[0]
        required_fields = ["vietnamese"]
        optional_fields = ["syllables", "frequency", "pos", "etymology", "forms"]
        
        missing_required = [field for field in required_fields if field not in first_item]
        if missing_required:
            print(f"✗ Input file structure: Missing required fields: {missing_required}")
            return False
        
        present_optional = [field for field in optional_fields if field in first_item]
        
        print(f"✓ Input file structure: Valid JSON with {len(data)} items")
        print(f"  Sample item has: {', '.join(first_item.keys())}")
        print(f"  Required fields present: {', '.join(required_fields)}")
        print(f"  Optional fields present: {', '.join(present_optional)}")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"✗ Input file structure: Invalid JSON - {e}")
        return False
    except Exception as e:
        print(f"✗ Input file structure: Error reading file - {e}")
        return False

def main():
    """Main verification function."""
    print("=" * 60)
    print("Vietnamese Vocabulary Processor - Path Verification")
    print("=" * 60)
    print()
    
    all_checks_passed = True
    
    # Check core files
    print("Checking core files...")
    core_files = [
        ("vietnamese_vocabulary_processor.py", "Main processor script"),
        ("vietnamese_vocabulary_enrichment.py", "Enrichment module"),
        ("run_processor.bat", "Windows batch runner"),
        ("README.md", "Documentation")
    ]
    
    for file_path, description in core_files:
        if not check_file_exists(file_path, description):
            all_checks_passed = False
    
    print()
    
    # Check input file
    print("Checking input file...")
    input_file = "../../data/vietnamese_generated/vietnamese_raw_1.json"
    if check_file_exists(input_file, "Vietnamese vocabulary input file"):
        if not check_input_file_structure(input_file):
            all_checks_passed = False
    else:
        all_checks_passed = False
    
    print()
    
    # Check output directory structure
    print("Checking output directories...")
    output_dirs = [
        ("../../data", "Data directory"),
        ("../../data/enriched", "Enriched data directory")
    ]
    
    for dir_path, description in output_dirs:
        if not check_directory_exists(dir_path, description):
            # Try to create the directory
            try:
                os.makedirs(dir_path, exist_ok=True)
                print(f"  → Created directory: {dir_path}")
            except Exception as e:
                print(f"  → Failed to create directory: {e}")
                all_checks_passed = False
    
    print()
    
    # Check Python modules
    print("Checking Python dependencies...")
    required_modules = ["json", "logging", "time", "argparse", "sys", "csv", "pathlib"]
    optional_modules = ["requests"]
    
    for module in required_modules:
        if not check_python_module(module):
            all_checks_passed = False
    
    for module in optional_modules:
        check_python_module(module)  # Don't fail on optional modules
    
    print()
    
    # Check Ollama
    print("Checking Ollama setup...")
    if check_ollama_connection():
        if not check_ollama_model("qwen3:latest"):
            print("  → Warning: Default model not available, but processor may work with other models")
    else:
        print("  → Error: Ollama is required for vocabulary enrichment")
        all_checks_passed = False
    
    print()
    
    # Summary
    print("=" * 60)
    if all_checks_passed:
        print("✓ All checks passed! Vietnamese Vocabulary Processor is ready to run.")
        print()
        print("To start processing:")
        print("  Windows: run_processor.bat")
        print("  Command line: python vietnamese_vocabulary_processor.py")
    else:
        print("✗ Some checks failed. Please fix the issues above before running the processor.")
        print()
        print("Common solutions:")
        print("  1. Install missing Python modules: pip install requests")
        print("  2. Start Ollama: ollama serve")
        print("  3. Install Qwen3 model: ollama pull qwen3:latest")
        print("  4. Check input file paths and permissions")
    
    print("=" * 60)
    
    return 0 if all_checks_passed else 1

if __name__ == "__main__":
    sys.exit(main())
