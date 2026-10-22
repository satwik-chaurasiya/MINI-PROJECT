import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function DeleteAccountModal({ isOpen, onClose, onDeleted }) {
  const [confirmInput, setConfirmInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDelete = async (e) => {
    e.preventDefault();
    if (confirmInput.trim().toUpperCase() !== 'DELETE') {
      setError('Please type DELETE in capital letters to confirm.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.delete('/api/auth/me');
      localStorage.removeItem('pricespy_token');
      localStorage.removeItem('pricespy_user');
      onDeleted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="pro-card rounded-2xl max-w-md w-full p-6 space-y-5 relative border-red-500/30 shadow-2xl">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2.5 text-red-400">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">Delete Account</h3>
              <p className="text-xs text-red-400 font-medium">Irreversible action</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          This will permanently delete your user profile, all active price drop alert subscriptions, and custom watchlist entries. This cannot be undone.
        </p>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Type <strong className="text-white font-mono">DELETE</strong> to confirm:
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-white/[0.04] border border-white/10 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none transition"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 btn-secondary py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || confirmInput.trim().toUpperCase() !== 'DELETE'}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-xs transition disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span>Delete Permanently</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
