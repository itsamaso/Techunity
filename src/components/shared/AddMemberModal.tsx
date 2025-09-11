import { useState, useMemo } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useGetUsers, useAddMemberToGroup } from "@/lib/react-query/queries";
import { Loader } from "@/components/shared";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: any;
  onMemberAdded?: () => void;
}

const AddMemberModal = ({ isOpen, onClose, chat, onMemberAdded }: AddMemberModalProps) => {
  const { user } = useUserContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { data: users, isLoading: isUsersLoading } = useGetUsers();
  const { mutate: addMember, isPending: isAdding } = useAddMemberToGroup();

  // Filter out users who are already in the group
  const availableUsers = useMemo(() => {
    if (!users?.documents) return [];
    
    return users.documents.filter((userData: any) => {
      // Don't show current user
      if (userData.$id === user.id) return false;
      
      // Don't show users already in the group
      if (chat.participants?.includes(userData.$id)) return false;
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          userData.name.toLowerCase().includes(searchLower) ||
          userData.username.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [users?.documents, chat.participants, user.id, searchTerm]);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMembers = () => {
    if (selectedUsers.length === 0) return;

    // Add each selected user to the group
    selectedUsers.forEach((userId, index) => {
      addMember(
        { chatId: chat.$id, memberId: userId },
        {
          onSuccess: () => {
            if (index === selectedUsers.length - 1) {
              // Last user added successfully
              setSelectedUsers([]);
              onMemberAdded?.();
              onClose();
            }
          },
          onError: (error: any) => {
            console.error('Error adding member:', error);
            alert(error.message || 'Failed to add member');
          }
        }
      );
    });
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[50vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Add Members</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Add new members to "{chat.name}"
          </p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isUsersLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader />
            </div>
          ) : availableUsers.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium text-sm">No users found</p>
              <p className="text-xs text-gray-400 mt-1">
                {searchTerm ? 'Try a different search term' : 'All users are already in this group'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {availableUsers.map((userData: any) => (
                <div
                  key={userData.$id}
                  onClick={() => handleUserToggle(userData.$id)}
                  className={`p-2 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    selectedUsers.includes(userData.$id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xs">
                        {userData.name.charAt(0).toUpperCase()}
                      </div>
                      {selectedUsers.includes(userData.$id) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate text-sm">
                        {userData.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        @{userData.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleClose}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembers}
                disabled={selectedUsers.length === 0 || isAdding}
                className="px-4 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
              >
                {isAdding ? (
                  <>
                    <Loader />
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Members
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
