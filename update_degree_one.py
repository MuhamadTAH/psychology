import re
import os
import glob
import json

base_dir = r"D:\duolingo\duolearn\public\VIdeo\DEGREE ONE"
page_path = r"D:\duolingo\duolearn\app\videom\page.tsx"

with open(page_path, 'r', encoding='utf-8') as f:
    page_content = f.read()

def time_to_seconds(time_str):
    # MM:SS -> seconds + frames
    # wait, earlier we did SS:FF mapping.
    # The txt has like "40:15". If it's SS:FF, then 40s + 15/24. 
    # Or is it MM:SS? Most timing text says e.g. "40:07", but the videos might be 1 minute long.
    # If the video is 1 minute, it's SS:FF.
    parts = list(map(int, time_str.split(':')))
    if len(parts) == 2:
        return round(parts[0] + parts[1]/24.0, 3)
    return 0

def get_timing(txt_path):
    if not os.path.exists(txt_path): return None
    questions = []
    with open(txt_path, 'r', encoding='utf-8') as f:
        text = f.read().lower()
        
    trigger_match = re.search(r'(show option|option appear|question appear).*?(\d+:\d+)', text)
    if not trigger_match: return None
    trigger_time = time_to_seconds(trigger_match.group(2))
    
    opts = []
    for line in text.split('\n'):
        m = re.search(r'option\s+([a-cx])\s+(\d+:\d+)\s+to\s+(the end|\d+:\d+)', line)
        if m:
            oid = m.group(1).lower()
            if oid == 'x': oid = 'b' # fallback
            start = time_to_seconds(m.group(2))
            end = 9999 if m.group(3) == 'the end' else time_to_seconds(m.group(3))
            opts.append({
                "id": oid,
                "label": f"Option {oid.upper()}",
                "isCorrect": oid == 'b', # standard is B
                "feedbackStart": start,
                "feedbackEnd": end
            })
        elif "feedback for option" in line:
            # e.g., only feedback for option B from 39:22 to the end
            m2 = re.search(r'option ([a-c]).*?(\d+:\d+) to (the end|\d+:\d+)', line)
            if m2:
                oid = m2.group(1).lower()
                start = time_to_seconds(m2.group(2))
                end = 9999 if m2.group(3) == 'the end' else time_to_seconds(m2.group(3))
                opts.append({
                    "id": oid,
                    "label": f"Option {oid.upper()}",
                    "isCorrect": oid == 'b',
                    "feedbackStart": start,
                    "feedbackEnd": end
                })
    
    # If standard ABC not fully parsed, generate defaults
    if not any(o['id'] == 'a' for o in opts):
        opts.append({"id": "a", "label": "Option A", "isCorrect": False, "feedbackStart": trigger_time, "feedbackEnd": trigger_time})
    if not any(o['id'] == 'b' for o in opts):
        opts.append({"id": "b", "label": "Option B", "isCorrect": True, "feedbackStart": trigger_time, "feedbackEnd": trigger_time})
    if not any(o['id'] == 'c' for o in opts):
        opts.append({"id": "c", "label": "Option C", "isCorrect": False, "feedbackStart": trigger_time, "feedbackEnd": trigger_time})
        
    def get_audio(opt_id, txt_path):
        d = os.path.dirname(txt_path)
        wav_path = os.path.join(d, f"Option {opt_id.upper()}.wav")
        if os.path.exists(wav_path):
            rel = "/VIdeo/DEGREE ONE/" + os.path.relpath(wav_path, base_dir).replace('\\', '/')
            return rel
        return None
        
    for o in opts:
        aud = get_audio(o['id'], txt_path)
        if aud: o['previewAudioSrc'] = aud
        
    opts.sort(key=lambda x: x['id'])
    
    prompt = "Spot the tactic." if "spot it" in txt_path.lower() else "What is your next move?"
    
    return {
        "id": "q-" + str(hash(txt_path))[:8],
        "triggerTime": trigger_time,
        "resumeTime": 9999,
        "prompt": prompt,
        "options": opts
    }

def get_thumbnail(folder_path):
    pngs = glob.glob(os.path.join(folder_path, "*.png"), recursive=False)
    if not pngs:
        pngs = glob.glob(os.path.join(folder_path, "*.jpg"), recursive=False)
    if pngs:
        return "/VIdeo/DEGREE ONE/" + os.path.relpath(pngs[0], base_dir).replace('\\', '/')
    return None

import ast
def process_lessons(content):
    # Regex approach for such a big array might be risky, but we can do it by replacing the block.
    # We will just rewrite DEGREE_ONE_LESSONS array manually and substitute it.
    pass

protocols = [
    ("protocol-1", 1, "Emergency Brake", "3-Second Pause", "Emergency Brake 3-Second Pause"),
    ("protocol-2", 2, "Disrespect Test", "Repeat Trigger", "Disrespect Test Repeat Trigger"),
    ("protocol-3", 3, "Nice Guy Trap", "No-JADE Rule", "Nice Guy Trap No-JADE Rule"),
    ("protocol-4", 4, "FOG Attack", "Internal Label", "FOG Attack Internal Label"),
    ("protocol-5", 5, "Reality Distortion", "Written Anchor", "Reality Distortion Written Anchor"),
    ("protocol-6", 6, "Frame Flip", "Refocus Statement", "Frame Flip Refocus Statement")
]

output_ts = "const DEGREE_ONE_LESSONS: Lesson[] = [\n"

video_types = [
    ("spot", "Spot It", "SPOT IT"),
    ("deconstruct", "Deconstruct", "DECONSTRUCT"),
    ("counter", "Counter", "COUNTER"),
    ("spar", "The Spar", "THE SPAR")
]

# We need to map DECONSTRUCT folder variations
def find_folder(base, name):
    for d in os.listdir(base):
        if d.lower() == name.lower() or d.lower() == name.lower().replace('deconstruct','decounstruct') or d.lower() == name.lower().replace('deconstruct','deconteruct'):
            return os.path.join(base, d)
    return os.path.join(base, name)

for p_id, p_num, p_title, p_desc, p_folder in protocols:
    output_ts += f'''  {{
    id: "{p_id}",
    number: {p_num},
    title: "{p_title}",
    description: "{p_desc}",
    videos: [
'''
    base_p_folder = os.path.join(base_dir, p_folder)
    
    for v_id, v_title, v_folder_name in video_types:
        v_folder = find_folder(base_p_folder, v_folder_name)
        if not os.path.exists(v_folder):
             v_folder = os.path.join(base_p_folder, v_folder_name) # fallback
             
        # find mp4s
        mp4s = glob.glob(os.path.join(v_folder, "*.mp4")) + glob.glob(os.path.join(v_folder, "*.mov"))
        if not mp4s:
            # missing video, but the user expects it
            vid_sub = f"/VIdeo/DEGREE ONE/{p_folder}/{v_folder_name}/Video with subtitle.mp4"
            vid_nosub = f"/VIdeo/DEGREE ONE/{p_folder}/{v_folder_name}/Video without subtitle.mp4"
        else:
            # simple heuristic: the longer name or "with" is sub
            with_sub = next((m for m in mp4s if "without" not in m.lower()), mp4s[0])
            without_sub = next((m for m in mp4s if "without" in m.lower()), mp4s[-1])
            vid_sub = "/VIdeo/DEGREE ONE/" + os.path.relpath(with_sub, base_dir).replace('\\', '/')
            vid_nosub = "/VIdeo/DEGREE ONE/" + os.path.relpath(without_sub, base_dir).replace('\\', '/')

        thumb = get_thumbnail(v_folder)
        q = get_timing(os.path.join(v_folder, "timing.txt"))
        
        output_ts += f'''      {{
        id: "{p_id}-{v_id}",
        title: "{v_title}",
        videoSrc: "{vid_sub}",
        videoSrcNoSub: "{vid_nosub}",
'''
        if thumb:
            output_ts += f'''        thumbnailSrc: "{thumb}",\n'''
        if q:
            # serialize q cleanly
            opts_str = ",\n              ".join(
                f'{{ id: "{o["id"]}", label: "{o["label"]}", isCorrect: {"true" if o["isCorrect"] else "false"}, feedbackStart: {o["feedbackStart"]}, feedbackEnd: {o["feedbackEnd"]}' + 
                (f', previewAudioSrc: "{o["previewAudioSrc"]}"' if "previewAudioSrc" in o else "") + " }"
                for o in q["options"]
            )
            output_ts += f'''        questions: [
          {{
            id: "{q["id"]}",
            triggerTime: {q["triggerTime"]},
            resumeTime: {q["resumeTime"]},
            prompt: "{q["prompt"]}",
            options: [
              {opts_str}
            ]
          }}
        ],
'''
        output_ts += "      },\n"
    output_ts += "    ],\n  },\n"
output_ts += "];"

start_idx = page_content.find('const DEGREE_ONE_LESSONS: Lesson[] = [')
end_idx = page_content.find('const DEGREE_TWO_LESSONS: Lesson[] = [')

if start_idx != -1 and end_idx != -1:
    new_page = page_content[:start_idx] + output_ts + "\n\n" + page_content[end_idx:]
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(new_page)
    print("Successfully updated DEGREE_ONE_LESSONS")
else:
    print("Could not find DEGREE_ONE_LESSONS bounds")

