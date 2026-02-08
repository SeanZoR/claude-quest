import type { Achievement, Category, Rarity, Detection, TweetFormat, TweetThread } from './types';

const CATEGORY_EMOJI: Record<Category, string> = {
  'memory': '📝',
  'commands': '🛠️',
  'skills': '✨',
  'agents': '🤖',
  'hooks': '🎣',
  'integrations': '🔌',
  'workflow': '🔄',
  'milestones': '👑',
  'automation': '⚡',
  'collaboration': '🤝',
  'performance': '🚀',
  'security': '🛡️',
  'ai-mastery': '🧠',
  'customization': '🎨',
  'testing': '🧪',
  'documentation': '📚',
  'secrets': '🔮',
};

const CATEGORY_NAME: Record<Category, string> = {
  'memory': 'Memory',
  'commands': 'Commands',
  'skills': 'Skills',
  'agents': 'Agents',
  'hooks': 'Hooks',
  'integrations': 'Integrations',
  'workflow': 'Workflow',
  'milestones': 'Milestones',
  'automation': 'Automation',
  'collaboration': 'Collaboration',
  'performance': 'Performance',
  'security': 'Security',
  'ai-mastery': 'AI Mastery',
  'customization': 'Customization',
  'testing': 'Testing',
  'documentation': 'Documentation',
  'secrets': 'Secrets',
};

const RARITY_EMOJI: Record<Rarity, string> = {
  'common': '⚪',
  'uncommon': '🟢',
  'rare': '🔵',
  'epic': '🟣',
  'legendary': '🟡',
};

/**
 * Select the best tweet format based on achievement category and content
 */
function selectFormat(achievement: Achievement): TweetFormat {
  const { category, detection } = achievement;

  // Secret achievements get discovery format
  if (category === 'secrets' || detection.type === 'secret') {
    return 'did_you_know';
  }

  // Milestones get celebratory TIL format
  if (category === 'milestones') {
    return 'til';
  }

  // Complex integrations and agents get tutorial threads
  if (category === 'integrations' || category === 'agents') {
    return 'tutorial_thread';
  }

  // Workflow and performance improvements address pain points
  if (category === 'workflow' || category === 'performance') {
    return 'problem_solution';
  }

  // Technical config achievements get daily tip format
  if (['memory', 'commands', 'hooks', 'skills', 'automation'].includes(category)) {
    return 'daily_tip';
  }

  // Default based on description length - longer = tutorial, shorter = TIL
  if (achievement.description.length > 50) {
    return 'daily_tip';
  }

  return 'til';
}

/**
 * Generate step-by-step tutorial from detection config
 */
function generateTutorial(detection: Detection, description: string): string {
  switch (detection.type) {
    case 'file_contains': {
      const pattern = detection.pattern || '';
      return `How to do it:

1. Open your CLAUDE.md file (or create one)
2. Add content that includes: ${pattern.replace(/[\\^$]/g, '')}
3. Save the file

Claude reads CLAUDE.md at the start of every conversation, so your preferences persist!`;
    }

    case 'file_exists': {
      const paths = detection.paths || [detection.path];
      const formatted = paths?.map(p => p?.replace('~/.claude/', '~/.claude/').replace('./', './')).filter(Boolean);
      if (detection.require_all) {
        return `How to do it:

1. Create ~/.claude/CLAUDE.md for global preferences
2. Create ./CLAUDE.md in your project for project-specific rules
3. Claude merges both for the best context!`;
      }
      return `How to do it:

1. Create the file: ${formatted?.[0]}
2. Add your preferences and instructions
3. Claude will read it automatically`;
    }

    case 'directory_has_files': {
      const count = detection.min_count || 1;
      const dir = detection.path || 'the directory';
      return `How to do it:

1. Navigate to ${dir}
2. Create ${count}+ files with your custom content
3. Build your library of reusable components!`;
    }

    case 'config_has_key':
      return `How to do it:

1. Open Claude Code settings
2. Add "${detection.key}" to your config
3. Restart Claude Code to apply`;

    case 'manual': {
      const trigger = detection.trigger || description;
      return `How to do it:

Just tell Claude:
"${trigger}"

Claude will handle the rest automatically!`;
    }

    case 'milestone':
      return `How to unlock:

Keep using Claude Code! This achievement unlocks naturally as you build your skills.`;

    case 'secret':
      return `🔮 This is a hidden achievement...

Keep exploring Claude Code to discover it!`;

    default:
      return `Try it:

${description}`;
  }
}

/**
 * Format as Daily Tip (education-first, no achievement references)
 */
function formatDailyTip(achievement: Achievement, siteUrl: string): TweetThread {
  const emoji = CATEGORY_EMOJI[achievement.category];
  const howTo = generateTutorial(achievement.detection, achievement.description);

  // First tweet: Pure education, no gamification
  const main = `${emoji} Claude Code Tip

${achievement.description}

${howTo}`;

  // Second tweet: Achievement reference + CTA
  const reply = `🎮 This is the "${achievement.name}" achievement (+${achievement.xp} XP)

Track your Claude Code mastery with Claude Quest - 365 achievements to discover.

${siteUrl}/achievement/${achievement.id}

#ClaudeCode #AI`;

  return { main, replies: [reply] };
}

/**
 * Format as "Did You Know?" (discovery, education-first)
 */
function formatDidYouKnow(achievement: Achievement, siteUrl: string): TweetThread {
  const emoji = CATEGORY_EMOJI[achievement.category];

  // First tweet: Pure discovery/education
  const main = `${emoji} Did you know?

${achievement.description}

${generateTutorial(achievement.detection, achievement.description)}`;

  // Second tweet: Achievement + CTA
  const reply = `🎮 "${achievement.name}" achievement (+${achievement.xp} XP)

Discover all 365 Claude Code achievements with Claude Quest.

${siteUrl}/achievement/${achievement.id}

#ClaudeCode #AI`;

  return { main, replies: [reply] };
}

/**
 * Format as Problem → Solution (education-first)
 */
function formatProblemSolution(achievement: Achievement, siteUrl: string): TweetThread {
  const emoji = CATEGORY_EMOJI[achievement.category];
  const problems: Record<Category, string> = {
    'workflow': 'Wish your Claude Code workflow was smoother?',
    'performance': 'Want Claude to work faster and smarter?',
    'automation': 'Tired of repetitive tasks?',
    'collaboration': 'Working with a team on Claude projects?',
    'security': 'Concerned about security in your AI workflow?',
    'memory': 'Claude forgetting your preferences?',
    'commands': 'Want quick access to common actions?',
    'skills': 'Need Claude to learn new tricks?',
    'agents': 'Want Claude to handle complex tasks autonomously?',
    'hooks': 'Need to automate around Claude actions?',
    'integrations': 'Want Claude to connect with your tools?',
    'milestones': 'Ready to level up?',
    'ai-mastery': 'Want to get more from AI?',
    'customization': 'Claude not fitting your style?',
    'testing': 'Need reliable code from Claude?',
    'documentation': 'Documentation getting messy?',
    'secrets': 'Looking for hidden features?',
  };

  const problem = problems[achievement.category] || 'Want to improve your Claude Code experience?';

  // First tweet: Problem + solution (pure education)
  const main = `${emoji} ${problem}

Here's how: ${achievement.description.toLowerCase()}

${generateTutorial(achievement.detection, achievement.description)}`;

  // Second tweet: Achievement + CTA
  const reply = `🎮 "${achievement.name}" achievement (+${achievement.xp} XP)

Track your Claude Code mastery with Claude Quest.

${siteUrl}/achievement/${achievement.id}

#ClaudeCode #AI`;

  return { main, replies: [reply] };
}

/**
 * Format as Tutorial Thread (multi-tweet, education-first)
 */
function formatTutorialThread(achievement: Achievement, siteUrl: string): TweetThread {
  const emoji = CATEGORY_EMOJI[achievement.category];
  const howTo = generateTutorial(achievement.detection, achievement.description);

  // First tweet: Pure intro (no achievement name)
  const main = `${emoji} Claude Code Tutorial

${achievement.description}

Here's how 🧵`;

  // Second tweet: The actual tutorial steps
  const step1 = `${howTo}

This teaches you a key ${CATEGORY_NAME[achievement.category].toLowerCase()} pattern in Claude Code.`;

  // Third tweet: Achievement reference + CTA
  const cta = `🎮 "${achievement.name}" achievement (+${achievement.xp} XP)

Master all 365 Claude Code achievements with Claude Quest.

${siteUrl}/achievement/${achievement.id}

#ClaudeCode #AI`;

  return { main, replies: [step1, cta] };
}

/**
 * Format as TIL (Today I Learned) - short and punchy, education-first
 */
function formatTIL(achievement: Achievement, siteUrl: string): TweetThread {
  const emoji = CATEGORY_EMOJI[achievement.category];
  const howTo = generateTutorial(achievement.detection, achievement.description);

  // First tweet: Pure TIL education
  const main = `${emoji} TIL in Claude Code:

${achievement.description}

${howTo}`;

  // Second tweet: Achievement + CTA
  const reply = `🎮 "${achievement.name}" achievement (+${achievement.xp} XP)

Track your Claude Code journey with Claude Quest.

${siteUrl}/achievement/${achievement.id}

#ClaudeCode #AI`;

  return { main, replies: [reply] };
}

/**
 * Generate a tweet thread for an achievement
 * Automatically selects the best format based on the achievement
 */
export function generateTweetThread(achievement: Achievement, siteUrl: string): TweetThread {
  const format = selectFormat(achievement);

  switch (format) {
    case 'daily_tip':
      return formatDailyTip(achievement, siteUrl);
    case 'did_you_know':
      return formatDidYouKnow(achievement, siteUrl);
    case 'problem_solution':
      return formatProblemSolution(achievement, siteUrl);
    case 'tutorial_thread':
      return formatTutorialThread(achievement, siteUrl);
    case 'til':
      return formatTIL(achievement, siteUrl);
    default:
      return formatDailyTip(achievement, siteUrl);
  }
}

/**
 * Validate tweet length (280 char limit)
 */
export function validateTweetLength(text: string): boolean {
  return text.length <= 280;
}

/**
 * Truncate text to fit tweet limit with ellipsis
 */
export function truncateForTweet(text: string, maxLength = 277): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
