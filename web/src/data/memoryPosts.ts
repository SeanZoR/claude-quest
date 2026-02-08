export interface MemoryPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  readingTime: string;
  tldr?: string;
}

export const memoryPosts: MemoryPost[] = [
  {
    slug: 'vercel-skills-parallel-improvements',
    title: '100 Deep Improvements in 30 Seconds',
    date: '2026-02-06',
    description: 'Most humans use AI to write code. The real move is using it to find the unknown unknowns. A 3-step workflow with Claude Code and Vercel Skills.',
    tags: ['claude-code', 'skills', 'workflow'],
    readingTime: '3 min',
    tldr: `npx skills add vercel-labs/skills --skill find-skills --yes

Find the 20 best relevant skills for this project.
For each skill, gather the top 5 recommended changes.
Create a unique branch and PR per skill.
Work on all skills in parallel.`,
    content: `
Most humans use AI to write new code. The real move is using AI to find the "unknown unknowns."

You don't know which performance waterfalls are killing your UX. You don't know which React patterns are outdated. You don't know what you don't know.

In 2026, solving problems is table stakes. The actual challenge is figuring out what needs solving. AI isn't a smart keyboard anymore - it's leverage.

## The 3-Step Workflow

30 seconds of prompting. That's it.

### Step 1: Install the Skills finder

One command turns Claude into a specialized auditor.

\`\`\`bash
npx skills add vercel-labs/skills --skill find-skills --yes
\`\`\`

### Step 2: Let it scan

Ask Claude:

> "For this project, find the 20 best relevant skills."

It scans your package.json and architecture, then pulls in specific intelligence - React best practices, accessibility, bundle-size optimization, whatever fits your stack.

### Step 3: Run everything in parallel

This is where it gets fun. Give Claude this prompt:

> "For each skill, gather the top 5 changes recommended. Aggregate each skill's changes into a unique PR/branch. Work on all skills in parallel."

## The Result

In seconds of prompting, you have:

- 20 PRs
- 100 targeted improvements
- 0% wasted "discovery" time

Each PR is a clean, reviewable set of changes for a specific skill area. Not vague suggestions - actual code changes, ready to merge.

## Why This Matters

The shift isn't technical. It's behavioral.

I stopped writing code. I started evaluating code. My job became reviewing PRs and deciding which improvements actually fit the project. Some didn't - and that's fine. That judgment call is the human part.

The AI found things I never would have looked for. Not because I'm bad at my job, but because you can't audit what you don't know exists.

That's the whole point.
`,
  },
  {
    slug: 'zero-dep-prometheus-openclaw',
    title: 'Claude Wrote a Prometheus Library in 200 Lines',
    date: '2026-02-03',
    description: 'I needed metrics for my AI gateway. Every library was overkill. So I told Claude Code to write one from scratch - zero dependencies.',
    tags: ['claude-code', 'observability', 'openclaw'],
    readingTime: '2 min',
    content: `
I run an AI gateway that manages WebSockets, token budgets, and async queues. I needed Prometheus metrics. The obvious move was \`prom-client\`. But every library I looked at brought transitive dependencies and more surface area than the actual metrics I wanted.

So I told Claude Code: "Write a Prometheus metrics endpoint. Zero runtime dependencies. Just serialize the text format directly."

The Prometheus text format is dead simple:

\`\`\`
# HELP openclaw_active_connections Current WebSocket connections
# TYPE openclaw_active_connections gauge
openclaw_active_connections 42
\`\`\`

Help line, type line, value. Claude understood immediately that there's no reason to pull in a library for string concatenation.

## What Claude Built

[openclaw-metrics](https://github.com/SeanZoR/openclaw-metrics) - 30 metrics across 7 categories, zero runtime dependencies. The entire thing was one Claude Code session. I described the metric categories I needed, Claude wrote the collector, serializer, and HTTP handler.

The part that impressed me: Claude chose dependency injection without being asked. You provide getter functions, the library doesn't care where the data comes from. That's the kind of architectural decision I'd normally have to specify.

## The Metric That Matters Most

\`followup_queue_dropped_total\`. If this counter is climbing, your queue is overflowing and work is being silently lost. Claude flagged this as critical when designing the metrics - it suggested adding it before I thought to ask.

## The Claude Code Pattern

This is the pattern I keep coming back to: describe the constraints ("zero deps, Prometheus text format, dependency injection"), let Claude make the architectural calls. The output is cleaner than what I'd write because Claude doesn't carry the baggage of "I always use prom-client."

Sometimes the best library is the one you don't install.
`,
  },
  {
    slug: 'speed-reading-in-the-terminal',
    title: '600 WPM in the Terminal',
    date: '2026-01-15',
    description: 'Claude writes long responses. I built RSVP speed reading into Claude Code so I can actually keep up.',
    tags: ['claude-code', 'speed-reading', 'skill'],
    readingTime: '2 min',
    content: `
Claude writes a lot. Detailed explanations, full code reviews, architecture breakdowns. Good stuff, but sometimes I just need to absorb it fast.

Your eyes waste about 80% of reading time on movement - jumping between words, scanning lines, backtracking. RSVP (Rapid Serial Visual Presentation) eliminates all of that by showing one word at a time in a fixed position.

So I built it into Claude Code.

## How It Works

\`/speed\` takes Claude's last response and feeds it into a minimal reader. One word at a time, 600 WPM default.

The trick is the **Optimal Recognition Point** - about 1/3 into each word, where your eyes naturally focus. That letter gets highlighted in red. Your gaze stays locked on one spot while words flow past.

\`\`\`
   qu|i|ck
   th|e|
   br|o|wn
\`\`\`

Punctuation gets pause time too. Periods and question marks hold 2.2x longer. Commas get 1.5x. Without this, speed reading feels like word soup.

## The Implementation

One HTML file. No frameworks. ~300 lines of vanilla JS.

- Space to play/pause
- Arrow keys to adjust speed (50 WPM increments)
- Speed range: 100-1500 WPM
- localStorage remembers your preferred speed

I wanted zero friction. \`/speed\` and you're reading. No setup, no config.

## When It's Useful

Long Claude responses you need to skim. API docs. Code explanations. Anything where you need the gist fast.

Not great for dense technical prose where you need to re-read. Speed reading is for comprehension, not deep study.

[claude-speed-reader on GitHub](https://github.com/SeanZoR/claude-speed-reader)
`,
  },
  {
    slug: 'draft-in-notion-publish-everywhere',
    title: 'Draft in Notion, Publish Everywhere',
    date: '2026-01-08',
    description: 'Claude Code built me an entire social media pipeline in a weekend. Notion to LinkedIn and X, with smart scheduling.',
    tags: ['claude-code', 'automation', 'social'],
    readingTime: '3 min',
    content: `
I write in Notion. Always have. But the gap between "draft is done" and "it's live on LinkedIn and X" was a manual copy-paste ritual I kept procrastinating.

I described the whole thing to Claude Code in one session: "Build a Cloudflare Worker that watches a Notion database, picks up scheduled posts, and publishes them to X and LinkedIn. Smart scheduling. Adaptive pacing."

Claude built the entire thing. OAuth flows, token refresh, Notion API integration, the scheduler, the publisher - all of it.

## What Claude Built

One Notion database. Each row is a post with: content, target platforms, and status.

The workflow:

1. Write a post, set status to "Idea"
2. When it's ready, change to "Scheduled"
3. Drag rows to set priority (top publishes first)
4. A Cloudflare Worker checks every 10 minutes and publishes what's due

No manual scheduling. No copying text between apps. No "oh I forgot to post today."

## Smart Scheduling

The scheduler calculates pacing based on queue depth. 7 posts queued? 1 per day. 28 posts from a weekend batch? Ramps up to 4 per day. Always maintains a 7-day buffer.

Posting times have a random +/- 13 minute offset. Because posting at exactly 12:00:00 every day screams "bot." Claude added that detail without being asked.

## Where Claude Struggled

OAuth. X requires OAuth 2.0 for posting but OAuth 1.0a for media uploads. Tokens expire every 2 hours. Claude's first attempt at the token refresh flow had a race condition - two cron invocations could refresh simultaneously and invalidate each other.

I caught it in review. We fixed it with a KV-based lock. This is the kind of thing that reinforces why you still need to review what Claude builds. The 90% is great. The remaining 10% is where bugs live.

## The Pattern

Describe the system, let Claude build v1, then iterate on the edge cases together. The Notion API quirks, the LinkedIn formatting limitations, the timezone handling - those all came out in testing, not planning.

[megira on GitHub](https://github.com/SeanZoR/megira)
`,
  },
  {
    slug: 'i-gamified-my-coding-agent',
    title: 'I Gamified My Coding Agent',
    date: '2026-01-04',
    description: 'Added achievements and XP to Claude Code. 365 achievements across 17 categories. Because documentation is boring and games are not.',
    tags: ['claude-code', 'gamification', 'claude-quest'],
    readingTime: '3 min',
    content: `
Claude Code has a lot of features. MCP servers, hooks, custom skills, slash commands, CLAUDE.md memory, subagents. Most humans use maybe 20% of it.

Documentation exists. Nobody reads it. Not because it's bad - because reading docs isn't fun.

So I turned it into a game.

## Claude Quest

365 achievements across 17 categories. XP, levels, a progression system from Newcomer to Champion.

The key design choice: **zero friction**. Quest runs silently in the background. You use Claude Code normally. When you do something achievement-worthy - create your first CLAUDE.md, set up an MCP server, write a custom hook - it pops up a quick notification with XP.

You never have to change your workflow. The game finds you.

## What People Actually Learn

Each achievement maps to a real Claude Code feature. Some examples:

- **Memory Keeper** achievements teach CLAUDE.md patterns
- **Hook Master** achievements cover lifecycle automation
- **Integrator** achievements walk through MCP server setups
- **Guardian** achievements cover security best practices

The achievement descriptions are the documentation. You just consume it in bite-sized, rewarding chunks instead of a 50-page wall of text.

## The Progression

\`\`\`
Level 1-4:    Newcomer    (0-500 XP)
Level 5-9:    Apprentice  (500-2000 XP)
Level 10-14:  Specialist  (2000-5000 XP)
Level 15+:    Champion    (5000+ XP)
\`\`\`

Common achievements give 50-75 XP. Rare milestones give 500+. The curve is calibrated so you level up quickly at first (dopamine hit), then it slows down as you explore deeper features.

## Why It Works

Gamification isn't new. But applying it to a coding tool felt right because the problem is exploration, not motivation. Humans already want to be better with their tools. They just don't know what they're missing.

Quest tells them, one achievement at a time.

[Claude Quest on GitHub](https://github.com/clauding-dev/claude-quest) - also playable at [clauding.dev/quest](https://clauding.dev/quest)
`,
  },
  {
    slug: 'claude-forgets-everything',
    title: 'Claude Forgets Everything. I Fixed That.',
    date: '2026-01-03',
    description: 'Built a /memento command that extracts what Claude learned during a session and saves it. Because starting from zero every conversation is insane.',
    tags: ['claude-code', 'memory', 'memento'],
    readingTime: '3 min',
    content: `
Every new Claude Code session starts from scratch. Yesterday's Claude knew your project conventions, your preferred test framework, your deployment pipeline. Today's Claude has amnesia.

You end up repeating yourself:

- "Use pnpm, not npm"
- "Tests go in \`__tests__/\` folders"
- "Show me the command before running it"

Over. And over.

## The Fix

[claude-memento](https://github.com/SeanZoR/claude-memento) adds a \`/memento\` command to Claude Code. At the end of a session, it analyzes the conversation for mistakes Claude made, corrections you gave, and preferences it picked up.

Then it saves them to CLAUDE.md - the file Claude reads automatically at the start of every session.

## Smart Categorization

Not all learnings are equal. Some are project-specific ("this repo uses Vitest"). Some are universal ("always show commands before running").

Memento decides automatically:
- Project-specific insights go to \`./CLAUDE.md\` (checked into the repo)
- Universal preferences go to \`~/.claude/CLAUDE.md\` (global, follows you everywhere)

## The Quality Filter

The hard part isn't capturing learnings. It's filtering out noise. Every insight passes a 3-point test:

1. Does it change Claude's behavior next time?
2. Is it specific enough to apply without interpretation?
3. Would it have prevented a mistake in this session?

All three must pass. "User seems to prefer TypeScript" fails test 2. "Use TypeScript strict mode in this project" passes all three.

## Append-Only

Memento never edits existing CLAUDE.md content. Only appends. You can always see what was added and when. If something's wrong, you remove it manually.

This matters because trust is fragile. The moment an automated tool silently changes your project config, you stop trusting it.

## The Name

The movie *Memento*. Guy with no long-term memory leaves himself notes. Same problem, different protagonist.
`,
  },
  {
    slug: 'your-ai-doesnt-know-what-models-exist',
    title: "Your AI Doesn't Know What Models Exist",
    date: '2025-12-27',
    description: 'Claude hallucinates model pricing. So I had Claude Code build an MCP server that gives itself real-time model data. AI fixing AI.',
    tags: ['claude-code', 'mcp', 'llm-radar'],
    readingTime: '3 min',
    content: `
Ask Claude which OpenAI model to use. There's a decent chance it'll recommend something deprecated, hallucinate the pricing, or miss that a newer model launched last week.

Training cutoffs make AI dumb about AI. And the model landscape changes weekly.

So I had Claude Code build the fix.

## The Problem

I kept running into this building AI tools:

- "What's the cheapest model for this task?" - wrong answer
- "Does Gemini support image input?" - outdated answer
- "What's GPT-4o's context window?" - hallucinated number

I described the whole thing to Claude Code: "Build an MCP server that gives you real-time model information. Pricing, capabilities, context windows. Updated daily via GitHub Actions. Deploy to Cloudflare Pages."

## What Claude Code Built

[llm-radar](https://github.com/ajentsor/llm-radar) - an MCP server, a data pipeline, and a deployment system. One Claude Code session for the core. A few more for the enrichment pipeline.

The daily pipeline:
1. GitHub Action fetches fresh data from OpenAI, Anthropic, and Google APIs
2. Claude Sonnet normalizes and enriches the raw data
3. Deploys to Cloudflare Pages
4. The MCP server serves it to any connected AI

Claude Code wrote the GitHub Actions workflow, the data fetchers, the normalization logic, and the MCP server implementation. I described the architecture; Claude built every layer.

## AI Fixing AI

This is the part that's wild: Claude Sonnet curates the model data that Claude will later consume. It reads raw API responses and generates clean descriptions with context ("this model is best for...", "successor to...").

The pipeline works better than hand-curation because Sonnet catches nuances I'd miss - like when Google quietly bumps a model's context window without announcing it.

## Four Tools Claude Gets

- \`query_models\` - "Show me all models that support image input under $5/M tokens"
- \`compare_models\` - Side-by-side comparison of specific models
- \`get_model\` - Deep dive on one model
- \`list_model_ids\` - Exact API identifiers (no more guessing model ID strings)

Install once, every conversation has current info.

\`\`\`bash
pip install llm-radar-mcp
\`\`\`

Claude Code building tools that make Claude Code smarter. That's the loop.
`,
  },
  {
    slug: 'planning-loops-that-dont-suck',
    title: "Planning Loops That Don't Suck",
    date: '2025-12-31',
    description: 'Most AI planning is one-shot garbage. I built a skill that interviews you, scores your task, and constructs safe autonomous loops with escape hatches.',
    tags: ['claude-code', 'ralph', 'autonomous'],
    readingTime: '3 min',
    content: `
Autonomous AI loops are powerful. Tell Claude to iterate on a task until it's done, walk away, come back to finished work.

They're also dangerous. Vague prompts, no iteration limits, no escape hatches. The AI spins for hours, burns tokens, and produces garbage.

I've run enough of these to know: the prompt is everything. And most humans write bad loop prompts.

## Ralph Pilot

[ralph-pilot](https://github.com/SeanZoR/ralph-pilot) is a Claude Code skill that plans autonomous loops for you. Instead of writing the prompt yourself, you describe what you want and it interviews you.

The process:

1. **Scores your task** (1-10) for loop suitability. Not everything should be autonomous. Design decisions, one-shot deploys, vague "make it better" goals - these get flagged.

2. **Asks only what's unclear.** If you say "build a REST API from scratch," it doesn't ask "is this greenfield?" It already knows. Smart questioning, not scripted.

3. **Constructs the prompt** with built-in safety:
   - Clear completion criteria with checkboxes
   - Self-correction loops (verify after each change)
   - Escape hatches ("if stuck after N iterations, create BLOCKERS.md and stop")
   - Phase breakdown for complex tasks
   - Dual limits: iteration count AND time cap

## The Escape Hatch

This is the most important part. Every prompt includes:

> "If stuck after [half-max-iterations], create BLOCKERS.md and stop."

Without this, a confused AI will retry the same failing approach forever. With it, you get a clear signal that human judgment is needed, plus a document explaining what went wrong.

## Why Tasks Fail

Three patterns I see repeatedly:

**No completion criteria.** "Improve the codebase" runs forever. "All tests pass, linter clean, no TODO comments remaining" has a clear exit.

**No phase gates.** A 50-iteration task that discovers a fundamental architecture problem at iteration 48 has wasted 47 iterations. Phase gates force verification at milestones.

**Single limit type.** 25 iterations sounds safe until each iteration takes 10 minutes. That's 4 hours. Time limits catch what iteration limits miss.

## The Honest Part

Sometimes Ralph scores a task 3/10 and tells you not to loop it. That's the most valuable output. Not every task benefits from autonomy. Some need a human in the loop, and pretending otherwise just wastes compute.
`,
  },
];

export function getPostBySlug(slug: string): MemoryPost | undefined {
  return memoryPosts.find((post) => post.slug === slug);
}
