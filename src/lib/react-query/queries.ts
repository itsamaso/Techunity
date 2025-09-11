import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import {
  createUserAccount,
  signInAccount,
  getCurrentUser,
  signOutAccount,
  getUsers,
  createPost,
  getPostById,
  updatePost,
  getUserPosts,
  getLikedPosts,
  deletePost,
  likePost,
  getUserById,
  updateUser,
  getRecentPosts,
  getInfinitePosts,
  searchPosts,
  savePost,
  deleteSavedPost,
  followUser,
  unfollowUser,
  getFollowersCount,
  getFollowingCount,
  checkIfFollowing,
  createChat,
  getUserChats,
  getChatById,
  getChatMessages,
  sendMessage,
  deleteMessage,
  deleteChat,
  updateGroupImage,
  removeParticipantFromChat,
  kickMemberFromGroup,
  addMemberToGroup,
  assignAdminToGroup,
  removeAdminFromGroup,
  updateGroupDescription,
  getChallenges,
  getChallengeById,
  submitChallengeAttempt,
  getUserProgress,
  getAchievements,
  getUserChallengeAttempts,
} from "@/lib/appwrite/api";
import { INewPost, INewUser, IUpdatePost, IUpdateUser, INewChat, INewMessage, INewUserChallengeAttempt } from "@/types";

// ============================================================
// AUTH QUERIES
// ============================================================

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

// ============================================================
// POST QUERIES
// ============================================================

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useSearchPosts = (searchTerm: string, searchType: 'caption' | 'tags' = 'caption') => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm, searchType],
    queryFn: () => searchPosts(searchTerm, searchType),
    enabled: !!searchTerm,
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};

export const useGetLikedPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIKED_POSTS, userId],
    queryFn: () => getLikedPosts(userId!),
    enabled: !!userId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIKED_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
    onError: (error) => {
      console.error('useSavePost: Error occurred:', error);
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
    onError: (error) => {
      console.error('useDeleteSavedPost: Error occurred:', error);
    },
  });
};

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

// ============================================================
// FOLLOW SYSTEM QUERIES
// ============================================================

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
      followUser(followerId, followingId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
      // Invalidate the specific follow check query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHECK_IF_FOLLOWING, variables.followerId, variables.followingId],
      });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (followRecordId: string) => unfollowUser(followRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
      // Invalidate all follow check queries since we don't have the specific user IDs
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHECK_IF_FOLLOWING],
      });
    },
  });
};

export const useGetFollowersCount = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWERS_COUNT, userId],
    queryFn: () => getFollowersCount(userId),
    enabled: !!userId,
  });
};

export const useGetFollowingCount = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWING_COUNT, userId],
    queryFn: () => getFollowingCount(userId),
    enabled: !!userId,
  });
};

export const useCheckIfFollowing = (followerId: string, followingId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHECK_IF_FOLLOWING, followerId, followingId],
    queryFn: () => checkIfFollowing(followerId, followingId),
    enabled: !!followerId && !!followingId,
  });
};

// ============================================================
// CHAT QUERIES
// ============================================================

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chat: INewChat) => createChat(chat),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHATS],
      });
    },
  });
};

export const useGetUserChats = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_CHATS, userId],
    queryFn: () => getUserChats(userId),
    enabled: !!userId,
  });
};

export const useGetChatById = (chatId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CHAT_BY_ID, chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
  });
};

export const useGetChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CHAT_MESSAGES, chatId],
    queryFn: () => getChatMessages(chatId),
    enabled: !!chatId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: INewMessage) => sendMessage(message),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHAT_MESSAGES, data?.chatId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHATS],
      });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHAT_MESSAGES],
      });
    },
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatId: string) => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHATS],
      });
    },
  });
};

export const useUpdateGroupImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, file }: { chatId: string; file: File }) => updateGroupImage(chatId, file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHATS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHAT_BY_ID, data?.$id],
      });
    },
  });
};

export const useRemoveParticipantFromChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, participantId }: { chatId: string; participantId: string }) => 
      removeParticipantFromChat(chatId, participantId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHATS],
      });
      if (data?.deleted) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CHAT_BY_ID],
        });
      } else if (data && '$id' in data) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CHAT_BY_ID, data.$id],
        });
      }
    },
  });
};

export const useKickMemberFromGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, memberId }: { chatId: string; memberId: string }) => 
      kickMemberFromGroup(chatId, memberId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHATS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHAT_BY_ID, data?.$id],
      });
    },
  });
};

export const useAddMemberToGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, memberId }: { chatId: string; memberId: string }) => 
      addMemberToGroup(chatId, memberId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHATS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHAT_BY_ID, data?.$id],
      });
    },
  });
};

export const useAssignAdminToGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, memberId }: { chatId: string; memberId: string }) => 
      assignAdminToGroup(chatId, memberId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHATS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHAT_BY_ID, data?.$id],
      });
    },
  });
};

export const useRemoveAdminFromGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, memberId }: { chatId: string; memberId: string }) => 
      removeAdminFromGroup(chatId, memberId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHATS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHAT_BY_ID, data?.$id],
      });
    },
  });
};

export const useUpdateGroupDescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, description }: { chatId: string; description: string }) => 
      updateGroupDescription(chatId, description),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHATS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHAT_BY_ID, data?.$id],
      });
    },
  });
};

// ============================================================
// CODING CHALLENGES QUERIES
// ============================================================

export const useGetChallenges = (filters?: {
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CHALLENGES, filters],
    queryFn: () => getChallenges(filters),
  });
};

export const useGetChallengeById = (challengeId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CHALLENGE_BY_ID, challengeId],
    queryFn: () => getChallengeById(challengeId),
    enabled: !!challengeId,
  });
};

export const useSubmitChallengeAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attempt: INewUserChallengeAttempt) => submitChallengeAttempt(attempt),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_PROGRESS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHALLENGE_ATTEMPTS],
      });
    },
  });
};

export const useGetUserProgress = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_PROGRESS, userId],
    queryFn: () => getUserProgress(userId),
    enabled: !!userId,
  });
};

export const useGetAchievements = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ACHIEVEMENTS],
    queryFn: getAchievements,
  });
};

export const useGetUserChallengeAttempts = (userId: string, challengeId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_CHALLENGE_ATTEMPTS, userId, challengeId],
    queryFn: () => getUserChallengeAttempts(userId, challengeId),
    enabled: !!userId,
  });
};
