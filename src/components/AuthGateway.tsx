import React, { useState, useEffect } from 'react';
import { 
  Lock, Eye, EyeOff, ShieldCheck, ArrowRight, 
  AlertCircle, KeyRound, UserCheck 
} from 'lucide-react';
import { playClickSound, playSuccessSound, playHoverSound } from '../utils/audio';

export interface AuthSession {
  isAuthenticated: boolean;
  email: string;
  role: 'admin' | 'visitor' | 'guest';
}

interface AuthGatewayProps {
  isOpen: boolean;
  onSuccess: (session: AuthSession) => void;
  onCancel?: () => void;
  isInitialGate?: boolean;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  isInitialGate = false,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear inputs each time modal opens
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  // Admin Master Password as requested
  const ADMIN_PASSWORD = 'webstudio5911';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    playClickSound();

    const cleanPass = password.trim();

    if (!cleanPass) {
      setErrorMsg('Please enter the Admin Password or click "Continue as Guest".');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (cleanPass === ADMIN_PASSWORD) {
        playSuccessSound();
        const session: AuthSession = {
          isAuthenticated: true,
          email: 'admin@portfolio',
          role: 'admin',
        };
        onSuccess(session);
      } else {
        playClickSound();
        setErrorMsg('Incorrect Admin Password. Please verify and try again.');
      }
    }, 300);
  };

  const handleGuestContinue = () => {
    playClickSound();
    const session: AuthSession = {
      isAuthenticated: true,
      email: 'guest@portfolio',
      role: 'guest',
    };
    onSuccess(session);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-purple-900/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-900/25 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Admin Access Card */}
      <div className="relative w-full max-w-md my-auto">
        <div className="glow-rotating-ring rounded-3xl p-[2px] shadow-[0_0_40px_rgba(168,85,247,0.35)]">
          <div className="glow-rotating-inner rounded-[22px] bg-[#090b14] p-6 sm:p-8 text-left relative overflow-hidden border border-white/10">
            
            {/* Top Brand Header */}
            <div className="text-center space-y-3 mb-6">
              {/* Avatar with spinning ring */}
              <div className="relative inline-block mx-auto">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-purple-500 to-indigo-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                  <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center">
                    <img
                      src="/assets/aistudio/a7c15d4c-657d-49ff-8146-81cda0bb2807_e1ecb5b4.png"
                      alt="Ahtasham Javed"
                      className="w-full h-full object-cover object-top scale-125 translate-y-0.5"
                    />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#090b14] shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-1.5">
                  <KeyRound className="w-3 h-3 text-cyan-400" />
                  <span>Admin Gateway</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-display tracking-tight">
                  Admin Access
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Enter the Admin Password to unlock the <strong className="text-cyan-300">Client Orders Hub</strong>, or continue as a guest to view the portfolio.
                </p>
              </div>
            </div>

            {/* Error Message Notice */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            {/* Admin Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin Password</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Master Access
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter Admin Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => playHoverSound()}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 pt-3"
              >
                {isLoading ? (
                  <span>Verifying Password...</span>
                ) : (
                  <>
                    <span>Unlock Admin & Orders</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Guest Option */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">Regular visitor or client?</span>
              <button
                type="button"
                onClick={handleGuestContinue}
                onMouseEnter={() => playHoverSound()}
                className="px-3.5 py-1.5 rounded-lg font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                Continue as Guest →
              </button>
            </div>

            {/* Cancel option if opened from inside the site */}
            {!isInitialGate && onCancel && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onCancel();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Close & Stay on Page
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
