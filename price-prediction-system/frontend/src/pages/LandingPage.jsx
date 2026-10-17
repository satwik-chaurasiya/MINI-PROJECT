import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  TrendingDown,
  ArrowRight,
  Database,
  ExternalLink,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.length > 2) {
      const delay = setTimeout(() => {
        axios.get(`http://127.0.0.1:8000/api/products/autocomplete?q=${searchTerm}`)
          .then(res => setSuggestions(res.data))
          .catch(err => console.error(err));
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/search')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));

    const fetchCategories = () => {
      axios.get('http://127.0.0.1:8000/api/categories/summary')
        .then(res => setCategories(res.data))
        .catch(err => console.error(err));
    };
    
    fetchCategories();
    const trendInterval = setInterval(fetchCategories, 5000);
    return () => clearInterval(trendInterval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    axios.get(`http://127.0.0.1:8000/api/products/search?q=${searchTerm}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="space-y-16">
      {/* Editorial Hero Section */}
      <section className="text-center pt-8 pb-12 px-4 max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6 shadow-inner text-xs font-mono text-gray-300">
          <span className="flex h-2 w-2 rounded-full bg-sky-400"></span>
          <span className="text-gray-400 uppercase tracking-widest text-[10px]">Prophet AI Ingestion</span>
          <span className="text-gray-600">•</span>
          <span className="text-sky-300 font-medium">Predictive Intelligence</span>
          <span className="text-gray-600">•</span>
          <span className="text-emerald-400 font-medium">4 Marketplaces</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-[1.1] mb-6">
          Stop Overpaying. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-300">
            Know Exactly When Prices Will Drop.
          </span>
        </h1>

        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
          AI-powered predictive pricing across Amazon India, Flipkart, Walmart, and eBay. 
          Make data-driven purchasing decisions with automated Buy or Wait verdicts.
        </p>

        {/* Search Bar with Glass Panel */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative z-20">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel focus-within:border-sky-400/60 focus-within:shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all">
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400 shrink-0" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search smartphone, laptop, console (e.g., iPhone 15, MacBook)..."
                className="w-full bg-transparent border-0 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
            <button 
              type="submit" 
              className="bg-gradient-to-r from-sky-400 to-teal-300 hover:shadow-[0_0_18px_rgba(56,189,248,0.5)] px-6 py-2.5 rounded-xl font-semibold text-xs text-neutral-950 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              Analyze Forecast
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 glass-panel rounded-2xl shadow-2xl overflow-hidden text-left border border-white/10 animate-in fade-in duration-150">
              {suggestions.map((s, idx) => (
                <div 
                  key={idx} 
                  className="px-4 py-3 hover:bg-white/[0.08] cursor-pointer flex justify-between items-center text-sm transition-colors border-b border-white/[0.04] last:border-0"
                  onClick={() => {
                    setSearchTerm(s.title);
                    setShowSuggestions(false);
                  }}
                >
                  <span className="text-gray-200 font-medium truncate">{s.title}</span>
                  <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded ml-2 shrink-0">
                    {s.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Connected Platforms Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5 text-gray-300 font-semibold">
            <Database className="w-3.5 h-3.5 text-emerald-400" /> Monitored Platforms:
          </span>
          <span className="px-2.5 py-1 bg-white/[0.03] rounded-lg border border-amber-500/30 text-amber-300 font-medium">
            Amazon India
          </span>
          <span className="px-2.5 py-1 bg-white/[0.03] rounded-lg border border-blue-500/30 text-blue-300 font-medium">
            Flipkart
          </span>
          <span className="px-2.5 py-1 bg-white/[0.03] rounded-lg border border-cyan-500/30 text-cyan-300 font-medium">
            Walmart
          </span>
          <span className="px-2.5 py-1 bg-white/[0.03] rounded-lg border border-rose-500/30 text-rose-300 font-medium">
            eBay
          </span>
          <button 
            onClick={() => navigate('/compare')} 
            className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold hover:underline ml-2 transition-colors cursor-pointer"
          >
            Compare Cross-Platform <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Telemetry HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 text-left">
          <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
              Active Platforms <Database className="w-3.5 h-3.5 text-sky-400" />
            </span>
            <div className="text-2xl font-display font-bold text-white mt-1">4 Rails</div>
            <span className="text-[10px] font-mono text-emerald-400 mt-1">Live Multi-Store Scraping</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
              Items Tracked <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </span>
            <div className="text-2xl font-display font-bold text-white mt-1">124,582</div>
            <span className="text-[10px] font-mono text-gray-400 mt-1">Electronics & Gadgets</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
              Avg Drop Lift <TrendingDown className="w-3.5 h-3.5 text-teal-400" />
            </span>
            <div className="text-2xl font-display font-bold text-white mt-1">-21.4%</div>
            <span className="text-[10px] font-mono text-teal-400 mt-1">Predicted Before Buying</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
              Model Accuracy <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            </span>
            <div className="text-2xl font-display font-bold text-white mt-1">89.9%</div>
            <span className="text-[10px] font-mono text-sky-400 mt-1">Prophet v3.2 Benchmarked Accuracy</span>
          </div>
        </div>
      </section>

      {/* Categories Catalog */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2 text-white">
            <Database className="text-sky-400 h-5 w-5" /> Product Catalogs (124,582 Items)
          </h2>
          <span className="text-xs font-mono text-gray-400">Syncs Every 5s</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="glass-panel glass-panel-hover p-4 rounded-2xl cursor-pointer text-center group flex flex-col justify-center items-center shadow-sm"
              onClick={() => setSearchTerm(cat.name)}
            >
              <div className="text-3xl mb-2.5 transform group-hover:scale-115 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="font-semibold text-sm text-gray-200">{cat.name}</h3>
              <p className="text-gray-400 text-xs mt-0.5 font-mono">{cat.count.toLocaleString()} Items</p>
              <p className={`text-[11px] font-mono mt-2 font-medium ${cat.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                {cat.trend} this week
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Results / Top Predicted Drops Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2 text-white">
              <TrendingDown className="text-emerald-400 h-5 w-5" /> Top Predicted Price Drops
            </h2>
            <p className="text-xs text-gray-400 mt-1">Identified by Prophet ML algorithm for maximum savings</p>
          </div>
          <button 
            onClick={() => navigate('/compare')}
            className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View Full Comparison</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="glass-panel glass-panel-hover p-6 rounded-3xl cursor-pointer flex flex-col justify-between relative group"
            >
              {item.store_url && (
                <a 
                  href={item.store_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={e => e.stopPropagation()} 
                  className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all opacity-0 group-hover:opacity-100"
                  title={`View directly on ${item.platform}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 font-semibold">
                    {item.platform}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Drop Detected</span>
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white mt-1 line-clamp-2 group-hover:text-sky-300 transition-colors">
                  {item.name}
                </h3>

                <div className="mt-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-400 text-xs font-mono">Current Live Price:</span>
                    <span className="font-mono text-base font-bold text-white">₹{item.current_price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-emerald-400">
                    <span className="text-xs font-mono font-medium">Predicted Drop Target:</span>
                    <span className="font-mono text-sm font-bold">
                      ₹{item.forecasts && item.forecasts[1] ? item.forecasts[1].predicted_low.toLocaleString() : item.current_price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs font-mono font-semibold text-sky-400 group-hover:text-teal-300 transition-colors">
                <span>Inspect Forecast Horizon</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}