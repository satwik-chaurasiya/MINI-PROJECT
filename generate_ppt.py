from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# 1. Initialize presentation & set 16:9 widescreen dimensions
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Color Palette (Matching the PriceSpy Design System)
BG_COLOR = RGBColor(13, 17, 23)        # #0D1117 Main Dark
CARD_COLOR = RGBColor(22, 27, 34)      # #161B22 Card Dark
ACCENT_BLUE = RGBColor(41, 121, 255)   # #2979FF Electric Blue
ACCENT_GREEN = RGBColor(0, 200, 83)    # #00C853 Drop Green
TEXT_WHITE = RGBColor(240, 246, 252)   # Light Primary
TEXT_MUTED = RGBColor(139, 148, 158)   # #8B949E Slate Gray

def apply_background(slide):
    """Draws a full-bleed dark rectangle background."""
    rect = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    rect.fill.solid()
    rect.fill.fore_color.rgb = BG_COLOR
    rect.line.fill.background()
    return rect

def add_header(slide, title_text, category="PRICESPY • AI PREDICTIVE FRAMEWORK"):
    """Adds a standard structured header to content slides."""
    header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(1.1))
    tf = header_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

    # Category Tag
    p_tag = tf.paragraphs[0]
    p_tag.text = category.upper()
    p_tag.font.size = Pt(11)
    p_tag.font.bold = True
    p_tag.font.color.rgb = ACCENT_BLUE

    # Slide Title
    p_title = tf.add_paragraph()
    p_title.text = title_text
    p_title.font.size = Pt(22)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE

def create_card(slide, left, top, width, height, title, items, border_color=None):
    """Draws a themed card with title and itemized bullet points."""
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = CARD_COLOR
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)
    else:
        shape.line.fill.background()

    tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), height - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

    # Card Title
    p_title = tf.paragraphs[0]
    p_title.text = title
    p_title.font.size = Pt(15)
    p_title.font.bold = True
    p_title.font.color.rgb = ACCENT_BLUE

    # Items
    for bold_prefix, text in items:
        p = tf.add_paragraph()
        p.space_before = Pt(8)
        p.font.size = Pt(11.5)
        
        r_bold = p.add_run()
        r_bold.text = f"• {bold_prefix}: " if bold_prefix else "• "
        r_bold.font.bold = True
        r_bold.font.color.rgb = TEXT_WHITE
        
        r_text = p.add_run()
        r_text.text = text
        r_text.font.color.rgb = TEXT_MUTED

# ==========================================
# SLIDE 1: Title Slide
# ==========================================
slide1 = prs.slides.add_slide(prs.slide_layouts[6])
apply_background(slide1)

tb1 = slide1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.3), Inches(4.5))
tf1 = tb1.text_frame
tf1.word_wrap = True

p_sub = tf1.paragraphs[0]
p_sub.text = "ACADEMIC CAPSTONE PROJECT • AUGUST 2026"
p_sub.font.size = Pt(13)
p_sub.font.bold = True
p_sub.font.color.rgb = ACCENT_BLUE

p_main = tf1.add_paragraph()
p_main.text = "Predictive Analytics Framework for Forecasting Minimum Product Prices in E-Commerce"
p_main.font.size = Pt(28)
p_main.font.bold = True
p_main.font.color.rgb = TEXT_WHITE
p_main.space_before = Pt(12)

p_platform = tf1.add_paragraph()
p_platform.text = "Platform: PriceSpy – Intelligent Lowest Price Prediction & Automated Purchase Advisor"
p_platform.font.size = Pt(15)
p_platform.font.color.rgb = ACCENT_GREEN
p_platform.space_before = Pt(8)

p_meta = tf1.add_paragraph()
p_meta.text = "B.Tech – Artificial Intelligence (2nd Year)  |  Greater Noida Institute of Technology (GNIOT), AKTU\nPresenters: Team AI  |  Faculty Guide: Department of Computer Science & Engineering"
p_meta.font.size = Pt(12)
p_meta.font.color.rgb = TEXT_MUTED
p_meta.space_before = Pt(24)

# ==========================================
# SLIDE 2: Problem Statement & Motivation
# ==========================================
slide2 = prs.slides.add_slide(prs.slide_layouts[6])
apply_background(slide2)
add_header(slide2, "The Core Problem — Why Existing Tools Fall Short")

create_card(slide2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Retail Volatility & Consumer Loss", [
    ("Dynamic Pricing Algorithms", "Retailers update listings multiple times daily based on real-time demand, competitor behavior, and stock levels."),
    ("The Post-Purchase Regret Gap", "Shoppers frequently complete purchases days before major predictable discount cycles, losing 10% to 20% in savings."),
    ("Decision Fatigue", "Buyers spend hours manually tracking price histories across multiple platforms without clear buying clarity.")
])

create_card(slide2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Limitations of Existing Trackers", [
    ("Strictly Reactive Tools", "Platforms like Keepa and CamelCamelCamel document historical prices, forcing users to manually interpret dense graphs."),
    ("Zero Forward Visibility", "No automated statistical forecast of whether prices will decline within 7, 15, or 30 days."),
    ("Project Objective", "Shift retail price tracking from backward-looking charts to proactive, forward-looking minimum price forecasts.")
])

# ==========================================
# SLIDE 3: Competitive Analysis & Innovation
# ==========================================
slide3 = prs.slides.add_slide(prs.slide_layouts[6])
apply_background(slide3)
add_header(slide3, "Competitive Analysis — What We Do Differently")

create_card(slide3, Inches(0.8), Inches(1.8), Inches(3.7), Inches(4.8), "Standard Commercial Tools", [
    ("Approach", "Passive and reactive price charting."),
    ("Modeling", "No predictive machine learning applied."),
    ("User Action", "Forces users to analyze raw historical lines."),
    ("Limitation", "Zero warning of upcoming promotional price drops.")
])

create_card(slide3, Inches(4.8), Inches(1.8), Inches(3.7), Inches(4.8), "Typical Student Projects", [
    ("Approach", "Simple cross-sectional web scrapers."),
    ("Modeling", "Naive linear regression with high error rates."),
    ("Dataset", "Static single-store scrapes without lag analysis."),
    ("Limitation", "Fails to capture abrupt seasonal markdown shocks.")
])

create_card(slide3, Inches(8.8), Inches(1.8), Inches(3.7), Inches(4.8), "Our Solution (PriceSpy)", [
    ("Multi-Horizon Forecasting", "Outputs 7-day, 15-day, and 30-day predicted price points."),
    ("Hybrid ML Modeling", "Combines Prophet seasonality, XGBoost lags, and LSTM sequences."),
    ("Visual Uncertainty", "Renders shaded prediction confidence bands."),
    ("Actionable Guidance", "Explicit WAIT vs. BUY NOW recommendations."),
    ("Predictive Alerting", "Triggers alerts when future predicted lows hit targets.")
], border_color=ACCENT_BLUE)

# ==========================================
# SLIDE 4: System Architecture & Workflow
# ==========================================
slide4 = prs.slides.add_slide(prs.slide_layouts[6])
apply_background(slide4)
add_header(slide4, "System Architecture & High-Level Flow")

create_card(slide4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Data & Backend Infrastructure", [
    ("Live Scraping Engine", "Automated harvesting on Amazon and Flipkart with rotated headers and proxy evasion."),
    ("FastAPI Microservices", "High-throughput asynchronous REST API managing forecasts, alerts, and JWT authentication."),
    ("Database & Caching", "PostgreSQL database models coupled with Redis for rapid retrieval of pre-computed price points.")
])

create_card(slide4, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "ML Engine & Frontend Layer", [
    ("Batch Prediction Pipeline", "Daily automated cron scheduler pre-computes 30-day forecasting trajectories overnight."),
    ("React 18 Single-Page App", "Modern dark-themed UI built with Tailwind CSS and responsive layout grids."),
    ("Recharts Visualizer", "Continuous curves transitioning from actual records to shaded forecast confidence bands.")
])

# ==========================================
# SLIDE 5: Data Pipeline & Feature Engineering
# ==========================================
slide5 = prs.slides.add_slide(prs.slide_layouts[6])
apply_background(slide5)
add_header(slide5, "Data Preprocessing & Feature Engineering")

create_card(slide5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Data Cleaning & Transformation", [
    ("Multi-Store Ingestion", "Normalizes disparate price schemas, product identifiers, and currency formats."),
    ("Imputation & Cleansing", "Forward-filling for missing data gaps and IQR-based filtering for scraping anomalies."),
    ("Temporal Alignment", "Synchronizes irregularly sampled price updates into uniform daily time steps.")
])

create_card(slide5, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Domain-Specific Feature Signals", [
    ("Rolling Indicators", "Calculates 7-day, 14-day, and 30-day rolling averages and price volatility standard deviations."),
    ("Calendar Seasonality", "Encodes day-of-week, day-of-month, and quarterly cyclical factors."),
    ("Promotional Decay Vectors", "Explicit exponential proximity flags for major shopping festivals (e.g., Prime Day, Diwali Sales).")
])

# ==========================================
# SLIDE 6: Machine Learning Methodology
# ==========================================
slide6 = prs.slides.add_slide(prs.slide_layouts[6])
apply_background(slide6)
add_header(slide6, "Machine Learning Modeling & Ensembling")

create_card(slide6, Inches(0.8), Inches(1.8), Inches(3.7), Inches(4.8), "Facebook Prophet", [
    ("Role", "Decomposes trend and multi-period seasonality."),
    ("Strengths", "Robust to missing observation days and holidays."),
    ("Output", "Provides base additive trajectories and confidence intervals.")
])

create_card(slide6, Inches(4.8), Inches(1.8), Inches(3.7), Inches(4.8), "XGBoost Regressor", [
    ("Role", "Models non-linear price volatility and short-term lags."),
    ("Strengths", "Captures abrupt markdown thresholds and flash sales."),
    ("Output", "Residual corrections on Prophet baseline predictions.")
])

create_card(slide6, Inches(8.8), Inches(1.8), Inches(3.7), Inches(4.8), "LSTM Sequence Networks", [
    ("Role", "Captures long-term sequential temporal dependencies."),
    ("Ensemble Strategy", "Weighted averaging minimizes variance across distinct market regimes."),
    ("Confidence Scoring", "Computes certainty scores (70% - 90%) from prediction interval spreads.")
])

# ==========================================
# SLIDE 7: Experimental Results & Evaluation
# ==========================================
slide7 = prs.slides.add_slide(prs.slide_layouts[6])
apply_background(slide7)
add_header(slide7, "Experimental Results & Validation Metrics")

create_card(slide7, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Validation Methodology", [
    ("Backtesting Scheme", "Chronological rolling-window validation across unseen historical test sets."),
    ("Mean Absolute Error (MAE)", "Measures average magnitude of absolute prediction errors in currency units."),
    ("Root Mean Squared Error (RMSE)", "Penalizes large outlier forecast errors heavily."),
    ("MAPE Evaluation", "Normalized percentage metric measuring overall error across varied price categories.")
])

create_card(slide7, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Performance Benchmark", [
    ("Project Baseline Goal", "Forecast accuracy >= 82% (MAPE <= 18%)."),
    ("Prophet Baseline", "MAPE: ~3.8%  |  Accuracy: ~83.2%"),
    ("Ensemble Pipeline", "MAPE: 2.8% - 3.1%  |  Accuracy: 84.2% - 87.3%"),
    ("Practical Meaning", "On an item worth ₹10,000, model error is within ~₹300, delivering reliable consumer purchase guidance.")
], border_color=ACCENT_GREEN)

# ==========================================
# SLIDE 8: Web Application Experience
# ==========================================
slide8 = prs.slides.add_slide(prs.slide_layouts[6])
apply_background(slide8)
add_header(slide8, "Full-Stack Web Application Interface")

create_card(slide8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Core Consumer Features", [
    ("Real-Time Search", "Searches any e-commerce product with live web scraping and fallback synthesis."),
    ("Interactive Visualizer", "Continuous chart displaying historical prices and shaded future forecast bands."),
    ("Actionable Verdicts", "Color-coded badges (e.g., WAIT - drop of 10% expected in 15 days)."),
    ("Automated Alerting", "Registers target prices and sends simulated email drop notifications.")
])

create_card(slide8, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Administrative & User Dashboards", [
    ("Personalized Watchlist", "Tracks multi-product portfolios with live progress toward predicted lowest prices."),
    ("Scraper Engine Health", "Monitors live harvest statuses for Amazon, Flipkart, Walmart, and eBay."),
    ("Model Registry & Telemetry", "Real-time tracking of active model versions, MAE logs, and retrain triggers.")
])

# ==========================================
# SLIDE 9: Division of Work & Technical Ownership
# ==========================================
slide9 = prs.slides.add_slide(prs.slide_layouts[6])
apply_background(slide9)
add_header(slide9, "Division of Work — Team Contributions")

create_card(slide9, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Track 1: ML & Data Engineering", [
    ("Scraper Pipeline", "Implemented live retail scrapers and synthetic data generator."),
    ("Model Development", "Trained, tuned, and evaluated Prophet, XGBoost, and LSTM ensemble models."),
    ("Backtesting Suite", "Built model evaluation pipeline computing MAE, RMSE, and MAPE metrics."),
    ("Batch Automation", "Configured cron batch inference engine.")
])

create_card(slide9, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Track 2: Backend & UI/UX Engineering", [
    ("FastAPI Architecture", "Built RESTful endpoints, CORS middleware, and mock database models."),
    ("Authentication & Security", "Implemented user registration, login, and JWT access tokens."),
    ("Frontend UI/UX", "Engineered React 18 single-page app with Tailwind dark theme and Recharts graphs."),
    ("Alert Dispatcher", "Developed target price matching engine and alert notification services.")
])

# ==========================================
# SLIDE 10: Conclusion & Future Roadmap
# ==========================================
slide10 = prs.slides.add_slide(prs.slide_layouts[6])
apply_background(slide10)
add_header(slide10, "Conclusion & Future Roadmap")

create_card(slide10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Summary of Achievements", [
    ("End-to-End System", "Successfully transformed reactive price tracking into a proactive forecasting engine."),
    ("High Forecast Accuracy", "Achieved < 3.1% MAPE error across retail product time-series."),
    ("Seamless Full-Stack UX", "Delivered responsive web dashboards, real-time scraping, and predictive alerting.")
])

create_card(slide10, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Future Enhancements (Phase 2)", [
    ("Browser Extension", "Chrome/Edge overlay delivering instant buy/wait recommendations directly on product pages."),
    ("Cross-Retailer Arbitrage", "Real-time comparative matrices highlighting instant cross-platform savings."),
    ("Coupon Integration", "Layering bank discount offers and promo codes into predicted price baselines.")
])

# Save presentation
output_filename = "PriceSpy_Presentation.pptx"
prs.save(output_filename)
print(f"Presentation successfully created: {output_filename}")