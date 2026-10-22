import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, CheckCircle2, AlertCircle, ArrowRight, Loader2, KeyRound, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { trackEvent } from '../services/analytics';

export default function AuthPage({ onLoginSuccess }) {
  // Mode: 'login' | 'register' | 'forgot' | 'reset'
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devToken, setDevToken] = useState('');
  const navigate = useNavigate();

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'register' && password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('pricespy_token', res.data.access_token);
        localStorage.setItem('pricespy_user', res.data.user.email);
        trackEvent('login_success', '/auth', { email: res.data.user.email });
        if (onLoginSuccess) onLoginSuccess(res.data.user.email, res.data.user);
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => navigate('/dashboard'), 600);
      } else if (mode === 'register') {
        const res = await api.post('/api/auth/register', { email, password });
        localStorage.setItem('pricespy_token', res.data.access_token);
        localStorage.setItem('pricespy_user', res.data.user.email);
        trackEvent('signup_success', '/auth', { email: res.data.user.email });
        if (res.data.verification_token) {
          setDevToken(res.data.verification_token);
        }
        if (onLoginSuccess) onLoginSuccess(res.data.user.email, res.data.user);
        setSuccessMsg('Account registered! A verification email link has been issued.');
        setTimeout(() => navigate('/dashboard'), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      setSuccessMsg(res.data.message);
      if (res.data.reset_token_dev) {
        setDevToken(res.data.reset_token_dev);
        setResetToken(res.data.reset_token_dev);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/reset-password', {
        reset_token: resetToken,
        new_password: newPassword
      });
      setSuccessMsg(res.data.message);
      setTimeout(() => {
        setMode('login');
        setSuccessMsg('Password updated. Please log in with your new password.');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 pro-card p-8 rounded-3xl shadow-2xl relative border-white/10">
      <div className="text-center mb-6 space-y-1">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
          {mode === 'forgot' || mode === 'reset' ? <KeyRound className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        </div>
        <h2 className="text-2xl font-bold font-display text-white">
          {mode === 'login' && 'Welcome Back'}
          {mode === 'register' && 'Create Your Account'}
          {mode === 'forgot' && 'Reset Password'}
          {mode === 'reset' && 'Set New Password'}
        </h2>
        <p className="text-gray-400 text-xs font-light">
          {mode === 'login' && 'Access real-time price forecasts & multi-store tracking'}
          {mode === 'register' && 'Join PriceSpy to predict and track price drops across 4 platforms'}
          {mode === 'forgot' && 'Enter your email to receive a secure recovery link'}
          {mode === 'reset' && 'Choose a strong password with at least 8 characters'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Simulated Email Verification / Dev Token Banner */}
      {devToken && (
        <div className="mb-4 p-3 bg-sky-950/60 border border-sky-500/30 rounded-xl text-sky-200 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-sky-300">
            <ShieldCheck className="w-4 h-4" />
            <span>Simulated Security Link:</span>
          </div>
          <p className="text-[11px] text-gray-300 font-mono break-all bg-black/40 p-2 rounded">
            Token: {devToken}
          </p>
          {mode === 'forgot' && (
            <button
              onClick={() => { setMode('reset'); setResetToken(devToken); }}
              className="text-xs text-sky-400 hover:underline font-semibold"
            >
              Click here to proceed to Set New Password →
            </button>
          )}
        </div>
      )}

      {/* Login & Register Form */}
      {(mode === 'login' || mode === 'register') && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-gray-400">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                  className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition"
                placeholder={mode === 'register' ? 'Minimum 8 characters' : '••••••••'}
                required
              />
            </div>
            {mode === 'register' && password.length > 0 && (
              <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                <span className={`h-1.5 flex-1 rounded-full ${password.length >= 8 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-gray-400 font-mono text-[10px]">
                  {password.length >= 8 ? 'Strong' : 'Min 8 chars required'}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary btn-shimmer py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
          </button>
        </form>
      )}

      {/* Forgot Password Request Form */}
      {mode === 'forgot' && (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Your Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary btn-shimmer py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            <span>Send Reset Link</span>
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </div>
        </form>
      )}

      {/* Reset Password Form */}
      {mode === 'reset' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Reset Token</label>
            <input
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none transition"
              placeholder="Paste your reset token"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition"
                placeholder="Minimum 8 characters"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary btn-shimmer py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Update Password</span>
          </button>
        </form>
      )}

      <div className="mt-6 text-center border-t border-white/[0.08] pt-4">
        {mode === 'login' ? (
          <p className="text-xs text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
              className="text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        ) : (
          <p className="text-xs text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className="text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  );
}