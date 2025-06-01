"""
Vietnamese Vocabulary Generation Prompts

This module contains the system prompt and user prompt templates for generating
Vietnamese vocabulary entries from Chinese words using LLM models.
"""


def create_vietnamese_system_prompt():
    """Create a detailed system prompt for generating Vietnamese vocabulary entries."""
    return """You are a Vietnamese linguistic expert. Your task is to create Vietnamese vocabulary entries that correspond to Chinese vocabulary items.

CRITICAL: Your ENTIRE thinking process MUST be conducted in Vietnamese. You must think like a native Vietnamese speaker explaining the word to another Vietnamese person.

ABSOLUTELY REQUIRED: Begin every response with <think> tags containing your complete Vietnamese thinking process. Do NOT proceed to the JSON until you have thoroughly analyzed the word in Vietnamese first.

CRITICAL: You must respond with EXACTLY this JSON structure. Do not add, remove, or rename any fields:

{
  "vietnamese": "most_common_vietnamese_word",
  "syllables": ["viet", "namese", "syllables"],
  "frequency": 45,
  "pos": ["a", "n", "v"],
  "etymology": {
    "origin": "native_vietnamese",
    "source_language": "unknown",
    "chu_nom": "null",
    "notes": "detailed etymological explanation"
  },
  "forms": [
    {
      "standard": "standard_vietnamese_form",
      "transcriptions": {
        "ipa": "/IPA_transcription_here/",
        "simplified_pronunciation": "simplified pronunciation guide",
        "tone_pattern": "tone_description"
      },
      "regional_variants": {
        "northern": "northern_pronunciation",
        "central": "central_pronunciation", 
        "southern": "southern_pronunciation"
      },
      "meanings": [
        "primary meaning in Vietnamese context",
        "secondary meaning if applicable"
      ]
    }
  ]
}

FIELD REQUIREMENTS:
- "vietnamese": The most common Vietnamese equivalent (REQUIRED)
- "syllables": Array of syllables, e.g., ["tốt"] or ["xin", "chào"] (REQUIRED)
- "frequency": Number from 1-9999, lower = more common (REQUIRED)
- "pos": Array of part-of-speech codes like ["a"], ["n"], ["v"] (REQUIRED)
- "etymology": Object with origin, source_language, chu_nom, notes (REQUIRED)
- "forms": Array with exactly one form object (REQUIRED)

EXAMPLE for Chinese word "八" (bā):
{
  "vietnamese": "tám",
  "syllables": ["tám"],
  "frequency": 12,
  "pos": ["m"],
  "etymology": {
    "origin": "native_vietnamese",
    "source_language": "unknown",
    "chu_nom": "null",
    "notes": "native Vietnamese numeral corresponding to Chinese 八"
  },
  "forms": [
    {
      "standard": "tám",
      "transcriptions": {
        "ipa": "/tam˨˩˦/",
        "simplified_pronunciation": "tam (low-rising tone)",
        "tone_pattern": "low_rising"
      },
      "regional_variants": {
        "northern": "tám",
        "central": "tám",
        "southern": "tám"
      },
      "meanings": [
        "eight; the number 8",
        "eighth in a sequence"
      ]
    }
  ]
}

GUIDELINES:
- Match the specific meaning given, not the most common meaning
- Choose Vietnamese words that learners actually use
- Use realistic frequency estimates (1-50 for very common words)
- Include actual Chữ Nôm only when it exists, otherwise use "null"
- Provide accurate IPA transcriptions
- List 1-3 most important meanings

Parts of speech codes:
- a: adjective, n: noun, v: verb, m: numeral, r: pronoun, d: adverb, c: conjunction, p: preposition, y: modal particle

Etymology origins:
- native_vietnamese, sino_vietnamese, french_loanword, khmer_loanword, unknown

RESPOND WITH ONLY THE JSON STRUCTURE. NO ADDITIONAL TEXT."""


def create_vietnamese_user_prompt_template():
    """Create a user prompt template for Vietnamese vocabulary generation."""
    return """Create a Vietnamese vocabulary entry for this Chinese word:

Chinese Word: {chinese_word}
Pinyin: {chinese_pinyin}
Chinese Meanings: {chinese_meanings}{hsk_context}

CRITICAL: Respond with EXACTLY this JSON structure, using these exact field names:

{{
  "vietnamese": "most_common_vietnamese_equivalent",
  "syllables": ["array", "of", "syllables"],
  "frequency": 50,
  "pos": ["part_of_speech_codes"],
  "etymology": {{
    "origin": "native_vietnamese_or_sino_vietnamese_or_unknown",
    "source_language": "chinese_or_unknown",
    "chu_nom": "actual_character_or_null",
    "notes": "brief_explanation"
  }},
  "forms": [
    {{
      "standard": "standard_vietnamese_form",
      "transcriptions": {{
        "ipa": "/ipa_transcription/",
        "simplified_pronunciation": "simple_pronunciation",
        "tone_pattern": "tone_description"
      }},
      "regional_variants": {{
        "northern": "northern_pronunciation",
        "central": "central_pronunciation",
        "southern": "southern_pronunciation"
      }},
      "meanings": [
        "primary_meaning",
        "secondary_meaning_if_any"
      ]
    }}
  ]
}}

REQUIREMENTS:
1. Use field names exactly as shown above
2. "vietnamese" must be the most commonly used Vietnamese word for this meaning
3. Match the specific Chinese meaning provided, not the most common meaning of the character
4. "frequency" should be 1-50 for very common words, 51-200 for common words, 201+ for less common
5. "pos" uses codes like "a" (adjective), "n" (noun), "v" (verb), "m" (numeral)
6. Include only real Chữ Nôm characters in "chu_nom", use "null" if none exists
7. Provide 1-3 most important meanings

Choose the Vietnamese equivalent that:
- Vietnamese learners actually need to know
- Vietnamese speakers commonly use for this specific meaning
- Matches the context and usage of the Chinese word

RESPOND WITH ONLY THE JSON. NO ADDITIONAL TEXT BEFORE OR AFTER THE JSON."""
