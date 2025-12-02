from pathlib import Path

# Base directory
base_dir = Path('d:/duolingo/duolearn/Section B/Section B')

# Get all .docx files
docx_files = list(base_dir.glob('*.docx'))

print(f'Found {len(docx_files)} .docx files to rename')

# Rename each file from .docx to .json
for file in docx_files:
    new_name = file.with_suffix('.json')
    file.rename(new_name)
    print(f'Renamed: {file.name} -> {new_name.name}')

print(f'\nSuccessfully renamed {len(docx_files)} files from .docx to .json')
