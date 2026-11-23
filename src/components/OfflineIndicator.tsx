import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 backdrop-blur-md px-3.5 py-2 text-xs font-medium text-black font-mono shadow-2xl border border-amber-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — Cached portfolio is active</span>
    </div>
  );
};
