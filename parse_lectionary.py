from pypdf import PdfReader
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'
reader = PdfReader(pdf_path)

# Process all pages, extract F5 and F3 text with Y positions to understand table structure
for page_num in range(2, min(len(reader.pages), 19)):  # Pages 3-18
    page = reader.pages[page_num]
    content = page.get_contents()
    if hasattr(content, 'get_object'):
        content = content.get_object()
    raw = content.get_data().decode('latin-1')

    print(f'\n=== PAGE {page_num+1} ===')

    tokens = []
    pos = 0
    while pos < len(raw):
        # Font switch
        m = re.match(r'/F(\d+)\s+[\d.]+\s+Tf', raw[pos:])
        if m:
            tokens.append(('font', m.group(1)))
            pos += m.end()
            continue

        # Tm position
        m = re.match(r'([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+Tm', raw[pos:])
        if m:
            tokens.append(('pos', float(m.group(5)), float(m.group(6))))
            pos += m.end()
            continue

        # TD relative move
        m = re.match(r'([-\d.]+)\s+([-\d.]+)\s+TD', raw[pos:])
        if m:
            tokens.append(('td', float(m.group(1)), float(m.group(2))))
            pos += m.end()
            continue

        # Text string + Tj
        m = re.match(r'\(([^)]*)\)\s*Tj', raw[pos:])
        if m:
            tokens.append(('text', m.group(1)))
            pos += m.end()
            continue

        # TJ array
        m = re.match(r'\[([^\]]*)\]\s*TJ', raw[pos:])
        if m:
            strs = re.findall(r'\(([^)]*)\)', m.group(1))
            if strs:
                tokens.append(('text', ''.join(strs)))
            pos += m.end()
            continue

        pos += 1

    # Reconstruct text with positions
    current_font = None
    cx, cy = 0, 0

    for tok in tokens:
        if tok[0] == 'font':
            current_font = tok[1]
        elif tok[0] == 'pos':
            cx, cy = tok[1], tok[2]
        elif tok[0] == 'td':
            cx += tok[1]
            cy += tok[2]
        elif tok[0] == 'text':
            text = tok[1]
            # Only show F5 (psalm numbers) and F3 (day labels)
            if current_font in ('5', '3'):
                # Decode text - handle escape sequences
                clean = []
                i = 0
                bs = chr(92)  # backslash
                while i < len(text):
                    c = text[i]
                    if c == bs and i+1 < len(text):
                        nc = text[i+1]
                        if nc.isdigit():
                            # Octal escape
                            j = i+1
                            while j < len(text) and text[j].isdigit() and j < i+4:
                                j += 1
                            try:
                                clean.append(chr(int(text[i+1:j], 8)))
                            except:
                                pass
                            i = j
                        else:
                            clean.append(nc)
                            i += 2
                    elif ord(c) >= 32:
                        clean.append(c)
                        i += 1
                    else:
                        i += 1
                result = ''.join(clean).strip()
                if result:
                    print(f'  F{current_font} y={cy:.0f}: {repr(result)}')
