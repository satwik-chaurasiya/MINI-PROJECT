# PriceSpy Pro 🔮 — AI-Powered Multi-Store E-Commerce Price Prediction & Intelligence Engine

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-green.svg)](https://www.python.org/)
[![React: 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![FastAPI: 0.141](https://img.shields.io/badge/FastAPI-0.141-teal.svg)](https://fastapi.tiangolo.com/)

**PriceSpy Pro** is an autonomous predictive e-commerce intelligence system that forecasts optimal purchasing windows across major retail marketplaces (**Amazon, Flipkart, Walmart, and eBay**) using Bayesian time-series machine learning (**Facebook Prophet**).

---

## 🌟 Core Features

- 🔮 **Bayesian AI Price Forecasting:** Generates 7, 15, and 30-day forward price trajectories with upper/lower confidence bounds, seasonality modeling, and e-commerce holiday impact regressors (Diwali, Big Billion Days, Prime Day, Black Friday, Cyber Monday).
- 🏷️ **Cross-Platform Matrix:** Live price comparison and direct deep-linking across Amazon, Flipkart, Walmart, and eBay.
- 🔔 **Smart Watchlist & Price Drop Alerts:** Set custom target prices with automated background threshold triggers and mock notification dispatching.
- 🛡️ **Hardened Production Security:** JWT bearer authentication, bcrypt salted password hashing, user onboarding state tracking, and tokenized password recovery.
- ⚡ **Resilient In-Memory & Redis Caching:** Multi-tier caching with automatic fallback to in-memory store if Redis is absent.
- 📊 **Telemetry & Admin Dashboard:** Real-time system telemetry, active scraper health monitors, automated database backups, and point-in-time restore tools.
- 📱 **Modern Responsive UI:** Built on React 19, Tailwind CSS, Recharts for interactive financial charts, and Lucide React iconography.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   User Browser                         │
└───────────────┬────────────────────────▲───────────────┘
                │                        │
       HTTPS / REST API            React 19 SPA
                │             (Tailwind CSS + Recharts)
                ▼                        │
┌────────────────────────────────────────────────────────┐
│             FastAPI Backend (Port 8000)                │
│  ├── In-Memory Rate Limiter Middleware                │
│  ├── JWT Authentication & Access Control              │
│  ├── REST Endpoints (/api/products, /api/alerts, etc) │
│  └── Telemetry & Database Management Engine           │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
        SQLAlchemy ORM             Bayesian Forecasting
                │                        │
                ▼                        ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│   SQLite Database (WAL)   │ │  Facebook Prophet Engine │
│   (Users, Alerts, Events) │ │ (Confidence Bounds, Holiday Regressors)
└───────────────────────────┘ └──────────────────────────┘
```

---

## 🌐 Free Cloud Deployment Guide

### Recommended Platform: Render (100% Free Full-Stack)

**Render** is the single best free hosting provider for this stack because:
1. It hosts persistent **Python ASGI Web Services (FastAPI + Prophet ML)** on its free tier without the bundle-size limits that block Prophet on Vercel/Netlify.
2. It hosts **Static Sites (React 19 SPA)** with free global CDN, automated SSL certificates, and SPA routing.
3. The included **`render.yaml` Blueprint** provisions both services together in a single step with zero manual linking.

#### Option A: One-Click Render Blueprint (Fastest)

1. **Fork or push** this repository to your GitHub account (`https://github.com/satwik-chaurasiya/MINI-PROJECT`).
2. Log in to the [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** in the top navigation bar and select **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect `render.yaml` and configure:
   - **`pricespy-backend`** (Python Web Service): Runs FastAPI with Uvicorn.
   - **`pricespy-frontend`** (Static Site): Builds and serves the React SPA, with `REACT_APP_API_URL` dynamically linked to the backend service!
6. Click **Apply**. Both services will build and deploy live online completely for free!

---

#### Option B: Split Architecture (Render Backend + Vercel Frontend)

If you prefer deploying the frontend on **Vercel**:

1. **Deploy Backend on Render**:
   - In Render, click **New +** -> **Web Service**.
   - Root Directory: `price-prediction-system`
   - Build Command: `pip install --upgrade pip && pip install -r backend/requirements.txt -r ml_engine/requirements.txt`
   - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - Add Environment Variable: `SECRET_KEY` = *(a random 64-character hex string)*
   - Note your live backend URL (e.g., `https://pricespy-backend.onrender.com`).

2. **Deploy Frontend on Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Import your repository.
   - Set **Root Directory** to `price-prediction-system/frontend` (or leave at root; `vercel.json` is configured).
   - Under **Environment Variables**, add:
     - `REACT_APP_API_URL`: Your live Render backend URL (e.g. `https://pricespy-backend.onrender.com`)
   - Click **Deploy**.

---

## 🔑 Environment Variables Reference

Paste the following variables into your hosting platform dashboard:

| Variable Name | Required | Default / Fallback | Purpose & Example Value |
| :--- | :---: | :--- | :--- |
| **`SECRET_KEY`** | **Yes** (Prod) | `supersecretkey_pricespy_ai` | Used for cryptographically signing JWT authentication tokens. Generate with `python -c "import secrets; print(secrets.token_hex(32))"` |
| **`REACT_APP_API_URL`** | **Yes** (Frontend) | `http://127.0.0.1:8000` | Full public URL of your deployed backend (e.g. `https://pricespy-backend.onrender.com`). No trailing slash. |
| **`PYTHON_VERSION`** | Optional | `3.10.12` | Python runtime version for cloud builders (compatible with Prophet). |
| **`DATABASE_URL`** | Optional | `sqlite:///./pricespy.db` | Database connection string. Provide `postgresql://...` if connecting to a cloud PostgreSQL instance. |
| **`REDIS_HOST`** | Optional | `localhost` | Redis cache hostname (app falls back to memory cache if absent). |
| **`REDIS_PORT`** | Optional | `6379` | Redis port number. |
| **`GENERATE_SOURCEMAP`** | Optional | `false` | Set to `false` in frontend to optimize bundle size and protect source code. |

---

## 💻 Local Development Quickstart

### Prerequisites
- **Python 3.10+** (Tested on Python 3.10, 3.11, and 3.14)
- **Node.js 18+** & `npm`
- (Optional) **Docker Desktop**

### 1. Backend Setup
```bash
# Navigate to backend directory
cd price-prediction-system/backend

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt -r ../ml_engine/requirements.txt

# Start FastAPI development server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
- Interactive Swagger API docs: `http://127.0.0.1:8000/docs`
- Alternative ReDoc docs: `http://127.0.0.1:8000/redoc`

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend
cd price-prediction-system/frontend

# Install dependencies
npm install

# Start React development server
npm start
```
- App UI available at: `http://localhost:3000`

### 3. All-in-One Docker Compose
```bash
# Build and run the entire multi-container stack (Backend, Frontend, Redis)
docker compose up --build
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status and root greeting |
| `GET` | `/api/products` | Retrieve catalog with filters and platform comparison |
| `GET` | `/api/products/{id}` | Single product details with live price breakdown |
| `GET` | `/api/predict/{id}` | Generate Bayesian time-series price forecast |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT access token |
| `GET` | `/api/alerts` | Get watchlist alerts for authenticated user |
| `POST` | `/api/alerts` | Create new price threshold alert |
| `DELETE` | `/api/alerts/{id}` | Delete a price alert |
| `GET` | `/api/admin/metrics` | Retrieve hardware telemetry, scraper state, error logs |
| `POST` | `/api/contact` | Submit contact/support inquiry |
| `GET` | `/sitemap.xml` | Dynamic SEO sitemap indexing catalog and pages |

---

## 🧪 Testing

```bash
# Run backend 19-feature integration test suite
cd price-prediction-system/backend
python test_19_features.py

# Run frontend component tests
cd price-prediction-system/frontend
npm test -- --watchAll=false
```

---

## 📄 License
Released under the [MIT License](LICENSE).
