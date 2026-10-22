import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, TrendingDown, ArrowRight,
  Smartphone, Laptop, Headphones, Gamepad2, Watch, Camera
} from 'lucide-react';
import api from '../services/api';
import { trackEvent } from '../services/analytics';
import { CardSkeleton } from '../components/LoadingSkeleton';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial fetch
    setLoading(true);
    Promise.all([
      api.get('/api/products/search'),
      api.get('/api/categories/summary')
    ]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data);
      setCategories(catRes.data);
    }).catch(err => {
      console.error("Landing data load error", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const delay = setTimeout(() => {
        // Quick autocomplete
        const filtered = [
          { title: "Apple iPhone 15 (128 GB, Black)", category: "Smartphones" },
          { title: "Apple MacBook Air 13-inch M3", category: "Laptops & PCs" },
          { title: "Sony WH-1000XM5 Wireless Headphones", category: "Audio Gear" },
          { title: "Samsung Galaxy S24 Ultra 5G", category: "Smartphones" },
          { title: "Sony PlayStation 5 Slim Disc Edition", category: "Gaming" }
        ].filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()));
        setSuggestions(filtered);
      }, 200);
      return () => clearTimeout(delay);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    trackEvent('hero_search', '/', { query: searchTerm });
    navigate(`/compare?q=${encodeURIComponent(searchTerm)}`);
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-emerald-400" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-sky-400" />;
      case 'Headphones': return <Headphones className="w-5 h-5 text-amber-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'Watch': return <Watch className="w-5 h-5 text-rose-400" />;
      default: return <Camera className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-200">
      {/* Hero Section */}
      <section className="text-center pt-8 pb-10 px-4 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-gray-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 beacon-ring" />
          <span className="text-emerald-400 font-semibold">Predictive Price Engine</span>
          <span className="text-gray-600">•</span>
          <span>4 Platforms Synchronized</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-[1.1] text-white">
          Track Price Volatility. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
            Buy at the True Market Low.
          </span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          Real-time market tracking and time-series forecasting across Amazon India, Flipkart, Walmart, and eBay. 
          Make disciplined purchasing decisions backed by statistical evidence.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative z-20">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl pro-card border-white/10 focus-within:border-emerald-400 transition-all">
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search smartphone, laptop, console (e.g. iPhone 15, MacBook Air)..."
                className="w-full bg-transparent border-0 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary btn-shimmer px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Compare Prices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 pro-card rounded-2xl shadow-2xl overflow-hidden text-left border border-white/10 animate-in fade-in duration-150">
              {suggestions.map((s, idx) => (
                <div 
                  key={idx} 
                  className="px-4 py-3 hover:bg-white/[0.06] cursor-pointer flex justify-between items-center text-xs transition-colors border-b border-white/[0.04] last:border-0"
                  onMouseDown={() => {
                    setSearchTerm(s.title);
                    navigate(`/compare?q=${encodeURIComponent(s.title)}`);
                  }}
                >
                  <span className="text-gray-200 font-medium truncate">{s.title}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                    {s.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Monitored Platforms Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono text-gray-400">
          <span className="text-gray-300 font-medium">Monitored Rails:</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-amber-300">Amazon India</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-blue-300">Flipkart</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-cyan-300">Walmart</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-rose-300">eBay</span>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold font-display text-white">Popular Catalogs</h2>
          <span className="text-xs font-mono text-gray-400">Indexed & Verified</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(`/compare?q=${encodeURIComponent(cat.name)}`)}
              className="pro-card p-4 rounded-xl cursor-pointer text-center group flex flex-col justify-center items-center space-y-2 transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="font-semibold text-xs text-gray-200">{cat.name}</h3>
              <p className="text-gray-400 text-[11px] font-mono">{cat.count.toLocaleString()} Items</p>
              <span className={`text-[10px] font-mono ${cat.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                {cat.trend} weekly
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Top Predicted Price Drops */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              <span>Top Predicted Price Drops</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Statistical forecast horizon indicates imminent markdown</p>
          </div>
          <button 
            onClick={() => navigate('/compare')}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Comparisons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((item) => (
              <div 
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="pro-card p-5 rounded-2xl cursor-pointer flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-emerald-400 font-semibold">
                      {item.platform}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      Drop Forecasted
                    </span>
                  </div>

                  {/* Real Image */}
                  <div className="h-44 bg-white rounded-xl p-4 flex items-center justify-center mb-4 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="font-semibold text-sm text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </h3>

                  <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-400 text-xs font-mono">Current Price:</span>
                      <span className="font-mono text-sm font-bold text-white">₹{item.current_price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-emerald-400">
                      <span className="text-xs font-mono">Target Low:</span>
                      <span className="font-mono text-sm font-bold">
                        ₹{item.forecasts && item.forecasts[1] ? item.forecasts[1].predicted_low.toLocaleString() : item.current_price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.06] flex justify-between items-center text-xs font-mono font-semibold text-emerald-400 group-hover:text-teal-300 transition-colors">
                  <span>Inspect Forecast Horizon</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}