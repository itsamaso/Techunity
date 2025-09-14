import { useUserContext } from "@/context/AuthContext";
import {
  useFollowUser,
  useUnfollowUser,
  useCheckIfFollowing,
} from "@/lib/react-query/queries";

type FollowButtonProps = {
  targetUserId: string;
  className?: string;
};

const FollowButton = ({ targetUserId, className }: FollowButtonProps) => {
  const { user } = useUserContext();
  
  // Don't show follow button if user is trying to follow themselves
  if (user.id === targetUserId) {
    return null;
  }

  const { data: followRecord } = useCheckIfFollowing(user.id, targetUserId);
  const { mutate: followUser, isPending: isFollowing, error: followError } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowing, error: unfollowError } = useUnfollowUser();

  const isFollowingUser = !!followRecord;
  const isLoading = isFollowing || isUnfollowing;

  // Debug logging
  console.log('FollowButton Debug:', {
    targetUserId,
    followRecord,
    isFollowingUser,
    isLoading,
    followError,
    unfollowError
  });

  const handleFollowToggle = () => {
    console.log('Follow toggle clicked:', { isFollowingUser, followRecord });
    
    if (isFollowingUser && followRecord) {
      console.log('Unfollowing user with record ID:', followRecord.$id);
      unfollowUser(followRecord.$id);
    } else {
      console.log('Following user:', { followerId: user.id, followingId: targetUserId });
      followUser({ followerId: user.id, followingId: targetUserId });
    }
  };

  return (
    <button
      type="button"
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`
        follow-button relative group overflow-hidden inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2
        ${isFollowingUser 
          ? "follow-button-unfollow" 
          : "follow-button-follow"
        }
        ${isLoading 
          ? "opacity-75 cursor-not-allowed" 
          : "hover:scale-105 active:scale-95"
        }
        ${className || ""} 
        px-6 py-3 min-w-[120px] h-12
      `}
    >

      <div className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium">Loading...</span>
          </>
        ) : followError || unfollowError ? (
          <>
            <span className="text-xs font-medium text-red-500">Error</span>
          </>
        ) : isFollowingUser ? (
          <>
            <svg 
              className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
            <span className="font-semibold transition-colors duration-300">Unfollow</span>
          </>
        ) : (
          <>
            <svg 
              className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
            <span className="font-semibold transition-colors duration-300">Follow</span>
          </>
        )}
      </div>
    </button>
  );
};

export default FollowButton; 