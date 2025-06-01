#!/usr/bin/env python
"""
Quick verification script to test data paths and directory structure
"""

import os
import sys
from pathlib import Path

def verify_data_paths():
    """Verify that all required data paths exist."""
    print("HSK Vocabulary Processor - Path Verification")
    print("=" * 50)
    
    # Get the script directory
    script_dir = Path(__file__).parent
    print(f"Script directory: {script_dir}")
    
    # Check raw data directory
    raw_dir = script_dir / "../../data/raw/exclusive"
    raw_dir_abs = raw_dir.resolve()
    print(f"Raw data directory: {raw_dir_abs}")
    print(f"Raw data exists: {raw_dir_abs.exists()}")
    
    if raw_dir_abs.exists():
        hsk_files = list(raw_dir_abs.glob("*.json"))
        print(f"HSK JSON files found: {len(hsk_files)}")
        for hsk_file in sorted(hsk_files):
            print(f"  - {hsk_file.name}")
    
    # Check output directory
    output_dir = script_dir / "../../data/enriched"
    output_dir_abs = output_dir.resolve()
    print(f"Output directory: {output_dir_abs}")
    print(f"Output directory exists: {output_dir_abs.exists()}")
    
    # Check vocabulary enrichment module
    enrichment_module = script_dir / "vocabulary_enrichment.py"
    print(f"Enrichment module: {enrichment_module}")
    print(f"Enrichment module exists: {enrichment_module.exists()}")
    
    print("=" * 50)
    
    # Summary
    all_good = (
        raw_dir_abs.exists() and
        output_dir_abs.exists() and
        enrichment_module.exists()
    )
    
    if all_good:
        print("✅ All paths verified successfully!")
        print("Ready to run HSK vocabulary processor.")
    else:
        print("❌ Some paths are missing. Please check the directory structure.")
        return False
    
    return True

if __name__ == "__main__":
    verify_data_paths()
