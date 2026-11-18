# PriceSpy Pro 🔮 — AI-Powered Multi-Store E-Commerce Price Prediction & Intelligence Engine

[![Live Application](https://img.shields.io/badge/Live%20Demo-PriceSpy%20Pro-rose?style=for-the-badge&logo=render)](https://pricespy-frontend.onrender.com)
[![API Documentation](https://img.shields.io/badge/Interactive%20API-Swagger%20UI-emerald?style=for-the-badge&logo=fastapi)](https://pricespy-backend.onrender.com/docs)
[![GitHub Repository](https://img.shields.io/badge/GitHub-satwik--chaurasiya%2FMINI--PROJECT-blue?style=for-the-badge&logo=github)](https://github.com/satwik-chaurasiya/MINI-PROJECT)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](LICENSE)

---

## 🌐 Live Program URLs (Use It Online Now!)

You can test and use the complete application live online without installing anything on your computer:

* 🚀 **Live Web Application (Frontend UI):**  
  👉 **[https://pricespy-frontend.onrender.com](https://pricespy-frontend.onrender.com)**  
  *(Note: Unauthenticated visitors land directly on the secure Login/Registration Gateway. Create an account or sign in to access the full platform!)*

* 🔒 **Secure Backend Architecture:**  
  Protected behind HTTPS with strict JWT bearer authentication, rate limiting, and zero public API exposure.

* 📦 **GitHub Source Repository:**  
  👉 **[https://github.com/satwik-chaurasiya/MINI-PROJECT](https://github.com/satwik-chaurasiya/MINI-PROJECT)**

---

## 📖 Executive Summary: What is PriceSpy Pro?

Online retail prices fluctuate dozens of times every week across platforms like **Amazon, Flipkart, Walmart, and eBay**. Retailers use sophisticated dynamic pricing algorithms to hike prices during high demand and slash prices unpredictably during flash sales.

Shoppers frequently overpay because they lack foresight into whether a product's price is at a temporary peak or about to plunge during an upcoming sale.

**PriceSpy Pro 🔮** levels the playing field. It is an autonomous predictive intelligence system that:
1. **Aggregates real-time price quotes** across major multi-platform e-commerce marketplaces into a unified matrix.
2. **Predicts future prices (7, 15, and 30 days ahead)** using Bayesian time-series machine learning (**Facebook Prophet**).
3. **Identifies optimal purchasing windows** with clear AI verdicts (`BUY NOW` vs. `WAIT`).
4. **Protects user data with strict authentication gating** (mandatory login, registration with basic details, and dual 6-digit cryptographic hashed OTP verification for Email & Phone).
5. **Monitors price drops 24/7** and alerts users the instant an item hits their target budget.

---

## 🌟 Core Project Framework: Overview & Key Pillars

> [!IMPORTANT]
> The following four sections provide a comprehensive breakdown of the project's strategic vertical, architectural logic, operational mechanics, and foundational assumptions.

### 1. 🎯 Your Chosen Vertical
* **Primary Industry & Vertical:** **E-Commerce Price Intelligence & Predictive Consumer FinTech (Retail Analytics)**.
* **Domain Sub-Segment:** Multi-store consumer electronics pricing, dynamic pricing volatility modeling, and optimal purchase timing optimization.
* **Target Audience:** Modern digital shoppers, consumer electronics buyers, bargain hunters, and retail market researchers who frequently purchase across platforms like **Amazon, Flipkart, Walmart, and eBay**.
* **Problem Addressed:** E-commerce marketplaces deploy dynamic, automated surge-pricing algorithms that adjust product prices dozens of times per week depending on user demand, inventory levels, competitor reactions, and festive events. Uninformed consumers frequently suffer from severe buyer's remorse when an item drops in price days after buying, or miss brief flash discount windows due to the impracticality of tracking prices across multiple competing stores manually.

---

### 2. 🧩 Approach and Logic
PriceSpy Pro approaches consumer price tracking as an **autonomous, end-to-end predictive decision-support system** rather than a passive web scraper:

1. **Decoupled Layered Micro-Monolith Architecture:**
   * **Presentation Layer (React 19 SPA):** Fast, reactive, responsive interface featuring real-time financial trajectory charts (Recharts), dark/light/retro themes, and security status terminals.
   * **Application & Security Layer (FastAPI 3.11):** High-performance asynchronous REST API handling JWT token issuance, sliding-window rate limiting, input sanitization, and automated background jobs.
   * **Persistence & RLS ORM (SQLAlchemy 2.0):** Relational schema supporting SQLite (WAL Mode) locally and PostgreSQL on the cloud, strictly enforcing **Row-Level Security (RLS)** to keep user watchlists completely isolated.
   * **Machine Learning Engine (Facebook Prophet):** Bayesian time-series regression treating price history as an additive decomposition model of organic depreciation trends, periodic seasonality, and festive sale shocks.

2. **Security-First & Zero-Trust Gating Logic:**
   * **Gated Landing Page:** Unauthenticated visitors cannot browse or probe product intelligence, search interfaces, or personal dashboards without authenticating.
   * **Cryptographic Salted OTP Hashing:** 6-digit numeric OTPs for Email and Phone SMS are **never stored in plaintext**. The system applies a SHA-256 hash combined with an application-level secret salt.
   * **Strict 5-Minute Time-To-Live (TTL = 300s):** Enforced both on the client (live countdown timer) and the server (immediate database hash purging upon expiration).
   * **Zero Automated Bypass:** Authentication and password recovery require the user to manually enter the 6-digit OTPs, eliminating automated exploitation or fake accounts.

3. **Multi-Store Ingestion & Normalization Logic:**
   * Uses rotated browser headers (`User-Agent`) to scrape prices across Amazon (canonical ASIN match), Flipkart, Walmart, and eBay.
   * Implements intelligent accessory keyword filters to eliminate false-positive matches (e.g., distinguishing between a phone case and the actual phone).
   * Automatically converts international quotes (USD) into standard local base currency (INR ₹) for direct comparison.

4. **Predictive Bayesian Forecasting Logic:**
   * Fits 180-day historical time-series data using Facebook Prophet:
     $$y(t) = g(t) + s(t) + h(t) + \epsilon_t$$
   * Incorporates specialized calendar regressors $h(t)$ for major e-commerce sales (Diwali / Big Billion Days, Prime Day, Great Indian Festival, Black Friday).
   * Generates probabilistic 80% and 95% Bayesian credible intervals ($\epsilon_t$) rather than naive single-point predictions.
   * Computes an automated verdict (`BUY NOW` vs. `WAIT`): if current price is within 5% of the projected 15-day low, it flags `BUY NOW`; if a $\ge 10\%$ drop is projected due to an upcoming sale, it flags `WAIT` with an exact target calendar date.

---

### 3. ⚙️ How the Solution Works
Here is the step-by-step workflow of how PriceSpy Pro executes end-to-end:

```
[ User Browser ]
       │
       ▼ (1. Access Gated App)
[ Landing Authentication Gateway ] ────► User enters Full Name, Email, Country, State, Phone & Password
       │
       ▼ (2. Dual OTP Generation)
[ Cryptographic Security Dispatch ] ──► Dual 6-digit OTPs (Email + Phone) hashed with SHA-256 + Salt
       │                                 (Strict 5-minute live visual countdown timer)
       ▼ (3. Manual Digit Verification)
[ JWT Bearer Authentication Issued ] ──► Unlocks full platform: Forecaster, Compare Matrix, Watchlist
       │
       ├──► [ 4. Search & Compare Matrix ] ──► Aggregates live listings across Amazon, Flipkart, Walmart & eBay
       │
       ├──► [ 5. Bayesian ML Forecaster ] ──► Runs Prophet model to predict 7, 15, and 30-day prices with credible bands
       │                                       and outputs AI Verdict (BUY NOW / WAIT)
       │
       └──► [ 6. Watchlist & 24/7 Alerts ] ──► User sets budget threshold; background asyncio worker continuously monitors
                                               live prices and triggers notifications when prices drop
```

1. **Gated Landing & Registration:** New visitors land on the authentication screen. Registration captures basic user details (Name, Email, Country, State, Phone Number, Password, and Confirmation).
2. **Dual Hashed OTP Verification:** The backend generates two 6-digit numeric codes (one for email, one for phone), salted and hashed in the database with a 5-minute expiration timer. The user manually inputs the codes to activate their account and receive an encrypted JWT token.
3. **Multi-Store Price Aggregation:** The user queries a product. The backend checks in-memory cache or queries the multi-store scraper to retrieve live prices across Amazon, Flipkart, Walmart, and eBay.
4. **Bayesian ML Inference:** The system passes historical pricing data and festival calendars to Facebook Prophet, outputting future price trajectories, statistical upper/lower bounds, expected savings, and an AI verdict (`BUY NOW` or `WAIT`).
5. **Watchlist & Autonomous Alerting:** The user saves items to their watchlist with a target price. An asynchronous background scheduler periodically checks market prices. If an item hits the target budget or projected low, the alert status switches to `TRIGGERED` and dispatches notification telemetry.
6. **Self-Service Password Recovery:** If a password is forgotten, a 6-digit OTP is generated and hashed with a 5-minute validity window. Upon verification, the user sets a new bcrypt-hashed password without relying on arbitrary links.

---

### 4. 📌 Any Assumptions Made
To deliver reliable real-time intelligence within a cloud-hosted free tier, the system is built upon the following technical and operational assumptions:

1. **Market & Pricing Assumptions:**
   * **Cyclic Seasonality & Festival Predictability:** Retail pricing is assumed to follow historical seasonal patterns, weekly markdown cadences, and recurring annual shopping events (e.g., Diwali sales in October, Prime Day in July, Black Friday in November).
   * **Public HTML Accessibility:** Retail listings are assumed to be accessible via standard HTTP requests with randomized user-agent headers without strict Cloudflare/bot challenges.
   * **Currency Parity Baseline:** International prices (USD on Walmart and eBay) are converted into INR (₹) using a baseline parity exchange rate ($1 \text{ USD} \approx 85 \text{ INR}$) to allow uniform cross-platform comparisons.

2. **User & Identity Assumptions:**
   * **Unique User Identity:** Every account is uniquely identified by a single email address; email uniqueness is enforced at the database schema level.
   * **Manual Multi-Factor Verification:** Users are assumed to have active access to their communication channel to inspect their 6-digit OTP and manually input it within the 5-minute countdown window.
   * **Responsible Alert Thresholds:** Target price thresholds set by users are assumed to be realistic numerical values within reachable market boundaries.

3. **Infrastructure & Hosting Assumptions:**
   * **Micro-Container Resource Bounds:** The application is engineered to operate smoothly within free-tier container limits (e.g., Render 512 MB RAM limit) by utilizing efficient in-memory caching and lightweight Prophet model evaluation.
   * **Asynchronous Execution:** Scraper runs and price alert trigger evaluations execute as non-blocking background tasks (`asyncio.create_task`), ensuring zero latency impact on the user interface.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            User Web Browser                                 │
│  ├── Gated Entry Screen: Login / Registration / Hashed Dual OTP Gateway     │
│  ├── Flagship Interactive Price Forecaster (Recharts Financial Graphs)      │
│  ├── Cross-Platform Matrix (Amazon vs. Flipkart vs. Walmart vs. eBay)       │
│  └── Personal Watchlist & Real-Time Telemetry Dashboard                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / JSON REST API
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FastAPI Application Layer (Python 3.11)                 │
│  ├── In-Memory Rate Limiting Engine (DoS & Brute-Force Shield)              │
│  ├── Cryptographic OTP Dispatcher (Salted SHA-256 Hashed 6-Digit Codes)     │
│  ├── JWT Bearer Authentication & Row-Level Security (RLS) Isolation         │
│  └── Multi-Tier Caching Layer (In-Memory + Optional Redis Fallback)         │
└───────────────────────┬─────────────────────────────┬───────────────────────┘
                        │                             │
                        ▼                             ▼
┌────────────────────────────────────────┐ ┌──────────────────────────────────┐
│         SQLAlchemy ORM Layer           │ │    Bayesian ML Engine (Prophet)  │
│  ├── users (Hashed Passwords & OTPs)   │ │  ├── 7, 15, 30-Day Regressions   │
│  ├── products & platform_listings      │ │  ├── E-Commerce Festival Models  │
│  ├── alerts (Isolated User Watchlists) │ │  └── Upper/Lower Credible Bounds │
│  └── analytics_events & error_logs     │ └──────────────────────────────────┘
└────────────────────────────────────────┘
```

---

## 🔐 Comprehensive Program Walkthrough: How It Works

You don't need to read a single line of code to understand how PriceSpy Pro functions. Here is the complete end-to-end user experience:

### 1. Mandatory Gated Landing Page (Security by Default)
* When any visitor opens the application, they are immediately greeted by the **Authentication Gateway**.
* The application is completely protected: **nobody can view product intelligence, comparison matrices, or personal watchlists without logging in**.
* The top navigation bar displays a live indicator: `Protected App • Sign In Required`.

### 2. Comprehensive User Registration
To create an account, the user provides their basic profile information:
* **Full Name** (e.g., Satwik Chaurasiya)
* **Email Address** (must be a valid email format)
* **Country** (e.g., India, USA, UK, etc.)
* **State / Province** (e.g., Maharashtra, California, etc.)
* **Phone Number** (e.g., +91 98765 43210)
* **Password** (minimum 8 characters)
* **Password Confirmation** (verified with real-time match feedback)

### 3. Cryptographic Dual 6-Digit Hashed OTP Verification
* Upon clicking **"Register"**, the backend generates two independent 6-digit numeric security codes:
  * 📧 **Email Verification OTP** (e.g., `492815`)
  * 📱 **Phone SMS Verification OTP** (e.g., `837192`)
* **How Security is Handled:**
  * In the database, the raw OTP is **never stored in plaintext**. It is hashed using **SHA-256 with a secret cryptographic salt**.
  * Both OTPs have a strict **5-minute expiration countdown window** with live visual timer feedback. If the timer runs out, the OTP is invalidated in the database and the user must click **Re-request OTP** to generate fresh codes.
  * The codes are securely presented in a dedicated **Security Dispatch Terminal** on screen (and dispatched via email if an SMTP server is connected).
  * **No Automatic Verification Bypass:** The user **must manually type** the 6 digits for the Email OTP and the 6 digits for the Phone OTP into the form.
  * Once submitted, the backend verifies the hashes in constant time. Upon successful verification, the account is activated, an encrypted JWT token is issued, and the entire platform unlocks!

### 4. Password Recovery with 6-Digit Email OTP
* If a user forgets their password, they click **"Forgot password?"** on the Sign In screen.
* They enter their registered email address.
* The system generates a fresh **6-digit numeric OTP**, hashes it in the database with a **5-minute timer**, and provides the OTP to the user.
* If the 5-minute timer runs out, the OTP expires and is automatically invalidated; the user can easily re-request a new code with one click.
* The user types the **6-digit Reset OTP**, enters their **new password**, and confirms it.
* The backend verifies the OTP hash and securely re-hashes the new password using **salted bcrypt**.

---

### 5. Flagship Bayesian AI Price Forecaster
Once inside, the user can explore any major e-commerce product (e.g., iPhone 15 Pro, MacBook Pro M3, Sony WH-1000XM5, Samsung S24 Ultra).

* **Historical Volatility Curve:** Displays up to 180 days of daily scraped market prices.
* **Forward Price Trajectory (7, 15, and 30 Days):** Predicts future price trends using Facebook Prophet Bayesian time-series regression.
* **Confidence Interval Bands:** Displays the statistical **upper and lower bounds** ($80\%$ and $95\%$ credible intervals), showing the best-case and worst-case price scenarios.
* **AI Recommendation Verdict:**
  * 🟢 `BUY NOW`: Current price is near an all-time low, with an anticipated price hike ahead.
  * 🔴 `WAIT`: A price drop of $10\%\text{--}25\%$ is projected within the next 15 days due to an upcoming retail sale or historical seasonality.
* **Optimal Purchase Window:** Specifies the exact predicted calendar date when the price will reach its lowest point.

---

### 6. Cross-Platform Comparison Matrix
* Shoppers can instantly compare pricing across **Amazon**, **Flipkart**, **Walmart**, and **eBay**.
* For each platform, PriceSpy Pro displays:
  * Platform brand badge with official color coding.
  * Current live scraped price.
  * Direct verified deep-link button (`View on Store`) that takes the shopper directly to the official product page.
  * Platform savings delta compared to the highest-priced competitor.

---

### 7. Personal Watchlist & Automated Price Drop Alerts
* Users can add any product to their personal watchlist and specify a **Target Price** (e.g., *"Notify me if the iPhone 15 Pro drops below ₹1,20,000"*).
* **Row-Level Security (RLS):** Every alert is isolated to the authenticated user's account ID (`user_id`). Users cannot see or tamper with other users' watchlists.
* **Background Trigger Engine:** The system compares current and 15-day predicted lowest prices against the target threshold. When the target is met, an automated alert status changes to `TRIGGERED` and dispatches notification telemetry.

---

### 8. Admin Telemetry & Disaster Recovery Console
Accessible to platform administrators at `/admin`:
* **System Telemetry:** Real-time RAM, CPU, active session count, and cache hit ratio.
* **Scraper Health Monitors:** Live status checks for Amazon ASIN matchers, Flipkart listing parsers, and global currency converters.
* **Automated Database Snapshots:** Administrators can create instantaneous JSON backups of all users, products, listings, and alerts.
* **Point-in-Time Restore:** Restore the entire database state from any historical JSON snapshot with one click.
* **Audit Error Logging:** Records client-side error boundaries and server exceptions with full stack traces.

---

## 🧠 How the Machine Learning Engine Works

PriceSpy Pro uses **Facebook Prophet**, an open-source procedure developed by Meta's Core Data Science team for forecasting time-series data based on an additive model where non-linear trends fit with yearly, weekly, and daily seasonality:

$$y(t) = g(t) + s(t) + h(t) + \epsilon_t$$

Where:
* **$g(t)$ (Trend):** Piecewise linear trend modeling the organic depreciation curve of consumer electronics over their product lifecycles.
* **$s(t)$ (Seasonality):** Periodic patterns reflecting consumer shopping habits (e.g., weekend price hikes vs. mid-week discounts, month-end clearance cycles).
* **$h(t)$ (Retail Holiday Regressors):** Custom holiday impact windows calibrated for major retail sale events:
  * 🇮🇳 **Great Republic Sale / Republic Day:** Late January
  * ☀️ **Summer Appliance & Freedom Days:** Early May
  * 📦 **Prime Day & Big Saving Days:** Mid July
  * 🪔 **The Big Billion Days & Great Indian Festival:** October (Diwali peak season with multi-day discount windows $[-2, +8]$)
  * 🛍️ **Black Friday & Cyber Monday:** Late November
  * 🎆 **Year-End Clearance:** Late December
* **$\epsilon_t$ (Uncertainty Interval):** Simulates future trajectory distributions using Markov Chain Monte Carlo (MCMC) methods to generate rigorous upper and lower price bounds.

---

## 🛠️ Complete Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend UI** | **React 19**, Tailwind CSS v3, Recharts, Lucide Icons, React Router DOM v7, Axios |
| **Backend API** | **FastAPI (Python 3.11)**, Starlette, Uvicorn (ASGI), Pydantic v2 |
| **Database & ORM** | **SQLAlchemy 2.0**, SQLite (WAL Mode) / PostgreSQL support via `DATABASE_URL` |
| **Machine Learning** | **Facebook Prophet**, Pandas, NumPy, Scikit-Learn |
| **Security & Auth** | **Bcrypt** password hashing, **Salted SHA-256** OTP hashing, **JWT (JSON Web Tokens)** |
| **Protection** | In-memory sliding-window Rate Limiting middleware, CORS isolation, XSS protection |
| **Infrastructure** | **Render** Blueprint (`render.yaml`), Docker & Docker Compose |

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new account with profile & generate 6-digit OTPs | ❌ No |
| `POST` | `/api/auth/verify-otp` | Manually submit 6-digit Email OTP & Phone OTP | ❌ No |
| `POST` | `/api/auth/resend-otp` | Generate fresh 6-digit verification codes | ❌ No |
| `POST` | `/api/auth/login` | Authenticate user & issue signed JWT bearer token | ❌ No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & verification state | ✅ Yes |
| `POST` | `/api/auth/forgot-password-otp` | Generate 6-digit Password Reset OTP | ❌ No |
| `POST` | `/api/auth/reset-password-otp` | Submit 6-digit OTP & update password | ❌ No |
| `GET` | `/api/products` | Retrieve multi-store catalog with live prices & filters | ❌ No |
| `GET` | `/api/products/{id}` | Get detailed product specifications & store listings | ❌ No |
| `GET` | `/api/predict/{id}` | Run Prophet Bayesian regression & generate forecast payload | ❌ No |
| `GET` | `/api/alerts` | Get watchlist alerts for authenticated user | ✅ Yes |
| `POST` | `/api/alerts` | Create new target budget alert | ✅ Yes |
| `DELETE` | `/api/alerts/{id}` | Remove alert (enforces Row-Level Security) | ✅ Yes |
| `GET` | `/api/admin/metrics` | Retrieve hardware telemetry, scraper state, error logs | ❌ No |
| `POST` | `/api/admin/backups/create`| Generate point-in-time JSON database snapshot | ❌ No |
| `POST` | `/api/contact` | Submit user inquiry with automated tracking ticket | ❌ No |

---

## 💻 Local Development Quickstart

### Prerequisites
* **Python 3.10+** (Python 3.11 recommended)
* **Node.js 18+** & `npm`
* *(Optional)* **Docker Desktop**

### 1. Run the Backend API
```bash
# Navigate to backend directory
cd price-prediction-system/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt -r ../ml_engine/requirements.txt

# Start FastAPI server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
* Interactive API Documentation will be available at: `http://127.0.0.1:8000/docs`

### 2. Run the Frontend UI
```bash
# In a new terminal, navigate to frontend
cd price-prediction-system/frontend

# Install dependencies
npm install

# Start React development server
npm start
```
* Web application will open at: `http://localhost:3000`

### 3. Run with Docker Compose (One Command)
```bash
# From the root directory:
docker compose up --build
```

---

## 🧪 Automated Test Suite

```bash
# Run backend 19-feature integration test suite (including auth, OTP, Prophet ML, and rate limiting)
python price-prediction-system/backend/test_19_features.py

# Run frontend test suite
cd price-prediction-system/frontend
npm test -- --watchAll=false
```

---

## 📄 License
This project is released under the **[MIT License](LICENSE)**. Open source and built for intelligent e-commerce consumer analytics.
