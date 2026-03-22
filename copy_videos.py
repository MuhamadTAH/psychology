import shutil
import os
import sys

def copy_with_progress(src, dst):
    print(f"Copying {os.path.basename(src)}...")
    try:
        shutil.copy2(src, dst)
        print(" -> Done!")
    except Exception as e:
        print(" -> Error:", e)

files = [
    (r"D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\DECOUNSTRUCT\DECONSTRUCT video with subtitile.mp4", r"public\VIdeo\degree1_nice_deconstruct_sub.mp4"),
    (r"D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\DECOUNSTRUCT\DECONSTRUCT video without subtitile.mp4", r"public\VIdeo\degree1_nice_deconstruct_nosub.mp4"),
    (r"D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\COUNTER\COUNTERwith subtitle.mp4", r"public\VIdeo\degree1_nice_counter_sub.mp4"),
    (r"D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\COUNTER\COUNTER without subtitle.mp4", r"public\VIdeo\degree1_nice_counter_nosub.mp4"),
    (r"D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\THE SPAR\THE SPAR VIDEO WITH SUBTITLE.mp4", r"public\VIdeo\degree1_nice_thespar_sub.mp4"),
    (r"D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\THE SPAR\THE SPAR VIDEO WITHOUT SUBTITLE.mp4", r"public\VIdeo\degree1_nice_thespar_nosub.mp4"),
    (r"D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\THE SPAR\Option A.wav", r"public\VIdeo\degree1_nice_thespar_option_a.wav"),
    (r"D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\THE SPAR\Option B.wav", r"public\VIdeo\degree1_nice_thespar_option_b.wav"),
    (r"D:\Video\Dark phycology video\COURSE\DEGREE ONE\Stop being nice\THE SPAR\Option C.wav", r"public\VIdeo\degree1_nice_thespar_option_c.wav")
]

print("Starting to copy files...\n")
for src, dst in files:
    copy_with_progress(src, dst)
print("\nAll files copied successfully!")
