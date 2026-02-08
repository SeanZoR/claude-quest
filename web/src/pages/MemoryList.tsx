import { Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { memoryPosts, getPostBySlug } from '../data/memoryPosts';
import { useHead } from '../hooks/useHead';
import SubscribeForm from '../components/SubscribeForm';

export default function MemoryList() {
  useHead({
    title: 'Memory - clauding.dev',
    description: 'Things I learned building with AI agents. Posts on Claude Code patterns, agent development, and practical AI workflows.',
    canonical: '/memory',
  });

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <header className="border-b border-white/10 bg-[#0a0a1a]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            clauding.dev
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/quest" className="text-gray-400 hover:text-white transition-colors text-sm">
              Quest
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Memory</h1>
        <p className="text-gray-500 mb-10">Things I learned while building with AI agents.</p>

        {(() => {
          const featured = getPostBySlug('claude-forgets-everything');
          if (!featured) return null;
          return (
            <Link
              to="/memory/claude-forgets-everything"
              className="block mb-10 group"
            >
              <div className="relative rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-transparent p-6 hover:border-amber-500/50 transition-all">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  Featured
                </div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-gray-400 leading-relaxed">{featured.description}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
                  <time>{new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                  <span>&middot;</span>
                  <span>{featured.readingTime}</span>
                </div>
              </div>
            </Link>
          );
        })()}

        <div className="space-y-8">
          {memoryPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/memory/${post.slug}`}
              className="block group"
            >
              <article className="border-b border-white/5 pb-8">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                  <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                  <span>&middot;</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">{post.description}</p>
                <div className="flex gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>

        <SubscribeForm source="memory-list" />
      </main>
    </div>
  );
}
