"""
Vietnamese Vocabulary Data Format Specification
================================================

This document describes the expected JSON structure for Vietnamese vocabulary files
that the Vietnamese Vocabulary Analyzer processes.

File Naming Convention:
- vietnamese_raw_1.json
- vietnamese_raw_2.json  
- vietnamese_raw_3.json
- vietnamese_raw_4.json
- vietnamese_raw_5.json
- vietnamese_raw_6.json
- vietnamese_raw_7.json

Location: scripts/data/vietnamese_generated/

JSON Structure:
===============

Each file should contain an array of Vietnamese vocabulary objects with the following structure:

[
    {
        "vietnamese": "xin chào",           // Required: Vietnamese text
        "syllables": ["xin", "chào"],      // Optional: Syllable breakdown
        "frequency": 85,                    // Optional: Usage frequency (0-100)
        "pos": ["interjection"],            // Optional: Part-of-speech tags
        "etymology": {                      // Optional: Etymology information
            "origin": "native_vietnamese",  // sino_vietnamese, native_vietnamese, other
            "source_language": "vietnamese",
            "chu_nom": "申嘲",              // Optional: Historical Chinese characters
            "notes": "Common greeting"       // Optional: Additional notes
        },
        "forms": [                          // Optional: Linguistic forms
            {
                "transcriptions": {
                    "tone_pattern": "low_falling_high_falling"  // Vietnamese tone pattern
                },
                "regional_variants": {      // Optional: Regional pronunciation variants
                    "northern": "sin chào",
                    "central": "xin chào",
                    "southern": "xin chào"
                }
            }
        ]
    }
]

Field Descriptions:
==================

Required Fields:
- "vietnamese": The Vietnamese word or phrase (string)

Optional Fields:
- "syllables": Array of syllables that make up the word
- "frequency": Number from 0-100 indicating how common the word is
- "pos": Array of part-of-speech tags (noun, verb, adjective, etc.)
- "etymology": Object containing word origin information
- "forms": Array of linguistic form variations

Etymology Object Fields:
- "origin": One of ["sino_vietnamese", "native_vietnamese", "french_loan", "english_loan", "other", "unknown"]
- "source_language": Source language of the word
- "chu_nom": Historical Chinese characters used to write this Vietnamese word
- "notes": Additional etymological information

Forms Object Fields:
- "transcriptions": Object with tone pattern information
- "regional_variants": Object with regional pronunciation differences

Sample Complete Entry:
======================

{
    "vietnamese": "học sinh",
    "syllables": ["học", "sinh"],
    "frequency": 78,
    "pos": ["noun"],
    "etymology": {
        "origin": "sino_vietnamese",
        "source_language": "chinese",
        "chu_nom": "學生",
        "notes": "From Chinese 學生 (xuéshēng), meaning student"
    },
    "forms": [
        {
            "transcriptions": {
                "tone_pattern": "high_rising_low_level"
            },
            "regional_variants": {
                "northern": "học sinh",
                "central": "học sinh",
                "southern": "học sinh"
            }
        }
    ]
}

Minimal Required Entry:
======================

{
    "vietnamese": "xin chào"
}

Common Part-of-Speech Tags:
==========================
- "noun": Danh từ
- "verb": Động từ
- "adjective": Tính từ
- "adverb": Trạng từ
- "pronoun": Đại từ
- "preposition": Giới từ
- "conjunction": Liên từ
- "interjection": Thán từ
- "classifier": Từ phân loại
- "particle": Tiểu từ

Vietnamese Tone Pattern Examples:
================================
- "high_level": Thanh ngang (a)
- "low_falling": Thanh huyền (à)
- "high_rising": Thanh sắc (á)
- "low_rising": Thanh hỏi (ả)
- "high_broken": Thanh ngã (ã)
- "low_broken": Thanh nặng (ạ)

Etymology Origin Categories:
============================
- "sino_vietnamese": Words from Chinese origin (about 60% of Vietnamese vocabulary)
- "native_vietnamese": Original Vietnamese words
- "french_loan": Words borrowed from French (colonial period)
- "english_loan": Modern English loanwords
- "other": Other language origins
- "unknown": Etymology uncertain

Special Considerations for Chinese Learners:
===========================================
The analyzer pays special attention to:
1. Sino-Vietnamese words that Chinese speakers can recognize
2. Chu Nom characters for historical character connections
3. Tone patterns that relate to Chinese tone systems
4. Etymology information to help Chinese speakers understand word origins

File Encoding:
=============
- All files must be saved in UTF-8 encoding
- Ensure Vietnamese diacritics are properly preserved
- Test with Vietnamese characters: á à ả ã ạ ă ắ ằ ẳ ẵ ặ â ấ ầ ẩ ẫ ậ đ é è ẻ ẽ ẹ ê ế ề ể ễ ệ í ì ỉ ĩ ị ó ò ỏ õ ọ ô ố ồ ổ ỗ ộ ơ ớ ờ ở ỡ ợ ú ù ủ ũ ụ ư ứ ừ ử ữ ự ý ỳ ỷ ỹ ỵ

Error Handling:
==============
The analyzer will gracefully handle:
- Missing optional fields
- Invalid frequency values (will default to 0)
- Empty arrays
- Missing files (will skip and continue with others)
- Invalid JSON syntax (will report error and skip file)

For questions about data format or to report issues, 
refer to the Vietnamese Vocabulary Analyzer documentation.
"""