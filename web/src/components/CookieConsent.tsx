import { useState, useEffect } from 'react';

const CONSENT_KEY = 'cookie-consent';

export type ConsentStatus = 'granted' | 'denied' | null;

export function getConsentStatus(): ConsentStatus {
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === 'granted' || value === 'denied') return value;
  return null;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsentStatus() === null) {
      const showTimer = setTimeout(() => setVisible(true), 1500);
      const hideTimer = setTimeout(() => {
        localStorage.setItem(CONSENT_KEY, 'granted');
        setVisible(false);
      }, 6500); // 1.5s delay + 5s visible
      return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    setVisible(false);
  };

  const optOut = () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    setVisible(false);
    window.dispatchEvent(new Event('consent-denied'));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-lg mx-auto bg-[#1a1a2e] border border-white/10 rounded-lg px-5 py-4 flex items-center justify-between gap-4 shadow-2xl">
        <p className="text-sm text-gray-400">
          This site uses anonymous analytics.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={optOut}
            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          >
            Opt out
          </button>
          <button
            onClick={dismiss}
            className="px-3 py-1.5 text-sm bg-amber-500/20 text-amber-400 rounded hover:bg-amber-500/30 transition-colors cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
