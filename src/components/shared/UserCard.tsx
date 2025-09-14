import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import FollowButton from "./FollowButton";

type UserCardProps = {
  user: {
    $id: string;
    name: string;
    username: string;
    imageUrl: string;
  };
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="user-card group">
      <Link to={`/profile/${user.$id}`} className="flex-center flex-col gap-3 mb-4">
        <div className="relative">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="creator"
            className="rounded-full w-16 h-16 object-cover ring-2 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all duration-300"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>

        <div className="flex-center flex-col gap-1">
          <p className="base-medium text-light-1 text-center line-clamp-1 font-semibold group-hover:text-primary-600 transition-colors duration-300">
            {user.name}
          </p>
          <p className="small-regular text-light-3 text-center line-clamp-1 group-hover:text-primary-500 transition-colors duration-300">
            @{user.username}
          </p>
        </div>
      </Link>

      <div className="flex justify-center">
        <FollowButton targetUserId={user.$id} className="w-full" />
      </div>
    </div>
  );
};

export default UserCard;
