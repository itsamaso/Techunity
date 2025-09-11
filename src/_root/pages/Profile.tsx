import { useParams, Link, useLocation } from "react-router-dom";

import { Loader } from "@/components/shared";
import { GridPostList } from "@/components/shared";
import FollowButton from "@/components/shared/FollowButton";

import {
  useGetUserById,
  useGetUserPosts,
  useGetLikedPosts,
  useGetFollowersCount,
  useGetFollowingCount,
} from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const StatBlock = ({ value, label }: { value: number; label: string }) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:base-semibold">{value}</p>
    <p className="small-medium lg:base-medium text-light-3">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser } = useGetUserById(id || "");
  const { data: userPosts } = useGetUserPosts(currentUser?.$id);
  const { data: likedPosts } = useGetLikedPosts(currentUser?.$id);
  const { data: followersCount = 0 } = useGetFollowersCount(id || "");
  const { data: followingCount = 0 } = useGetFollowingCount(id || "");

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex items-center gap-3 mb-6 p-6 rounded-3xl bg-gradient-to-br from-blue-100/85 via-indigo-100/80 to-purple-100/85 border-2 border-primary-500/30 shadow-2xl backdrop-blur-md">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500/25 to-secondary-500/25 shadow-md">
            <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg">Profile</h2>
            <p className="text-base text-gray-800 font-bold mt-2">View and manage your profile</p>
          </div>
        </div>

        <div className="profile-container">
          <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7 mb-8">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={userPosts?.documents?.length || 0} label="Posts" />
              <StatBlock value={followersCount} label="Followers" />
              <StatBlock value={followingCount} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              <FollowButton targetUserId={currentUser.$id} className="px-8" />
            </div>
          </div>
        </div>
      </div>

      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <div className="flex max-w-5xl w-full min-h-[500px] mt-6">
        {pathname === `/profile/${id}/liked-posts` ? (
          <GridPostList posts={likedPosts?.documents || []} showUser={false} />
        ) : (
          <GridPostList posts={userPosts?.documents || []} showUser={false} />
        )}
      </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
