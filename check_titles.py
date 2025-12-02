from pathlib import Path
import json

# Base directory
base_dir = Path('d:/duolingo/duolearn/Section B/Section B')

# Expected titles from the syllabus checklist
expected_titles = {
    "B1-1": "Pacing and Leading",
    "B1-2": "Embedded Commands",
    "B1-3": "The Double Bind",
    "B1-4": "The Milton Model",
    "B1-5": "Review: The Hypnotist",
    "B2-1": "Framing 101",
    "B2-2": "Anchoring",
    "B2-3": "Contrast Principle",
    "B2-4": "Labeling & Altercasting",
    "B2-5": "Review: The Architect",
    "B3-1": "Social Proof",
    "B3-2": "Authority Hack",
    "B3-3": "Pretexting & Phishing",
    "B3-4": "Liking Bias",
    "B3-5": "Review: The Engineer",
    "B4-1": "Scarcity",
    "B4-2": "Reciprocity",
    "B4-3": "Fear-Mongering",
    "B4-4": "Hope-Mongering",
    "B4-5": "Review: The Lever",
    "B5-1": "Language & Framing Review",
    "B5-2": "Social & Emotional Levers Review",
    "B5-3": "Salesman Simulation",
    "B5-4": "Politician Simulation",
    "B5-5": "Section B Boss Fight"
}

# Get all lesson files
json_files = sorted([f for f in base_dir.glob('Lesson_B*.json')])

print("=" * 70)
print("CHECKING LESSON TITLES INSIDE FILES")
print("=" * 70)
print()

issues_found = []
checked_lessons = set()

for file in json_files:
    # Extract lesson number (e.g., B1-1) from filename
    lesson_id = file.stem.split('_')[1]  # e.g., "B1-1" from "Lesson_B1-1_Part_1"
    
    # Skip if already checked this lesson
    if lesson_id in checked_lessons:
        continue
    
    checked_lessons.add(lesson_id)
    
    try:
        # Read the file content
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Try to parse as JSON
            try:
                data = json.loads(content)
                # Look for title field (could be 'title', 'lessonTitle', 'name', etc.)
                actual_title = data.get('title') or data.get('lessonTitle') or data.get('name') or "NOT FOUND"
            except json.JSONDecodeError:
                # If not valid JSON, just search for the expected title in text
                actual_title = "NOT VALID JSON"
        
        expected_title = expected_titles.get(lesson_id, "UNKNOWN")
        
        # Check if titles match
        if actual_title == "NOT VALID JSON":
            print(f"[WARNING] {lesson_id}: File is not valid JSON")
            issues_found.append(f"{lesson_id}: Not valid JSON")
        elif actual_title == "NOT FOUND":
            print(f"[INFO] {lesson_id}: No title field found in JSON")
            # Check if expected title appears anywhere in content
            if expected_title.lower() in content.lower():
                print(f"       Expected title '{expected_title}' found in content")
            else:
                print(f"       Expected title '{expected_title}' NOT found in content")
                issues_found.append(f"{lesson_id}: Title '{expected_title}' not found")
        elif expected_title.lower() in actual_title.lower() or actual_title.lower() in expected_title.lower():
            print(f"[OK] {lesson_id}: '{actual_title}'")
        else:
            print(f"[FAIL] {lesson_id}:")
            print(f"       Expected: '{expected_title}'")
            print(f"       Got:      '{actual_title}'")
            issues_found.append(f"{lesson_id}: Title mismatch")
    
    except Exception as e:
        print(f"[ERROR] {lesson_id}: Could not read file - {str(e)}")
        issues_found.append(f"{lesson_id}: Read error")

print()
print("=" * 70)

if not issues_found:
    print("RESULT: All lesson titles are correct!")
else:
    print(f"RESULT: Found {len(issues_found)} issues")
    for issue in issues_found:
        print(f"  - {issue}")

print("=" * 70)
