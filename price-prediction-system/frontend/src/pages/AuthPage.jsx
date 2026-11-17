import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Lock, Mail, User, Globe, MapPin, Phone, CheckCircle2, 
  AlertCircle, ArrowRight, Loader2, KeyRound, ShieldCheck, 
  Eye, EyeOff, RefreshCw, Smartphone, Clock, AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import { trackEvent } from '../services/analytics';
import usePageSEO from '../hooks/usePageSEO';
import PriceSpyLogo from '../components/PriceSpyLogo';

export default function AuthPage({ onLoginSuccess }) {
  // Modes: 'login' | 'register' | 'verify_otp' | 'forgot' | 'reset_otp'
  const [mode, setMode] = useState('login');

  usePageSEO({
    title: mode === 'login' ? 'Sign In | PriceSpy Pro' : 
           mode === 'register' ? 'Create Account | PriceSpy Pro' : 
           mode === 'verify_otp' ? 'Dual OTP Verification | PriceSpy Pro' : 
           'Account Recovery | PriceSpy Pro',
    description: 'Secure authentication gateway for PriceSpy price tracking, custom alerts, and historical volatility forecasts.',
    canonicalUrl: 'https://pricespy.com/auth',
    noIndex: true,
  });

  // Basic info states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India');
  const [stateName, setStateName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // OTP & Reset states
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [otpDispatch, setOtpDispatch] = useState(null);

  // 5-Minute OTP Timer States (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active 5-minute countdown timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  const startTimer = (seconds = 300) => {
    setTimeLeft(seconds);
    setTimerActive(true);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpExpired = (mode === 'verify_otp' || mode === 'reset_otp') && timeLeft === 0;

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    const urlEmail = searchParams.get('email');
    if (urlMode) setMode(urlMode);
    if (urlEmail) setEmail(urlEmail);
  }, [searchParams]);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  // -------------------------------------------------------------
  // 1. Login Handler
  // -------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('pricespy_token', res.data.access_token);
      localStorage.setItem('pricespy_user', res.data.user.email);
      trackEvent('login_success', '/auth', { email: res.data.user.email });

      if (onLoginSuccess) {
        onLoginSuccess(res.data.user.email, res.data.user);
      }
      setSuccessMsg('Signed in successfully! Unlocking platform...');
      setTimeout(() => navigate('/'), 600);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 2. Register Handler (Generates Hashed 6-Digit OTPs)
  // -------------------------------------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!country.trim()) {
      setError('Please enter your country.');
      return;
    }
    if (!stateName.trim()) {
      setError('Please enter your state / province.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 7) {
      setError('Please enter a valid phone number (at least 7 digits).');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Password and Password Confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', {
        name,
        email,
        country,
        state: stateName,
        phone_number: phoneNumber,
        password,
        password_confirmation: passwordConfirmation
      });

      if (res.data.requires_otp && res.data.otp_dispatch) {
        setOtpDispatch(res.data.otp_dispatch);
        setMode('verify_otp');
        startTimer(res.data.otp_dispatch.expires_in_seconds || 300);
        setSuccessMsg(res.data.message || 'OTPs generated! You have 5 minutes to complete verification before expiry.');
      } else {
        setSuccessMsg('Account created successfully!');
        setMode('login');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 3. Manual 6-Digit Dual OTP Verification
  // -------------------------------------------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isOtpExpired) {
      setError('The 5-minute timer has expired! The previously sent OTPs are no longer valid. Please click "Resend New OTPs" to request fresh codes.');
      return;
    }

    if (!emailOtp.trim() || emailOtp.trim().length !== 6) {
      setError('Please enter the complete 6-digit Email OTP.');
      return;
    }
    if (!phoneOtp.trim() || phoneOtp.trim().length !== 6) {
      setError('Please enter the complete 6-digit Phone OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/verify-otp', {
        email,
        email_otp: emailOtp.trim(),
        phone_otp: phoneOtp.trim()
      });

      localStorage.setItem('pricespy_token', res.data.access_token);
      localStorage.setItem('pricespy_user', res.data.user.email);
      trackEvent('otp_verified_success', '/auth', { email: res.data.user.email });

      if (onLoginSuccess) {
        onLoginSuccess(res.data.user.email, res.data.user);
      }
      setSuccessMsg('Both OTPs verified successfully! Your account is active.');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setError(err.response?.data?.detail || 'OTP verification failed. Please check the entered digits or request a fresh OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTPs (Restarts 5-minute timer)
  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/resend-otp', { email, otp_type: 'all' });
      if (res.data.otp_dispatch) {
        setOtpDispatch(res.data.otp_dispatch);
        startTimer(res.data.otp_dispatch.expires_in_seconds || 300);
      }
      setEmailOtp('');
      setPhoneOtp('');
      setSuccessMsg('Fresh 6-digit OTP codes have been dispatched! 5-minute timer restarted.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend OTPs.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 4. Forgot Password (Request 6-Digit OTP)
  // -------------------------------------------------------------
  const handleRequestPasswordOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password-otp', { email });
      if (res.data.otp_dispatch) {
        setOtpDispatch(res.data.otp_dispatch);
        setMode('reset_otp');
        startTimer(res.data.otp_dispatch.expires_in_seconds || 300);
        setResetOtp('');
        setSuccessMsg(res.data.message || '6-digit Reset OTP generated! Valid for 5 minutes.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to request password reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 5. Reset Password with 6-Digit OTP
  // -------------------------------------------------------------
  const handleResetPasswordWithOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isOtpExpired) {
      setError('The 5-minute timer has expired! This Reset OTP is no longer valid. Please request a new Reset OTP code below.');
      return;
    }

    if (!resetOtp.trim() || resetOtp.trim().length !== 6) {
      setError('Please enter the valid 6-digit Reset OTP.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== newPasswordConfirmation) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/reset-password-otp', {
        email,
        otp: resetOtp.trim(),
        new_password: newPassword,
        password_confirmation: newPasswordConfirmation
      });

      setSuccessMsg(res.data.message || 'Password reset successfully! Please log in.');
      setTimeout(() => {
        setMode('login');
        setPassword('');
        setPasswordConfirmation('');
        setResetOtp('');
        setOtpDispatch(null);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Password reset failed. Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 sm:my-12 px-4 animate-in fade-in duration-300">
      <div className="pro-card p-6 sm:p-9 rounded-3xl shadow-2xl relative border border-white/10 backdrop-blur-xl bg-neutral-900/90">
        
        {/* Header with PriceSpy Logo */}
        <div className="text-center mb-6 space-y-1.5">
          <div className="flex justify-center mb-3">
            <PriceSpyLogo size={52} animated={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            {mode === 'login' && 'Sign In to PriceSpy Pro'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'verify_otp' && 'Verify 6-Digit Security OTPs'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'reset_otp' && 'Set New Password with OTP'}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-light max-w-md mx-auto">
            {mode === 'login' && 'Unlock AI-powered Bayesian price forecasting & real-time multi-store price intelligence.'}
            {mode === 'register' && 'Join PriceSpy Pro. All user accounts require manual 6-digit OTP verification.'}
            {mode === 'verify_otp' && 'Enter the 6-digit codes generated for your Email and Phone number below.'}
            {mode === 'forgot' && 'Enter your registered email address to receive your 6-digit password reset OTP.'}
            {mode === 'reset_otp' && 'Type the 6-digit Reset OTP shown below and choose a new secure password.'}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/70 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECURE OTP DISPATCH TERMINAL (Shown only to the user)     */}
        {/* ========================================================= */}
        {otpDispatch && (mode === 'verify_otp' || mode === 'reset_otp') && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#A31C1B]/20 to-neutral-950 border border-[#A31C1B]/40 space-y-3 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-rose-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Security Dispatch Terminal (Hashed &amp; Salted in DB)</span>
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border transition ${
                timeLeft > 60
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                  : timeLeft > 0
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-400 animate-pulse'
                  : 'bg-rose-950 border-rose-500 text-rose-300'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft > 0 ? `Expires: ${formatTimer(timeLeft)}` : 'OTP Expired (5m)'}</span>
              </div>
            </div>

            {isOtpExpired ? (
              <div className="p-3.5 bg-rose-950/90 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <p className="font-bold text-rose-300">5-Minute Timer Ran Out</p>
                    <p className="text-[11px] text-gray-300">This OTP is no longer valid. You must re-request for a fresh OTP.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={mode === 'verify_otp' ? handleResendOtp : handleRequestPasswordOtp}
                  disabled={loading}
                  className="shrink-0 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-request OTP</span>
                </button>
              </div>
            ) : (
              <>
                <p className="text-[11px] text-gray-300">
                  These codes are hashed using SHA-256 + cryptographic salt in the database. Valid for exactly 5 minutes. Enter them manually in the fields below.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {otpDispatch.email_otp && (
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1 mb-1">
                        <Mail className="w-3 h-3 text-sky-400" />
                        <span>Email OTP (Valid 5 mins)</span>
                      </div>
                      <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-sky-300">
                        {otpDispatch.email_otp}
                      </div>
                    </div>
                  )}

                  {otpDispatch.phone_otp && (
                    <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1 mb-1">
                        <Smartphone className="w-3 h-3 text-emerald-400" />
                        <span>Phone OTP (Valid 5 mins)</span>
                      </div>
                      <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-emerald-300">
                        {otpDispatch.phone_otp}
                      </div>
                    </div>
                  )}

                  {otpDispatch.reset_otp && (
                    <div className="sm:col-span-2 bg-black/50 border border-rose-500/30 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1 mb-1">
                        <KeyRound className="w-3 h-3 text-rose-400" />
                        <span>Password Reset 6-Digit OTP (Valid 5 mins)</span>
                      </div>
                      <div className="font-mono text-2xl sm:text-3xl font-bold tracking-widest text-rose-300">
                        {otpDispatch.reset_otp}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE: LOGIN                                               */}
        {/* ========================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#A31C1B] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-300">Password</label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                  className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#A31C1B] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl text-xs font-bold text-neutral-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-900/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In &amp; Access Dashboard</span>}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-3 text-center text-xs text-gray-400 border-t border-white/5">
              <span>Don't have an account yet? </span>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
                className="text-rose-400 hover:underline font-semibold cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* MODE: REGISTER (Takes Basic Info: Name, Email, Country,   */}
        {/* State, Phone, Password & Confirmation)                    */}
        {/* ========================================================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#A31C1B] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition"
                  placeholder="e.g. Satwik Chaurasiya"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#A31C1B] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition"
                  placeholder="name@domain.com"
                  required
                />
              </div>
            </div>

            {/* Country and State Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#A31C1B] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition"
                    placeholder="e.g. India"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">State / Province</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#A31C1B] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition"
                    placeholder="e.g. Maharashtra"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#A31C1B] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>

            {/* Password and Password Confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#A31C1B] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition"
                    placeholder="Min 8 chars"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className={`w-full bg-white/[0.04] border rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition ${
                      passwordConfirmation && password !== passwordConfirmation 
                        ? 'border-rose-500 focus:border-rose-400' 
                        : 'border-white/10 focus:border-[#A31C1B]'
                    }`}
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password matching feedback */}
            {password && passwordConfirmation && password !== passwordConfirmation && (
              <p className="text-[11px] text-rose-400">Passwords do not match.</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl text-xs font-bold text-neutral-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-900/20 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Register &amp; Generate Hashed OTPs</span>}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-gray-400">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                className="text-rose-400 hover:underline font-semibold cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* MODE: VERIFY_OTP (Manual Entry for Email & Phone OTPs)    */}
        {/* ========================================================= */}
        {mode === 'verify_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-neutral-950/70 border border-white/10 rounded-xl text-xs text-gray-300 flex items-center justify-between">
              <span>Verifying account: <strong className="text-white">{email}</strong></span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-rose-400 hover:underline text-[11px]"
              >
                Change details
              </button>
            </div>

            {/* Email OTP Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Enter 6-Digit Email Verification OTP</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/[0.04] border border-white/10 focus:border-sky-400 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-[0.5em] text-white focus:outline-none transition"
                placeholder="------"
                required
              />
              <span className="text-[10px] text-gray-500">Must match the 6-digit code shown in the security box above.</span>
            </div>

            {/* Phone OTP Field */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enter 6-Digit Phone SMS OTP</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/[0.04] border border-white/10 focus:border-emerald-400 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-[0.5em] text-white focus:outline-none transition"
                placeholder="------"
                required
              />
              <span className="text-[10px] text-gray-500">Must match the 6-digit code shown in the security box above.</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 px-1 bg-black/30 rounded-lg border border-white/5">
              <span className="text-gray-400 text-[11px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span>Security Window:</span>
              </span>
              <span className={`font-mono text-xs font-bold ${
                timeLeft > 60 ? 'text-emerald-400' : timeLeft > 0 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {timeLeft > 0 ? `${formatTimer(timeLeft)} remaining` : 'Expired — Re-request required'}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || isOtpExpired}
              className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition ${
                isOtpExpired
                  ? 'bg-neutral-800 text-gray-400 cursor-not-allowed border border-white/10'
                  : 'btn-primary text-neutral-950 shadow-emerald-900/20'
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                isOtpExpired ? <span>OTP Expired — Re-request Code Below</span> : <span>Verify Codes &amp; Unlock Application</span>
              )}
              <CheckCircle2 className="w-4 h-4" />
            </button>

            {isOtpExpired && (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-900/30 transition animate-pulse"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Timer Expired — Re-request Fresh 5-Minute OTP</span>
              </button>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-gray-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend New OTPs</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-rose-400 hover:underline font-medium cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* MODE: FORGOT PASSWORD (Request 6-Digit OTP)               */}
        {/* ========================================================= */}
        {mode === 'forgot' && (
          <form onSubmit={handleRequestPasswordOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Your Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#A31C1B] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl text-xs font-bold text-neutral-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-900/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              <span>Generate 6-Digit Reset OTP</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                className="text-xs text-gray-400 hover:text-white hover:underline cursor-pointer"
              >
                Remembered your password? Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* MODE: RESET_OTP (Enter 6-Digit OTP & Set New Password)    */}
        {/* ========================================================= */}
        {mode === 'reset_otp' && (
          <form onSubmit={handleResetPasswordWithOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Registered Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-3.5 py-2 text-xs text-gray-400 font-mono"
              />
            </div>

            {/* 6-Digit OTP */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Enter 6-Digit Reset OTP</label>
              <input
                type="text"
                maxLength={6}
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/[0.04] border border-white/10 focus:border-rose-400 rounded-xl px-4 py-2.5 text-center text-xl font-mono tracking-[0.5em] text-white focus:outline-none transition"
                placeholder="------"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">New Password (Min 8 characters)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#A31C1B] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPasswordConfirmation}
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  className={`w-full bg-white/[0.04] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition ${
                    newPasswordConfirmation && newPassword !== newPasswordConfirmation
                      ? 'border-rose-500'
                      : 'border-white/10 focus:border-[#A31C1B]'
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-1 px-1 bg-black/30 rounded-lg border border-white/5">
              <span className="text-gray-400 text-[11px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span>Reset Security Window:</span>
              </span>
              <span className={`font-mono text-xs font-bold ${
                timeLeft > 60 ? 'text-emerald-400' : timeLeft > 0 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {timeLeft > 0 ? `${formatTimer(timeLeft)} remaining` : 'Expired — Re-request required'}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || isOtpExpired}
              className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition ${
                isOtpExpired
                  ? 'bg-neutral-800 text-gray-400 cursor-not-allowed border border-white/10'
                  : 'btn-primary text-neutral-950 shadow-rose-900/20'
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                isOtpExpired ? <span>Reset OTP Expired — Re-request Below</span> : <span>Verify OTP &amp; Update Password</span>
              )}
              <CheckCircle2 className="w-4 h-4" />
            </button>

            {isOtpExpired && (
              <button
                type="button"
                onClick={handleRequestPasswordOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-900/30 transition animate-pulse"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Timer Expired — Re-request Fresh Reset OTP</span>
              </button>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-gray-400 hover:text-white hover:underline cursor-pointer"
              >
                Cancel and return to Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
