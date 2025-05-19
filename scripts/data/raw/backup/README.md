# Chinese-Vietnamese Vocabulary Enrichment

This directory contains scripts for enriching Chinese vocabulary with detailed meanings, Vietnamese translations, and example sentences using the Qwen3 language model via Ollama.

## Files

- `character_enrichment.py` - Core module for Qwen3-based character enrichment
- `hsk_vocabulary_processor.py` - Main script that integrates extraction and enrichment

## Prerequisites

1. **Python Requirements**
   - Python 3.6 or higher
   - Required packages: `requests`
   - Install with: `pip install requests`

2. **Ollama Setup**
   - Install Ollama from [ollama.com/download](https://ollama.com/download)
   - Make sure Ollama is running (check system tray or start from command line)
   - Pull the Qwen3 model: `ollama pull qwen3`

## Directory Structure

- `/raw` - Contains the raw HSK JSON files (1.json through 7.json)
- `/enriched` - Will contain the enriched data after processing
  - `/characters` - Enriched character data
  - `/words` - Enriched word data

## Usage

### Basic Usage

```bash
# Process a specific HSK level
python hsk_vocabulary_processor.py --level 1

# Process all HSK levels
python hsk_vocabulary_processor.py
```

### Advanced Options

```bash
# Process only characters
python hsk_vocabulary_processor.py --chars-only

# Process only words
python hsk_vocabulary_processor.py --words-only

# Use a different model
python hsk_vocabulary_processor.py --model llama3

# Set a smaller batch size (for slower computers)
python hsk_vocabulary_processor.py --batch 3

# Don't create CSV files (JSON only)
python hsk_vocabulary_processor.py --no-csv

# Specify custom directories
python hsk_vocabulary_processor.py --raw-dir /path/to/input --output-dir /path/to/output
```

## Output Format

The scripts generate both JSON and CSV files:

### JSON Format

```json
[
  {
    "character": "好",
    "pinyin": "hǎo",
    "meanings": [
      {
        "english": "good",
        "vietnamese": "tốt",
        "part_of_speech": "adj",
        "usage_frequency": "very common",
        "examples": [
          {
            "chinese": "这个很好",
            "pinyin": "zhè ge hěn hǎo",
            "english": "This is very good",
            "vietnamese": "Cái này rất tốt"
          }
        ]
      },
      {
        "english": "to be fond of",
        "vietnamese": "thích",
        "part_of_speech": "v",
        "usage_frequency": "common",
        "examples": [...]
      }
    ]
  },
  ...
]
```

### CSV Files

The script creates two types of CSV files:
1. Main vocabulary CSV with all meanings
2. Examples CSV with example sentences for each meaning

## Integration with Your App

To use the enriched data in your application:

1. Update your data loading to use these new enriched files
2. Modify your `VocabularyItem` interface to match the new structure

## Troubleshooting

- If Ollama isn't running, you'll get a connection error
- Check `hsk_processor.log` for detailed logs
- If you encounter errors while processing large batches, try reducing the batch size