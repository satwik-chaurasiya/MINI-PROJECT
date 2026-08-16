import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Bell, Clock, TrendingDown, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/products/${id || 'prod_1'}`)
      .then(res => {
        setProduct(res.data);
        if (res.data.forecasts?.[1]) {
          setTargetPrice(res.data.forecasts[1].predicted_low);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleSetAlert = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/alerts', {
      user_email: "user@example.com",
      product_id: product.id,
      target_price: parseFloat(targetPrice),
      notify_method: "Email"
    }).then(() => {
      setAlertSuccess(true);
      setTimeout(() => setAlertSuccess(false), 4000);
    });
  };

  if (!product) return <div className="p-8 text-center text-gray-400">Loading Product Forecasts...</div>;

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className="bg-cardDark p-6 rounded-2xl border border-surfaceDark flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-surfaceDark text-electricBlue rounded-md uppercase tracking-wider">
            {product.platform} • {product.category}
          </span>
          <h1 className="text-2xl font-bold mt-2">{product.name}</h1>
          <p className="text-gray-400 text-sm mt-1">⭐ {product.rating} ({product.review_count} ratings)</p>
        </div>
        <div className="text-right">
          <div className="text-gray-400 text-xs">Current Price</div>
          <div className="text-3xl font-bold font-mono text-white">₹{product.current_price.toLocaleString()}</div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark">
          <div className="flex items-center space-x-2 text-electricBlue text-sm font-semibold">
            <Clock className="h-4 w-4" />
            <span>BEST TIME TO BUY</span>
          </div>
          <div className="text-2xl font-bold mt-2">In 15 Days</div>
          <p className="text-gray-400 text-sm mt-1">Expected date: {product.best_buy_date}</p>
          <div className="mt-3 text-xs bg-surfaceDark px-2 py-1 rounded inline-block text-gray-300">
            Confidence: <span className="text-dropGreen font-bold">{product.confidence_score}%</span>
          </div>
        </div>

        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark">
          <div className="flex items-center space-x-2 text-dropGreen text-sm font-semibold">
            <TrendingDown className="h-4 w-4" />
            <span>PREDICTED LOWEST</span>
          </div>
          <div className="text-2xl font-bold mt-2 font-mono text-dropGreen">
            ₹{product.forecasts[1].predicted_low.toLocaleString()}
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Save ₹{product.forecasts[1].savings.toLocaleString()} ({product.savings_percentage}%)
          </p>
          <div className="mt-3 text-xs bg-surfaceDark px-2 py-1 rounded inline-block text-gray-300">
            Model: Prophet + LSTM Ensemble
          </div>
        </div>

        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark">
          <div className="flex items-center space-x-2 text-waitAmber text-sm font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>BUY VERDICT</span>
          </div>
          <div className="text-2xl font-bold mt-2 text-waitAmber">⏳ {product.verdict}</div>
          <p className="text-gray-400 text-sm mt-1">Price likely to drop 10% in the next 15 days.</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-cardDark p-6 rounded-2xl border border-surfaceDark">
        <h2 className="text-lg font-bold mb-4">Price History & Future Forecast Band</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={product.chart_data}>
              <defs>
                <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2979FF" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2979FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis dataKey="date" stroke="#8B949E" />
              <YAxis stroke="#8B949E" domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="historical" stroke="#FFFFFF" strokeWidth={2} fillOpacity={0} />
              <Area type="monotone" dataKey="predicted" stroke="#2979FF" strokeWidth={2} strokeDasharray="5 5" fill="url(#predictedGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert Registration */}
      <div className="bg-cardDark p-6 rounded-2xl border border-surfaceDark">
        <h2 className="text-lg font-bold mb-2">🔔 Set Target Price Alert</h2>
        <form onSubmit={handleSetAlert} className="flex flex-col sm:flex-row gap-4 items-center mt-4">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
            <input 
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full bg-surfaceDark border border-surfaceDark focus:border-electricBlue rounded-xl pl-8 pr-4 py-2 text-white font-mono text-sm focus:outline-none"
              placeholder="Enter target price"
              required
            />
          </div>
          <button type="submit" className="w-full sm:w-auto bg-electricBlue hover:bg-blue-600 px-6 py-2.5 rounded-xl font-semibold text-sm transition">
            Set Alert Now
          </button>
          {alertSuccess && (
            <span className="text-dropGreen text-sm flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Alert registered successfully!
            </span>
          )}
        </form>
      </div>
    </div>
  );
}