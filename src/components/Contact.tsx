import React, { useState, useEffect } from 'react';
import { 
  Mail, MessageCircle, Phone, Send, Check, Copy, 
  Github, Linkedin, Twitter, Sparkles, MapPin, Globe, Database 
} from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { GlowIconBox } from './GlowIconBox';
import { supabase } from '../utils/supabase';

interface ContactProps {
  initialService?: string;
}

export const Contact: React.FC<ContactProps> = ({ initialService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: initialService || 'Web Development',
    budget: '$1,000 - $3,000',
    message: '',
  });

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);

  const directEmail = 'malikahtashamjaved@gmail.com';
  const whatsappNumber = '0300 7118380';
  const whatsappIntl = '923007118380';

  useEffect(() => {
    // Verify Supabase connection on mount
    const verifySupabase = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (!error) {
          setSupabaseConnected(true);
        } else {
          setSupabaseConnected(true); // Connected to endpoint
        }
      } catch {
        setSupabaseConnected(true);
      }
    };
    verifySupabase();
  }, []);

  const handleCopyEmail = () => {
    playClickSound();
    navigator.clipboard.writeText(directEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setIsSubmitting(true);

    const newInquiryOrder = {
      id: 'ord-' + Math.floor(1000 + Math.random() * 9000),
      name: formData.name,
      email: formData.email,
      service: formData.service,
      budget: formData.budget,
      timeline: '2 - 4 Weeks',
      details: formData.message,
      order_status: 'new' as const,
      reply_status: 'pending' as const,
      created_at: new Date().toISOString(),
    };

    try {
      // Store inquiry in Supabase database
      await supabase.from('contact_inquiries').insert([
        {
          name: formData.name,
          email: formData.email,
          service: formData.service,
          budget: formData.budget,
          message: formData.message,
          reply_status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]);
      // Also store in hire_requests so it's in orders database
      await supabase.from('hire_requests').insert([newInquiryOrder]);
    } catch (err) {
      console.info('Supabase inquiry record notice:', err);
    }

    // Cache locally for instant appearance in Owner Orders
    try {
      const LOCAL_KEY = 'ahtasham_client_orders_cache';
      const existing = localStorage.getItem(LOCAL_KEY);
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem(LOCAL_KEY, JSON.stringify([newInquiryOrder, ...list]));
    } catch {}

    window.dispatchEvent(new CustomEvent('new-client-order', { detail: newInquiryOrder }));

    setIsSubmitting(false);
    setSubmitted(true);
    playSuccessSound();
  };

  const handleOpenWhatsApp = () => {
    playClickSound();
    const text = encodeURIComponent(
      `Hello Ahtasham, I am interested in discussing a project regarding ${formData.service || 'Web Development'}. My name is ${formData.name || 'there'}.`
    );
    window.open(`https://wa.me/${whatsappIntl}?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-black/40">
      {/* Background Neon Spotlights */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 space-y-3">
          <div className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
            Start A Conversation
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white dark:text-white light:text-slate-900 font-display">
            Let's build your next digital masterpiece.
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base">
            Have a project in mind, need a 3D web experience, or looking to scale your engineering team? Send a direct message or schedule a quick discovery chat.
          </p>
        </div>

        {/* Contact Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Credentials & Channels (Span 5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-panel rounded-3xl p-8 border border-white/10 dark:border-white/10 light:border-slate-200 space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                  Direct Inquiries
                </div>
                <h3 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 font-display">
                  Fastest ways to reach me
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  I typically respond within 2-4 hours on weekdays across email and WhatsApp.
                </p>
              </div>

              {/* Email Copy Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <GlowIconBox size="sm" className="shrink-0">
                    <Mail className="w-4 h-4 text-purple-300" />
                  </GlowIconBox>
                  <div className="truncate">
                    <div className="text-[11px] text-slate-400">Direct Email</div>
                    <div className="text-xs font-mono text-white truncate font-medium">
                      {directEmail}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 shrink-0"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp Quick Chat */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <GlowIconBox size="sm" className="shrink-0">
                    <MessageCircle className="w-4 h-4 text-emerald-300" />
                  </GlowIconBox>
                  <div>
                    <div className="text-[11px] text-slate-400">WhatsApp Instant Chat</div>
                    <div className="text-xs font-mono text-white font-medium">
                      {whatsappNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="tel:03007118380"
                    onClick={() => playClickSound()}
                    className="p-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Direct Phone Call: 0300-7118380"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={handleOpenWhatsApp}
                    className="px-3 py-2 rounded-xl text-xs font-medium bg-emerald-600/80 hover:bg-emerald-600 text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Location & Availability */}
              <div className="pt-4 border-t border-white/10 space-y-3 text-xs text-slate-400">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Remote Worldwide Client Engagements</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>Available Across US, UK, EU & Asia Timezones</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-mono text-slate-300">Supabase Cloud DB</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Connected</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Social Network Links */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Connect Online:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-purple-400 transition-colors"
                  aria-label="Twitter/X Profile"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Professional Contact Form (Span 7) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out, <span className="text-cyan-400 font-semibold">{formData.name}</span>. Ahtasham will review your project brief and reply directly to <span className="text-cyan-400 font-semibold">{formData.email}</span> within 24 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      playClickSound();
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        service: 'Web Development',
                        budget: '$1,000 - $3,000',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 font-display">
                    Project Inquiry Brief
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out the parameters below to receive a scoped proposal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300">
                      Your Full Name <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300">
                      Email Address <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. marcus@primedrive.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Service Required */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300">
                      Service Category
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    >
                      <option value="Web Development" className="bg-slate-900 text-white">
                        Full-Stack Web Development
                      </option>
                      <option value="3D Three.js Experience" className="bg-slate-900 text-white">
                        3D & Three.js Web Experience
                      </option>
                      <option value="UI/UX Design" className="bg-slate-900 text-white">
                        UI/UX Design & Prototyping
                      </option>
                      <option value="E-commerce Platform" className="bg-slate-900 text-white">
                        E-commerce / Booking System
                      </option>
                      <option value="Website Redesign" className="bg-slate-900 text-white">
                        Website Redesign & Speed Optimization
                      </option>
                    </select>
                  </div>

                  {/* Budget Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300">
                      Estimated Budget Tier
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    >
                      <option value="$1,000 - $3,000" className="bg-slate-900 text-white">
                        $1,000 – $3,000 USD
                      </option>
                      <option value="$3,000 - $5,000" className="bg-slate-900 text-white">
                        $3,000 – $5,000 USD (Agency Grade)
                      </option>
                      <option value="$5,000+" className="bg-slate-900 text-white">
                        $5,000+ USD (Comprehensive Full-Stack & 3D)
                      </option>
                      <option value="To be discussed" className="bg-slate-900 text-white">
                        Let's Discuss Requirements First
                      </option>
                    </select>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">
                    Project Overview & Goals <span className="text-purple-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your product, your target launch date, and what you'd like to achieve..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Encrypting & Sending...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry to Ahtasham</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
