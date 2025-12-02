from docx2pdf import convert
from pathlib import Path

# Input and output paths
input_file = Path('d:/duolingo/duolearn/Section B/Section B/All section b.docx')
output_file = Path('d:/duolingo/duolearn/Section B/Section B/All section b.pdf')

# Convert to PDF
convert(str(input_file), str(output_file))

print(f'Successfully converted to PDF: {output_file}')
