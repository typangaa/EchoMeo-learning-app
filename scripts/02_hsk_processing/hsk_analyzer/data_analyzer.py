#!/usr/bin/env python3
"""
Analysis module for HSK vocabulary data.
Provides comprehensive analysis of extracted vocabulary data.
"""

from collections import Counter, defaultdict

def analyze_combined_data(all_results):
    """
    Analyze the combined data from all HSK levels for a dataset.
    
    Args:
        all_results (list): List of extraction results from all files
        
    Returns:
        dict: Combined analysis results
    """
    
    # Combine all words with their HSK levels
    all_words_with_levels = []
    words_by_level = defaultdict(list)
    level_stats = {}
    
    for result in all_results:
        if result['success']:
            level = result['hsk_level']
            words = result['simplified_words']
            
            # Track words by level
            words_by_level[level] = words
            level_stats[level] = {
                'count': len(words),
                'file': result['file_path'].split('/')[-1] if isinstance(result['file_path'], str) else result['file_path'].name,
                'dataset': result.get('dataset', 'unknown')
            }
            
            # Add to combined list
            for word in words:
                all_words_with_levels.append({
                    'word': word,
                    'hsk_level': level
                })
    
    # Combine all words
    all_words = [item['word'] for item in all_words_with_levels]
    
    # Find duplicates across levels
    word_occurrences = defaultdict(list)
    for item in all_words_with_levels:
        word_occurrences[item['word']].append(item['hsk_level'])
    
    # Separate unique and duplicate words
    unique_words = []
    duplicate_words = {}
    
    for word, levels in word_occurrences.items():
        if len(levels) == 1:
            unique_words.append(word)
        else:
            duplicate_words[word] = sorted(list(set(levels)))
    
    # Character analysis
    character_frequency = Counter()
    word_length_dist = Counter()
    single_chars = []
    compound_words = []
    
    for word in set(all_words):  # Use set to avoid counting duplicates
        # Word length analysis
        length = len(word)
        word_length_dist[length] += 1
        
        if length == 1:
            single_chars.append(word)
        else:
            compound_words.append(word)
        
        # Character frequency
        for char in word:
            character_frequency[char] += 1
    
    return {
        'total_words': len(all_words),
        'unique_words': len(set(all_words)),
        'unique_word_list': sorted(list(set(all_words))),
        'duplicate_count': len(duplicate_words),
        'duplicate_words': duplicate_words,
        'words_by_level': dict(words_by_level),
        'level_statistics': level_stats,
        'character_frequency': character_frequency,
        'word_length_distribution': dict(word_length_dist),
        'single_characters': sorted(single_chars),
        'compound_words': sorted(compound_words),
        'unique_characters_count': len(character_frequency),
        'dataset': all_results[0].get('dataset', 'unknown') if all_results else 'unknown'
    }

def analyze_individual_level(level, words, all_analysis):
    """Analyze a single HSK level in detail."""
    
    if not words:
        return None
    
    # Character frequency for this level
    character_frequency = Counter()
    for word in words:
        for char in word:
            character_frequency[char] += 1
    
    # Word length distribution
    word_length_dist = Counter()
    single_chars = []
    compound_words = []
    
    for word in words:
        length = len(word)
        word_length_dist[length] += 1
        if length == 1:
            single_chars.append(word)
        else:
            compound_words.append(word)
    
    # Find words unique to this level
    unique_to_level = []
    shared_with_other_levels = []
    
    for word in words:
        appears_in_levels = []
        for other_level, other_words in all_analysis['words_by_level'].items():
            if word in other_words:
                appears_in_levels.append(other_level)
        
        if len(appears_in_levels) == 1:
            unique_to_level.append(word)
        else:
            shared_with_other_levels.append({
                'word': word,
                'also_in_levels': [l for l in appears_in_levels if l != level]
            })
    
    # Character coverage analysis
    level_chars = set()
    for word in words:
        level_chars.update(word)
    
    # Find most complex words (longest)
    longest_words = sorted(words, key=len, reverse=True)[:10]
    
    # Find most common starting characters
    starting_chars = Counter()
    for word in words:
        if word:
            starting_chars[word[0]] += 1
    
    return {
        'hsk_level': level,
        'total_words': len(words),
        'word_list': sorted(words),
        'statistics': {
            'single_characters': len(single_chars),
            'compound_words': len(compound_words),
            'word_length_distribution': dict(word_length_dist),
            'average_word_length': sum(len(word) for word in words) / len(words),
            'unique_characters_count': len(level_chars),
            'character_frequency': dict(character_frequency.most_common()),
            'most_common_characters': character_frequency.most_common(10),
            'most_common_starting_chars': starting_chars.most_common(10)
        },
        'word_analysis': {
            'single_characters': sorted(single_chars),
            'compound_words': sorted(compound_words),
            'longest_words': longest_words,
            'unique_to_this_level': sorted(unique_to_level),
            'shared_with_other_levels': shared_with_other_levels
        },
        'character_coverage': {
            'total_unique_characters': len(level_chars),
            'characters_used': sorted(list(level_chars))
        },
        'learning_insights': {
            'complexity_indicators': {
                'longest_word_length': max(len(word) for word in words) if words else 0,
                'shortest_word_length': min(len(word) for word in words) if words else 0,
                'single_char_percentage': (len(single_chars) / len(words)) * 100 if words else 0,
                'compound_word_percentage': (len(compound_words) / len(words)) * 100 if words else 0
            },
            'uniqueness': {
                'words_unique_to_level': len(unique_to_level),
                'words_shared_with_others': len(shared_with_other_levels),
                'uniqueness_percentage': (len(unique_to_level) / len(words)) * 100 if words else 0
            }
        }
    }

def compare_datasets(exclusive_analysis, inclusive_analysis):
    """
    Compare exclusive and inclusive datasets.
    
    Args:
        exclusive_analysis (dict): Analysis results from exclusive dataset
        inclusive_analysis (dict): Analysis results from inclusive dataset
        
    Returns:
        dict: Comparison analysis
    """
    
    exclusive_words = set(exclusive_analysis['unique_word_list'])
    inclusive_words = set(inclusive_analysis['unique_word_list'])
    
    # Find common and unique words
    common_words = exclusive_words.intersection(inclusive_words)
    exclusive_only = exclusive_words - inclusive_words
    inclusive_only = inclusive_words - exclusive_words
    
    # Level-by-level comparison
    level_comparison = {}
    
    for level in range(1, 8):
        exclusive_level_words = set(exclusive_analysis['words_by_level'].get(level, []))
        inclusive_level_words = set(inclusive_analysis['words_by_level'].get(level, []))
        
        level_common = exclusive_level_words.intersection(inclusive_level_words)
        level_exclusive_only = exclusive_level_words - inclusive_level_words
        level_inclusive_only = inclusive_level_words - exclusive_level_words
        
        level_comparison[level] = {
            'exclusive_count': len(exclusive_level_words),
            'inclusive_count': len(inclusive_level_words),
            'common_count': len(level_common),
            'exclusive_only_count': len(level_exclusive_only),
            'inclusive_only_count': len(level_inclusive_only),
            'overlap_percentage': (len(level_common) / max(len(exclusive_level_words), len(inclusive_level_words))) * 100 if max(len(exclusive_level_words), len(inclusive_level_words)) > 0 else 0,
            'common_words': sorted(list(level_common)),
            'exclusive_only_words': sorted(list(level_exclusive_only)),
            'inclusive_only_words': sorted(list(level_inclusive_only))
        }
    
    return {
        'overall_comparison': {
            'exclusive_total_unique': len(exclusive_words),
            'inclusive_total_unique': len(inclusive_words),
            'common_words_count': len(common_words),
            'exclusive_only_count': len(exclusive_only),
            'inclusive_only_count': len(inclusive_only),
            'overlap_percentage': (len(common_words) / len(exclusive_words.union(inclusive_words))) * 100,
            'total_combined_unique': len(exclusive_words.union(inclusive_words))
        },
        'detailed_comparison': {
            'common_words': sorted(list(common_words)),
            'exclusive_only_words': sorted(list(exclusive_only)),
            'inclusive_only_words': sorted(list(inclusive_only))
        },
        'level_by_level_comparison': level_comparison,
        'character_analysis': {
            'exclusive_unique_chars': exclusive_analysis['unique_characters_count'],
            'inclusive_unique_chars': inclusive_analysis['unique_characters_count'],
            'common_chars_count': len(set(exclusive_analysis['character_frequency'].keys()).intersection(set(inclusive_analysis['character_frequency'].keys()))),
            'exclusive_only_chars_count': len(set(exclusive_analysis['character_frequency'].keys()) - set(inclusive_analysis['character_frequency'].keys())),
            'inclusive_only_chars_count': len(set(inclusive_analysis['character_frequency'].keys()) - set(exclusive_analysis['character_frequency'].keys()))
        }
    }
