import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, TrendingDown, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/search')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
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
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product name (e.g., iPhone 15)..."
              className="w-full bg-cardDark border border-surfaceDark rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-electricBlue"
            />
          </div>
          <button type="submit" className="bg-electricBlue hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold text-sm transition">
            Search
          </button>
        </form>
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
              className="bg-cardDark p-5 rounded-2xl border border-surfaceDark hover:border-electricBlue cursor-pointer transition flex flex-col justify-between"
            >
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