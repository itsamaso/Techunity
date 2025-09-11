# Chat Feature Setup Guide

This document outlines the setup required for the chat functionality in the Techunity app.

## Database Collections Required

You need to create two collections in your Appwrite database:

### 1. Chats Collection
- **Collection ID**: `chats` (or set `VITE_APPWRITE_CHATS_COLLECTION_ID` in your .env)
- **Attributes**:
  - `name` (String, 255 chars, required)
  - `type` (String, 10 chars, required) - Values: "direct" or "group"
  - `participants` (String[], required) - Array of user IDs
  - `createdBy` (String, 255 chars, required) - User ID of creator
  - `lastMessage` (String, 1000 chars, optional)
  - `lastMessageAt` (DateTime, optional)

### 2. Messages Collection
- **Collection ID**: `messages` (or set `VITE_APPWRITE_MESSAGES_COLLECTION_ID` in your .env)
- **Attributes**:
  - `chatId` (String, 255 chars, required) - Reference to chat
  - `senderId` (String, 255 chars, required) - User ID of sender
  - `content` (String, 1000 chars, required)
  - `type` (String, 10 chars, required) - Values: "text", "image", or "file"

## Environment Variables

Add these to your `.env` file:

```env
VITE_APPWRITE_CHATS_COLLECTION_ID=your_chats_collection_id
VITE_APPWRITE_MESSAGES_COLLECTION_ID=your_messages_collection_id
```

## Permissions

Set the following permissions for both collections:

### Chats Collection
- **Create**: Any authenticated user
- **Read**: Any authenticated user (for participants)
- **Update**: Any authenticated user (for participants)
- **Delete**: Any authenticated user (for chat creator)

### Messages Collection
- **Create**: Any authenticated user
- **Read**: Any authenticated user (for chat participants)
- **Update**: Any authenticated user (for message sender)
- **Delete**: Any authenticated user (for message sender)

## Features Implemented

### ✅ Direct Messages
- One-on-one conversations between users
- Real-time message delivery
- Message history
- User search and selection

### ✅ Group Chats
- Multi-user conversations
- Custom group names
- Member management
- Group chat indicators

### ✅ Chat Interface
- Modern, responsive design
- Message bubbles with timestamps
- Search functionality
- Real-time updates
- Intuitive navigation

### ✅ User Experience
- Welcome screen with feature highlights
- Loading states and error handling
- Smooth animations and transitions
- Mobile-responsive design

## Usage

1. Navigate to the "Interact" tab
2. Click "New Chat" to start a conversation
3. Choose between Direct Message or Group Chat
4. Select users to include in the chat
5. Start messaging!

## Technical Details

- Built with React Query for state management
- Uses Appwrite for backend services
- Implements real-time updates through query invalidation
- Responsive design with Tailwind CSS
- TypeScript for type safety

## Future Enhancements

- Real-time messaging with WebSockets
- File and image sharing
- Message reactions and replies
- Chat notifications
- Message search functionality
- Chat export/backup
