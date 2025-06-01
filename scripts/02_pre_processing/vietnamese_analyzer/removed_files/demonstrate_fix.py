#!/usr/bin/env python3
"""
Demonstration that the KeyError is fixed.
"""

from collections import Counter

# This demonstrates the original problem
def demonstrate_original_error():
    print("=== Demonstrating Original Error ===")
    
    # Create a Counter object
    tone_patterns = Counter({'high_rising': 5, 'low_falling': 3, 'mid_level': 2})
    
    # Convert to dict using most_common() - this was the original approach
    tone_distribution_dict = dict(tone_patterns.most_common())
    print(f"As dict: {tone_distribution_dict}")
    print(f"Type: {type(tone_distribution_dict)}")
    
    try:
        # This will cause the KeyError because dicts can't be sliced
        result = tone_distribution_dict[:5]
        print(f"Slicing result: {result}")
    except Exception as e:
        print(f"❌ Error when slicing dict: {e}")
        print(f"Error type: {type(e).__name__}")

def demonstrate_fix():
    print("\n=== Demonstrating Fix ===")
    
    # Create a Counter object
    tone_patterns = Counter({'high_rising': 5, 'low_falling': 3, 'mid_level': 2})
    
    # Keep as list - this is the fix
    tone_distribution_list = list(tone_patterns.most_common())
    print(f"As list: {tone_distribution_list}")
    print(f"Type: {type(tone_distribution_list)}")
    
    try:
        # This works because lists can be sliced
        result = tone_distribution_list[:5]
        print(f"✅ Slicing result: {result}")
        
        # Show how it would be used in the report generator
        print("\nUsing in report:")
        for tone_pattern, count in tone_distribution_list[:5]:
            percentage = (count / sum(tone_patterns.values())) * 100
            print(f"  {tone_pattern}: {count} ({percentage:.1f}%)")
            
    except Exception as e:
        print(f"❌ Error when slicing list: {e}")

if __name__ == "__main__":
    demonstrate_original_error()
    demonstrate_fix()
    print("\n🎉 The fix ensures that tone_distribution and pos_distribution remain as lists!")
