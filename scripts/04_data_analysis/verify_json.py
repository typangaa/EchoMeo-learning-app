#!/usr/bin/env python3
"""
Quick verification script to check the HSK JSON file structure and count entries.
"""

import json
import os
from pathlib import Path

def verify_json_file(file_path):
    """Verify the JSON file structure and provide basic info."""
    
    try:
        print(f"📁 Checking file: {file_path}")
        
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}")
            return False
        
        # Check file size
        file_size = os.path.getsize(file_path)
        print(f"📊 File size: {file_size:,} bytes ({file_size/1024/1024:.2f} MB)")
        
        # Read and parse JSON
        print("🔄 Reading JSON file...")
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            print(f"❌ Expected array, got {type(data)}")
            return False
        
        total_entries = len(data)
        print(f"✅ Successfully parsed JSON with {total_entries:,} entries")
        
        # Check first few entries
        print("\n🔍 Analyzing entry structure...")
        valid_entries = 0
        invalid_entries = 0
        sample_entries = []
        
        for i, entry in enumerate(data[:5]):  # Check first 5 entries
            if isinstance(entry, dict) and 'simplified' in entry:
                valid_entries += 1
                sample_entries.append(entry['simplified'])
                
                # Show structure of first entry
                if i == 0:
                    print(f"📋 First entry structure:")
                    for key in entry.keys():
                        if key == 'forms' and isinstance(entry[key], list):
                            print(f"   • {key}: [{len(entry[key])} items]")
                        else:
                            print(f"   • {key}: {type(entry[key]).__name__}")
            else:
                invalid_entries += 1
        
        print(f"\n📈 Sample validation (first 5 entries):")
        print(f"   Valid entries: {valid_entries}")
        print(f"   Invalid entries: {invalid_entries}")
        
        if sample_entries:
            print(f"   Sample words: {', '.join(sample_entries)}")
        
        # Quick full validation
        print(f"\n🔄 Quick validation of all {total_entries:,} entries...")
        simplified_count = 0
        for entry in data:
            if isinstance(entry, dict) and 'simplified' in entry:
                simplified_count += 1
        
        print(f"✅ Entries with 'simplified' field: {simplified_count:,}")
        print(f"⚠️  Entries missing 'simplified': {total_entries - simplified_count:,}")
        
        success_rate = (simplified_count / total_entries) * 100 if total_entries > 0 else 0
        print(f"📊 Success rate: {success_rate:.1f}%")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main verification function."""
    
    print("HSK JSON File Verification Tool")
    print("=" * 40)
    
    script_dir = Path(__file__).parent
    json_file = script_dir / "data" / "raw" / "1.json"
    
    success = verify_json_file(str(json_file))
    
    print("\n" + "=" * 40)
    if success:
        print("🎉 File verification completed successfully!")
        print("   The file appears to be ready for processing.")
    else:
        print("⚠️  File verification failed!")
        print("   Please check the file format and try again.")

if __name__ == "__main__":
    main()
