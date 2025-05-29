#!/usr/bin/env python
"""
Vietnamese Vocabulary Validator

This script validates the generated Vietnamese vocabulary files to ensure:
1. JSON structure is correct
2. Required fields are present
3. Data quality meets expectations
4. Frequency estimates are reasonable
5. Etymology classifications are appropriate
"""

import json
import os
import sys
from typing import Dict, List, Any, Tuple

def validate_vietnamese_entry(entry: Dict[str, Any], entry_index: int) -> List[str]:
    """
    Validate a single Vietnamese vocabulary entry.
    
    Args:
        entry: Vietnamese vocabulary entry to validate
        entry_index: Index of the entry in the file
        
    Returns:
        List of validation errors (empty if valid)
    """
    errors = []
    
    # Check required top-level fields
    required_fields = ["vietnamese", "syllables", "frequency", "pos", "etymology", "related_forms", "forms"]
    for field in required_fields:
        if field not in entry:
            errors.append(f"Entry {entry_index}: Missing required field '{field}'")
    
    # Validate vietnamese field
    if "vietnamese" in entry:
        if not isinstance(entry["vietnamese"], str) or not entry["vietnamese"].strip():
            errors.append(f"Entry {entry_index}: 'vietnamese' must be a non-empty string")
        elif entry["vietnamese"].startswith("[FAILED:"):
            errors.append(f"Entry {entry_index}: Failed generation detected: {entry['vietnamese']}")
    
    # Validate syllables
    if "syllables" in entry:
        if not isinstance(entry["syllables"], list):
            errors.append(f"Entry {entry_index}: 'syllables' must be a list")
        elif len(entry["syllables"]) == 0:
            errors.append(f"Entry {entry_index}: 'syllables' cannot be empty")
    
    # Validate frequency
    if "frequency" in entry:
        if not isinstance(entry["frequency"], (int, float)):
            errors.append(f"Entry {entry_index}: 'frequency' must be a number")
        elif entry["frequency"] < 1:
            errors.append(f"Entry {entry_index}: 'frequency' must be >= 1")
        elif entry["frequency"] > 10000:
            errors.append(f"Entry {entry_index}: 'frequency' seems unreasonably high (>10000)")
    
    # Validate pos (parts of speech)
    if "pos" in entry:
        if not isinstance(entry["pos"], list):
            errors.append(f"Entry {entry_index}: 'pos' must be a list")
        elif len(entry["pos"]) == 0:
            errors.append(f"Entry {entry_index}: 'pos' cannot be empty")
        else:
            valid_pos = ["n", "v", "adj", "adv", "prep", "conj", "intj", "num", "pron", "part", "aux"]
            for pos in entry["pos"]:
                if pos not in valid_pos:
                    errors.append(f"Entry {entry_index}: Unknown part of speech '{pos}'")
    
    # Validate etymology
    if "etymology" in entry:
        etym = entry["etymology"]
        if not isinstance(etym, dict):
            errors.append(f"Entry {entry_index}: 'etymology' must be a dictionary")
        else:
            required_etym_fields = ["origin", "source_language", "chu_nom", "notes"]
            for field in required_etym_fields:
                if field not in etym:
                    errors.append(f"Entry {entry_index}: Missing etymology field '{field}'")
            
            if "origin" in etym:
                valid_origins = ["native_vietnamese", "sino_vietnamese", "french_loanword", "khmer_loanword", "cham_loanword", "unknown"]
                if etym["origin"] not in valid_origins:
                    errors.append(f"Entry {entry_index}: Invalid etymology origin '{etym['origin']}'")
            
            if "chu_nom" in etym:
                chu_nom = etym["chu_nom"]
                if chu_nom not in ["null", "unknown"] and not isinstance(chu_nom, str):
                    errors.append(f"Entry {entry_index}: 'chu_nom' must be a string, 'null', or 'unknown'")
    
    # Validate related_forms
    if "related_forms" in entry:
        related_forms = entry["related_forms"]
        if not isinstance(related_forms, list):
            errors.append(f"Entry {entry_index}: 'related_forms' must be a list")
        else:
            for rf_index, related_form in enumerate(related_forms):
                if not isinstance(related_form, dict):
                    errors.append(f"Entry {entry_index}, Related Form {rf_index}: Must be a dictionary")
                    continue
                
                # Check required related form fields
                required_rf_fields = ["form", "type", "usage", "etymology", "usage_examples"]
                for field in required_rf_fields:
                    if field not in related_form:
                        errors.append(f"Entry {entry_index}, Related Form {rf_index}: Missing field '{field}'")
                
                # Validate type
                if "type" in related_form:
                    valid_types = ["sino_vietnamese_equivalent", "regional_variant", "archaic_form", "formal_variant"]
                    if related_form["type"] not in valid_types:
                        errors.append(f"Entry {entry_index}, Related Form {rf_index}: Invalid type '{related_form['type']}'")
                
                # Validate usage
                if "usage" in related_form:
                    valid_usage = ["formal_literary", "colloquial", "regional", "archaic"]
                    if related_form["usage"] not in valid_usage:
                        errors.append(f"Entry {entry_index}, Related Form {rf_index}: Invalid usage '{related_form['usage']}'")
                
                # Validate etymology in related form
                if "etymology" in related_form:
                    rf_etym = related_form["etymology"]
                    if not isinstance(rf_etym, dict):
                        errors.append(f"Entry {entry_index}, Related Form {rf_index}: 'etymology' must be a dictionary")
                    else:
                        required_rf_etym_fields = ["origin", "source_language", "chu_nom", "notes"]
                        for field in required_rf_etym_fields:
                            if field not in rf_etym:
                                errors.append(f"Entry {entry_index}, Related Form {rf_index}: Missing etymology field '{field}'")
                
                # Validate usage_examples
                if "usage_examples" in related_form:
                    examples = related_form["usage_examples"]
                    if not isinstance(examples, list):
                        errors.append(f"Entry {entry_index}, Related Form {rf_index}: 'usage_examples' must be a list")
    
    # Validate forms
    if "forms" in entry:
        forms = entry["forms"]
        if not isinstance(forms, list):
            errors.append(f"Entry {entry_index}: 'forms' must be a list")
        elif len(forms) == 0:
            errors.append(f"Entry {entry_index}: 'forms' cannot be empty")
        else:
            for form_index, form in enumerate(forms):
                if not isinstance(form, dict):
                    errors.append(f"Entry {entry_index}, Form {form_index}: Must be a dictionary")
                    continue
                
                # Check required form fields
                required_form_fields = ["standard", "transcriptions", "regional_variants", "meanings", "register", "formality_level"]
                for field in required_form_fields:
                    if field not in form:
                        errors.append(f"Entry {entry_index}, Form {form_index}: Missing field '{field}'")
                
                # Validate transcriptions
                if "transcriptions" in form:
                    trans = form["transcriptions"]
                    if not isinstance(trans, dict):
                        errors.append(f"Entry {entry_index}, Form {form_index}: 'transcriptions' must be a dictionary")
                    else:
                        required_trans_fields = ["ipa", "simplified_pronunciation", "tone_pattern"]
                        for field in required_trans_fields:
                            if field not in trans:
                                errors.append(f"Entry {entry_index}, Form {form_index}: Missing transcription field '{field}'")
                
                # Validate regional_variants
                if "regional_variants" in form:
                    variants = form["regional_variants"]
                    if not isinstance(variants, dict):
                        errors.append(f"Entry {entry_index}, Form {form_index}: 'regional_variants' must be a dictionary")
                    else:
                        required_regions = ["northern", "central", "southern"]
                        for region in required_regions:
                            if region not in variants:
                                errors.append(f"Entry {entry_index}, Form {form_index}: Missing regional variant '{region}'")
                
                # Validate meanings
                if "meanings" in form:
                    meanings = form["meanings"]
                    if not isinstance(meanings, list):
                        errors.append(f"Entry {entry_index}, Form {form_index}: 'meanings' must be a list")
                    elif len(meanings) == 0:
                        errors.append(f"Entry {entry_index}, Form {form_index}: 'meanings' cannot be empty")
                
                # Validate register
                if "register" in form:
                    valid_registers = ["formal", "informal", "neutral", "literary", "colloquial"]
                    if form["register"] not in valid_registers:
                        errors.append(f"Entry {entry_index}, Form {form_index}: Invalid register '{form['register']}'")
                
                # Validate formality_level
                if "formality_level" in form:
                    valid_formality = ["polite", "casual", "respectful", "intimate"]
                    if form["formality_level"] not in valid_formality:
                        errors.append(f"Entry {entry_index}, Form {form_index}: Invalid formality level '{form['formality_level']}'")
    
    return errors

def analyze_frequency_distribution(entries: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Analyze the frequency distribution of the vocabulary entries."""
    frequencies = [entry.get("frequency", 0) for entry in entries]
    
    if not frequencies:
        return {"error": "No frequency data found"}
    
    frequencies.sort()
    
    analysis = {
        "total_entries": len(frequencies),
        "min_frequency": min(frequencies),
        "max_frequency": max(frequencies),
        "median_frequency": frequencies[len(frequencies)//2],
        "very_common": sum(1 for f in frequencies if 1 <= f <= 50),
        "common": sum(1 for f in frequencies if 51 <= f <= 200),
        "moderate": sum(1 for f in frequencies if 201 <= f <= 500),
        "less_common": sum(1 for f in frequencies if 501 <= f <= 1000),
        "rare": sum(1 for f in frequencies if f > 1000),
        "invalid": sum(1 for f in frequencies if f < 1)
    }
    
    return analysis

def analyze_etymology_distribution(entries: List[Dict[str, Any]]) -> Dict[str, int]:
    """Analyze the etymology distribution of the vocabulary entries."""
    etymology_counts = {}
    
    for entry in entries:
        origin = entry.get("etymology", {}).get("origin", "unknown")
        etymology_counts[origin] = etymology_counts.get(origin, 0) + 1
    
    return etymology_counts

def validate_vietnamese_file(file_path: str) -> Tuple[bool, Dict[str, Any]]:
    """
    Validate a Vietnamese vocabulary JSON file.
    
    Args:
        file_path: Path to the Vietnamese vocabulary file
        
    Returns:
        Tuple of (is_valid, validation_report)
    """
    report = {
        "file_path": file_path,
        "is_valid": False,
        "errors": [],
        "warnings": [],
        "statistics": {}
    }
    
    try:
        # Load and parse JSON
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            report["errors"].append("Root element must be a list")
            return False, report
        
        if len(data) == 0:
            report["warnings"].append("File contains no vocabulary entries")
            return True, report
        
        # Validate each entry
        all_errors = []
        for i, entry in enumerate(data):
            entry_errors = validate_vietnamese_entry(entry, i)
            all_errors.extend(entry_errors)
        
        report["errors"] = all_errors
        
        # Generate statistics
        report["statistics"] = {
            "total_entries": len(data),
            "frequency_analysis": analyze_frequency_distribution(data),
            "etymology_analysis": analyze_etymology_distribution(data),
            "failed_generations": sum(1 for entry in data if entry.get("vietnamese", "").startswith("[FAILED:")),
            "avg_meanings_per_entry": sum(len(entry.get("forms", [{}])[0].get("meanings", [])) for entry in data) / len(data) if data else 0
        }
        
        # Determine if valid
        report["is_valid"] = len(all_errors) == 0
        
        # Add warnings for quality issues
        freq_analysis = report["statistics"]["frequency_analysis"]
        if isinstance(freq_analysis, dict) and freq_analysis.get("invalid", 0) > 0:
            report["warnings"].append(f"{freq_analysis['invalid']} entries have invalid frequency values")
        
        if report["statistics"]["failed_generations"] > 0:
            report["warnings"].append(f"{report['statistics']['failed_generations']} entries failed to generate properly")
        
        return report["is_valid"], report
    
    except json.JSONDecodeError as e:
        report["errors"].append(f"JSON parsing error: {e}")
        return False, report
    except FileNotFoundError:
        report["errors"].append("File not found")
        return False, report
    except Exception as e:
        report["errors"].append(f"Unexpected error: {e}")
        return False, report

def validate_directory(directory_path: str) -> Dict[str, Any]:
    """Validate all Vietnamese vocabulary files in a directory."""
    summary = {
        "directory": directory_path,
        "files_checked": 0,
        "files_valid": 0,
        "files_invalid": 0,
        "total_errors": 0,
        "total_warnings": 0,
        "file_reports": {}
    }
    
    if not os.path.exists(directory_path):
        print(f"❌ Directory not found: {directory_path}")
        return summary
    
    # Find Vietnamese vocabulary files
    vietnamese_files = [f for f in os.listdir(directory_path) if f.startswith("vietnamese_raw_") and f.endswith(".json")]
    
    if not vietnamese_files:
        print(f"⚠️  No Vietnamese vocabulary files found in {directory_path}")
        return summary
    
    vietnamese_files.sort()  # Process in order
    
    print(f"🔍 Validating {len(vietnamese_files)} Vietnamese vocabulary files...")
    
    for filename in vietnamese_files:
        file_path = os.path.join(directory_path, filename)
        print(f"\n--- Validating {filename} ---")
        
        is_valid, report = validate_vietnamese_file(file_path)
        
        summary["files_checked"] += 1
        summary["file_reports"][filename] = report
        summary["total_errors"] += len(report["errors"])
        summary["total_warnings"] += len(report["warnings"])
        
        if is_valid:
            summary["files_valid"] += 1
            print(f"✅ Valid - {report['statistics']['total_entries']} entries")
        else:
            summary["files_invalid"] += 1
            print(f"❌ Invalid - {len(report['errors'])} errors")
        
        # Show key statistics
        if "statistics" in report:
            stats = report["statistics"]
            if "frequency_analysis" in stats and isinstance(stats["frequency_analysis"], dict):
                freq = stats["frequency_analysis"]
                print(f"   📊 Frequency distribution: Very common: {freq.get('very_common', 0)}, Common: {freq.get('common', 0)}, Moderate: {freq.get('moderate', 0)}")
            
            if "etymology_analysis" in stats:
                etym = stats["etymology_analysis"]
                print(f"   🏺 Etymology: Sino-Vietnamese: {etym.get('sino_vietnamese', 0)}, Native: {etym.get('native_vietnamese', 0)}, Unknown: {etym.get('unknown', 0)}")
            
            if stats.get("failed_generations", 0) > 0:
                print(f"   ⚠️  Failed generations: {stats['failed_generations']}")
        
        # Show first few errors if any
        if report["errors"]:
            print("   📝 Sample errors:")
            for error in report["errors"][:3]:
                print(f"      - {error}")
            if len(report["errors"]) > 3:
                print(f"      ... and {len(report['errors']) - 3} more errors")
    
    return summary

def main():
    """Main validation function."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Validate Vietnamese Vocabulary Files')
    parser.add_argument('--directory', type=str, default='data/vietnamese_generated',
                       help='Directory containing Vietnamese vocabulary files')
    parser.add_argument('--file', type=str, help='Specific file to validate')
    parser.add_argument('--summary-only', action='store_true', help='Show only summary statistics')
    args = parser.parse_args()
    
    print("🔍 Vietnamese Vocabulary Validator")
    print("=" * 50)
    
    if args.file:
        # Validate single file
        print(f"Validating single file: {args.file}")
        is_valid, report = validate_vietnamese_file(args.file)
        
        if is_valid:
            print("✅ File is valid!")
        else:
            print("❌ File has validation errors:")
            for error in report["errors"]:
                print(f"   - {error}")
        
        if not args.summary_only:
            print(f"\n📊 Statistics: {json.dumps(report['statistics'], indent=2)}")
    
    else:
        # Validate directory
        summary = validate_directory(args.directory)
        
        print(f"\n📊 Validation Summary:")
        print(f"   Files checked: {summary['files_checked']}")
        print(f"   Valid files: {summary['files_valid']}")
        print(f"   Invalid files: {summary['files_invalid']}")
        print(f"   Total errors: {summary['total_errors']}")
        print(f"   Total warnings: {summary['total_warnings']}")
        
        if summary['files_invalid'] == 0:
            print("🎉 All files are valid!")
        else:
            print("⚠️  Some files have validation issues. Check the details above.")

if __name__ == "__main__":
    main()
