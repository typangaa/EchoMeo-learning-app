#!/usr/bin/env python3
\"\"\"
Quick test to verify the integrated duplicate analysis functionality.
This script tests the main analyzer with a small sample to ensure duplicate detection works.
\"\"\"

import sys
import json
from pathlib import Path

# Add the current directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from main_vietnamese_analyzer import (
    categorize_words_by_frequency,
    find_duplicates_in_levels,
    perform_duplicate_analysis
)

def test_duplicate_detection():
    \"\"\"Test the duplicate detection functionality with sample data.\"\"\"
    
    print(\"🧪 Testing Integrated Duplicate Analysis Functionality\")
    print(\"=\" * 55)
    
    # Create sample vocabulary data with known duplicates
    sample_vocabulary = [
        # A1 Level duplicates
        {\"vietnamese\": \"tôi\", \"frequency\": 95, \"pos\": [\"pronoun\"]},
        {\"vietnamese\": \"tôi\", \"frequency\": 94, \"pos\": [\"pronoun\"]},  # Duplicate
        {\"vietnamese\": \"bạn\", \"frequency\": 92, \"pos\": [\"pronoun\"]},
        {\"vietnamese\": \"cảm ơn\", \"frequency\": 90, \"pos\": [\"interjection\"]},
        {\"vietnamese\": \"cảm ơn\", \"frequency\": 89, \"pos\": [\"interjection\"]},  # Duplicate
        
        # A2 Level with cross-level duplicates
        {\"vietnamese\": \"học\", \"frequency\": 70, \"pos\": [\"verb\"]},
        {\"vietnamese\": \"tôi\", \"frequency\": 76, \"pos\": [\"pronoun\"]},  # Cross-level duplicate
        {\"vietnamese\": \"nhà\", \"frequency\": 74, \"pos\": [\"noun\"]},
        
        # B1 Level
        {\"vietnamese\": \"giáo viên\", \"frequency\": 58, \"pos\": [\"noun\"]},
        {\"vietnamese\": \"học\", \"frequency\": 50, \"pos\": [\"verb\"]},  # Cross-level duplicate
        {\"vietnamese\": \"giáo viên\", \"frequency\": 56, \"pos\": [\"noun\"]},  # Duplicate
    ]
    
    # Test frequency categorization
    print(\"\\n1. Testing frequency categorization...\")
    level_words = categorize_words_by_frequency(sample_vocabulary)
    
    for level, words in level_words.items():
        word_list = [w['word'] for w in words]
        print(f\"   Level {level}: {len(words)} words - {word_list}\")
    
    # Test duplicate detection
    print(\"\\n2. Testing duplicate detection...\")
    within_level_duplicates, cross_level_duplicates = find_duplicates_in_levels(level_words)
    
    print(\"   Within-level duplicates:\")
    for level, duplicates in within_level_duplicates.items():
        for dup in duplicates:
            print(f\"     Level {level}: '{dup['word']}' appears {dup['count']} times\")
    
    print(\"   Cross-level duplicates:\")
    for word, levels in cross_level_duplicates.items():
        print(f\"     '{word}' appears in levels: {', '.join(levels)}\")
    
    # Test the full analysis structure
    print(\"\\n3. Testing full analysis structure...\")
    
    # Create a mock analysis structure
    mock_analysis = {
        'vocabulary_items': sample_vocabulary,
        'total_vocabulary': len(sample_vocabulary)
    }
    
    # Create a temporary output directory
    import tempfile
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # Test the integrated analysis function
        duplicate_analysis = perform_duplicate_analysis(mock_analysis, temp_path)
        
        print(\"   Analysis summary:\")
        summary = duplicate_analysis.get('summary', {})
        print(f\"     Total within-level duplicates: {summary.get('total_within_level_duplicates', 0)}\")
        print(f\"     Total cross-level duplicates: {summary.get('total_cross_level_duplicates', 0)}\")
        print(f\"     Total unique duplicate words: {summary.get('total_unique_duplicate_words', 0)}\")
        
        # Check if files were generated
        print(f\"\\n   Generated files: {len(duplicate_analysis.get('generated_files', []))}\")
        for file_path in duplicate_analysis.get('generated_files', [])[:3]:  # Show first 3
            file_name = Path(file_path).name
            exists = Path(file_path).exists()
            print(f\"     - {file_name}: {'✅ Created' if exists else '❌ Missing'}\")
    
    print(\"\\n✅ Duplicate analysis integration test completed!\")
    print(\"\\n🎯 Expected Results:\")
    print(\"   - Within-level duplicates: 'tôi', 'cảm ơn', 'giáo viên'\")
    print(\"   - Cross-level duplicates: 'tôi', 'học'\")
    print(\"   - Generated files: 6 level reports + 1 master report\")

if __name__ == \"__main__\":
    test_duplicate_detection()
