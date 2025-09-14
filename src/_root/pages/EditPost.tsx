import { useParams, useNavigate } from "react-router-dom";

import { Loader } from "@/components/shared";
import PostForm from "@/components/forms/PostForm";
import { useGetPostById, useDeletePost } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const { data: post, isLoading } = useGetPostById(id);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const handleDeletePost = () => {
    if (!post || !id) return;
    
    // Check if user is the creator
    if (user.id !== post.creator.$id) {
      toast({
        title: "Access denied",
        description: "You can only delete your own posts.",
      });
      return;
    }

    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      deletePost({ postId: id, imageId: post.imageId });
      toast({
        title: "Post deleted successfully",
      });
      navigate("/");
    }
  };

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {isLoading ? <Loader /> : <PostForm action="Update" post={post} onDelete={handleDeletePost} isDeleting={isDeleting} />}
      </div>
    </div>
  );
};

export default EditPost;
