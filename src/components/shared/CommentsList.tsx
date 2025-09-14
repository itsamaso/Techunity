import { Models } from "appwrite";
import { useGetPostComments } from "@/lib/react-query/queries";
import { useGetUserById } from "@/lib/react-query/queries";
import CommentItem from "./CommentItem";
import Loader from "./Loader";

type CommentsListProps = {
  postId: string;
};

const CommentsList = ({ postId }: CommentsListProps) => {
  const { data: comments, isLoading } = useGetPostComments(postId);

  if (isLoading) {
    return (
      <div className="comments-list p-4">
        <Loader />
      </div>
    );
  }

  if (!comments || comments.documents.length === 0) {
    return (
      <div className="comments-list p-4">
        <p className="text-center text-gray-500 text-sm py-8">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  return (
    <div className="comments-list">
      <div className="border-t border-gray-200">
        {comments.documents.map((comment: Models.Document) => (
          <CommentWithUser 
            key={comment.$id} 
            comment={comment} 
          />
        ))}
      </div>
    </div>
  );
};

// Helper component to fetch user data for each comment
const CommentWithUser = ({ comment }: { comment: Models.Document }) => {
  const { data: user } = useGetUserById(comment.userId);

  return <CommentItem comment={comment} user={user} />;
};

export default CommentsList;
