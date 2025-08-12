import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queries";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
  onSaveChange?: () => void; // Callback to refresh saved posts
};

const PostStats = ({ post, userId, onSaveChange }: PostStatsProps) => {
  const location = useLocation();
  
  // Safety check - if post is not properly loaded, don't render
  if (!post || !post.$id) {
    return null;
  }
  
  const likesList = post.likes?.map((user: Models.Document) => user.$id) || [];

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSaving, error: saveError } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeleting, error: deleteError } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  // Check if this post is saved by querying the saves collection
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!currentUser?.$id || !post.$id) return;
      
      try {
        const { databases } = await import('@/lib/appwrite/config');
        const { appwriteConfig } = await import('@/lib/appwrite/config');
        const { Query } = await import('appwrite');
        
        // Check if there's a save record for this post and user
        const saveRecords = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.savesCollectionId,
          [
            Query.equal("user", currentUser.$id),
            Query.equal("post", post.$id)
          ]
        );
        
        if (saveRecords && saveRecords.documents.length > 0) {
          const saveRecord = saveRecords.documents[0];
          setIsSaved(true);
          setSavedRecordId(saveRecord.$id);
        } else {
          setIsSaved(false);
          setSavedRecordId(null);
        }
      } catch (error) {
        console.error('Error checking save status:', error);
        setIsSaved(false);
        setSavedRecordId(null);
      }
    };

    checkIfSaved();
  }, [currentUser?.$id, post.$id]);

  const handleLikePost = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (!post.$id) return;

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation();

    // Check if user is authenticated
    if (!currentUser || !currentUser.$id) {
      console.error('User not authenticated');
      return;
    }

    // Check if userId matches current user
    if (userId !== currentUser.$id) {
      console.error('UserId mismatch:', { userId, currentUserId: currentUser.$id });
      return;
    }

    if (isSaved && savedRecordId) {
      // Unsave the post
      setIsSaved(false);
      deleteSavePost(savedRecordId);
      setSavedRecordId(null);
      
      // Call callback to refresh saved posts list
      if (onSaveChange) {
        setTimeout(() => onSaveChange(), 100);
      }
    } else {
      // Save the post
      if (userId && post.$id) {
        savePost({ userId: userId, postId: post.$id });
        setIsSaved(true);
        
        // Call callback to refresh saved posts list
        if (onSaveChange) {
          setTimeout(() => onSaveChange(), 100);
        }
      } else {
        console.error('Missing userId or postId:', { userId, postId: post.$id });
      }
    }
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 relative ${containerStyles}`}>
      <div className="flex items-center gap-5 mr-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-pointer group border-2 border-red-500/30 hover:border-red-500/50 shadow-lg hover:shadow-xl backdrop-blur-sm" onClick={(e) => handleLikePost(e)}>
          <img
            src={`${
              checkIsLiked(likes, userId)
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
            }`}
            alt="like"
            width={24}
            height={24}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <p className="text-base font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300">{likes.length}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-blue-500/30 transition-all duration-300 cursor-pointer group border-2 border-blue-500/30 hover:border-blue-500/50 shadow-lg hover:shadow-xl backdrop-blur-sm" onClick={(e) => handleSavePost(e)}>
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={24}
            height={24}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          {(isSaving || isDeleting) && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 rounded-2xl">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {(saveError || deleteError) && (
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
        {(saveError || deleteError) && (
          <div className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">
            Error occurred
          </div>
        )}
      </div>
    </div>
  );
};

export default PostStats;
