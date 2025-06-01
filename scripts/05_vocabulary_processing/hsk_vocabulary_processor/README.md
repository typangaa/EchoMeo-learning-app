# HSK Vocabulary Processor

This folder contains tools for processing and enriching HSK (Hanyu Shuiping Kaoshi) vocabulary data using AI-powered enrichment.

## Files

- `hsk_vocabulary_processor.py` - Main processor script that extracts, enriches, and saves HSK vocabulary data
- `vocabulary_enrichment.py` - Core enrichment module that uses Qwen3 to add detailed meanings and translations
- `run_processor.bat` - Interactive Windows batch file with menu system
- `run_simple.bat` - Simple batch file for direct execution
- `run_debug.bat` - Debug batch file that shows exactly what commands are executed
- `verify_paths.py` - Verification script to check directory structure and data paths
- `README.md` - This documentation file

## Prerequisites

1. **Python 3.7+** with the following packages:
   - `requests`
   - `json` (built-in)
   - `pathlib` (built-in)
   - `logging` (built-in)

2. **Ollama** with Qwen3 model installed:
   ```bash
   # Install Ollama first (see https://ollama.ai)
   # Then pull the Qwen3 model
   ollama pull qwen3:latest
   ```

3. **Raw HSK Data Files** in the correct directory structure:
   ```
   scripts/
   └── data/
       └── raw/
           └── exclusive/
               ├── 1.json  # HSK Level 1 data
               ├── 2.json  # HSK Level 2 data
               ├── 3.json  # HSK Level 3 data
               └── ...     # Additional levels
   ```

## Usage

### Quick Start

1. **Verify Setup**: First run the verification script to check paths:
   ```bash
   python verify_paths.py
   ```

2. **Using Batch Files (Windows)**: Choose from three options:
   - **Interactive**: `run_processor.bat` - Menu-driven interface
   - **Simple**: `run_simple.bat` - Direct input prompts
   - **Debug**: `run_debug.bat` - Shows exactly what commands are executed

### Using Python Directly

#### Process All HSK Levels
```bash
python hsk_vocabulary_processor.py
```

#### Process Specific HSK Level
```bash
python hsk_vocabulary_processor.py --level 1
```

#### Customize Processing Options
```bash
python hsk_vocabulary_processor.py --level 1 --model qwen3:latest --batch 3 --debug
```

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--level` | HSK level to process (1-7) | All levels |
| `--model` | Ollama model to use | `qwen3:latest` |
| `--batch` | Batch size for processing | 5 |
| `--no-csv` | Skip CSV file generation | False (CSV is created) |
| `--raw-dir` | Directory with raw HSK JSON files | `../../data/raw/exclusive` |
| `--output-dir` | Directory for enriched output | `../../data/enriched` |
| `--debug` | Show debug logs in console | False |

## Output

The processor generates enriched vocabulary data in JSON format with the following structure:

```json
{
  "item": "好",
  "pinyin": "hǎo",
  "meanings": [
    {
      "chinese": "好的；不错的；很棒的",
      "english": "good ; nice ; fine",
      "vietnamese": "tốt ; hay ; được",
      "part_of_speech": "adj",
      "usage_frequency": "very common",
      "examples": [
        {
          "chinese": "这本书很好。",
          "pinyin": "Zhè běn shū hěn hǎo.",
          "english": "This book is very good.",
          "vietnamese": "Cuốn sách này rất hay."
        }
      ]
    }
  ]
}
```

### Output Files

For each HSK level processed, the following files are created in `../../data/enriched/vocabulary/`:

- `hsk{level}_enriched.json` - Complete enriched vocabulary data in JSON format
- `hsk{level}_enriched.csv` - Flattened data in CSV format (optional)
- `hsk{level}_progress.json` - Progress file created during processing

## Features

### AI-Powered Enrichment
- Uses Qwen3 language model via Ollama for high-quality translations
- Generates Chinese definitions, English translations, and Vietnamese translations
- Creates contextual example sentences with full translations
- Provides part-of-speech and usage frequency information

### Robust Processing
- Batch processing to handle large vocabularies efficiently
- Progress saving with automatic recovery
- Error handling and retry mechanisms
- Comprehensive logging for debugging

### Multiple Output Formats
- Structured JSON for application integration
- CSV format for analysis and editing
- Standardized format with consistent separators

## Logging

The processor creates detailed logs:
- `hsk_processor_debug.log` - Complete debug information
- Console output - Progress and status information
- Use `--debug` flag to see debug information in console

## Troubleshooting

### Common Issues

1. **Ollama Connection Error**
   - Ensure Ollama is running: `ollama serve`
   - Verify Qwen3 model is installed: `ollama list`

2. **File Not Found Errors**
   - Check that HSK JSON files exist in `../../data/raw/exclusive/`
   - Verify file naming convention: `1.json`, `2.json`, etc.

3. **Processing Interruption**
   - The processor saves progress automatically
   - Re-run the same command to continue from where it left off

4. **Memory Issues**
   - Reduce batch size: `--batch 2`
   - Process one level at a time: `--level 1`

5. **Batch File Issues (Windows)**
   - If `run_processor.bat` doesn't pass arguments correctly, try `run_simple.bat`
   - For detailed troubleshooting, use `run_debug.bat` to see exact commands
   - Ensure you're running from the correct directory
   - Try running Python directly if batch files fail

### Debug Mode

Enable debug mode for detailed troubleshooting:
```bash
python hsk_vocabulary_processor.py --level 1 --debug
```

This will show:
- Full API requests and responses
- JSON parsing details
- Detailed error information

## Integration

The enriched JSON files are designed to integrate with the Vietnamese-Chinese learning application:

1. Place output files in the application's data directory
2. Import the JSON data in the HSK vocabulary components
3. Use the structured meanings and examples for flashcards and learning exercises

## Development

### Modifying Enrichment Prompts
Edit the `create_system_prompt()` function in `vocabulary_enrichment.py` to customize how the AI processes vocabulary items.

### Adding New Output Formats
Extend the `save_enriched_data()` function in `hsk_vocabulary_processor.py` to support additional output formats.

### Custom Processing Logic
Modify the `enrich_vocabulary_item()` function to add custom processing steps or validation.
