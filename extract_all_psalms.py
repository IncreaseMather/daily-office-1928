import pdfplumber
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'

# Column positions for psalm numbers
LEFT_PSALM_X = (100, 185)   # x range for left psalm column
RIGHT_PSALM_X = (510, 570)  # x range for right psalm column
LEFT_LABEL_X = (40, 100)    # x range for day labels (left section)
RIGHT_LABEL_X = (440, 520)  # x range for day labels (right section)

def is_psalm_ref(text):
    """Check if text looks like a psalm reference (number, possibly with colon)"""
    # psalm numbers can be like: 25, 25, 9, 119:1-16, 40:1-16, etc.
    # Avoid lesson references which tend to be like book:chapter-verse formats
    # But psalm 119 sections ARE like 119:1-16
    t = text.strip().rstrip(',')
    if re.match(r'^\d+$', t):
        return True  # pure number
    if re.match(r'^\d+:\d+', t) and int(t.split(':')[0]) <= 150:
        return True  # psalm section
    return False

def clean_text(text):
    """Remove CID sequences from text"""
    # Replace (cid:N) with empty string
    text = re.sub(r'\(cid:\d+\)', '', text)
    return text.strip()

with pdfplumber.open(pdf_path) as pdf:
    print(f'Total pages: {len(pdf.pages)}')

    for page_num in range(2, min(19, len(pdf.pages))):  # pages 3-18
        page = pdf.pages[page_num]
        words = page.extract_words(x_tolerance=3, y_tolerance=3)

        print(f'\n{"="*60}')
        print(f'PAGE {page_num+1}')
        print(f'{"="*60}')

        # Group words by y position (row)
        rows = {}
        for w in words:
            y = round(w['top'] / 3) * 3  # group by 3-pt buckets
            if y not in rows:
                rows[y] = []
            rows[y].append(w)

        # Sort by y
        for y in sorted(rows.keys()):
            row_words = sorted(rows[y], key=lambda w: w['x0'])

            # Collect words from each column zone
            left_label = []
            left_psalms = []
            right_label = []
            right_psalms = []

            for w in row_words:
                x = w['x0']
                text = w['text']

                if LEFT_LABEL_X[0] <= x <= LEFT_LABEL_X[1]:
                    left_label.append(clean_text(text))
                elif LEFT_PSALM_X[0] <= x <= LEFT_PSALM_X[1]:
                    left_psalms.append(text)  # keep raw - these are F5 standard font
                elif RIGHT_LABEL_X[0] <= x <= RIGHT_LABEL_X[1]:
                    right_label.append(clean_text(text))
                elif RIGHT_PSALM_X[0] <= x <= RIGHT_PSALM_X[1]:
                    right_psalms.append(text)  # keep raw

            # Only print rows that have psalm data
            has_left = any(left_psalms)
            has_right = any(right_psalms)
            has_label = any(left_label) or any(right_label)

            if has_left or has_right or has_label:
                left_str = ' '.join(left_label) if left_label else ''
                left_ps = ' '.join(left_psalms) if left_psalms else ''
                right_str = ' '.join(right_label) if right_label else ''
                right_ps = ' '.join(right_psalms) if right_psalms else ''

                print(f'y={y:4.0f}: L_label={left_str!r:25} L_ps={left_ps!r:20} | R_label={right_str!r:25} R_ps={right_ps!r}')
