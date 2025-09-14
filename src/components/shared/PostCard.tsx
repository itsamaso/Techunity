import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { multiFormatDateString, checkIsLiked, getFirstName } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
  useGetPostComments,
} from "@/lib/react-query/queries";

type PostCardProps = {
  post: Models.Document;
  onSaveChange?: () => void; // Callback to refresh saved posts
  showSimplifiedUI?: boolean; // For explore tab - hide like and comment buttons
};

const PostCard = ({ post, onSaveChange, showSimplifiedUI = false }: PostCardProps) => {
  const { user } = useUserContext();
  const [likes, setLikes] = useState<string[]>(post.likes?.map((user: Models.Document) => user.$id) || []);
  const [isSaved, setIsSaved] = useState(false);
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSaving } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeleting } = useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();
  const { data: comments } = useGetPostComments(post.$id);

  // Check if this post is saved
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!currentUser?.$id || !post.$id) return;
      
      try {
        const { databases } = await import('@/lib/appwrite/config');
        const { appwriteConfig } = await import('@/lib/appwrite/config');
        const { Query } = await import('appwrite');
        
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
        setIsSaved(false);
        setSavedRecordId(null);
      }
    };

    checkIfSaved();
  }, [currentUser?.$id, post.$id]);

  const handleLikePost = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    if (!post.$id) return;

    let likesArray = [...likes];
    if (likesArray.includes(user.id)) {
      likesArray = likesArray.filter((Id) => Id !== user.id);
    } else {
      likesArray.push(user.id);
    }

    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  const handleSavePost = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();

    if (!currentUser || !currentUser.$id || user.id !== currentUser.$id) {
      return;
    }

    if (isSaved && savedRecordId) {
      setIsSaved(false);
      deleteSavePost(savedRecordId);
      setSavedRecordId(null);
      if (onSaveChange) {
        setTimeout(() => onSaveChange(), 100);
      }
    } else {
      if (user.id && post.$id) {
        savePost({ userId: user.id, postId: post.$id });
        setIsSaved(true);
        if (onSaveChange) {
          setTimeout(() => onSaveChange(), 100);
        }
      }
    }
  };

  if (!post.creator) return;

  return (
    <div className="post-card w-full h-full relative overflow-hidden">
      {/* Scrollable Content Container */}
      <div className="w-full h-full overflow-y-auto postcard-scrollbar">
        {/* Header - Enhanced Profile Section - Centered */}
        <div className="sticky top-0 left-0 right-0 w-full h-[80px] sm:h-[85px] min-h-[80px] sm:min-h-[85px] max-h-[80px] sm:max-h-[85px] flex justify-center items-center px-3 sm:px-4 py-2 sm:py-3 bg-white/90 backdrop-blur-md z-10 rounded-2xl shadow-lg border border-white/20 hover:bg-white/95 hover:shadow-xl transition-all duration-300 mx-auto my-2 sm:my-3 max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-1.5rem)]">
          {/* Centered Content Container */}
          <div className="flex items-center justify-between w-full max-w-full gap-4">
            {/* User Info - Enhanced */}
            <Link to={`/profile/${post.creator.$id}`} className="group flex items-center gap-3 min-w-0 flex-1 hover:bg-gray-50/60 rounded-xl p-2 -m-2 transition-all duration-200">
              {/* Profile Picture with Enhanced Styling */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                <img
                  src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt={`${post.creator.name}'s profile`}
                  className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-white/80 group-hover:ring-blue-500/60 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105"
                />
                {/* Online Status Indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-md">
                  <div className="w-full h-full rounded-full bg-green-400/80 animate-pulse"></div>
                </div>
              </div>
              
              {/* User Details */}
              <div className="flex flex-col min-w-0 flex-1 min-w-[120px]">
                {/* Name with Bio Indicator */}
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                    {getFirstName(post.creator.name)}
                  </p>
                  {/* Bio indicator - shows if user has a bio */}
                  {post.creator.bio && (
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" title="User has bio"></div>
                  )}
                </div>
                
                {/* Location Information */}
                {post.location && (
                  <div className="flex items-center gap-2 text-gray-500 mt-0.5">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-xs font-medium truncate max-w-[100px]">
                        {post.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Link>

            {/* Time and Action Buttons Section */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0 max-w-[180px]">
              {/* Time Label */}
              <div className="flex items-center gap-1 text-gray-500">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs font-medium">
                  {multiFormatDateString(post.$createdAt)}
                </p>
              </div>
              
              {/* Action Buttons - Enhanced */}
              <div className="flex items-center gap-1 sm:gap-2 bg-white/70 backdrop-blur-sm rounded-xl p-1.5 shadow-md border border-white/30">
            {!showSimplifiedUI && (
              <>
                <div className="flex items-center gap-1 p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-pointer group border border-red-500/30 hover:border-red-500/50 shadow-md hover:shadow-lg backdrop-blur-sm overflow-hidden" onClick={handleLikePost}>
                  <img
                    src={checkIsLiked(likes, user.id) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                    alt="like"
                    width={16}
                    height={16}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="text-xs font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300">{likes.length}</span>
                </div>

                <Link
                  to={`/posts/${post.$id}`}
                  className="flex items-center gap-1 p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-green-500/20 hover:from-green-500/30 hover:to-green-500/30 transition-all duration-300 group border border-green-500/30 hover:border-green-500/50 shadow-md hover:shadow-lg backdrop-blur-sm overflow-hidden">
                  <img
                    src="/assets/icons/chat.svg"
                    alt="comments"
                    width={16}
                    height={16}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="text-xs font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                    {comments?.documents.length || 0}
                  </span>
                </Link>
              </>
            )}

            <div className="relative flex items-center gap-1 p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-500/20 hover:from-blue-500/30 hover:to-blue-500/30 transition-all duration-300 cursor-pointer group border border-blue-500/30 hover:border-blue-500/50 shadow-md hover:shadow-lg backdrop-blur-sm overflow-hidden" onClick={handleSavePost}>
              <img
                src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                alt="save"
                width={16}
                height={16}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              {(isSaving || isDeleting) && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 rounded-lg">
                  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {user.id === post.creator.$id && (
              <Link
                to={`/update-post/${post.$id}`}
                className="flex items-center gap-1 p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-primary-500/20 to-accent-500/20 hover:from-primary-500/30 hover:to-accent-500/30 transition-all duration-300 group border border-primary-500/40 hover:border-primary-500/60 shadow-md hover:shadow-lg backdrop-blur-sm overflow-hidden">
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={16}
                  height={16}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            )}
              </div>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <Link to={`/posts/${post.$id}`} className="block group">
          <div className="px-4 pb-4 space-y-3">
            {post.caption && (
              <div className="overflow-y-auto postcard-scrollbar max-h-[60px]">
                <p className="text-gray-800 leading-tight group-hover:text-primary-600 transition-colors duration-300 font-medium text-sm">
                  {post.caption}
                </p>
              </div>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="overflow-x-auto overflow-y-hidden postcard-scrollbar">
                <ul className="flex gap-1.5 flex-nowrap min-w-max">
                  {post.tags.map((tag: string, index: string) => (
                    <li key={`${tag}${index}`} className="text-gray-700 text-xs bg-gradient-to-r from-primary-500/20 to-secondary-500/20 px-2 py-1 rounded-full hover:bg-gradient-to-r hover:from-primary-500/30 hover:to-secondary-500/30 hover:text-primary-700 transition-all duration-300 border border-primary-500/30 hover:border-primary-500/50 font-medium shadow-sm hover:shadow-md backdrop-blur-sm whitespace-nowrap flex-shrink-0">
                      #{tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {post.imageUrl && (
              <div className="post-card_img-container overflow-hidden rounded-xl shadow-xl group-hover:shadow-xl transition-all duration-500">
                <img
                  src={post.imageUrl}
                  alt="post image"
                  className="post-card_img group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBWMTQwSDgwVjYwWiIgZmlsbD0iI0Q5RDFFNiIvPgo8cGF0aCBkPSJNODAgODBIMTIwVjEwMEg4MFY4MFoiIGZpbGw9IiNCM0M0QzciLz4KPC9zdmc+';
                    e.currentTarget.alt = 'Image failed to load';
                  }}
                />
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
