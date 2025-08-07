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
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  
  // Safety check - if post is not properly loaded, don't render
  if (!post || !post.$id) {
    return null;
  }
  
  const likesList = post.likes?.map((user: Models.Document) => user.$id) || [];

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavePost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save?.find(
    (record: Models.Document) => record?.post?.$id === post?.$id
  ) || null;

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [savedPostRecord]);

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

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }

    if (userId && post.$id) {
      savePost({ userId: userId, postId: post.$id });
      setIsSaved(true);
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
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer group border-2 border-blue-500/30 hover:border-blue-500/50 shadow-lg hover:shadow-xl backdrop-blur-sm" onClick={(e) => handleSavePost(e)}>
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={24}
            height={24}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default PostStats;
