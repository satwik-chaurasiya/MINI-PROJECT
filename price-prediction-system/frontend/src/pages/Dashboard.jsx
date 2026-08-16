import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Bell, DollarSign, CheckCircle, TrendingDown, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ watching_count: 0, active_alerts: 0, savings_found: 0, alerts_triggered_week: 0 });
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));

    axios.get('http://127.0.0.1:8000/api/dashboard/watchlist')
      .then(res => setWatchlist(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark flex items-center gap-4">
          <div className="p-3 bg-surfaceDark rounded-xl text-electricBlue"><Package className="h-6 w-6" /></div>
          <div>
            <div className="text-2xl font-bold font-mono">{stats.watching_count}</div>
            <div className="text-xs text-gray-400">Products Tracked</div>
          </div>
        </div>
        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark flex items-center gap-4">
          <div className="p-3 bg-surfaceDark rounded-xl text-waitAmber"><Bell className="h-6 w-6" /></div>
          <div>
            <div className="text-2xl font-bold font-mono">{stats.active_alerts}</div>
            <div className="text-xs text-gray-400">Active Alerts</div>
          </div>
        </div>
        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark flex items-center gap-4">
          <div className="p-3 bg-surfaceDark rounded-xl text-dropGreen"><DollarSign className="h-6 w-6" /></div>
          <div>
            <div className="text-2xl font-bold font-mono">₹{stats.savings_found.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Savings Found</div>
          </div>
        </div>
        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark flex items-center gap-4">
          <div className="p-3 bg-surfaceDark rounded-xl text-electricBlue"><CheckCircle className="h-6 w-6" /></div>
          <div>
            <div className="text-2xl font-bold font-mono">{stats.alerts_triggered_week}</div>
            <div className="text-xs text-gray-400">Alerts Triggered</div>
          </div>
        </div>
      </div>

      {/* 2-Column Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 65%: My Watchlist */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">My Watchlist</h2>
          {watchlist.map((item) => (
            <div key={item.id} className="bg-cardDark p-5 rounded-2xl border border-surfaceDark flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-surfaceDark text-electricBlue rounded">{item.platform}</span>
                <h3 className="text-lg font-bold mt-1">{item.name}</h3>
                <div className="flex gap-4 mt-2 text-sm text-gray-400">
                  <span>Current: <strong className="text-white font-mono">₹{item.current_price.toLocaleString()}</strong></span>
                  <span>Predicted: <strong className="text-dropGreen font-mono">₹{item.predicted_price.toLocaleString()}</strong> ({item.timeframe})</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Confidence: <span className="text-dropGreen font-bold">{item.confidence}%</span> • Drop: <span className="text-dropGreen font-bold">{item.expected_drop}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/product/${item.id}`)}
                className="bg-surfaceDark hover:bg-electricBlue px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
              >
                View Chart <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right 35%: Live Alert Activity Feed */}
        <div className="bg-cardDark p-6 rounded-2xl border border-surfaceDark h-fit space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-electricBlue" /> Recent Alert Triggers
          </h2>
          <div className="space-y-4 text-sm border-t border-surfaceDark pt-4">
            <div className="p-3 bg-surfaceDark rounded-xl">
              <div className="text-dropGreen font-semibold">🟢 Samsung TV dropped!</div>
              <div className="text-gray-300 text-xs mt-1">₹45,000 → ₹38,500 (Target matched)</div>
              <div className="text-gray-500 text-[10px] mt-1">2 hours ago</div>
            </div>
            <div className="p-3 bg-surfaceDark rounded-xl">
              <div className="text-waitAmber font-semibold">🟡 iPhone 15 forecast updated</div>
              <div className="text-gray-300 text-xs mt-1">Expected low ₹71,999 in 15 days</div>
              <div className="text-gray-500 text-[10px] mt-1">Yesterday</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}