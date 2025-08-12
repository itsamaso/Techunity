import { Models } from "appwrite";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { GridPostList, Loader } from "@/components/shared";
import { useGetCurrentUser } from "@/lib/react-query/queries";
import { Query } from "appwrite";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();
  const [savedPosts, setSavedPosts] = useState<Models.Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const fetchSavedPosts = useCallback(async () => {
    if (!currentUser?.$id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Import the databases and appwriteConfig here to avoid circular imports
      const { databases } = await import('@/lib/appwrite/config');
      const { appwriteConfig } = await import('@/lib/appwrite/config');
      
      // Fetch all save records for this user
      const saveRecords = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        [Query.equal("user", currentUser.$id)]
      );
      
      // Alternative approach: try to get all save records without filtering by user first
      if (!saveRecords || saveRecords.documents.length === 0) {
        try {
          const allSaveRecords = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            []
          );
          
          // Filter by user manually
          const userSaveRecords = allSaveRecords.documents.filter(record => record.user === currentUser.$id);
          
          if (userSaveRecords.length > 0) {
            // Use the manually filtered records
            const postIds = userSaveRecords.map(record => {
              if (typeof record.post === 'string') {
                return record.post;
              } else if (record.post && typeof record.post === 'object' && record.post.$id) {
                return record.post.$id;
              } else if (record.post && typeof record.post === 'object' && record.post.id) {
                return record.post.id;
              } else {
                return null;
              }
            }).filter((postId): postId is string => postId !== null);
            
            if (postIds.length > 0) {
              // Fetch each post
              const posts = [];
              for (const postId of postIds) {
                try {
                  const post = await databases.getDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.postCollectionId,
                    postId
                  );
                  if (post) {
                    posts.push(post);
                  }
                } catch (postError) {
                  console.warn('Failed to fetch post:', postId, postError);
                }
              }
              
              setSavedPosts(posts);
              return;
            }
          }
        } catch (altError) {
          console.warn('Alternative approach failed:', altError);
        }
      }
      
      if (saveRecords && saveRecords.documents.length > 0) {
        // Extract post IDs from save records
        const postIds = saveRecords.documents.map(record => {
          if (typeof record.post === 'string') {
            return record.post;
          } else if (record.post && typeof record.post === 'object' && record.post.$id) {
            return record.post.$id;
          } else if (record.post && typeof record.post === 'object' && record.post.id) {
            return record.post.id;
          } else {
            return null;
          }
        }).filter((postId): postId is string => postId !== null);
        
        if (postIds.length === 0) {
          setSavedPosts([]);
          return;
        }
        
        // Fetch each post
        const posts = [];
        for (const postId of postIds) {
          try {
            const post = await databases.getDocument(
              appwriteConfig.databaseId,
              appwriteConfig.postCollectionId,
              postId
            );
            if (post) {
              posts.push(post);
            }
          } catch (postError) {
            console.warn('Failed to fetch post:', postId, postError);
          }
        }
        
        setSavedPosts(posts);
      } else {
        setSavedPosts([]);
      }
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch saved posts');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.$id]);

  // Refresh saved posts when component mounts or user changes
  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  // Refresh saved posts when navigating to this page
  useEffect(() => {
    if (location.pathname === '/saved' && currentUser?.$id) {
      fetchSavedPosts();
    }
  }, [location.pathname, currentUser?.$id, fetchSavedPosts]);

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex items-center gap-3 mb-6 p-6 rounded-3xl bg-gradient-to-br from-blue-100/85 via-indigo-100/80 to-purple-100/85 border-2 border-primary-500/30 shadow-2xl backdrop-blur-md">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500/25 to-secondary-500/25 shadow-md">
            <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg">Saved Posts</h2>
            <p className="text-base text-gray-800 font-bold mt-2">Your bookmarked content</p>
          </div>
        </div>

      {!currentUser ? (
        <Loader />
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center w-full py-20">
          <Loader />
          <p className="mt-4 text-light-3">Loading saved posts...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center w-full py-20">
          <div className="text-center text-red-500">
            <p className="text-lg font-semibold mb-2">Error loading saved posts</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : savedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full py-20">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md border border-light-4/30 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-light-1 mb-2">No saved posts yet</h3>
              <p className="text-light-3">Start saving posts to see them here!</p>
            </div>
          </div>
        </div>
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          <GridPostList posts={savedPosts} showStats={false} onSaveChange={fetchSavedPosts} />
        </ul>
      )}
      </div>
    </div>
  );
};

export default Saved;
