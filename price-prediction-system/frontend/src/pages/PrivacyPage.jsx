import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-200">
      <div className="space-y-2 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>GDPR & CCPA Compliant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Privacy Policy</h1>
        <p className="text-xs text-gray-400 font-mono">Effective Date: October 2026 • Version 2.4</p>
      </div>

      <div className="pro-card rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" /> 1. Data Collection & Isolation
          </h2>
          <p className="text-xs text-gray-400">
            PriceSpy collects minimal information needed to provide predictive price tracking services: your email address for authentication and price drop notifications, and the specific items in your tracked watchlist. All user alerts are subject to strict row-level isolation and are not shared across accounts or sold to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-sky-400" /> 2. E-Commerce Marketplace Scraping
          </h2>
          <p className="text-xs text-gray-400">
            Our background scraping engine extracts publicly available price and availability data from retail platforms including Amazon India, Flipkart, Walmart, and eBay. We do not access, store, or scrape any personal consumer payment information, checkout credentials, or confidential retailer accounts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" /> 3. Data Deletion & Right to be Forgotten
          </h2>
          <p className="text-xs text-gray-400">
            You maintain full sovereignty over your account data. At any time, you can permanently delete your user profile and all associated watchlist subscriptions using the "Delete Account" button located in your dashboard settings. Upon deletion, all records are permanently excised from our database.
          </p>
        </section>
      </div>
    </div>
  );
}
