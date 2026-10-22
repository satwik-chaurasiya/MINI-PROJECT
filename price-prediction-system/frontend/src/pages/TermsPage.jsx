import React from 'react';
import { Scale, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-200">
      <div className="space-y-2 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono">
          <Scale className="w-3.5 h-3.5" />
          <span>Fair Use & Service Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Terms of Service</h1>
        <p className="text-xs text-gray-400 font-mono">Last Updated: October 2026</p>
      </div>

      <div className="pro-card rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> 1. Nature of Price Predictions
          </h2>
          <p className="text-xs text-gray-400">
            Price forecasts provided by PriceSpy are statistical time-series projections generated using machine learning models trained on historical pricing, seasonality, and promotional trends. While highly accurate, forecasts do not represent contractual commitments or guarantees of future retailer pricing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400" /> 2. Third-Party E-Commerce Marketplaces
          </h2>
          <p className="text-xs text-gray-400">
            PriceSpy links directly to third-party marketplaces including Amazon, Flipkart, Walmart, and eBay. All purchases, warranties, customer service, and fulfillment are strictly managed between you and the respective retail platform. We encourage users to verify final cart totals before completing transactions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" /> 3. Fair Usage & Rate Limits
          </h2>
          <p className="text-xs text-gray-400">
            To ensure reliable availability for all users, API and search requests are rate-limited. Automated scraping of PriceSpy APIs or attempting to circumvent access throttles is strictly prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}
