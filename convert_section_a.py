from pathlib import Path
from docx import Document
import json
import re

# Base directory
base_dir = Path('d:/duolingo/duolearn/Section A/Section A')

print("=" * 70)
print("SECTION A - FILE CONVERSION")
print("=" * 70)
print()

# Step 1: Rename .docx to .json
print("Step 1: Renaming .docx files to .json...")
docx_files = list(base_dir.glob('*.docx'))
print(f"Found {len(docx_files)} .docx files")

for file in docx_files:
    new_name = file.with_suffix('.json')
    file.rename(new_name)

print(f"Renamed {len(docx_files)} files from .docx to .json")
print()

# Step 2: Convert Word documents to actual JSON text files
print("Step 2: Extracting JSON content from Word documents...")
json_files = sorted([f for f in base_dir.glob('Lesson_A*.json')])

converted_count = 0
error_count = 0

for file in json_files:
    try:
        # Read the .docx content (now named .json)
        doc = Document(file)
        
        # Extract all text from the document
        full_text = []
        for para in doc.paragraphs:
            if para.text.strip():
                full_text.append(para.text.strip())
        
        # Join all text
        content = '\n'.join(full_text)
        
        # Try to find JSON in the content
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        
        if json_match:
            json_str = json_match.group(0)
            
            # Validate it's proper JSON
            try:
                json_data = json.loads(json_str)
                
                # Write as proper JSON file
                with open(file, 'w', encoding='utf-8') as f:
                    json.dump(json_data, f, indent=2, ensure_ascii=False)
                
                converted_count += 1
            except json.JSONDecodeError:
                # If not valid JSON, write the text as-is
                with open(file, 'w', encoding='utf-8') as f:
                    f.write(content)
                converted_count += 1
        else:
            # No JSON found, write all text
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            converted_count += 1
            
    except Exception as e:
        print(f'[ERROR] Failed to convert {file.name}: {str(e)}')
        error_count += 1

print(f'\nSuccessfully converted: {converted_count}')
print(f'Errors: {error_count}')
print()
print("=" * 70)
