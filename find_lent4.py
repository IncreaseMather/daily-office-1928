"""
Find Lent 4 Sunday EP = 116, 46, 122
and Monday after Lent 4 EP = 91

Also look for 25, 9 together for Advent 1 Sunday MP

Strategy: extract ALL psalm positions from ALL pages,
then search for clusters matching known data.
"""
import pdfplumber
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'

def get_psalm_positions(page):
    """Get all psalm number positions using OldStyleSeven-SC font chars."""
    chars = page.chars

    # Group F5 (OldStyleSeven-SC) characters by row
    f5_chars = [c for c in chars if 'OldStyle' in c.get('fontname', '')]

    # Group into rows by y position
    rows = {}
    for c in f5_chars:
        y = round(c['top'] * 2) / 2
        if y not in rows:
            rows[y] = []
        rows[y].append(c)

    # Reconstruct text for each row, grouped by x-cluster
    row_texts = {}
    for y, chars_in_row in rows.items():
        chars_sorted = sorted(chars_in_row, key=lambda c: c['x0'])

        # Group into x-clusters (gap > 5 pts = new cluster)
        clusters = []
        current_cluster = []
        prev_x = None
        for c in chars_sorted:
            if prev_x is not None and c['x0'] - prev_x > 7:
                if current_cluster:
                    clusters.append(current_cluster)
                current_cluster = [c]
            else:
                current_cluster.append(c)
            prev_x = c['x0'] + c.get('width', 5)

        if current_cluster:
            clusters.append(current_cluster)

        row_clusters = [(
            min(c['x0'] for c in cl),
            ''.join(c['text'] for c in cl)
        ) for cl in clusters]

        row_texts[y] = row_clusters

    return row_texts

print("Scanning all pages for psalm patterns...")
print()

with pdfplumber.open(pdf_path) as pdf:
    for page_idx in range(2, min(20, len(pdf.pages))):
        page = pdf.pages[page_idx]
        row_texts = get_psalm_positions(page)

        # Look for rows containing our target psalms
        # Target: find "116" near "46" near "122" (Lent 4 Sunday EP)
        # Target: find "25" near "9" (Advent 1 Sunday MP)
        # Target: find "91" alone (Monday after Lent 4 EP)

        # First collect all rows
        all_rows = sorted(row_texts.keys())

        for y in all_rows:
            clusters = row_texts[y]
            texts = [t for x, t in clusters]
            all_text = ' '.join(texts)

            # Check for 116, 46, 122 pattern
            has_116 = any('116' in t for t in texts)
            has_46 = any(re.search(r'\b46\b', t) for t in texts)
            has_122 = any('122' in t for t in texts)

            if has_116 and has_46 and has_122:
                print(f"LENT 4 EP CANDIDATE - Page {page_idx+1}, y={y:.1f}:")
                for x, t in clusters:
                    print(f"    x={x:.1f}: '{t}'")

            # Check for Advent 1 MP: 25 and 9 on same row or adjacent
            has_25 = any(re.search(r'\b25\b', t) for t in texts)
            has_9_alone = any(re.match(r'^9$', t.strip()) for t in texts)

            if has_25 and has_9_alone:
                print(f"ADVENT 1 MP CANDIDATE - Page {page_idx+1}, y={y:.1f}:")
                for x, t in clusters:
                    print(f"    x={x:.1f}: '{t}'")

        # Also look at adjacent rows for 25 + 9
        for i, y1 in enumerate(all_rows[:-1]):
            y2 = all_rows[i+1]
            if abs(y2 - y1) < 15:  # Adjacent rows
                texts1 = [t for x, t in row_texts[y1]]
                texts2 = [t for x, t in row_texts[y2]]
                all_texts = texts1 + texts2

                has_25 = any(re.search(r'\b25\b', t) for t in all_texts)
                has_9 = any(re.match(r'^[\s]*9[\s]*$', t) for t in all_texts)

                if has_25 and has_9:
                    print(f"ADVENT 1 MP ADJACENT CANDIDATE - Page {page_idx+1}, y={y1:.1f}+{y2:.1f}:")
                    for x, t in row_texts[y1]:
                        print(f"    row1 x={x:.1f}: '{t}'")
                    for x, t in row_texts[y2]:
                        print(f"    row2 x={x:.1f}: '{t}'")

print()
print("Also looking for '91' alone in EP column (x>450)...")
with pdfplumber.open(pdf_path) as pdf:
    for page_idx in range(2, min(20, len(pdf.pages))):
        page = pdf.pages[page_idx]
        row_texts = get_psalm_positions(page)

        for y, clusters in sorted(row_texts.items()):
            for x, t in clusters:
                if x > 450 and re.match(r'^[\s]*91[\s]*$', t.strip()):
                    print(f"  '91' in EP col - Page {page_idx+1}, y={y:.1f}, x={x:.1f}: '{t}'")
