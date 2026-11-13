import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Shield, Clock, HelpCircle, Loader2 } from 'lucide-react';
import usePageSEO from '../hooks/usePageSEO';
import api from '../services/api';
import { trackEvent } from '../services/analytics';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ContactPage() {
  usePageSEO({
    title: 'Contact Support & Inquiries | PriceSpy Pro',
    description: 'Get in touch with PriceSpy technical support, report pricing anomalies, or inquire about enterprise pricing intelligence APIs.',
    canonicalUrl: 'https://pricespy.com/contact',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Support',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/api/contact', formData);
      setSuccess(true);
      trackEvent('contact_form_submitted', '/contact', { subject: formData.subject });
      setFormData({
        name: '',
        email: '',
        subject: 'General Support',
        message: '',
      });
    } catch (err) {
      console.error('Contact submission error', err);
      // Fallback optimistic notice if backend contact endpoint is in transition
      setError(err.response?.data?.detail || 'Failed to dispatch message. Please email support@pricespy.com directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Contact Us' }]} />

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-rose-400 text-xs font-mono">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Support &amp; Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Get in Touch with PriceSpy
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-light">
          Have questions regarding Bayesian price forecasts, alert delivery, or platform integrations? Our engineering team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Support Highlights Sidebar */}
        <div className="space-y-4">
          <div className="pro-card p-6 rounded-2xl space-y-4">
            <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#A31C1B]" />
              <span>Direct Support</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Email our support desk directly for urgent price mismatch corrections or enterprise API licensing:
            </p>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] font-mono text-xs text-rose-300">
              support@pricespy.com
            </div>
          </div>

          <div className="pro-card p-6 rounded-2xl space-y-3 text-xs text-gray-400">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>SLA Response Times</span>
            </div>
            <p>Support inquiries are reviewed by our operations desk within 4 business hours.</p>

            <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2 text-white font-semibold">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>Data Protection</span>
            </div>
            <p>Your correspondence is stored securely under GDPR standards and never shared with third parties.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 pro-card p-6 sm:p-8 rounded-2xl border-white/10">
          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">Message Dispatched!</h3>
              <p className="text-gray-400 text-xs max-w-md mx-auto">
                Thank you for contacting us. A confirmation ticket has been dispatched to your email address, and our support engineers will review your request shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="btn-primary px-6 py-2 rounded-xl text-xs font-mono font-semibold text-neutral-950 mt-4 cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-mono text-gray-300">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Satwik Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-[#A31C1B] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-mono text-gray-300">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-[#A31C1B] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-mono text-gray-300">
                  Topic Category
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#A31C1B] transition-colors"
                >
                  <option value="General Support">General Platform Inquiries</option>
                  <option value="Price Discrepancy">Report Pricing or Scrape Anomaly</option>
                  <option value="Feature Request">Prophet ML or Forecasting Suggestion</option>
                  <option value="API Integration">Enterprise API &amp; Webhooks</option>
                  <option value="Privacy / GDPR">Privacy &amp; Data Rights Request</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-mono text-gray-300">
                  Message Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide details regarding the product URL, alert issue, or question..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-xs font-sans focus:outline-none focus:border-[#A31C1B] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl font-mono text-xs font-semibold text-neutral-950 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
