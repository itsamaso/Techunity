import { useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useCreateComment } from "@/lib/react-query/queries";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Loader from "./Loader";

type CommentFormProps = {
  postId: string;
  onCommentAdded?: () => void;
};

const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const { user } = useUserContext();
  const { mutate: createComment, isPending } = useCreateComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !user.id) return;

    createComment(
      {
        postId,
        userId: user.id,
        content: comment.trim(),
      },
      {
        onSuccess: () => {
          setComment("");
          onCommentAdded?.();
        },
        onError: (error) => {
          console.error("Failed to create comment:", error);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="flex gap-3 w-full">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1 flex flex-col gap-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[80px] resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {comment.length}/500
            </span>
            <Button
              type="submit"
              disabled={!comment.trim() || isPending}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader />
                  <span>Posting...</span>
                </div>
              ) : (
                "Post Comment"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
