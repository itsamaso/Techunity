import { ID, Query } from "appwrite";
import { Permission, Role } from "appwrite";
import { appwriteConfig, account, databases, storage, avatars } from "./config";
import { IUpdatePost, INewPost, INewUser, IUpdateUser } from "@/types";

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
    console.log(error);
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
