import { ID, Query } from "appwrite";
import { Permission, Role } from "appwrite";
import { appwriteConfig, account, databases, storage, avatars } from "./config";
import { IUpdatePost, INewPost, INewUser, IUpdateUser, INewChat, INewMessage } from "@/types";

// ============================================================
// AUTH
// ============================================================

export async function initAppwriteSession() {
  try {
    await account.get(); // checks if user is already authenticated
  } catch (error) {
    // If not logged in, create anonymous session
    await account.createAnonymousSession();
  }
}


// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  let createdAccount = null;
  
  try {
    // First, create the Appwrite account
    createdAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!createdAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    // Then, create the database user
    const newUser = await saveUserToDB({
      accountId: createdAccount.$id,
      name: createdAccount.name,
      email: createdAccount.email,
      username: user.username,
      imageUrl: avatarUrl.toString(),
    });

    if (!newUser) {
      // If database creation fails, we can't easily delete the Appwrite account
      // The account will remain but without a database record
      console.log("Database user creation failed, but Appwrite account was created");
      throw Error;
    }

    return newUser;
  } catch (error) {
    console.log("Create user account error:", error);
    
    // Clean up any partially created account
    if (createdAccount) {
      console.log("Appwrite account was created but database user creation failed");
    }
    
    throw error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    if (!newUser) throw Error;

    return newUser;
  } catch (error) {
    console.log("Save user to DB error:", error);
    throw error;
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    // First, try to delete any existing sessions
    try {
      await account.deleteSessions();
    } catch (sessionError) {
      // Ignore session deletion errors
      console.log("Session cleanup error (ignored):", sessionError);
    }

    const session = await account.createEmailSession(user.email, user.password);

    if (!session) throw Error;

    return session;
  } catch (error) {
    console.log("Sign in error:", error);
    throw error;
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) {
      console.log("No current account found");
      return null;
    }

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) {
      console.log("No user document found for account:", currentAccount.$id);
      return null;
    }

    return currentUser.documents[0];
  } catch (error) {
    console.log("Get current user error:", error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================== CLEAR ALL SESSIONS
export async function clearAllSessions() {
  try {
    await account.deleteSessions();
    return true;
  } catch (error) {
    console.log("Clear sessions error:", error);
    return false;
  }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    let imageUrl = "";
    let imageId = "no-image"; // Use a placeholder value for posts without images

    // Handle file upload if provided
    if (post.file && post.file.length > 0) {
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;

      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      imageUrl = fileUrl;
      imageId = uploadedFile.$id;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption || "",
        imageUrl: imageUrl,
        imageId: imageId,
        location: post.location || "",
        tags: tags,
      }
    );

    if (!newPost) {
      // Clean up uploaded file if post creation failed
      if (imageId && imageId !== "no-image") {
        await deleteFile(imageId);
      }
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file,
      [Permission.read(Role.any())]
    );

    return uploadedFile;
  } catch (error) {
    console.log("Upload error:", error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    // Use getFileView instead of getFilePreview
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      fileId
    );
    if (!fileUrl) throw Error;
    return fileUrl.toString();
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POSTS
export async function searchPosts(searchTerm: string, searchType: 'caption' | 'tags' = 'caption') {
  try {
    let queries = [];
    
    if (searchType === 'caption') {
      queries.push(Query.search("caption", searchTerm));
    } else if (searchType === 'tags') {
      queries.push(Query.search("tags", searchTerm));
    }
    
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET LIKED POSTS
export async function getLikedPosts(userId: string) {
  try {
    // Get all posts
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$updatedAt")]
    );

    if (!posts) throw Error;

    // Filter posts that are liked by the user
    const likedPosts = posts.documents.filter(post => 
      post.likes && post.likes.some((like: any) => like.$id === userId)
    );

    return {
      documents: likedPosts,
      total: likedPosts.length
    };
  } catch (error) {
    console.log("getLikedPosts error:", error);
    return {
      documents: [],
      total: 0
    };
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) {
    console.log('getPostById: No postId provided');
    return undefined;
  }

  console.log('getPostById: Attempting to fetch post:', postId);
  console.log('getPostById: Using database ID:', appwriteConfig.databaseId);
  console.log('getPostById: Using post collection ID:', appwriteConfig.postCollectionId);

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) {
      console.log('getPostById: Post not found for ID:', postId);
      return undefined;
    }

    console.log('getPostById: Successfully fetched post:', post.$id);
    return post;
  } catch (error) {
    console.error('getPostById error for post ID:', postId, error);
    return undefined;
  }
}

// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file && post.file.length > 0;

  try {
    // Get current user for authorization check
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get the existing post to check ownership
    const existingPost = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId
    );

    if (!existingPost) {
      throw new Error("Post not found");
    }

    // Security check: Only allow post owner to update
    if (existingPost.creator.$id !== currentUser.$id) {
      throw new Error("Unauthorized: Only post owner can update this post");
    }

    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file![0]); // Use non-null assertion since we already checked hasFileToUpdate
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption || "",
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location || "",
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate && post.imageId && post.imageId !== "no-image") {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId) return;

  try {
    // Get current user for authorization check
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get the post to check ownership
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) {
      throw new Error("Post not found");
    }

    // Security check: Only allow post owner to delete
    if (post.creator.$id !== currentUser.$id) {
      throw new Error("Unauthorized: Only post owner can delete this post");
    }

    // First, find and delete all save records for this post
    try {
      const saveRecords = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        [Query.equal("post", postId)]
      );

      // Delete all save records for this post
      if (saveRecords && saveRecords.documents.length > 0) {
        for (const saveRecord of saveRecords.documents) {
          await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            saveRecord.$id
          );
        }
      }
    } catch (saveError) {
      // Log error but don't fail the post deletion
      console.log("Error cleaning up save records:", saveError);
    }

    // Delete the post document
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    // Only try to delete file if it's not our placeholder value and actually exists
    if (imageId && imageId !== "no-image") {
      await deleteFile(imageId);
    }

    return { status: "Ok" };
  } catch (error) {
    console.log("Delete post error:", error);
    throw error; // Re-throw to let the frontend handle the error
  }
}

// ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    // Validate inputs
    if (!userId || !postId) {
      console.error('savePost: Missing userId or postId:', { userId, postId });
      throw new Error('Missing userId or postId');
    }

    // Validate configuration
    if (!appwriteConfig.databaseId || !appwriteConfig.savesCollectionId) {
      console.error('savePost: Missing database configuration:', {
        databaseId: appwriteConfig.databaseId,
        savesCollectionId: appwriteConfig.savesCollectionId
      });
      throw new Error('Missing database configuration');
    }

    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) {
      console.error('savePost: Failed to create save document');
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.error('savePost error:', error);
    throw error;
  }
}
// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// FOLLOW SYSTEM
// ============================================================

// ============================== FOLLOW USER
export async function followUser(followerId: string, followingId: string) {
  try {
    // Check if already following
    const existingFollow = await checkIfFollowing(followerId, followingId);
    if (existingFollow) {
      return existingFollow; // Already following
    }

    const followRecord = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      ID.unique(),
      {
        follower: followerId,
        following: followingId,
      }
    );

    if (!followRecord) throw Error;

    return followRecord;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// ============================== UNFOLLOW USER
export async function unfollowUser(followRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      followRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// ============================== GET FOLLOWERS COUNT
export async function getFollowersCount(userId: string) {
  try {
    if (!userId) return 0;
    
    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("following", userId)]
    );

    return followers?.total || 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

// ============================== GET FOLLOWING COUNT
export async function getFollowingCount(userId: string) {
  try {
    if (!userId) return 0;
    
    const following = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("follower", userId)]
    );

    return following?.total || 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

// ============================== CHECK IF FOLLOWING
export async function checkIfFollowing(followerId: string, followingId: string) {
  try {
    if (!followerId || !followingId) return null;
    
    const followRecord = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("follower", followerId),
        Query.equal("following", followingId),
      ]
    );

    return followRecord?.documents?.[0] || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================================================
// CHAT SYSTEM
// ============================================================

// ============================== CREATE CHAT
export async function createChat(chat: INewChat) {
  try {
    const newChat = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      ID.unique(),
      {
        name: chat.name,
        type: chat.type,
        participants: chat.participants,
        createdBy: chat.createdBy,
        lastMessage: "",
        lastMessageAt: new Date().toISOString(),
        groupImageUrl: chat.groupImageUrl || "",
        groupImageId: chat.groupImageId || "no-image",
      }
    );

    if (!newChat) throw Error;

    return newChat;
  } catch (error) {
    console.log("Create chat error:", error);
    throw error;
  }
}

// ============================== GET USER CHATS
export async function getUserChats(userId: string) {
  try {
    console.log('getUserChats - User ID:', userId);
    console.log('getUserChats - Database ID:', appwriteConfig.databaseId);
    console.log('getUserChats - Chats Collection ID:', appwriteConfig.chatsCollectionId);
    
    // Get all chats and filter participants in the application
    const chats = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      [
        Query.orderDesc("$createdAt")
      ]
    );

    console.log('getUserChats - Response:', chats);
    if (!chats) throw Error;

    // Filter chats where the user is a participant
    const userChats = {
      ...chats,
      documents: chats.documents.filter((chat: any) => 
        chat.participants && chat.participants.includes(userId)
      )
    };

    return userChats;
  } catch (error) {
    console.log("Get user chats error:", error);
    throw error;
  }
}

// ============================== GET CHAT BY ID
export async function getChatById(chatId: string) {
  try {
    const chat = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId
    );

    if (!chat) throw Error;

    return chat;
  } catch (error) {
    console.log("Get chat by ID error:", error);
    throw error;
  }
}

// ============================== UPDATE CHAT
export async function updateChat(chatId: string, updates: { 
  lastMessage?: string; 
  lastMessageAt?: string;
  groupImageUrl?: string;
  groupImageId?: string;
}) {
  try {
    const updatedChat = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId,
      updates
    );

    if (!updatedChat) throw Error;

    return updatedChat;
  } catch (error) {
    console.log("Update chat error:", error);
    throw error;
  }
}

// ============================== UPDATE GROUP IMAGE
export async function updateGroupImage(chatId: string, file: File) {
  try {
    // Get current user for authorization check
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get the existing chat to check ownership
    const existingChat = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId
    );

    if (!existingChat) {
      throw new Error("Chat not found");
    }

    // Security check: Only allow group creator to update image
    if (existingChat.createdBy !== currentUser.$id) {
      throw new Error("Unauthorized: Only group creator can update group image");
    }

    // Upload new file to appwrite storage
    const uploadedFile = await uploadFile(file);
    if (!uploadedFile) throw Error;

    // Get new file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Update chat with new image
    const updatedChat = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId,
      {
        groupImageUrl: fileUrl,
        groupImageId: uploadedFile.$id,
      }
    );

    if (!updatedChat) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Delete old image if it exists
    if (existingChat.groupImageId && existingChat.groupImageId !== "no-image") {
      await deleteFile(existingChat.groupImageId);
    }

    return updatedChat;
  } catch (error) {
    console.log("Update group image error:", error);
    throw error;
  }
}

// ============================== REMOVE PARTICIPANT FROM CHAT
export async function removeParticipantFromChat(chatId: string, participantId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get the existing chat
    const existingChat = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId
    );

    if (!existingChat) {
      throw new Error("Chat not found");
    }

    // Security checks
    if (existingChat.type === 'direct') {
      // For direct chats, only participants can remove themselves
      if (participantId !== currentUser.$id) {
        throw new Error("Unauthorized: You can only remove yourself from direct chats");
      }
    } else {
      // For group chats, only group creator can remove others, or users can remove themselves
      if (participantId !== currentUser.$id && existingChat.createdBy !== currentUser.$id) {
        throw new Error("Unauthorized: Only group creator can remove other members");
      }
    }

    // Remove participant from the participants array
    const updatedParticipants = existingChat.participants.filter((id: string) => id !== participantId);

    // If no participants left, delete the chat
    if (updatedParticipants.length === 0) {
      await deleteChat(chatId);
      return { deleted: true };
    }

    // Update chat with new participants list
    const updatedChat = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId,
      {
        participants: updatedParticipants,
      }
    );

    if (!updatedChat) throw Error;

    return updatedChat;
  } catch (error) {
    console.log("Remove participant error:", error);
    throw error;
  }
}

// ============================== KICK MEMBER FROM GROUP
export async function kickMemberFromGroup(chatId: string, memberId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get the existing chat
    const existingChat = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId
    );

    if (!existingChat) {
      throw new Error("Chat not found");
    }

    // Security check: Only group creator can kick members
    if (existingChat.createdBy !== currentUser.$id) {
      throw new Error("Unauthorized: Only group creator can kick members");
    }

    // Cannot kick the group creator
    if (memberId === existingChat.createdBy) {
      throw new Error("Cannot kick the group creator");
    }

    // Remove member from the participants array
    const updatedParticipants = existingChat.participants.filter((id: string) => id !== memberId);

    // Update chat with new participants list
    const updatedChat = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId,
      {
        participants: updatedParticipants,
      }
    );

    if (!updatedChat) throw Error;

    return updatedChat;
  } catch (error) {
    console.log("Kick member error:", error);
    throw error;
  }
}

// ============================== ADD MEMBER TO GROUP
export async function addMemberToGroup(chatId: string, memberId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get the existing chat
    const existingChat = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId
    );

    if (!existingChat) {
      throw new Error("Chat not found");
    }

    // Security check: Only group creator can add members
    if (existingChat.createdBy !== currentUser.$id) {
      throw new Error("Unauthorized: Only group creator can add members");
    }

    // Check if member is already in the group
    if (existingChat.participants.includes(memberId)) {
      throw new Error("User is already a member of this group");
    }

    // Add member to the participants array
    const updatedParticipants = [...existingChat.participants, memberId];

    // Update chat with new participants list
    const updatedChat = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId,
      {
        participants: updatedParticipants,
      }
    );

    if (!updatedChat) throw Error;

    return updatedChat;
  } catch (error) {
    console.log("Add member error:", error);
    throw error;
  }
}

// ============================== ASSIGN ADMIN TO GROUP
export async function assignAdminToGroup(chatId: string, memberId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get the existing chat
    const existingChat = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId
    );

    if (!existingChat) {
      throw new Error("Chat not found");
    }

    // Security check: Only group creator can assign admins
    if (existingChat.createdBy !== currentUser.$id) {
      throw new Error("Unauthorized: Only group creator can assign admins");
    }

    // Check if member is in the group
    if (!existingChat.participants.includes(memberId)) {
      throw new Error("User is not a member of this group");
    }

    // Check if already an admin
    const currentAdmins = existingChat.admins || [];
    if (currentAdmins.includes(memberId)) {
      throw new Error("User is already an admin");
    }

    // Add member to admins array
    const updatedAdmins = [...currentAdmins, memberId];

    // Update chat with new admins list
    const updatedChat = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId,
      {
        admins: updatedAdmins,
      }
    );

    if (!updatedChat) throw Error;

    return updatedChat;
  } catch (error) {
    console.log("Assign admin error:", error);
    throw error;
  }
}

// ============================== REMOVE ADMIN FROM GROUP
export async function removeAdminFromGroup(chatId: string, memberId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get the existing chat
    const existingChat = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId
    );

    if (!existingChat) {
      throw new Error("Chat not found");
    }

    // Security check: Only group creator can remove admins
    if (existingChat.createdBy !== currentUser.$id) {
      throw new Error("Unauthorized: Only group creator can remove admins");
    }

    // Remove member from admins array
    const currentAdmins = existingChat.admins || [];
    const updatedAdmins = currentAdmins.filter((id: string) => id !== memberId);

    // Update chat with new admins list
    const updatedChat = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId,
      {
        admins: updatedAdmins,
      }
    );

    if (!updatedChat) throw Error;

    return updatedChat;
  } catch (error) {
    console.log("Remove admin error:", error);
    throw error;
  }
}

// ============================== UPDATE GROUP DESCRIPTION
export async function updateGroupDescription(chatId: string, description: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get the existing chat
    const existingChat = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId
    );

    if (!existingChat) {
      throw new Error("Chat not found");
    }

    // Security check: Only group creator or admins can update description
    const isCreator = existingChat.createdBy === currentUser.$id;
    const isAdmin = existingChat.admins?.includes(currentUser.$id) || false;
    
    if (!isCreator && !isAdmin) {
      throw new Error("Unauthorized: Only group creator or admins can update description");
    }

    // Update chat with new description
    const updatedChat = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId,
      {
        description: description,
      }
    );

    if (!updatedChat) throw Error;

    return updatedChat;
  } catch (error) {
    console.log("Update description error:", error);
    throw error;
  }
}

// ============================== SEND MESSAGE
export async function sendMessage(message: INewMessage) {
  try {
    const newMessage = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        chatId: message.chatId,
        senderId: message.senderId,
        content: message.content,
        type: message.type,
      }
    );

    if (!newMessage) throw Error;

    // Update chat's last message
    await updateChat(message.chatId, {
      lastMessage: message.content,
      lastMessageAt: newMessage.$createdAt,
    });

    return newMessage;
  } catch (error) {
    console.log("Send message error:", error);
    throw error;
  }
}

// ============================== GET CHAT MESSAGES
export async function getChatMessages(chatId: string) {
  try {
    const messages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [
        Query.equal("chatId", chatId),
        Query.orderAsc("$createdAt")
      ]
    );

    if (!messages) throw Error;

    return messages;
  } catch (error) {
    console.log("Get chat messages error:", error);
    throw error;
  }
}

// ============================== DELETE MESSAGE
export async function deleteMessage(messageId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log("Delete message error:", error);
    throw error;
  }
}

// ============================== DELETE CHAT
export async function deleteChat(chatId: string) {
  try {
    // First, delete all messages in the chat
    const messages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.equal("chatId", chatId)]
    );

    if (messages && messages.documents.length > 0) {
      for (const message of messages.documents) {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.messagesCollectionId,
          message.$id
        );
      }
    }

    // Then delete the chat
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log("Delete chat error:", error);
    throw error;
  }
}
