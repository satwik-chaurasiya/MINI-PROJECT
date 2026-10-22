import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { 
  Clock, TrendingDown, ShieldCheck, CheckCircle2, 
  ShoppingCart, Scale, ArrowLeft, Bell, ExternalLink, Loader2 
} from 'lucide-react';
import api from '../services/api';
import { trackEvent } from '../services/analytics';
import { DetailSkeleton } from '../components/LoadingSkeleton';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const targetId = id || 'prod_iphone15_128';
    api.get(`/api/products/${targetId}`)
      .then(res => {
        setProduct(res.data);
        if (res.data.forecasts?.[1]) {
          setTargetPrice(res.data.forecasts[1].predicted_low);
        }
        trackEvent('product_detail_viewed', `/product/${targetId}`, { product: res.data.name });
      })
      .catch(err => {
        console.error("Product load error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSetAlert = async (e) => {
    e.preventDefault();
    if (!product || !targetPrice) return;
    setAlertLoading(true);

    try {
      await api.post('/api/alerts', {
        product_id: product.id,
        product_name: product.name,
        target_price: parseFloat(targetPrice),
        notify_method: "Email",
        platform: product.platform || "Amazon",
        current_price: product.current_price,
        store_url: product.store_url || ""
      });

      trackEvent('alert_registered', `/product/${product.id}`, { product: product.name, target: targetPrice });
      setAlertSuccess(true);
      setTimeout(() => setAlertSuccess(false), 4000);
    } catch (err) {
      console.error("Alert failed", err);
      alert(err.response?.data?.detail || "Failed to register alert in database.");
    } finally {
      setAlertLoading(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!product) return <div className="p-8 text-center text-gray-400">Product not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Search</span>
        </button>
      </div>

      {/* Product Hero Banner */}
      <div className="pro-card p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-32 h-32 bg-white rounded-xl p-3 shrink-0 flex items-center justify-center">
            <img src={product.image_url} alt={product.name} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {product.platform} • {product.category}
              </span>
              <span className="text-xs font-mono text-gray-400">
                ⭐ {product.rating} ({product.review_count} verified reviews)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white">{product.name}</h1>
          </div>
        </div>

        <div className="text-left md:text-right flex flex-col md:items-end gap-3 w-full md:w-auto">
          <div>
            <div className="text-gray-400 text-xs font-mono">Current Live Market Price</div>
            <div className="text-3xl font-bold font-mono text-white">₹{product.current_price.toLocaleString()}</div>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button 
              onClick={() => navigate(`/compare?q=${encodeURIComponent(product.name)}`)}
              className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-sky-400" />
              <span>Compare 4 Platforms</span>
            </button>
            {product.store_url && (
              <a 
                href={product.store_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackEvent('outbound_store_click', `/product/${product.id}`, { platform: product.platform })}
                className="btn-primary btn-shimmer px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buy on {product.platform}</span>
                <ExternalLink className="w-3 h-3 opacity-80 ml-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Forecast Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="pro-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-semibold">
            <Clock className="h-4 w-4" />
            <span>OPTIMAL BUY WINDOW</span>
          </div>
          <div className="text-2xl font-bold font-display text-white">In 15 Days</div>
          <p className="text-gray-400 text-xs">Expected markdown: {product.best_buy_date}</p>
          <div className="mt-2 text-[11px] font-mono text-emerald-400">
            Statistical Confidence: <strong className="text-white">{product.confidence_score}%</strong>
          </div>
        </div>

        <div className="pro-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-semibold">
            <TrendingDown className="h-4 w-4" />
            <span>PROJECTED LOW</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ₹{product.forecasts?.[1]?.predicted_low.toLocaleString() || product.current_price.toLocaleString()}
          </div>
          <p className="text-gray-400 text-xs">
            Estimated Savings: ₹{product.forecasts?.[1]?.savings.toLocaleString() || '1,800'} ({product.savings_percentage}%)
          </p>
          <div className="mt-2 text-[11px] font-mono text-gray-400">
            Model: Time-Series Prophet Horizon
          </div>
        </div>

        <div className="pro-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>ALGORITHM VERDICT</span>
          </div>
          <div className="text-2xl font-bold font-display text-amber-300">
            {product.verdict || 'WAIT FOR DROP'}
          </div>
          <p className="text-gray-400 text-xs">Forecast models predict a lower entry point within 30 days.</p>
        </div>
      </div>

      {/* Interactive Forecast Chart */}
      <div className="pro-card p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold font-display text-white">Historical Price & 30-Day Forecast Band</h2>
          <span className="text-xs font-mono text-gray-400">Daily Updates</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={product.chart_data}>
              <defs>
                <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" domain={['auto', 'auto']} tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} 
                formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Price']}
              />
              <Area type="monotone" dataKey="historical" stroke="#f8fafc" strokeWidth={2} fillOpacity={0} name="Historical Price" />
              <Area type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" fill="url(#predictedGrad)" name="Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Target Price Alert Box */}
      <div className="pro-card p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>Register Target Price Alert</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              We monitor daily marketplace quotes. You will be notified the instant the price drops to your target.
            </p>
          </div>
        </div>

        <form onSubmit={handleSetAlert} className="flex flex-col sm:flex-row gap-3 items-center pt-2">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-3 text-gray-400 text-sm font-mono">₹</span>
            <input 
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none transition"
              placeholder="Enter target price"
              min="1"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={alertLoading}
            className="w-full sm:w-auto btn-primary btn-shimmer px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {alertLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
            <span>Set Target Alert</span>
          </button>
          {alertSuccess && (
            <span className="text-emerald-400 text-xs flex items-center gap-1 font-medium animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" /> Alert registered in your watchlist!
            </span>
          )}
        </form>
      </div>
    </div>
  );
}