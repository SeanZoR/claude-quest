import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface TldrBlockProps {
  prompt: string;
  label?: string;
}

export default function TldrBlock({ prompt, label = 'Paste this into Claude Code' }: TldrBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-10 rounded-lg border border-amber-500/30 bg-amber-500/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-amber-500/20 bg-amber-500/10">
        <span className="text-sm font-medium text-amber-400">{label}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-amber-400/70 hover:text-amber-400 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-3 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
        {prompt}
      </pre>
    </div>
  );
}
