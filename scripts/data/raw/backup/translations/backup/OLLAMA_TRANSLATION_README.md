# Ollama-based Translation for HSK Vocabulary

This document explains how to use the local Ollama LLM API for translating HSK vocabulary from Chinese to Vietnamese.

## Prerequisites

1. **Python Requirements**
   - Python 3.6 or higher
   - Requests library: `pip install requests`

2. **Ollama Setup**
   - Install Ollama from [ollama.com/download](https://ollama.com/download)
   - Make sure Ollama is running (check the system tray or start it from the command line)
   - Pull the Qwen3 model: `ollama pull qwen3`

## Translation Process

### Using the Batch File

The easiest way to run the translation is to use the provided batch file:

1. Open Command Prompt in the translations directory
2. Run `auto_translate.bat`
3. Follow the prompts to select an HSK level (or translate all levels)
4. Optionally specify a different model to use

### Manual Execution

Alternatively, you can run the Python script directly:

```bash
# Translate all HSK levels
python auto_translate.py

# Translate a specific level
python auto_translate.py 1

# Use a different model
python auto_translate.py --model llama3:latest
```

## How It Works

The translation process follows these steps:

1. **Load CSV Files**: The script loads the HSK vocabulary CSV files that were created by the extraction process
2. **Process Each Word**: For each untranslated word:
   - Extract the Chinese word and its English meaning
   - Send them to the Ollama API with a specialized translation prompt
   - Parse the translation from the response
   - Update the CSV file with the translation
3. **Save Progress**: The script saves progress periodically and produces statistics on completion

## System Prompt Design

The system prompt instructs the LLM to:
- Act as a professional Chinese to Vietnamese translator
- Focus on accuracy and cultural appropriateness
- Consider the context provided by the English meanings
- Output translations in a specific JSON format with confidence scores

## Output Format

The expected JSON output format from the LLM is:

```json
{
  "translation": "Vietnamese translation",
  "confidence": 5
}
```

The confidence score ranges from 1-5, with 5 being the highest confidence.

## Performance Considerations

- Translation speed depends on your hardware and the chosen model
- The script includes periodic saves to preserve progress
- You can interrupt and resume the process as needed
- If translations seem low quality, consider:
  1. Using a more capable LLM model
  2. Adjusting the system prompt in the script
  3. Manually reviewing and correcting translations

## Troubleshooting

**Ollama server not running**
- Start Ollama using the desktop app or command line
- Check if the API is accessible at http://localhost:11434

**Model not found**
- Run `ollama pull qwen3` to download the model
- Check available models with `ollama list`

**Poor translation quality**
- Try a different model (e.g., `llama3`, `qwen2`, etc.)
- Check the system prompt in the script and adjust it if needed
- Review and manually correct translations

**Script crashes**
- Check the error message
- Ensure Ollama is running and has enough resources
- Try translating fewer words at a time (specific HSK levels)

## Next Steps

After running the translation:
1. Review the translations in the CSV files
2. Convert the CSV files back to JSON:
   ```
   python csv_to_json_converter.py
   ```
3. Integrate the translations into your application

## Models to Try

If Qwen3 doesn't provide satisfactory translations, consider these alternatives:
- `llama3` - Good general-purpose model
- `gemma:7b` - Smaller but efficient model
- `mistral` - Good for multilingual tasks
- `yi` - Another option for multilingual translation

To use a different model:
```
python auto_translate.py --model [model_name]
```
