from pathlib import Path
import re

# Base directory
base_dir = Path('d:/duolingo/duolearn/Section B/Section B')

# Expected syllabus in order
expected_lessons = [
    # Unit B1: The Silver Tongue (NLP)
    ("B1-1", "Pacing and Leading", ["Part_1", "Part_2", "Part_3"]),
    ("B1-2", "Embedded Commands", ["Part_1", "Part_2", "Part_3"]),
    ("B1-3", "The Double Bind", ["Part_1", "Part_2", "Part_3"]),
    ("B1-4", "The Milton Model", ["Part_1", "Part_2", "Part_3"]),
    ("B1-5", "Review: The Hypnotist", ["Part_1", "Part_2", "Part_3"]),
    
    # Unit B2: The Frame Game
    ("B2-1", "Framing 101", ["Part_1", "Part_2", "Part_3"]),
    ("B2-2", "Anchoring", ["Part_1", "Part_2", "Part_3"]),
    ("B2-3", "Contrast Principle", ["Part_1", "Part_2", "Part_3"]),
    ("B2-4", "Labeling & Altercasting", ["Part_1", "Part_2", "Part_3"]),
    ("B2-5", "Review: The Architect", ["Part_1", "Part_2", "Part_3"]),
    
    # Unit B3: Social Engineering
    ("B3-1", "Social Proof", ["Part_1", "Part_2", "Part_3"]),
    ("B3-2", "Authority Hack", ["Part_1", "Part_2", "Part_3"]),
    ("B3-3", "Pretexting & Phishing", ["Part_1", "Part_2", "Part_3"]),
    ("B3-4", "Liking Bias", ["Part_1", "Part_2", "Part_3"]),
    ("B3-5", "Review: The Engineer", ["Part_1", "Part_2", "Part_3"]),
    
    # Unit B4: Emotional Leverage
    ("B4-1", "Scarcity", ["Part_1", "Part_2", "Part_3"]),
    ("B4-2", "Reciprocity", ["Part_1", "Part_2", "Part_3"]),
    ("B4-3", "Fear-Mongering", ["Part_1", "Part_2", "Part_3"]),
    ("B4-4", "Hope-Mongering", ["Part_1", "Part_2", "Part_3"]),
    ("B4-5", "Review: The Lever", ["Part_1", "Part_2", "Part_3"]),
    
    # Unit B5: Grand Review
    ("B5-1", "Language & Framing Review", ["Part_1", "Part_2", "Part_3"]),
    ("B5-2", "Social & Emotional Levers Review", ["Part_1", "Part_2", "Part_3"]),
    ("B5-3", "Salesman Simulation", ["Part_1", "Part_2", "Part_3"]),
    ("B5-4", "Politician Simulation", ["Part_1", "Part_2", "Part_3"]),
    ("B5-5", "Section B Boss Fight", ["Part_1", "Part_2", "Part_3"]),
]

# Get all lesson .json files (excluding combined file)
json_files = sorted([f for f in base_dir.glob('Lesson_B*.json')])

print("=" * 70)
print("SECTION B VERIFICATION REPORT")
print("=" * 70)
print()

# Count check
total_expected = sum(len(parts) for _, _, parts in expected_lessons)
print(f"[FILE COUNT]")
print(f"   Expected: {total_expected} files")
print(f"   Found:    {len(json_files)} files")
print(f"   Status:   {'PASS' if len(json_files) == total_expected else 'FAIL'}")
print()

# Verify each lesson
print("[SYLLABUS VERIFICATION]")
print()

all_correct = True
file_index = 0

for lesson_num, lesson_title, parts in expected_lessons:
    print(f"Unit {lesson_num.split('-')[0]} - Lesson {lesson_num}: {lesson_title}")
    
    for part in parts:
        if file_index < len(json_files):
            actual_file = json_files[file_index]
            expected_name = f"Lesson_{lesson_num}_{part}.json"
            
            if actual_file.name == expected_name:
                print(f"   [OK] {expected_name}")
            else:
                print(f"   [FAIL] Expected: {expected_name}")
                print(f"          Got:      {actual_file.name}")
                all_correct = False
            
            file_index += 1
        else:
            print(f"   [MISSING] Lesson_{lesson_num}_{part}.json")
            all_correct = False
    
    print()

# Critical checks
print("[CRITICAL CHECKS]")
print()

# Check B2-4 position (should be lesson 10, files 28-30)
b2_4_files = [f for f in json_files if 'B2-4' in f.name]
if b2_4_files:
    b2_4_index = json_files.index(b2_4_files[0])
    expected_position = 27  # 0-indexed, so position 28
    if b2_4_index == expected_position:
        print(f"   [OK] B2-4 'Labeling & Altercasting' is in correct position")
    else:
        print(f"   [FAIL] B2-4 position incorrect (found at index {b2_4_index}, expected {expected_position})")
        all_correct = False
else:
    print(f"   [FAIL] B2-4 files not found")
    all_correct = False

# Check B3-3 exists
b3_3_files = [f for f in json_files if 'B3-3' in f.name]
if len(b3_3_files) == 3:
    print(f"   [OK] B3-3 'Pretexting & Phishing' has all 3 parts")
else:
    print(f"   [FAIL] B3-3 should have 3 parts, found {len(b3_3_files)}")
    all_correct = False

print()
print("=" * 70)

if all_correct and len(json_files) == total_expected:
    print("RESULT: Section B is PERFECT and ready for the app!")
else:
    print("RESULT: Issues found. Please review the report above.")

print("=" * 70)
