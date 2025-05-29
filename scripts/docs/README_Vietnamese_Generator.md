# Vietnamese Vocabulary Generator from HSK Data

This script generates Vietnamese vocabulary entries that correspond to Chinese HSK vocabulary, creating structured data following the Raw Vietnamese JSON Structure format.

## Overview

The script takes Chinese vocabulary from HSK JSON files (1.json through 7.json) and uses Ollama AI to generate comprehensive Vietnamese vocabulary entries. Each Vietnamese entry includes:

- Vietnamese equivalent word(s)
- Syllable breakdown
- Frequency estimation (lower numbers = more common)
- Parts of speech
- Etymology (real linguistic origins when possible)
- IPA transcription and tone patterns
- Regional pronunciation variants (Northern, Central, Southern)
- Multiple meanings and usage contexts
- Register and formality levels

## Prerequisites

1. **Ollama installed and running** with a suitable model (default: qwen3:latest)
2. **Python 3.7+** with requests library installed
3. **HSK JSON files** in the `data/raw/` directory (1.json, 2.json, etc.)

## Installation

```bash
# Install required Python packages
pip install requests

# Ensure Ollama is running with the required model
ollama pull qwen3:latest
ollama serve
```

## Usage

### Test the System First

Before processing full HSK levels, test with sample data:

```bash
python test_vietnamese_generator.py
```

This will test the generation with 3 sample Chinese words and verify the system is working correctly.

### Generate Vietnamese Vocabulary

#### Process a Single HSK Level

```bash
# Generate Vietnamese vocabulary for HSK Level 1
python vietnamese_vocabulary_generator.py --level 1

# Generate for HSK Level 3 with custom batch size
python vietnamese_vocabulary_generator.py --level 3 --batch 2
```

#### Process All HSK Levels

```bash
# Generate Vietnamese vocabulary for all HSK levels (1-7)
python vietnamese_vocabulary_generator.py
```

#### Advanced Options

```bash
# Use different model
python vietnamese_vocabulary_generator.py --level 1 --model llama2:latest

# Custom directories
python vietnamese_vocabulary_generator.py --raw-dir /path/to/hsk/files --output-dir /path/to/output

# Enable debug logging
python vietnamese_vocabulary_generator.py --level 1 --debug

# Smaller batch size for better quality (slower)
python vietnamese_vocabulary_generator.py --level 1 --batch 1
```

## Output

The script generates separate files for each HSK level:

- `vietnamese_raw_1.json` - Vietnamese vocabulary corresponding to HSK Level 1
- `vietnamese_raw_2.json` - Vietnamese vocabulary corresponding to HSK Level 2
- `vietnamese_raw_3.json` - Vietnamese vocabulary corresponding to HSK Level 3
- ... and so on through `vietnamese_raw_7.json`

### Output Structure

Each output file contains an array of Vietnamese vocabulary entries following this structure:

```json
[
  {
    "vietnamese": "tốt",
    "syllables": ["tốt"],
    "frequency": 15,
    "pos": ["adj", "adv"],
    "etymology": {
      "origin": "sino_vietnamese",
      "source_language": "chinese",
      "notes": "from Chinese 好 (hǎo), one of the most basic positive adjectives"
    },
    "forms": [
      {
        "standard": "tốt",
        "transcriptions": {
          "ipa": "/tot̚˦˥/",
          "simplified_pronunciation": "toht (rising tone)",
          "tone_pattern": "high_rising"
        },
        "regional_variants": {
          "northern": "tốt",
          "central": "tốt",
          "southern": "tốt"
        },
        "meanings": [
          "good; positive quality or state",
          "well; in a good manner",
          "fine; acceptable or satisfactory"
        ],
        "register": "neutral",
        "formality_level": "casual"
      }
    ]
  }
]
```

## Configuration Options

### Command Line Arguments

- `--level LEVEL`: Process specific HSK level (1-7)
- `--model MODEL`: Ollama model to use (default: qwen3:latest)
- `--batch SIZE`: Number of items to process per batch (default: 3)
- `--raw-dir DIR`: Directory containing HSK JSON files (default: data/raw)
- `--output-dir DIR`: Directory for output files (default: data/vietnamese_generated)
- `--debug`: Show detailed debug logs in console

### Internal Configuration

You can modify the `VietnameseGeneratorConfig` class in the script to adjust:

- API settings (URL, model, retries, temperature)
- Processing settings (batch size, delays)
- File paths

## Frequency Guidelines

The script uses realistic frequency estimates:

- **1-50**: Very common daily words (tôi, là, có, không)
- **51-200**: Common words (nhà, ăn, đi, học)
- **201-500**: Moderately common (thông minh, đẹp, nhanh)
- **501-1000**: Less common (phức tạp, nghiêm túc)
- **1000+**: Rare/specialized (triết học, kỹ thuật)

## Etymology Categories

- **sino_vietnamese**: Words borrowed from Chinese (most HSK-related words)
- **native_vietnamese**: Indigenous Vietnamese words
- **french_loanword**: Words borrowed from French colonial period
- **unknown**: Etymology unclear or uncertain

## Regional Variants

- **Northern (Bắc)**: Standard Vietnamese pronunciation
- **Central (Trung)**: Phonetic differences in Central Vietnam
- **Southern (Nam)**: Phonetic differences in Southern Vietnam

## Logging and Debugging

The script creates detailed logs:

- `vietnamese_generator_debug.log`: Complete debug information
- Progress files: `vietnamese_raw_X_progress.json` for each level during processing

## Error Handling

The script includes robust error handling:

- Automatic retries for failed API calls
- Progress saving after each batch
- Fallback entries for completely failed items
- Detailed logging of all issues

## Performance Considerations

- **Batch Processing**: Items are processed in batches with delays to avoid overwhelming the API
- **Progress Saving**: Progress is saved after each batch to resume if interrupted
- **Rate Limiting**: Built-in delays between API calls
- **Memory Efficient**: Processes one HSK level at a time

## Troubleshooting

### Common Issues

1. **"Could not connect to Ollama"**
   - Ensure Ollama is running: `ollama serve`
   - Check if the model is installed: `ollama list`
   - Install the model if needed: `ollama pull qwen3:latest`

2. **"HSK level X file not found"**
   - Verify HSK JSON files are in the correct directory
   - Check file names match the expected pattern (1.json, 2.json, etc.)

3. **JSON parsing errors**
   - Check the debug logs for details
   - The script will retry failed generations
   - Verify the Ollama model is responding correctly

4. **Low success rate**
   - Try reducing batch size: `--batch 1`
   - Use a different model: `--model llama2:latest`
   - Check system resources (RAM, CPU)

### Quality Control

- Run the test script first to verify system functionality
- Check the generated files for completeness
- Review frequency estimates for reasonableness
- Verify etymology classifications are appropriate

## Integration with Language Learning App

The generated Vietnamese vocabulary files can be integrated into the React language learning application:

1. Place output files in the app's data directory
2. Create import functions to load Vietnamese vocabulary
3. Use the structured data for:
   - Vietnamese vocabulary lists
   - Cross-language learning (Chinese ↔ Vietnamese)
   - Pronunciation practice with IPA transcriptions
   - Regional variant awareness
   - Etymology-based learning

## Future Enhancements

- Support for additional Chinese dictionaries
- Integration with Vietnamese pronunciation APIs
- Automatic frequency validation against Vietnamese corpora
- Support for traditional Chinese characters
- Export to additional formats (CSV, XML)

## Contributing

To improve the Vietnamese vocabulary generation:

1. Enhance the system prompt for better linguistic accuracy
2. Add validation functions for generated entries
3. Implement quality scoring for generated content
4. Add support for specialized vocabulary domains
5. Create automated testing for linguistic accuracy
