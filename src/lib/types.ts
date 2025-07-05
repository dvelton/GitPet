export type PetMood = 'ecstatic' | 'happy' | 'content' | 'neutral' | 'sad' | 'disappointed';

export type PetEnergy = 'supercharged' | 'energetic' | 'normal' | 'tired' | 'exhausted';

export type PetGrowth = 'baby' | 'young' | 'adult' | 'senior';

export type PetType = 'octocat' | 'fox' | 'blob';

export type ActivityType = 
  | 'commit'
  | 'pr_open'
  | 'pr_review'
  | 'pr_merge'
  | 'issue_open'
  | 'issue_close'
  | 'documentation'
  | 'broken_build'
  | 'inactivity';

export interface PetState {
  name: string;
  type: PetType;
  mood: PetMood;
  energy: PetEnergy;
  growth: PetGrowth;
  stats: {
    happiness: number;
    energy: number;
    growth: number;
    consistency: number;
  };
  lastActivity: string | null;
  streakDays: number;
  totalActivities: number;
  traits: string[];
}

export interface ActivityLog {
  type: ActivityType;
  timestamp: string;
  description: string;
}

export interface PetPersonality {
  traitResponses: Record<string, string[]>;
  favoriteActivities: ActivityType[];
  dislikedActivities: ActivityType[];
}