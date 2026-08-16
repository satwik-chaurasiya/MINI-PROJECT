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
    <div className="max-w-md mx-auto my-12 bg-cardDark p-8 rounded-2xl border border-surfaceDark shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
        <p className="text-gray-400 text-xs mt-1">
          {isLogin ? 'Access your tracked watchlists and alert notifications' : 'Join PriceSpy to predict lowest market prices'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-800 rounded-xl text-red-400 text-xs flex items-center gap-2">
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surfaceDark border border-surfaceDark focus:border-electricBlue rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none"
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surfaceDark border border-surfaceDark focus:border-electricBlue rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-electricBlue hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm transition"
        >
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center border-t border-surfaceDark pt-4">
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