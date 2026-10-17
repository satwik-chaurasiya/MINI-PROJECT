import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Palette, Sparkles, ArrowUpRight } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import ComparePage from './pages/ComparePage';

function Navigation({ userEmail, onLogout, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavClass = (path) => {
    const isActive = location.pathname === path;
    const baseClass = "px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ";
    return isActive 
      ? baseClass + "text-white bg-sky-500/20 border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.25)] font-semibold"
      : baseClass + "text-gray-400 hover:text-white hover:bg-white/[0.05]";
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
          <span className="text-emerald-400 font-semibold">Live Real-Time Telemetry</span>
          <span className="hidden md:inline text-neutral-600">•</span>
          <span className="hidden md:inline text-gray-400">Amazon • Flipkart • Walmart • eBay</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sky-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Price Forecasting</span>
          </span>
        </div>
      </div>

      {/* Floating Glass Header */}
      <header className="max-w-7xl mx-auto glass-panel rounded-2xl px-5 py-3 flex justify-between items-center transition-all duration-300">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400/20 to-teal-400/10 border border-sky-400/30 flex items-center justify-center text-sm shadow-inner group-hover:border-sky-400/60 transition-colors">
            📊
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-display font-bold text-white tracking-tight leading-tight flex items-center gap-1.5">
              PriceSpy
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
                AI PRO
              </span>
            </span>
            <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase">
              Predictive Price Engine
            </span>
          </div>
        </Link>

        <nav className="flex items-center space-x-2 sm:space-x-3 text-sm">
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
              <span className="text-xs font-mono text-gray-300 bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-lg">
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
              className="group inline-flex items-center gap-1 bg-gradient-to-r from-sky-400 to-teal-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] px-4 py-2 rounded-xl text-neutral-950 font-semibold text-xs transition-all cursor-pointer active:scale-95"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          )}
        </nav>
      </header>
    </>
  );
}

export default function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('pricespy_theme') || 'dark');

  useEffect(() => {
    const savedUser = localStorage.getItem('pricespy_user');
    if (savedUser) setUserEmail(savedUser);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('pricespy_theme', theme);
  }, [theme]);

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
  };

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-mainDark text-white p-4 sm:p-6 transition-colors duration-300 overflow-x-hidden">
        {/* Subtle Ambient Background Grid & Radial Glows */}
        <div className="fixed inset-0 bg-grid-pattern opacity-25 pointer-events-none z-0" />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-500/10 blur-[140px] pointer-events-none z-0 rounded-full" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[400px] bg-emerald-500/05 blur-[160px] pointer-events-none z-0 rounded-full" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navigation userEmail={userEmail} onLogout={handleLogout} toggleTheme={toggleTheme} />

          <main className="max-w-7xl mx-auto mt-8 flex-1 w-full">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/auth" element={<AuthPage onLoginSuccess={(email) => setUserEmail(email)} />} />
            </Routes>
          </main>

          {/* Footer Telemetry */}
          <footer className="max-w-7xl mx-auto w-full pt-16 pb-8 border-t border-white/[0.08] mt-16 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-gray-500 gap-4">
            <div className="flex items-center gap-2">
              <span>📊 PriceSpy Architecture</span>
              <span>•</span>
              <span className="text-gray-400">FastAPI + React 19 + Prophet ML</span>
            </div>
            <div className="text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Multi-Platform E-Commerce Sync Engine Active</span>
            </div>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}