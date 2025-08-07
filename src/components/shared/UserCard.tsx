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
    <div className="user-card">
      <Link to={`/profile/${user.$id}`} className="flex-center flex-col gap-1">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-14 h-14"
        />

        <div className="flex-center flex-col gap-1">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          <p className="small-regular text-light-3 text-center line-clamp-1">
            @{user.username}
          </p>
        </div>
      </Link>

      <FollowButton targetUserId={user.$id} className="px-5" />
    </div>
  );
};

export default UserCard;
