import { useState, useEffect } from 'react';
import { X, Mail, Check, Loader2 } from 'lucide-react';

// Flip to true once Resend audience + API key are configured
const SUBSCRIBE_ENABLED = true;

const API_URL = import.meta.env.PROD
  ? 'https://clauding-subscribe.sean-katz.workers.dev'
  : 'http://localhost:8787';

const STORAGE_KEY = 'clauding-subscribed';
const DISMISSED_KEY = 'clauding-prompt-dismissed';

interface SubscribePromptProps {
  show: boolean;
  onClose: () => void;
}

export default function SubscribePrompt({ show, onClose }: SubscribePromptProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Small delay so the animation is visible
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [show]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
    setTimeout(onClose, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    try {
      const res = await fetch(`${API_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'slider-prompt' }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      localStorage.setItem(STORAGE_KEY, 'true');
      setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 2000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (!SUBSCRIBE_ENABLED || !show) return null;

  return (
    <div
      className={`mt-4 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-amber-500/10 overflow-hidden transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 max-h-48' : 'opacity-0 translate-y-4 max-h-0'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Mail className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              {status === 'success' ? (
                <div className="flex items-center gap-2 text-green-400 text-sm py-1">
                  <Check className="w-4 h-4" />
                  You're in. I'll email you when something new drops.
                </div>
              ) : (
                <>
                  <p className="text-white font-medium text-sm">Like this? I write more of these.</p>
                  <p className="text-gray-500 text-xs mt-0.5 mb-3">Get notified when new posts drop. No spam.</p>
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                      className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-medium text-sm rounded-md transition-colors cursor-pointer shrink-0"
                    >
                      {status === 'loading' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </form>
                  {status === 'error' && (
                    <p className="text-red-400 text-xs mt-1.5">{errorMsg}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {status !== 'success' && (
            <button
              onClick={handleDismiss}
              className="text-gray-600 hover:text-gray-400 transition-colors cursor-pointer p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Returns true if the prompt should be shown (not subscribed, not dismissed) */
export function shouldShowPrompt(): boolean {
  if (!SUBSCRIBE_ENABLED) return false;
  return !localStorage.getItem(STORAGE_KEY) && !localStorage.getItem(DISMISSED_KEY);
}
