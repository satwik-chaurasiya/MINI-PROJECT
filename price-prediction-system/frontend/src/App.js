import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Palette } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';

function Navigation({ userEmail, onLogout, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavClass = (path) => {
    const isActive = location.pathname === path;
    const baseClass = "px-3 py-1.5 rounded-lg transition-all duration-200 transform ";
    return isActive 
      ? baseClass + "text-white bg-tabActive shadow-sm"
      : baseClass + "text-gray-300 hover:text-white hover:-translate-y-0.5 hover:scale-105 hover:bg-tabHover";
  };

  return (
    <header className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-surfaceDark">
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-electricBlue">📊 PriceSpy</span>
      </Link>
      <nav className="flex items-center space-x-4 text-sm text-gray-300">
        <Link to="/" className={getNavClass("/")}>Home</Link>
        <Link to="/dashboard" className={getNavClass("/dashboard")}>Dashboard</Link>
        <Link to="/admin" className={getNavClass("/admin")}>Admin</Link>
        
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-tabHover text-gray-300 hover:text-white transition-all transform hover:scale-110"
          title="Change Theme"
        >
          <Palette className="w-5 h-5" />
        </button>

        {userEmail ? (
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-400 bg-surfaceDark px-2.5 py-1 rounded-lg border border-surfaceDark">
              {userEmail}
            </span>
            <button 
              onClick={onLogout}
              className="text-xs text-red-400 hover:text-red-300 hover:scale-110 transition-all duration-200 transform"
            >
              Log Out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/auth')}
            className="bg-electricBlue hover:bg-blue-500 px-4 py-2 rounded-xl text-white font-medium text-xs transition-all duration-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 transform"
          >
            Get Started
          </button>
        )}
      </nav>
    </header>
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
      <div className="min-h-screen bg-mainDark text-white p-6 font-sans transition-colors duration-300">
        <Navigation userEmail={userEmail} onLogout={handleLogout} toggleTheme={toggleTheme} />

        <main className="max-w-7xl mx-auto mt-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/auth" element={<AuthPage onLoginSuccess={(email) => setUserEmail(email)} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}