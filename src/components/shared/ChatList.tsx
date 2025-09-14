import { useState, useMemo } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserChats, useGetUsers } from "@/lib/react-query/queries";
import { Loader } from "@/components/shared";
import { formatDistanceToNow } from "@/lib/dateUtils";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import GroupImageUploader from "./GroupImageUploader";
import ChatActions from "./ChatActions";

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
  onChatDeleted?: () => void;
  onGroupInfoClick?: (chat: any) => void;
  onCreateChat?: () => void;
}

const ChatList = ({ onSelectChat, selectedChatId, onChatDeleted, onGroupInfoClick, onCreateChat }: ChatListProps) => {
  const { user } = useUserContext();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: chats, isLoading, error } = useGetUserChats(user.id);
  const { data: users } = useGetUsers();
  const { isUserOnline } = useOnlineStatus();

  // Debug logging
  console.log('ChatList - User ID:', user.id);
  console.log('ChatList - Chats data:', chats);
  console.log('ChatList - Loading:', isLoading);
  console.log('ChatList - Error:', error);

  // Create a map of user IDs to user data for quick lookup
  const usersMap = useMemo(() => {
    if (!users?.documents) return {};
    return users.documents.reduce((acc: any, user: any) => {
      acc[user.$id] = user;
      return acc;
    }, {});
  }, [users]);

  // Helper function to get the other participant's name for direct chats
  const getChatDisplayName = (chat: any) => {
    if (chat.type === 'group') {
      return chat.name;
    }
    
    // For direct chats, find the other participant
    const otherParticipantId = chat.participants?.find((p: string) => p !== user.id);
    if (otherParticipantId && usersMap[otherParticipantId]) {
      return usersMap[otherParticipantId].name;
    }
    
    // Fallback to chat name if user not found
    return chat.name;
  };



  // Helper function to get other participants for direct chats
  const getOtherParticipants = (chat: any) => {
    if (chat.type === 'direct') {
      const otherParticipantId = chat.participants?.find((p: string) => p !== user.id);
      return otherParticipantId ? [otherParticipantId] : [];
    }
    return chat.participants?.filter((p: string) => p !== user.id) || [];
  };

  if (isLoading) {
    return (
      <div className="flex-center h-full">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Error loading chats</p>
          <p className="text-sm text-gray-500 mt-1">Please check the console for details</p>
        </div>
      </div>
    );
  }

  const filteredChats = chats?.documents?.filter((chat: any) => {
    const displayName = getChatDisplayName(chat);
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-2xl border border-primary-500/20 shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-primary-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
          {/* New Chat Button */}
          {onCreateChat && (
            <button
              onClick={onCreateChat}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Chat
            </button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white/80 border border-primary-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredChats.length === 0 ? (
          <div className="flex-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No chats found</p>
              <p className="text-sm text-gray-500 mt-1">Start a conversation!</p>
            </div>
          </div>
        ) : (
          <div className="p-2">
            {filteredChats.map((chat: any) => (
              <div
                key={chat.$id}
                onClick={() => onSelectChat(chat.$id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 mb-2 ${
                  selectedChatId === chat.$id
                    ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border-2 border-primary-500/40 shadow-lg"
                    : "bg-white/60 hover:bg-white/80 hover:shadow-md border border-transparent hover:border-primary-500/20"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Chat Avatar */}
                  <div className="relative">
                    {chat.type === 'group' ? (
                      // Group chat - show group profile picture
                      <GroupImageUploader
                        chatId={chat.$id}
                        currentImageUrl={chat.groupImageUrl}
                        isGroupCreator={chat.createdBy === user.id}
                        onImageUpdate={() => {
                          // Trigger a refetch of chats to update the image
                          window.location.reload();
                        }}
                      />
                    ) : (
                      // Direct chat - show other participant's avatar
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {getChatDisplayName(chat).charAt(0).toUpperCase()}
                        </div>
                        {getOtherParticipants(chat).some((id: string) => isUserOnline(id)) && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 
                        className={`font-semibold text-gray-800 truncate ${
                          chat.type === 'group' ? 'cursor-pointer hover:text-primary-600 transition-colors duration-200' : ''
                        }`}
                        onClick={(e) => {
                          if (chat.type === 'group') {
                            e.stopPropagation();
                            onGroupInfoClick?.(chat);
                          }
                        }}
                        title={chat.type === 'group' ? 'Click to view group info' : ''}
                      >
                        {getChatDisplayName(chat)}
                      </h3>
                      {/* Action Button for Group Chats - Top Right */}
                      {chat.type === 'group' && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <ChatActions
                            chat={chat}
                            onChatDeleted={onChatDeleted}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {chat.lastMessage || "No messages yet"}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          chat.type === 'group' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {chat.type === 'group' ? 'Group' : 'Direct'}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {chat.participants?.length || 0} members
                        </span>
                        {getOtherParticipants(chat).some((id: string) => isUserOnline(id)) && (
                          <div className="flex items-center space-x-1 ml-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">
                              {getOtherParticipants(chat).filter((id: string) => isUserOnline(id)).length} online
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Action Button for Direct Chats - Bottom Right */}
                      {chat.type === 'direct' && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <ChatActions
                            chat={chat}
                            onChatDeleted={onChatDeleted}
                          />
                        </div>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-gray-500">
                        {chat.lastMessageAt && formatDistanceToNow(new Date(chat.lastMessageAt))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
