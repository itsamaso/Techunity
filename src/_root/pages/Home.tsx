import { Models } from "appwrite";
import { Link } from "react-router-dom";

// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCarousel, PageHeader } from "@/components/shared";
import { useGetRecentPosts } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const Home = () => {
  // const { toast } = useToast();
  const { user } = useUserContext();

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  if (isErrorPosts) {
    return (
      <div className="flex flex-1">
        <div className="common-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <PageHeader
          title="Home"
          subtitle="Discover the latest posts from your community"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
        <div className="max-w-4xl mx-auto">
          {isPostLoading && !posts ? (
            <Loader />
          ) : posts?.documents && posts.documents.length > 0 ? (
            <PostCarousel 
              posts={posts.documents} 
              autoSlideInterval={6000}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-20">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md border border-light-4/30 shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-light-1 mb-2">No posts yet</h3>
                  <p className="text-light-3 mb-6">Be the first to share something amazing!</p>
                  <Link to="/create-post" className="shad-button_primary px-6 py-3 rounded-xl">
                    Create Your First Post
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
