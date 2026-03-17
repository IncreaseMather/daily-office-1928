from pypdf import PdfReader
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'
reader = PdfReader(pdf_path)

page = reader.pages[2]
res = page['/Resources']
fonts = res['/Font']
f3 = fonts['/F3'].get_object()

fd_ref = f3.get('/FontDescriptor')
fd = fd_ref.get_object()
ff3_ref = fd.get('/FontFile3')
ff3_obj = ff3_ref.get_object()
data = ff3_obj.get_data()

# The font binary data contains glyph names in ASCII
# Let's look for readable strings in the font data
print("Font data as text (looking for glyph names):")
text = data.decode('latin-1')
# Find sequences of printable ASCII characters that look like glyph names
readable = re.findall(r'[A-Za-z][A-Za-z0-9_.-]{2,30}', text)
print("Readable strings in font:")
for s in readable[:100]:
    print(f"  {repr(s)}")

# The font has glyph names like G00, G01... let's find the mapping
# The CharSet in the FontDescriptor should tell us what glyphs are in the font
charset = fd.get('/CharSet')
if charset:
    print(f"\nCharSet: {charset}")

# Find all G?? patterns
glyph_refs = re.findall(r'G[0-9A-Fa-f]{2}', text)
unique_glyphs = sorted(set(glyph_refs))
print(f"\nUnique glyph refs: {unique_glyphs}")

# The encoding object should map character codes to glyph names
enc_ref = f3.get('/Encoding')
enc_obj = enc_ref.get_object()
print(f"\nEncoding type: {enc_obj.get('/Type', 'N/A')}")
base_enc = enc_obj.get('/BaseEncoding', 'N/A')
print(f"BaseEncoding: {base_enc}")

# Get the Differences array (shows which char codes map to which glyphs)
diffs = enc_obj.get('/Differences')
if diffs:
    print(f"\nDifferences array:")
    current_code = None
    for item in diffs:
        if isinstance(item, int):
            current_code = item
        else:
            glyph_name = str(item)
            print(f"  Code {current_code} -> {glyph_name}")
            if current_code is not None:
                current_code += 1

# Now we need to figure out what the glyph names mean
# G00, G01, etc. are probably ligatures or special chars
# The font has 45 chars (FirstChar=1, LastChar=45)
# The characters used in F3 text are: bytes 1-45

print("\n\nLet me look at what actual characters appear in F3 text on the page:")
content = page.get_contents()
if hasattr(content, 'get_object'):
    content = content.get_object()
raw = content.get_data().decode('latin-1')

# Find all F3 text strings
font = None
f3_texts = []
pos = 0
while pos < len(raw):
    m = re.match(r'/F(\d+)\s+[\d.]+\s+Tf', raw[pos:])
    if m:
        font = m.group(1)
        pos += m.end()
        continue
    m = re.match(r'\(([^)]*)\)\s*Tj', raw[pos:])
    if m and font == '3':
        f3_texts.append(m.group(1))
        pos += m.end()
        continue
    m = re.match(r'\[([^\]]*)\]\s*TJ', raw[pos:])
    if m and font == '3':
        strs = re.findall(r'\(([^)]*)\)', m.group(1))
        f3_texts.extend(strs)
        pos += m.end()
        continue
    pos += 1

print(f"\nF3 text strings found: {len(f3_texts)}")
# Show unique byte values used
all_bytes = set()
for s in f3_texts:
    for c in s:
        all_bytes.add(ord(c))

print(f"Byte values used in F3: {sorted(all_bytes)}")
print(f"As hex: {[hex(b) for b in sorted(all_bytes)]}")

# The font has FirstChar=1, LastChar=45
# From the glyph list in the binary: G00,G06,G07...G25 and also G00-G1E pattern
# We need to find what each byte code maps to
#
# The widths array tells us char width for each char code
widths = f3.get('/Widths')
first_char = int(f3.get('/FirstChar', 0))
print(f"\nFont widths (char code -> width):")
for i, w in enumerate(widths):
    code = first_char + i
    if code in all_bytes:
        print(f"  Code {code} (hex {hex(code)}) width={w}")

# The differences map tells us code -> glyph name
# G01 probably = 'S', G02 = 'u', etc (common abbreviated day names?)
# Let's try to figure this out from context
#
# We know the F3 strings appear as day labels:
# Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
# Also "Morning" and "Evening" labels
# Also week names like "First Sunday in Advent"
#
# The unique bytes used: let's print them in sequence for each string
print("\nF3 strings (raw bytes):")
for s in f3_texts[:20]:
    bytes_list = [hex(ord(c)) for c in s if ord(c) >= 0]
    print(f"  {repr(s)} -> bytes: {bytes_list}")
