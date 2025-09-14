export enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_USER_ACCOUNT = "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER = "getCurrentUser",
  GET_USERS = "getUsers",
  GET_USER_BY_ID = "getUserById",

  // POST KEYS
  GET_POSTS = "getPosts",
  GET_INFINITE_POSTS = "getInfinitePosts",
  GET_RECENT_POSTS = "getRecentPosts",
  GET_POST_BY_ID = "getPostById",
  GET_USER_POSTS = "getUserPosts",
  GET_LIKED_POSTS = "getLikedPosts",
  GET_FILE_PREVIEW = "getFilePreview",

  //  SEARCH KEYS
  SEARCH_POSTS = "getSearchPosts",
  SEARCH_USERS = "getSearchUsers",

  // FOLLOW KEYS
  GET_FOLLOWERS_COUNT = "getFollowersCount",
  GET_FOLLOWING_COUNT = "getFollowingCount",
  CHECK_IF_FOLLOWING = "checkIfFollowing",

  // CHAT KEYS
  GET_USER_CHATS = "getUserChats",
  GET_CHAT_BY_ID = "getChatById",
  GET_CHAT_MESSAGES = "getChatMessages",

  // CODING CHALLENGES KEYS
  GET_CHALLENGES = "getChallenges",
  GET_CHALLENGE_BY_ID = "getChallengeById",
  GET_USER_PROGRESS = "getUserProgress",
  GET_ACHIEVEMENTS = "getAchievements",
  GET_USER_CHALLENGE_ATTEMPTS = "getUserChallengeAttempts",

  // COMMENT KEYS
  GET_POST_COMMENTS = "getPostComments",
  CREATE_COMMENT = "createComment",
  DELETE_COMMENT = "deleteComment",
}
