# Scripts for Vietnamese-Chinese Learning Project

This folder contains utility scripts for processing and managing vocabulary data.

## Files Overview

- `extract_simplified_words.py` - Main extraction script
- `run_extraction.bat` - Windows batch file to run the script easily
- `README.md` - This documentation file
- `data/raw/1.json` - Input HSK vocabulary data
- `output/` - Generated output files

## extract_simplified_words.py

Enhanced script that extracts simplified Chinese characters from HSK vocabulary JSON files with detailed analysis.

### Features

- ✅ Extracts all simplified Chinese characters
- 📊 Provides detailed statistics and analysis
- 📁 Creates multiple output formats (JSON, TXT, CSV)
- 🔍 Character frequency analysis
- 📏 Word length distribution
- 🎯 Single character vs compound word breakdown

### Usage

**Option 1: Run with Python directly**
```bash
cd scripts
python extract_simplified_words.py
```

**Option 2: Use the batch file (Windows)**
```bash
cd scripts
run_extraction.bat
```

### Input Format

The script expects a JSON file at `scripts/data/raw/1.json` with the following structure:

```json
[
  {
    "simplified": "爱",
    "radical": "爫",
    "frequency": 130,
    "pos": ["v", "vn", "b"],
    "forms": [...]
  },
  ...
]
```

### Output Files

The script generates several output files in the `scripts/output/` directory:

1. **`simplified_words_complete.json`** - Complete extraction with statistics
2. **`simplified_words.txt`** - Simple text file with one word per line
3. **`word_analysis.csv`** - CSV file with word analysis data

### Sample Output Structure

```json
{
  "total_count": 5000,
  "simplified_words": ["爱", "爱好", "八", ...],
  "statistics": {
    "single_character_count": 1200,
    "compound_word_count": 3800,
    "word_length_distribution": {
      "1": 1200,
      "2": 3500,
      "3": 280,
      "4": 20
    },
    "most_common_characters": [["的", 45], ["一", 38], ...],
    "unique_characters_used": 2800
  },
  "source_file": "1.json",
  "extraction_info": {
    "description": "Simplified Chinese characters extracted from HSK vocabulary",
    "format": "List of simplified Chinese characters only",
    "extraction_script": "extract_simplified_words.py",
    "extraction_date": "2025-01-27"
  }
}
```

### Statistics Provided

- **Total word count**: Number of vocabulary entries
- **Single characters vs compound words**: Breakdown by word type
- **Word length distribution**: How many words of each length
- **Character frequency**: Most commonly used characters
- **Unique characters**: Total number of different characters used

## Requirements

- Python 3.6+
- No external dependencies (uses only standard library)

## File Structure

```
scripts/
├── extract_simplified_words.py    # Main extraction script
├── run_extraction.bat            # Windows batch runner
├── README.md                     # This documentation
├── data/
│   └── raw/
│       └── 1.json               # Input HSK vocabulary data
└── output/
    ├── simplified_words_complete.json  # Complete extraction (generated)
    ├── simplified_words.txt           # Text list (generated)
    ├── word_analysis.csv              # Analysis data (generated)
    └── simplified_words_sample.json   # Sample extraction
```

## Troubleshooting

**File not found error**: Make sure `1.json` exists in `scripts/data/raw/`

**Python not found**: Install Python 3.6+ and add it to your PATH

**Permission errors**: Run as administrator if needed

**JSON parsing errors**: Check that the input file is valid JSON

## Example Usage

```bash
# Navigate to the scripts directory
cd C:\Users\TY_Windows\Documents\Development\vietnamese-chinese-learning\scripts

# Run the extraction
python extract_simplified_words.py

# Expected output:
# HSK Vocabulary Simplified Words Extractor
# ==================================================
# Reading from: ...\scripts\data\raw\1.json
# Total words found: 5000
# Single characters: 1200
# Compound words: 3800
# 
# 📊 Word Statistics:
#    Single characters: 1200
#    Compound words: 3800
#    Unique characters used: 2800
#    Average word length: 1.82
# 
# ✅ Extraction completed successfully!
```

This enhanced script provides comprehensive analysis of the HSK vocabulary data while extracting the simplified Chinese characters you need for your Vietnamese-Chinese learning application.
