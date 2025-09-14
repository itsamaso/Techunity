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
  <div className="stat-block">
    <div className="stat-number">{value}</div>
    <div className="stat-label">{label}</div>
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
    <div className="flex flex-1 min-h-screen">
      <div className="common-container profile-page-container">
        {/* Profile Header Section */}
        <div className="profile-header-container">
          {/* Background Gradient */}
          <div className="profile-bg-gradient"></div>
          
          {/* Profile Content */}
          <div className="profile-content">
            {/* Profile Image Section */}
            <div className="profile-image-section">
              <div className="profile-image-wrapper">
                <img
                  src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="profile"
                  className="profile-image"
                />
                <div className="profile-image-ring"></div>
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="profile-info-section">
              <div className="profile-name-section">
                <h1 className="profile-name">{currentUser.name}</h1>
                <p className="profile-username">@{currentUser.username}</p>
                {currentUser.bio && (
                  <p className="profile-bio">{currentUser.bio}</p>
                )}
              </div>

              {/* Stats Section */}
              <div className="stats-container">
                <StatBlock value={userPosts?.documents?.length || 0} label="Posts" />
                <StatBlock value={followersCount} label="Followers" />
                <StatBlock value={followingCount} label="Following" />
              </div>

              {/* Action Buttons */}
              <div className="profile-actions">
                {user.id === currentUser.$id ? (
                  <Link
                    to={`/update-profile/${currentUser.$id}`}
                    className="edit-profile-btn">
                    <img src="/assets/icons/edit.svg" alt="edit" className="btn-icon" />
                    <span>Edit Profile</span>
                  </Link>
                ) : (
                  <FollowButton targetUserId={currentUser.$id} className="follow-profile-btn" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs Section */}
        {currentUser.$id === user.id && (
          <div className="profile-tabs-container">
            <div className="profile-tabs">
              <Link
                to={`/profile/${id}`}
                className={`profile-tab ${pathname === `/profile/${id}` ? "profile-tab-active" : ""}`}>
                <div className="tab-icon">
                  <img src="/assets/icons/posts.svg" alt="posts" />
                </div>
                <span className="tab-text">Posts</span>
                <div className="tab-indicator"></div>
              </Link>
              <Link
                to={`/profile/${id}/liked-posts`}
                className={`profile-tab ${pathname === `/profile/${id}/liked-posts` ? "profile-tab-active" : ""}`}>
                <div className="tab-icon">
                  <img src="/assets/icons/like.svg" alt="like" />
                </div>
                <span className="tab-text">Liked Posts</span>
                <div className="tab-indicator"></div>
              </Link>
            </div>
          </div>
        )}

        {/* Posts Grid Section */}
        <div className="posts-section">
          {pathname === `/profile/${id}/liked-posts` ? (
            <GridPostList posts={likedPosts?.documents || []} showUser={false} />
          ) : (
            <GridPostList posts={userPosts?.documents || []} showUser={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
