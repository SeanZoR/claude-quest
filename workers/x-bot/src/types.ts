export interface Env {
  QUEST_BOT_STATE: KVNamespace;
  X_API_KEY: string;
  X_API_SECRET: string;
  X_ACCESS_TOKEN: string;
  X_ACCESS_TOKEN_SECRET: string;
  SITE_URL: string;
}

export type DetectionType =
  | 'file_contains'
  | 'file_exists'
  | 'directory_exists'
  | 'directory_has_files'
  | 'config_has_key'
  | 'config_count'
  | 'milestone'
  | 'manual'
  | 'secret';

export interface Detection {
  type: DetectionType;
  paths?: string[];
  path?: string;
  files?: string[];
  pattern?: string;
  key?: string;
  min_count?: number;
  min_matches?: number;
  require_all?: boolean;
  trigger?: string;
  milestone_type?: string;
  days?: number;
  count?: number;
}

export type Category =
  | 'memory'
  | 'commands'
  | 'skills'
  | 'agents'
  | 'hooks'
  | 'integrations'
  | 'workflow'
  | 'milestones'
  | 'automation'
  | 'collaboration'
  | 'performance'
  | 'security'
  | 'ai-mastery'
  | 'customization'
  | 'testing'
  | 'documentation'
  | 'secrets';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Achievement content types for educational content
export interface CodeBlock {
  language: string;
  content: string;
  filename?: string;
}

export interface Step {
  instruction: string;
  code?: CodeBlock;
  note?: string;
}

export interface HowToGuide {
  summary: string;
  steps: Step[];
  estimatedTime?: string;
}

export interface Example {
  title: string;
  description?: string;
  code: CodeBlock;
  explanation?: string;
}

export interface AchievementContent {
  longDescription: string;
  whyItMatters: string;
  difficulty: Difficulty;
  howTo: HowToGuide;
  examples: Example[];
  tips?: string[];
  gotchas?: string[];
  relatedAchievements?: string[];
  hints?: string[];
  tags?: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: Category;
  xp: number;
  rarity: Rarity;
  detection: Detection;
}

export interface AchievementContentData {
  version: string;
  content: Record<string, AchievementContent>;
}

export interface AchievementsData {
  version: string;
  total_achievements: number;
  categories: Category[];
  achievements: Achievement[];
}

export type TweetFormat = 'daily_tip' | 'did_you_know' | 'problem_solution' | 'tutorial_thread' | 'til';

export interface TweetThread {
  main: string;
  replies: string[];
}

export interface BotState {
  postedIds: string[];
  lastPostedId?: string;
  lastPostedAt?: string;
  cycleCount: number;
}
