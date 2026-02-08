import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Grid, List, ExternalLink, Sword, Check } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useHead } from '../hooks/useHead';
import {
  achievements,
  categories,
  getAchievementIndex,
  getCategoryInfo,
  type Category
} from '../data/questData';

type ViewMode = 'grid' | 'list';
type SortOption = 'category' | 'xp' | 'name';

export default function AllAchievements() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { progress } = useProgress();

  useHead({
    title: 'All Achievements - Claude Quest',
    description: 'Browse all 365 Claude Code achievements. Filter by category, search by name, and track your progress toward mastery.',
    canonical: '/quest/achievements',
  });

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('category');

  const selectedCategory = (searchParams.get('category') as Category | null) || null;

  const setSelectedCategory = (category: Category | null) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const filteredAchievements = useMemo(() => {
    return achievements
      .filter(a => {
        const matchesSearch =
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || a.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'category':
            return a.category.localeCompare(b.category);
          case 'xp':
            return b.xp - a.xp;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [search, selectedCategory, sortBy]);

  const unlockedCount = progress?.unlockedAchievements.length || 0;
  const totalXP = progress?.totalXP || 0;

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a1a] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/quest" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center">
              <Sword className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">Claude Quest</span>
          </Link>
          <div className="flex items-center gap-4">
            {progress && (
              <div className="text-sm text-gray-400">
                <span className="text-amber-400 font-bold">{totalXP.toLocaleString()}</span> XP
                <span className="mx-2">•</span>
                <span className="text-purple-400 font-bold">{unlockedCount}</span>/{achievements.length}
              </div>
            )}
            <a
              href="https://github.com/clauding-dev/claude-quest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Achievements</h1>
          <p className="text-gray-400">
            {filteredAchievements.length} of {achievements.length} achievements
            {selectedCategory && ` in ${getCategoryInfo(selectedCategory)?.name}`}
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory || ''}
            onChange={e => setSelectedCategory((e.target.value as Category) || null)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
          >
            <option value="category">Sort by Category</option>
            <option value="xp">Sort by XP</option>
            <option value="name">Sort by Name</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
              title="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
              title="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              !selectedCategory
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            All
          </button>
          {categories.map(cat => {
            const count = achievements.filter(a => a.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                  isActive
                    ? 'font-bold text-black'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
                style={isActive ? { backgroundColor: cat.color } : {}}
              >
                {cat.icon} {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Achievements Display */}
        {viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAchievements.map(achievement => {
              const index = getAchievementIndex(achievement.id);
              const category = getCategoryInfo(achievement.category);
              const isUnlocked = progress?.unlockedAchievements.includes(achievement.id) || false;

              return (
                <Link
                  key={achievement.id}
                  to={`/quest/achievement/${achievement.id}`}
                  className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                    isUnlocked
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{category?.icon}</span>
                    <div className="flex items-center gap-2">
                      {isUnlocked && <Check className="w-4 h-4 text-green-400" />}
                      <span className="text-amber-400 font-bold text-sm">+{achievement.xp}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-1">{achievement.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{achievement.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{achievement.category}</span>
                    <code className="text-amber-400/70">#{index}</code>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAchievements.map(achievement => {
              const index = getAchievementIndex(achievement.id);
              const category = getCategoryInfo(achievement.category);
              const isUnlocked = progress?.unlockedAchievements.includes(achievement.id) || false;

              return (
                <Link
                  key={achievement.id}
                  to={`/quest/achievement/${achievement.id}`}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                    isUnlocked
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <span className="text-2xl w-10 text-center">{category?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{achievement.name}</h3>
                      {isUnlocked && <Check className="w-4 h-4 text-green-400" />}
                    </div>
                    <p className="text-sm text-gray-400 truncate">{achievement.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-amber-400 font-bold">+{achievement.xp} XP</span>
                    <p className="text-xs text-gray-500">#{index}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No achievements match your search.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory(null);
              }}
              className="mt-2 text-amber-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-8 text-center text-gray-500 text-sm">
        <Link to="/quest" className="text-amber-400 hover:underline">← Back to Dashboard</Link>
      </footer>
    </div>
  );
}
