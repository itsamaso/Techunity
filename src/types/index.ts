export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption?: string;
  file?: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption?: string;
  imageId: string;
  imageUrl: string;
  file?: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IFollow = {
  followerId: string;
  followingId: string;
};

// Chat Types
export type IChat = {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: string[];
  createdBy: string;
  admins?: string[];
  description?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  groupImageUrl?: string;
  groupImageId?: string;
  createdAt: string;
  updatedAt: string;
};

export type IMessage = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  createdAt: string;
  updatedAt: string;
};

export type INewChat = {
  name: string;
  type: 'direct' | 'group';
  participants: string[];
  createdBy: string;
  admins?: string[];
  description?: string;
  groupImageUrl?: string;
  groupImageId?: string;
};

export type INewMessage = {
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
};

// ============================================================
// CODING CHALLENGES SYSTEM
// ============================================================

export type IChallenge = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'arrays' | 'strings' | 'math' | 'logic' | 'loops' | 'functions';
  points: number;
  testCases: ITestCase[];
  starterCode: string;
  solution: string;
  hints: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type ITestCase = {
  input: string;
  expectedOutput: string;
  description?: string;
};

export type IUserChallengeAttempt = {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  isCorrect: boolean;
  executionTime?: number;
  memoryUsage?: number;
  submittedAt: string;
  language: 'javascript' | 'python' | 'java' | 'cpp';
};

export type IUserProgress = {
  id: string;
  userId: string;
  totalChallengesSolved: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  challengesByDifficulty: string;
  challengesByCategory: string;
  achievements: string[];
  level: number;
  experience: number;
};

export type IAchievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'category' | 'special';
  requirement: {
    type: 'challenges_solved' | 'points_earned' | 'streak_days' | 'category_mastery' | 'perfect_score' | 'daily_activity';
    value: number;
    category?: string;
  };
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export type INewChallenge = {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'arrays' | 'strings' | 'math' | 'logic' | 'loops' | 'functions';
  points: number;
  testCases: Omit<ITestCase, 'id'>[];
  starterCode: string;
  solution: string;
  hints: string[];
  tags: string[];
};

export type INewUserChallengeAttempt = {
  userId: string;
  challengeId: string;
  code: string;
  language: 'javascript' | 'python' | 'java' | 'cpp';
};
