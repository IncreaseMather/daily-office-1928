"""
Comprehensive extraction of all psalm data from 1945 Tables PDF.

Strategy: For each page, extract all F5 (OldStyleSeven-SC) psalm text
clustered by y-position and x-position (left vs right column).

The table structure per week:
- Each week occupies a horizontal band
- Sunday has 2 sub-rows (2 sets of readings)
- Weekdays have 1 sub-row each
- LEFT column (x<400): One set of data (possibly morning or one section)
- RIGHT column (x>450): Another set of data

We'll use the following approach:
1. Extract all F5 text by position
2. Find week boundary markers (F3 header rows)
3. Map each row to a week and day
"""
import pdfplumber
import re
import json
from collections import defaultdict

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'

def get_text_clusters(chars, x_gap=12):
    """Group chars into text clusters based on x proximity."""
    if not chars:
        return []
    sorted_chars = sorted(chars, key=lambda c: c['x0'])
    clusters = []
    cur_cluster = [sorted_chars[0]]

    for c in sorted_chars[1:]:
        prev = cur_cluster[-1]
        if c['x0'] - (prev['x0'] + prev.get('width', 5)) > x_gap:
            clusters.append(cur_cluster)
            cur_cluster = [c]
        else:
            cur_cluster.append(c)
    clusters.append(cur_cluster)

    return [(
        min(c['x0'] for c in cl),
        ''.join(c['text'] for c in cl)
    ) for cl in clusters]

def extract_page_data(page):
    """Extract structured data from a page."""
    f5_chars = [c for c in page.chars if 'OldStyle' in c.get('fontname', '')]
    f3_chars = [c for c in page.chars if 'MSTT' in c.get('fontname', '')]
    ti_chars = [c for c in page.chars if 'Times' in c.get('fontname', '')]

    # Group by y position (round to nearest 0.5)
    rows = defaultdict(list)
    for c in f5_chars:
        y = round(c['top'] * 2) / 2
        rows[y].append(c)

    f3_rows = defaultdict(list)
    for c in f3_chars + ti_chars:
        y = round(c['top'] * 2) / 2
        f3_rows[y].append(c)

    # Get unique y values sorted
    all_ys = sorted(set(list(rows.keys()) + list(f3_rows.keys())))

    result = []
    for y in all_ys:
        f5 = rows.get(y, [])
        f3 = f3_rows.get(y, [])

        # Get F5 clusters
        left_f5 = [c for c in f5 if c['x0'] < 430]
        right_f5 = [c for c in f5 if c['x0'] >= 430]

        left_clusters = get_text_clusters(left_f5)
        right_clusters = get_text_clusters(right_f5)

        # Get F3 labels
        left_f3 = [c for c in f3 if c['x0'] < 430]
        right_f3 = [c for c in f3 if c['x0'] >= 430]

        left_label = ''.join(re.sub(r'\(cid:\d+\)', '?', c['text']) for c in sorted(left_f3, key=lambda c: c['x0']))
        right_label = ''.join(re.sub(r'\(cid:\d+\)', '?', c['text']) for c in sorted(right_f3, key=lambda c: c['x0']))

        if left_clusters or right_clusters or (left_label and '?' not in left_label) or (right_label and '?' not in right_label):
            result.append({
                'y': y,
                'left_label': left_label,
                'right_label': right_label,
                'left_clusters': left_clusters,
                'right_clusters': right_clusters
            })

    return result

# Focus on the area around Lent 4 on page 7
print("=== PAGE 7 DETAILED ANALYSIS ===")
print()
print("Columns: L_psalm (x<175), L_lesson (x=175-430), R_psalm (x=520-580), R_lesson (x=580-740)")
print()

with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[6]  # Page 7

    # Get chars
    f5_chars = [c for c in page.chars if 'OldStyle' in c.get('fontname', '')]
    f3_chars = [c for c in page.chars if 'MSTT' in c.get('fontname', '')]
    ti_chars = [c for c in page.chars if 'Times' in c.get('fontname', '')]

    # Find distinct y levels for F3 labels (week headers)
    f3_y_vals = sorted(set(round(c['top']) for c in f3_chars if c['x0'] < 120))
    print("LEFT week header y-positions (F3 at x<120):")
    for y in f3_y_vals:
        nearby = [c for c in f3_chars if abs(c['top'] - y) < 3 and c['x0'] < 200]
        text = ''.join(re.sub(r'\(cid:\d+\)', '?', c['text']) for c in sorted(nearby, key=lambda c: c['x0']))
        if text.strip():
            print(f"  y={y}: '{text}'")

    print()
    f3_y_right = sorted(set(round(c['top']) for c in f3_chars if 440 <= c['x0'] < 520))
    print("RIGHT week header y-positions (F3 at x=440-520):")
    for y in f3_y_right:
        nearby = [c for c in f3_chars if abs(c['top'] - y) < 3 and 440 <= c['x0'] < 520]
        text = ''.join(re.sub(r'\(cid:\d+\)', '?', c['text']) for c in sorted(nearby, key=lambda c: c['x0']))
        if text.strip():
            print(f"  y={y}: '{text}'")

    print()
    print("Reconstructing page structure, looking for week sections...")
    print()

    # For each y row with F5 data, show the psalm columns
    y_rows = defaultdict(list)
    for c in f5_chars:
        y = round(c['top'])
        y_rows[y].append(c)

    print(f"{'y':>5} {'L_psalm':>15} {'L_lesson':>30} | {'R_psalm':>15} {'R_lesson':>30}")
    print("-"*105)

    prev_y = 0
    for y in sorted(y_rows.keys()):
        if y - prev_y > 10 and prev_y > 0:
            print()  # Gap between sections
        prev_y = y

        row = sorted(y_rows[y], key=lambda c: c['x0'])

        # Column definitions
        L_psalm = [c for c in row if 120 <= c['x0'] <= 175]
        L_lesson = [c for c in row if 175 < c['x0'] <= 430]
        R_psalm = [c for c in row if 520 <= c['x0'] <= 580]
        R_lesson = [c for c in row if 580 < c['x0'] <= 740]

        def chars_to_text(chars_list):
            return get_text_clusters(chars_list)

        l_ps = ' '.join(t for _, t in get_text_clusters(L_psalm))
        l_ls = ' '.join(t for _, t in get_text_clusters(L_lesson))
        r_ps = ' '.join(t for _, t in get_text_clusters(R_psalm))
        r_ls = ' '.join(t for _, t in get_text_clusters(R_lesson))

        # Also check for F3/TI labels at this row (day names etc.)
        nearby_labels = [c for c in f3_chars + ti_chars if abs(c['top'] - y) < 2 and 440 <= c['x0'] <= 510]
        right_day_label = ''.join(c['text'] for c in sorted(nearby_labels, key=lambda c: c['x0']))

        if l_ps or r_ps:
            label_marker = f" [R:{right_day_label}]" if right_day_label else ""
            print(f"{y:>5} {l_ps:>15} {l_ls:>30} | {r_ps:>15} {r_ls:>30}{label_marker}")

print()
print("=== Page 7 - Look for 'IN LENT' text and surrounding context ===")
with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[6]
    # Find "IN LENT" chars
    all_chars = page.chars
    # Look for 'I', 'N', ' ', 'L', 'E', 'N', 'T' in sequence
    inlent_chars = [c for c in all_chars if c['text'] in 'INLENT' and 'OldStyle' in c.get('fontname', '')]
    if inlent_chars:
        y_il = inlent_chars[0]['top']
        print(f"IN LENT text at y~{y_il:.1f}")

        # Show context: 3 rows before and after
        context_y_min = y_il - 40
        context_y_max = y_il + 80

        nearby_f5 = [c for c in page.chars if 'OldStyle' in c.get('fontname', '') and context_y_min <= c['top'] <= context_y_max]
        nearby_f3 = [c for c in page.chars if 'MSTT' in c.get('fontname', '') and context_y_min <= c['top'] <= context_y_max]

        context_rows = defaultdict(list)
        for c in nearby_f5 + nearby_f3:
            y = round(c['top'])
            context_rows[y].append(c)

        for y in sorted(context_rows.keys()):
            row = sorted(context_rows[y], key=lambda c: c['x0'])
            parts = []
            for c in row:
                font = 'F5' if 'OldStyle' in c.get('fontname', '') else 'F3'
                text = re.sub(r'\(cid:\d+\)', '?', c['text'])
                if text and text not in ('?',):
                    parts.append(f"[{c['x0']:.0f},{font}]'{text}'")
            if parts:
                print(f"  y={y}: " + " ".join(parts))
