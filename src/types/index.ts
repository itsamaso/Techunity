export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption?: string;
  file?: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption?: string;
  imageId: string;
  imageUrl: string;
  file?: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IFollow = {
  followerId: string;
  followingId: string;
};

// Chat Types
export type IChat = {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: string[];
  createdBy: string;
  admins?: string[];
  description?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  groupImageUrl?: string;
  groupImageId?: string;
  createdAt: string;
  updatedAt: string;
};

export type IMessage = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  createdAt: string;
  updatedAt: string;
};

export type INewChat = {
  name: string;
  type: 'direct' | 'group';
  participants: string[];
  createdBy: string;
  admins?: string[];
  description?: string;
  groupImageUrl?: string;
  groupImageId?: string;
};

export type INewMessage = {
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file';
};
