import { Models } from "appwrite";

import { Loader } from "@/components/shared";
import { useGetRecentPosts } from "@/lib/react-query/queries";

const Coding = () => {
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  if (isErrorPosts) {
    return (
      <div className="flex flex-1">
        <div className="common-container">
          <div className="flex-center w-full h-full">
            <p className="body-medium text-light-1">Something bad happened</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex items-center gap-3 mb-6 p-6 rounded-3xl bg-gradient-to-br from-blue-100/85 via-indigo-100/80 to-purple-100/85 border-2 border-primary-500/30 shadow-2xl backdrop-blur-md">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500/25 to-secondary-500/25 shadow-md">
            <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg">Coding</h2>
            <p className="text-base text-gray-800 font-bold mt-2">Share your code and technical insights</p>
          </div>
        </div>

        {isPostLoading && !posts ? (
          <Loader />
        ) : (
          <div className="flex flex-col items-center justify-center w-full py-20">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md border border-light-4/30 shadow-xl">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-light-1 mb-2">Coding section coming soon!</h3>
                <p className="text-light-3 mb-6">Share your code snippets, projects, and technical insights with the community.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coding; 