"""
Count week sections per page and understand the true table structure.
Look at page 3 which has "48, 126" (Advent 1 EP) and "25" (likely Advent 1 MP).

The key question: how does the page layout map to weeks?

Actually, let me reconsider the structure entirely.
The PDF is a landscape table (11" wide x 8.5" tall).
But pdfplumber reads it as portrait (8.5" wide x 11" tall = 612 x 792 pts).
That means x and y might be SWAPPED from the visual layout!

Wait - pdfplumber shows width=792 x height=612, which means it IS reading it landscape.
So x runs left to right (0-792) and y runs top to bottom (0-612).

The table has columns for:
Day | Morning Psalms | Morning Lessons | Evening Psalms | Evening Lessons

Each ROW in the table = one day of the liturgical year.
Rows group by week.
"""
import pdfplumber
import re

pdf_path = 'C:/Users/aliss/.claude/projects/C--Users-aliss-DailyOffice/8b017007-58e6-4862-bc8b-760f0e816c67/tool-results/webfetch-1773623640559-yu74vw.pdf'

print("Let me look at the COLUMN HEADERS (first data page, top of table) to understand structure")
print()

with pdfplumber.open(pdf_path) as pdf:
    # Pages 1 and 2 might be title/header
    for page_idx in range(0, 3):
        page = pdf.pages[page_idx]
        print(f"=== Page {page_idx+1} ===")
        words = page.extract_words(x_tolerance=5, y_tolerance=3)
        # Show all readable words (no CIDs)
        readable = [w for w in words if '(cid:' not in w['text']]
        for w in sorted(readable, key=lambda w: (round(w['top']/3)*3, w['x0'])):
            print(f"  x={w['x0']:6.1f} y={w['top']:6.1f} '{w['text']}'")
        print()

print()
print("=== Looking at page 3 LEFT vs RIGHT structure more carefully ===")
print()
print("Hypothesis: The table has two SECTIONS (maybe two half-years?)")
print("LEFT (x=54-400) = one half-year, RIGHT (x=450-740) = another half-year")
print()
print("Within each section, columns are:")
print("  [day_label] | [MP_psalm] | [MP_lesson1] | [MP_lesson2] | [EP_psalm] | [EP_lesson1] | [EP_lesson2]")
print()

# Check what x-ranges the columns fall in
# For the LEFT section (x=54-400):
# - Day label: x~54-120
# - MP psalm: x~120-180
# - MP lesson 1: x~180-270
# - MP lesson 2: x~270-345
# - (EP columns would be in RIGHT section)

# For the RIGHT section (x=450-740):
# - Day label: x~450-520
# - EP psalm: x~520-580
# - EP lesson 1: x~580-670
# - EP lesson 2: x~670-740

# BUT - if LEFT and RIGHT are DIFFERENT weeks/years, this breaks down.

# Alternative hypothesis:
# LEFT section = MORNING PRAYER for ALL weeks
# RIGHT section = EVENING PRAYER for ALL weeks
# And weeks in LEFT and RIGHT are PAIRED (same week appears at same y-level)

# Let's check: at y=93 we have:
# LEFT MP psalm = 50 (for some week's Sunday)
# RIGHT EP psalm = 48, 126 (same week's Sunday EP)
# If these are the SAME week, then Sunday MP=50, EP=48,126

# At y=195 we have:
# LEFT MP psalm = 25 (another Sunday)
# RIGHT EP psalm = 119:89-104 (same Sunday's EP?)

# So if Advent 1 Sunday MP=25, EP=48,126...
# Then the week at y=93 (MP=50, EP=48,126) is NOT Advent 1 Sunday
# And the week at y=195 (MP=25, EP=119:89-104) might be Advent 1 Sunday

# Actually maybe the RIGHT column EP psalm 48,126 at y=93 corresponds to a DIFFERENT week
# than the LEFT column MP psalm 50 at y=93

# Let me look at the confirmed Advent 1 data:
# MP = 25, 9 (two psalms)
# EP = 48, 126

# At y=195, LEFT = 25. Where is "9" (the second morning psalm)?
# And where is "48, 126" relative to y=195?

# Looking at page 3 analysis:
# y=93: L_psalm=50, R_psalm=48,126 (RIGHT y=93 has 48,126)
# y=195: L_psalm=25, R_psalm=119:89-104

# If LEFT and RIGHT are DIFFERENT sections (different weeks),
# then the EP for the y=195 week would be at y=195 RIGHT = 119:89-104
# But EP for the y=93 week would be at y=93 RIGHT = 48, 126

# Confirmed Advent 1 EP = 48, 126 → suggests Advent 1 is in y=93 section
# But y=93 LEFT shows MP=50, not MP=25,9

# Unless... the TWO ROWS per Sunday work differently:
# Row 1 (y=93): Sub-row A for Sunday
# Row 2 (y=104): Sub-row B for Sunday
# And the "two rows" together give complete Sunday reading

# At y=93: L_psalm=50, R_psalm=48,126
# At y=104: L_psalm=46,97, R_psalm=18:1-20

# If Sunday MP = 50, 46, 97 and Sunday EP = 48, 126, 18:1-20 that's too many!

# OR: one column is MP and other is EP for same day, alternating by sub-row!
# Row 1: L=EP psalm, R=MP psalm
# Row 2: L=more EP, R=more MP
# That also doesn't fit.

# NEW HYPOTHESIS: The LEFT column shows EVENING psalms and RIGHT shows MORNING psalms!
# Then y=93: EP=50, MP=48,126 doesn't work for Advent 1 (EP should be 48,126 not MP).

# ANOTHER HYPOTHESIS: Maybe the entire layout is organized with ROWS showing:
# Each ROW = one service (either MP or EP for one day)
# So a full week has 14 rows (7 days × 2 services each)
# And the LEFT column = Sunday-Saturday MP, RIGHT column = Sunday-Saturday EP
# But that would mean LEFT and RIGHT show SAME WEEK simultaneously.

# KEY TEST: If same week, y=93 LEFT=MP=50 and y=93 RIGHT=EP=48,126
# We need to verify: what do the day labels say?
# At y=119: RIGHT label = "Monday", LEFT psalm = "1,3", RIGHT psalm = "4,8"
# If RIGHT=EP: Monday EP=4,8 ✓ (Monday column is labeled on RIGHT)
# If LEFT=MP: Monday MP=1,3

# CONCLUSION: LEFT=MP, RIGHT=EP, and each row is ONE DAY.
# y=93: Sunday MP=50, Sunday EP=48,126 → THIS IS ADVENT 1 SUNDAY if EP=48,126 ✓
# But then Sunday MP=50, not 25,9 which the user confirmed!

# Wait - let me re-read the user's confirmation.
# "First Sunday of Advent Morning Prayer = Psalms 25, 9"
# But the table shows Sunday MP=50 for the first week on page 3.

# Is it possible the user was looking at a DIFFERENT edition, or my confirmed data is wrong?
# OR is the "50" at y=93 actually something else?

# Let me check: could "50" be page number or some other metadata?

with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[2]
    # Focus on y=91-95 to see ALL text in that range
    chars = [c for c in page.chars if 90 <= c['top'] <= 96]
    print("All chars at y=91-96 on page 3:")
    for c in sorted(chars, key=lambda c: c['x0']):
        font_short = 'F5' if 'OldStyle' in c.get('fontname', '') else ('TI' if 'Times' in c.get('fontname', '') else 'F3')
        print(f"  x={c['x0']:.1f} font={font_short} text='{c['text']}'")
