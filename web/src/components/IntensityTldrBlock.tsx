import { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

const LEVELS = [
  { skills: 5, changes: 2, label: 'Gentle' },
  { skills: 8, changes: 3, label: 'Moderate' },
  { skills: 12, changes: 4, label: 'Focused' },
  { skills: 15, changes: 5, label: 'Aggressive' },
  { skills: 20, changes: 5, label: 'Maximum' },
];

function useAnimatedNumber(target: number, duration = 400) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number>(0);
  const startRef = useRef({ value: target, time: 0 });

  useEffect(() => {
    const start = display;
    if (start === target) return;

    startRef.current = { value: start, time: performance.now() };

    const animate = (now: number) => {
      const elapsed = now - startRef.current.time;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startRef.current.value + (target - startRef.current.value) * eased);
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}

export default function IntensityTldrBlock() {
  const [level, setLevel] = useState(1); // 0-indexed, default to Moderate
  const [copied, setCopied] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const current = LEVELS[level];
  const total = current.skills * current.changes;

  const animSkills = useAnimatedNumber(current.skills);
  const animChanges = useAnimatedNumber(current.changes);
  const animTotal = useAnimatedNumber(total);

  const getPrompt = useCallback(() => {
    const c = LEVELS[level];
    return `npx skills add vercel-labs/skills --skill find-skills --yes

Find the ${c.skills} best relevant skills for this project.
For each skill, gather the top ${c.changes} recommended changes.
Create a unique branch and PR per skill.
Work on all skills in parallel.`;
  }, [level]);

  const handleCopy = () => {
    navigator.clipboard.writeText(getPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateLevelFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newLevel = Math.round(ratio * (LEVELS.length - 1));
    setLevel(newLevel);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateLevelFromPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateLevelFromPosition(e.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const thumbPercent = (level / (LEVELS.length - 1)) * 100;

  return (
    <div className="mb-10 rounded-lg border border-amber-500/30 bg-amber-500/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-amber-500/20 bg-amber-500/10">
        <span className="text-sm font-medium text-amber-400">Paste this into Claude Code</span>
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
        <span className="text-gray-500">npx skills add vercel-labs/skills --skill find-skills --yes</span>
        {'\n\n'}
        {'Find the '}
        <span className="text-amber-400 font-bold tabular-nums inline-block min-w-[2ch] text-right">{animSkills}</span>
        {' best relevant skills for this project.\n'}
        {'For each skill, gather the top '}
        <span className="text-amber-400 font-bold tabular-nums">{animChanges}</span>
        {' recommended changes.\n'}
        {'Create a unique branch and PR per skill.\n'}
        {'Work on all skills in parallel.'}
      </pre>

      {/* Intensity slider */}
      <div className="px-4 pt-2 pb-4 border-t border-amber-500/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Intensity</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white tabular-nums">{animTotal}</span>
            <span className="text-xs text-gray-500">improvements</span>
          </div>
        </div>

        {/* Slider track */}
        <div
          ref={sliderRef}
          className="relative h-10 flex items-center cursor-pointer select-none touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Track background */}
          <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/10">
            {/* Filled portion */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500/60 to-amber-400 transition-all duration-300"
              style={{ width: `${thumbPercent}%` }}
            />
          </div>

          {/* Tick marks */}
          {LEVELS.map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full transition-colors duration-300"
              style={{
                left: `${(i / (LEVELS.length - 1)) * 100}%`,
                transform: 'translateX(-50%)',
                background: i <= level ? 'rgb(251 191 36)' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}

          {/* Thumb */}
          <div
            className="slider-thumb absolute w-5 h-5 rounded-full bg-amber-400 shadow-lg shadow-amber-500/40 transition-[left] duration-300"
            style={{ left: `${thumbPercent}%`, transform: 'translateX(-50%)' }}
          >
            <div className="slider-thumb-glow absolute inset-0 rounded-full bg-amber-400/40" />
          </div>
        </div>

        {/* Level labels */}
        <div className="flex justify-between mt-1">
          {LEVELS.map((l, i) => (
            <button
              key={i}
              onClick={() => setLevel(i)}
              className={`text-[10px] transition-colors duration-300 cursor-pointer ${
                i === level ? 'text-amber-400 font-medium' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
