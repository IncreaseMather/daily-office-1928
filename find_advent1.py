"""
Focus on finding the Advent 1 structure in the PDF.
We know:
- Advent 1 Sunday Morning = Psalms 25, 9
- Advent 1 Sunday Evening = Psalms 48, 126

The table layout is:
- Left column (x~126-150): Morning psalms
- Right column (x~535-560): Evening psalms

On page 3, y=93 shows Morning=50, Evening=48,126
On page 3, y=195 shows Morning starts with 25...

But where is "9" for Advent 1 Sunday morning?
And where is "48, 126" relative to "25"?

Let me look at the ACTUAL bytes being read for key rows.
"""
from pypdf import PdfReader
import pdfplumber
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'

print("=== PAGE 3 - All words around y=85-220 with precise positions ===")
print()
with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[2]

    words = page.extract_words(x_tolerance=5, y_tolerance=3)

    target_rows = [w for w in words if 85 <= w['top'] <= 220]

    for w in sorted(target_rows, key=lambda x: (round(x['top']/1.5)*1.5, x['x0'])):
        raw = w['text']
        clean = re.sub(r'\(cid:\d+\)', '?', raw)
        print(f"  x={w['x0']:6.1f} y={w['top']:6.1f} '{clean}'")

print()
print("=== Looking at 48, 126 area (EP column, y~93) ===")
print("=== and 25,9 area (MP column, y~195) ===")
print()

# Now look at the raw page content to understand what's happening
reader = PdfReader(pdf_path)
page_r = reader.pages[2]
content = page_r.get_contents()
if hasattr(content, 'get_object'):
    content = content.get_object()
raw = content.get_data().decode('latin-1')

# Find all text rendering commands with their positions
# Look for Tm (text matrix) followed by Tj or TJ
lines = raw.split('\n')

print("Looking at raw PDF content for psalm numbers in key region...")
# Track current font and position
font = None
x_pos = 0
y_pos = 0

i = 0
results = []
while i < len(lines):
    line = lines[i].strip()

    # Font change
    m = re.match(r'/F(\d+)\s+[\d.]+\s+Tf', line)
    if m:
        font = m.group(1)

    # Text matrix
    m = re.match(r'([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+Tm', line)
    if m:
        x_pos = float(m.group(5))
        y_pos = float(m.group(6))

    # Text show
    m = re.match(r'\(([^)]*)\)\s*Tj', line)
    if m:
        text = m.group(1)
        # Check if it's readable (standard chars)
        clean = re.sub(r'\\[0-9]{3}', '?', text)
        results.append((x_pos, y_pos, font, clean))

    # Also array show
    m = re.match(r'\[([^\]]*)\]\s*TJ', line)
    if m:
        content_str = m.group(1)
        strs = re.findall(r'\(([^)]*)\)', content_str)
        for s in strs:
            clean = re.sub(r'\\[0-9]{3}', '?', s)
            results.append((x_pos, y_pos, font, clean))

    i += 1

# Sort by y (which in PDF is bottom-up, so flip)
# PDF y increases upward, so higher y = lower on page
# The page height is 612, so screen_y = 612 - pdf_y

results.sort(key=lambda r: (-r[1], r[0]))

print(f"\nTotal text items: {len(results)}")
print(f"\nShowing items at PDF y coordinates (remember PDF y is bottom-up, page height=612):")
print(f"{'pdf_x':>8} {'pdf_y':>8} {'scr_y':>8} {'font':>6} text")
print("-"*60)

# Show items in range corresponding to page 3 y=85-220 (screen coords)
# screen_y = 612 - pdf_y, so pdf_y = 612 - screen_y
# screen_y 85-220 => pdf_y 392-527

for x, y, f, text in results:
    screen_y = 612 - y
    if 85 <= screen_y <= 220:
        printable = ''.join(c if 32 <= ord(c) < 127 else f'[{ord(c)}]' for c in text)
        print(f"{x:8.1f} {y:8.1f} {screen_y:8.1f} {f:>6} '{printable}'")
