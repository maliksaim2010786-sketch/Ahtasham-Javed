import React, { useEffect, useState } from 'react';
import { X, MessageCircle, Phone, Check, Copy, ArrowRight, Sparkles } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome?: () => void;
  onHireClick?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigateHome,
  onHireClick,
}) => {
  const [copiedNumber, setCopiedNumber] = useState(false);

  const mobileNumber = '0300 7118380';
  const whatsappUrl =
    'https://wa.me/923007118380?text=Hello%20Ahtasham!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect.';

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

  const handleCopyNumber = () => {
    playClickSound();
    navigator.clipboard?.writeText('03007118380');
    setCopiedNumber(true);
    playSuccessSound();
    setTimeout(() => setCopiedNumber(false), 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="glass-panel max-w-sm w-full rounded-3xl p-6 border border-white/20 relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/25 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-cyan-600/25 rounded-full blur-[60px] pointer-events-none" />

        {/* Header Bar: Logo + Quick About Title + Close */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/4d3001bf-002a-413a-8817-5afe29ac5538_6e3a9df5.png"
              alt="Ahtasham Javed Logo"
              className="w-6 h-6 rounded-lg object-cover object-top border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.35)]"
            />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
              Quick About
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close about card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Profile Card Body: Logo Image Only + Name + Mobile Number */}
        <div className="pt-5 flex flex-col items-center text-center relative z-10 space-y-4">
          {/* Brand Logo Image with Rotating Neon Ring */}
          <div className="relative">
            <div className="glow-rotating-ring w-28 h-28 rounded-full p-[3px] shadow-[0_0_25px_rgba(6,182,212,0.45)]">
              <div className="glow-rotating-inner w-full h-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/aistudio/4d3001bf-002a-413a-8817-5afe29ac5538_6e3a9df5.png"
                  alt="Ahtasham Javed Logo"
                  className="w-full h-full object-cover object-top scale-105"
                />
              </div>
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-wide">
              Ahtasham Javed
            </h2>
            <p className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              3D Web Developer & Full-Stack Architect
            </p>
            <p className="text-xs text-slate-300 leading-relaxed pt-1 max-w-xs mx-auto">
              Building interactive 3D web experiences, modern React apps, and high-converting business websites.
            </p>
          </div>

          {/* Mobile Number Box */}
          <div className="w-full rounded-2xl bg-white/[0.04] border border-cyan-500/30 p-3.5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Mobile Number
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono tracking-wide">
                    {mobileNumber}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyNumber}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                title="Copy mobile number"
              >
                {copiedNumber ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Call & WhatsApp Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:03007118380"
                onClick={() => playClickSound()}
                className="py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Bottom Action Row */}
          <div className="w-full flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onClose();
                onNavigateHome?.();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Home Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onHireClick && (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onClose();
                  onHireClick();
                }}
                className="py-2.5 px-3.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Hire Me</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
