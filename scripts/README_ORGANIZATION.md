# Scripts Organization Guide

This document describes the organization of scripts in the Vietnamese-Chinese Learning project.

## Folder Structure

### 📱 01_audio_generation
**Purpose**: Text-to-Speech (TTS) and audio generation scripts
- `generate_audio.py` - Main audio generation script
- `generate_audio.bat` - Batch file to run audio generation

### 🏛️ 02_hsk_processing  
**Purpose**: HSK (Hanyu Shuiping Kaoshi) vocabulary processing and Chinese language data
- `hsk_vocabulary_processor.py` - Main HSK data processor
- `extract_simplified_words.py` - Extract simplified Chinese characters
- `run_extract_simplified_words.bat` - Batch file for simplified word extraction
- `hsk_processor_debug.log` - Debug logs from HSK processing

### 🇻🇳 03_vietnamese_generation
**Purpose**: Vietnamese content generation and translation scripts
- `vietnamese_vocabulary_generator.py` - Generate Vietnamese vocabulary
- `vietnamese_prompts.py` - Prompts for Vietnamese content generation
- `test_vietnamese_generator.py` - Test script for Vietnamese generator
- `validate_vietnamese_vocabulary.py` - Validation for Vietnamese vocabulary data

### 📊 04_data_analysis
**Purpose**: Data analysis, validation, and missing content detection
- `find_missing_vocabulary_optimized.py` - Find missing vocabulary items
- `find_missing_vocabulary_optimized_from_analysis.py` - Alternative analysis script
- `run_missing_analysis_optimized.bat` - Batch file for missing vocabulary analysis
- `verify_json.py` - JSON data validation script

### 📝 05_vocabulary_processing
**Purpose**: General vocabulary processing and enrichment
- `vocabulary_enrichment.py` - Enrich vocabulary with additional data
- `vocabulary_enrichment_backup.py` - Backup version of enrichment script

### 🔧 06_utilities
**Purpose**: Utility scripts and maintenance tools
- `clean_pycache.bat` - Clean Python cache files

### 📚 docs
**Purpose**: Documentation and reference materials
- `README.md` - Main documentation
- `README_Vietnamese_Generator.md` - Vietnamese generator documentation
- `TTS_IMPLEMENTATION_GUIDE.md` - Text-to-Speech implementation guide
- `ANALYSIS_IMPLEMENTATION_SUMMARY.md` - Analysis implementation summary
- `OPTIMIZATION_FIXES.md` - Optimization fixes documentation
- `prompt.txt` - Prompt templates

### 📁 Existing Folders (Preserved)
- `data/` - Data files (large JSON files, not reorganized)
- `output/` - Script output files
- `analysis_output/` - Analysis output files
- `audio/` - Audio files
- `logs/` - Log files
- `processing/` - Processing temporary files
- `__pycache__/` - Python cache files

## Usage Guidelines

### Running Scripts
1. **Audio Generation**: Use files in `01_audio_generation/`
2. **HSK Processing**: Use files in `02_hsk_processing/`
3. **Vietnamese Content**: Use files in `03_vietnamese_generation/`
4. **Data Analysis**: Use files in `04_data_analysis/`
5. **Vocabulary Processing**: Use files in `05_vocabulary_processing/`

### Script Dependencies
- Make sure to check each script's requirements.txt or dependencies
- Some scripts may depend on files in the `data/` folder
- Batch files (.bat) are configured to run their corresponding Python scripts

### Development Workflow
1. Check `docs/` folder for relevant documentation before using scripts
2. Use `04_data_analysis/` scripts to identify missing or problematic data
3. Use `05_vocabulary_processing/` scripts to enrich and process vocabulary
4. Use `02_hsk_processing/` for Chinese-specific data processing
5. Use `03_vietnamese_generation/` for Vietnamese-specific content
6. Use `01_audio_generation/` for creating audio content
7. Use `06_utilities/` for maintenance tasks

## Best Practices
- Always backup data before running processing scripts
- Check log files in respective folders for debugging
- Use the batch files (.bat) for easier script execution on Windows
- Refer to documentation in `docs/` folder for detailed usage instructions
