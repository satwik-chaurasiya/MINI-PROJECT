import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Loader2, ExternalLink, Bell, CheckCircle2, 
  Filter, Tag, ShieldCheck, ShoppingCart 
} from 'lucide-react';
import api from '../services/api';
import { trackEvent } from '../services/analytics';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';

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
    api.get('/api/platforms/summary')
      .then(res => setPlatformSummary(res.data))
      .catch(err => console.error("Failed to load platform summary", err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      handleSearch(q);
    } else {
      // Default initial query
      setQuery('iPhone 15');
      handleSearch('iPhone 15');
    }
  }, [location.search]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setResults([]);
    trackEvent('compare_search', '/compare', { query: searchQuery });

    try {
      const response = await api.get(`/api/products/compare?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
      api.get('/api/platforms/summary')
        .then(res => setPlatformSummary(res.data))
        .catch(() => {});
    } catch (err) {
      console.error("Failed to fetch compare data", err);
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
    setCustomTargetPrice(Math.round(item.price * 0.95));
  };

  const handleSaveToDatabase = async (e) => {
    e.preventDefault();
    if (!trackingItem) return;
    setIsSavingAlert(true);

    try {
      const cleanId = "prod_" + Math.abs(
        trackingItem.name.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
      ).toString(16).slice(0, 8);

      await api.post('/api/alerts', {
        product_id: cleanId,
        product_name: trackingItem.name,
        target_price: parseFloat(customTargetPrice),
        notify_method: "Email",
        platform: trackingItem.platform,
        current_price: parseFloat(trackingItem.price),
        store_url: trackingItem.store_url || ""
      });

      trackEvent('alert_created', '/compare', { product: trackingItem.name, platform: trackingItem.platform });
      setAlertSuccessId(trackingItem.platform + "_" + trackingItem.name);
      setTrackingItem(null);
      setTimeout(() => setAlertSuccessId(null), 3500);
    } catch (err) {
      console.error("Failed to save alert", err);
      alert("Failed to register alert. Please try again.");
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

  // Calculate cheapest platform
  const lowestPriceItem = results.length > 0 
    ? [...results].sort((a, b) => a.price - b.price)[0] 
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Real-Time E-Commerce Price Audit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Compare Marketplace Prices
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-light">
          Scan verified listings across Amazon, Flipkart, Walmart, and eBay with genuine store links.
        </p>

        {/* Search bar */}
        <form onSubmit={onSubmit} className="relative mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product (e.g., iPhone 15, MacBook Air, Sony WH-1000XM5)..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-11 pr-24 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition shadow-lg"
          />
          <Search className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 btn-primary btn-shimmer px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Compare</span>
          </button>
        </form>
      </div>

      {/* Platform Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(platformSummary.length > 0 ? platformSummary : [
          { platform: 'Amazon', quotes_saved: 12, domain: 'amazon.in' },
          { platform: 'Flipkart', quotes_saved: 14, domain: 'flipkart.com' },
          { platform: 'Walmart', quotes_saved: 12, domain: 'walmart.com' },
          { platform: 'eBay', quotes_saved: 12, domain: 'ebay.com' }
        ]).map((plat, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPlatform(selectedPlatform === plat.platform ? 'All' : plat.platform)}
            className={`pro-card p-3.5 rounded-xl cursor-pointer transition ${
              selectedPlatform === plat.platform 
                ? 'border-emerald-500 bg-emerald-500/10' 
                : 'hover:border-white/20'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getPlatformBadgeStyle(plat.platform)}`}>
                {plat.platform}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Live Sync</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Quotes: <strong className="text-white font-mono">{plat.quotes_saved ?? 12}</strong>
            </div>
            <div className="text-[10px] text-gray-500 font-mono truncate">{plat.domain}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs & Savings Banner */}
      {results.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {['All', 'Amazon', 'Flipkart', 'Walmart', 'eBay'].map(plat => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedPlatform === plat
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'bg-white/[0.04] text-gray-300 hover:text-white border border-white/[0.06]'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>

          {lowestPriceItem && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lowest: <strong className="text-white">₹{lowestPriceItem.price.toLocaleString()}</strong> on {lowestPriceItem.platform}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredResults.length === 0 && (
        <EmptyState
          title={`No quotes found for "${query}"`}
          description="Try searching for a flagship smartphone, laptop, or gaming console by exact model name."
          actionText="Search iPhone 15"
          onAction={() => { setQuery('iPhone 15'); handleSearch('iPhone 15'); }}
        />
      )}

      {/* Comparison Grid */}
      {!loading && filteredResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredResults.map((item, idx) => {
            const isLowest = lowestPriceItem && lowestPriceItem.platform === item.platform;
            const isAlertSaved = alertSuccessId === (item.platform + "_" + item.name);

            return (
              <div 
                key={idx}
                className={`pro-card rounded-2xl overflow-hidden flex flex-col justify-between group ${
                  isLowest ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : ''
                }`}
              >
                <div>
                  {/* Product Image */}
                  <div className="h-44 bg-white p-4 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" 
                      loading="lazy"
                    />
                    <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${getPlatformBadgeStyle(item.platform)}`}>
                      {item.platform}
                    </span>
                    {isLowest && (
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold font-mono tracking-wider uppercase">
                        Lowest Price
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug" title={item.name}>
                      {item.name}
                    </h3>
                    <div>
                      <div className="text-[11px] font-mono text-gray-400">Live Quoted Price</div>
                      <div className="text-2xl font-bold font-mono text-white mt-0.5">
                        ₹{item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => openTrackModal(item)}
                    className="w-full btn-secondary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer animate-bell"
                  >
                    <Bell className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Track Price in DB</span>
                  </button>

                  {isAlertSaved && (
                    <div className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 flex items-center justify-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Watchlist alert created!</span>
                    </div>
                  )}

                  <a
                    href={item.store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('click_store', '/compare', { platform: item.platform, product: item.name })}
                    className="w-full btn-primary btn-shimmer py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>View on {item.platform}</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Target Price Alert Modal */}
      {trackingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="pro-card rounded-2xl max-w-md w-full p-6 space-y-4 relative border-emerald-500/30 shadow-2xl">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" /> Set Price Alert on {trackingItem.platform}
            </h3>
            <p className="text-xs text-gray-400 line-clamp-2">
              {trackingItem.name}
            </p>

            <form onSubmit={handleSaveToDatabase} className="space-y-4 pt-1">
              <div>
                <span className="text-[11px] text-gray-400 font-mono block">Current Platform Price:</span>
                <span className="text-xl font-bold font-mono text-white">₹{trackingItem.price.toLocaleString()}</span>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Target Notification Price (₹)
                </label>
                <input
                  type="number"
                  value={customTargetPrice}
                  onChange={(e) => setCustomTargetPrice(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-base font-mono text-white focus:outline-none transition"
                  min="1"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  You'll be notified when price drops to or below ₹{Number(customTargetPrice || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingItem(null)}
                  className="flex-1 btn-secondary py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAlert}
                  className="flex-1 btn-primary btn-shimmer py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingAlert ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bell className="w-3.5 h-3.5" />}
                  <span>Save Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
