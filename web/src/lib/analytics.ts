import { getConsentStatus } from '../components/CookieConsent';

const GA_ID = 'G-Y2KDBH176L';

let initialized = false;

function loadGtag() {
  if (initialized) return;
  initialized = true;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    send_page_view: false, // We'll send page views manually for SPA
  });

  // Send initial page view
  trackPageView(window.location.pathname + window.location.search);
}

function disableGtag() {
  // Set GA opt-out flag
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true;
  initialized = false;
}

export function initAnalytics() {
  // Opt-out model: load GA unless user has explicitly opted out
  if (getConsentStatus() === 'denied') {
    disableGtag();
    return;
  }

  loadGtag();

  window.addEventListener('consent-denied', () => {
    disableGtag();
  });
}

export function trackPageView(path: string) {
  if (!initialized || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
  });
}

// Type declarations for gtag
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
