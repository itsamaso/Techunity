import { Button } from "@/components/ui/button";
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
  const { mutate: followUser, isPending: isFollowing } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowing } = useUnfollowUser();

  const isFollowingUser = !!followRecord;

  const handleFollowToggle = () => {
    if (isFollowingUser && followRecord) {
      unfollowUser(followRecord.$id);
    } else {
      followUser({ followerId: user.id, followingId: targetUserId });
    }
  };

  return (
    <Button
      type="button"
      onClick={handleFollowToggle}
      disabled={isFollowing || isUnfollowing}
                                                                                                   className={`${
                      isFollowingUser
                        ? "bg-gradient-to-r from-white/90 to-white/80 hover:from-white/95 hover:to-white/85 text-red-600 hover:text-red-700 border border-red-500/40 hover:border-red-500/60 shadow-md hover:shadow-lg font-semibold"
                        : "shad-button_primary"
                    } ${className || ""} transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
    >
      {isFollowing || isUnfollowing ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : isFollowingUser ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
};

export default FollowButton; 