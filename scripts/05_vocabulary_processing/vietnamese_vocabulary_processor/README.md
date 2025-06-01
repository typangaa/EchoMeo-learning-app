# Vietnamese Vocabulary Processor

This directory contains tools for processing and enriching Vietnamese vocabulary data with Chinese translations for language learning applications.

## Overview

The Vietnamese Vocabulary Processor takes raw Vietnamese vocabulary data and enriches it with:
- Detailed Vietnamese definitions
- Chinese translations (simplified characters)
- Pinyin pronunciations
- English translations
- Example sentences in Vietnamese and Chinese
- Etymology information
- Usage frequency data

## Files

- `vietnamese_vocabulary_processor.py` - Main processor script
- `vietnamese_vocabulary_enrichment.py` - Core enrichment logic using Ollama/Qwen3
- `run_processor.bat` - Windows batch script to run the processor
- `verify_paths.py` - Script to verify file paths and dependencies

## Requirements

1. **Ollama** - Must be running locally on port 11434
2. **Qwen3 Model** - Install with: `ollama pull qwen3:latest`
3. **Python Dependencies**:
   - requests
   - json (built-in)
   - logging (built-in)

## Input Data Format

The processor expects a JSON file with Vietnamese vocabulary items in this format:

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
      "chu_nom": "yêu",
      "notes": "Sino-Vietnamese loanword from Chinese 愛 (ài)"
    },
    "forms": [
      {
        "standard": "yêu",
        "transcriptions": {
          "ipa": "/jøːː˧˩˧/",
          "simplified_pronunciation": "yêu (low falling tone)",
          "tone_pattern": "low_falling"
        },
        "regional_variants": {
          "northern": "yêu",
          "central": "yêu", 
          "southern": "yêu"
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

## Output Data Format

The processor generates enriched data in this format:

```json
[
  {
    "vietnamese": "yêu",
    "ipa": "/jøːː˧˩˧/",
    "frequency": 50,
    "etymology": {
      "origin": "sino_vietnamese",
      "source_language": "chinese",
      "notes": "From Chinese 愛 (ài), meaning love"
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

## Usage

### Basic Usage

```bash
python vietnamese_vocabulary_processor.py
```

This will process the default input file: `../../data/vietnamese_generated/vietnamese_raw_1.json`

### Advanced Usage

```bash
# Process specific file
python vietnamese_vocabulary_processor.py --input path/to/input.json

# Use different model
python vietnamese_vocabulary_processor.py --model qwen2.5:latest

# Change batch size
python vietnamese_vocabulary_processor.py --batch 3

# Enable debug logging
python vietnamese_vocabulary_processor.py --debug

# Skip CSV generation
python vietnamese_vocabulary_processor.py --no-csv

# Custom output directory
python vietnamese_vocabulary_processor.py --output-dir path/to/output
```

### Command Line Arguments

- `--input FILE` - Input Vietnamese JSON file (default: ../../data/vietnamese_generated/vietnamese_raw_1.json)
- `--model MODEL` - Ollama model to use (default: qwen3:latest)
- `--batch SIZE` - Batch size for processing (default: 5)
- `--no-csv` - Do not create CSV files
- `--output-dir DIR` - Directory for enriched output files
- `--debug` - Show debug logs in console output

## Output Files

The processor generates several output files:

1. **JSON Output**: `vietnamese_enriched.json` - Main enriched vocabulary data
2. **CSV Output**: `vietnamese_enriched.csv` - Flattened data for analysis
3. **Progress File**: `vietnamese_progress.json` - Intermediate progress saves
4. **Log Files**: `vietnamese_processor_debug.log` - Detailed processing logs

## Configuration

### Processing Settings

Edit the `ProcessorConfig` class in `vietnamese_vocabulary_processor.py`:

```python
class ProcessorConfig:
    def __init__(self):
        self.input_file = "../../data/vietnamese_generated/vietnamese_raw_1.json"
        self.output_dir = "../../data/enriched"
        self.batch_size = 5
        self.create_csv = True
```

### Enrichment Settings

Edit the `EnrichmentConfig` class in `vietnamese_vocabulary_enrichment.py`:

```python
class EnrichmentConfig:
    def __init__(self):
        self.api_url = "http://localhost:11434/api/generate"
        self.model = "qwen3:latest"
        self.max_retries = 3
        self.retry_delay = 5
        self.temperature = 0.2
```

## Troubleshooting

### Common Issues

1. **Ollama Connection Error**
   - Ensure Ollama is running: `ollama serve`
   - Check if model is available: `ollama list`

2. **Model Not Found**
   - Install the model: `ollama pull qwen3:latest`

3. **JSON Parse Errors**
   - Check the debug log for detailed error information
   - The processor will retry failed items automatically

4. **Memory Issues**
   - Reduce batch size: `--batch 3` or `--batch 1`

### Debug Mode

Enable debug logging to see detailed processing information:

```bash
python vietnamese_vocabulary_processor.py --debug
```

This will show:
- Full API requests and responses
- JSON parsing details
- Processing progress
- Error details

## Performance

- Processing time depends on vocabulary size and model speed
- Typical processing: 5-10 seconds per vocabulary item
- Batch processing helps manage API load
- Progress is saved automatically to prevent data loss

## Integration

The enriched Vietnamese vocabulary data is designed to integrate with the Vietnamese-Chinese language learning application. The output format matches the expected structure for:

- Vocabulary cards with Chinese translations
- Example sentences for language practice
- Etymology information for advanced learners
- Frequency data for learning prioritization
