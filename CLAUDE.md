# Claude Quest - Claude Code Context

## Structure

```
claude-quest/
├── skills/claude-quest/     # Quest skill (achievements, scanning)
├── web/                     # clauding.dev website (React + Vite)
│   ├── src/
│   │   ├── components/      # CookieConsent, TldrBlock
│   │   ├── data/            # memoryPosts.ts, questData.ts
│   │   ├── lib/             # analytics.ts
│   │   └── pages/           # Landing, Memory, Quest pages
│   └── public/              # workshops, og-image, sitemap
└── workers/x-bot/           # Cloudflare Worker for X/Twitter bot
```

## Deploy

```bash
# Website (clauding.dev)
cd web && npm run build && wrangler pages deploy dist --project-name=claude-quest --commit-dirty=true

# X-bot worker
cd workers/x-bot && wrangler deploy
```

## Analytics

- **GA4 Property:** clauding.dev (under Jehmihny account)
- **Measurement ID:** `G-Y2KDBH176L`
- **Stream ID:** 13577994552
- **Model:** Opt-out. GA loads by default. Banner shows once, user can opt out.
- **SPA tracking:** Page views sent manually via react-router location changes
- **UTM tracking:** Automatic via GA. Use format: `?utm_source=linkedin&utm_medium=social&utm_campaign=NAME&utm_content=PERSON`
- **Cookie consent key:** `cookie-consent` in localStorage (`granted`/`denied`)
- **Dashboard:** https://analytics.google.com (property: clauding.dev)

## Domain

- **URL:** https://clauding.dev
- **Hosting:** Cloudflare Pages (project: claude-quest)
- **GitHub:** https://github.com/clauding-dev/claude-quest

## Tech Stack

- React 19, TypeScript, Tailwind CSS v4, Vite 7
- react-router-dom for SPA routing
- react-markdown + remark-gfm for memory posts
- Cloudflare Pages for hosting
- Cloudflare Workers for X-bot
