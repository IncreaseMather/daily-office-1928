"""
Find Lent 4 Sunday EP = 116, 46, 122 more broadly.
Also look at page 3 y=343 which has '91' in EP column.
"""
import pdfplumber
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'

def get_all_positions(page):
    """Get all OldStyleSeven-SC char positions."""
    f5_chars = [c for c in page.chars if 'OldStyle' in c.get('fontname', '')]
    return sorted(f5_chars, key=lambda c: (round(c['top']), c['x0']))

print("=== Searching for 116 near 46 near 122 ===")
print()

with pdfplumber.open(pdf_path) as pdf:
    for page_idx in range(2, min(20, len(pdf.pages))):
        page = pdf.pages[page_idx]
        chars = get_all_positions(page)

        # Find all '116' occurrences
        for i, c in enumerate(chars):
            text_at = ''.join(cc['text'] for cc in chars if
                              abs(cc['top'] - c['top']) < 3 and
                              abs(cc['x0'] - c['x0']) < 20)

            if '116' in text_at and c['text'] == '1' and i+2 < len(chars):
                # Check if next chars are 1, 6
                if chars[i+1]['text'] == '1' and chars[i+2]['text'] == '6':
                    x116 = c['x0']
                    y116 = c['top']

                    # Now look for 46 and 122 within ±20 y of this position
                    nearby = [cc for cc in chars if abs(cc['top'] - y116) < 20]
                    nearby_text = ''.join(cc['text'] for cc in nearby)

                    if '46' in nearby_text and '122' in nearby_text:
                        print(f"FOUND - Page {page_idx+1}, y={y116:.1f}, x={x116:.1f}")
                        # Print all nearby chars by row
                        by_row = {}
                        for cc in nearby:
                            ry = round(cc['top'])
                            if ry not in by_row:
                                by_row[ry] = []
                            by_row[ry].append(cc)
                        for ry in sorted(by_row.keys()):
                            row_text = ''.join(cc['text'] for cc in sorted(by_row[ry], key=lambda c: c['x0']))
                            row_xs = [(cc['x0'], cc['text']) for cc in sorted(by_row[ry], key=lambda c: c['x0'])]
                            print(f"  y={ry}: '{row_text}'")
                            # Show cluster breakdown
                            clusters = []
                            cur = []
                            for xx, txt in row_xs:
                                if cur and xx - cur[-1][0] > 7:
                                    clusters.append(cur)
                                    cur = [(xx, txt)]
                                else:
                                    cur.append((xx, txt))
                            if cur:
                                clusters.append(cur)
                            for cl in clusters:
                                cl_x = cl[0][0]
                                cl_text = ''.join(t for _, t in cl)
                                print(f"    cluster x={cl_x:.1f}: '{cl_text}'")
                        break  # Found on this page

print()
print("=== Looking at page 3 y=340-360 area (where '91' was found at y=343) ===")
print()
with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[2]
    chars = [c for c in page.chars if 'OldStyle' in c.get('fontname', '') and 330 <= c['top'] <= 400]

    # Group into rows
    by_row = {}
    for c in chars:
        ry = round(c['top'])
        if ry not in by_row:
            by_row[ry] = []
        by_row[ry].append(c)

    for ry in sorted(by_row.keys()):
        row = sorted(by_row[ry], key=lambda c: c['x0'])
        # Cluster
        clusters = []
        cur = []
        for c in row:
            if cur and c['x0'] - cur[-1]['x0'] > 7:
                clusters.append(cur)
                cur = [c]
            else:
                cur.append(c)
        if cur:
            clusters.append(cur)

        for cl in clusters:
            cl_text = ''.join(c['text'] for c in cl)
            cl_x = cl[0]['x0']
            print(f"  y={ry} x={cl_x:.1f}: '{cl_text}'")

print()
print("=== Looking at which week section contains y=343 on page 3 ===")
print("(looking at F3 labels near y=343)")
with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[2]
    # Get F3 chars near y=295-360
    f3_chars = [c for c in page.chars if 'MSTT' in c.get('fontname', '') and 290 <= c['top'] <= 365]
    by_row = {}
    for c in f3_chars:
        ry = round(c['top'] * 2) / 2
        if ry not in by_row:
            by_row[ry] = []
        by_row[ry].append(c)

    for ry in sorted(by_row.keys()):
        row = sorted(by_row[ry], key=lambda c: c['x0'])
        row_text = ''.join(c['text'] for c in row)
        row_text_clean = re.sub(r'\(cid:\d+\)', '?', row_text)
        if any(c['x0'] < 200 for c in row):
            side = 'LEFT'
        else:
            side = 'RIGHT'
        xs = [(c['x0'], re.sub(r'\(cid:\d+\)', '?', c['text'])) for c in row[:5]]
        print(f"  y={ry:.1f} [{side}]: '{row_text_clean[:40]}'  first_chars={xs[:4]}")
