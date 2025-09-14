import { Models } from "appwrite";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useDeleteComment } from "@/lib/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CommentItemProps = {
  comment: Models.Document & {
    userId: string;
    content: string;
    $createdAt: string;
  };
  user?: Models.Document;
};

const CommentItem = ({ comment, user }: CommentItemProps) => {
  const { user: currentUser } = useUserContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate: deleteComment } = useDeleteComment();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsDeleting(true);
      deleteComment(comment.$id, {
        onSuccess: () => {
          setIsDeleting(false);
        },
        onError: (error) => {
          console.error("Failed to delete comment:", error);
          setIsDeleting(false);
        },
      });
    }
  };

  const canDelete = currentUser.id === comment.userId;

  return (
    <div className="comment-item flex gap-3 p-3 hover:bg-gray-50 transition-colors duration-200">
      <Link to={`/profile/${comment.userId}`} className="flex-shrink-0">
        <img
          src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt={user?.name || "User"}
          className="w-8 h-8 rounded-full hover:ring-2 hover:ring-primary-500/50 transition-all duration-200"
        />
      </Link>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link 
                to={`/profile/${comment.userId}`}
                className="font-semibold text-sm text-gray-900 hover:text-primary-600 transition-colors duration-200 truncate"
              >
                {user?.name || "Unknown User"}
              </Link>
              <span className="text-xs text-gray-500">
                {multiFormatDateString(comment.$createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed break-words">
              {comment.content}
            </p>
          </div>
          
          {canDelete && (
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 p-1 h-auto text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
