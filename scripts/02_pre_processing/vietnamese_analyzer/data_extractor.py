#!/usr/bin/env python3
"""
Data extraction module for Vietnamese vocabulary analysis.
Handles loading and processing of Vietnamese vocabulary JSON files.
"""

import json
import os
from pathlib import Path
from collections import Counter, defaultdict

def extract_from_single_file(file_path, file_number):
    """
    Extract and analyze vocabulary from a single Vietnamese JSON file.
    
    Args:
        file_path (str): Path to the JSON file
        file_number (int): File number for identification
        
    Returns:
        dict: Extraction results with vocabulary and metadata
    """
    result = {
        'file_number': file_number,
        'file_path': file_path,
        'vocabulary_items': [],
        'total_count': 0,
        'success': False,
        'error': None
    }
    
    try:
        if not os.path.exists(file_path):
            result['error'] = f"File not found: {file_path}"
            return result
            
        print(f"📖 Processing Vietnamese file {file_number}: {os.path.basename(file_path)}")
        
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        if not isinstance(data, list):
            result['error'] = f"Expected array, got {type(data)}"
            return result
        
        vocabulary_items = []
        valid_entries = 0
        
        for entry in data:
            if isinstance(entry, dict) and 'vietnamese' in entry:
                vocabulary_items.append(entry)
                valid_entries += 1
        
        result['vocabulary_items'] = vocabulary_items
        result['total_count'] = len(vocabulary_items)
        result['valid_entries'] = valid_entries
        result['total_entries'] = len(data)
        result['success'] = True
        
        print(f"   ✅ {result['total_count']} vocabulary items extracted from {result['total_entries']} entries")
        
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

def process_dataset(data_dir):
    """
    Process all Vietnamese vocabulary files (1-7).
    
    Args:
        data_dir (Path): Path to the dataset directory
        
    Returns:
        list: List of extraction results for all files
    """
    print(f"\n🎯 Processing Vietnamese vocabulary files from: {data_dir}")
    
    all_results = []
    
    for file_number in range(1, 8):  # Files 1 through 7
        file_path = data_dir / f"vietnamese_raw_{file_number}.json"
        
        # Debug: Print the exact file path being checked
        print(f"   🔍 Looking for: {file_path}")
        
        result = extract_from_single_file(str(file_path), file_number)
        all_results.append(result)
    
    successful_results = [r for r in all_results if r['success']]
    failed_results = [r for r in all_results if not r['success']]
    
    print(f"   📊 Vietnamese dataset summary:")
    print(f"      ✅ Successfully processed: {len(successful_results)}/7 files")
    
    if failed_results:
        print(f"      ❌ Failed files:")
        for result in failed_results:
            print(f"         File {result['file_number']}: {result['error']}")
    
    return all_results

def get_dataset_path(base_scripts_dir):
    """
    Get path to Vietnamese vocabulary dataset.
    
    Args:
        base_scripts_dir (Path): Base scripts directory
        
    Returns:
        Path: Vietnamese dataset path
    """
    # For your specific path structure:
    # C:\Users\TY_Windows\Documents\Development\vietnamese-chinese-learning\scripts\data\vietnamese_generated
    
    data_dir = base_scripts_dir / "data" / "vietnamese_generated"
    return data_dir

def validate_data_structure(base_scripts_dir):
    """
    Validate the Vietnamese data directory structure and files.
    
    Args:
        base_scripts_dir (Path): Base scripts directory
        
    Returns:
        dict: Validation results
    """
    data_dir = get_dataset_path(base_scripts_dir)
    
    validation_result = {
        'valid': True,
        'errors': [],
        'warnings': [],
        'files': {}
    }
    
    # Check if main directory exists
    if not data_dir.exists():
        validation_result['valid'] = False
        validation_result['errors'].append(f"Vietnamese data directory not found: {data_dir}")
        return validation_result
    
    # Check individual Vietnamese files
    for file_number in range(1, 8):
        file_path = data_dir / f"vietnamese_raw_{file_number}.json"
        if file_path.exists():
            validation_result['files'][file_number] = {
                'exists': True,
                'path': str(file_path),
                'size': file_path.stat().st_size
            }
        else:
            validation_result['files'][file_number] = {
                'exists': False,
                'path': str(file_path)
            }
            validation_result['warnings'].append(f"Missing Vietnamese file {file_number}: {file_path}")
    
    # Set validation to valid if we have at least some files
    files_exist = sum(1 for file_number, info in validation_result['files'].items() if info.get('exists', False))
    
    if files_exist == 0:
        validation_result['valid'] = False
        validation_result['errors'].append("No Vietnamese JSON files found in dataset")
    
    return validation_result

def print_data_structure_info(base_scripts_dir):
    """
    Print detailed information about the Vietnamese data structure.
    
    Args:
        base_scripts_dir (Path): Base scripts directory
    """
    print("\n📁 VIETNAMESE DATA STRUCTURE INFORMATION:")
    print("=" * 50)
    
    validation = validate_data_structure(base_scripts_dir)
    
    print(f"Base directory: {base_scripts_dir}")
    
    data_dir = get_dataset_path(base_scripts_dir)
    print(f"Vietnamese data: {data_dir} {'✅' if data_dir.exists() else '❌'}")
    
    print(f"\n📊 File Status Summary:")
    file_count = sum(1 for file_number, info in validation['files'].items() if info.get('exists', False))
    
    print(f"   Vietnamese files found: {file_count}/7")
    
    # Show detailed file information
    if file_count > 0:
        print(f"\n   📂 Vietnamese files:")
        for file_number in range(1, 8):
            info = validation['files'].get(file_number, {})
            if info.get('exists', False):
                size_kb = info['size'] / 1024
                print(f"      File {file_number}: ✅ ({size_kb:.1f} KB)")
            else:
                print(f"      File {file_number}: ❌")
    
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
