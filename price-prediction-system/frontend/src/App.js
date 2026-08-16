import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';

function Navigation({ userEmail, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-surfaceDark">
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-electricBlue">📊 PriceSpy</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm text-gray-300">
        <Link to="/" className="hover:text-white transition">Explore</Link>
        <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
        <Link to="/admin" className="hover:text-white transition">Admin</Link>
        
        {userEmail ? (
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-400 bg-surfaceDark px-2.5 py-1 rounded-lg border border-surfaceDark">
              {userEmail}
            </span>
            <button 
              onClick={onLogout}
              className="text-xs text-red-400 hover:text-red-300 transition"
            >
              Log Out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/auth')}
            className="bg-electricBlue hover:bg-blue-600 px-4 py-2 rounded-xl text-white font-medium text-xs transition"
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

  useEffect(() => {
    const savedUser = localStorage.getItem('pricespy_user');
    if (savedUser) setUserEmail(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pricespy_token');
    localStorage.removeItem('pricespy_user');
    setUserEmail(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-mainDark text-white p-6 font-sans">
        <Navigation userEmail={userEmail} onLogout={handleLogout} />

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