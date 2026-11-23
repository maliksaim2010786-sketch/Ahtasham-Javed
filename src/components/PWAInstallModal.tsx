import React, { useState } from 'react';
import { 
  Download, Monitor, Smartphone, Apple, Check, 
  X, Sparkles, ShieldCheck, ArrowRight, Laptop, 
  Share2, PlusSquare, ExternalLink 
} from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, isAndroid, isInIframe, install } = usePWAInstall();
  
  // Default tab based on platform detection
  const [activeTab, setActiveTab] = useState<'windows' | 'android' | 'ios'>(() => {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    return 'windows';
  });

  const [installing, setInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    playClickSound();
    setInstalling(true);
    const success = await install();
    setInstalling(false);
    if (success) {
      setInstalledSuccess(true);
      playSuccessSound();
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      {/* Background Cyber Lights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-900/20 rounded-full blur-[130px] pointer-events-none" />

      <div 
        className="glass-panel max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] relative bg-[#090b14] text-left overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            {/* App Icon */}
            <div className="w-12 h-12 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-400 via-purple-500 to-indigo-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#090b14] overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/aistudio/4d3001bf-002a-413a-8817-5afe29ac5538_6e3a9df5.png"
                  alt="Ahtasham Javed"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>PWA Desktop & Mobile App</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight leading-none">
                Install "Ahtasham Javed"
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Banner if already installed */}
        {installedSuccess ? (
          <div className="py-10 text-center space-y-3 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.4)]">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">App Installed Successfully!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              "Ahtasham Javed" has been installed on your device. You can now launch it directly from your desktop, taskbar, or home screen!
            </p>
          </div>
        ) : (
          <div className="space-y-5 pt-5">
            {/* Preview Iframe Helper Banner */}
            {isInIframe && !isInstallable && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-amber-200 leading-relaxed">
                  <strong className="text-amber-300 block">Preview Window Notice:</strong>
                  Browser security ki wajah se install prompt direct browser tab me aata hai.
                </div>
                <a
                  href={typeof window !== 'undefined' ? window.location.href : '/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  <span>Open in Browser Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Device Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('windows');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'windows'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Windows / PC</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('android');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveTab('ios');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
            </div>

            {/* Tab 1: Windows / Laptop / Desktop PC */}
            {activeTab === 'windows' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 font-mono">
                    <Laptop className="w-4 h-4 text-cyan-400" />
                    <span>Windows 10 / 11 & Laptop Desktop App</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Install <strong>"Ahtasham Javed"</strong> as a standalone Windows app with Start Menu shortcut, Taskbar icon, and offline support.
                  </p>
                </div>

                {/* Direct 1-Click Install Button if supported */}
                {isInstallable ? (
                  <button
                    type="button"
                    onClick={handleNativeInstall}
                    disabled={installing}
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{installing ? 'Opening Windows Installer...' : 'Install "Ahtasham Javed" on Windows / PC'}</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 text-xs text-slate-300">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Windows / Laptop par Install karne ka tariqa (Chrome / Edge):</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed pl-1">
                        <li>
                          Browser ki top <strong>Address Bar (URL bar)</strong> ke right side par dekhein.
                        </li>
                        <li>
                          Wahan <strong>Install icon (⊕ / 💻)</strong> nazar aayega, us par click karein.
                        </li>
                        <li>
                          Popup mein <strong>"Install"</strong> par click karein.
                        </li>
                        <li>
                          App <strong>"Ahtasham Javed"</strong> ke naam se aapke Desktop, Taskbar aur Start Menu mein install ho jayegi!
                        </li>
                      </ol>
                    </div>

                    {/* Edge / Chrome keyboard tip */}
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 font-mono flex flex-wrap items-center justify-between gap-2">
                      <span>Alternative in Chrome / Edge:</span>
                      <span className="text-cyan-300">Menu (⋮) → Cast, save, and share → Install page as app</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Android Phone */}
            {activeTab === 'android' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 font-mono">
                    <Smartphone className="w-4 h-4 text-purple-400" />
                    <span>Android Mobile App</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Install directly to your Android home screen with adaptive maskable icon, smooth standalone navigation, and instant client orders hub access.
                  </p>
                </div>

                {isInstallable ? (
                  <button
                    type="button"
                    onClick={handleNativeInstall}
                    disabled={installing}
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{installing ? 'Opening Android Prompt...' : 'Install on Android Phone'}</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 text-xs text-slate-300">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Android Quick Installation:</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed pl-1">
                      <li>Open this page in <strong>Google Chrome</strong> on your Android phone.</li>
                      <li>Tap the <strong>three dots (⋮)</strong> in the top-right corner.</li>
                      <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                      <li>Confirm by tapping <strong>Install</strong>.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: iPhone / iPad (iOS Safari) */}
            {activeTab === 'ios' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 font-mono">
                    <Apple className="w-4 h-4 text-indigo-400" />
                    <span>Apple iOS Safari Installation</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Apple iOS Safari requires adding to Home Screen via the Safari Share menu. Follow these 2 easy steps:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs font-bold font-mono">
                      1
                    </div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Tap Share Button</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      In the bottom toolbar of Safari on iPhone (or top bar on iPad), tap the <strong>Share</strong> icon (square with an arrow pointing up).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center text-xs font-bold font-mono">
                      2
                    </div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <PlusSquare className="w-3.5 h-3.5 text-purple-400" />
                      <span>Add to Home Screen</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Scroll down the options list and select <strong>"Add to Home Screen"</strong>, then tap <strong>Add</strong> in the top-right corner.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Features Strip */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                <div className="text-[11px] font-semibold text-white">Full Screen</div>
                <div className="text-[10px] text-slate-500 font-mono">Native App View</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                <div className="text-[11px] font-semibold text-cyan-300">Offline Ready</div>
                <div className="text-[10px] text-slate-500 font-mono">Service Worker</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                <div className="text-[11px] font-semibold text-purple-300">Zero Storage</div>
                <div className="text-[10px] text-slate-500 font-mono">&lt; 3MB Instant</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
