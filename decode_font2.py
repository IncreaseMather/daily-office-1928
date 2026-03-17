from pypdf import PdfReader
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'
reader = PdfReader(pdf_path)

# Fonts F2 and F3 use custom glyph names like G09, G0A etc.
# We need to look at the font's actual glyph set to decode them
# Let's look at the FontDescriptor to get the font data

page = reader.pages[2]
res = page['/Resources']
fonts = res['/Font']
f3 = fonts['/F3'].get_object()

# Get font descriptor
fd_ref = f3.get('/FontDescriptor')
if fd_ref:
    fd = fd_ref.get_object()
    print("Font Descriptor keys:", list(fd.keys()))
    # The actual font data is in FontFile or FontFile3
    for key in ['/FontFile', '/FontFile2', '/FontFile3']:
        ff = fd.get(key)
        if ff:
            print(f"Found {key}")
            ff_obj = ff.get_object()
            try:
                data = ff_obj.get_data()
                print(f"Font data length: {len(data)}")
                # Print first 200 bytes as text
                print(f"First 200 bytes: {repr(data[:200])}")
            except Exception as e:
                print(f"Error getting font data: {e}")

# Also look at the ToUnicode map for F3
tou = f3.get('/ToUnicode')
if tou:
    tou_obj = tou.get_object()
    try:
        data = tou_obj.get_data().decode('latin-1')
        print(f"\nToUnicode map for F3:\n{data[:2000]}")
    except Exception as e:
        print(f"ToUnicode error: {e}")
else:
    print("No ToUnicode for F3")

# Look at F5's ToUnicode which works (standard font)
f5 = fonts['/F5'].get_object()
tou5 = f5.get('/ToUnicode')
if tou5:
    tou5_obj = tou5.get_object()
    try:
        data = tou5_obj.get_data().decode('latin-1')
        print(f"\nToUnicode for F5 (first 500):\n{data[:500]}")
    except Exception as e:
        print(f"ToUnicode F5 error: {e}")

# Check if there's a CharProcs or other embedded data
print("\nF3 object keys:", list(f3.keys()))
