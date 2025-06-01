# Vocabulary Processing - Directory Organization

This directory contains tools for processing vocabulary data for the Vietnamese-Chinese language learning application.

## Directory Structure

```
05_vocabulary_processing/
├── hsk_vocabulary_processor/           # HSK Chinese vocabulary processor
│   ├── hsk_vocabulary_processor.py     # Main HSK processing script
│   ├── vocabulary_enrichment.py        # AI enrichment for Chinese vocabulary
│   ├── verify_paths.py                 # HSK path verification script
│   ├── run_processor.bat               # HSK Windows batch runner
│   └── README.md                       # HSK processor documentation
├── vietnamese_vocabulary_processor/    # Vietnamese vocabulary processor
│   ├── vietnamese_vocabulary_processor.py     # Main Vietnamese processing script
│   ├── vietnamese_vocabulary_enrichment.py    # AI enrichment for Vietnamese vocabulary
│   ├── verify_paths.py                        # Vietnamese path verification script
│   ├── run_processor.bat                      # Vietnamese Windows batch runner
│   └── README.md                              # Vietnamese processor documentation
├── launch_hsk_processor.bat            # Quick HSK launcher
├── launch_vietnamese_processor.bat     # Quick Vietnamese launcher
└── vocabulary_enrichment_backup.py     # Backup of original file
```

## Processors Overview

### HSK Vocabulary Processor
Processes Chinese vocabulary from HSK standardized test data:
- **Input**: HSK JSON files (levels 1-7)
- **Output**: Chinese vocabulary with Vietnamese translations
- **Features**: Detailed Chinese definitions, Vietnamese translations, example sentences

### Vietnamese Vocabulary Processor
Processes Vietnamese vocabulary data with Chinese translations:
- **Input**: Vietnamese vocabulary JSON files
- **Output**: Vietnamese vocabulary with Chinese translations
- **Features**: Vietnamese definitions, Chinese translations with Pinyin, example sentences

## Data Directory Structure

The processors expect the following data directory structure:

```
scripts/
└── data/
    ├── raw/
    │   └── exclusive/              # HSK data
    │       ├── 1.json              # HSK Level 1 vocabulary
    │       ├── 2.json              # HSK Level 2 vocabulary
    │       └── ...                 # Additional HSK levels
    ├── vietnamese_generated/       # Vietnamese data
    │   ├── vietnamese_raw_1.json   # Vietnamese vocabulary data
    │   └── ...                     # Additional Vietnamese files
    └── enriched/                   # Output directory (created automatically)
        ├── vocabulary/             # HSK enriched output
        │   ├── hsk1_enriched.json
        │   ├── hsk1_enriched.csv
        │   └── ...
        └── vietnamese_vocabulary/  # Vietnamese enriched output
            ├── vietnamese_enriched.json
            ├── vietnamese_enriched.csv
            └── ...
```

## Quick Start

### HSK Vocabulary Processing
1. **Launch the processor**: Double-click `launch_hsk_processor.bat`
2. **Or use command line**: 
   ```bash
   cd hsk_vocabulary_processor
   python verify_paths.py                    # Verify setup
   python hsk_vocabulary_processor.py --level 1    # Process HSK Level 1
   ```

### Vietnamese Vocabulary Processing
1. **Launch the processor**: Double-click `launch_vietnamese_processor.bat`
2. **Or use command line**:
   ```bash
   cd vietnamese_vocabulary_processor
   python verify_paths.py                           # Verify setup
   python vietnamese_vocabulary_processor.py        # Process Vietnamese vocabulary
   ```

## Common Features

Both processors share:
- **AI-Powered Enrichment**: Uses Qwen3 model for intelligent translations
- **Batch Processing**: Handles large vocabularies efficiently
- **Progress Tracking**: Automatic progress saving and recovery
- **Multiple Formats**: Outputs both JSON and CSV formats
- **Error Handling**: Robust retry mechanisms and detailed logging
- **Flexible Configuration**: Customizable batch sizes, models, and output options

## Requirements

- Python 3.7+
- Ollama with Qwen3 model (`ollama pull qwen3:latest`)
- Raw vocabulary data files in the correct directory structure
- Python requests library (`pip install requests`)

## Output Formats

### HSK Output
Creates enriched Chinese vocabulary files with:
- Chinese definitions and characters
- English translations  
- Vietnamese translations
- Pinyin pronunciations
- Example sentences with full translations
- Part-of-speech information
- Usage frequency data

### Vietnamese Output
Creates enriched Vietnamese vocabulary files with:
- Vietnamese definitions
- Chinese translations (simplified characters)
- Pinyin pronunciations
- English translations
- Example sentences in all three languages
- Etymology information
- Regional variant data

## Integration

The enriched vocabulary data is designed for integration with the Vietnamese-Chinese language learning web application, providing:
- Structured data for vocabulary cards
- Example sentences for language practice
- Translation pairs for flashcard systems
- Frequency data for learning prioritization

## Documentation

- HSK Processor: See `hsk_vocabulary_processor/README.md`
- Vietnamese Processor: See `vietnamese_vocabulary_processor/README.md`

## Troubleshooting

1. **Ollama Connection Issues**
   - Start Ollama: `ollama serve`
   - Install model: `ollama pull qwen3:latest`

2. **Path Issues**
   - Run verification scripts: `verify_paths.py`
   - Check input file locations

3. **Processing Errors**
   - Check debug logs for detailed error information
   - Reduce batch size for memory issues
   - Verify input data format

For detailed troubleshooting, refer to the individual processor README files.
