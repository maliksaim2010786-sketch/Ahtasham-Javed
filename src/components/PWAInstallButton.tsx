import React, { useState } from 'react';
import { Download, Laptop, Smartphone, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { playClickSound, playHoverSound } from '../utils/audio';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'mobile' | 'floating' | 'footer';
  onInstallClicked?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
  onInstallClicked,
}) => {
  const { isInstallable, isInstalled, isIOS, isWindows, install } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  // If already running in standalone PWA app mode, hide button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    playClickSound();
    if (onInstallClicked) onInstallClicked();

    // If native prompt is available (Chrome / Edge / Android), trigger directly first
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setModalOpen(true);
      }
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={handleClick}
          onMouseEnter={() => playHoverSound()}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400/60 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 whitespace-nowrap ${className}`}
          title="Install 'Ahtasham Javed' on Windows PC, Laptop, or Mobile Phone"
          aria-label="Install App"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="hidden xl:inline">Install App</span>
          <span className="xl:hidden">Install</span>
        </button>
      )}

      {variant === 'mobile' && (
        <button
          type="button"
          onClick={handleClick}
          className={`w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-cyan-500/30 text-white font-medium text-xs transition-all cursor-pointer active:scale-98 ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
              <Download className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Install "Ahtasham Javed"</div>
              <div className="text-[10px] text-cyan-300 font-mono">Windows, Android & iOS App</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Free
          </span>
        </button>
      )}

      {variant === 'footer' && (
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Install Windows & Mobile App</span>
        </button>
      )}

      {/* PWA Install Modal */}
      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
