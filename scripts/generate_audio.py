#!/usr/bin/env python3
"""
Audio Generator for Vietnamese-Chinese Learning Platform

This script generates audio files for vocabulary and reading passages using espeak-ng.
It creates a mapping file that the web application can use to find the right audio file.

Requirements:
- espeak-ng: For TTS generation
- ffmpeg: For audio conversion and optimization (optional but recommended)
- Python packages: pandas, tqdm

Installation on Windows:
  1. Install espeak-ng: https://github.com/espeak-ng/espeak-ng/releases
  2. Install ffmpeg: https://ffmpeg.org/download.html
  3. Add both to your PATH
  4. pip install pandas tqdm

Installation on Ubuntu/Debian:
  sudo apt-get install espeak-ng ffmpeg
  pip install pandas tqdm

Usage:
  python generate_audio.py --input vocabulary_data.csv --passages reading_passages.json --output public/audio
"""

import os
import argparse
import subprocess
import json
import hashlib
import csv
import re
import time
from pathlib import Path
import pandas as pd
from tqdm import tqdm

# Global settings
DEFAULT_VN_VOICE = "vi"  # Vietnamese voice
DEFAULT_CN_VOICE = "zh"  # Chinese voice (Mandarin)
DEFAULT_VN_RATE = "140"  # Speech rate for Vietnamese
DEFAULT_CN_RATE = "130"  # Speech rate for Chinese
DEFAULT_VOLUME = "100"   # Volume (0-200)
MAX_PROCESSES = 4        # Maximum concurrent processes

def setup_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description='Generate audio files for vocabulary and reading passages')
    parser.add_argument('--input', type=str, default='vocabulary_data.csv',
                        help='Path to vocabulary CSV file')
    parser.add_argument('--passages', type=str, default=None,
                        help='Path to reading passages JSON file (optional)')
    parser.add_argument('--output', type=str, default='public/audio',
                        help='Directory for audio output files')
    parser.add_argument('--force', action='store_true',
                        help='Force regeneration of existing audio files')
    parser.add_argument('--format', type=str, default='mp3',
                        choices=['mp3', 'ogg', 'wav'],
                        help='Audio output format')
    parser.add_argument('--quality', type=str, default='medium',
                        choices=['low', 'medium', 'high'],
                        help='Audio quality (affects file size)')
    return parser.parse_args()

def sanitize_filename(text):
    """Create a safe filename from text"""
    # Remove special characters and replace spaces with underscores
    safe_name = re.sub(r'[^\w\s]', '', text).strip().replace(' ', '_').lower()
    # Ensure it's not too long
    if len(safe_name) > 50:
        safe_name = safe_name[:50]
    return safe_name

def get_audio_filename(text, language, level=None):
    """Generate a filename for the audio file"""
    # Create a hash of the text for uniqueness
    text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()[:8]
    
    # Create a readable prefix from the text
    text_prefix = sanitize_filename(text)[:30]
    
    # Level subfolder prefix 
    level_prefix = level.lower() if level else 'misc'
    
    # Language code
    lang_code = 'vi' if language == 'vietnamese' else 'zh'
    
    # Construct path
    path = f"{lang_code}/{level_prefix}/{text_prefix}_{text_hash}"
    return path

def generate_audio_espeak(text, language, output_path, rate=None, volume=None):
    """Generate audio using espeak-ng"""
    # Set voice based on language
    if language == 'vietnamese':
        voice = DEFAULT_VN_VOICE
        rate = rate or DEFAULT_VN_RATE
    else:  # Chinese
        voice = DEFAULT_CN_VOICE
        rate = rate or DEFAULT_CN_RATE
    
    volume = volume or DEFAULT_VOLUME
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Generate WAV file using espeak-ng
    wav_path = output_path.replace('.mp3', '.wav').replace('.ogg', '.wav')
    
    espeak_cmd = [
        'espeak-ng',
        '-v', voice,
        '-s', rate,         # Speed
        '-a', volume,       # Volume
        '-w', wav_path,     # Output WAV file
        text
    ]
    
    try:
        # Run espeak-ng
        subprocess.run(espeak_cmd, check=True, capture_output=True)
        return wav_path
    except subprocess.CalledProcessError as e:
        print(f"Error running espeak-ng: {e}")
        if e.stderr:
            print(f"Error message: {e.stderr.decode('utf-8')}")
        return None

def convert_to_format(wav_path, output_path, quality='medium'):
    """Convert WAV to MP3 or OGG with ffmpeg"""
    # Define quality presets
    quality_settings = {
        'low': {'mp3': '-q:a 9', 'ogg': '-q:a 2'},
        'medium': {'mp3': '-q:a 5', 'ogg': '-q:a 5'},
        'high': {'mp3': '-q:a 0', 'ogg': '-q:a 8'}
    }
    
    # Get file extension
    file_format = os.path.splitext(output_path)[1][1:].lower()
    
    # Build ffmpeg command
    if file_format == 'mp3':
        quality_arg = quality_settings[quality]['mp3']
        codec = 'libmp3lame'
    elif file_format == 'ogg':
        quality_arg = quality_settings[quality]['ogg']
        codec = 'libvorbis'
    else:
        # For WAV, just copy the file
        if wav_path != output_path:
            os.rename(wav_path, output_path)
        return True
    
    # Full ffmpeg command
    cmd = f"ffmpeg -i {wav_path} -codec:a {codec} {quality_arg} -y {output_path}"
    
    try:
        # Run ffmpeg
        subprocess.run(cmd, shell=True, check=True, capture_output=True)
        
        # Remove temporary WAV file if conversion succeeded
        if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            os.remove(wav_path)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error converting audio: {e}")
        if e.stderr:
            print(f"Error message: {e.stderr.decode('utf-8')}")
        return False

def check_dependencies():
    """Check if required dependencies are installed"""
    dependencies = {
        'espeak-ng': 'Please install espeak-ng (https://github.com/espeak-ng/espeak-ng/releases)',
        'ffmpeg': 'Please install ffmpeg (https://ffmpeg.org/download.html)'
    }
    
    missing = []
    for cmd, message in dependencies.items():
        try:
            subprocess.run(['where' if os.name == 'nt' else 'which', cmd], 
                          check=True, capture_output=True)
        except subprocess.CalledProcessError:
            missing.append(f"{cmd}: {message}")
    
    if missing:
        print("Missing dependencies:")
        for msg in missing:
            print(f"  - {msg}")
        return False
    
    return True

def generate_vocabulary_audio(vocabulary_data, output_dir, audio_format, quality, force=False):
    """Generate audio for vocabulary items"""
    print("Generating vocabulary audio files...")
    
    # Dictionary to store mapping of text to audio filenames
    audio_mapping = {
        'vietnamese': {},
        'chinese': {}
    }
    
    # Create output directories
    os.makedirs(output_dir, exist_ok=True)
    
    # Track progress
    total_items = len(vocabulary_data) * 2  # Vietnamese + Chinese
    
    # Process the vocabulary items
    with tqdm(total=total_items, desc="Processing vocabulary") as pbar:
        for _, item in vocabulary_data.iterrows():
            # Process Vietnamese text
            vietnamese_text = item['vietnamese']
            level = item.get('level', 'A1')
            
            if vietnamese_text and vietnamese_text.strip():
                vn_rel_path = get_audio_filename(vietnamese_text, 'vietnamese', level)
                vn_full_path = os.path.join(output_dir, f"{vn_rel_path}.{audio_format}")
                
                # Skip if file exists and not force regenerating
                if not force and os.path.exists(vn_full_path) and os.path.getsize(vn_full_path) > 0:
                    audio_mapping['vietnamese'][vietnamese_text] = f"{vn_rel_path}.{audio_format}"
                else:
                    # Generate Vietnamese audio
                    wav_path = generate_audio_espeak(vietnamese_text, 'vietnamese', vn_full_path)
                    if wav_path and convert_to_format(wav_path, vn_full_path, quality):
                        audio_mapping['vietnamese'][vietnamese_text] = f"{vn_rel_path}.{audio_format}"
            
            pbar.update(1)
            
            # Process Chinese text
            chinese_text = item['chinese']
            if chinese_text and chinese_text.strip():
                cn_rel_path = get_audio_filename(chinese_text, 'chinese', level)
                cn_full_path = os.path.join(output_dir, f"{cn_rel_path}.{audio_format}")
                
                # Skip if file exists and not force regenerating
                if not force and os.path.exists(cn_full_path) and os.path.getsize(cn_full_path) > 0:
                    audio_mapping['chinese'][chinese_text] = f"{cn_rel_path}.{audio_format}"
                else:
                    # Generate Chinese audio
                    wav_path = generate_audio_espeak(chinese_text, 'chinese', cn_full_path)
                    if wav_path and convert_to_format(wav_path, cn_full_path, quality):
                        audio_mapping['chinese'][chinese_text] = f"{cn_rel_path}.{audio_format}"
            
            pbar.update(1)
    
    return audio_mapping

def generate_passage_audio(passages_data, output_dir, audio_format, quality, force=False):
    """Generate audio for reading passages"""
    if not passages_data or 'passages' not in passages_data:
        return {}
    
    print("Generating reading passage audio files...")
    
    # Dictionary to store mapping of passage IDs to audio filenames
    passage_audio_mapping = {
        'vietnamese': {},
        'chinese': {}
    }
    
    passages = passages_data['passages']
    
    # Track total paragraphs
    total_paragraphs = sum(len(passage['paragraphs']) for passage in passages) * 2  # Vietnamese + Chinese
    total_titles = len(passages) * 2  # Vietnamese + Chinese
    total_items = total_paragraphs + total_titles
    
    with tqdm(total=total_items, desc="Processing passages") as pbar:
        for passage in passages:
            passage_id = passage['id']
            level = passage.get('level', 'A1')
            
            # Process title
            for lang in ['vietnamese', 'chinese']:
                if lang in passage['title'] and passage['title'][lang]:
                    title_text = passage['title'][lang]
                    title_rel_path = f"{lang.lower()[:2]}/{level.lower()}/title_{passage_id}"
                    title_full_path = os.path.join(output_dir, f"{title_rel_path}.{audio_format}")
                    
                    if not force and os.path.exists(title_full_path) and os.path.getsize(title_full_path) > 0:
                        passage_audio_mapping.setdefault(lang, {}).setdefault('titles', {})[passage_id] = f"{title_rel_path}.{audio_format}"
                    else:
                        wav_path = generate_audio_espeak(title_text, lang, title_full_path)
                        if wav_path and convert_to_format(wav_path, title_full_path, quality):
                            passage_audio_mapping.setdefault(lang, {}).setdefault('titles', {})[passage_id] = f"{title_rel_path}.{audio_format}"
                
                pbar.update(1)
            
            # Process paragraphs
            for i, paragraph in enumerate(passage['paragraphs']):
                for lang in ['vietnamese', 'chinese']:
                    if lang in paragraph and paragraph[lang]:
                        para_text = paragraph[lang]
                        para_rel_path = f"{lang.lower()[:2]}/{level.lower()}/{passage_id}_para_{i}"
                        para_full_path = os.path.join(output_dir, f"{para_rel_path}.{audio_format}")
                        
                        if not force and os.path.exists(para_full_path) and os.path.getsize(para_full_path) > 0:
                            passage_audio_mapping.setdefault(lang, {}).setdefault('paragraphs', {}).setdefault(passage_id, {})[i] = f"{para_rel_path}.{audio_format}"
                        else:
                            wav_path = generate_audio_espeak(para_text, lang, para_full_path)
                            if wav_path and convert_to_format(wav_path, para_full_path, quality):
                                passage_audio_mapping.setdefault(lang, {}).setdefault('paragraphs', {}).setdefault(passage_id, {})[i] = f"{para_rel_path}.{audio_format}"
                    
                    pbar.update(1)
    
    return passage_audio_mapping

def main():
    """Main function"""
    args = setup_arguments()
    
    # Check dependencies
    if not check_dependencies():
        return 1
    
    # Create output directory
    os.makedirs(args.output, exist_ok=True)
    
    # Load vocabulary data
    print(f"Loading vocabulary from {args.input}...")
    try:
        vocabulary_data = pd.read_csv(args.input)
    except Exception as e:
        print(f"Error loading vocabulary data: {e}")
        return 1
    
    # Load passages data if provided
    passages_data = None
    if args.passages:
        print(f"Loading reading passages from {args.passages}...")
        try:
            with open(args.passages, 'r', encoding='utf-8') as f:
                passages_data = json.load(f)
        except Exception as e:
            print(f"Error loading reading passages: {e}")
    
    # Generate audio for vocabulary
    vocab_audio_mapping = generate_vocabulary_audio(
        vocabulary_data, args.output, args.format, args.quality, args.force
    )
    
    # Generate audio for passages if provided
    passage_audio_mapping = {}
    if passages_data:
        passage_audio_mapping = generate_passage_audio(
            passages_data, args.output, args.format, args.quality, args.force
        )
    
    # Combine the mappings
    audio_mapping = {
        'vocabulary': vocab_audio_mapping,
        'passages': passage_audio_mapping
    }
    
    # Save the audio mapping to a JSON file
    mapping_path = os.path.join('src', 'data', 'audio_mapping.json')
    os.makedirs(os.path.dirname(mapping_path), exist_ok=True)
    
    with open(mapping_path, 'w', encoding='utf-8') as f:
        json.dump(audio_mapping, f, ensure_ascii=False, indent=2)
    
    # Print summary
    print(f"\nAudio generation complete!")
    print(f"Generated audio for {len(vocab_audio_mapping['vietnamese'])} Vietnamese vocabulary items")
    print(f"Generated audio for {len(vocab_audio_mapping['chinese'])} Chinese vocabulary items")
    
    if passage_audio_mapping and 'vietnamese' in passage_audio_mapping and 'paragraphs' in passage_audio_mapping['vietnamese']:
        vn_passages = sum(len(paras) for paras in passage_audio_mapping['vietnamese']['paragraphs'].values())
        print(f"Generated audio for {vn_passages} Vietnamese paragraphs")
    
    if passage_audio_mapping and 'chinese' in passage_audio_mapping and 'paragraphs' in passage_audio_mapping['chinese']:
        cn_passages = sum(len(paras) for paras in passage_audio_mapping['chinese']['paragraphs'].values())
        print(f"Generated audio for {cn_passages} Chinese paragraphs")
    
    print(f"\nAudio files saved to: {args.output}")
    print(f"Audio mapping saved to: {mapping_path}")
    
    return 0

if __name__ == "__main__":
    exit(main())