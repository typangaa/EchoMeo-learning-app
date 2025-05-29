# HSK Vocabulary Comprehensive Analyzer

A modularized Python tool for analyzing HSK (Hanyu Shuiping Kaoshi) vocabulary datasets. This tool processes both exclusive and inclusive HSK datasets from your Vietnamese-Chinese learning project, provides detailed analysis for each HSK level (1-7), and creates comprehensive comparisons between datasets.

## 🎯 Overview

This analyzer is part of the Vietnamese-Chinese Learning Platform project and specifically handles HSK vocabulary data processing. It extracts simplified Chinese characters from HSK JSON files, performs statistical analysis, and generates comprehensive reports for use in language learning applications.

## 📁 Project Location & Structure

```
vietnamese-chinese-learning/scripts/02_hsk_processing/hsk_analyzer/
├── main_hsk_analyzer.py          # Main execution script
├── data_extractor.py              # Data loading and extraction
├── data_analyzer.py               # Analysis algorithms
├── file_output.py                 # Output file generation
├── report_generator.py            # Report creation
├── console_output.py              # Console statistics and output
├── run_analyzer.bat               # Windows batch file for easy execution
├── test_imports.py                # Import validation script
├── __init__.py                    # Python package file
└── README.md                      # This file

Data Source:
vietnamese-chinese-learning/scripts/data/raw/
├── exclusive/                     # Exclusive HSK dataset
│   ├── 1.json → 7.json           # HSK Levels 1-7
└── inclusive/                     # Inclusive HSK dataset
    ├── 1.json → 7.json           # HSK Levels 1-7

Output Location:
vietnamese-chinese-learning/scripts/analysis_output/hsk_comprehensive/
└── hsk_analysis_YYYYMMDD_HHMMSS/  # Timestamped results
```

## 🚀 Quick Start

### Method 1: Using the Batch File (Recommended for Windows)
1. **Double-click** `run_analyzer.bat`
2. The script will automatically:
   - Validate your Python installation
   - Check data availability
   - Run the complete analysis
   - Show results location

### Method 2: Using Command Line
1. **Open Command Prompt** in the analyzer directory
2. **Run the analyzer**:
   ```cmd
   python main_hsk_analyzer.py
   ```

### Method 3: Using Python directly
```python
# From the hsk_analyzer directory
python -m main_hsk_analyzer
```

## 📋 Prerequisites

### System Requirements
- **Python 3.7+** (tested with Python 3.8+)
- **Windows** (optimized for Windows paths)
- Standard Python libraries only (no external dependencies!)

### Data Requirements
The analyzer expects HSK JSON files in this format:
```json
[
    {
        "simplified": "你好",
        "traditional": "你好", 
        "pinyin": "nǐ hǎo",
        "definitions": ["hello", "hi"]
        // ... other fields (optional)
    }
]
```

**Required Data Location:**
- `../../../data/raw/exclusive/[1-7].json`
- `../../../data/raw/inclusive/[1-7].json`

## 🔧 What the Analyzer Does

### Automatic Data Validation
- ✅ Checks for data directory existence
- ✅ Validates JSON file structure
- ✅ Reports missing files and data issues
- ✅ Continues with available data if some files are missing

### Comprehensive Analysis
- **Word Extraction**: Extracts simplified Chinese characters from both datasets
- **Statistical Analysis**: Word counts, character frequency, length distribution
- **Level Analysis**: Individual reports for each HSK level with learning insights
- **Dataset Comparison**: Side-by-side comparison between exclusive and inclusive datasets
- **Duplicate Detection**: Identifies words appearing in multiple HSK levels

### Multiple Output Formats
- **JSON Files**: For integration with your React app
- **CSV Files**: For data analysis and spreadsheet import
- **Text Files**: Human-readable summaries and word lists
- **Comparison Reports**: Dataset differences and recommendations

## 📊 Understanding the Results

After running the analyzer, you'll find timestamped results in:
`../../analysis_output/hsk_comprehensive/hsk_analysis_YYYYMMDD_HHMMSS/`

### Key Output Files

#### For App Integration (Most Important)
- **`hsk_unique_words_exclusive.json`** - Clean word list from exclusive dataset
- **`hsk_unique_words_inclusive.json`** - Clean word list from inclusive dataset
- **`hsk_level_X_exclusive_words.txt`** - Words for specific HSK levels

#### For Analysis & Research
- **`hsk_exclusive_vs_inclusive_comparison.json`** - Detailed dataset comparison
- **`hsk_comparison_summary.txt`** - Human-readable comparison
- **`level_reports/`** - Individual analysis for each HSK level

#### For Data Processing
- **`hsk_word_analysis_[dataset].csv`** - Detailed word data for Excel/analysis
- **`hsk_level_comparison.csv`** - Level-by-level comparison data

### Sample Console Output
```
HSK VOCABULARY COMPREHENSIVE ANALYZER
====================================
🔍 Validating environment...
Script running from: C:\...\hsk_analyzer
Base scripts directory: C:\...\scripts

📊 DATA STRUCTURE ANALYSIS:
   Exclusive Dataset: 7/7 files found
   Inclusive Dataset: 7/7 files found
   ✅ Both datasets available for comparison

🔄 PROCESSING EXCLUSIVE DATASET
===============================
📖 Processing HSK 1: 1.json
   ✅ 150 words extracted from 150 entries
📖 Processing HSK 2: 2.json
   ✅ 150 words extracted from 150 entries
...

📊 EXCLUSIVE DATASET ANALYSIS
============================
📈 WORD COUNT SUMMARY:
   Total words found: 5,000
   Unique words: 4,800
   Duplicate words across levels: 200
   Single characters: 1,200
   Compound words: 3,600
```

## 🎯 Integration with Vietnamese-Chinese Learning App

### For React App Development
Use these files from the analysis output:

1. **Vocabulary Data**: `hsk_unique_words_[dataset].json`
   ```json
   {
     "total_unique_words": 4800,
     "simplified_words": ["你", "好", "我", "是", ...],
     "extraction_info": { ... }
   }
   ```

2. **Level-Specific Data**: `hsk_level_X_[dataset]_words.txt`
   ```
   你
   好
   我
   是
   ...
   ```

3. **Detailed Analysis**: `hsk_all_levels_[dataset]_complete.json`
   - Complete statistics for progress tracking
   - Character frequency for learning optimization
   - Level breakdowns for difficulty grading

### Recommended Dataset Selection
The analyzer will help you choose between exclusive and inclusive datasets by providing:
- **Overlap Analysis**: How similar the datasets are
- **Coverage Comparison**: Which dataset has more comprehensive vocabulary
- **Level-by-Level Differences**: Where the datasets differ most

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### "No HSK data files found"
- **Check**: Data files exist in `../../../data/raw/exclusive/` and `../../../data/raw/inclusive/`
- **Verify**: Files are named `1.json`, `2.json`, ..., `7.json`
- **Test**: Open a JSON file to ensure it's valid JSON

#### "JSON parsing error"
- **Issue**: Invalid JSON format in data files
- **Solution**: Validate JSON files using online JSON validators
- **Check**: Ensure UTF-8 encoding for Chinese characters

#### "Python not found" (when using batch file)
- **Issue**: Python not installed or not in system PATH
- **Solution**: Install Python 3.7+ and add to PATH, or use full Python path

#### "No successful extractions"
- **Issue**: JSON files don't contain "simplified" field
- **Check**: Verify your JSON structure matches expected format
- **Debug**: Check console output for specific parsing errors

### Data Validation
The analyzer performs comprehensive validation and reports:
- ✅ File existence and accessibility
- ✅ JSON structure validation
- ✅ Required field presence ("simplified")
- ✅ Data quality metrics

## 🔄 Updating the Analyzer

### Adding New Analysis Features
1. **Analysis Functions**: Add to `data_analyzer.py`
2. **Output Generation**: Update `file_output.py`
3. **Console Reporting**: Modify `console_output.py`
4. **Integration**: Update `main_hsk_analyzer.py`

### Supporting New Data Formats
1. **Data Extraction**: Modify `data_extractor.py`
2. **Path Handling**: Update path functions for new sources
3. **Validation**: Add new validation rules

## 📈 Performance & Scalability

### Current Capabilities
- **Processing Speed**: ~1000 words/second
- **Memory Usage**: Minimal (handles datasets with 10K+ words)
- **File Size**: Efficiently processes multi-MB JSON files
- **Concurrency**: Sequential processing (reliable for Windows)

### Optimization Options
- For larger datasets (50K+ words), consider batch processing
- For frequent runs, implement file change detection
- For CI/CD integration, add command-line flags for automated runs

## 🤝 Integration Points

### With Main Vietnamese-Chinese App
- **Vocabulary Integration**: Use JSON output for React app vocabulary data
- **Progress Tracking**: Leverage level analysis for learning progression
- **Difficulty Grading**: Apply character frequency data for adaptive learning

### With Other Scripts
- **Vocabulary Processing**: Coordinates with `../hsk_vocabulary_processor.py`
- **Data Pipeline**: Fits into the broader `02_hsk_processing` workflow
- **Output Coordination**: Results feed into other analysis scripts

## 📝 Development Notes

### Code Architecture
- **Modular Design**: Each module handles specific functionality
- **Error Handling**: Graceful degradation when data is missing
- **Windows Optimization**: Path handling optimized for Windows file system
- **Extensible**: Easy to add new analysis features

### Testing
- **Import Test**: Run `python test_imports.py` to verify module imports
- **Data Test**: Analyzer validates data structure automatically
- **Output Test**: Check generated files for expected format

## 🆘 Support & Maintenance

### For Development Team
- **Log Files**: Check console output for detailed processing information
- **Debug Mode**: Modify scripts to add verbose logging
- **Error Reporting**: Full stack traces provided for debugging

### For Content Team
- **Data Updates**: Simply replace JSON files and re-run analyzer
- **Quality Check**: Review generated summary files for data validation
- **Usage Statistics**: Analyze word frequency reports for curriculum planning

---

## 🏃‍♂️ Quick Reference

**To run the analyzer:**
```cmd
# Method 1: Double-click run_analyzer.bat
# Method 2: Command line
cd C:\Users\TY_Windows\Documents\Development\vietnamese-chinese-learning\scripts\02_hsk_processing\hsk_analyzer
python main_hsk_analyzer.py
```

**Key output files for app development:**
- `hsk_unique_words_exclusive.json` - Primary vocabulary data
- `hsk_comparison_summary.txt` - Dataset selection guidance
- `level_reports/` - Individual level analysis

**Troubleshooting:**
1. Check data files exist in `../../../data/raw/`
2. Verify JSON format is valid
3. Ensure Python 3.7+ is installed
4. Review console output for specific errors

**Project Integration:**
- Results save to `../../analysis_output/hsk_comprehensive/`
- Use JSON files for React app integration
- Reference CSV files for data analysis
- Apply learning recommendations from level reports
