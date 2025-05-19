import os
import json
import math

# Configuration
INPUT_DIR = os.path.dirname(os.path.abspath(__file__))  # Current directory
OUTPUT_DIR = os.path.join(INPUT_DIR, "splits")
WORDS_PER_FILE = 75  # Target number of words per file

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)
    print(f"Created output directory: {OUTPUT_DIR}")

def process_file(file_path, hsk_level):
    """Process a single HSK JSON file and split it into smaller chunks."""
    # Load the JSON file
    print(f"Processing HSK {hsk_level} file: {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return

    # Get the total number of words and calculate how many files we'll need
    total_words = len(data)
    total_parts = math.ceil(total_words / WORDS_PER_FILE)
    
    print(f"HSK {hsk_level} contains {total_words} words, splitting into {total_parts} parts")
    
    # Split the data into chunks and save each chunk
    for i in range(total_parts):
        start_idx = i * WORDS_PER_FILE
        end_idx = min((i + 1) * WORDS_PER_FILE, total_words)
        chunk = data[start_idx:end_idx]
        
        # Create the output filename
        output_file = os.path.join(OUTPUT_DIR, f"hsk{hsk_level}-part{i+1}.json")
        
        # Save the chunk to a new file
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(chunk, f, ensure_ascii=False, indent=2)
            print(f"  Saved {len(chunk)} words to {output_file}")
        except Exception as e:
            print(f"  Error saving {output_file}: {e}")

def main():
    """Process all HSK JSON files in the input directory."""
    # Find all HSK JSON files
    for i in range(1, 8):  # HSK levels 1-7
        file_path = os.path.join(INPUT_DIR, f"{i}.json")
        if os.path.exists(file_path):
            process_file(file_path, i)
        else:
            print(f"HSK {i} file not found: {file_path}")
    
    print("Splitting completed!")

if __name__ == "__main__":
    main()
