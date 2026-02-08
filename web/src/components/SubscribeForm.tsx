import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';

// Flip to true once Resend audience + API key are configured
const SUBSCRIBE_ENABLED = true;

const API_URL = import.meta.env.PROD
  ? 'https://clauding-subscribe.sean-katz.workers.dev'
  : 'http://localhost:8787';

const STORAGE_KEY = 'clauding-subscribed';

interface SubscribeFormProps {
  compact?: boolean;
  source?: string;
}

export default function SubscribeForm({ compact, source = 'post-bottom' }: SubscribeFormProps) {
  if (!SUBSCRIBE_ENABLED) return null;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(() =>
    localStorage.getItem(STORAGE_KEY) ? 'success' : 'idle',
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    try {
      const res = await fetch(`${API_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'success') {
    return (
      <div className={compact ? '' : 'mt-12 pt-8 border-t border-white/10'}>
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <Check className="w-4 h-4" />
          You're subscribed. I'll email you when something new drops.
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? '' : 'mt-12 pt-8 border-t border-white/10'}>
      <div className="flex items-start gap-3 mb-3">
        <Mail className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-white font-medium text-sm">Get notified when I publish new posts</p>
          <p className="text-gray-500 text-xs mt-0.5">No spam. No schedule. Just signal.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-medium text-sm rounded-lg transition-colors cursor-pointer shrink-0"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
      )}
    </div>
  );
}
