# Vietnamese Vocabulary Comprehensive Analyzer

A specialized Python tool for analyzing Vietnamese vocabulary datasets with a focus on supporting Chinese speakers learning Vietnamese. This analyzer provides comprehensive linguistic analysis including etymology patterns, tone structures, regional variants, and learning recommendations specifically tailored for Chinese-Vietnamese language learning applications.

## 🎯 Overview

This analyzer is part of the Vietnamese-Chinese Learning Platform project and specifically handles Vietnamese vocabulary data processing. It extracts and analyzes Vietnamese words from JSON files, performs detailed linguistic analysis, and generates comprehensive reports optimized for Chinese speakers learning Vietnamese.

## 📁 Project Location & Structure

```
vietnamese-chinese-learning/scripts/02_pre_processing/vietnamese_analyzer/
├── main_vietnamese_analyzer.py      # Main execution script
├── data_extractor.py                # Data loading and extraction from Vietnamese files
├── data_analyzer.py                 # Linguistic analysis algorithms for Vietnamese
├── file_output.py                   # Output file generation (JSON, CSV, TXT)
├── report_generator.py              # Individual file reports and analysis
├── console_output.py                # Console statistics and output formatting
├── run_analyzer.bat                 # Windows batch file for easy execution
├── __init__.py                      # Python package file
└── README.md                        # This file

Data Source:
vietnamese-chinese-learning/scripts/data/vietnamese_generated/
├── vietnamese_raw_1.json → vietnamese_raw_7.json  # Vietnamese vocabulary files

Output Location:
vietnamese-chinese-learning/scripts/analysis_output/vietnamese_comprehensive/
└── vietnamese_analysis_YYYYMMDD_HHMMSS/  # Timestamped results
```

## 🚀 Quick Start

### Method 1: Using the Batch File (Recommended for Windows)
1. **Double-click** `run_analyzer.bat`
2. The script will automatically:
   - Validate your Python installation
   - Check Vietnamese data availability
   - Run the complete linguistic analysis
   - Show results location

### Method 2: Using Command Line
1. **Open Command Prompt** in the analyzer directory
2. **Run the analyzer**:
   ```cmd
   python main_vietnamese_analyzer.py
   ```

### Method 3: Using Python directly
```python
# From the vietnamese_analyzer directory
python -m main_vietnamese_analyzer
```

## 📋 Prerequisites

### System Requirements
- **Python 3.7+** (tested with Python 3.8+)
- **Windows** (optimized for Windows paths)
- Standard Python libraries only (no external dependencies!)

### Data Requirements
The analyzer expects Vietnamese vocabulary JSON files in this format:
```json
[
    {
        "vietnamese": "xin chào",
        "syllables": ["xin", "chào"],
        "frequency": 85,
        "pos": ["interjection"],
        "etymology": {
            "origin": "native_vietnamese",
            "source_language": "vietnamese",
            "chu_nom": "申嘲",
            "notes": "Common greeting"
        },
        "forms": [
            {
                "transcriptions": {
                    "tone_pattern": "low_falling_high_falling"
                },
                "regional_variants": {
                    "northern": "sin chào",
                    "central": "xin chào", 
                    "southern": "xin chào"
                }
            }
        ]
        // ... other fields (optional)
    }
]
```

**Required Data Location:**
- `../../../data/vietnamese_generated/vietnamese_raw_[1-7].json`

## 🔧 What the Analyzer Does

### Vietnamese-Specific Linguistic Analysis
- ✅ **Etymology Analysis**: Identifies Sino-Vietnamese vs. native Vietnamese words
- ✅ **Tone Pattern Analysis**: Analyzes Vietnamese tone patterns and frequency
- ✅ **Regional Variant Detection**: Identifies Northern/Central/Southern pronunciation differences
- ✅ **Syllable Structure Analysis**: Studies Vietnamese syllable complexity patterns
- ✅ **Chinese Learner Insights**: Special analysis for Chinese speakers learning Vietnamese
- ✅ **Frequency Distribution**: Learning priority based on word frequency
- ✅ **Part-of-Speech Analysis**: Grammatical category distribution

### Automatic Data Validation
- ✅ Checks for Vietnamese data directory existence
- ✅ Validates JSON file structure and Vietnamese text encoding
- ✅ Reports missing files and data quality issues
- ✅ Continues with available data if some files are missing

### Multiple Output Formats
- **JSON Files**: For integration with your React Vietnamese-Chinese learning app
- **CSV Files**: For data analysis and linguistic research
- **Text Files**: Human-readable word lists and learning recommendations
- **Individual File Reports**: Detailed analysis for each vocabulary file

## 📊 Understanding the Results

After running the analyzer, you'll find timestamped results in:
`../../analysis_output/vietnamese_comprehensive/vietnamese_analysis_YYYYMMDD_HHMMSS/`

### Key Output Files

#### For App Integration (Most Important)
- **`vietnamese_words_list.json`** - Clean Vietnamese word list for React app
- **`vietnamese_learning_data.json`** - Learning-focused data with Chinese learner insights
- **`vietnamese_words_beginner.txt`** - High-frequency, easy words for beginners
- **`vietnamese_sino_vietnamese_words.txt`** - Chinese-origin words (great for Chinese learners!)

#### For Linguistic Analysis & Research
- **`vietnamese_vocabulary_complete.json`** - Complete linguistic analysis
- **`vietnamese_analysis_summary.txt`** - Human-readable linguistic summary
- **`file_reports/`** - Individual analysis for each vocabulary file

#### For Curriculum Development
- **`vietnamese_vocabulary_analysis.csv`** - Detailed word data for curriculum planning
- **`vietnamese_words_beginner.txt`** - Beginner-level word list
- **`vietnamese_duplicates_[level].txt`** - Duplicate word lists for each learning level

### Sample Console Output
```
VIETNAMESE VOCABULARY COMPREHENSIVE ANALYZER
===========================================
Processing Vietnamese vocabulary dataset for language learning
Analyzing linguistic patterns, etymology, tones, and learning recommendations

🔍 Validating environment...
Script running from: C:\...\vietnamese_analyzer
Base scripts directory: C:\...\scripts

📊 VIETNAMESE DATA STRUCTURE INFORMATION:
   Vietnamese files found: 7/7
   ✅ All vocabulary files available for analysis

🔄 PROCESSING VIETNAMESE VOCABULARY DATASET
==========================================
📖 Processing Vietnamese file 1: vietnamese_raw_1.json
   ✅ 1,250 vocabulary items extracted from 1,250 entries
📖 Processing Vietnamese file 2: vietnamese_raw_2.json
   ✅ 1,180 vocabulary items extracted from 1,180 entries
...

📊 COMPREHENSIVE VIETNAMESE VOCABULARY ANALYSIS
==============================================
📈 VOCABULARY SUMMARY:
   Total vocabulary items: 8,500
   Unique words: 7,200
   Duplicate entries: 1,300

🏛️ ETYMOLOGY ANALYSIS:
   Sino Vietnamese: 4,250 (50.0%)
   Native Vietnamese: 3,400 (40.0%)
   Unknown: 850 (10.0%)

🇨🇳 CHINESE LEARNER INSIGHTS:
   Sino-Vietnamese words: 4,250 (50.0%)
   Native Vietnamese words: 3,400 (40.0%)
   Learning approach: Leverage Chinese knowledge
```

## 🎯 Integration with Vietnamese-Chinese Learning App

### For React App Development
Use these files from the analysis output:

1. **Vietnamese Vocabulary Data**: `vietnamese_words_list.json`
   ```json
   {
     "total_unique_words": 7200,
     "vietnamese_words": ["xin chào", "cảm ơn", "tạm biệt", ...],
     "extraction_info": { ... }
   }
   ```

2. **Chinese Learner Focus**: `vietnamese_sino_vietnamese_words.txt`
   ```
   # Sino-Vietnamese Words (Chinese Origin)
   # These words may be easier for Chinese speakers to learn
   
   học sinh (Chu Nom: 學生) - student
   giáo viên (Chu Nom: 教員) - teacher
   bệnh viện (Chu Nom: 病院) - hospital
   ...
   ```

3. **Learning Categories**: `vietnamese_learning_data.json`
   - Beginner/Intermediate/Advanced word classification
   - Sino-Vietnamese word prioritization for Chinese speakers
   - Tone pattern learning guides
   - Study recommendations based on etymology

### Recommended Learning Approach for Chinese Speakers
The analyzer provides specialized insights for Chinese speakers:
- **High Sino-Vietnamese Ratio**: Leverage your Chinese character knowledge
- **Etymology Grouping**: Learn words by Chinese origin patterns
- **Chu Nom Connections**: Understand historical Chinese-Vietnamese writing connections
- **Tone Pattern Focus**: Master Vietnamese tones building from Chinese tone knowledge

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### "No Vietnamese vocabulary files found"
- **Check**: Data files exist in `../../../data/vietnamese_generated/`
- **Verify**: Files are named `vietnamese_raw_1.json`, `vietnamese_raw_2.json`, ..., `vietnamese_raw_7.json`
- **Test**: Open a JSON file to ensure it's valid JSON with UTF-8 encoding

#### "JSON parsing error"
- **Issue**: Invalid JSON format in Vietnamese data files
- **Solution**: Validate JSON files using online JSON validators
- **Check**: Ensure proper UTF-8 encoding for Vietnamese characters (ă, â, ê, ô, ơ, ư, etc.)

#### "No 'vietnamese' field found"
- **Issue**: JSON files don't contain required "vietnamese" field
- **Check**: Verify your Vietnamese vocabulary JSON structure matches expected format
- **Debug**: Check console output for specific parsing errors

#### "Python not found" (when using batch file)
- **Issue**: Python not installed or not in system PATH
- **Solution**: Install Python 3.7+ and add to PATH, or use full Python path

### Data Validation
The analyzer performs comprehensive validation and reports:
- ✅ File existence and UTF-8 encoding validation
- ✅ JSON structure validation for Vietnamese data
- ✅ Required field presence ("vietnamese", "syllables", etc.)
- ✅ Vietnamese character encoding verification

## 🔄 Updating the Analyzer

### Adding New Linguistic Features
1. **Etymology Analysis**: Add to `data_analyzer.py` → `analyze_etymology()`
2. **Tone Analysis**: Modify `analyze_tone_patterns()` for new Vietnamese tone features
3. **Regional Variants**: Update `analyze_regional_variants()` for dialect analysis
4. **Output Generation**: Update `file_output.py` for new report formats

### Supporting New Vietnamese Data Formats
1. **Data Extraction**: Modify `data_extractor.py` for new Vietnamese JSON structures
2. **Path Handling**: Update path functions for new Vietnamese data sources
3. **Validation**: Add new validation rules for Vietnamese linguistic data

## 📈 Performance & Scalability

### Current Capabilities
- **Processing Speed**: ~2000 Vietnamese words/second
- **Memory Usage**: Optimized for large Vietnamese vocabulary datasets (20K+ words)
- **Encoding Support**: Full UTF-8 support for Vietnamese diacritics
- **Linguistic Analysis**: Comprehensive etymology and tone pattern analysis

### Optimization Options
- For massive datasets (100K+ words), consider parallel file processing
- For frequent runs, implement incremental analysis
- For production deployment, add caching for etymology lookups

## 🤝 Integration Points

### With Main Vietnamese-Chinese App
- **Vocabulary Integration**: Use JSON output for React app Vietnamese vocabulary
- **Chinese Learner Mode**: Leverage Sino-Vietnamese analysis for Chinese speakers
- **Difficulty Grading**: Apply frequency and syllable analysis for adaptive learning
- **Pronunciation Guide**: Use tone pattern analysis for pronunciation training

### With Other Learning Tools
- **Anki Integration**: Export word lists for spaced repetition systems
- **Pronunciation Apps**: Use tone pattern data for pronunciation training
- **Grammar Analysis**: Leverage POS data for grammar instruction coordination

## 📝 Development Notes

### Code Architecture
- **Modular Design**: Each module handles specific Vietnamese linguistic analysis
- **Error Handling**: Graceful degradation when Vietnamese data is incomplete
- **UTF-8 Optimization**: Proper handling of Vietnamese diacritical marks
- **Chinese Learner Focus**: Special analysis features for Chinese speakers

### Vietnamese-Specific Features
- **Etymology Tracking**: Distinguishes Sino-Vietnamese from native Vietnamese words
- **Tone Pattern Analysis**: Studies Vietnamese 6-tone system patterns
- **Regional Variants**: Analyzes Northern/Central/Southern pronunciation differences
- **Chinese Character Connections**: Links Vietnamese words to historical Chu Nom

### Testing
- **Import Test**: Run `python test_imports.py` to verify module imports
- **Vietnamese Data Test**: Analyzer validates Vietnamese character encoding automatically
- **Output Test**: Check generated files for proper Vietnamese text rendering

## 🆘 Support & Maintenance

### For Development Team
- **Vietnamese Encoding**: All outputs properly handle Vietnamese diacritics
- **Debug Mode**: Modify scripts to add verbose logging for Vietnamese text processing
- **Error Reporting**: Full stack traces with Vietnamese character support

### For Vietnamese Language Content Team
- **Data Updates**: Replace Vietnamese JSON files and re-run analyzer
- **Quality Check**: Review generated summary files for Vietnamese linguistic accuracy
- **Learning Recommendations**: Apply Chinese learner insights for curriculum planning

### For Chinese Speakers Learning Vietnamese
- **Sino-Vietnamese Focus**: Use etymology analysis to leverage Chinese knowledge
- **Tone Learning**: Follow tone pattern recommendations for systematic learning
- **Regional Variants**: Choose pronunciation variant based on target region

---

## 🏃‍♂️ Quick Reference

**To run the Vietnamese analyzer:**
```cmd
# Method 1: Double-click run_analyzer.bat
# Method 2: Command line
cd C:\Users\TY_Windows\Documents\Development\vietnamese-chinese-learning\scripts\02_pre_processing\vietnamese_analyzer
python main_vietnamese_analyzer.py
```

**Key output files for Vietnamese-Chinese app development:**
- `vietnamese_words_list.json` - Primary Vietnamese vocabulary data
- `vietnamese_learning_data.json` - Chinese learner-focused data
- `vietnamese_sino_vietnamese_words.txt` - Words with Chinese origins
- `file_reports/` - Individual Vietnamese file analysis

**Troubleshooting:**
1. Check Vietnamese data files exist in `../../../data/vietnamese_generated/`
2. Verify JSON format is valid with proper UTF-8 encoding
3. Ensure Vietnamese characters display correctly
4. Review console output for specific Vietnamese text processing errors

**Vietnamese-Chinese Learning Integration:**
- Results save to `../../analysis_output/vietnamese_comprehensive/`
- Use Sino-Vietnamese analysis for Chinese speaker learning paths
- Apply etymology data for character-meaning connections
- Reference tone pattern analysis for pronunciation training
- Use learning categories for adaptive difficulty progression

**Chinese Learner Benefits:**
- 50%+ Sino-Vietnamese words identified for familiar character-meaning connections
- Etymology analysis shows Chinese historical language influence
- Chu Nom character references for deeper cultural understanding
- Pronunciation patterns optimized for Chinese tone system familiarity
