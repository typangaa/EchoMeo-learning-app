#!/usr/bin/env python3
"""
Analysis module for Vietnamese vocabulary data.
Provides comprehensive linguistic analysis of Vietnamese vocabulary.
"""

from collections import Counter, defaultdict
import re

def analyze_etymology(vocabulary_items):
    """Analyze etymology patterns in the vocabulary."""
    etymology_stats = {
        'sino_vietnamese': 0,
        'native_vietnamese': 0,
        'unknown': 0,
        'other': 0
    }
    
    etymology_details = defaultdict(list)
    source_languages = Counter()
    
    for item in vocabulary_items:
        etymology = item.get('etymology', {})
        origin = etymology.get('origin', 'unknown')
        source_lang = etymology.get('source_language', 'unknown')
        
        # Categorize origin
        if origin == 'sino_vietnamese':
            etymology_stats['sino_vietnamese'] += 1
        elif origin == 'native_vietnamese':
            etymology_stats['native_vietnamese'] += 1
        elif origin == 'unknown':
            etymology_stats['unknown'] += 1
        else:
            etymology_stats['other'] += 1
        
        etymology_details[origin].append(item['vietnamese'])
        source_languages[source_lang] += 1
    
    return {
        'etymology_distribution': etymology_stats,
        'etymology_details': dict(etymology_details),
        'source_languages': dict(source_languages)
    }

def analyze_tone_patterns(vocabulary_items):
    """Analyze Vietnamese tone patterns."""
    tone_patterns = Counter()
    tone_details = defaultdict(list)
    
    for item in vocabulary_items:
        forms = item.get('forms', [])
        if forms:
            # Get tone pattern from first form
            tone_pattern = forms[0].get('transcriptions', {}).get('tone_pattern', 'unknown')
            tone_patterns[tone_pattern] += 1
            tone_details[tone_pattern].append(item['vietnamese'])
    
    return {
        'tone_distribution': dict(tone_patterns),
        'tone_details': dict(tone_details)
    }

def analyze_regional_variants(vocabulary_items):
    """Analyze regional pronunciation variants."""
    regional_differences = defaultdict(int)
    variant_examples = defaultdict(list)
    
    for item in vocabulary_items:
        forms = item.get('forms', [])
        if forms:
            variants = forms[0].get('regional_variants', {})
            
            # Check if there are differences between regions
            northern = variants.get('northern', '')
            central = variants.get('central', '')
            southern = variants.get('southern', '')
            
            # Count differences
            if northern and central and northern != central:
                regional_differences['north_central'] += 1
                variant_examples['north_central'].append({
                    'word': item['vietnamese'],
                    'northern': northern,
                    'central': central
                })
            
            if northern and southern and northern != southern:
                regional_differences['north_south'] += 1
                variant_examples['north_south'].append({
                    'word': item['vietnamese'],
                    'northern': northern,
                    'southern': southern
                })
            
            if central and southern and central != southern:
                regional_differences['central_south'] += 1
                variant_examples['central_south'].append({
                    'word': item['vietnamese'],
                    'central': central,
                    'southern': southern
                })
    
    return {
        'regional_differences': dict(regional_differences),
        'variant_examples': dict(variant_examples)
    }

def analyze_syllable_structure(vocabulary_items):
    """Analyze syllable structure and complexity."""
    syllable_counts = Counter()
    syllable_details = defaultdict(list)
    
    for item in vocabulary_items:
        syllables = item.get('syllables', [])
        syllable_count = len(syllables)
        
        syllable_counts[syllable_count] += 1
        syllable_details[syllable_count].append({
            'word': item['vietnamese'],
            'syllables': syllables
        })
    
    return {
        'syllable_distribution': dict(syllable_counts),
        'syllable_details': dict(syllable_details),
        'average_syllables': sum(count * syl_count for syl_count, count in syllable_counts.items()) / sum(syllable_counts.values()) if syllable_counts else 0
    }

def analyze_pos_distribution(vocabulary_items):
    """Analyze part-of-speech distribution."""
    pos_counter = Counter()
    pos_details = defaultdict(list)
    
    for item in vocabulary_items:
        pos_list = item.get('pos', [])
        
        # Count each POS for this word
        for pos in pos_list:
            pos_counter[pos] += 1
            pos_details[pos].append(item['vietnamese'])
    
    return {
        'pos_distribution': dict(pos_counter),
        'pos_details': dict(pos_details)
    }

def analyze_frequency_patterns(vocabulary_items):
    """Analyze frequency distribution patterns."""
    frequencies = [item.get('frequency', 0) for item in vocabulary_items]
    
    if not frequencies:
        return {'error': 'No frequency data found'}
    
    frequency_ranges = {
        'very_high': 0,    # 80-100
        'high': 0,         # 60-79
        'medium': 0,       # 40-59
        'low': 0,          # 20-39
        'very_low': 0      # 0-19
    }
    
    frequency_details = defaultdict(list)
    
    for item in vocabulary_items:
        freq = item.get('frequency', 0)
        word = item['vietnamese']
        
        if freq >= 80:
            frequency_ranges['very_high'] += 1
            frequency_details['very_high'].append({'word': word, 'frequency': freq})
        elif freq >= 60:
            frequency_ranges['high'] += 1
            frequency_details['high'].append({'word': word, 'frequency': freq})
        elif freq >= 40:
            frequency_ranges['medium'] += 1
            frequency_details['medium'].append({'word': word, 'frequency': freq})
        elif freq >= 20:
            frequency_ranges['low'] += 1
            frequency_details['low'].append({'word': word, 'frequency': freq})
        else:
            frequency_ranges['very_low'] += 1
            frequency_details['very_low'].append({'word': word, 'frequency': freq})
    
    return {
        'frequency_ranges': frequency_ranges,
        'frequency_details': dict(frequency_details),
        'statistics': {
            'min_frequency': min(frequencies),
            'max_frequency': max(frequencies),
            'avg_frequency': sum(frequencies) / len(frequencies),
            'total_words': len(frequencies)
        }
    }

def analyze_combined_data(all_results):
    """Analyze combined data from all Vietnamese vocabulary files."""
    
    # Combine all vocabulary items
    all_vocabulary = []
    file_stats = {}
    
    for result in all_results:
        if result['success']:
            file_num = result['file_number']
            items = result['vocabulary_items']
            
            all_vocabulary.extend(items)
            file_stats[file_num] = {
                'count': len(items),
                'file': os.path.basename(result['file_path']) if hasattr(os, 'path') else result['file_path'].split('/')[-1]
            }
    
    if not all_vocabulary:
        return {'error': 'No vocabulary data to analyze'}
    
    print(f"\n🔍 Analyzing {len(all_vocabulary)} total vocabulary items...")
    
    # Perform various analyses
    etymology_analysis = analyze_etymology(all_vocabulary)
    tone_analysis = analyze_tone_patterns(all_vocabulary)
    regional_analysis = analyze_regional_variants(all_vocabulary)
    syllable_analysis = analyze_syllable_structure(all_vocabulary)
    pos_analysis = analyze_pos_distribution(all_vocabulary)
    frequency_analysis = analyze_frequency_patterns(all_vocabulary)
    
    # Word list analysis
    all_words = [item['vietnamese'] for item in all_vocabulary]
    unique_words = list(set(all_words))
    duplicate_count = len(all_words) - len(unique_words)
    
    # Vietnamese-Chinese learning specific analysis
    learning_analysis = analyze_for_learning(all_vocabulary)
    
    return {
        'total_vocabulary': len(all_vocabulary),
        'unique_words': len(unique_words),
        'duplicate_count': duplicate_count,
        'word_list': sorted(unique_words),
        'file_statistics': file_stats,
        'etymology_analysis': etymology_analysis,
        'tone_analysis': tone_analysis,
        'regional_analysis': regional_analysis,
        'syllable_analysis': syllable_analysis,
        'pos_analysis': pos_analysis,
        'frequency_analysis': frequency_analysis,
        'learning_analysis': learning_analysis,
        'vocabulary_items': all_vocabulary
    }

def analyze_for_learning(vocabulary_items):
    """Analyze vocabulary specifically for language learning purposes."""
    
    sino_vietnamese_words = []
    native_vietnamese_words = []
    
    for item in vocabulary_items:
        etymology = item.get('etymology', {})
        
        # Track etymology for Chinese learners
        if etymology.get('origin') == 'sino_vietnamese':
            sino_vietnamese_words.append(item)
        elif etymology.get('origin') == 'native_vietnamese':
            native_vietnamese_words.append(item)
    
    return {
        'sino_vietnamese_words': sino_vietnamese_words,
        'native_vietnamese_words': native_vietnamese_words,
        'chinese_learner_insights': {
            'sino_vietnamese_count': len(sino_vietnamese_words),
            'native_vietnamese_count': len(native_vietnamese_words),
            'sino_vietnamese_ratio': len(sino_vietnamese_words) / len(vocabulary_items) if vocabulary_items else 0
        }
    }

# Add the missing import
import os
