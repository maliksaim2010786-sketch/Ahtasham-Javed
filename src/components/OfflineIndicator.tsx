import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-black font-mono shadow-2xl border border-amber-300 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <span className="w-2 h-2 rounded-full bg-black/70 animate-ping" />
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>Offline Mode — Portfolio active · Orders require internet</span>
    </div>
  );
};
