import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Loader2, ExternalLink, Database, Bell, CheckCircle2, Filter } from 'lucide-react';

export default function ComparePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [platformSummary, setPlatformSummary] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [trackingItem, setTrackingItem] = useState(null);
  const [customTargetPrice, setCustomTargetPrice] = useState('');
  const [alertSuccessId, setAlertSuccessId] = useState(null);
  const [isSavingAlert, setIsSavingAlert] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch live database connection summary for all platforms
    axios.get('http://localhost:8000/api/platforms/summary')
      .then(res => setPlatformSummary(res.data))
      .catch(err => console.error("Failed to load platform summary", err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [location.search]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const response = await fetch(`http://localhost:8000/api/products/compare?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        // Refresh platform summary counts since compare persists quotes to database
        axios.get('http://localhost:8000/api/platforms/summary')
          .then(res => setPlatformSummary(res.data))
          .catch(() => {});
      } else {
        console.error("Failed to fetch compare data");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/compare?q=${encodeURIComponent(query)}`);
    }
  };

  const openTrackModal = (item) => {
    setTrackingItem(item);
    // Default target price to 5% below current price
    setCustomTargetPrice(Math.round(item.price * 0.95));
  };

  const handleSaveToDatabase = async (e) => {
    e.preventDefault();
    if (!trackingItem) return;
    setIsSavingAlert(true);

    const token = localStorage.getItem('pricespy_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      // Generate clean deterministic product_id
      const cleanId = "prod_" + Math.abs(
        trackingItem.name.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
      ).toString(16).slice(0, 8);

      await axios.post('http://localhost:8000/api/alerts', {
        product_id: cleanId,
        product_name: trackingItem.name,
        target_price: parseFloat(customTargetPrice),
        notify_method: "Email",
        platform: trackingItem.platform,
        current_price: parseFloat(trackingItem.price),
        store_url: trackingItem.store_url || ""
      }, { headers });

      setAlertSuccessId(trackingItem.platform + "_" + trackingItem.name);
      setTrackingItem(null);
      setTimeout(() => setAlertSuccessId(null), 4000);
    } catch (err) {
      console.error("Failed to save alert to database", err);
      alert("Failed to save alert to database. Please try again.");
    } finally {
      setIsSavingAlert(false);
    }
  };

  const getPlatformBadgeStyle = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'amazon':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'flipkart':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'walmart':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'ebay':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/10 text-gray-300 border-gray-500/30';
    }
  };

  const filteredResults = selectedPlatform === 'All'
    ? results
    : results.filter(r => r.platform?.toLowerCase() === selectedPlatform.toLowerCase());

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Compare Product Prices</h1>
        <p className="text-gray-400">Search for any item to scan live prices and persist quotes to the SQLite database across 4 platforms</p>
        
        <form onSubmit={onSubmit} className="max-w-2xl mx-auto mt-8 relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product (e.g. iPhone 15, Sony WH-1000XM5, MacBook Air)..."
            className="w-full bg-surfaceDark/50 border border-surfaceDark rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electricBlue focus:border-transparent transition-all shadow-lg backdrop-blur-sm group-hover:bg-surfaceDark/70"
          />
          <Search className="absolute left-4 top-4 text-gray-400" />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bg-electricBlue hover:bg-blue-500 text-white p-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </form>
      </div>

      {/* Database Platform Connectivity Banner */}
      <div className="bg-cardDark border border-surfaceDark rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-3 border-b border-surfaceDark">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-electricBlue" />
            <h2 className="text-base font-bold text-white">Database Connected Platforms</h2>
            <span className="text-xs bg-dropGreen/20 text-dropGreen border border-dropGreen/30 px-2.5 py-0.5 rounded-full font-semibold">
              ● SQLite Synced
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Real-time multi-platform price quote ingestion & background alerting
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(platformSummary.length > 0 ? platformSummary : [
            { platform: 'Amazon', status: 'Active', quotes_saved: 0, active_alerts: 0 },
            { platform: 'Flipkart', status: 'Active', quotes_saved: 0, active_alerts: 0 },
            { platform: 'Walmart', status: 'Active', quotes_saved: 0, active_alerts: 0 },
            { platform: 'eBay', status: 'Active', quotes_saved: 0, active_alerts: 0 }
          ]).map((plat, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedPlatform(selectedPlatform === plat.platform ? 'All' : plat.platform)}
              className={`p-3 rounded-xl border transition cursor-pointer ${
                selectedPlatform === plat.platform 
                  ? 'bg-electricBlue/10 border-electricBlue' 
                  : 'bg-surfaceDark/40 border-surfaceDark hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getPlatformBadgeStyle(plat.platform)}`}>
                  {plat.platform}
                </span>
                <span className="text-[10px] text-dropGreen font-mono">Connected</span>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Quotes in DB: <strong className="text-white font-mono">{plat.quotes_saved ?? 0}</strong>
              </div>
              <div className="text-[11px] text-gray-400">
                Alerts in DB: <strong className="text-electricBlue font-mono">{plat.active_alerts ?? 0}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs if results available */}
      {results.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter Platform:</span>
            {['All', 'Amazon', 'Flipkart', 'Walmart', 'eBay'].map(plat => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedPlatform === plat 
                    ? 'bg-electricBlue text-white' 
                    : 'bg-surfaceDark text-gray-300 hover:text-white'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400">
            Showing {filteredResults.length} of {results.length} quotes from database
          </span>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-electricBlue animate-spin" />
          <p className="text-gray-400 animate-pulse">Scanning live quotes across Amazon, Flipkart, Walmart, and eBay and persisting to SQLite...</p>
        </div>
      )}

      {/* Comparison Grid */}
      {!loading && filteredResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredResults.map((item, idx) => {
            const isAlertSaved = alertSuccessId === (item.platform + "_" + item.name);
            return (
              <div key={idx} className="bg-surfaceDark/40 backdrop-blur-sm border border-surfaceDark rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-electricBlue/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
                <div>
                  <div className="h-48 bg-white p-4 flex items-center justify-center relative">
                    <img src={item.image_url} alt={item.name} className="max-h-full object-contain" />
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${getPlatformBadgeStyle(item.platform)}`}>
                      {item.platform}
                    </span>
                  </div>
                  
                  <div className="p-6 space-y-3">
                    <h3 className="text-base font-semibold text-white line-clamp-2" title={item.name}>
                      {item.name}
                    </h3>

                    <div className="flex items-baseline justify-between pt-2">
                      <div>
                        <div className="text-xs text-gray-400">Live Price</div>
                        <span className="text-3xl font-bold font-mono text-electricBlue">
                          ₹{item.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 bg-surfaceDark px-2 py-1 rounded border border-surfaceDark">
                        SQLite Saved
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-2">
                  {/* Track in Database Watchlist Button */}
                  <button 
                    onClick={() => openTrackModal(item)}
                    className="w-full flex items-center justify-center gap-2 bg-electricBlue/20 hover:bg-electricBlue/30 text-electricBlue border border-electricBlue/40 py-2.5 rounded-xl text-sm font-semibold transition group"
                  >
                    <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Track Price in Database
                  </button>

                  {isAlertSaved && (
                    <div className="text-xs text-dropGreen bg-dropGreen/10 border border-dropGreen/30 rounded-lg p-2 flex items-center justify-center gap-1.5 animate-fade-in font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Watchlist alert saved to database!
                    </div>
                  )}

                  {/* External Store Link */}
                  <a 
                    href={item.store_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-surfaceDark hover:bg-tabHover py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:text-white transition-colors group border border-surfaceDark"
                  >
                    View on {item.platform}
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Target Price Alert Modal */}
      {trackingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-cardDark border border-surfaceDark rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-electricBlue" /> Track on {trackingItem.platform}
            </h3>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {trackingItem.name}
            </p>

            <form onSubmit={handleSaveToDatabase} className="mt-5 space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1">Current Platform Price</label>
                <div className="text-xl font-bold font-mono text-white">₹{trackingItem.price.toLocaleString()}</div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">
                  Alert Target Price (₹)
                </label>
                <input 
                  type="number"
                  value={customTargetPrice}
                  onChange={(e) => setCustomTargetPrice(e.target.value)}
                  className="w-full bg-surfaceDark border border-surfaceDark focus:border-electricBlue rounded-xl px-4 py-3 text-white font-mono text-base focus:outline-none"
                  required
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Alert will trigger when {trackingItem.platform} price drops below ₹{Number(customTargetPrice || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setTrackingItem(null)}
                  className="flex-1 bg-surfaceDark hover:bg-tabHover text-gray-300 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAlert}
                  className="flex-1 bg-electricBlue hover:bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSavingAlert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  Save to DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No results found across platforms for "{query}".</p>
        </div>
      )}
    </div>
  );
}
