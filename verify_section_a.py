from pathlib import Path

# Base directory
base_dir = Path('d:/duolingo/duolearn/Section A/Section A')

# Expected structure: 5 units (A1-A5), each with 5 lessons, each with 3 parts = 75 files total
expected_files = []

for unit in range(1, 6):  # A1 to A5
    for lesson in range(1, 6):  # 1 to 5
        for part in range(1, 4):  # Part 1 to Part 3
            expected_files.append(f"Lesson_A{unit}-{lesson}_Part_{part}.json")

# Get actual files
actual_files = sorted([f.name for f in base_dir.glob('Lesson_A*.json')])

print("=" * 70)
print("SECTION A VERIFICATION REPORT")
print("=" * 70)
print()

# Check count
print(f"[FILE COUNT]")
print(f"   Expected: {len(expected_files)} files")
print(f"   Found:    {len(actual_files)} files")
print(f"   Status:   {'PASS' if len(actual_files) == len(expected_files) else 'FAIL'}")
print()

# Check each file
missing_files = []
extra_files = []

for expected in expected_files:
    if expected not in actual_files:
        missing_files.append(expected)

for actual in actual_files:
    if actual not in expected_files:
        extra_files.append(actual)

# Report results
print("[COMPLETENESS CHECK]")
if not missing_files and not extra_files:
    print("   [OK] All expected files are present and no extra files found")
else:
    if missing_files:
        print(f"\n   [MISSING FILES] ({len(missing_files)}):")
        for f in missing_files:
            print(f"      - {f}")
    
    if extra_files:
        print(f"\n   [UNEXPECTED FILES] ({len(extra_files)}):")
        for f in extra_files:
            print(f"      - {f}")

print()
print("=" * 70)

if len(actual_files) == len(expected_files) and not missing_files and not extra_files:
    print("RESULT: Section A is complete with all 75 lessons!")
else:
    print("RESULT: Issues found. Please review above.")

print("=" * 70)
