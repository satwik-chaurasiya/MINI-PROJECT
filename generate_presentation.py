import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette Constants (Editorial Dark OLED)
    BG_COLOR = RGBColor(7, 9, 14)          # Deep Obsidian #07090E
    CARD_BG = RGBColor(18, 24, 41)         # Card Navy #121829
    CARD_BORDER = RGBColor(30, 41, 59)     # Border Slate #1E293B
    TEXT_MAIN = RGBColor(248, 250, 252)    # Slate 50 #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)   # Slate 400 #94A3B8
    CYAN = RGBColor(56, 189, 248)          # Electric Cyan #38BDF8
    GREEN = RGBColor(16, 185, 129)         # Emerald Green #10B981
    AMBER = RGBColor(245, 158, 11)         # Amber #F59E0B
    PURPLE = RGBColor(168, 85, 247)        # Purple #A855F7

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text):
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.3))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p_tag = tf.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = CYAN
        
        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_MAIN
        
        if subtitle_text:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle_text
            p_sub.font.size = Pt(13)
            p_sub.font.color.rgb = TEXT_MUTED

    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)
        return card

    # SLIDE 1: Title
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1)
    add_card(s1, Inches(1.0), Inches(0.8), Inches(11.333), Inches(5.9), bg_color=RGBColor(13, 18, 30), border_color=CYAN)
    
    tb1 = s1.shapes.add_textbox(Inches(1.5), Inches(1.2), Inches(10.333), Inches(4.8))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    
    p = tf1.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "FINAL YEAR ACADEMIC PROJECT DEFENSE"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = GREEN
    
    p = tf1.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = "PriceSpy"
    p.font.size = Pt(50)
    p.font.bold = True
    p.font.color.rgb = CYAN
    
    p = tf1.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = "AI-Powered E-Commerce Price Prediction & Multi-Store Retail Intelligence System"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    
    p = tf1.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = "Solving Consumer Price Discrimination via Time-Series Forecasting & Real-Time Multi-Store Arbitrage"
    p.font.size = Pt(14)
    p.font.color.rgb = TEXT_MUTED
    
    p = tf1.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = "\n[ Python 3.14 ]  •  [ FastAPI ]  •  [ Facebook Prophet v3.2 ]  •  [ React 19 ]  •  [ SQLite WAL ]  •  [ Docker ]"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = CYAN

    p = tf1.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = "\nPresented in Front of College Faculty Evaluators & Project Review Panel\nDepartment of Computer Science & Engineering"
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_MAIN

    s1.notes_slide.notes_text_frame.text = (
        "WELCOME & INTRODUCTION (Slide 1):\n"
        "- Respected professors and external judges, good morning.\n"
        "- Today, I am proud to present 'PriceSpy', an end-to-end AI-powered e-commerce price prediction and multi-store retail intelligence system.\n"
        "- PriceSpy aggregates 4 major stores in real time and forecasts price trajectories over 30 days using Facebook Prophet machine learning to deliver a definitive 'BUY NOW' or 'WAIT' verdict."
    )

    # SLIDE 2: Executive Summary
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "EXECUTIVE SUMMARY", "Why PriceSpy? The Core Motivation", "Eliminating buyer regret and dynamic price exploitation in online retail.")
    
    cards_data = [
        ("The Consumer Pain", "Dynamic Price Shocks", [
            "E-commerce platforms dynamically reprice goods up to millions of times daily.",
            "Consumers experience buyer's remorse when a product drops ₹4,000 days after purchase.",
            "Information asymmetry prevents consumers from knowing if a 'sale' is a genuine discount."
        ], CYAN),
        ("The Solution", "Google Flights for Shopping", [
            "1-Click concurrent price comparison across Amazon, Flipkart, Walmart, and eBay.",
            "Time-Series Prophet ML modeling predicting 7d, 15d, and 30d future prices.",
            "Algorithmic decision matrix providing an explicit BUY NOW vs. WAIT recommendation."
        ], GREEN),
        ("Key Innovation", "Predictive vs. Rearview", [
            "Existing tools (Keepa, CamelCamelCamel) only display past historical charts.",
            "PriceSpy forecasts future trajectory with 89.92% verified benchmark accuracy.",
            "Embedded festival calendar accounts for Big Billion Days, Prime Day & Diwali sales."
        ], AMBER)
    ]
    
    lefts = [0.8, 4.8, 8.8]
    for i, (tag, title, bullets, color) in enumerate(cards_data):
        add_card(s2, Inches(lefts[i]), Inches(1.8), Inches(3.7), Inches(5.1))
        tb = s2.shapes.add_textbox(Inches(lefts[i] + 0.2), Inches(2.0), Inches(3.3), Inches(4.7))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = tag.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = color
        
        p = tf.add_paragraph()
        p.text = title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN
        
        for b in bullets:
            p = tf.add_paragraph()
            p.text = "• " + b
            p.font.size = Pt(12)
            p.font.color.rgb = TEXT_MUTED

    # SLIDE 3: Problem Statement
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "PROBLEM FORMULATION", "The Dynamic Pricing Trap in E-Commerce", "Algorithmic repricing algorithms leave consumers at a major disadvantage.")
    
    add_card(s3, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.1))
    tb = s3.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.7))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "LIMITATIONS OF CURRENT MARKETPLACE TOOLS"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = AMBER
    p = tf.add_paragraph()
    p.text = "Why Existing Trackers Fall Short"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    
    bullet_list = [
        ("No Predictive Intelligence: ", "Existing tools only graph what happened in the past. They cannot project future discount dips."),
        ("Siloed Ecosystems: ", "A buyer must check Amazon tracker, Flipkart tracker, Walmart, and eBay individually across different tabs."),
        ("Failure on Retail Shocks: ", "Standard linear models assume prices are steady, completely failing during sudden festival drops like Big Billion Days."),
        ("No Actionable Verdict: ", "Users are left to guess whether today's price is good or if waiting 10 days will save them ₹5,000.")
    ]
    for b_title, b_desc in bullet_list:
        p = tf.add_paragraph()
        p.text = "❌ " + b_title + b_desc
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_MUTED

    add_card(s3, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.1))
    tb2 = s3.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.7))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "THE PRICESPY PARADIGM SHIFT"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = GREEN
    p = tf2.add_paragraph()
    p.text = "What PriceSpy Delivers"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    
    shift_list = [
        ("Multi-Store Arbitrage: ", "Simultaneously harvest live quotes across Amazon, Flipkart, Walmart, and eBay in one consolidated view."),
        ("Decomposable ML Forecasting: ", "Facebook Prophet v3.2 models annual festival shocks and payday harmonics with 89.92% accuracy."),
        ("Uncertainty Intervals: ", "Bayesian posterior ribbons provide 80% confidence boundaries so users see best and worst-case scenarios."),
        ("24/7 Autonomous Watchdog: ", "Background daemon checks active targets every 24h and emails users the moment target threshold is achieved.")
    ]
    for b_title, b_desc in shift_list:
        p = tf2.add_paragraph()
        p.text = "⚡ " + b_title + b_desc
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_MAIN

    # SLIDE 4: Architecture
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "SYSTEM ARCHITECTURE", "Four-Tier Decoupled System Architecture", "High-performance modular architecture containerized with Docker.")
    
    layers = [
        ("LAYER 1", "Client Layer", "React 19 SPA", [
            "Tailwind CSS Dark OLED",
            "Recharts AreaChart Bands",
            "Lucide UI Icon System",
            "Sub-50ms Client Routing"
        ], CYAN),
        ("LAYER 2", "API Gateway", "FastAPI (Async)", [
            "Asynchronous REST Endpoints",
            "Pydantic v2 Serialization",
            "Bcrypt + JWT Security",
            "Auto OpenAPI Swagger Docs"
        ], GREEN),
        ("LAYER 3", "ML Engine", "Prophet v3.2", [
            "Multiplicative Seasonality",
            "7d / 15d / 30d Horizons",
            "Festival Calendar Rails",
            "Payday Fourier Harmonics"
        ], AMBER),
        ("LAYER 4", "Storage & Daemons", "SQLite WAL & Cron", [
            "SQLite Write-Ahead Logging",
            "24/7 Alert Dispatcher",
            "Concurrent Scraper Rails",
            "Docker Compose Network"
        ], PURPLE)
    ]
    
    col_w = 2.7
    col_gap = 0.25
    start_left = 0.8
    for i, (l_tag, l_name, l_sub, l_points, l_col) in enumerate(layers):
        l_pos = start_left + i * (col_w + col_gap)
        add_card(s4, Inches(l_pos), Inches(1.8), Inches(col_w), Inches(5.1))
        tb = s4.shapes.add_textbox(Inches(l_pos + 0.15), Inches(2.0), Inches(col_w - 0.3), Inches(4.7))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = l_tag
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = l_col
        
        p = tf.add_paragraph()
        p.text = l_name
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN
        
        p = tf.add_paragraph()
        p.text = l_sub
        p.font.size = Pt(12)
        p.font.color.rgb = CYAN
        
        for pt in l_points:
            p = tf.add_paragraph()
            p.text = "• " + pt
            p.font.size = Pt(11)
            p.font.color.rgb = TEXT_MUTED

    # SLIDE 5: Machine Learning
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "MACHINE LEARNING ENGINE", "Predictive Modeling: Facebook Prophet v3.2", "Decomposing retail time-series into trend, seasonality, and festival shocks.")
    
    add_card(s5, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.1))
    tb = s5.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.3), Inches(4.7))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "MATHEMATICAL FORMULATION"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = CYAN
    
    p = tf.add_paragraph()
    p.text = "y(t) = g(t) × (1 + s(t)) + h(t) + εₜ"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = GREEN
    
    components = [
        ("g(t) — Growth Trend: ", "Piecewise linear curve modeling gradual hardware depreciation over time, with changepoint prior scale = 0.18 for sudden promotional flexibility."),
        ("s(t) — Multiplicative Seasonality: ", "Multiplies trend rather than adding flat rupees. Accompanied by monthly Fourier harmonics (order 5, period 30.5d) for month-end payday sales."),
        ("h(t) — Shopping Festival Events: ", "Custom retail holiday window engine modeling Amazon Great Indian Festival, Flipkart Big Billion Days, Prime Day, Republic Day, and Black Friday."),
        ("εₜ — Error Residual: ", "Gaussian distributed noise capturing market fluctuations.")
    ]
    for c_title, c_desc in components:
        p = tf.add_paragraph()
        p.text = "• " + c_title + c_desc
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

    add_card(s5, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.1))
    tb2 = s5.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.7))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    
    p = tf2.paragraphs[0]
    p.text = "WHY MULTIPLICATIVE SEASONALITY IS CRITICAL"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = AMBER
    
    p = tf2.add_paragraph()
    p.text = "Percentage vs. Fixed Rupee Discounts"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    
    reasons = [
        ("Additive Model Flaw: ", "Additive assumes discount is a fixed constant (e.g. ₹2,000 off). On a ₹10,000 phone that's 20%, but on a ₹100,000 laptop it's only 2%, causing severe prediction error."),
        ("Multiplicative Accuracy: ", "Scales discounts proportionally with item price: y = Trend * (1 + Seasonality), correctly predicting 15-25% dips across all price tiers."),
        ("Bayesian Posterior Bounds: ", "Generates empirical 80%-85% confidence intervals [yhat_lower, yhat_upper] preventing overconfident single-point predictions."),
        ("Positive Floor Filtering: ", "Enforces strict proportional price boundaries (min floor at 40% of current price) to eliminate unrealistic negative anomalies.")
    ]
    for r_title, r_desc in reasons:
        p = tf2.add_paragraph()
        p.text = "• " + r_title + r_desc
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

    # SLIDE 6: Decision Matrix
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "DECISION MATRIX", "The BUY NOW vs. WAIT Recommendation Engine", "Translating probabilistic forecasts into unambiguous financial action.")
    
    dec_cards = [
        ("THE FORMULA", "Expected Savings Delta", [
            "Mathematical definition:",
            "ΔP = (P_current - min(yhat_future)) / P_current",
            "Evaluated across 7d, 15d, and 30d forecast horizons.",
            "Accounts for lower confidence bound to prevent false recommendations."
        ], CYAN),
        ("THE THRESHOLD", "The 3.0% Decision Rule", [
            "IF ΔP ≥ 3.0% ➔ VERDICT: WAIT (⏳)",
            "Predicts upcoming price dip, optimal date, and expected rupee savings.",
            "ELSE ➔ VERDICT: BUY NOW (🟢)",
            "Confirms current market price is at or near 60-day historical lowest point."
        ], GREEN),
        ("MULTI-HORIZON", "3 Outlook Windows", [
            "7-Day Outlook: Immediate short-term volatility and flash sales.",
            "15-Day Outlook: Medium-term festival dip sweet-spot.",
            "30-Day Outlook: Post-sale price rebound & market stabilization."
        ], AMBER)
    ]
    for i, (tag, title, bullets, col) in enumerate(dec_cards):
        add_card(s6, Inches(lefts[i]), Inches(1.8), Inches(3.7), Inches(5.1))
        tb = s6.shapes.add_textbox(Inches(lefts[i] + 0.2), Inches(2.0), Inches(3.3), Inches(4.7))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = tag
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = col
        
        p = tf.add_paragraph()
        p.text = title
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN
        
        for b in bullets:
            p = tf.add_paragraph()
            p.text = "• " + b
            p.font.size = Pt(12)
            p.font.color.rgb = TEXT_MUTED

    # SLIDE 7: Data Engineering
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "DATA ENGINEERING", "Multi-Store Scraper Rails & Synthetic Hygiene", "Resilient web harvesting with zero-lookahead synthetic historical alignment.")
    
    s7_cards = [
        ("LIVE SCRAPING RAILS", "Simultaneous 4-Store Harvesting", [
            "BeautifulSoup4 + Requests concurrent worker pool.",
            "Targets Amazon India, Flipkart, Walmart, and eBay.",
            "Dynamic User-Agent pool rotation & randomized delays to avoid IP rate-limits.",
            "Normalizes multi-currency prices (USD to INR conversion)."
        ], CYAN),
        ("3-TIER RESILIENCY", "Fault-Tolerant Hierarchy", [
            "Tier 1: Live Scraping (real-time store HTML parsing).",
            "Tier 2: Seeded Benchmark Catalog (cached verified pricing for 124k items).",
            "Tier 3: Long-tail fallback ensuring 100% search response rate without crashing."
        ], GREEN),
        ("ZERO-LEAKAGE SYNTHESIS", "Backward-Aligned Seeding", [
            "Cold-start solution for newly indexed items without 365-day history.",
            "Backward time array generation anchors the last historical date to today's live scraped price.",
            "Prevents synthetic-to-live price disconnect and guarantees smooth ML model fitting."
        ], PURPLE)
    ]
    for i, (tag, title, bullets, col) in enumerate(s7_cards):
        add_card(s7, Inches(lefts[i]), Inches(1.8), Inches(3.7), Inches(5.1))
        tb = s7.shapes.add_textbox(Inches(lefts[i] + 0.2), Inches(2.0), Inches(3.3), Inches(4.7))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = tag
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = col
        
        p = tf.add_paragraph()
        p.text = title
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN
        
        for b in bullets:
            p = tf.add_paragraph()
            p.text = "• " + b
            p.font.size = Pt(12)
            p.font.color.rgb = TEXT_MUTED

    # SLIDE 8: Evaluation Benchmarks
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8)
    add_header(s8, "EXPERIMENTAL BENCHMARKS", "Model Evaluation & Quantitative Accuracy", "Rigorous 80/20 chronological validation against real-world retail price datasets.")
    
    kpis = [
        ("MAE", "₹3,019.19", "🔻 -84.1% Error", GREEN),
        ("RMSE", "₹3,655.19", "🔻 -84.0% Variance", CYAN),
        ("MAPE", "10.08%", "🔻 -23.2% Absolute", AMBER),
        ("MODEL ACCURACY", "89.92%", "🔥 +23.2% Lift", GREEN)
    ]
    k_w = 2.7
    k_gap = 0.25
    for i, (k_name, k_val, k_sub, k_col) in enumerate(kpis):
        k_left = 0.8 + i * (k_w + k_gap)
        add_card(s8, Inches(k_left), Inches(1.8), Inches(k_w), Inches(1.4))
        tb = s8.shapes.add_textbox(Inches(k_left + 0.1), Inches(1.9), Inches(k_w - 0.2), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = k_name
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = TEXT_MUTED
        
        p = tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        p.text = k_val
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = k_col
        
        p = tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        p.text = k_sub
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_MAIN

    add_card(s8, Inches(0.8), Inches(3.4), Inches(11.7), Inches(3.5))
    table_shape = s8.shapes.add_table(6, 5, Inches(1.0), Inches(3.6), Inches(11.3), Inches(3.1))
    table = table_shape.table
    
    table_data = [
        ["Metric", "Definition", "Old Baseline Model", "PriceSpy v3.2 Engine", "Improvement"],
        ["Mean Absolute Error (MAE)", "Average absolute rupee deviation", "₹18,988.14", "₹3,019.19", "🔻 84.1% Reduction"],
        ["Root Mean Squared Error (RMSE)", "Penalty on extreme outlier mistakes", "₹22,861.94", "₹3,655.19", "🔻 84.0% Variance Drop"],
        ["Mean Abs Pct Error (MAPE)", "Average percentage error relative to price", "33.28%", "10.08%", "🔻 23.2% Absolute Drop"],
        ["Overall Benchmark Accuracy", "Percentage of accurate trend forecasts", "66.72%", "89.92%", "🔥 +23.20% Accuracy Lift"],
        ["Median Product Accuracy", "Typical accuracy experienced across items", "71.58%", "95.18%", "🔥 +23.60% Median Lift"]
    ]
    
    for row_idx, row in enumerate(table_data):
        for col_idx, cell_value in enumerate(row):
            cell = table.cell(row_idx, col_idx)
            cell.text = cell_value
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(11 if row_idx > 0 else 12)
            p.font.bold = (row_idx == 0 or col_idx == 3 or col_idx == 4)
            if row_idx == 0:
                p.font.color.rgb = CYAN
            elif col_idx == 3 or col_idx == 4:
                p.font.color.rgb = GREEN
            else:
                p.font.color.rgb = TEXT_MAIN

    # SLIDE 9: UI Walkthrough — Landing Page
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9)
    add_header(s9, "USER INTERFACE WALKTHROUGH", "The Command Center: Modern Landing Page", "Editorial Deep Obsidian OLED interface (#07090E) with real-time telemetry HUD.")
    
    img_path = os.path.join("docs", "images", "landing_page_ui.png")
    if os.path.exists(img_path):
        s9.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(6.8), Inches(5.1))
    
    add_card(s9, Inches(7.8), Inches(1.8), Inches(4.7), Inches(5.1))
    tb = s9.shapes.add_textbox(Inches(8.0), Inches(2.0), Inches(4.3), Inches(4.7))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "KEY INTERACTION DESIGN"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = CYAN
    p = tf.add_paragraph()
    p.text = "Landing Page Architecture"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    
    lp_points = [
        ("Floating Glass Navbar: ", "Features live green status badge confirming 'Prophet ML v3.2: Online' and seamless navigation routes."),
        ("Multi-Store Search Bar: ", "Instant keyboard autocomplete with live connectivity indicator badges for Amazon, Flipkart, Walmart, and eBay."),
        ("4-Metric Telemetry HUD: ", "Real-time metrics: 4 Active Scraping Rails, 124,582 Tracked Items, -21.4% Avg Festival Drop, 89.9% Model Accuracy."),
        ("Trending Deals Feed: ", "Responsive frosted glass cards displaying verified live market discounts and 1-click comparison triggers.")
    ]
    for pt_title, pt_desc in lp_points:
        p = tf.add_paragraph()
        p.text = "• " + pt_title + pt_desc
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

    # SLIDE 10: UI Walkthrough — Compare Page
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10)
    add_header(s10, "USER INTERFACE WALKTHROUGH", "Multi-Store Real-Time Arbitrage Comparator", "Comparing price quotes across 4 platforms side-by-side with cheapest badge.")
    
    img_path = os.path.join("docs", "images", "compare_page_ui.png")
    if os.path.exists(img_path):
        s10.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(6.8), Inches(5.1))
        
    add_card(s10, Inches(7.8), Inches(1.8), Inches(4.7), Inches(5.1))
    tb = s10.shapes.add_textbox(Inches(8.0), Inches(2.0), Inches(4.3), Inches(4.7))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "COMPARATOR CAPABILITIES"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = GREEN
    p = tf.add_paragraph()
    p.text = "1-Click Price Arbitrage"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    
    comp_points = [
        ("Unified Product Summary: ", "Aggregates specs, user ratings, and immediate potential savings across platforms."),
        ("Cheapest Platform Badge: ", "Automatically flags lowest store with an emerald green badge (e.g. Flipkart @ ₹64,990 vs Amazon @ ₹67,990)."),
        ("Live Store Cards: ", "Displays live shipping estimates, seller ratings, and direct outward store links."),
        ("Track in Database Action: ", "1-Click action saves the product to the user's SQLite watchlist with target price drop monitoring.")
    ]
    for pt_title, pt_desc in comp_points:
        p = tf.add_paragraph()
        p.text = "• " + pt_title + pt_desc
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

    # SLIDE 11: UI Walkthrough — Forecast View
    s11 = prs.slides.add_slide(blank_layout)
    add_bg(s11)
    add_header(s11, "USER INTERFACE WALKTHROUGH", "30-Day Forecast & Interactive Decision View", "Recharts dual-line AreaChart with confidence ribbon and algorithmic verdict banner.")
    
    img_path = os.path.join("docs", "images", "product_forecast_ui.png")
    if os.path.exists(img_path):
        s11.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(6.8), Inches(5.1))
        
    add_card(s11, Inches(7.8), Inches(1.8), Inches(4.7), Inches(5.1))
    tb = s11.shapes.add_textbox(Inches(8.0), Inches(2.0), Inches(4.3), Inches(4.7))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "PREDICTIVE INTELLIGENCE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = AMBER
    p = tf.add_paragraph()
    p.text = "Forecasting Screen Features"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    
    fc_points = [
        ("AI Recommendation Banner: ", "Displays unequivocal advice: 'VERDICT: WAIT (-14% Drop Predicted on Oct 12 during festival sale)'."),
        ("Dual-Line AreaChart: ", "Solid cyan line traces 90-day history; glowing dashed line illustrates 30-day Prophet forecast."),
        ("Shaded Uncertainty Ribbon: ", "Empirical confidence intervals show upper & lower projected bounds."),
        ("Multi-Horizon Cards: ", "Explicit metrics for 7-day, 15-day, and 30-day horizon low points."),
        ("Target Price Alert Creator: ", "Users can set a target budget to receive automated email notifications when reached.")
    ]
    for pt_title, pt_desc in fc_points:
        p = tf.add_paragraph()
        p.text = "• " + pt_title + pt_desc
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

    # SLIDE 12: UI Walkthrough — Admin Telemetry
    s12 = prs.slides.add_slide(blank_layout)
    add_bg(s12)
    add_header(s12, "USER INTERFACE WALKTHROUGH", "System Administration & Scraper Telemetry", "Comprehensive backend health dashboard, scraper latency monitoring, and audit logs.")
    
    img_path = os.path.join("docs", "images", "admin_dashboard_ui.png")
    if os.path.exists(img_path):
        s12.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(6.8), Inches(5.1))
        
    add_card(s12, Inches(7.8), Inches(1.8), Inches(4.7), Inches(5.1))
    tb = s12.shapes.add_textbox(Inches(8.0), Inches(2.0), Inches(4.3), Inches(4.7))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "SYSTEM OBSERVABILITY"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = CYAN
    p = tf.add_paragraph()
    p.text = "Admin Telemetry HUD"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    
    adm_points = [
        ("System Vitals Bar: ", "Tracks 124,582 monitored products, 99.4% scraper success rate, and 99.98% operational uptime."),
        ("ML Error HUD: ", "Real-time display of active model accuracy metrics (MAPE: 10.08%, MAE: ₹3,019.19, RMSE: ₹3,655.19)."),
        ("Scraper Pipeline Health: ", "Monitors individual response latencies for Amazon, Flipkart, Walmart, and eBay (110ms-160ms average)."),
        ("Live Event Log Stream: ", "Real-time terminal console logging 24h cron forecast runs, database write commits, and alert notifications.")
    ]
    for pt_title, pt_desc in adm_points:
        p = tf.add_paragraph()
        p.text = "• " + pt_title + pt_desc
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MUTED

    # SLIDE 13: Future Scope
    s13 = prs.slides.add_slide(blank_layout)
    add_bg(s13)
    add_header(s13, "PROJECT ROADMAP", "Future Scope & Technical Scalability", "Architectural roadmap to scale PriceSpy into an enterprise retail intelligence platform.")
    
    roadmap_cards = [
        ("OMNICHANNEL ALERTS", "WhatsApp & Telegram Bots", [
            "Integrate Twilio / Telegram Bot API for instant push notifications directly to smartphone messengers.",
            "Eliminates dependency on email delivery for flash sales lasting under 30 minutes."
        ], CYAN),
        ("BROWSER INTEGRATION", "Chrome Browser Extension", [
            "Manifest V3 extension injecting live PriceSpy badges directly into Amazon and Flipkart product pages.",
            "Displays real-time 'BUY NOW' or 'WAIT' badges without opening a separate tab."
        ], GREEN),
        ("DEEP LEARNING ENSEMBLE", "LSTM / Transformer Hybrid", [
            "Hybrid Prophet + LSTM / PatchTST deep neural network architecture.",
            "Captures short-term micro-fluctuations and sentiment analysis from Twitter/Reddit deal forums."
        ], AMBER),
        ("CLOUD DISTRIBUTED SCALE", "Celery & PostgreSQL", [
            "Migrate from SQLite WAL to distributed PostgreSQL with TimescaleDB time-series extensions.",
            "Asynchronous Celery worker queues with Redis broker for million-item catalog batch retraining."
        ], PURPLE)
    ]
    
    col_w2 = 2.7
    for i, (tag, title, bullets, col) in enumerate(roadmap_cards):
        c_left = 0.8 + i * (col_w2 + col_gap)
        add_card(s13, Inches(c_left), Inches(1.8), Inches(col_w2), Inches(5.1))
        tb = s13.shapes.add_textbox(Inches(c_left + 0.15), Inches(2.0), Inches(col_w2 - 0.3), Inches(4.7))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = tag
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = col
        
        p = tf.add_paragraph()
        p.text = title
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN
        
        for b in bullets:
            p = tf.add_paragraph()
            p.text = "• " + b
            p.font.size = Pt(11)
            p.font.color.rgb = TEXT_MUTED

    # SLIDE 14: Conclusion & Viva Voce
    s14 = prs.slides.add_slide(blank_layout)
    add_bg(s14)
    add_card(s14, Inches(1.0), Inches(0.8), Inches(11.333), Inches(5.9), bg_color=RGBColor(13, 18, 30), border_color=GREEN)
    
    tb14 = s14.shapes.add_textbox(Inches(1.5), Inches(1.2), Inches(10.333), Inches(4.8))
    tf14 = tb14.text_frame
    tf14.word_wrap = True
    
    p = tf14.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "PROJECT DEFENSE CONCLUSION"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = GREEN
    
    p = tf14.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = "Thank You!"
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = CYAN
    
    p = tf14.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = "PriceSpy: Leveling the E-Commerce Playing Field with Predictive Machine Learning"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN
    
    p = tf14.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = (
        "\n✅ 89.92% Verified Model Accuracy (84.1% MAE Reduction)  •  "
        "✅ 4-Store Simultaneous Arbitrage  •  "
        "✅ 24/7 Autonomous Watchdog"
    )
    p.font.size = Pt(13)
    p.font.color.rgb = GREEN
    
    p = tf14.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = (
        "\nAnticipated Viva Defense Questions Prepared:\n"
        "1. Why Prophet over ARIMA/LSTM? (Prophet explicitly models festival calendar shocks without overfitting)\n"
        "2. How do you handle anti-scraping? (Rotating User-Agents, session exponential backoffs, 3-tier fallback)\n"
        "3. How is negative price prevented? (Proportional boundary floor clipping at 40% of baseline price)"
    )
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    p = tf14.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = "\nWe invite questions, feedback, and are prepared for the live demonstration."
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = CYAN

    out_file = "PriceSpy_Final_Project_Presentation.pptx"
    prs.save(out_file)
    print(f"Successfully generated PowerPoint presentation: {out_file} ({len(prs.slides)} slides)")

if __name__ == "__main__":
    create_presentation()
