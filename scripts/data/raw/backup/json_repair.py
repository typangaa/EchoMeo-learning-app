import re
import json
import logging

def extract_and_repair_json(text):
    """
    Extract JSON from text and attempt to repair common formatting issues.
    
    Args:
        text: Text that may contain JSON
        
    Returns:
        Parsed JSON object or None if extraction/parsing fails
    """
    try:
        # First try: Direct JSON parsing if the whole text is valid JSON
        try:
            return json.loads(text)
        except:
            pass
        
        # Second try: Extract JSON-like content using regex
        json_pattern = r'(\{[\s\S]*\})'
        match = re.search(json_pattern, text)
        
        if match:
            json_str = match.group(1)
            
            # Try parsing the extracted JSON
            try:
                return json.loads(json_str)
            except json.JSONDecodeError as e:
                # Common repair attempts for malformed JSON
                
                # 1. Fix missing commas between properties
                json_str = re.sub(r'"\s*\n\s*"', '",\n"', json_str)
                
                # 2. Fix trailing commas in arrays/objects
                json_str = re.sub(r',\s*}', '}', json_str)
                json_str = re.sub(r',\s*]', ']', json_str)
                
                # 3. Fix missing quotes around property names
                json_str = re.sub(r'{\s*([a-zA-Z0-9_]+)\s*:', r'{"\\1":', json_str)
                json_str = re.sub(r',\s*([a-zA-Z0-9_]+)\s*:', r',"\1":', json_str)
                
                # 4. Try to fix balanced braces/brackets
                open_braces = json_str.count('{')
                close_braces = json_str.count('}')
                if open_braces > close_braces:
                    json_str += "}" * (open_braces - close_braces)
                elif close_braces > open_braces:
                    json_str = "{" * (close_braces - open_braces) + json_str
                
                # 5. Try to fix unescaped quotes
                json_str = re.sub(r'(?<!\\)"(?=(.*":\s*)|.*,)', r'\\"', json_str)
                
                # Final attempt with repaired JSON
                try:
                    return json.loads(json_str)
                except json.JSONDecodeError:
                    # If still failing, try a more aggressive approach
                    pass
        
        # Third try: Manual field extraction
        # This is a last resort when JSON parsing fails completely
        result = {}
        
        # Try to extract the vocabulary item
        vocab_match = re.search(r'"(character|word)"\s*:\s*"([^"]+)"', text)
        if vocab_match:
            key_type = vocab_match.group(1)
            value = vocab_match.group(2)
            result[key_type] = value
        
        # Try to extract pinyin
        pinyin_match = re.search(r'"pinyin"\s*:\s*"([^"]+)"', text)
        if pinyin_match:
            result["pinyin"] = pinyin_match.group(1)
        
        # Try to extract meanings array
        meanings = []
        meaning_pattern = r'"english"\s*:\s*"([^"]+)".*?"vietnamese"\s*:\s*"([^"]+)"'
        for m in re.finditer(meaning_pattern, text, re.DOTALL):
            english = m.group(1)
            vietnamese = m.group(2)
            meanings.append({
                "english": english,
                "vietnamese": vietnamese
            })
        
        if meanings:
            result["meanings"] = meanings
        
        # Only return if we extracted some useful data
        if result and (("character" in result or "word" in result) and "meanings" in result):
            return result
        
        # If all attempts fail
        logging.error(f"All JSON extraction methods failed. Text content: {text[:200]}...")
        return None
    
    except Exception as e:
        logging.error(f"Error in JSON extraction: {e}")
        return None
