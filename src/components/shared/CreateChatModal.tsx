import { useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useGetUsers, useCreateChat } from "@/lib/react-query/queries";
import { Loader } from "@/components/shared";

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (chatId: string) => void;
}

const CreateChatModal = ({ isOpen, onClose, onChatCreated }: CreateChatModalProps) => {
  const { user } = useUserContext();
  const [chatName, setChatName] = useState("");
  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading: isUsersLoading } = useGetUsers();
  const { mutate: createChat, isPending: isCreating } = useCreateChat();

  const handleUserToggle = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (chatType === 'direct' && selectedUsers.length !== 1) {
      alert('Please select exactly one user for direct chat');
      return;
    }
    
    if (chatType === 'group' && selectedUsers.length < 1) {
      alert('Please select at least one user for group chat');
      return;
    }

    if (chatType === 'group' && !chatName.trim()) {
      alert('Please enter a group name');
      return;
    }

    const participants = [...selectedUsers, user.id];
    const name = chatType === 'direct' 
      ? users?.documents?.find(u => u.$id === selectedUsers[0])?.name || 'Direct Chat'
      : chatName.trim();

    createChat({
      name,
      type: chatType,
      participants,
      createdBy: user.id,
    }, {
      onSuccess: (data) => {
        onChatCreated(data.$id);
        onClose();
        setChatName("");
        setSelectedUsers([]);
        setSearchTerm("");
      },
      onError: (error) => {
        console.error('Error creating chat:', error);
        alert('Failed to create chat. Please try again.');
      }
    });
  };

  const filteredUsers = users?.documents?.filter((u: any) => 
    u.$id !== user.id && 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
          <h2 className="text-2xl font-bold text-gray-800">Start New Chat</h2>
          <p className="text-gray-600 mt-1">Create a direct message or group chat</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Chat Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Chat Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="direct"
                  checked={chatType === 'direct'}
                  onChange={(e) => setChatType(e.target.value as 'direct' | 'group')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Direct Message</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="group"
                  checked={chatType === 'group'}
                  onChange={(e) => setChatType(e.target.value as 'direct' | 'group')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Group Chat</span>
              </label>
            </div>
          </div>

          {/* Group Name */}
          {chatType === 'group' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
              <input
                type="text"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300"
                required={chatType === 'group'}
              />
            </div>
          )}

          {/* User Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Users</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 mb-3"
            />
            
            {/* User List */}
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl">
              {isUsersLoading ? (
                <div className="flex-center p-4">
                  <Loader />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No users found
                </div>
              ) : (
                <div className="p-2">
                  {filteredUsers.map((u: any) => (
                    <label
                      key={u.$id}
                      className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(u.$id)}
                        onChange={() => handleUserToggle(u.$id)}
                        className="mr-3"
                      />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-500">@{u.username}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Users Count */}
          {selectedUsers.length > 0 && (
            <div className="text-sm text-gray-600">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || (chatType === 'direct' && selectedUsers.length !== 1) || (chatType === 'group' && selectedUsers.length < 1)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isCreating ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Chat'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChatModal;
