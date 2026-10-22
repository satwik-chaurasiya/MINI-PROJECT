import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
    // Send error report to backend error tracking endpoint
    try {
      const p = api.post('/api/errors/log', {
        error_message: error.message || 'Client UI Crash',
        stack_trace: errorInfo.componentStack || error.stack,
        path: window.location.pathname
      });
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    } catch (_) {}
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="pro-card rounded-2xl p-8 max-w-md w-full text-center space-y-4 border-red-500/20">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-display text-white">Something went wrong</h2>
            <p className="text-xs text-gray-400">
              An unexpected interface error was encountered. Our monitoring system has captured the details for resolution.
            </p>
            <button
              onClick={this.handleReload}
              className="btn-primary btn-shimmer px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
