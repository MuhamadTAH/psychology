from pathlib import Path

# Base directory
base_dir = Path('d:/duolingo/duolearn/Section B/Section B')

# Get all .json.json files
json_json_files = list(base_dir.glob('*.json.json'))

print(f'Found {len(json_json_files)} files with .json.json extension')

# Rename each file from .json.json to .json
for file in json_json_files:
    # Remove the extra .json
    new_name = file.with_suffix('')  # This removes the last .json
    file.rename(new_name)
    print(f'Renamed: {file.name} -> {new_name.name}')

print(f'\nSuccessfully renamed {len(json_json_files)} files')

# Now check what we have
json_files = sorted(list(base_dir.glob('Lesson_B*.json')))
print(f'\nTotal Lesson files now: {len(json_files)}')
