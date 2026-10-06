import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, TrendingDown, ArrowRight, Database, ExternalLink } from 'lucide-react';

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
    
    // Initial fetch
    fetchCategories();
    
    // Live Real-Time Polling for Market Trends
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
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Stop Overpaying. <br />
          <span className="text-electricBlue">Know When Prices Will Drop.</span>
        </h1>
        <p className="text-gray-400 text-base mt-4">
          AI-powered price forecasting for Amazon, Flipkart, Walmart, and eBay.
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex items-center max-w-xl mx-auto gap-2">
          <div className="relative flex-1 text-left">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search product name (e.g., iPhone 15)..."
              className="w-full bg-cardDark border border-surfaceDark rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-electricBlue transition"
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-cardDark border border-surfaceDark rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
                {suggestions.map((s, idx) => (
                  <div 
                    key={idx} 
                    className="px-4 py-3 hover:bg-surfaceDark cursor-pointer flex justify-between items-center text-sm transition"
                    onClick={() => {
                      setSearchTerm(s.title);
                      setShowSuggestions(false);
                    }}
                  >
                    <span className="text-gray-200 font-medium truncate">{s.title}</span>
                    <span className="text-xs text-electricBlue bg-[#1e2330] border border-surfaceDark px-2 py-0.5 rounded ml-2 flex-shrink-0">
                      {s.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="bg-electricBlue hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold text-sm transition">
            Search
          </button>
        </form>
      </section>

      {/* Categories Catalog */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Database className="text-electricBlue h-5 w-5" /> Product Catalogs (124,582 Items)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="bg-cardDark p-4 rounded-2xl border border-surfaceDark hover:border-electricBlue cursor-pointer transition text-center group flex flex-col justify-center items-center shadow-sm"
              onClick={() => setSearchTerm(cat.name)}
            >
              <div className="text-3xl mb-3 transform group-hover:scale-110 transition duration-300">{cat.icon}</div>
              <h3 className="font-semibold text-sm text-gray-200">{cat.name}</h3>
              <p className="text-gray-400 text-xs mt-1 font-mono">{cat.count.toLocaleString()} Items</p>
              <p className={`text-xs font-mono mt-2 ${cat.trend.startsWith('+') ? 'text-dropGreen' : 'text-red-400'}`}>
                {cat.trend} this week
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Results / Trending Grid */}
      <section>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingDown className="text-dropGreen h-5 w-5" /> Top Predicted Price Drops
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="bg-cardDark p-5 rounded-2xl border border-surfaceDark hover:border-electricBlue cursor-pointer transition flex flex-col justify-between relative group"
            >
              {item.store_url && (
                <a 
                  href={item.store_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={e => e.stopPropagation()} 
                  className="absolute top-5 right-5 text-gray-400 hover:text-white transition opacity-0 group-hover:opacity-100"
                  title={`View on ${item.platform}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <div>
                <span className="text-xs px-2 py-0.5 bg-surfaceDark text-electricBlue rounded">
                  {item.platform}
                </span>
                <h3 className="font-semibold text-base mt-2 line-clamp-2">{item.name}</h3>
                <div className="mt-4 flex justify-between items-baseline">
                  <span className="text-gray-400 text-xs">Current:</span>
                  <span className="font-mono text-lg font-bold">₹{item.current_price.toLocaleString()}</span>
                </div>
                <div className="mt-1 flex justify-between items-baseline text-dropGreen">
                  <span className="text-xs">Predicted Low:</span>
                  <span className="font-mono text-sm font-semibold">₹{item.forecasts[1].predicted_low.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-surfaceDark flex justify-between items-center text-xs text-electricBlue font-medium">
                <span>View Prediction Band</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}