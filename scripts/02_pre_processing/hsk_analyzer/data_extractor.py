#!/usr/bin/env python3
"""
Data extraction module for HSK vocabulary analysis.
Handles loading and processing of JSON files from exclusive and inclusive datasets.
Updated for specific Windows path structure.
"""

import json
import os
from pathlib import Path
from collections import Counter, defaultdict

def extract_from_single_file(file_path, hsk_level):
    """
    Extract simplified characters from a single HSK level file.
    
    Args:
        file_path (str): Path to the JSON file
        hsk_level (int): HSK level number
        
    Returns:
        dict: Extraction results with words and metadata
    """
    result = {
        'hsk_level': hsk_level,
        'file_path': file_path,
        'simplified_words': [],
        'total_count': 0,
        'success': False,
        'error': None
    }
    
    try:
        if not os.path.exists(file_path):
            result['error'] = f"File not found: {file_path}"
            return result
            
        print(f"📖 Processing HSK {hsk_level}: {os.path.basename(file_path)}")
        
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        if not isinstance(data, list):
            result['error'] = f"Expected array, got {type(data)}"
            return result
        
        simplified_words = []
        valid_entries = 0
        
        for entry in data:
            if isinstance(entry, dict) and 'simplified' in entry:
                simplified_words.append(entry['simplified'])
                valid_entries += 1
        
        result['simplified_words'] = simplified_words
        result['total_count'] = len(simplified_words)
        result['valid_entries'] = valid_entries
        result['total_entries'] = len(data)
        result['success'] = True
        
        print(f"   ✅ {result['total_count']} words extracted from {result['total_entries']} entries")
        
        return result
        
    except json.JSONDecodeError as e:
        result['error'] = f"JSON parsing error: {e}"
        return result
    except UnicodeDecodeError as e:
        result['error'] = f"Unicode encoding error: {e}. Try saving the file as UTF-8."
        return result
    except Exception as e:
        result['error'] = f"Error: {e}"
        return result

def process_dataset(data_dir, dataset_name):
    """
    Process all HSK levels for a specific dataset (exclusive or inclusive).
    
    Args:
        data_dir (Path): Path to the dataset directory
        dataset_name (str): Name of the dataset ('exclusive' or 'inclusive')
        
    Returns:
        list: List of extraction results for all HSK levels
    """
    print(f"\n🎯 Processing {dataset_name.upper()} dataset from: {data_dir}")
    
    all_results = []
    
    for hsk_level in range(1, 8):  # HSK 1 through 7
        file_path = data_dir / f"{hsk_level}.json"
        
        # Debug: Print the exact file path being checked
        print(f"   🔍 Looking for: {file_path}")
        
        result = extract_from_single_file(str(file_path), hsk_level)
        result['dataset'] = dataset_name
        all_results.append(result)
    
    successful_results = [r for r in all_results if r['success']]
    failed_results = [r for r in all_results if not r['success']]
    
    print(f"   📊 {dataset_name.upper()} dataset summary:")
    print(f"      ✅ Successfully processed: {len(successful_results)}/7 files")
    
    if failed_results:
        print(f"      ❌ Failed files:")
        for result in failed_results:
            print(f"         HSK {result['hsk_level']}: {result['error']}")
    
    return all_results

def get_dataset_paths(base_scripts_dir):
    """
    Get paths to exclusive and inclusive datasets.
    Updated for the specific Windows path structure.
    
    Args:
        base_scripts_dir (Path): Base scripts directory
        
    Returns:
        tuple: (exclusive_path, inclusive_path)
    """
    # For your specific path structure:
    # C:\Users\TY_Windows\Documents\Development\vietnamese-chinese-learning\scripts\data\raw\exclusive
    # C:\Users\TY_Windows\Documents\Development\vietnamese-chinese-learning\scripts\data\raw\inclusive
    
    data_dir = base_scripts_dir / "data" / "raw"
    exclusive_dir = data_dir / "exclusive"
    inclusive_dir = data_dir / "inclusive"
    
    return exclusive_dir, inclusive_dir

def validate_data_structure(base_scripts_dir):
    """
    Validate the data directory structure and files.
    
    Args:
        base_scripts_dir (Path): Base scripts directory
        
    Returns:
        dict: Validation results
    """
    exclusive_dir, inclusive_dir = get_dataset_paths(base_scripts_dir)
    
    validation_result = {
        'valid': True,
        'errors': [],
        'warnings': [],
        'exclusive_files': {},
        'inclusive_files': {}
    }
    
    # Check if main directories exist
    if not exclusive_dir.exists():
        validation_result['valid'] = False
        validation_result['errors'].append(f"Exclusive directory not found: {exclusive_dir}")
    
    if not inclusive_dir.exists():
        validation_result['valid'] = False
        validation_result['errors'].append(f"Inclusive directory not found: {inclusive_dir}")
    
    # If both directories are missing, that's a critical error
    if not exclusive_dir.exists() and not inclusive_dir.exists():
        validation_result['errors'].append(f"Data directory not found: {base_scripts_dir / 'data' / 'raw'}")
        return validation_result
    
    # Check individual HSK files
    for level in range(1, 8):
        # Check exclusive files
        if exclusive_dir.exists():
            exclusive_file = exclusive_dir / f"{level}.json"
            if exclusive_file.exists():
                validation_result['exclusive_files'][level] = {
                    'exists': True,
                    'path': str(exclusive_file),
                    'size': exclusive_file.stat().st_size
                }
            else:
                validation_result['exclusive_files'][level] = {
                    'exists': False,
                    'path': str(exclusive_file)
                }
                validation_result['warnings'].append(f"Missing exclusive HSK {level}: {exclusive_file}")
        
        # Check inclusive files
        if inclusive_dir.exists():
            inclusive_file = inclusive_dir / f"{level}.json"
            if inclusive_file.exists():
                validation_result['inclusive_files'][level] = {
                    'exists': True,
                    'path': str(inclusive_file),
                    'size': inclusive_file.stat().st_size
                }
            else:
                validation_result['inclusive_files'][level] = {
                    'exists': False,
                    'path': str(inclusive_file)
                }
                validation_result['warnings'].append(f"Missing inclusive HSK {level}: {inclusive_file}")
    
    # Set validation to valid if we have at least some files
    exclusive_files_exist = sum(1 for level, info in validation_result['exclusive_files'].items() if info.get('exists', False))
    inclusive_files_exist = sum(1 for level, info in validation_result['inclusive_files'].items() if info.get('exists', False))
    
    if exclusive_files_exist == 0 and inclusive_files_exist == 0:
        validation_result['valid'] = False
        validation_result['errors'].append("No HSK JSON files found in either dataset")
    
    return validation_result

def print_data_structure_info(base_scripts_dir):
    """
    Print detailed information about the data structure.
    
    Args:
        base_scripts_dir (Path): Base scripts directory
    """
    print("\n📁 DATA STRUCTURE INFORMATION:")
    print("=" * 50)
    
    validation = validate_data_structure(base_scripts_dir)
    
    print(f"Base directory: {base_scripts_dir}")
    
    exclusive_dir, inclusive_dir = get_dataset_paths(base_scripts_dir)
    print(f"Exclusive data: {exclusive_dir} {'✅' if exclusive_dir.exists() else '❌'}")
    print(f"Inclusive data: {inclusive_dir} {'✅' if inclusive_dir.exists() else '❌'}")
    
    print(f"\n📊 File Status Summary:")
    exclusive_count = sum(1 for level, info in validation['exclusive_files'].items() if info.get('exists', False))
    inclusive_count = sum(1 for level, info in validation['inclusive_files'].items() if info.get('exists', False))
    
    print(f"   Exclusive files found: {exclusive_count}/7")
    print(f"   Inclusive files found: {inclusive_count}/7")
    
    # Show detailed file information
    if exclusive_count > 0:
        print(f"\n   📂 Exclusive files:")
        for level in range(1, 8):
            info = validation['exclusive_files'].get(level, {})
            if info.get('exists', False):
                size_kb = info['size'] / 1024
                print(f"      HSK {level}: ✅ ({size_kb:.1f} KB)")
            else:
                print(f"      HSK {level}: ❌")
    
    if inclusive_count > 0:
        print(f"\n   📂 Inclusive files:")
        for level in range(1, 8):
            info = validation['inclusive_files'].get(level, {})
            if info.get('exists', False):
                size_kb = info['size'] / 1024
                print(f"      HSK {level}: ✅ ({size_kb:.1f} KB)")
            else:
                print(f"      HSK {level}: ❌")
    
    if validation['errors']:
        print(f"\n❌ ERRORS:")
        for error in validation['errors']:
            print(f"   • {error}")
    
    if validation['warnings']:
        print(f"\n⚠️  WARNINGS:")
        for warning in validation['warnings']:
            print(f"   • {warning}")
    
    if validation['valid'] and not validation['warnings']:
        print("\n✅ Data structure validation passed!")
    elif validation['valid']:
        print("\n⚠️  Data structure has warnings but can proceed")
    else:
        print("\n❌ Data structure validation failed!")
    
    return validation
