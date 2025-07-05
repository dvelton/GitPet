import { differenceInDays, parseISO } from 'date-fns';
import { ActivityLog, ActivityType, PetEnergy, PetGrowth, PetMood, PetPersonality, PetState, PetType } from './types';

const PET_TYPES: PetType[] = ['octocat', 'fox', 'blob'];
const TRAIT_LIST = [
  'curious', 'playful', 'serious', 'sleepy', 'energetic', 'analytical',
  'perfectionist', 'laid-back', 'adventurous', 'thoughtful'
];

export function createNewPet(name: string): PetState {
  const type = PET_TYPES[Math.floor(Math.random() * PET_TYPES.length)];
  const traits = getRandomTraits(2);
  
  return {
    name,
    type,
    mood: 'content',
    energy: 'normal',
    growth: 'baby',
    stats: {
      happiness: 70,
      energy: 70,
      growth: 0,
      consistency: 50
    },
    lastActivity: null,
    streakDays: 0,
    totalActivities: 0,
    traits
  };
}

function getRandomTraits(count: number): string[] {
  const shuffled = [...TRAIT_LIST].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function createPetPersonality(traits: string[]): PetPersonality {
  const traitResponses: Record<string, string[]> = {
    curious: [
      "Your pet seems fascinated by this new code!",
      "Curiosity sparks in your pet's eyes as it examines your work."
    ],
    playful: [
      "Your pet bounces excitedly at your coding activity!",
      "Your pet playfully interacts with your latest commit."
    ],
    serious: [
      "Your pet nods approvingly at your consistent work.",
      "With a serious expression, your pet evaluates your code quality."
    ],
    sleepy: [
      "Your pet yawns but acknowledges your progress.",
      "Despite being a bit sleepy, your pet appreciates your work."
    ],
    energetic: [
      "Your pet zooms around excitedly at your latest activity!",
      "Energy radiates from your pet as you complete tasks!"
    ],
    analytical: [
      "Your pet carefully analyzes your code patterns.",
      "With careful consideration, your pet approves of your methods."
    ],
    perfectionist: [
      "Your pet seems to be checking your code for any inconsistencies.",
      "That missing semicolon bothers your perfectionist pet."
    ],
    'laid-back': [
      "Your pet casually acknowledges your progress.",
      "With a relaxed attitude, your pet celebrates your achievements."
    ],
    adventurous: [
      "Your pet seems excited by your experimentation with new technologies!",
      "The bold changes in your code delight your adventurous pet."
    ],
    thoughtful: [
      "Your pet contemplates the elegance of your solution.",
      "With thoughtful eyes, your pet appreciates your careful coding."
    ]
  };

  // Generate favorite and disliked activities based on traits
  const activityTypes: ActivityType[] = [
    'commit', 'pr_open', 'pr_review', 'pr_merge',
    'issue_open', 'issue_close', 'documentation'
  ];
  
  const shuffled = [...activityTypes].sort(() => 0.5 - Math.random());
  const favoriteActivities = shuffled.slice(0, 2);
  const dislikedActivities = shuffled.slice(2, 3);
  
  return {
    traitResponses,
    favoriteActivities,
    dislikedActivities
  };
}

export function updatePetState(
  currentState: PetState,
  activityLogs: ActivityLog[],
  personality: PetPersonality
): PetState {
  const newState = { ...currentState };
  
  // Calculate basic stats based on activity
  if (activityLogs.length === 0) {
    // Handle inactivity
    decreaseStats(newState, 'inactivity');
  } else {
    // Process each activity and update stats accordingly
    activityLogs.forEach(activity => {
      updateStatsForActivity(newState, activity.type, personality);
    });
  }
  
  // Calculate streak days
  if (newState.lastActivity) {
    const today = new Date();
    const lastActivity = parseISO(newState.lastActivity);
    const daysSinceActivity = differenceInDays(today, lastActivity);
    
    if (daysSinceActivity <= 1) {
      newState.streakDays = newState.streakDays + 1;
    } else if (daysSinceActivity > 2) {
      newState.streakDays = 0;
    }
  }
  
  // Update mood based on happiness stat
  newState.mood = calculateMood(newState.stats.happiness);
  
  // Update energy based on energy stat
  newState.energy = calculateEnergy(newState.stats.energy);
  
  // Update growth stage based on total activities and growth stat
  newState.growth = calculateGrowthStage(newState.stats.growth, newState.totalActivities);
  
  // Update last activity timestamp
  if (activityLogs.length > 0) {
    newState.lastActivity = new Date().toISOString();
    newState.totalActivities += activityLogs.length;
  }
  
  return newState;
}

function updateStatsForActivity(
  petState: PetState,
  activityType: ActivityType,
  personality: PetPersonality
): void {
  const statChanges = {
    commit: { happiness: 5, energy: -2, growth: 2, consistency: 3 },
    pr_open: { happiness: 8, energy: -5, growth: 5, consistency: 5 },
    pr_review: { happiness: 10, energy: -3, growth: 3, consistency: 8 },
    pr_merge: { happiness: 15, energy: 10, growth: 10, consistency: 5 },
    issue_open: { happiness: 3, energy: -1, growth: 1, consistency: 2 },
    issue_close: { happiness: 8, energy: 5, growth: 3, consistency: 5 },
    documentation: { happiness: 10, energy: -2, growth: 2, consistency: 10 },
    broken_build: { happiness: -10, energy: -8, growth: -2, consistency: -15 },
    inactivity: { happiness: -5, energy: 3, growth: -2, consistency: -10 }
  };
  
  const changes = statChanges[activityType];
  
  // Apply modifiers based on personality
  let happinessModifier = 1;
  let energyModifier = 1;
  
  if (personality.favoriteActivities.includes(activityType)) {
    happinessModifier = 1.5;
  } else if (personality.dislikedActivities.includes(activityType)) {
    happinessModifier = 0.5;
  }
  
  // Apply changes with modifiers
  petState.stats.happiness = clamp(
    petState.stats.happiness + changes.happiness * happinessModifier, 
    0, 
    100
  );
  
  petState.stats.energy = clamp(
    petState.stats.energy + changes.energy * energyModifier, 
    0, 
    100
  );
  
  petState.stats.growth = clamp(
    petState.stats.growth + changes.growth, 
    0, 
    100
  );
  
  petState.stats.consistency = clamp(
    petState.stats.consistency + changes.consistency, 
    0, 
    100
  );
}

function decreaseStats(petState: PetState, reason: ActivityType): void {
  const inactivityChanges = {
    happiness: -5,
    energy: 3,
    growth: -2,
    consistency: -10
  };
  
  petState.stats.happiness = clamp(
    petState.stats.happiness + inactivityChanges.happiness, 
    0, 
    100
  );
  
  petState.stats.energy = clamp(
    petState.stats.energy + inactivityChanges.energy, 
    0, 
    100
  );
  
  petState.stats.growth = clamp(
    petState.stats.growth + inactivityChanges.growth, 
    0, 
    100
  );
  
  petState.stats.consistency = clamp(
    petState.stats.consistency + inactivityChanges.consistency, 
    0, 
    100
  );
}

function calculateMood(happiness: number): PetMood {
  if (happiness >= 90) return 'ecstatic';
  if (happiness >= 70) return 'happy';
  if (happiness >= 50) return 'content';
  if (happiness >= 30) return 'neutral';
  if (happiness >= 10) return 'sad';
  return 'disappointed';
}

function calculateEnergy(energy: number): PetEnergy {
  if (energy >= 90) return 'supercharged';
  if (energy >= 70) return 'energetic';
  if (energy >= 40) return 'normal';
  if (energy >= 20) return 'tired';
  return 'exhausted';
}

function calculateGrowthStage(growth: number, totalActivities: number): PetGrowth {
  if (totalActivities >= 100 || growth >= 90) return 'senior';
  if (totalActivities >= 50 || growth >= 60) return 'adult';
  if (totalActivities >= 10 || growth >= 30) return 'young';
  return 'baby';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getReactionForActivity(
  petState: PetState,
  activityType: ActivityType,
  personality: PetPersonality
): string {
  // First, check if it's a favorite or disliked activity
  if (personality.favoriteActivities.includes(activityType)) {
    return `${petState.name} is delighted by this ${getActivityName(activityType)}!`;
  }
  
  if (personality.dislikedActivities.includes(activityType)) {
    return `${petState.name} seems less excited about this ${getActivityName(activityType)}.`;
  }
  
  // Otherwise, return a trait-based response
  const trait = petState.traits[Math.floor(Math.random() * petState.traits.length)];
  const responses = personality.traitResponses[trait];
  
  if (responses && responses.length > 0) {
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Default responses by activity
  const defaultResponses: Record<ActivityType, string[]> = {
    commit: [
      "Your pet acknowledges your commit with interest.",
      "A small nod from your pet for your latest commit."
    ],
    pr_open: [
      "Your pet watches with anticipation as you open a PR.",
      "The PR submission catches your pet's attention."
    ],
    pr_review: [
      "Your pet appreciates your thorough code review.",
      "Reviewing PRs makes your pet respect you more."
    ],
    pr_merge: [
      "Your pet celebrates as the PR is merged!",
      "A successful merge makes your pet jump with joy!"
    ],
    issue_open: [
      "Your pet tilts its head at the new issue you've found.",
      "Identifying problems impresses your observant pet."
    ],
    issue_close: [
      "Your pet seems satisfied seeing the issue resolved.",
      "Closing issues brings a sense of completion to your pet."
    ],
    documentation: [
      "Your pet nods approvingly at your documentation efforts.",
      "Good documentation makes your pet extra happy!"
    ],
    broken_build: [
      "Your pet looks concerned about the broken build.",
      "A slight sigh from your pet at the failing tests."
    ],
    inactivity: [
      "Your pet looks a bit lonely from your absence.",
      "Your pet gazes sadly at the calendar, missing your activity."
    ]
  };
  
  const responses = defaultResponses[activityType];
  return responses[Math.floor(Math.random() * responses.length)];
}

function getActivityName(type: ActivityType): string {
  const names: Record<ActivityType, string> = {
    commit: "commit",
    pr_open: "pull request",
    pr_review: "code review",
    pr_merge: "merged PR",
    issue_open: "issue report",
    issue_close: "issue resolution",
    documentation: "documentation",
    broken_build: "broken build",
    inactivity: "inactivity"
  };
  
  return names[type];
}

// For demo purposes, generate random GitHub activity
export function generateRandomActivity(): ActivityLog {
  const activities: ActivityType[] = [
    'commit', 'pr_open', 'pr_review', 'pr_merge',
    'issue_open', 'issue_close', 'documentation'
  ];
  
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  const timestamp = new Date().toISOString();
  
  const descriptions: Record<ActivityType, string[]> = {
    commit: [
      "Added new feature X",
      "Fixed bug in authentication flow",
      "Refactored database queries for performance",
      "Updated dependencies"
    ],
    pr_open: [
      "Feature: User profile page",
      "Fix: Broken login on Safari",
      "Enhancement: Improved form validation",
      "Refactor: Reorganize component structure"
    ],
    pr_review: [
      "Reviewed authentication changes",
      "Approved UI updates PR",
      "Requested changes to error handling",
      "Left comments on code style"
    ],
    pr_merge: [
      "Merged feature branch into main",
      "Completed integration of payment system",
      "Finalized new UI components",
      "Deployed hotfix to production"
    ],
    issue_open: [
      "Bug: Users can't reset password",
      "Enhancement: Add dark mode support",
      "Performance: Slow loading on mobile devices",
      "Security: Update deprecated library"
    ],
    issue_close: [
      "Fixed: Password reset functionality",
      "Implemented: Dark mode support",
      "Optimized: Mobile performance",
      "Updated: All security vulnerabilities addressed"
    ],
    documentation: [
      "Updated API documentation",
      "Added JSDoc comments to core functions",
      "Created onboarding guide for new developers",
      "Documented database schema"
    ],
    broken_build: [
      "Build failed: Missing dependency",
      "Tests failing on CI pipeline",
      "Deployment failed due to environment variables",
      "Integration tests breaking on main branch"
    ],
    inactivity: [
      "No activity detected for several days",
      "Project seems to be on hold",
      "Waiting for feedback or next steps",
      "Development paused temporarily"
    ]
  };
  
  const randomDescription = descriptions[randomActivity][
    Math.floor(Math.random() * descriptions[randomActivity].length)
  ];
  
  return {
    type: randomActivity,
    timestamp,
    description: randomDescription
  };
}