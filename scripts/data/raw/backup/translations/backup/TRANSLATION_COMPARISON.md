# Translation Options Comparison

This document compares the two translation methods available for HSK vocabulary:

## 1. Ollama LLM Translation

### Overview
Uses a local large language model (Qwen3) through Ollama to translate Chinese words to Vietnamese.

### Pros
- **Privacy**: All processing happens locally on your machine
- **Customizability**: The system prompt can be modified for specific needs
- **Context-awareness**: Takes English meanings into account for better translations
- **No rate limits**: Can process large volumes without restrictions
- **Confidence scores**: Provides confidence levels for translations
- **Free to use**: No API costs or usage fees

### Cons
- **Setup required**: Needs Ollama installed and model downloaded
- **Hardware dependent**: Performance depends on your computer's capabilities
- **Potentially slower**: Local processing may be slower than cloud services
- **Quality varies by model**: Results depend on the specific model used

### Best for
- Long-term projects with many words to translate
- Users concerned about privacy
- Scenarios where customization of the translation approach is important
- When context-awareness is critical for quality translations

## 2. Google Translate

### Overview
Uses the Google Translate service through an unofficial Python library to translate Chinese words to Vietnamese.

### Pros
- **Easy setup**: Minimal configuration required
- **Consistent quality**: Generally provides reliable translations
- **Fast processing**: Cloud-based service is typically faster
- **Broad language support**: Works well for many language pairs

### Cons
- **Rate limits**: May encounter usage restrictions
- **Less context-aware**: Doesn't always consider word context properly
- **Network dependent**: Requires internet connection
- **Limited customization**: Can't modify how translations are processed
- **API instability**: Unofficial API can break with Google's changes

### Best for
- Quick projects with fewer words
- When setup simplicity is a priority
- Users without powerful local hardware
- When consistent quality is more important than customization

## Choosing the Right Approach

### Use Ollama LLM When:
- You have a powerful computer
- You need to translate many words
- You want control over the translation process
- Privacy is important to you
- You need confidence scores for quality control

### Use Google Translate When:
- You need a quick solution without setup
- You're translating a small number of words
- You don't have powerful local hardware
- You want simple, straightforward translations

## Combined Approach

For best results, consider a hybrid strategy:
1. Use automated translation (either method) for initial drafts
2. Manually review and correct translations
3. Focus on high-frequency words first
4. Use the translation admin interface to track progress
5. Continuously improve translations over time

Remember that both methods provide a starting point, and manual review remains essential for high-quality translations.
