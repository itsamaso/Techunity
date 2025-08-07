import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.creator) return;

  return (
    <div className="post-card relative overflow-hidden">
      {/* Tech-inspired decorative elements */}
      <div className="absolute top-6 right-6 w-24 h-24 bg-gradient-to-br from-primary-500/15 to-secondary-500/15 rounded-full blur-2xl"></div>
      <div className="absolute bottom-6 left-6 w-20 h-20 bg-gradient-to-tr from-secondary-500/15 to-primary-500/15 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-primary-500/8 to-secondary-500/8 rounded-full blur-3xl"></div>
      
      {/* Tech grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,157,195,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,157,195,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>
      
      <div className="flex-between mb-8 relative z-10">
        <div className="flex items-center gap-5">
          <Link to={`/profile/${post.creator.$id}`} className="group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/25 to-secondary-500/25 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <img
                src={
                  post.creator?.imageUrl ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="creator"
                className="relative w-16 h-16 rounded-full ring-3 ring-primary-500/50 group-hover:ring-primary-500/70 transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:scale-105"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
            </div>
          </Link>

          <div className="flex flex-col">
            <p className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors duration-300">
              {post.creator.name}
            </p>
            <div className="flex-center gap-3 text-gray-600">
              <p className="text-sm font-medium">
                {multiFormatDateString(post.$createdAt)}
              </p>
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
              <p className="text-sm font-medium">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"} p-3.5 rounded-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 hover:from-primary-500/30 hover:to-secondary-500/30 transition-all duration-300 group border-2 border-primary-500/40 hover:border-primary-500/60 shadow-lg hover:shadow-xl backdrop-blur-sm`}>
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={22}
            height={22}
            className="group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`} className="group relative z-10">
        <div className="text-base py-6">
          <p className="text-gray-800 leading-relaxed group-hover:text-primary-600 transition-colors duration-300 font-medium">{post.caption}</p>
          <ul className="flex gap-3 mt-5 flex-wrap">
            {post.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-gray-700 text-sm bg-gradient-to-r from-primary-500/20 to-secondary-500/20 px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-primary-500/30 hover:to-secondary-500/30 hover:text-primary-700 transition-all duration-300 border border-primary-500/30 hover:border-primary-500/50 font-medium shadow-md hover:shadow-lg backdrop-blur-sm">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl group-hover:shadow-2xl transition-all duration-500">
          {/* Tech-inspired border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/25 via-secondary-500/25 to-primary-500/25 rounded-3xl blur-sm group-hover:blur-md transition-all duration-500"></div>
          
          <img
            src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="post image"
            className="relative post-card_img group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Modern overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Tech-inspired corner accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary-500/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-secondary-500/50 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-secondary-500/50 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary-500/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        </div>
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
