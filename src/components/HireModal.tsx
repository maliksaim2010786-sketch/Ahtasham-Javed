import React, { useState, useEffect } from 'react';
import { X, Send, MessageCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { supabase } from '../utils/supabase';

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const HireModal: React.FC<HireModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'Full-Stack Web Development',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState(defaultService);
  const [timeline, setTimeline] = useState('2 - 4 Weeks');
  const [budget, setBudget] = useState('$3,000 - $5,000');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setSelectedService(defaultService);
  }, [defaultService]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setIsSubmitting(true);
    try {
      await supabase.from('hire_requests').insert([
        {
          name,
          email,
          service: selectedService,
          timeline,
          budget,
          details,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.info('Supabase hire inquiry notice:', err);
    }
    setIsSubmitting(false);
    setIsSuccess(true);
    playSuccessSound();
  };

  const handleWhatsApp = () => {
    playClickSound();
    const msg = encodeURIComponent(
      `Hi Ahtasham! I'd like to hire you for ${selectedService}. Budget: ${budget}, Timeline: ${timeline}. My name is ${name || 'there'}.`
    );
    window.open(`https://wa.me/923007118380?text=${msg}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="glass-panel max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-white/20 relative my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h3 className="text-xl font-bold text-white font-display">
              Hire Ahtasham Javed
            </h3>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-white font-display">
              Proposal Request Received!
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              Thank you for considering Ahtasham for your project. A detailed timeline breakdown and technical scope estimate will be sent to <span className="text-cyan-400 font-semibold">{email}</span> shortly.
            </p>
            <button
              onClick={() => {
                playClickSound();
                setIsSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Let's create something extraordinary. Tell me about your requirements below, or launch an instant WhatsApp session.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Your Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. elena@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Service Required</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="Full-Stack Web Development" className="bg-slate-900">
                  Full-Stack Web Development (React 19 & TypeScript)
                </option>
                <option value="3D Three.js Web Experience" className="bg-slate-900">
                  Interactive 3D Three.js Web Experience
                </option>
                <option value="UI/UX Design & Prototyping" className="bg-slate-900">
                  UI/UX Design & Spatial Systems
                </option>
                <option value="E-commerce & Booking Platform" className="bg-slate-900">
                  E-commerce & Fleet Booking Platform
                </option>
                <option value="Website Redesign & Modernization" className="bg-slate-900">
                  Website Modernization & Speed Optimization
                </option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Target Timeline</label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Urgent (< 2 Weeks)" className="bg-slate-900">Urgent (Under 2 Weeks)</option>
                  <option value="2 - 4 Weeks" className="bg-slate-900">Standard (2 - 4 Weeks)</option>
                  <option value="1 - 2 Months" className="bg-slate-900">Comprehensive (1 - 2 Months)</option>
                  <option value="Flexible" className="bg-slate-900">Flexible Timeline</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Budget Range</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value="$1,000 - $3,000" className="bg-slate-900">$1,000 - $3,000 USD</option>
                  <option value="$3,000 - $5,000" className="bg-slate-900">$3,000 - $5,000 USD (Agency Polish)</option>
                  <option value="$5,000+" className="bg-slate-900">$5,000+ USD (Enterprise Grade)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Project Brief & Details</label>
              <textarea
                rows={3}
                placeholder="Briefly describe your objectives, existing links, or key features..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <span>Submit Request</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold text-white bg-emerald-600/80 hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                title="Send via WhatsApp directly"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Instant</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
