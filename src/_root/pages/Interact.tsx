import { useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { ChatList, ChatWindow, CreateChatModal, GroupInfoModal, PageHeader } from "@/components/shared";

const Interact = () => {
  const { user } = useUserContext();
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroupForInfo, setSelectedGroupForInfo] = useState<any>(null);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleChatCreated = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsCreateModalOpen(false);
  };

  const handleChatDeleted = () => {
    setSelectedChatId(undefined);
  };

  const handleGroupInfoClick = (chat: any) => {
    setSelectedGroupForInfo(chat);
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <PageHeader
          title="Interact"
          subtitle="Connect and chat with fellow tech enthusiasts"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
        />

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <ChatList 
              onSelectChat={handleSelectChat} 
              selectedChatId={selectedChatId}
              onChatDeleted={handleChatDeleted}
              onGroupInfoClick={handleGroupInfoClick}
              onCreateChat={() => setIsCreateModalOpen(true)}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedChatId ? (
              <ChatWindow chatId={selectedChatId} />
            ) : (
              <div className="h-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-2xl border border-primary-500/20 shadow-xl flex-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Interact!</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Start conversations with fellow tech enthusiasts. Create direct messages or group chats to collaborate and share ideas.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Direct messages for one-on-one conversations</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Group chats for team collaboration</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Real-time messaging with instant delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Chat Modal */}
        <CreateChatModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onChatCreated={handleChatCreated}
        />
        
        {selectedGroupForInfo && (
          <GroupInfoModal
            isOpen={!!selectedGroupForInfo}
            onClose={() => setSelectedGroupForInfo(null)}
            chat={selectedGroupForInfo}
            onDescriptionUpdated={() => {
              // Refresh chat data if needed
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Interact; 