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
});

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
