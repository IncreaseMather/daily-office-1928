"""
Analyze page 3 of the 1945 Tables PDF carefully.
We know:
- Advent 1 Sunday Morning Prayer = Psalms 25, 9
- Advent 1 Sunday Evening Prayer = Psalms 48, 126
- Lent 4 Sunday Evening Prayer = Psalms 116, 46, 122
- Monday after Lent 4 Evening Prayer = Psalm 91

Let me look at the structure of page 3 carefully to understand the layout.
"""
import pdfplumber
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'

def clean_text(text):
    """Remove CID sequences."""
    text = re.sub(r'\(cid:\d+\)', '?', text)
    return text.strip()

# The key insight: in the PDF the table is LANDSCAPE
# When pdfplumber extracts it, x runs left-right across the page
# Let's look at what x=130 and x=540 show across ALL rows

print("=== PAGE 3 ANALYSIS ===")
print("Looking for columns: x~130 (presumably MP psalms), x~540 (presumably EP psalms)")
print("Also looking at x~54 for day/week labels")
print()

with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[2]  # Page 3

    words = page.extract_words(x_tolerance=3, y_tolerance=3)

    # Sort by y position
    by_y = {}
    for w in words:
        y = round(w['top'])
        if y not in by_y:
            by_y[y] = []
        by_y[y].append(w)

    print("Row-by-row analysis of page 3:")
    print(f"{'y':>5} {'label@x54':>20} {'mp@x130':>20} {'lessons@x189':>25} {'ep@x540':>20} {'ep_lessons@x670':>25}")
    print("-"*120)

    for y in sorted(by_y.keys()):
        row = sorted(by_y[y], key=lambda w: w['x0'])

        label = []
        mp_psalm = []
        ep_psalm = []
        mp_lesson = []
        ep_lesson = []

        for w in row:
            x = w['x0']
            text = clean_text(w['text'])
            if not text or text == '?':
                continue

            if x < 90:
                label.append(f"[{x:.0f}]{text}")
            elif 90 <= x < 180:
                mp_psalm.append(f"[{x:.0f}]{text}")
            elif 180 <= x < 350:
                mp_lesson.append(f"[{x:.0f}]{text}")
            elif 350 <= x < 530:
                label.append(f"R[{x:.0f}]{text}")
            elif 530 <= x < 660:
                ep_psalm.append(f"[{x:.0f}]{text}")
            else:
                ep_lesson.append(f"[{x:.0f}]{text}")

        if mp_psalm or ep_psalm or (label and not all('?' in l for l in label)):
            print(f"{y:>5} {' '.join(label):>25} {' '.join(mp_psalm):>25} {' '.join(ep_psalm):>25}")

    print()
    print("=== LOOKING FOR 25, 9 and 48, 126 ===")
    print()

    # Find rows containing "25" "9" "48" "126"
    target_texts = {'25', '9', '48', '126', '50', '116', '46', '122', '91'}

    for y in sorted(by_y.keys()):
        row = sorted(by_y[y], key=lambda w: w['x0'])
        found = []
        for w in row:
            text = clean_text(w['text'])
            # Check if any target psalm appears in text
            for t in target_texts:
                if re.search(r'\b' + t + r'\b', text.replace('?', '').strip()):
                    found.append(f"'{text}' at x={w['x0']:.1f}")
            # Also check text that might have 25 or 9 embedded in CID strings
            raw = w['text']
            if any(f'>{t}<' in raw or raw.strip() == t for t in target_texts):
                found.append(f"'{text}' (raw match) at x={w['x0']:.1f}")

        if found:
            print(f"  y={y}: {', '.join(found)}")
