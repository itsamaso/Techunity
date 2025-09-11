# Coding Challenges System Setup Guide

The coding challenges system requires additional Appwrite collections to be created. Follow these steps to set up the required collections:

## Required Environment Variables

Add these environment variables to your `.env` file:

```env
# Coding Challenges Collections
VITE_APPWRITE_CHALLENGES_COLLECTION_ID=your_challenges_collection_id
VITE_APPWRITE_CHALLENGE_ATTEMPTS_COLLECTION_ID=your_challenge_attempts_collection_id
VITE_APPWRITE_USER_PROGRESS_COLLECTION_ID=your_user_progress_collection_id
VITE_APPWRITE_ACHIEVEMENTS_COLLECTION_ID=your_achievements_collection_id
```

## Collection Setup Instructions

### 1. Challenges Collection

**Collection ID:** `challenges`

**Attributes:**
- `title` (String, 255 characters, required)
- `description` (String, 1000 characters, required)
- `difficulty` (String, 10 characters, required) - Values: "easy", "medium", "hard"
- `category` (String, 20 characters, required) - Values: "arrays", "strings", "math", "logic", "loops", "functions"
- `points` (Integer, required)
- `testCases` (String, 2000 characters, required) - JSON string of test cases
- `starterCode` (String, 2000 characters, required)
- `solution` (String, 2000 characters, required)
- `hints` (String, 1000 characters, required) - JSON string of hints array
- `tags` (String, 500 characters, required) - JSON string of tags array

**Indexes:**
- `difficulty` (key: difficulty, type: key, attributes: [difficulty])
- `category` (key: category, type: key, attributes: [category])
- `createdAt` (key: createdAt, type: key, attributes: [$createdAt])

**Permissions:**
- Read: Any
- Create: Users
- Update: Users
- Delete: Users

### 2. Challenge Attempts Collection

**Collection ID:** `challenge_attempts`

**Attributes:**
- `userId` (String, 255 characters, required)
- `challengeId` (String, 255 characters, required)
- `code` (String, 5000 characters, required)
- `isCorrect` (Boolean, required)
- `executionTime` (Integer, optional)
- `memoryUsage` (Integer, optional)
- `submittedAt` (String, 50 characters, required) - ISO date string
- `language` (String, 20 characters, required) - Values: "javascript", "python", "java", "cpp"

**Indexes:**
- `userId` (key: userId, type: key, attributes: [userId])
- `challengeId` (key: challengeId, type: key, attributes: [challengeId])
- `userId_challengeId` (key: userId_challengeId, type: key, attributes: [userId, challengeId])
- `submittedAt` (key: submittedAt, type: key, attributes: [submittedAt])

**Permissions:**
- Read: Users (own documents only)
- Create: Users
- Update: Users (own documents only)
- Delete: Users (own documents only)

### 3. User Progress Collection

**Collection ID:** `user_progress`

**Attributes:**
- `userId` (String, 255 characters, required, unique)
- `totalChallengesSolved` (Integer, required, default: 0)
- `totalPoints` (Integer, required, default: 0)
- `currentStreak` (Integer, required, default: 0)
- `longestStreak` (Integer, required, default: 0)
- `lastActivityDate` (String, 50 characters, required) - ISO date string
- `challengesByDifficulty` (String, 500 characters, required) - JSON object
- `challengesByCategory` (String, 500 characters, required) - JSON object
- `achievements` (String, 1000 characters, required) - JSON array of achievement IDs
- `level` (Integer, required, default: 1)
- `experience` (Integer, required, default: 0)

**Indexes:**
- `userId` (key: userId, type: unique, attributes: [userId])

**Permissions:**
- Read: Users (own documents only)
- Create: Users
- Update: Users (own documents only)
- Delete: Users (own documents only)

### 4. Achievements Collection

**Collection ID:** `achievements`

**Attributes:**
- `name` (String, 100 characters, required)
- `description` (String, 500 characters, required)
- `icon` (String, 10 characters, required) - Emoji icon
- `category` (String, 20 characters, required) - Values: "milestone", "streak", "category", "special"
- `requirement` (String, 500 characters, required) - JSON object with type, value, and optional category
- `points` (Integer, required)
- `rarity` (String, 20 characters, required) - Values: "common", "rare", "epic", "legendary"

**Indexes:**
- `points` (key: points, type: key, attributes: [points])
- `category` (key: category, type: key, attributes: [category])
- `rarity` (key: rarity, type: key, attributes: [rarity])

**Permissions:**
- Read: Any
- Create: Users
- Update: Users
- Delete: Users

## Quick Setup Script

Here's a complete script ready to copy-paste. Replace `YOUR_DATABASE_ID` with your actual database ID:

```bash
#!/bin/bash

# Set your database ID here
DATABASE_ID="YOUR_DATABASE_ID"

echo "Setting up Coding Challenges Collections..."

# 1. Create Challenges Collection
echo "Creating challenges collection..."
appwrite databases createCollection \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --name="Challenges" \
  --permissions="read('any'),create('users'),update('users'),delete('users')"

# Add attributes for challenges collection
echo "Adding attributes to challenges collection..."
appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="title" \
  --size="255" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="description" \
  --size="1000" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="difficulty" \
  --size="10" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="category" \
  --size="20" \
  --required="true"

appwrite databases createIntegerAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="points" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="testCases" \
  --size="2000" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="starterCode" \
  --size="2000" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="solution" \
  --size="2000" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="hints" \
  --size="1000" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="tags" \
  --size="500" \
  --required="true"

# Add indexes for challenges collection
echo "Adding indexes to challenges collection..."
appwrite databases createIndex \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="difficulty" \
  --type="key" \
  --attributes="difficulty"

appwrite databases createIndex \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="category" \
  --type="key" \
  --attributes="category"

appwrite databases createIndex \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenges" \
  --key="createdAt" \
  --type="key" \
  --attributes="\$createdAt"

# 2. Create Challenge Attempts Collection
echo "Creating challenge_attempts collection..."
appwrite databases createCollection \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --name="Challenge Attempts" \
  --permissions="read('users'),create('users'),update('users'),delete('users')"

# Add attributes for challenge_attempts collection
echo "Adding attributes to challenge_attempts collection..."
appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="userId" \
  --size="255" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="challengeId" \
  --size="255" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="code" \
  --size="5000" \
  --required="true"

appwrite databases createBooleanAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="isCorrect" \
  --required="true"

appwrite databases createIntegerAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="executionTime" \
  --required="false"

appwrite databases createIntegerAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="memoryUsage" \
  --required="false"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="submittedAt" \
  --size="50" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="language" \
  --size="20" \
  --required="true"

# Add indexes for challenge_attempts collection
echo "Adding indexes to challenge_attempts collection..."
appwrite databases createIndex \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="userId" \
  --type="key" \
  --attributes="userId"

appwrite databases createIndex \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="challengeId" \
  --type="key" \
  --attributes="challengeId"

appwrite databases createIndex \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="userId_challengeId" \
  --type="key" \
  --attributes="userId,challengeId"

appwrite databases createIndex \
  --databaseId="$DATABASE_ID" \
  --collectionId="challenge_attempts" \
  --key="submittedAt" \
  --type="key" \
  --attributes="submittedAt"

# 3. Create User Progress Collection
echo "Creating user_progress collection..."
appwrite databases createCollection \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --name="User Progress" \
  --permissions="read('users'),create('users'),update('users'),delete('users')"

# Add attributes for user_progress collection
echo "Adding attributes to user_progress collection..."
appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="userId" \
  --size="255" \
  --required="true"

appwrite databases createIntegerAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="totalChallengesSolved" \
  --required="true" \
  --default="0"

appwrite databases createIntegerAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="totalPoints" \
  --required="true" \
  --default="0"

appwrite databases createIntegerAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="currentStreak" \
  --required="true" \
  --default="0"

appwrite databases createIntegerAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="longestStreak" \
  --required="true" \
  --default="0"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="lastActivityDate" \
  --size="50" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="challengesByDifficulty" \
  --size="500" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="challengesByCategory" \
  --size="500" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="achievements" \
  --size="1000" \
  --required="true"

appwrite databases createIntegerAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="level" \
  --required="true" \
  --default="1"

appwrite databases createIntegerAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="experience" \
  --required="true" \
  --default="0"

# Add indexes for user_progress collection
echo "Adding indexes to user_progress collection..."
appwrite databases createIndex \
  --databaseId="$DATABASE_ID" \
  --collectionId="user_progress" \
  --key="userId" \
  --type="unique" \
  --attributes="userId"

# 4. Create Achievements Collection
echo "Creating achievements collection..."
appwrite databases createCollection \
  --databaseId="$DATABASE_ID" \
  --collectionId="achievements" \
  --name="Achievements" \
  --permissions="read('any'),create('users'),update('users'),delete('users')"

# Add attributes for achievements collection
echo "Adding attributes to achievements collection..."
appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="achievements" \
  --key="name" \
  --size="100" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="achievements" \
  --key="description" \
  --size="500" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="achievements" \
  --key="icon" \
  --size="10" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="achievements" \
  --key="category" \
  --size="20" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="achievements" \
  --key="requirement" \
  --size="500" \
  --required="true"

appwrite databases createIntegerAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="achievements" \
  --key="points" \
  --required="true"

appwrite databases createStringAttribute \
  --databaseId="$DATABASE_ID" \
  --collectionId="achievements" \
  --key="rarity" \
  --size="20" \
  --required="true"

# Add indexes for achievements collection
echo "Adding indexes to achievements collection..."
appwrite databases createIndex \
  --databaseId="$DATABASE_ID" \
  --collectionId="achievements" \
  --key="points" \
  --type="key" \
  --attributes="points"

appwrite databases createIndex \
  --databaseId="$DATABASE_ID" \
  --collectionId="achievements" \
  --key="category" \
  --type="key" \
  --attributes="category"

appwrite databases createIndex \
  --databaseId="$DATABASE_ID" \
  --collectionId="achievements" \
  --key="rarity" \
  --type="key" \
  --attributes="rarity"

echo "✅ All collections created successfully!"
echo ""
echo "Next steps:"
echo "1. Add the collection IDs to your .env file:"
echo "   VITE_APPWRITE_CHALLENGES_COLLECTION_ID=challenges"
echo "   VITE_APPWRITE_CHALLENGE_ATTEMPTS_COLLECTION_ID=challenge_attempts"
echo "   VITE_APPWRITE_USER_PROGRESS_COLLECTION_ID=user_progress"
echo "   VITE_APPWRITE_ACHIEVEMENTS_COLLECTION_ID=achievements"
echo ""
echo "2. Restart your development server"
echo "3. The coding challenges system will now use your Appwrite collections!"
```

## Alternative: Manual Setup

If you prefer to set up collections manually through the Appwrite console:

1. Go to your Appwrite console
2. Navigate to Databases → Your Database
3. Create each collection with the attributes and permissions listed above
4. Add the collection IDs to your `.env` file

## Sample Data

Once the collections are created, you can populate them with the sample data provided in `src/constants/challenges.ts`. The system will work with sample data even without the collections configured, but for full functionality, you'll need to set up the collections and add the sample data to your Appwrite database.

## Testing

After setting up the collections:

1. Add the environment variables to your `.env` file
2. Restart your development server
3. The coding challenges system should now work without console errors
4. Users can solve challenges, track progress, and earn achievements

## Troubleshooting

- Make sure all environment variables are correctly set
- Verify that collection IDs match exactly in your Appwrite console
- Check that all required attributes are created with correct types
- Ensure permissions are set correctly for each collection
- Verify that indexes are created for better query performance
