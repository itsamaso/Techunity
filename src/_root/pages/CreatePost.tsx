import PostForm from "@/components/forms/PostForm";
import { PageHeader } from "@/components/shared";

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <PageHeader
          title="Create Post"
          subtitle="Share your thoughts and ideas with the community"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        />
        <div className="w-full">
          <PostForm action="Create" />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
