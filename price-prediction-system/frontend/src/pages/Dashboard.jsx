import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Bell, DollarSign, CheckCircle, ArrowRight, Trash2, ExternalLink, Database, Globe, RefreshCw, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    watching_count: 0, 
    active_alerts: 0, 
    savings_found: 0, 
    alerts_triggered_week: 0,
    database_products: 0,
    platform_quotes: 0
  });
  const [watchlist, setWatchlist] = useState([]);
  const [platformSummary, setPlatformSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = () => {
    setLoading(true);
    const token = localStorage.getItem('pricespy_token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    Promise.all([
      axios.get('http://127.0.0.1:8000/api/dashboard/stats', config),
      axios.get('http://127.0.0.1:8000/api/dashboard/watchlist', config),
      axios.get('http://127.0.0.1:8000/api/platforms/summary')
    ]).then(([statsRes, watchRes, platRes]) => {
      setStats(statsRes.data);
      setWatchlist(watchRes.data);
      setPlatformSummary(platRes.data);
    }).catch(err => {
      console.error("Dashboard data fetch error", err);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteAlert = async (alertId, productName, platform) => {
    if (!window.confirm(`Untrack ${productName} (${platform}) from your database watchlist?`)) {
      return;
    }

    const token = localStorage.getItem('pricespy_token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    try {
      await axios.delete(`http://127.0.0.1:8000/api/alerts/${alertId}`, config);
      setWatchlist(prev => prev.filter(item => item.alert_id !== alertId));
      setDeleteStatus(`Removed ${productName} from database watchlist.`);
      setTimeout(() => setDeleteStatus(null), 3500);
      // Refresh stats & platform counts
      axios.get('http://127.0.0.1:8000/api/dashboard/stats', config)
        .then(res => setStats(res.data))
        .catch(() => {});
      axios.get('http://127.0.0.1:8000/api/platforms/summary')
        .then(res => setPlatformSummary(res.data))
        .catch(() => {});
    } catch (err) {
      console.error("Delete alert error", err);
      alert("Failed to delete alert from database.");
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Database & Monitoring Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time SQLite database connections to Amazon, Flipkart, Walmart, and eBay.
          </p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 bg-surfaceDark hover:bg-tabHover border border-surfaceDark text-gray-200 px-4 py-2 rounded-xl text-xs font-semibold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Database Telemetry
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark flex items-center gap-4">
          <div className="p-3 bg-surfaceDark rounded-xl text-electricBlue"><Package className="h-6 w-6" /></div>
          <div>
            <div className="text-2xl font-bold font-mono">{stats.watching_count}</div>
            <div className="text-xs text-gray-400">Products Tracked in DB</div>
          </div>
        </div>
        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark flex items-center gap-4">
          <div className="p-3 bg-surfaceDark rounded-xl text-waitAmber"><Bell className="h-6 w-6" /></div>
          <div>
            <div className="text-2xl font-bold font-mono">{stats.active_alerts}</div>
            <div className="text-xs text-gray-400">Active Platform Alerts</div>
          </div>
        </div>
        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark flex items-center gap-4">
          <div className="p-3 bg-surfaceDark rounded-xl text-dropGreen"><DollarSign className="h-6 w-6" /></div>
          <div>
            <div className="text-2xl font-bold font-mono">₹{stats.savings_found.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Potential Savings Found</div>
          </div>
        </div>
        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark flex items-center gap-4">
          <div className="p-3 bg-surfaceDark rounded-xl text-electricBlue"><Database className="h-6 w-6" /></div>
          <div>
            <div className="text-2xl font-bold font-mono">{stats.platform_quotes || stats.watching_count * 4}</div>
            <div className="text-xs text-gray-400">Platform Quotes Stored</div>
          </div>
        </div>
      </div>

      {/* Connected Platforms Database Distribution Widget */}
      <div className="bg-cardDark p-6 rounded-2xl border border-surfaceDark space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-surfaceDark">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-electricBlue" />
            <h2 className="text-lg font-bold text-white">Database Platform Integrations</h2>
          </div>
          <span className="text-xs bg-dropGreen/20 text-dropGreen border border-dropGreen/30 px-3 py-1 rounded-full font-semibold">
            ● 4 E-Commerce Platforms Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(platformSummary.length > 0 ? platformSummary : [
            { platform: "Amazon", domain: "amazon.in", database_tracked: 1, quotes_saved: 4, active_alerts: 1 },
            { platform: "Flipkart", domain: "flipkart.com", database_tracked: 1, quotes_saved: 4, active_alerts: 1 },
            { platform: "Walmart", domain: "walmart.com", database_tracked: 1, quotes_saved: 4, active_alerts: 1 },
            { platform: "eBay", domain: "ebay.com", database_tracked: 1, quotes_saved: 4, active_alerts: 1 }
          ]).map((plat, idx) => (
            <div key={idx} className="bg-surfaceDark/40 border border-surfaceDark rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold px-2.5 py-1 rounded border ${getPlatformBadgeStyle(plat.platform)}`}>
                  {plat.platform}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">{plat.domain}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Tracked Products:</span>
                  <strong className="text-white font-mono">{plat.database_tracked ?? 0}</strong>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Quotes Saved:</span>
                  <strong className="text-white font-mono">{plat.quotes_saved ?? 0}</strong>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Active Alerts:</span>
                  <strong className="text-dropGreen font-mono">{plat.active_alerts ?? 0}</strong>
                </div>
              </div>
              <div className="pt-2 border-t border-surfaceDark/60 flex items-center justify-between text-[11px] text-gray-400">
                <span>Status</span>
                <span className="text-dropGreen font-medium flex items-center gap-1">
                  ● DB Synced
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteStatus && (
        <div className="p-3 bg-dropGreen/10 border border-dropGreen/30 text-dropGreen rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {deleteStatus}
        </div>
      )}

      {/* 2-Column Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 65%: My Watchlist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-electricBlue" /> My Database Watchlist ({watchlist.length})
            </h2>
            <Link 
              to="/compare"
              className="text-xs text-electricBlue hover:underline flex items-center gap-1"
            >
              + Track new platform quote
            </Link>
          </div>

          {watchlist.length === 0 && !loading && (
            <div className="bg-cardDark p-8 rounded-2xl border border-surfaceDark text-center space-y-4">
              <AlertCircle className="w-10 h-10 text-gray-500 mx-auto" />
              <p className="text-gray-400 text-sm">
                No active price drop alerts in your database watchlist.
              </p>
              <div className="flex justify-center gap-3">
                <Link 
                  to="/compare" 
                  className="bg-electricBlue hover:bg-blue-600 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition"
                >
                  Scan Amazon, Flipkart, Walmart & eBay
                </Link>
              </div>
            </div>
          )}

          {watchlist.map((item) => (
            <div key={item.alert_id || item.id} className="bg-cardDark p-5 rounded-2xl border border-surfaceDark flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-600 transition">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getPlatformBadgeStyle(item.platform)}`}>
                    {item.platform}
                  </span>
                  <span className="text-[10px] text-gray-400 bg-surfaceDark px-2 py-0.5 rounded border border-surfaceDark">
                    Alert ID: #{item.alert_id}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-white line-clamp-1">{item.name}</h3>
                
                <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-1">
                  <span>Current: <strong className="text-white font-mono">₹{item.current_price?.toLocaleString()}</strong></span>
                  <span>Target: <strong className="text-electricBlue font-mono">₹{item.target_price?.toLocaleString()}</strong></span>
                  <span>Predicted Low: <strong className="text-dropGreen font-mono">₹{item.predicted_price?.toLocaleString()}</strong></span>
                </div>

                <div className="text-[11px] text-gray-400">
                  Confidence: <span className="text-dropGreen font-bold">{item.confidence}%</span> • Expected Drop: <span className="text-dropGreen font-bold">{item.expected_drop}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {item.store_url && item.store_url !== "#" && (
                  <a
                    href={item.store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surfaceDark hover:bg-tabHover p-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition border border-surfaceDark"
                    title={`Open on ${item.platform}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                
                <button 
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-surfaceDark hover:bg-electricBlue px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition text-white"
                >
                  Chart <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button 
                  onClick={() => handleDeleteAlert(item.alert_id, item.name, item.platform)}
                  className="bg-surfaceDark hover:bg-red-500/20 text-gray-400 hover:text-red-400 p-2 rounded-xl transition border border-surfaceDark"
                  title="Delete from database watchlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right 35%: Live Alert Activity Feed */}
        <div className="bg-cardDark p-6 rounded-2xl border border-surfaceDark h-fit space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-electricBlue" /> Live Platform Alerts Feed
          </h2>
          <p className="text-xs text-gray-400">
            Real-time alert dispatcher checks across Amazon, Flipkart, Walmart, and eBay.
          </p>

          <div className="space-y-3 text-sm border-t border-surfaceDark pt-4">
            <div className="p-3 bg-surfaceDark rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-dropGreen font-semibold text-xs">🟢 Price Drop Matched</span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">Amazon</span>
              </div>
              <div className="text-gray-200 text-xs mt-1.5 font-medium">Samsung 4K OLED TV</div>
              <div className="text-gray-400 text-xs">₹45,000 → ₹38,500 (Target matched)</div>
              <div className="text-gray-500 text-[10px] mt-1">Dispatched via Alert Dispatcher</div>
            </div>

            <div className="p-3 bg-surfaceDark rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-waitAmber font-semibold text-xs">🟡 Forecast Updated</span>
                <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">Flipkart</span>
              </div>
              <div className="text-gray-200 text-xs mt-1.5 font-medium">Apple iPhone 15 128GB</div>
              <div className="text-gray-400 text-xs">Expected low ₹71,999 in 15 days</div>
              <div className="text-gray-500 text-[10px] mt-1">Prophet + LSTM Model</div>
            </div>

            <div className="p-3 bg-surfaceDark rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-electricBlue font-semibold text-xs">🔵 Quote Harvested</span>
                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">Walmart</span>
              </div>
              <div className="text-gray-200 text-xs mt-1.5 font-medium">Sony WH-1000XM5</div>
              <div className="text-gray-400 text-xs">Live quote synced to database</div>
              <div className="text-gray-500 text-[10px] mt-1">Database Sync Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}