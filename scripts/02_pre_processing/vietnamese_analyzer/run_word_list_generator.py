#!/usr/bin/env python3
"""
Execute the word list generator and show results
"""

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import and run the generator
from generate_level_word_lists import main

if __name__ == "__main__":
    main()
