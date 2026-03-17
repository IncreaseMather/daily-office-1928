"""
Decode the CID sequences to understand what text they represent.
We need to find the glyph-to-character mapping for F3 and F5 fonts.

Key insight: The F3 font has a custom encoding.
But we can use pdfplumber's char-level extraction to get positions.
"""
import pdfplumber
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'

print("=== PAGE 3 - Character-level extraction around y=85-220 ===")
print()

with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[2]

    # Extract chars individually
    chars = page.chars

    # Filter to y range
    target_chars = [c for c in chars if 85 <= c['top'] <= 220]

    print(f"Found {len(target_chars)} chars in range")
    print()

    # Group by y position
    by_y = {}
    for c in target_chars:
        y = round(c['top'] * 2) / 2
        if y not in by_y:
            by_y[y] = []
        by_y[y].append(c)

    for y in sorted(by_y.keys()):
        row = sorted(by_y[y], key=lambda c: c['x0'])
        # Show each char with its position and font
        parts = []
        for c in row:
            char_text = c['text']
            font = c.get('fontname', '?')
            x = c['x0']
            # Shorten font name
            if 'OldStyle' in font:
                fname = 'F5'
            elif 'F3' in font or 'Myriad' in font.lower() or len(font) > 10:
                fname = 'F3'
            else:
                fname = font[:6]
            parts.append(f"[{x:.0f},{fname}]'{char_text}'")
        print(f"  y={y:.1f}: " + " ".join(parts))

print()
print("=== FOCUS on rows with psalm 25 and 9 ===")
print()

# Now look for specific psalm patterns
# At y~195, we expect "25" in the morning column and psalm "9" somewhere
# We know confirmed: Advent 1 Sunday MP = 25, 9

# Let's look at the chars around x=126 at y=195
chars_195 = [c for c in chars if 190 <= c['top'] <= 200]
print("Chars at y~195:")
for c in sorted(chars_195, key=lambda c: c['x0']):
    font = c.get('fontname', '?')
    print(f"  x={c['x0']:.1f} y={c['top']:.1f} font={font} text='{c['text']}'")

print()
print("=== ALSO look at chars at y~93 (first week Sunday row) ===")
chars_93 = [c for c in chars if 88 <= c['top'] <= 98]
print("Chars at y~93:")
for c in sorted(chars_93, key=lambda c: c['x0']):
    font = c.get('fontname', '?')
    print(f"  x={c['x0']:.1f} y={c['top']:.1f} font={font} text='{c['text']}'")

print()
print("=== ALL unique font names on page 3 ===")
all_fonts = set(c.get('fontname', '?') for c in page.chars)
for f in sorted(all_fonts):
    print(f"  {f}")
