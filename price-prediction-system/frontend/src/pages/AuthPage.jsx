import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const endpoint = isLogin 
      ? 'http://127.0.0.1:8000/api/auth/login' 
      : 'http://127.0.0.1:8000/api/auth/register';

    try {
      const res = await axios.post(endpoint, { email, password });
      localStorage.setItem('pricespy_token', res.data.access_token);
      localStorage.setItem('pricespy_user', res.data.user.email);
      if (onLoginSuccess) onLoginSuccess(res.data.user.email);

      setSuccessMsg(isLogin ? 'Logged in successfully!' : 'Account registered successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="text-center mb-6 relative">
        <h2 className="text-2xl font-bold font-display text-gradient-cyan">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
        <p className="text-gray-400 text-xs mt-1">
          {isLogin ? 'Access your tracked watchlists and alert notifications' : 'Join PriceSpy to predict lowest market prices'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-green-950/40 border border-dropGreen/40 rounded-xl text-dropGreen text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surfaceDark/60 border border-white/10 focus:border-electricBlue rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition"
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surfaceDark/60 border border-white/10 focus:border-electricBlue rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition shadow-lg shadow-sky-500/20 active:scale-95"
        >
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center border-t border-white/10 pt-4">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setSuccessMsg('');
          }}
          className="text-xs text-electricBlue hover:underline"
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );
}