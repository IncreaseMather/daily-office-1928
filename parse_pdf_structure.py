"""
Parse the 1945 Tables PDF to extract psalm appointments.
The PDF is landscape tables printed sideways in a portrait PDF.
Each page shows multiple weeks of data.

Structure per week:
- Sunday row: shows "Sunday" label + morning psalm(s) + evening psalm(s)
- Actually the table has: day label | MP psalms | EP psalms columns
"""
import pdfplumber
import re
import json

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'

def clean_ps(text):
    """Clean psalm text - remove cid sequences, normalize separators."""
    if not text:
        return ''
    # Remove CID sequences
    text = re.sub(r'\(cid:\d+\)', ' ', text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Remove leading/trailing special chars
    text = text.strip('*, \t')
    return text

def parse_psalm_refs(text):
    """Extract psalm references from text string."""
    text = clean_ps(text)
    if not text:
        return []

    refs = []
    # Split on comma and whitespace, but keep psalm 119 sections together
    # Pattern: numbers, possibly with colon and range
    for part in re.split(r'[,;\s]+', text):
        part = part.strip('*, \t')
        if not part:
            continue
        # Match pure number or psalm 119 section like 119:1-16
        if re.match(r'^\d+$', part):
            refs.append(part)
        elif re.match(r'^\d+:\d+', part):
            # Could be psalm 119:1-16 etc
            num = int(part.split(':')[0])
            if num <= 150:
                refs.append(part)
        elif re.match(r'^\d+$', part.split(':')[0] if ':' in part else part):
            num_str = part.split(':')[0]
            if num_str.isdigit() and int(num_str) <= 150:
                refs.append(part)
    return refs

# Now let's do a much more careful extraction
# First, let's dump raw word positions from ALL pages
print("Analyzing PDF structure...")

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")

    # Focus on pages 3-18 (indices 2-17)
    for page_idx in range(2, min(19, len(pdf.pages))):
        page = pdf.pages[page_idx]
        print(f"\n{'='*70}")
        print(f"PAGE {page_idx+1} - Size: {page.width:.0f} x {page.height:.0f}")
        print(f"{'='*70}")

        words = page.extract_words(x_tolerance=3, y_tolerance=3)

        # Print ALL words with their positions
        for w in sorted(words, key=lambda x: (round(x['top']/3)*3, x['x0'])):
            text = w['text']
            if '(cid:' in text:
                # Try to decode - just show byte values
                cleaned = re.sub(r'\(cid:\d+\)', '?', text)
                print(f"  x={w['x0']:6.1f} y={w['top']:6.1f} '{cleaned}' [has CIDs]")
            else:
                print(f"  x={w['x0']:6.1f} y={w['top']:6.1f} '{text}'")
