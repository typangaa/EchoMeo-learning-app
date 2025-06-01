# Vocabulary Missing Analysis Tools

This folder contains tools for analyzing gaps between raw vocabulary data and enriched vocabulary files used in the Vietnamese-Chinese learning application.

## Available Analysis Tools

### 1. HSK Vocabulary Analysis
**Script**: `find_missing_vocabulary_optimized.py`
**Purpose**: Analyzes gaps between raw HSK data and enriched HSK vocabulary files

### 2. Vietnamese Vocabulary Analysis  
**Script**: `check_vietnamese_missing_vocabulary.py`
**Purpose**: Analyzes gaps between raw Vietnamese data and enriched Vietnamese vocabulary files

## Vietnamese Vocabulary Analysis

### Purpose

The Vietnamese analysis script helps identify:
- Vietnamese words that exist in raw data (`vietnamese_raw_1.json`) but are missing from enriched vocabulary files (`vietnamese_enriched.json`)
- Extra words in enriched files that don't exist in raw data
- Categorization by frequency, part of speech, etymology, and syllable count
- Priority recommendations for vocabulary enrichment work

### Data Sources

#### Raw Vietnamese Data
- Location: `../../scripts/data/vietnamese_generated/`
- Files: `vietnamese_raw_1.json`
- Format: Original Vietnamese vocabulary data with linguistic information

#### Enriched Vietnamese Data
- Location: `../../scripts/data/enriched/vietnamese_vocabulary/`
- Files: `vietnamese_enriched.json`
- Format: Processed vocabulary with Chinese translations and examples

### Usage

#### Quick Start
1. **Run the batch file** (Windows):
   ```bash
   run_vietnamese_analysis.bat
   ```

2. **Or run directly with Python**:
   ```bash
   python check_vietnamese_missing_vocabulary.py
   ```

### Expected Data Structures

#### Raw Vietnamese Data (`vietnamese_raw_1.json`)
```json
[
  {
    "vietnamese": "yêu",
    "syllables": ["yêu"],
    "frequency": 50,
    "pos": ["v", "n"],
    "etymology": {
      "origin": "sino_vietnamese",
      "source_language": "chinese",
      "notes": "Sino-Vietnamese loanword from Chinese 爱 (ài)"
    },
    "forms": [
      {
        "standard": "yêu",
        "transcriptions": {
          "ipa": "/jøːː˧˩˧/",
          "simplified_pronunciation": "yêu (low falling tone)"
        },
        "meanings": [
          "to love; to be fond of; to like",
          "affection; fondness"
        ]
      }
    ]
  }
]
```

#### Enriched Vietnamese Data (`vietnamese_enriched.json`)
```json
[
  {
    "vietnamese": "yêu",
    "ipa": "/jøːː˧˩˧/",
    "frequency": 50,
    "etymology": {
      "origin": "sino_vietnamese",
      "source_language": "chinese"
    },
    "meanings": [
      {
        "vietnamese": "cảm thấy tình yêu ; thích thú ; quý mến",
        "chinese": "爱 ; 喜欢 ; 疼爱",
        "pinyin": "ài ; xǐhuān ; téng'ài",
        "english": "to love ; to like ; to cherish",
        "part_of_speech": "v",
        "usage_frequency": "very common",
        "examples": [
          {
            "vietnamese": "Tôi yêu gia đình.",
            "chinese": "我爱家庭。",
            "pinyin": "Wǒ ài jiātíng.",
            "english": "I love my family."
          }
        ]
      }
    ]
  }
]
```

### Output Reports

The Vietnamese analysis generates three types of reports in the `vietnamese_missing_reports/` folder:

#### 1. Text Report (`vietnamese_missing_report_YYYYMMDD_HHMMSS.txt`)
- Human-readable summary with detailed statistics
- Missing words categorized by frequency, POS, etymology, syllable count
- High-priority missing words (high frequency) listed first
- Sample of other missing words

#### 2. CSV Report (`vietnamese_missing_YYYYMMDD_HHMMSS.csv`)
- Structured data suitable for spreadsheet analysis
- Columns: Vietnamese, IPA, Frequency, POS, Etymology_Origin, Syllable_Count, Meanings
- One row per missing word

#### 3. JSON Summary (`vietnamese_analysis_summary_YYYYMMDD_HHMMSS.json`)
- Machine-readable statistics and complete word lists
- Includes categorization data for programmatic processing
- Suitable for integration with other tools

### Analysis Categories

The script categorizes missing Vietnamese words by:

1. **Frequency**:
   - Very High (80+)
   - High (60-79)
   - Medium (40-59)
   - Low (20-39)
   - Very Low (<20)

2. **Part of Speech**:
   - v (verb)
   - n (noun)
   - adj (adjective)
   - adv (adverb)
   - etc.

3. **Etymology**:
   - sino_vietnamese (Chinese loanwords)
   - native_vietnamese (indigenous words)
   - french_loanword (French borrowings)
   - english_loanword (English borrowings)
   - etc.

4. **Syllable Count**:
   - 1 syllable, 2 syllables, etc.

### Priority Recommendations

The analysis provides priority recommendations:

1. **High Priority**: High-frequency words (very_high + high frequency)
   - These should be enriched first as they're most commonly used

2. **Medium Priority**: Medium-frequency words
   - Important for comprehensive coverage

3. **Low Priority**: Low-frequency words
   - Can be enriched later for completeness

### Configuration

Modify `vietnamese_config.py` to adjust:
- Frequency thresholds for categorization
- Sample sizes for reports
- Output format preferences
- File paths (if different from standard structure)

### Integration with Main Project

This analysis helps maintain Vietnamese vocabulary quality by:
- Identifying the most important missing words to prioritize
- Providing data-driven insights for vocabulary enrichment planning
- Supporting quality assurance of the Vietnamese vocabulary database
- Helping focus translation efforts on high-impact words first

## HSK Vocabulary Analysis

### Purpose

The HSK analysis script helps identify:
- Chinese words that exist in raw HSK data but are missing from enriched HSK vocabulary files
- Completion statistics for each HSK level (1-7)
- Detailed reports for vocabulary gap analysis

### Usage

1. **Run the optimized HSK analysis**:
   ```bash
   python find_missing_vocabulary_optimized.py
   ```

2. **Or use the batch file**:
   ```bash
   run_missing_analysis_optimized.bat
   ```

### Data Sources

- **Raw HSK Data**: `../../scripts/data/raw/exclusive/` (files: `1.json` to `7.json`)
- **Enriched HSK Data**: `../../scripts/data/enriched/vocabulary/` (files: `hsk1_enriched.json` to `hsk7_enriched.json`)

## Common Troubleshooting

### File Not Found Errors
1. Ensure the correct directory structure exists
2. Check that data files are in the expected locations
3. Verify file names match the expected patterns

### Empty Results
1. Check that input JSON files are properly formatted
2. Verify data files contain the expected field names (`vietnamese`, `item`, etc.)
3. Ensure encoding is UTF-8 for all JSON files

### Performance Issues
1. The Vietnamese analysis is optimized for typical vocabulary sizes (1K-10K words)
2. For very large datasets, consider processing in batches
3. Check available disk space for report generation

## Directory Structure

```
04_data_analysis/
├── hsk_analysis/                             # HSK analysis tools
│   ├── find_missing_vocabulary_optimized.py    # HSK analysis script
│   ├── config.py                               # HSK analysis configuration
│   ├── run_missing_analysis_optimized.bat      # HSK analysis batch runner
│   └── analysis_output/                        # HSK analysis reports
│       └── missing_reports/
│           ├── missing_vocabulary_report_YYYYMMDD_HHMMSS.txt
│           ├── missing_vocabulary_YYYYMMDD_HHMMSS.csv
│           └── analysis_summary_YYYYMMDD_HHMMSS.json
├── vietnamese_analysis/                         # Vietnamese analysis tools
│   ├── check_vietnamese_missing_vocabulary.py  # Vietnamese analysis script
│   ├── vietnamese_config.py                    # Vietnamese analysis configuration
│   ├── run_vietnamese_analysis.bat             # Vietnamese analysis batch runner
│   └── analysis_output/                        # Vietnamese analysis reports
│       └── vietnamese_missing_reports/
│           ├── vietnamese_missing_report_YYYYMMDD_HHMMSS.txt
│           ├── vietnamese_missing_YYYYMMDD_HHMMSS.csv
│           └── vietnamese_analysis_summary_YYYYMMDD_HHMMSS.json
└── README.md                                   # This documentation
```

## Next Steps

After running the Vietnamese vocabulary analysis:

1. **Review the text report** for an overview of missing words and categories
2. **Use the CSV report** for detailed analysis in spreadsheet software
3. **Prioritize high-frequency missing words** for immediate enrichment
4. **Plan enrichment work** based on the categorization insights
5. **Track progress** by re-running the analysis after enrichment work

## Questions or Issues?

If you need to modify the analysis scripts:

1. **For Vietnamese analysis**: Edit `check_vietnamese_missing_vocabulary.py` and `vietnamese_config.py`
2. **For HSK analysis**: Edit `find_missing_vocabulary_optimized.py` and `config.py`
3. **For different data structures**: Modify the data loading functions in the respective scripts
4. **For different categorization**: Adjust the categorization logic and thresholds in the config files
