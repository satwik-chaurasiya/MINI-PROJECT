import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-emerald-400 shadow-2xl">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-widest">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-400 font-light leading-relaxed">
          The deal or platform route you are looking for has expired, moved, or never existed in the index.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="btn-primary btn-shimmer px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/compare"
          className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-sky-400" />
          <span>Compare Products</span>
        </Link>
      </div>
    </div>
  );
}
