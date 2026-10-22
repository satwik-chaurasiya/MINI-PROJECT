import React, { useState } from 'react';
import { Sparkles, TrendingDown, Scale, Bell, ArrowRight, Check } from 'lucide-react';
import api from '../services/api';

export default function OnboardingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  if (!isOpen) return null;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      try {
        await api.post('/api/auth/onboarding-complete');
      } catch (err) {
        // silent fallback
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="pro-card rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative border-emerald-500/30 shadow-2xl">
        {/* Step indicator */}
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Quick Tour
          </span>
          <span>Step {step} of {totalSteps}</span>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-150">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <TrendingDown className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">AI Price Forecasting</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              PriceSpy tracks 365-day historical volatility, retail holiday calendars, and trend patterns to forecast upcoming price drops before you buy.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-150">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mx-auto flex items-center justify-center">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Cross-Platform Comparison</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Compare genuine prices across Amazon India, Flipkart, Walmart, and eBay. Always check verified listings side-by-side to find the lowest market offer.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-150">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Automated Drop Alerts</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Set your target budget on any product. Our background scanner continuously monitors marketplace updates and notifies you the moment price falls.
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-400 h-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Skip Tour
          </button>
          <button
            onClick={handleNext}
            className="btn-primary btn-shimmer px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>{step === totalSteps ? 'Get Started' : 'Next'}</span>
            {step === totalSteps ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
