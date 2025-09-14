import { Models } from "appwrite";
import PostCard from "./PostCard";
import { useUserContext } from "@/context/AuthContext";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
  onSaveChange?: () => void; // Callback to refresh saved posts
  showSimplifiedUI?: boolean; // For explore tab - hide like and comment buttons
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
  onSaveChange,
  showSimplifiedUI = false,
}: GridPostListProps) => {
  const { user } = useUserContext();

  // Safety check - if posts is undefined or null, don't render
  if (!posts || !Array.isArray(posts)) {
    return (
      <div className="flex-center w-full h-24">
        <p className="text-light-3">No posts found</p>
      </div>
    );
  }

  // Handle empty posts array
  if (posts.length === 0) {
    return (
      <div className="flex-center w-full h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-600 mb-2">No posts yet</p>
          <p className="text-sm text-gray-500">Posts will appear here when available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-container">
      {posts.map((post) => (
        <div key={post.$id} className="grid-post-card">
          <PostCard post={post} onSaveChange={onSaveChange} showSimplifiedUI={showSimplifiedUI} />
        </div>
      ))}
    </div>
  );
};

export default GridPostList;
