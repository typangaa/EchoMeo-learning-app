#!/usr/bin/env python3
"""
HSK Analyzer Module Init
Provides imports for the HSK vocabulary analysis system.
"""

# Make the module importable
__version__ = "1.0.0"
__author__ = "Vietnamese-Chinese Learning Project"
__description__ = "HSK Raw Data Analysis Module"

# Import main functions for easy access
from .data_extractor import extract_from_single_file, process_dataset, get_dataset_paths
from .data_analyzer import analyze_combined_data, analyze_individual_level, compare_datasets
from .report_generator import (
    generate_learning_recommendations, 
    generate_level_comparison,
    create_individual_level_reports,
    create_level_summary_text,
    create_level_csv
)
from .file_output import (
    create_comprehensive_output,
    create_comparison_report,
    generate_comparison_recommendations,
    create_comparison_summary_text,
    create_level_comparison_csv
)
from .console_output import (
    print_detailed_statistics,
    print_comparison_statistics,
    print_final_summary,
    print_output_locations,
    print_usage_recommendations,
    print_error_summary
)

__all__ = [
    # Data extraction
    'extract_from_single_file',
    'process_dataset', 
    'get_dataset_paths',
    
    # Data analysis
    'analyze_combined_data',
    'analyze_individual_level',
    'compare_datasets',
    
    # Report generation
    'generate_learning_recommendations',
    'generate_level_comparison',
    'create_individual_level_reports',
    'create_level_summary_text',
    'create_level_csv',
    
    # File output
    'create_comprehensive_output',
    'create_comparison_report', 
    'generate_comparison_recommendations',
    'create_comparison_summary_text',
    'create_level_comparison_csv',
    
    # Console output
    'print_detailed_statistics',
    'print_comparison_statistics',
    'print_final_summary',
    'print_output_locations',
    'print_usage_recommendations',
    'print_error_summary'
]
