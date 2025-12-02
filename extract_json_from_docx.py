from pathlib import Path
from docx import Document
import json
import re

# Base directory
base_dir = Path('d:/duolingo/duolearn/Section B/Section B')

# Get all .json files (which are actually .docx)
json_files = sorted([f for f in base_dir.glob('Lesson_B*.json')])

print(f'Found {len(json_files)} files to convert')
print()

converted_count = 0
error_count = 0

for file in json_files:
    try:
        # Read the .docx content
        doc = Document(file)
        
        # Extract all text from the document
        full_text = []
        for para in doc.paragraphs:
            if para.text.strip():
                full_text.append(para.text.strip())
        
        # Join all text
        content = '\n'.join(full_text)
        
        # Try to find JSON in the content
        # Look for content between { and }
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        
        if json_match:
            json_str = json_match.group(0)
            
            # Validate it's proper JSON
            try:
                json_data = json.loads(json_str)
                
                # Write as proper JSON file
                with open(file, 'w', encoding='utf-8') as f:
                    json.dump(json_data, f, indent=2, ensure_ascii=False)
                
                print(f'[OK] Converted: {file.name}')
                converted_count += 1
            except json.JSONDecodeError:
                # If not valid JSON, write the text as-is
                with open(file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'[WARNING] Not valid JSON, saved as text: {file.name}')
                converted_count += 1
        else:
            # No JSON found, write all text
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'[WARNING] No JSON found, saved as text: {file.name}')
            converted_count += 1
            
    except Exception as e:
        print(f'[ERROR] Failed to convert {file.name}: {str(e)}')
        error_count += 1

print()
print(f'Successfully converted: {converted_count}')
print(f'Errors: {error_count}')
