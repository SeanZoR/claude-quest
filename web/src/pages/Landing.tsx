import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useHead } from '../hooks/useHead';

const sections = [
  {
    title: 'Memory',
    description: 'Things I learned building with AI agents.',
    to: '/memory',
    external: false,
  },
  {
    title: 'Quest',
    description: 'Gamified achievements for Claude Code.',
    to: '/quest',
    external: false,
  },
  {
    title: 'Workshops',
    description: 'Interactive Claude Code workshops.',
    to: '/quest',
    external: false,
    links: [
      { label: 'Hello Workshop', href: '/hello-workshop/' },
      { label: 'Advanced Workshop', href: '/advanced-workshop/' },
      { label: 'Teams Workshop', href: '/teams-workshop/' },
    ],
  },
  {
    title: 'GitHub',
    description: 'Open source projects and tools.',
    to: 'https://github.com/SeanZoR',
    external: true,
  },
];

export default function Landing() {
  useHead({
    title: 'clauding.dev - Building Things with AI Agents',
    description: 'Workshops, memory posts, and 365 gamified achievements for mastering Claude Code. Learn AI agent development through hands-on projects.',
    canonical: '/',
  });

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex flex-col items-center justify-center px-4">
      <main className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-1">clauding.dev</h1>
        <p className="text-gray-500 mb-10">Building things with AI agents.</p>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.title}>
              {section.external ? (
                <a
                  href={section.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg border border-white/10 hover:border-white/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg group-hover:text-amber-400 transition-colors">
                      {section.title}
                    </h2>
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{section.description}</p>
                </a>
              ) : section.links ? (
                <div className="p-4 rounded-lg border border-white/10">
                  <h2 className="font-bold text-lg">{section.title}</h2>
                  <p className="text-gray-500 text-sm mt-1 mb-3">{section.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {section.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="text-sm px-3 py-1 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={section.to}
                  className="block p-4 rounded-lg border border-white/10 hover:border-white/30 transition-all group"
                >
                  <h2 className="font-bold text-lg group-hover:text-amber-400 transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{section.description}</p>
                </Link>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
