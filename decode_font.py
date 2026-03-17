from pypdf import PdfReader
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'
reader = PdfReader(pdf_path)

# The font F3 uses a custom encoding. Let's try to find the ToUnicode map
# or the Differences array to decode it.

page = reader.pages[2]  # page 3
res = page['/Resources']
fonts = res['/Font']

print("=== Font Analysis ===")
for fname in fonts:
    font_obj = fonts[fname].get_object()
    print(f"\nFont {fname}:")
    print(f"  Subtype: {font_obj.get('/Subtype', 'N/A')}")
    print(f"  BaseFont: {font_obj.get('/BaseFont', 'N/A')}")

    # Get encoding
    enc = font_obj.get('/Encoding')
    if enc:
        if hasattr(enc, 'get_object'):
            enc_obj = enc.get_object()
        elif str(type(enc)).find('Indirect') >= 0:
            enc_obj = enc.get_object()
        else:
            enc_obj = enc
        print(f"  Encoding type: {type(enc_obj)}")
        if hasattr(enc_obj, 'keys'):
            for k in enc_obj:
                if k == '/Differences':
                    diff = enc_obj[k]
                    print(f"  Differences (first 100): {list(diff)[:100]}")

    # Get ToUnicode
    tou = font_obj.get('/ToUnicode')
    if tou:
        if hasattr(tou, 'get_object'):
            tou_obj = tou.get_object()
        else:
            tou_obj = tou
        try:
            data = tou_obj.get_data().decode('latin-1')
            print(f"  ToUnicode (first 500 chars): {data[:500]}")
        except:
            print(f"  ToUnicode: exists but unreadable")

    print()
