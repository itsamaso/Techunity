import { useState, useEffect, useRef, useMemo } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useGetChatMessages, useSendMessage, useGetChatById, useGetUsers } from "@/lib/react-query/queries";
import { Loader } from "@/components/shared";
import { formatDistanceToNow } from "@/lib/dateUtils";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import GroupImageUploader from "./GroupImageUploader";
import GroupInfoModal from "./GroupInfoModal";

interface ChatWindowProps {
  chatId: string;
}

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const { user } = useUserContext();
  const [message, setMessage] = useState("");
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chat, isLoading: isChatLoading } = useGetChatById(chatId);
  const { data: messages, isLoading: isMessagesLoading } = useGetChatMessages(chatId);
  const { data: users } = useGetUsers();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { isUserOnline } = useOnlineStatus();

  // Create a map of user IDs to user data for quick lookup
  const usersMap = useMemo(() => {
    if (!users?.documents) return {};
    return users.documents.reduce((acc: any, user: any) => {
      acc[user.$id] = user;
      return acc;
    }, {});
  }, [users]);

  // Helper function to get the chat display name
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

  // Helper function to get user avatar color based on name
  const getUserAvatarColor = (userName: string) => {
    const colors = [
      'from-red-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-purple-500 to-violet-500',
      'from-indigo-500 to-blue-500',
      'from-teal-500 to-green-500',
      'from-pink-500 to-rose-500',
      'from-amber-500 to-yellow-500',
      'from-lime-500 to-green-500'
    ];
    
    // Generate consistent color based on name
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Helper function to get user initials
  const getUserInitials = (userName: string) => {
    return userName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  // Helper function to get other participants for direct chats
  const getOtherParticipants = (chat: any) => {
    if (chat.type === 'direct') {
      const otherParticipantId = chat.participants?.find((p: string) => p !== user.id);
      return otherParticipantId ? [otherParticipantId] : [];
    }
    return chat.participants?.filter((p: string) => p !== user.id) || [];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    sendMessage({
      chatId,
      senderId: user.id,
      content: message.trim(),
      type: "text",
    });

    setMessage("");
  };

  if (isChatLoading || isMessagesLoading) {
    return (
      <div className="flex-center h-full">
        <Loader />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Chat not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-2xl border border-primary-500/20 shadow-xl">
      {/* Chat Header */}
      <div 
        className={`p-6 border-b border-primary-500/20 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-t-2xl ${
          chat?.type === 'group' ? 'cursor-pointer hover:from-primary-500/15 hover:to-secondary-500/15 transition-all duration-200' : ''
        }`}
        onClick={() => {
          if (chat?.type === 'group') {
            setShowGroupInfo(true);
          }
        }}
        title={chat?.type === 'group' ? 'Click to view group info' : ''}
      >
        <div className="flex items-center space-x-3">
          {chat.type === 'group' ? (
            // Group chat - show group profile picture
            <GroupImageUploader
              chatId={chat.$id}
              currentImageUrl={chat.groupImageUrl}
              isGroupCreator={chat.createdBy === user.id}
              onImageUpdate={() => {
                // The query will automatically refetch due to invalidation
              }}
            />
          ) : (
            // Direct chat - show other participant's avatar
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {getChatDisplayName(chat).charAt(0).toUpperCase()}
              </div>
              {getOtherParticipants(chat).some((id: string) => isUserOnline(id)) && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{getChatDisplayName(chat)}</h2>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                chat.type === 'group' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {chat.type === 'group' ? 'Group Chat' : 'Direct Message'}
              </span>
              <span className="text-sm text-gray-600">
                {chat.participants?.length || 0} members
              </span>
              {getOtherParticipants(chat).some((id: string) => isUserOnline(id)) && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">
                    {getOtherParticipants(chat).filter((id: string) => isUserOnline(id)).length} online
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {messages?.documents?.length === 0 ? (
          <div className="flex-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No messages yet</p>
              <p className="text-sm text-gray-500 mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages?.documents?.map((msg: any, index: number) => {
              const isOwnMessage = msg.senderId === user.id;
              const sender = usersMap[msg.senderId];
              const senderName = sender ? sender.name : 'Unknown User';
              const prevMessage = index > 0 ? messages.documents[index - 1] : null;
              const isConsecutiveMessage = prevMessage && prevMessage.senderId === msg.senderId;
              
              return (
                <div key={msg.$id}>
                  {/* Show sender info for group chats when it's a new sender or first message */}
                  {!isOwnMessage && chat.type === 'group' && !isConsecutiveMessage && (
                    <div className="flex items-center space-x-2 mb-2 mt-4 first:mt-0">
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getUserAvatarColor(senderName)} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                          {getUserInitials(senderName)}
                        </div>
                        {isUserOnline(msg.senderId) && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-700">{senderName}</span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(msg.$createdAt))}
                        </span>
                        {isUserOnline(msg.senderId) && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">online</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Message bubble */}
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${
                    !isOwnMessage && chat.type === 'group' && !isConsecutiveMessage ? 'ml-10' : ''
                  }`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                        : 'bg-white/90 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      {isOwnMessage && (
                        <p className="text-xs mt-1 text-white/70">
                          {formatDistanceToNow(new Date(msg.$createdAt))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-primary-500/20 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-b-2xl">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-white/80 border border-primary-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
      
      {/* Group Info Modal */}
      {chat?.type === 'group' && (
        <GroupInfoModal
          isOpen={showGroupInfo}
          onClose={() => setShowGroupInfo(false)}
          chat={chat}
          onDescriptionUpdated={() => {
            // The query will automatically refetch due to invalidation
          }}
        />
      )}
    </div>
  );
};

export default ChatWindow;
