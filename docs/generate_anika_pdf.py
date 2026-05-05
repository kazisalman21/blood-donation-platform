from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import FrameBreak

# ── Color palette ──────────────────────────────────────────────
RED       = colors.HexColor("#C0392B")
DARK_RED  = colors.HexColor("#922B21")
SOFT_RED  = colors.HexColor("#FADBD8")
DARK_BG   = colors.HexColor("#1C2333")
MID_GREY  = colors.HexColor("#2C3E50")
LIGHT_GREY= colors.HexColor("#ECF0F1")
WHITE     = colors.white
GOLD      = colors.HexColor("#F39C12")
GREEN     = colors.HexColor("#1E8449")
SOFT_GREEN= colors.HexColor("#D5F5E3")
BLUE      = colors.HexColor("#1A5276")
SOFT_BLUE = colors.HexColor("#D6EAF8")
CODE_BG   = colors.HexColor("#F4F6F7")
CODE_BORDER=colors.HexColor("#BDC3C7")

W, H = A4

doc = SimpleDocTemplate(
    "Anika_Viva_Guide.pdf",
    pagesize=A4,
    rightMargin=1.8*cm, leftMargin=1.8*cm,
    topMargin=1.5*cm, bottomMargin=1.5*cm,
)

styles = getSampleStyleSheet()

# ── Custom styles ───────────────────────────────────────────────
def S(name, **kw):
    return ParagraphStyle(name, **kw)

cover_title = S("CoverTitle", fontSize=30, textColor=WHITE, alignment=TA_CENTER,
                spaceAfter=6, fontName="Helvetica-Bold", leading=36)
cover_sub   = S("CoverSub",  fontSize=14, textColor=colors.HexColor("#FADBD8"),
                alignment=TA_CENTER, fontName="Helvetica", leading=18)
cover_info  = S("CoverInfo", fontSize=11, textColor=LIGHT_GREY, alignment=TA_CENTER,
                fontName="Helvetica")

ch_title    = S("ChTitle",   fontSize=18, textColor=WHITE, fontName="Helvetica-Bold",
                spaceBefore=4, spaceAfter=4, leading=22)
sec_title   = S("SecTitle",  fontSize=13, textColor=DARK_RED, fontName="Helvetica-Bold",
                spaceBefore=10, spaceAfter=4, leading=16)
feat_title  = S("FeatTitle", fontSize=12, textColor=BLUE, fontName="Helvetica-Bold",
                spaceBefore=8, spaceAfter=3)
body        = S("Body",      fontSize=9.5, fontName="Helvetica", leading=14,
                spaceAfter=4, textColor=colors.HexColor("#2C3E50"), alignment=TA_JUSTIFY)
bullet      = S("Bullet",    fontSize=9.5, fontName="Helvetica", leading=13,
                leftIndent=14, spaceAfter=2, textColor=MID_GREY)
code_style  = S("Code",      fontSize=8, fontName="Courier", leading=11,
                backColor=CODE_BG, leftIndent=10, rightIndent=10, spaceAfter=2,
                textColor=colors.HexColor("#1A252F"))
label       = S("Label",     fontSize=9, fontName="Helvetica-Bold", textColor=BLUE)
small_note  = S("SmallNote", fontSize=8, fontName="Helvetica-Oblique",
                textColor=colors.grey, spaceAfter=3)
qa_q        = S("QAQ",       fontSize=10, fontName="Helvetica-Bold", textColor=DARK_RED,
                spaceBefore=6, spaceAfter=2, leading=13)
qa_a        = S("QAA",       fontSize=9.5, fontName="Helvetica", leading=13,
                leftIndent=12, spaceAfter=4, textColor=MID_GREY, alignment=TA_JUSTIFY)
toc_item    = S("TOC",       fontSize=10, fontName="Helvetica", leading=14,
                textColor=MID_GREY)

# ── Helper builders ─────────────────────────────────────────────
def hr(color=RED, thickness=1.2, width="100%"):
    return HRFlowable(width=width, thickness=thickness, color=color, spaceAfter=6)

def chapter_header(text, icon=""):
    data = [[Paragraph(f"{icon}  {text}" if icon else text, ch_title)]]
    t = Table(data, colWidths=[W - 3.6*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), DARK_BG),
        ("ROUNDEDCORNERS", [6]),
        ("TOPPADDING",    (0,0),(-1,-1), 10),
        ("BOTTOMPADDING", (0,0),(-1,-1), 10),
        ("LEFTPADDING",   (0,0),(-1,-1), 14),
    ]))
    return [t, Spacer(1, 8)]

def feature_box(code, title, sprint, color=SOFT_BLUE, border=BLUE):
    label_txt = f"<b>{code}</b> — {title} &nbsp;&nbsp; <font color='grey' size='8'>[{sprint}]</font>"
    data = [[Paragraph(label_txt, S("fb", fontSize=11, fontName="Helvetica-Bold",
                                    textColor=border, leading=14))]]
    t = Table(data, colWidths=[W - 3.6*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), color),
        ("LINEBELOW",     (0,0),(-1,-1), 1.5, border),
        ("TOPPADDING",    (0,0),(-1,-1), 7),
        ("BOTTOMPADDING", (0,0),(-1,-1), 7),
        ("LEFTPADDING",   (0,0),(-1,-1), 12),
    ]))
    return [t, Spacer(1, 4)]

def file_table(rows):
    """rows = list of (file_path, purpose)"""
    header = [Paragraph("File", S("th", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE)),
              Paragraph("Purpose", S("th2", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE))]
    data = [header] + [
        [Paragraph(f, S("fc", fontSize=8.5, fontName="Courier", textColor=DARK_RED)),
         Paragraph(p, S("fp", fontSize=8.5, fontName="Helvetica", textColor=MID_GREY))]
        for f, p in rows
    ]
    col1 = 8.3*cm
    col2 = W - 3.6*cm - col1
    t = Table(data, colWidths=[col1, col2], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,0),  BLUE),
        ("BACKGROUND",    (0,1),(-1,-1), LIGHT_GREY),
        ("ROWBACKGROUNDS",(0,1),(-1,-1), [WHITE, LIGHT_GREY]),
        ("GRID",          (0,0),(-1,-1), 0.4, colors.HexColor("#BDC3C7")),
        ("TOPPADDING",    (0,0),(-1,-1), 5),
        ("BOTTOMPADDING", (0,0),(-1,-1), 5),
        ("LEFTPADDING",   (0,0),(-1,-1), 7),
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
    ]))
    return [t, Spacer(1, 6)]

def api_table(rows):
    header = [
        Paragraph("Method", S("m", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE)),
        Paragraph("Endpoint", S("e", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE)),
        Paragraph("What It Does", S("w", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE)),
    ]
    data = [header] + [
        [Paragraph(m, S("mc", fontSize=8.5, fontName="Courier-Bold", textColor=GREEN)),
         Paragraph(ep, S("ec", fontSize=8, fontName="Courier", textColor=DARK_RED)),
         Paragraph(desc, S("dc", fontSize=8.5, fontName="Helvetica", textColor=MID_GREY))]
        for m, ep, desc in rows
    ]
    cw = [(W - 3.6*cm) / 10]
    colWidths = [1.2*cm, 8.0*cm, W - 3.6*cm - 1.2*cm - 8.0*cm]
    t = Table(data, colWidths=colWidths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,0),  MID_GREY),
        ("ROWBACKGROUNDS",(0,1),(-1,-1), [WHITE, SOFT_BLUE]),
        ("GRID",          (0,0),(-1,-1), 0.4, CODE_BORDER),
        ("TOPPADDING",    (0,0),(-1,-1), 5),
        ("BOTTOMPADDING", (0,0),(-1,-1), 5),
        ("LEFTPADDING",   (0,0),(-1,-1), 6),
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
    ]))
    return [t, Spacer(1, 6)]

def info_box(text, bg=SOFT_GREEN, border=GREEN):
    data = [[Paragraph(text, S("ib", fontSize=9, fontName="Helvetica", leading=13,
                               textColor=colors.HexColor("#1E8449")))]]
    t = Table(data, colWidths=[W - 3.6*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",  (0,0),(-1,-1), bg),
        ("LINEBEFORE",  (0,0),(0,-1), 3, border),
        ("TOPPADDING",  (0,0),(-1,-1), 7),
        ("BOTTOMPADDING",(0,0),(-1,-1), 7),
        ("LEFTPADDING", (0,0),(-1,-1), 10),
    ]))
    return [t, Spacer(1, 5)]

def warn_box(text):
    return info_box(text, bg=colors.HexColor("#FDEBD0"), border=GOLD)

def code_block(lines):
    out = []
    for ln in lines:
        out.append(Paragraph(ln.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;"),
                              code_style))
    data = [[el] for el in out]
    t = Table([[out[0] if len(out)==1 else
                Paragraph("<br/>".join(l.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
                                       for l in lines), code_style)]],
              colWidths=[W - 3.6*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), CODE_BG),
        ("BOX",           (0,0),(-1,-1), 0.8, CODE_BORDER),
        ("TOPPADDING",    (0,0),(-1,-1), 7),
        ("BOTTOMPADDING", (0,0),(-1,-1), 7),
        ("LEFTPADDING",   (0,0),(-1,-1), 10),
    ]))
    return [t, Spacer(1, 5)]

# ═══════════════════════════════════════════════════════════════
# BUILD STORY
# ═══════════════════════════════════════════════════════════════
story = []

# ── COVER PAGE ──────────────────────────────────────────────────
cover_data = [[
    Paragraph("🩸 WeHeal BloodConnect", cover_title),
    Spacer(1, 4),
    Paragraph("Project Viva &amp; Demonstration Guide", cover_sub),
    Spacer(1, 18),
    Paragraph("Miskatul Afrin Anika", S("cn", fontSize=16, textColor=GOLD,
              fontName="Helvetica-Bold", alignment=TA_CENTER)),
    Paragraph("ID: 23101409", S("cid", fontSize=12, textColor=LIGHT_GREY,
              fontName="Helvetica", alignment=TA_CENTER)),
    Spacer(1, 8),
    Paragraph("Module: Community Features + History &amp; Content Management",
              cover_info),
    Paragraph("Features Implemented: F5, F12, F13, F14, F15, F20  (6 of 20)",
              cover_info),
    Spacer(1, 16),
    Paragraph("CSE470 — Software Engineering | Spring 2026 | Group 6",
              S("cs", fontSize=10, textColor=colors.HexColor("#AEB6BF"),
                fontName="Helvetica", alignment=TA_CENTER)),
    Paragraph("Presentation Date: May 6, 2026",
              S("cd", fontSize=10, textColor=colors.HexColor("#AEB6BF"),
                fontName="Helvetica", alignment=TA_CENTER)),
]]

cover_table = Table(cover_data, colWidths=[W - 3.6*cm])
cover_table.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,-1), DARK_BG),
    ("TOPPADDING",    (0,0),(-1,-1), 48),
    ("BOTTOMPADDING", (0,0),(-1,-1), 48),
    ("LEFTPADDING",   (0,0),(-1,-1), 20),
    ("RIGHTPADDING",  (0,0),(-1,-1), 20),
    ("ROUNDEDCORNERS",[8]),
]))
story.append(cover_table)
story.append(Spacer(1, 20))

# Team table
team_data = [
    [Paragraph("<b>Team Member</b>", label),
     Paragraph("<b>Module</b>", label),
     Paragraph("<b>Demo Section</b>", label)],
    [Paragraph("Salman", body), Paragraph("Frontend + Authentication", body),
     Paragraph("0:00 – 1:30", body)],
    [Paragraph("Anika ★", S("an", fontSize=9.5, fontName="Helvetica-Bold",
               textColor=RED)), Paragraph("Community + History + Content", body),
     Paragraph("1:30 – 3:00", body)],
    [Paragraph("Athoy", body), Paragraph("Admin Panel + Analytics", body),
     Paragraph("3:00 – 4:15", body)],
]
t = Table(team_data, colWidths=[(W-3.6*cm)/3]*3)
t.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,0), MID_GREY),
    ("TEXTCOLOR",     (0,0),(-1,0), WHITE),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[LIGHT_GREY, WHITE]),
    ("BACKGROUND",    (0,2),(-1,2), SOFT_RED),
    ("GRID",          (0,0),(-1,-1), 0.5, CODE_BORDER),
    ("TOPPADDING",    (0,0),(-1,-1), 6),
    ("BOTTOMPADDING", (0,0),(-1,-1), 6),
    ("LEFTPADDING",   (0,0),(-1,-1), 8),
    ("ALIGN",         (0,0),(-1,-1), "CENTER"),
    ("FONTNAME",      (0,0),(-1,0), "Helvetica-Bold"),
]))
story.append(Paragraph("Team Overview", sec_title))
story.append(t)
story.append(PageBreak())

# ── CH 1: DEMO SCRIPT ───────────────────────────────────────────
story += chapter_header("Chapter 1 — Your Demo Script (1:30 – 3:00)", "🎬")
story.append(Paragraph(
    "You have exactly <b>90 seconds</b> on stage. Below is your step-by-step script "
    "with what to click, what to say, and what to highlight. Practice this until it feels natural.",
    body))
story.append(Spacer(1, 6))

demo_steps = [
    ("Step 1", "0:00", "Emergency Blood Request",
     "Click <b>Requests → Post Emergency Request</b>. Fill in: Blood Type <b>O−</b>, "
     "Hospital <b>Square Hospital</b>, Units <b>3</b>, Urgency <b>Critical</b>. Click Submit.",
     'Say: "This instantly broadcasts to all compatible donors in the area."'),
    ("Step 2", "0:25", "Search & Filter Requests",
     "Click <b>Requests → Search Requests</b>. Use the filter dropdowns — Blood Type, Urgency, Status.",
     'Say: "Patients can search and filter all active requests by blood compatibility."'),
    ("Step 3", "0:40", "⭐ Donor Map (WOW moment)",
     "Click <b>Community → Donor Map</b>. Show pins across Dhaka. Filter by blood type → pins change. "
     "Adjust radius → circle updates. Click a pin → donor popup appears.",
     'Say: "Each pin is in the donor\'s actual neighborhood — we used OpenStreetMap Nominatim for geocoding."'),
    ("Step 4", "1:05", "Status Tracker (6-Stage Pipeline)",
     "Click <b>Requests → Status Tracker</b>. Select a completed request. Show all 6 stages in green.",
     'Say: "Open → Donors Notified → Matched → Contact Shared → Scheduled → Completed."'),
    ("Step 5", "1:20", "Donation History",
     "Click <b>Requests → Donation History</b>. Show filters and the Recharts bar chart.",
     'Say: "Full filterable audit trail with monthly trend visualization."'),
]

for step, timing, title, action, say in demo_steps:
    row = [
        [Paragraph(f"<b>{step}</b>", S("st", fontSize=9, fontName="Helvetica-Bold",
                   textColor=WHITE, alignment=TA_CENTER)),
         Paragraph(f"<font color='#F39C12'>{timing}</font>", S("ti", fontSize=9,
                   fontName="Helvetica-Bold", alignment=TA_CENTER, textColor=GOLD)),
         Paragraph(f"<b>{title}</b>", S("tt", fontSize=10, fontName="Helvetica-Bold",
                   textColor=DARK_RED))],
        ["", "",
         Paragraph(f"🖱 <i>{action}</i>", S("ac", fontSize=9, fontName="Helvetica",
                   textColor=MID_GREY, leading=13))],
        ["", "",
         Paragraph(f'💬 {say}', S("sy", fontSize=9, fontName="Helvetica-Oblique",
                   textColor=GREEN, leading=12))],
    ]
    colW = [1.3*cm, 1.3*cm, W - 3.6*cm - 2.6*cm]
    t = Table(row, colWidths=colW)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(1,0), DARK_BG),
        ("BACKGROUND",    (2,0),(-1,-1), WHITE),
        ("BACKGROUND",    (0,1),(1,-1), colors.HexColor("#F8F9FA")),
        ("SPAN",          (0,0),(0,-1)),
        ("SPAN",          (1,0),(1,-1)),
        ("BOX",           (0,0),(-1,-1), 0.8, CODE_BORDER),
        ("GRID",          (2,0),(-1,-1), 0.3, LIGHT_GREY),
        ("TOPPADDING",    (0,0),(-1,-1), 5),
        ("BOTTOMPADDING", (0,0),(-1,-1), 5),
        ("LEFTPADDING",   (0,0),(-1,-1), 7),
        ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
    ]))
    story.append(t)
    story.append(Spacer(1, 5))

story.append(PageBreak())

# ── CH 2: MY FILES ──────────────────────────────────────────────
story += chapter_header("Chapter 2 — My Files & Their Locations", "📁")
story.append(Paragraph(
    "Every file below was written entirely by <b>Miskatul Afrin Anika</b>. "
    "The project follows the MVC pattern — frontend React components live in "
    "<font face='Courier'>client/src/components/</font> and backend logic lives "
    "in <font face='Courier'>server/</font>.",
    body))
story.append(Spacer(1, 6))

# Frontend files grouped
story.append(Paragraph("Frontend Files — client/src/components/community/", sec_title))
story += file_table([
    ("DonationHistoryPage.jsx", "F5 — Main history page with date, blood type, and status filters + paginated list"),
    ("DonationStatsCard.jsx",   "F5 — Statistics card showing total donations, lives helped, and Recharts bar chart"),
    ("DonationStatsCard.css",   "F5 — Styling for the stats card"),
    ("HistoryFilters.css",      "F5 & F12 — Shared dark glassmorphism filter styles used by both history pages"),
    ("RequestHistoryPage.jsx",  "F12 — Request history with expandable rows, status timeline, and hand-written CSV export (21KB — largest frontend file)"),
    ("LeaderboardPage.jsx",     "F13 — Leaderboard table with All-Time/Monthly tabs and city filter dropdown"),
    ("Leaderboard.css",         "F13 — Dark theme table styling with rank highlighting (gold/silver/bronze)"),
    ("BadgeShowcase.jsx",       "F13 — Renders donation milestone badges on donor cards"),
    ("MilestonePopup.jsx",      "F13 — Animated popup that appears when a donor earns a new badge"),
    ("EligibilityReminderCard.jsx","F14 — Shows countdown of days until the donor is eligible to donate again"),
    ("EligibilityReminderCard.css","F14 — Countdown display styling"),
    ("HealthTipsSection.jsx",   "F14 — Health tips accordion/cards shown on donor profile page"),
    ("HealthTipsSection.css",   "F14 — Tip card styling"),
    ("FeedbackForm.jsx",        "F15 — Star rating (1–5) form with gratitude message and public/private toggle"),
    ("Feedback.css",            "F15 — Animated star hover/click effects"),
    ("DonorFeedbackSection.jsx","F15 — Displays public feedback ratings on a donor's profile page"),
    ("FAQPage.jsx",             "F20 — Public FAQ page with category tabs and accordion expandable questions"),
    ("FAQ.css",                 "F20 — Premium dark theme FAQ styling (12KB)"),
    ("BloodCompatibilityChartPage.jsx","F20 — Color-coded 8×8 grid showing which blood types can donate to which"),
])

story.append(Paragraph("Admin File — client/src/components/admin/", sec_title))
story += file_table([
    ("AdminContentEditor.jsx", "F20 — Admin CRUD interface to create, edit, delete, and reorder FAQ entries"),
])

story.append(Paragraph("Backend Files — server/", sec_title))
story += file_table([
    ("controllers/communityController.js", "Core backend logic: leaderboard aggregation, feedback CRUD, FAQ public endpoints"),
    ("controllers/adminController.js",     "Admin-only FAQ management: createFAQ(), updateFAQ(), deleteFAQ()"),
    ("controllers/donorController.js",     "getDonationsHistory() — filtered & paginated donation history query"),
    ("controllers/requestController.js",   "getMyRequests() — filtered & paginated request history query"),
    ("models/Feedback.js",                 "Mongoose schema: donorId, requestId, rating, message, allowPublic, timestamps"),
    ("models/FAQ.js",                      "Mongoose schema: question, answer, category, order, isActive"),
    ("models/Donation.js",                 "Mongoose schema: donor, recipient, blood type, date, status"),
    ("jobs/reminderJob.js",                "F14 — node-cron job: runs daily at 8:00 AM, finds eligible donors, sends reminder emails via Nodemailer"),
])
story.append(PageBreak())

# ── CH 3: FEATURES ──────────────────────────────────────────────
story += chapter_header("Chapter 3 — My 6 Features Explained Simply", "⚡")
story.append(Paragraph(
    "Each feature is explained in plain language so you can describe it to faculty "
    "without jargon, followed by the key technical points.",
    body))
story.append(Spacer(1, 6))

# ── F5 ──
story += feature_box("F5", "Donation History & Statistics", "Sprint 1")
story.append(Paragraph(
    "<b>What it does in plain words:</b> When a donor logs in and clicks 'Donation History', "
    "they see a list of every blood donation they have ever made. They can filter this list "
    "by a date range (from/to), by blood type, or by status (Scheduled / Completed / Cancelled). "
    "A stats card at the top shows total donations and how many lives were helped. "
    "A bar chart shows how many donations were made each month.",
    body))
story.append(Paragraph("<b>How it works technically:</b>", feat_title))
story.append(Paragraph(
    "• The filter dropdowns in the React component build a URL query string like "
    "<font face='Courier'>?from=2025-01-01&amp;to=2025-12-31&amp;status=Completed</font>.<br/>"
    "• The backend function <font face='Courier'>getDonationsHistory()</font> in "
    "<font face='Courier'>donorController.js</font> reads these query parameters and builds "
    "a MongoDB filter object dynamically.<br/>"
    "• It uses <font face='Courier'>$gte</font> (greater than or equal) and "
    "<font face='Courier'>$lte</font> (less than or equal) for date range filtering.<br/>"
    "• Results are paginated — 20 per page — to avoid loading thousands of records at once.<br/>"
    "• The bar chart uses the <b>Recharts</b> library with the data grouped by month.",
    bullet))
story += info_box("💡 Key talking point: 'The filter builds a MongoDB query object dynamically "
                  "based on whichever filters the user selected — unused filters are simply not "
                  "added to the query.'")

# ── F12 ──
story += feature_box("F12", "Request History & Records", "Sprint 1", SOFT_RED, RED)
story.append(Paragraph(
    "<b>What it does in plain words:</b> Shows all blood requests the user has ever posted. "
    "Each row can be expanded by clicking it — this reveals full details and a visual "
    "timeline of all 6 stages (Open → Donors Notified → Matched → Contact Shared → "
    "Scheduled → Completed) with timestamps. There is also an 'Export CSV' button that "
    "downloads all filtered requests as a spreadsheet file.",
    body))
story.append(Paragraph("<b>The CSV export is hand-written (no library):</b>", feat_title))
story.append(Paragraph(
    "• Column headers are defined as an array.<br/>"
    "• Each row of data is mapped to a comma-separated string.<br/>"
    "• Special characters (commas, quotes, newlines) inside values are wrapped in double "
    "quotes, and internal double quotes are escaped as <font face='Courier'>\"\"</font>.<br/>"
    "• All rows are joined with newline characters.<br/>"
    "• A <font face='Courier'>Blob</font> object with MIME type <font face='Courier'>text/csv</font> "
    "is created and a temporary link is programmatically clicked to trigger the browser download.",
    bullet))
story += warn_box("⚠ Why hand-written? The course rules require core algorithms to be written by "
                  "the team — not imported from npm packages. This shows you understand the logic.")

# ── F13 ──
story += feature_box("F13", "Donor Leaderboard & Milestone Badges", "Sprint 2")
story.append(Paragraph(
    "<b>What it does in plain words:</b> A public leaderboard showing the top donors ranked "
    "by how many times they have donated blood. You can switch between 'All Time' and 'This Month' "
    "tabs. There is a city dropdown to filter by location. Each donor's row shows their name, "
    "blood type, donation count, and any badges they have earned.",
    body))
story.append(Paragraph("<b>Badge milestones:</b>", feat_title))

badge_data = [
    ["🏅 First Donation", "Awarded at 1 donation", "Encourages first-timers"],
    ["💉 Lifesaver",      "Awarded at 3 donations", "Recognizes regular donors"],
    ["⭐ Champion",       "Awarded at 5 donations", "Highlights dedicated donors"],
    ["🏆 Hero",           "Awarded at 10 donations","Top-tier recognition"],
]
bt = Table([["Badge", "When Earned", "Why"]] + badge_data,
           colWidths=[(W-3.6*cm)/3]*3)
bt.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,0), MID_GREY),
    ("TEXTCOLOR",     (0,0),(-1,0), WHITE),
    ("FONTNAME",      (0,0),(-1,0), "Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, LIGHT_GREY]),
    ("GRID",          (0,0),(-1,-1), 0.4, CODE_BORDER),
    ("TOPPADDING",    (0,0),(-1,-1), 5),
    ("BOTTOMPADDING", (0,0),(-1,-1), 5),
    ("LEFTPADDING",   (0,0),(-1,-1), 8),
    ("FONTSIZE",      (0,0),(-1,-1), 9),
]))
story.append(bt)
story.append(Spacer(1, 6))
story.append(Paragraph(
    "<b>Backend — MongoDB Aggregation Pipeline (hand-written ranking algorithm):</b><br/>"
    "• <font face='Courier'>$match</font> — filters out suspended users; optionally filters by city.<br/>"
    "• <font face='Courier'>$sort</font> — sorts by <font face='Courier'>donationCount</font> "
    "descending (highest first).<br/>"
    "• <font face='Courier'>$limit</font> — takes only the top 50 results.<br/>"
    "• <font face='Courier'>$project</font> — selects only needed fields to reduce data transfer.<br/>"
    "For the monthly tab, the pipeline runs on the <font face='Courier'>Donation</font> collection "
    "and filters by <font face='Courier'>donationDate</font> within the current month.",
    bullet))

# ── F14 ──
story += feature_box("F14", "Eligibility Reminders & Health Tips", "Sprint 2",
                     colors.HexColor("#D5F5E3"), GREEN)
story.append(Paragraph(
    "<b>What it does in plain words:</b> Blood donors cannot donate again for a certain period "
    "after their last donation. This feature automatically emails them the day they become eligible "
    "again. It also shows health tips on the profile page (drink water, eat iron-rich foods, "
    "avoid heavy lifting, get enough sleep before donation).",
    body))
story.append(Paragraph(
    "<b>How the cron job works:</b><br/>"
    "• A <b>cron job</b> is a scheduled task that runs automatically at a set time — like an alarm clock for your server.<br/>"
    "• The expression <font face='Courier'>'0 8 * * *'</font> means: minute 0, hour 8, every day.<br/>"
    "• Every morning at 8:00 AM the server checks MongoDB for donors whose "
    "<font face='Courier'>nextEligibleDate</font> is today or earlier and "
    "<font face='Courier'>isAvailable</font> is false.<br/>"
    "• For each eligible donor, it sends a reminder email through <b>Nodemailer</b> using Gmail SMTP.<br/>"
    "• The library used is <font face='Courier'>node-cron</font>.",
    bullet))
story += info_box("💡 Analogy: Imagine the server sets a daily alarm. Every morning it checks "
                  "a list and sends emails — like a hospital receptionist calling patients.")

# ── F15 ──
story += feature_box("F15", "Donor-Requester Feedback System", "Sprint 3", SOFT_RED, RED)
story.append(Paragraph(
    "<b>What it does in plain words:</b> After a blood request is completed, the person who "
    "made the request can rate the donor from 1 to 5 stars and write a thank-you message. "
    "They can choose to make this feedback public (visible on the donor's profile) or keep "
    "it private. Public feedback appears in a section on the donor's profile page.",
    body))
story.append(Paragraph(
    "<b>Security checks (4 layers of validation):</b><br/>"
    "1. <b>Frontend</b> — rating must be 1–5; submission only allowed for completed requests.<br/>"
    "2. <b>Ownership check</b> — backend verifies the person submitting is the same person who made the request.<br/>"
    "3. <b>Donor match check</b> — the donor being rated must be the one actually matched to the request (prevents false feedback).<br/>"
    "4. <b>Duplicate check</b> — checks if feedback already exists for this request (one feedback per request).",
    bullet))

# ── F20 ──
story += feature_box("F20", "FAQ & Content Management", "Sprint 3")
story.append(Paragraph(
    "<b>What it does in plain words:</b> A public Help/FAQ page with questions organized into "
    "category tabs (Eligibility, Blood Types, Preparation, After Donation). Each question expands "
    "like an accordion when clicked. There is also a blood type compatibility chart showing which "
    "blood type can donate to which. Admins have a separate editor where they can add new FAQ "
    "questions, edit existing ones, delete them, and set their order.",
    body))
story.append(Paragraph(
    "<b>Blood Compatibility Chart:</b> An 8×8 grid — rows are donors, columns are recipients. "
    "Each cell is color-coded: green = can donate, red = cannot donate. "
    "All 8 blood types are covered: A+, A−, B+, B−, AB+, AB−, O+, O−.<br/><br/>"
    "<b>Admin CRUD operations:</b><br/>"
    "• <b>Create</b> — POST /api/admin/faqs — Admin fills a form, FAQ is saved to MongoDB.<br/>"
    "• <b>Read</b> — GET /api/community/faqs — Anyone can view active FAQs, sorted by order field.<br/>"
    "• <b>Update</b> — PUT /api/admin/faqs/:id — Admin edits question, answer, category, or order.<br/>"
    "• <b>Delete</b> — DELETE /api/admin/faqs/:id — Admin removes a FAQ entry.",
    bullet))
story.append(PageBreak())

# ── CH 4: API ENDPOINTS ─────────────────────────────────────────
story += chapter_header("Chapter 4 — My API Endpoints", "🌐")
story.append(Paragraph("Every API call your frontend makes goes through these endpoints. "
                        "Know each one — faculty may ask you to trace a request.",
                        body))
story.append(Spacer(1, 6))

story += api_table([
    ("GET",    "/api/donors/donations?from=&to=&bloodType=&status=",
               "Donation history with optional filters. Returns paginated list for logged-in donor."),
    ("GET",    "/api/requests/my?page=1&limit=20",
               "All blood requests made by the logged-in user. Paginated."),
    ("GET",    "/api/community/leaderboard?type=monthly&city=Dhaka",
               "Top donors ranked by donation count. type=alltime or monthly. city is optional filter."),
    ("GET",    "/api/community/faqs",
               "All active FAQ entries sorted by order field. Public — no auth required."),
    ("GET",    "/api/community/feedback/donor/:id",
               "All public feedback for a specific donor. Shown on their profile."),
    ("POST",   "/api/community/feedback",
               "Submit a new feedback. Body: { donorId, requestId, rating, message, allowPublic }"),
    ("POST",   "/api/admin/faqs",
               "Admin creates a new FAQ. Body: { question, answer, category, order, isActive }"),
    ("PUT",    "/api/admin/faqs/:id",
               "Admin updates an existing FAQ by its MongoDB _id."),
    ("DELETE", "/api/admin/faqs/:id",
               "Admin deletes a FAQ entry permanently."),
])

story.append(Paragraph(
    "Every authenticated request includes the JWT token in the Authorization header:",
    body))
story.append(Spacer(1, 4))
story.append(Paragraph(
    "Authorization: Bearer &lt;your_jwt_token&gt;",
    S("ch", fontSize=9, fontName="Courier", backColor=CODE_BG,
      leftIndent=12, leading=14, textColor=DARK_RED)))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "The token is stored in React's <b>AuthContext</b>. "
    "You access it in every component with: "
    "<font face='Courier'>const { token, user } = useAuth();</font>",
    body))
story.append(PageBreak())

# ── CH 5: ARCHITECTURE ──────────────────────────────────────────
story += chapter_header("Chapter 5 — Architecture & How Everything Connects", "🏗")

story.append(Paragraph("MVC Pattern", sec_title))
mvc_data = [
    ["Layer", "What It Means", "Example from My Code"],
    ["Model", "Defines the shape of data in the database",
     "Feedback.js — Schema with fields: donorId, rating, message, allowPublic"],
    ["View",  "React components the user sees and interacts with",
     "FeedbackForm.jsx — Renders the star rating form"],
    ["Controller", "Business logic — validates input, talks to the database, returns a response",
     "communityController.js → submitFeedback() — Checks ownership, saves to MongoDB"],
]
mt = Table(mvc_data, colWidths=[2.5*cm, 5*cm, W-3.6*cm-7.5*cm])
mt.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,0), DARK_BG),
    ("TEXTCOLOR",     (0,0),(-1,0), WHITE),
    ("FONTNAME",      (0,0),(-1,0), "Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[SOFT_BLUE, WHITE, colors.HexColor("#FEF9E7")]),
    ("GRID",          (0,0),(-1,-1), 0.4, CODE_BORDER),
    ("TOPPADDING",    (0,0),(-1,-1), 7),
    ("BOTTOMPADDING", (0,0),(-1,-1), 7),
    ("LEFTPADDING",   (0,0),(-1,-1), 8),
    ("FONTSIZE",      (0,0),(-1,-1), 9),
    ("VALIGN",        (0,0),(-1,-1), "TOP"),
]))
story.append(mt)
story.append(Spacer(1, 10))

story.append(Paragraph("Request Flow — What Happens When You Click Something", sec_title))
flow_steps = [
    ("1", "User Action",       "User clicks 'Export CSV' in RequestHistoryPage.jsx"),
    ("2", "React Component",   "Component maps the filtered data to CSV rows using hand-written algorithm"),
    ("3", "Blob Download",     "Creates a Blob → URL.createObjectURL() → triggers browser download"),
    ("— OR —", "", ""),
    ("1", "User Action",       "User submits the feedback form in FeedbackForm.jsx"),
    ("2", "Axios POST",        "axios.post('/api/community/feedback', data, { headers: {Authorization: Bearer token} })"),
    ("3", "Express Router",    "communityRoutes.js routes the request to communityController.submitFeedback()"),
    ("4", "Controller Logic",  "Validates ownership → checks donor match → checks for duplicates → saves to MongoDB"),
    ("5", "Response",          "Returns { success: true, feedback: {...} } as JSON back to React"),
    ("6", "UI Update",         "React re-renders to show success message and the new feedback on the profile"),
]
for num, title, detail in flow_steps:
    if num == "— OR —":
        story.append(Paragraph("— OR (for server-side requests like feedback submission) —",
                                S("or", fontSize=9, fontName="Helvetica-Oblique",
                                  textColor=colors.grey, alignment=TA_CENTER)))
        continue
    row_data = [[
        Paragraph(f"<b>{num}</b>", S("fn", fontSize=11, fontName="Helvetica-Bold",
                  textColor=WHITE, alignment=TA_CENTER)),
        Paragraph(f"<b>{title}</b>", S("ft", fontSize=9.5, fontName="Helvetica-Bold",
                  textColor=DARK_RED)),
        Paragraph(detail, S("fd", fontSize=9, fontName="Helvetica", textColor=MID_GREY,
                  leading=12)),
    ]]
    ft = Table(row_data, colWidths=[0.8*cm, 3.2*cm, W-3.6*cm-4*cm])
    ft.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(0,-1), BLUE),
        ("BACKGROUND",    (1,0),(-1,-1), WHITE),
        ("BOX",           (0,0),(-1,-1), 0.5, CODE_BORDER),
        ("TOPPADDING",    (0,0),(-1,-1), 5),
        ("BOTTOMPADDING", (0,0),(-1,-1), 5),
        ("LEFTPADDING",   (0,0),(-1,-1), 7),
        ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
    ]))
    story.append(ft)
    story.append(Spacer(1, 3))

story.append(PageBreak())

# ── CH 6: VIVA Q&A ──────────────────────────────────────────────
story += chapter_header("Chapter 6 — Viva Questions & Answers", "🎓")
story.append(Paragraph(
    "These are the most likely questions faculty will ask based on your module. "
    "Each answer is written to be clear and confident — read them aloud until they feel natural.",
    body))
story.append(Spacer(1, 8))

qas = [
    ("Q1", "What features did you build?",
     "I built 6 features: Donation History with statistics and a bar chart, Request History "
     "with expandable rows and CSV export, a Donor Leaderboard with monthly/all-time tabs, "
     "an Eligibility Reminder system with a daily cron job, a Donor-Requester Feedback system "
     "with star ratings, and an FAQ page with admin content management."),

    ("Q2", "What is the MVC architecture and how did you use it?",
     "MVC stands for Model-View-Controller. The Model defines the data structure in MongoDB — "
     "for example, Feedback.js defines fields like donorId, rating, message, and allowPublic. "
     "The View is the React component the user sees — like FeedbackForm.jsx which renders the "
     "star rating UI. The Controller contains the business logic — communityController.js handles "
     "validation, database operations, and returns JSON responses."),

    ("Q3", "What is a REST API? Give an example from your code.",
     "REST is a set of rules for building web APIs using HTTP methods. GET retrieves data, "
     "POST creates data, PUT updates data, DELETE removes data. For example, when a user submits "
     "feedback, the frontend calls POST /api/community/feedback with the rating and message. "
     "The backend validates it, saves it to MongoDB, and returns a JSON response."),

    ("Q4", "How does your leaderboard ranking work?",
     "I use a MongoDB aggregation pipeline — a series of steps that transform the data. "
     "First, $match filters out suspended users and optionally filters by city. "
     "Then $sort orders donors by donationCount from highest to lowest. "
     "$limit takes only the top 50. $project selects only the fields we need to reduce data size. "
     "For the monthly tab, I run the same pipeline on the Donation collection filtered by donationDate within the current month."),

    ("Q5", "Explain your CSV export. Why did you write it yourself?",
     "The course rules require core algorithms to be hand-written, not imported from npm libraries. "
     "My CSV generator defines headers as an array, maps each data row to a comma-separated string, "
     "and handles edge cases: if a value contains commas, quotes, or newlines, it is wrapped in "
     "double quotes and internal double quotes are escaped as two double quotes. "
     "All rows are joined with newline characters. Then I create a Blob with MIME type text/csv, "
     "generate a download URL with URL.createObjectURL(), and programmatically click a temporary "
     "anchor element to trigger the file download."),

    ("Q6", "How does the cron job work for eligibility reminders?",
     "I use the node-cron library to schedule a function that runs daily at 8:00 AM — the cron "
     "expression is '0 8 * * *' meaning minute 0, hour 8, every day. The function queries MongoDB "
     "for donors whose nextEligibleDate is today or earlier and isAvailable is false. "
     "For each eligible donor it sends a reminder email via Nodemailer using Gmail SMTP. "
     "It is like setting a daily alarm on the server."),

    ("Q7", "What is React Context API and how do you use it?",
     "Context API lets you share data across React components without passing it through props "
     "at every level — this is called prop drilling. In our project, AuthContext.js provides "
     "the user object, the JWT token, and login/logout functions to the entire app. "
     "In my components I access it with: const { token, user } = useAuth(); "
     "Then I include the token in every API call header as: Authorization: Bearer token."),

    ("Q8", "What is Mongoose and how did you define your schemas?",
     "Mongoose is an Object Data Modeling library for MongoDB. It lets you define schemas that "
     "enforce structure on your database documents. For example, my Feedback schema requires a "
     "donorId, a requestId, a rating between 1 and 5, an optional message up to 500 characters, "
     "and an allowPublic boolean. The ref field in donorId enables the populate() method to "
     "automatically join data from the Donor collection — like a JOIN in SQL."),

    ("Q9", "What is the difference between useState and useEffect?",
     "useState declares a reactive variable — when you update it, React re-renders the component. "
     "For example: const [rating, setRating] = useState(0); clicking a star calls setRating(3) "
     "and the component updates. useEffect runs code after the component renders — typically for "
     "API calls. The dependency array controls when it runs: useEffect(() => { fetchLeaderboard(); }, "
     "[type, city]) runs whenever type or city changes."),

    ("Q10", "How did you validate the feedback submission?",
     "There are 4 layers. First, frontend validation — rating must be 1–5 and the request must "
     "be in Completed status. Second, ownership validation — the backend checks that the person "
     "submitting is the same user who created the request. Third, donor match validation — the "
     "donor being rated must be the one actually matched to the request, preventing someone from "
     "leaving fake feedback for a different donor. Fourth, duplicate prevention — we check if "
     "feedback already exists for this specific request to prevent multiple submissions."),

    ("Q11", "What is responsive design and how did you implement it?",
     "Responsive design means the UI adapts to different screen sizes — desktop, tablet, mobile. "
     "I implemented it using CSS media queries: @media (max-width: 768px) to adjust layouts for "
     "smaller screens. I used Flexbox for flexible containers, percentage-based widths instead of "
     "fixed pixels, and a mobile-first approach in the history filters and leaderboard table."),

    ("Q12", "What is the difference between GET and POST?",
     "GET retrieves data from the server — it is safe, has no body, and parameters go in the URL "
     "as query strings. For example: GET /api/community/leaderboard?type=monthly retrieves the "
     "monthly leaderboard. POST sends data to create something new — parameters go in the request "
     "body as JSON, not in the URL. For example: POST /api/community/feedback sends the rating "
     "and message to create a new feedback record."),
]

for qnum, question, answer in qas:
    story.append(KeepTogether([
        Paragraph(f"{qnum}: {question}", qa_q),
        Paragraph(answer, qa_a),
        hr(CODE_BORDER, 0.5),
    ]))

story.append(PageBreak())

# ── CH 7: HAND-WRITTEN ALGORITHMS ───────────────────────────────
story += chapter_header("Chapter 7 — My Hand-Written Algorithms", "✍")
story.append(Paragraph(
    "The course requires that core logic algorithms are written by the team — not imported "
    "from npm libraries. Here are the 4 algorithms I wrote from scratch.",
    body))
story.append(Spacer(1, 6))

algos = [
    ("CSV Export Algorithm", "RequestHistoryPage.jsx",
     "Generates a properly formatted .csv file directly in the browser without any library.",
     [
         "// 1. Define headers",
         "const headers = ['Patient Name','Blood Type','Units','Hospital','Urgency','Status','Date'];",
         "",
         "// 2. Handle special characters",
         "const escapeCSV = (val) => {",
         "    const str = String(val ?? '');",
         "    if (str.includes(',') || str.includes('\"') || str.includes('\\n'))",
         "        return `\"${str.replace(/\"/g, '\"\"')}\"`;",
         "    return str;",
         "};",
         "",
         "// 3. Build CSV string and trigger download",
         "const csvContent = [headers.join(','), ...rows.map(r => cols.map(escapeCSV).join(','))].join('\\n');",
         "const blob = new Blob([csvContent], { type: 'text/csv' });",
         "const url = URL.createObjectURL(blob);",
         "// ... click <a> element to trigger download",
     ]),
    ("Leaderboard Ranking Algorithm", "communityController.js → getLeaderboard()",
     "MongoDB aggregation pipeline to rank donors by donation count.",
     [
         "const pipeline = [",
         "    { $match: { isSuspended: { $ne: true } } },  // exclude suspended users",
         "    { $sort: { donationCount: -1 } },             // highest count first",
         "    { $limit: 50 },                               // top 50 only",
         "    { $project: { name:1, bloodType:1, donationCount:1, badges:1 } }",
         "];",
         "if (city) pipeline[0].$match.city = new RegExp(`^${city}$`, 'i');",
         "const leaderboard = await Donor.aggregate(pipeline);",
     ]),
    ("Dynamic Filter Builder", "DonationHistoryPage.jsx + donorController.js",
     "Builds MongoDB filter objects dynamically from whichever query parameters are present.",
     [
         "// Backend (donorController.js)",
         "const filter = { donorId: req.user._id };",
         "if (req.query.bloodType) filter.bloodType = req.query.bloodType;",
         "if (req.query.status)    filter.status = req.query.status;",
         "if (req.query.from || req.query.to) {",
         "    filter.donationDate = {};",
         "    if (req.query.from) filter.donationDate.$gte = new Date(req.query.from);",
         "    if (req.query.to)   filter.donationDate.$lte = new Date(req.query.to);",
         "}",
         "const donations = await Donation.find(filter).skip(skip).limit(20);",
     ]),
    ("Date Formatter", "Multiple files",
     "Formats MongoDB ISO date strings into readable format without moment.js or date-fns.",
     [
         "// Example: '2025-03-15T08:30:00.000Z' → 'March 15, 2025'",
         "const formatDate = (dateStr) => {",
         "    const d = new Date(dateStr);",
         "    return d.toLocaleDateString('en-US', {",
         "        year: 'numeric', month: 'long', day: 'numeric'",
         "    });",
         "};",
     ]),
]

for algo_name, file_ref, desc, code_lines in algos:
    story.append(Paragraph(f"▶ {algo_name}", sec_title))
    story.append(Paragraph(f"<b>File:</b> <font face='Courier' color='#C0392B'>{file_ref}</font>", body))
    story.append(Paragraph(desc, body))
    # code block
    code_text = "<br/>".join(
        ln.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
        for ln in code_lines
    )
    code_para = Paragraph(code_text, S("cp", fontSize=7.8, fontName="Courier",
                                        leading=11, textColor=colors.HexColor("#1A252F")))
    ct = Table([[code_para]], colWidths=[W-3.6*cm])
    ct.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), CODE_BG),
        ("BOX",           (0,0),(-1,-1), 0.8, CODE_BORDER),
        ("LEFTBORDER",    (0,0),(0,-1), 3, BLUE),
        ("TOPPADDING",    (0,0),(-1,-1), 8),
        ("BOTTOMPADDING", (0,0),(-1,-1), 8),
        ("LEFTPADDING",   (0,0),(-1,-1), 12),
    ]))
    story.append(ct)
    story.append(Spacer(1, 8))

story.append(PageBreak())

# ── CH 8: GIT WORKFLOW ───────────────────────────────────────────
story += chapter_header("Chapter 8 — Git Workflow & My Branches", "🌿")
story.append(Paragraph(
    "The team used a <b>feature-branch workflow</b>. Each feature was developed on its own "
    "branch, then merged into <font face='Courier'>dev</font> via a Pull Request. "
    "The final <font face='Courier'>dev</font> merge into <font face='Courier'>main</font> "
    "happened before the GitHub deadline (May 5, 2026 11:59 PM).",
    body))
story.append(Spacer(1, 8))

branch_data = [
    ["My Branch", "Feature", "Status"],
    ["feature/anika-donation-history", "F5 — Donation History & Statistics", "✅ Merged"],
    ["feature/anika-request-history",  "F12 — Request History & CSV Export",  "✅ Merged"],
    ["feature/anika-leaderboard",      "F13 — Leaderboard & Badges",          "✅ Merged"],
    ["feature/anika-eligibility",      "F14 — Eligibility Reminders & Health Tips","✅ Merged"],
    ["feature/anika-feedback",         "F15 — Feedback System",               "✅ Merged"],
    ["feature/anika-faq-content",      "F20 — FAQ & Content Management",      "✅ Merged"],
]
bt2 = Table(branch_data, colWidths=[6.5*cm, 7.5*cm, 2*cm])
bt2.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,0), DARK_BG),
    ("TEXTCOLOR",     (0,0),(-1,0), WHITE),
    ("FONTNAME",      (0,0),(-1,0), "Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, SOFT_GREEN]),
    ("GRID",          (0,0),(-1,-1), 0.4, CODE_BORDER),
    ("TOPPADDING",    (0,0),(-1,-1), 6),
    ("BOTTOMPADDING", (0,0),(-1,-1), 6),
    ("LEFTPADDING",   (0,0),(-1,-1), 8),
    ("FONTSIZE",      (0,0),(-1,-1), 8.5),
    ("FONTNAME",      (0,1),(-1,-1), "Courier"),
]))
story.append(bt2)
story.append(Spacer(1, 10))

story.append(Paragraph("My Workflow Commands", sec_title))
git_lines = [
    "# 1. Start from the latest dev branch",
    "git checkout dev",
    "git pull origin dev",
    "",
    "# 2. Create a new feature branch",
    "git checkout -b feature/anika-leaderboard",
    "",
    "# 3. After coding — stage, commit, push",
    "git add -A",
    'git commit -m "feat: create LeaderboardPage with tabs and city filter"',
    "git push origin feature/anika-leaderboard",
    "",
    "# 4. Create a Pull Request on GitHub → merge into dev",
    "# 5. Before deadline → dev merged into main",
]
git_text = "<br/>".join(
    ln.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
    for ln in git_lines
)
gp = Paragraph(git_text, S("gp", fontSize=8, fontName="Courier", leading=12,
                             textColor=colors.HexColor("#1A252F")))
gt = Table([[gp]], colWidths=[W-3.6*cm])
gt.setStyle(TableStyle([
    ("BACKGROUND",  (0,0),(-1,-1), CODE_BG),
    ("BOX",         (0,0),(-1,-1), 0.8, CODE_BORDER),
    ("TOPPADDING",  (0,0),(-1,-1), 10),
    ("BOTTOMPADDING",(0,0),(-1,-1), 10),
    ("LEFTPADDING", (0,0),(-1,-1), 12),
]))
story.append(gt)
story.append(Spacer(1, 8))

story.append(Paragraph("Commit Message Convention", sec_title))
commit_data = [
    ["Prefix", "Used When", "Example"],
    ["feat:",  "Adding a new feature", 'feat: add FAQ accordion page with category tabs'],
    ["fix:",   "Fixing a bug",          'fix: correct CSV escaping for fields with commas'],
    ["style:", "CSS changes only",      'style: update leaderboard table dark theme'],
    ["docs:",  "Documentation updates", 'docs: add inline comments to reminderJob.js'],
]
cmt = Table(commit_data, colWidths=[1.5*cm, 5*cm, W-3.6*cm-6.5*cm])
cmt.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,0), MID_GREY),
    ("TEXTCOLOR",     (0,0),(-1,0), WHITE),
    ("FONTNAME",      (0,0),(-1,0), "Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, LIGHT_GREY]),
    ("GRID",          (0,0),(-1,-1), 0.4, CODE_BORDER),
    ("TOPPADDING",    (0,0),(-1,-1), 6),
    ("BOTTOMPADDING", (0,0),(-1,-1), 6),
    ("LEFTPADDING",   (0,0),(-1,-1), 8),
    ("FONTSIZE",      (0,0),(-1,-1), 8.5),
    ("VALIGN",        (0,0),(-1,-1), "TOP"),
]))
story.append(cmt)
story.append(PageBreak())

# ── CH 9: CONTRIBUTION SUMMARY ──────────────────────────────────
story += chapter_header("Chapter 9 — My Full Contribution Summary", "🏆")
story.append(Paragraph("Total: <b>19 component files</b>, <b>6 CSS files</b>, "
                        "<b>~1,200+ lines of frontend code</b>, plus backend controllers, "
                        "models, and the cron job.", body))
story.append(Spacer(1, 8))

contrib = [
    ["Area", "What I Built", "Files"],
    ["Donation History\n(F5)", "Filterable list with date range, blood type, and status filters; DonationStatsCard with Recharts bar chart showing monthly trends",
     "DonationHistoryPage.jsx\nDonationStatsCard.jsx\nDonationStatsCard.css\nHistoryFilters.css"],
    ["Request History\n(F12)", "Expandable rows with full details, 6-stage status timeline with timestamps, hand-written CSV export",
     "RequestHistoryPage.jsx\nHistoryFilters.css"],
    ["Leaderboard\n(F13)", "All-time and monthly tabs, city filter dropdown, badge display, milestone popup animation, MongoDB aggregation pipeline",
     "LeaderboardPage.jsx\nLeaderboard.css\nBadgeShowcase.jsx\nMilestonePopup.jsx"],
    ["Eligibility System\n(F14)", "node-cron daily email reminders, EligibilityReminderCard with countdown display, HealthTipsSection accordion",
     "EligibilityReminderCard.jsx\nHealthTipsSection.jsx\njobs/reminderJob.js"],
    ["Feedback System\n(F15)", "Star rating form (1–5) with gratitude message, public/private toggle, DonorFeedbackSection on profile, 4-layer validation",
     "FeedbackForm.jsx\nFeedback.css\nDonorFeedbackSection.jsx"],
    ["FAQ & Content\n(F20)", "Public accordion FAQ with category tabs, 8×8 blood compatibility chart, admin CRUD editor for FAQ management",
     "FAQPage.jsx\nFAQ.css\nBloodCompatibilityChartPage.jsx\nAdminContentEditor.jsx"],
]

colt = Table(contrib, colWidths=[2.5*cm, 8*cm, W-3.6*cm-10.5*cm])
colt.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,0), DARK_RED),
    ("TEXTCOLOR",     (0,0),(-1,0), WHITE),
    ("FONTNAME",      (0,0),(-1,0), "Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, SOFT_RED, WHITE, colors.HexColor("#EBF5FB"),
                                      WHITE, SOFT_GREEN, LIGHT_GREY]),
    ("GRID",          (0,0),(-1,-1), 0.4, CODE_BORDER),
    ("TOPPADDING",    (0,0),(-1,-1), 7),
    ("BOTTOMPADDING", (0,0),(-1,-1), 7),
    ("LEFTPADDING",   (0,0),(-1,-1), 8),
    ("FONTSIZE",      (0,0),(-1,-1), 8.5),
    ("FONTNAME",      (0,1),(-1,-1), "Helvetica"),
    ("FONTNAME",      (0,1),(0,-1), "Helvetica-Bold"),
    ("VALIGN",        (0,0),(-1,-1), "TOP"),
]))
story.append(colt)
story.append(Spacer(1, 12))

story.append(Paragraph("Technologies I Used", sec_title))
tech_data = [
    ["Technology", "Purpose", "Why Chosen"],
    ["React.js",         "Frontend UI", "Component-based, reusable, fast re-renders with state"],
    ["Vanilla CSS",      "Styling",     "Full design control; dark glassmorphism needs custom gradients & backdrop-filter"],
    ["Recharts",         "Bar charts",  "Lightweight React charting library — easy to integrate, responsive"],
    ["Node.js + Express","Backend API", "JavaScript full-stack; async I/O handles multiple requests efficiently"],
    ["MongoDB + Mongoose","Database",   "Flexible document storage; aggregation pipeline for leaderboard ranking"],
    ["node-cron",        "Scheduling",  "Runs daily eligibility reminder emails without needing external services"],
    ["Nodemailer",       "Email",       "Send reminder emails via Gmail SMTP — free, simple setup"],
    ["Axios",            "HTTP calls",  "Promise-based, clean syntax, easy to attach Authorization headers"],
]
tt = Table(tech_data, colWidths=[3*cm, 4*cm, W-3.6*cm-7*cm])
tt.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,0), BLUE),
    ("TEXTCOLOR",     (0,0),(-1,0), WHITE),
    ("FONTNAME",      (0,0),(-1,0), "Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, SOFT_BLUE]),
    ("GRID",          (0,0),(-1,-1), 0.4, CODE_BORDER),
    ("TOPPADDING",    (0,0),(-1,-1), 6),
    ("BOTTOMPADDING", (0,0),(-1,-1), 6),
    ("LEFTPADDING",   (0,0),(-1,-1), 8),
    ("FONTSIZE",      (0,0),(-1,-1), 8.5),
    ("VALIGN",        (0,0),(-1,-1), "TOP"),
]))
story.append(tt)
story.append(PageBreak())

# ── CH 10: QUICK REFERENCE ───────────────────────────────────────
story += chapter_header("Chapter 10 — Quick Reference Cheat Sheet", "📋")
story.append(Paragraph(
    "Keep this page open during your viva. It has everything you might need to recall quickly.",
    body))
story.append(Spacer(1, 8))

story.append(Paragraph("Key File Locations At a Glance", sec_title))
quick_data = [
    ["If faculty asks about...", "Open this file"],
    ["Donation history filters",     "client/src/components/community/DonationHistoryPage.jsx"],
    ["Monthly bar chart",            "client/src/components/community/DonationStatsCard.jsx"],
    ["CSV export code",              "client/src/components/community/RequestHistoryPage.jsx"],
    ["Leaderboard ranking",          "server/controllers/communityController.js → getLeaderboard()"],
    ["Badge milestone logic",        "client/src/components/community/BadgeShowcase.jsx"],
    ["Cron job / reminder emails",   "server/jobs/reminderJob.js"],
    ["Health tips section",          "client/src/components/community/HealthTipsSection.jsx"],
    ["Star rating feedback form",    "client/src/components/community/FeedbackForm.jsx"],
    ["Feedback validation (backend)","server/controllers/communityController.js → submitFeedback()"],
    ["Feedback schema (MongoDB)",    "server/models/Feedback.js"],
    ["FAQ public page",              "client/src/components/community/FAQPage.jsx"],
    ["Blood compatibility chart",    "client/src/components/community/BloodCompatibilityChartPage.jsx"],
    ["Admin FAQ editor",             "client/src/components/admin/AdminContentEditor.jsx"],
    ["FAQ schema",                   "server/models/FAQ.js"],
]
qt = Table(quick_data, colWidths=[5.5*cm, W-3.6*cm-5.5*cm])
qt.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,0), MID_GREY),
    ("TEXTCOLOR",     (0,0),(-1,0), WHITE),
    ("FONTNAME",      (0,0),(-1,0), "Helvetica-Bold"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, LIGHT_GREY]),
    ("GRID",          (0,0),(-1,-1), 0.4, CODE_BORDER),
    ("TOPPADDING",    (0,0),(-1,-1), 5),
    ("BOTTOMPADDING", (0,0),(-1,-1), 5),
    ("LEFTPADDING",   (0,0),(-1,-1), 8),
    ("FONTSIZE",      (0,0),(-1,-1), 8.5),
    ("VALIGN",        (0,0),(-1,-1), "TOP"),
]))
story.append(qt)
story.append(Spacer(1, 10))

story.append(Paragraph("Impress-Faculty Talking Points", sec_title))
impress = [
    ("Hand-written algorithms",
     "CSV export and leaderboard ranking are written from scratch — no npm libraries — "
     "as required by the course. This shows I understand the underlying logic."),
    ("4-layer feedback validation",
     "Frontend, ownership, donor-match, and duplicate-prevention checks. "
     "Security was not an afterthought — it was designed in from the start."),
    ("MongoDB aggregation pipeline",
     "The leaderboard uses a proper pipeline with $match, $sort, $limit, $project "
     "instead of loading all donors and sorting in JavaScript."),
    ("Scheduled server task",
     "The node-cron eligibility reminder runs automatically every day at 8:00 AM — "
     "no manual intervention needed."),
    ("Dark glassmorphism design",
     "All 6 CSS files use backdrop-filter blur, custom gradients, and consistent "
     "dark theme — built with vanilla CSS for maximum control."),
    ("19 React components",
     "Each component has a single responsibility — following React best practices "
     "with clean separation of concerns."),
]
for title, point in impress:
    data = [[
        Paragraph(f"★ {title}", S("it", fontSize=9.5, fontName="Helvetica-Bold", textColor=GOLD)),
        Paragraph(point, S("ip", fontSize=9, fontName="Helvetica", textColor=MID_GREY, leading=12)),
    ]]
    t = Table(data, colWidths=[4*cm, W-3.6*cm-4*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), DARK_BG),
        ("TOPPADDING",    (0,0),(-1,-1), 7),
        ("BOTTOMPADDING", (0,0),(-1,-1), 7),
        ("LEFTPADDING",   (0,0),(-1,-1), 10),
        ("BOX",           (0,0),(-1,-1), 0.5, MID_GREY),
    ]))
    story.append(t)
    story.append(Spacer(1, 4))

story.append(Spacer(1, 16))
story.append(hr(GOLD, 2))
final = Paragraph(
    "Best of luck on your viva, Anika! You built 6 complete features — know them, own them. 🩸",
    S("fin", fontSize=11, fontName="Helvetica-Bold", textColor=DARK_RED, alignment=TA_CENTER))
story.append(final)
story.append(Paragraph("CSE470 — Software Engineering | Spring 2026",
                        S("fs", fontSize=9, fontName="Helvetica", textColor=colors.grey,
                          alignment=TA_CENTER)))

# ── BUILD ────────────────────────────────────────────────────────
doc.build(story)
print("PDF created successfully!")
