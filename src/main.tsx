import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Capture beforeinstallprompt early before React mounts so it's never missed
declare global {
  interface Window {
    __deferredPWAInstallPrompt?: Event | null;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.__deferredPWAInstallPrompt = e;
    window.dispatchEvent(new CustomEvent('pwa-prompt-available', { detail: e }));
  });

  window.addEventListener('appinstalled', () => {
    window.__deferredPWAInstallPrompt = null;
  });
}

// Register PWA Service Worker for offline caching & cross-device installability
registerSW({
  immediate: true,
  onOfflineReady() {
    console.info('Ahtasham Javed PWA is ready for offline use.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
