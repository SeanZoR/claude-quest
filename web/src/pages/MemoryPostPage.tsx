import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../data/memoryPosts';
import { useHead } from '../hooks/useHead';
import TldrBlock from '../components/TldrBlock';
import IntensityTldrBlock from '../components/IntensityTldrBlock';

export default function MemoryPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useHead({
    title: post ? `${post.title} - clauding.dev` : 'Memory - clauding.dev',
    description: post?.description ?? 'Things I learned building with AI agents.',
    canonical: `/memory/${slug}`,
  });

  if (!post) {
    return <Navigate to="/memory" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <header className="border-b border-white/10 bg-[#0a0a1a]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/memory" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Memory
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/quest" className="text-gray-400 hover:text-white transition-colors text-sm">
              Quest
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <article>
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{post.title}</h1>

          {slug === 'vercel-skills-parallel-improvements' ? (
            <IntensityTldrBlock />
          ) : (
            post.tldr && <TldrBlock prompt={post.tldr} />
          )}

          <div className="memory-prose">
            <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
          </div>

          <div className="flex gap-2 mt-10 pt-6 border-t border-white/10">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                {tag}
              </span>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
