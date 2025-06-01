# Vietnamese Missing Vocabulary Analysis Configuration

# Data source paths (relative to project root)
VIETNAMESE_RAW_DATA_PATH = "scripts/data/vietnamese_generated"
VIETNAMESE_ENRICHED_DATA_PATH = "scripts/data/enriched/vietnamese_vocabulary"

# Raw data files to analyze
RAW_FILES = [
    "vietnamese_raw_1.json"
]

# Enriched data files to analyze
ENRICHED_FILES = [
    "vietnamese_enriched.json"
]

# Analysis settings
SAMPLE_SIZE_HIGH_PRIORITY = 50    # Max high-priority words to show in detailed text report
SAMPLE_SIZE_OTHER = 100          # Max other words to show in detailed text report
MAX_MEANINGS_TO_SHOW = 3         # Max meanings to include in reports

# Frequency thresholds for categorization
FREQUENCY_THRESHOLDS = {
    'very_high': 80,
    'high': 60,
    'medium': 40,
    'low': 20
    # anything below 'low' is considered 'very_low'
}

# Output settings
CREATE_TEXT_REPORT = True
CREATE_CSV_REPORT = True
CREATE_JSON_SUMMARY = True

# Report file prefixes
TEXT_REPORT_PREFIX = "vietnamese_missing_report"
CSV_REPORT_PREFIX = "vietnamese_missing"
JSON_SUMMARY_PREFIX = "vietnamese_analysis_summary"

# Priority categories for missing words
PRIORITY_CATEGORIES = {
    'high': ['very_high', 'high'],     # High frequency words
    'medium': ['medium'],              # Medium frequency words
    'low': ['low', 'very_low']         # Low frequency words
}
