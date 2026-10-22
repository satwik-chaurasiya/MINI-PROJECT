import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Palette, Sparkles, ArrowUpRight, Menu, X, Shield, 
  FileText, User, HelpCircle
} from 'lucide-react';
import LandingPage from './pages/LandingPage';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import ComparePage from './pages/ComparePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import OnboardingModal from './components/OnboardingModal';
import { trackPageView } from './services/analytics';
import api from './services/api';

// Route change listener to track page views (Feature 14)
function PageViewTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
  return null;
}

function Navigation({ userEmail, onLogout, toggleTheme, onOpenOnboarding }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const getNavClass = (path) => {
    const isActive = location.pathname === path;
    const baseClass = "px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ";
    return isActive 
      ? baseClass + "text-white bg-sky-500/20 border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.25)] font-semibold"
      : baseClass + "text-gray-400 hover:text-white hover:bg-white/[0.05]";
  };

  const getMobileNavClass = (path) => {
    const isActive = location.pathname === path;
    const baseClass = "w-full text-left px-4 py-3 rounded-xl text-sm font-mono flex items-center justify-between transition-colors ";
    return isActive
      ? baseClass + "text-white bg-sky-500/20 border border-sky-400/30 font-semibold"
      : baseClass + "text-gray-300 hover:text-white hover:bg-white/[0.06]";
  };

  return (
    <>
      {/* Top Status Bar */}
      <div className="w-full max-w-7xl mx-auto mb-4 px-2 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-gray-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white font-medium">Prophet ML Active:</span>
          <span className="text-emerald-400 font-semibold">Live Telemetry &bull; Zero False Matches</span>
          <span className="hidden md:inline text-neutral-600">&bull;</span>
          <span className="hidden md:inline text-gray-400">Amazon &bull; Flipkart &bull; Walmart &bull; eBay</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenOnboarding}
            className="text-xs text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            title="Start Interactive Tour"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Product Tour</span>
          </button>
          <span className="text-neutral-700 hidden sm:inline">|</span>
          <span className="text-sky-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Price Forecasting</span>
          </span>
        </div>
      </div>

      {/* Floating Glass Header */}
      <header className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 sm:px-6 py-3 flex justify-between items-center transition-all duration-300 relative z-30">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400/20 to-teal-400/10 border border-sky-400/30 flex items-center justify-center text-sm shadow-inner group-hover:border-sky-400/60 transition-colors">
            📊
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-display font-bold text-white tracking-tight leading-tight flex items-center gap-1.5">
              PriceSpy
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
                PRO
              </span>
            </span>
            <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase">
              Predictive Price Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 sm:space-x-3 text-sm">
          <Link to="/" className={getNavClass("/")}>Home</Link>
          <Link to="/compare" className={getNavClass("/compare")}>Compare</Link>
          <Link to="/dashboard" className={getNavClass("/dashboard")}>Dashboard</Link>
          <Link to="/admin" className={getNavClass("/admin")}>Admin</Link>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
            title="Toggle Visual Theme"
          >
            <Palette className="w-4 h-4 text-sky-400" />
          </button>

          {userEmail ? (
            <div className="flex items-center space-x-2.5 pl-2 border-l border-white/10">
              <span className="text-xs font-mono text-gray-300 bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-lg max-w-[140px] truncate" title={userEmail}>
                {userEmail}
              </span>
              <button 
                onClick={onLogout}
                className="text-xs font-mono text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/auth')}
              className="btn-primary btn-shimmer px-4 py-2 rounded-xl text-neutral-950 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </nav>

        {/* Mobile Hamburger Button (Feature 12: down to 325px) */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-gray-300"
            title="Toggle Visual Theme"
          >
            <Palette className="w-4 h-4 text-sky-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer (Feature 12) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] z-40 bg-black/90 backdrop-blur-xl p-4 flex flex-col space-y-4 border-b border-white/10 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2">
            <Link to="/" className={getMobileNavClass("/")}>Home</Link>
            <Link to="/compare" className={getMobileNavClass("/compare")}>Compare Deals</Link>
            <Link to="/dashboard" className={getMobileNavClass("/dashboard")}>Watchlist Dashboard</Link>
            <Link to="/admin" className={getMobileNavClass("/admin")}>Admin Console</Link>
            <Link to="/privacy" className={getMobileNavClass("/privacy")}>Privacy Policy</Link>
            <Link to="/terms" className={getMobileNavClass("/terms")}>Terms of Service</Link>
          </div>

          <div className="pt-4 border-t border-white/10">
            {userEmail ? (
              <div className="space-y-3">
                <div className="text-xs font-mono text-gray-400 bg-white/[0.04] p-3 rounded-xl border border-white/10 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="truncate">{userEmail}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-secondary py-2.5 rounded-xl text-xs font-mono text-rose-400 border-rose-500/20"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate('/auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full btn-primary btn-shimmer py-3 rounded-xl text-xs font-bold text-neutral-950 inline-flex items-center justify-center gap-2"
              >
                <span>Sign In or Register</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('pricespy_theme') || 'dark');
  const [toast, setToast] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('pricespy_user');
    const token = localStorage.getItem('pricespy_token');
    if (savedUser && token) {
      setUserEmail(savedUser);
      // Check if user has completed onboarding (Feature 19)
      api.get('/api/auth/me').then(res => {
        if (res.data && res.data.has_completed_onboarding === false) {
          setShowOnboarding(true);
        }
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('pricespy_theme', theme);
  }, [theme]);

  // Global listeners for rate limit (Feature 8) & auth expiration
  useEffect(() => {
    const handleRateLimit = (e) => {
      const { retryAfter, message } = e.detail || {};
      setToast({
        type: 'error',
        message: message || `Rate limit reached. Please wait ${retryAfter || 60} seconds before retrying.`
      });
    };

    const handleAuthExpired = () => {
      setUserEmail(null);
      setToast({
        type: 'info',
        message: 'Your session has expired. Please sign in again.'
      });
    };

    window.addEventListener('pricespy_rate_limited', handleRateLimit);
    window.addEventListener('pricespy_auth_expired', handleAuthExpired);

    return () => {
      window.removeEventListener('pricespy_rate_limited', handleRateLimit);
      window.removeEventListener('pricespy_auth_expired', handleAuthExpired);
    };
  }, []);

  const toggleTheme = () => {
    const themes = ['dark', 'light', 'retro'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('pricespy_token');
    localStorage.removeItem('pricespy_user');
    setUserEmail(null);
    setToast({
      type: 'info',
      message: 'You have been signed out safely.'
    });
  };

  return (
    <BrowserRouter>
      <PageViewTracker />
      
      {/* Rate Limit / Notification Toast (Features 6 & 8) */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Onboarding Flow Modal (Feature 19) */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <div className="relative min-h-screen bg-mainDark text-white p-3 sm:p-6 transition-colors duration-300 overflow-x-hidden flex flex-col justify-between">
        {/* Subtle Ambient Background Grid & Radial Glows */}
        <div className="fixed inset-0 bg-grid-pattern opacity-25 pointer-events-none z-0" />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-500/10 blur-[140px] pointer-events-none z-0 rounded-full" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[400px] bg-emerald-500/05 blur-[160px] pointer-events-none z-0 rounded-full" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navigation 
            userEmail={userEmail} 
            onLogout={handleLogout} 
            toggleTheme={toggleTheme}
            onOpenOnboarding={() => setShowOnboarding(true)}
          />

          {/* Main View Wrapped in Production ErrorBoundary (Feature 15) */}
          <main className="max-w-7xl mx-auto mt-6 sm:mt-8 flex-1 w-full">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/auth" element={<AuthPage onLoginSuccess={(email) => {
                  setUserEmail(email);
                  // Check if user needs onboarding
                  api.get('/api/auth/me').then(res => {
                    if (res.data && res.data.has_completed_onboarding === false) {
                      setShowOnboarding(true);
                    }
                  }).catch(() => {});
                }} />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ErrorBoundary>
          </main>

          {/* Comprehensive Production Footer */}
          <footer className="max-w-7xl mx-auto w-full pt-12 sm:pt-16 pb-8 border-t border-white/[0.08] mt-16 space-y-6 text-xs font-mono text-gray-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-gray-400">
              <div className="space-y-2">
                <div className="text-white font-bold font-display text-sm flex items-center gap-1.5">
                  <span>PriceSpy</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    V3.8
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  Next-generation predictive price intelligence engine. Automated Bayesian time-series forecasting across major multi-platform e-commerce stores.
                </p>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <span className="text-white font-semibold uppercase text-[11px] tracking-wider mb-1">
                  Platforms &amp; Scraping
                </span>
                <Link to="/compare" className="hover:text-emerald-400 transition-colors">Cross-Platform Matrix</Link>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Flagship Price Forecaster</Link>
                <span className="text-gray-400">Amazon India (Canonical ASIN)</span>
                <span className="text-gray-400">Flipkart Verified Listings</span>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <span className="text-white font-semibold uppercase text-[11px] tracking-wider mb-1">
                  Architecture &amp; Security
                </span>
                <Link to="/admin" className="hover:text-sky-400 transition-colors">Telemetry &amp; Backups</Link>
                <span className="text-gray-400">Row-Level Security (RLS)</span>
                <span className="text-gray-400">Rate Limiting Protected</span>
                <span className="text-gray-400">Secure Backend Secrets</span>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <span className="text-white font-semibold uppercase text-[11px] tracking-wider mb-1">
                  Compliance &amp; Legal
                </span>
                <Link to="/privacy" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>Privacy Policy (GDPR)</span>
                </Link>
                <Link to="/terms" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3 text-sky-400" />
                  <span>Terms of Service</span>
                </Link>
                <span className="text-gray-400">ISO 27001 Methodology</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-[11px] gap-3">
              <div className="flex items-center gap-2">
                <span>&copy; {new Date().getFullYear()} PriceSpy Inc.</span>
                <span>&bull;</span>
                <span className="text-gray-400">FastAPI &bull; React 19 &bull; Prophet ML Engine</span>
              </div>
              <div className="text-emerald-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Multi-Platform E-Commerce Sync Engine Active</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}