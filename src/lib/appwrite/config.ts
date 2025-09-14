import { Client, Account, Databases, Storage, Avatars } from "appwrite";

// Validate environment variables
const requiredEnvVars = {
  VITE_APPWRITE_URL: import.meta.env.VITE_APPWRITE_URL,
  VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  VITE_APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  VITE_APPWRITE_STORAGE_ID: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  VITE_APPWRITE_USER_COLLECTION_ID: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  VITE_APPWRITE_POST_COLLECTION_ID: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
  VITE_APPWRITE_SAVES_COLLECTION_ID: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
  VITE_APPWRITE_FOLLOWS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_FOLLOWS_COLLECTION_ID,
  VITE_APPWRITE_CHATS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_CHATS_COLLECTION_ID,
  VITE_APPWRITE_MESSAGES_COLLECTION_ID: import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
  VITE_APPWRITE_COMMENTS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,
};

// Optional environment variables for coding challenges
const optionalEnvVars = {
  VITE_APPWRITE_CHALLENGES_COLLECTION_ID: import.meta.env.VITE_APPWRITE_CHALLENGES_COLLECTION_ID,
  VITE_APPWRITE_CHALLENGE_ATTEMPTS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_CHALLENGE_ATTEMPTS_COLLECTION_ID,
  VITE_APPWRITE_USER_PROGRESS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_USER_PROGRESS_COLLECTION_ID,
  VITE_APPWRITE_ACHIEVEMENTS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_ACHIEVEMENTS_COLLECTION_ID,
};

// Check for missing environment variables
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file or environment configuration');
}

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
  followsCollectionId: import.meta.env.VITE_APPWRITE_FOLLOWS_COLLECTION_ID,
  chatsCollectionId: import.meta.env.VITE_APPWRITE_CHATS_COLLECTION_ID,
  messagesCollectionId: import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
  commentsCollectionId: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,
  // Optional collections for coding challenges
  challengesCollectionId: optionalEnvVars.VITE_APPWRITE_CHALLENGES_COLLECTION_ID,
  challengeAttemptsCollectionId: optionalEnvVars.VITE_APPWRITE_CHALLENGE_ATTEMPTS_COLLECTION_ID,
  userProgressCollectionId: optionalEnvVars.VITE_APPWRITE_USER_PROGRESS_COLLECTION_ID,
  achievementsCollectionId: optionalEnvVars.VITE_APPWRITE_ACHIEVEMENTS_COLLECTION_ID,
};

// Log configuration (without sensitive data)
console.log('Appwrite Config:', {
  url: appwriteConfig.url,
  projectId: appwriteConfig.projectId,
  databaseId: appwriteConfig.databaseId,
  storageId: appwriteConfig.storageId,
  userCollectionId: appwriteConfig.userCollectionId,
  postCollectionId: appwriteConfig.postCollectionId,
  savesCollectionId: appwriteConfig.savesCollectionId,
  followsCollectionId: appwriteConfig.followsCollectionId,
  chatsCollectionId: appwriteConfig.chatsCollectionId,
  messagesCollectionId: appwriteConfig.messagesCollectionId,
  commentsCollectionId: appwriteConfig.commentsCollectionId,
  challengesCollectionId: appwriteConfig.challengesCollectionId,
  challengeAttemptsCollectionId: appwriteConfig.challengeAttemptsCollectionId,
  userProgressCollectionId: appwriteConfig.userProgressCollectionId,
  achievementsCollectionId: appwriteConfig.achievementsCollectionId,
});

// Check if chat collections are properly configured
if (!appwriteConfig.chatsCollectionId) {
  console.error('VITE_APPWRITE_CHATS_COLLECTION_ID is not set!');
}
if (!appwriteConfig.messagesCollectionId) {
  console.error('VITE_APPWRITE_MESSAGES_COLLECTION_ID is not set!');
}

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
