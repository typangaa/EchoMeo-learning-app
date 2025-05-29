# Text-to-Speech Implementation Guide

This guide explains how to set up and use the text-to-speech feature for the Vietnamese-Chinese Learning Platform.

## Overview

The TTS (Text-to-Speech) implementation uses a hybrid approach:
1. Pre-generated audio files for vocabulary and reading passages
2. Web Speech API as a fallback for any missing audio files

## Requirements

- Python 3.7+ (for generating audio files)
- espeak-ng (for TTS generation)
- ffmpeg (for audio conversion and optimization)
- Python packages: pandas, tqdm

## Setup Instructions

### 1. Install Dependencies

#### On Windows:
- Install [Python](https://www.python.org/downloads/)
- Install [espeak-ng](https://github.com/espeak-ng/espeak-ng/releases)
- Install [ffmpeg](https://ffmpeg.org/download.html)
- Add all of these to your PATH
- Install Python packages: `pip install pandas tqdm`

#### On Ubuntu/Debian:
```bash
sudo apt-get install espeak-ng ffmpeg
pip install pandas tqdm
```

### 2. Generate Audio Files

Run the generator script:

```bash
# On Windows
generate_audio.bat

# On Linux/Mac
python generate_audio.py --input vocabulary_data.csv --passages reading_passages.json --output public/audio
```

This script will:
- Read vocabulary from vocabulary_data.csv
- Read reading passages from reading_passages.json
- Generate audio files for all vocabulary items and reading passages
- Create a mapping file at src/data/audio_mapping.json

### 3. Advanced Options

The audio generator script has several options:

```
--input         Path to vocabulary CSV file
--passages      Path to reading passages JSON file (optional)
--output        Directory for audio output files
--force         Force regeneration of existing audio files
--format        Audio output format (mp3, ogg, wav)
--quality       Audio quality (low, medium, high)
```

Example:
```bash
python generate_audio.py --input vocabulary_data.csv --force --output public/audio --format mp3 --quality high
```

## How It Works

1. The `AudioService` class (src/utils/audioService.ts) handles audio playback
2. It first looks for pre-generated audio files using the mapping in audio_mapping.json
3. If no audio file is found, it uses the Web Speech API as a fallback (browser-based TTS)
4. The `AudioButton` component provides a consistent UI for audio playback

## Components

- **AudioService** - Utility that manages audio playback
- **AudioButton** - UI component for audio playback with animation
- Modified components:
  - **VocabularyCard** - Shows audio buttons for vocabulary items
  - **PassageDetail** - Shows audio buttons for passage titles and paragraphs
  - **VocabPopover** - Adds audio buttons to the vocabulary popup

## Troubleshooting

1. **Audio not playing**: Check your browser's audio permissions and make sure your audio device is working

2. **espeak-ng not found**: Make sure espeak-ng is installed correctly and in your PATH

3. **ffmpeg not found**: Make sure ffmpeg is installed correctly and in your PATH

4. **Audio quality issues**: For better quality, consider using a commercial TTS service. The Python script can be modified to use other TTS engines.

## Additional Resources

- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [espeak-ng Documentation](https://github.com/espeak-ng/espeak-ng/blob/master/docs/guide.md)
- [ffmpeg Documentation](https://ffmpeg.org/documentation.html)
