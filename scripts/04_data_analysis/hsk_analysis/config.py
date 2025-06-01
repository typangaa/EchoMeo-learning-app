# HSK Missing Vocabulary Analysis Configuration

# Data source paths (relative to project root)
RAW_DATA_PATH = "scripts/data/raw/exclusive"
ENRICHED_DATA_PATH = "scripts/data/enriched/vocabulary"

# HSK levels to analyze
HSK_LEVELS = [1, 2, 3, 4, 5, 6, 7]

# Analysis settings
SAMPLE_SIZE_PER_LEVEL = 50  # Max words to show in detailed text report per level
MAX_MEANINGS_TO_SHOW = 3    # Max meanings to include in reports

# Output settings
CREATE_TEXT_REPORT = True
CREATE_CSV_REPORT = True
CREATE_JSON_SUMMARY = True

# Report file prefixes
TEXT_REPORT_PREFIX = "missing_vocabulary_report"
CSV_REPORT_PREFIX = "missing_vocabulary"
JSON_SUMMARY_PREFIX = "analysis_summary"
