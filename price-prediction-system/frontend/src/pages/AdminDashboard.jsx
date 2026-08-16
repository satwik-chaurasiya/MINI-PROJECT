import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Server, RefreshCw, AlertTriangle, CheckCircle, Database } from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/admin/metrics')
      .then(res => setMetrics(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!metrics) return <div className="p-8 text-center text-gray-400">Loading Admin Telemetry...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">System Administration</h1>
        <p className="text-gray-400 text-sm">Real-time health telemetry, scraper status, and model accuracy logs.</p>
      </div>

      {/* Metric Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark">
          <div className="flex justify-between items-center text-gray-400 text-xs font-semibold">
            <span>TOTAL PRODUCTS</span>
            <Database className="h-4 w-4 text-electricBlue" />
          </div>
          <div className="text-2xl font-bold font-mono mt-2">{metrics.total_products.toLocaleString()}</div>
          <span className="text-xs text-dropGreen">Active tracking</span>
        </div>

        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark">
          <div className="flex justify-between items-center text-gray-400 text-xs font-semibold">
            <span>SCRAPER SUCCESS</span>
            <Server className="h-4 w-4 text-dropGreen" />
          </div>
          <div className="text-2xl font-bold font-mono mt-2">{metrics.scrape_success_rate}%</div>
          <span className="text-xs text-dropGreen">Last 24 hours</span>
        </div>

        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark">
          <div className="flex justify-between items-center text-gray-400 text-xs font-semibold">
            <span>MODEL ACCURACY</span>
            <Activity className="h-4 w-4 text-electricBlue" />
          </div>
          <div className="text-2xl font-bold font-mono mt-2">MAPE: {metrics.model_accuracy.mape}</div>
          <span className="text-xs text-gray-400">MAE: {metrics.model_accuracy.mae} • RMSE: {metrics.model_accuracy.rmse}</span>
        </div>

        <div className="bg-cardDark p-5 rounded-2xl border border-surfaceDark">
          <div className="flex justify-between items-center text-gray-400 text-xs font-semibold">
            <span>SYSTEM UPTIME</span>
            <CheckCircle className="h-4 w-4 text-dropGreen" />
          </div>
          <div className="text-2xl font-bold font-mono mt-2">{metrics.system_uptime}</div>
          <span className="text-xs text-dropGreen">Operational</span>
        </div>
      </div>

      {/* Scraper & Model Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scraper Health */}
        <div className="bg-cardDark p-6 rounded-2xl border border-surfaceDark space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Server className="h-5 w-5 text-electricBlue" /> Scraper Engine Status
          </h2>
          <div className="divide-y divide-surfaceDark">
            {metrics.scrapers.map((sc, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{sc.platform}</div>
                  <div className="text-xs text-gray-400">Last harvest: {sc.last_run}</div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-mono bg-surfaceDark ${
                  sc.status === 'OK' ? 'text-dropGreen' : sc.status === 'Slow' ? 'text-waitAmber' : 'text-red-400'
                }`}>
                  ● {sc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Model Performance */}
        <div className="bg-cardDark p-6 rounded-2xl border border-surfaceDark space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-dropGreen" /> Model Registry & Evaluation
            </h2>
            <button className="text-xs text-electricBlue flex items-center gap-1 hover:underline">
              <RefreshCw className="h-3.5 w-3.5" /> Retrain All
            </button>
          </div>
          <div className="divide-y divide-surfaceDark">
            {metrics.models.map((m, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{m.name} <span className="text-xs text-gray-400 font-normal">({m.version})</span></div>
                  <div className="text-xs text-gray-400">Evaluation Accuracy: <span className="text-dropGreen font-semibold">{m.accuracy}</span></div>
                </div>
                <button className="bg-surfaceDark hover:bg-cardDark px-3 py-1.5 rounded-lg text-xs font-medium border border-surfaceDark">
                  Logs
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}