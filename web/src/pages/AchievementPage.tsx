import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, ExternalLink, Sword, Check, Lock } from 'lucide-react';
import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import {
  categories,
  getAchievementById,
  getAchievementIndex,
  getAchievementsByCategory,
  GITHUB_URL
} from '../data/questData';

export default function AchievementPage() {
  const { id } = useParams<{ id: string }>();
  const { progress } = useProgress();
  const [copiedCommand, setCopiedCommand] = useState(false);

  const achievement = id ? getAchievementById(id) : undefined;
  const index = id ? getAchievementIndex(id) : 0;
  const category = achievement ? categories.find(c => c.id === achievement.category) : undefined;

  const isUnlocked = progress?.unlockedAchievements.includes(id || '') || false;

  const relatedAchievements = achievement
    ? getAchievementsByCategory(achievement.category)
        .filter(a => a.id !== achievement.id)
        .slice(0, 4)
    : [];

  const copyCommand = () => {
    navigator.clipboard.writeText(`/quest learn ${index}`);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  if (!achievement) {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Achievement Not Found</h1>
        <Link to="/quest" className="text-amber-400 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a1a]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/quest" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center">
              <Sword className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">Claude Quest</span>
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            GitHub <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          to="/quest/achievements"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Achievements
        </Link>

        {/* Achievement Card */}
        <div className={`rounded-2xl border ${isUnlocked ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-white/5'} p-8 mb-8`}>
          <div className="flex items-start gap-6">
            {/* Icon */}
            <div
              className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl ${
                isUnlocked ? 'bg-green-500/20' : 'bg-white/10'
              }`}
            >
              {category?.icon}
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isUnlocked ? (
                  <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                    <Check className="w-4 h-4" /> Unlocked
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <Lock className="w-4 h-4" /> Locked
                  </span>
                )}
                <span className="text-gray-500">•</span>
                <span className="text-gray-500 capitalize">{achievement.category}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">#{index}</span>
              </div>

              <h1 className="text-3xl font-bold mb-2">{achievement.name}</h1>
              <p className="text-xl text-gray-400 mb-4">{achievement.description}</p>

              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-amber-400">+{achievement.xp} XP</span>
                <Link
                  to={`/quest/achievements?category=${achievement.category}`}
                  className="text-sm px-3 py-1 rounded-full border border-white/20 hover:border-white/40 transition-colors"
                  style={{ borderColor: `${category?.color}40`, color: category?.color }}
                >
                  {category?.name}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* How to Unlock */}
        {!isUnlocked && achievement.hint && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">How to Unlock</h2>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
              <p className="text-amber-200">{achievement.hint}</p>
            </div>
          </section>
        )}

        {/* CLI Command */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Open in Claude Code</h2>
          <div className="bg-[#1a1a2e] rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-3">
              Run this command in Claude Code to learn more about this achievement:
            </p>
            <div className="flex items-center gap-2 bg-black/50 rounded-lg p-3 font-mono">
              <code className="flex-1 text-green-400">/quest learn {index}</code>
              <button
                onClick={copyCommand}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                title="Copy command"
              >
                {copiedCommand ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Share Link */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Share this Achievement</h2>
          <div className="bg-[#1a1a2e] rounded-xl p-4">
            <div className="flex items-center gap-2 bg-black/50 rounded-lg p-3 font-mono text-sm">
              <code className="flex-1 text-gray-400 overflow-x-auto">
                {window.location.href}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                title="Copy link"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </section>

        {/* Related Achievements */}
        {relatedAchievements.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Related Achievements</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedAchievements.map(related => {
                const relatedUnlocked = progress?.unlockedAchievements.includes(related.id) || false;
                const relatedIndex = getAchievementIndex(related.id);

                return (
                  <Link
                    key={related.id}
                    to={`/quest/achievement/${related.id}`}
                    className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                      relatedUnlocked
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">{related.name}</span>
                      <span className="text-amber-400 text-sm">+{related.xp} XP</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{related.description}</p>
                    <code className="text-xs text-gray-500">/quest learn {relatedIndex}</code>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-8 text-center text-gray-500 text-sm">
        <Link to="/quest" className="text-amber-400 hover:underline">← Back to Dashboard</Link>
      </footer>
    </div>
  );
}
