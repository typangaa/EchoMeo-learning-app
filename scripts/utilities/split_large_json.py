#!/usr/bin/env python
"""
JSON File Splitter for Large HSK Vocabulary Files

This script splits large JSON files into smaller, more manageable chunks.
Specifically designed for HSK level 7 vocabulary files.

Usage:
  python split_large_json.py [--input FILE] [--output-dir DIR] [--chunks N]
"""

import os
import json
import argparse
import sys
from pathlib import Path
from typing import List, Dict, Any
import math

def load_json_file(file_path: str) -> List[Dict[str, Any]]:
    """Load JSON file and return the data."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"[OK] Loaded {len(data)} items from {file_path}")
        return data
    except Exception as e:
        print(f"[ERROR] Error loading {file_path}: {e}")
        return []

def split_data(data: List[Dict[str, Any]], num_chunks: int) -> List[List[Dict[str, Any]]]:
    """Split data into approximately equal chunks."""
    if not data:
        return []
    
    chunk_size = math.ceil(len(data) / num_chunks)
    chunks = []
    
    for i in range(0, len(data), chunk_size):
        chunk = data[i:i + chunk_size]
        chunks.append(chunk)
    
    return chunks

def save_chunks(chunks: List[List[Dict[str, Any]]], output_dir: str, base_name: str):
    """Save chunks to separate JSON files."""
    os.makedirs(output_dir, exist_ok=True)
    
    for i, chunk in enumerate(chunks, 1):
        output_file = os.path.join(output_dir, f"{base_name}_part{i}.json")
        
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(chunk, f, ensure_ascii=False, indent=2)
            print(f"[OK] Saved part {i}: {len(chunk)} items to {output_file}")
        except Exception as e:
            print(f"[ERROR] Error saving {output_file}: {e}")

def split_json_file(input_file: str, output_dir: str, num_chunks: int = 4):
    """Split a single JSON file into multiple chunks."""
    if not os.path.exists(input_file):
        print(f"[ERROR] Input file not found: {input_file}")
        return False
    
    # Load data
    data = load_json_file(input_file)
    if not data:
        return False
    
    # Split into chunks
    chunks = split_data(data, num_chunks)
    
    # Generate base name from input file
    base_name = Path(input_file).stem
    
    print(f"Splitting {len(data)} items into {len(chunks)} chunks:")
    for i, chunk in enumerate(chunks, 1):
        print(f"  Part {i}: {len(chunk)} items")
    
    # Save chunks
    save_chunks(chunks, output_dir, base_name)
    
    return True

def main():
    parser = argparse.ArgumentParser(description='Split large JSON files into smaller chunks')
    parser.add_argument('--input', '-i', required=True, help='Input JSON file path')
    parser.add_argument('--output-dir', '-o', help='Output directory (default: same as input)')
    parser.add_argument('--chunks', '-c', type=int, default=4, help='Number of chunks to create (default: 4)')
    
    args = parser.parse_args()
    
    # Set default output directory
    if not args.output_dir:
        args.output_dir = os.path.dirname(args.input)
    
    print(f"Input file: {args.input}")
    print(f"Output directory: {args.output_dir}")
    print(f"Number of chunks: {args.chunks}")
    print("-" * 50)
    
    success = split_json_file(args.input, args.output_dir, args.chunks)
    
    if success:
        print("-" * 50)
        print("[SUCCESS] File splitting completed successfully!")
    else:
        print("[FAILED] File splitting failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()