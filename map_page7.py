"""
Map page 7 of the 1945 Tables PDF to find the complete Lent 4 week.
Also look at page 7's F3 labels to identify all weeks on the page.
"""
import pdfplumber
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'

with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[6]  # Page 7

    print(f"PAGE 7 - Size: {page.width:.0f} x {page.height:.0f}")
    print()

    # Get all chars
    all_chars = page.chars

    # F5 chars (psalm numbers)
    f5_chars = [c for c in all_chars if 'OldStyle' in c.get('fontname', '')]
    # F3 chars (labels)
    f3_chars = [c for c in all_chars if 'MSTT' in c.get('fontname', '')]
    # Times-Italic (also readable sometimes)
    ti_chars = [c for c in all_chars if 'Times' in c.get('fontname', '')]

    # Build row-based view
    all_y = sorted(set(round(c['top']) for c in all_chars))

    print("Full page layout (all fonts):")
    print(f"{'y':>5} {'F3_label':>30} {'F5_mp':>20} {'F5_ep':>20}")
    print("-"*90)

    for y_target in range(50, 560, 1):
        nearby_f5 = [c for c in f5_chars if abs(c['top'] - y_target) < 2]
        nearby_f3 = [c for c in f3_chars if abs(c['top'] - y_target) < 2]
        nearby_ti = [c for c in ti_chars if abs(c['top'] - y_target) < 2]

        if not nearby_f5 and not nearby_f3 and not nearby_ti:
            continue

        # Build label from F3 and Times-Italic
        label_chars = sorted(nearby_f3 + nearby_ti, key=lambda c: c['x0'])
        label = ''.join(re.sub(r'\(cid:\d+\)', '?', c['text']) for c in label_chars if c['x0'] < 550)
        label_right = ''.join(re.sub(r'\(cid:\d+\)', '?', c['text']) for c in label_chars if 450 <= c['x0'] < 550)

        # Build MP psalms (x < 450)
        mp_chars = sorted([c for c in nearby_f5 if c['x0'] < 450], key=lambda c: c['x0'])
        mp_text = ''.join(c['text'] for c in mp_chars)

        # Build EP psalms (x >= 450)
        ep_chars = sorted([c for c in nearby_f5 if c['x0'] >= 450], key=lambda c: c['x0'])
        ep_text = ''.join(c['text'] for c in ep_chars)

        if label or mp_text or ep_text:
            # Clean up
            left_label = ''.join(re.sub(r'\(cid:\d+\)', '?', c['text']) for c in label_chars if c['x0'] < 200)
            right_label_ti = ''.join(c['text'] for c in ti_chars if abs(c['top'] - y_target) < 2 and 450 <= c['x0'] < 600)

            # Cluster mp and ep
            def cluster_text(chars_list):
                if not chars_list:
                    return ''
                clusters = []
                cur = []
                for c in sorted(chars_list, key=lambda c: c['x0']):
                    if cur and c['x0'] - (cur[-1]['x0'] + cur[-1].get('width', 4)) > 10:
                        clusters.append(''.join(cc['text'] for cc in cur))
                        cur = [c]
                    else:
                        cur.append(c)
                if cur:
                    clusters.append(''.join(cc['text'] for cc in cur))
                return ' | '.join(clusters)

            mp_clustered = cluster_text([c for c in nearby_f5 if c['x0'] < 450])
            ep_clustered = cluster_text([c for c in nearby_f5 if c['x0'] >= 450])

            print(f"{y_target:>5} L:{left_label[:20]:>22} R:{right_label_ti[:15]:>17} | MP: {mp_clustered[:30]:>32} | EP: {ep_clustered[:40]}")

print()
print("=== LENT 4 REGION (y=380-480) ===")
print()
with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[6]
    f5_chars = [c for c in page.chars if 'OldStyle' in c.get('fontname', '')]
    f3_chars = [c for c in page.chars if 'MSTT' in c.get('fontname', '')]
    ti_chars = [c for c in page.chars if 'Times' in c.get('fontname', '')]

    for y_target in range(380, 480):
        nearby_f5 = [c for c in f5_chars if abs(c['top'] - y_target) < 2]
        nearby_f3 = [c for c in f3_chars if abs(c['top'] - y_target) < 2]
        nearby_ti = [c for c in ti_chars if abs(c['top'] - y_target) < 2]

        if not nearby_f5 and not nearby_f3 and not nearby_ti:
            continue

        all_near = sorted(nearby_f5 + nearby_f3 + nearby_ti, key=lambda c: c['x0'])
        parts = []
        for c in all_near:
            font_short = 'F5' if 'OldStyle' in c.get('fontname', '') else ('TI' if 'Times' in c.get('fontname', '') else 'F3')
            text = re.sub(r'\(cid:\d+\)', '?', c['text'])
            if text and text not in ('?', ' '):
                parts.append(f"[{c['x0']:.0f},{font_short}]'{text}'")

        if parts:
            print(f"  y={y_target}: " + " ".join(parts))
