from pypdf import PdfReader
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'
reader = PdfReader(pdf_path)

# The PDF has rotated text (0 15 -15 0 x y Tm = 90 degree rotation)
# We need to extract text with actual X positions to group columns

def decode_pdf_string(s):
    """Decode PDF string escapes"""
    result = []
    i = 0
    bs = chr(92)
    while i < len(s):
        c = s[i]
        if c == bs and i+1 < len(s):
            nc = s[i+1]
            if nc.isdigit():
                # Octal escape
                j = i+1
                while j < len(s) and s[j].isdigit() and j < i+4:
                    j += 1
                try:
                    result.append(chr(int(s[i+1:j], 8)))
                except:
                    pass
                i = j
            elif nc == 'n':
                result.append('\n')
                i += 2
            elif nc == 'r':
                result.append('\r')
                i += 2
            elif nc == 't':
                result.append('\t')
                i += 2
            else:
                result.append(nc)
                i += 2
        elif ord(c) >= 32:
            result.append(c)
            i += 1
        else:
            i += 1
    return ''.join(result)

def extract_page_elements(page_num):
    """Extract all text elements with positions from a page"""
    page = reader.pages[page_num]
    content = page.get_contents()
    if hasattr(content, 'get_object'):
        content = content.get_object()
    raw = content.get_data().decode('latin-1')

    elements = []
    pos = 0
    current_font = None
    # Text matrix: a b c d tx ty
    tm_a, tm_b, tm_c, tm_d = 1, 0, 0, 1
    tx, ty = 0, 0
    # TD moves
    td_x, td_y = 0, 0

    while pos < len(raw):
        # Font switch
        m = re.match(r'/F(\d+)\s+[\d.]+\s+Tf', raw[pos:])
        if m:
            current_font = m.group(1)
            pos += m.end()
            continue

        # Tm position - sets complete text matrix
        m = re.match(r'([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+Tm', raw[pos:])
        if m:
            tm_a = float(m.group(1))
            tm_b = float(m.group(2))
            tm_c = float(m.group(3))
            tm_d = float(m.group(4))
            tx = float(m.group(5))
            ty = float(m.group(6))
            td_x, td_y = 0, 0
            pos += m.end()
            continue

        # TD relative move - TD tx ty
        m = re.match(r'([-\d.]+)\s+([-\d.]+)\s+TD', raw[pos:])
        if m:
            td_x += float(m.group(1)) * abs(tm_a if tm_a != 0 else tm_d)
            td_y += float(m.group(2)) * abs(tm_d if tm_d != 0 else tm_a)
            pos += m.end()
            continue

        # Text string + Tj
        m = re.match(r'\(([^)]*)\)\s*Tj', raw[pos:])
        if m:
            text = decode_pdf_string(m.group(1))
            text = text.strip()
            if text and current_font:
                # For rotated text (a=0, b>0, c<0, d=0):
                # The "x" in page coords is ty + td movements
                # The "y" in page coords is tx + td movements
                # Use tx as x-column position, ty as y-row position
                elements.append({
                    'font': current_font,
                    'tx': tx,
                    'ty': ty,
                    'td_x': td_x,
                    'td_y': td_y,
                    'text': text,
                    'tm_a': tm_a, 'tm_b': tm_b, 'tm_c': tm_c, 'tm_d': tm_d
                })
            pos += m.end()
            continue

        # TJ array
        m = re.match(r'\[([^\]]*)\]\s*TJ', raw[pos:])
        if m:
            strs = re.findall(r'\(([^)]*)\)', m.group(1))
            combined = ''.join(decode_pdf_string(s) for s in strs).strip()
            if combined and current_font:
                elements.append({
                    'font': current_font,
                    'tx': tx,
                    'ty': ty,
                    'td_x': td_x,
                    'td_y': td_y,
                    'text': combined,
                    'tm_a': tm_a, 'tm_b': tm_b, 'tm_c': tm_c, 'tm_d': tm_d
                })
            pos += m.end()
            continue

        pos += 1

    return elements

# Show all elements from page 3 with their coordinates
print("=== PAGE 3 (Advent 1) - All F3 and F5 elements ===")
elements = extract_page_elements(2)
print(f"Total elements: {len(elements)}")
print(f"\nFirst element matrix: {elements[0] if elements else 'none'}")

# Separate by font and show with coordinates
for e in elements:
    if e['font'] in ('3', '5'):
        print(f"Font{e['font']} tx={e['tx']:.1f} ty={e['ty']:.1f} td=({e['td_x']:.1f},{e['td_y']:.1f}) a={e['tm_a']:.1f} b={e['tm_b']:.1f} c={e['tm_c']:.1f} d={e['tm_d']:.1f}: {repr(e['text'])}")
