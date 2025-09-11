import { useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useGetUsers, useUpdateGroupDescription } from "@/lib/react-query/queries";
import { Loader } from "@/components/shared";

interface GroupInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: any;
  onDescriptionUpdated?: () => void;
}

const GroupInfoModal = ({ isOpen, onClose, chat, onDescriptionUpdated }: GroupInfoModalProps) => {
  const { user } = useUserContext();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(chat?.description || "");

  const { data: users } = useGetUsers();
  const { mutate: updateDescription, isPending: isUpdating } = useUpdateGroupDescription();

  // Create users map for quick lookup
  const usersMap = users?.documents?.reduce((acc: any, userData: any) => {
    acc[userData.$id] = userData;
    return acc;
  }, {}) || {};

  // Check if current user can edit description
  const canEditDescription = chat?.createdBy === user.id || chat?.admins?.includes(user.id);

  // Get user role in the group
  const getUserRole = (userId: string) => {
    if (userId === chat?.createdBy) return "Owner";
    if (chat?.admins?.includes(userId)) return "Admin";
    return "Member";
  };

  // Get all group members with their roles
  const getGroupMembers = () => {
    if (!chat?.participants) return [];
    
    return chat.participants.map((participantId: string) => {
      const userData = usersMap[participantId];
      return {
        id: participantId,
        name: userData?.name || "Unknown User",
        username: userData?.username || "unknown",
        role: getUserRole(participantId),
      };
    });
  };

  const handleSaveDescription = () => {
    if (description.trim() === (chat?.description || "")) {
      setIsEditingDescription(false);
      return;
    }

    updateDescription(
      { chatId: chat?.$id, description: description.trim() },
      {
        onSuccess: () => {
          setIsEditingDescription(false);
          onDescriptionUpdated?.();
        },
        onError: (error: any) => {
          console.error('Error updating description:', error);
          alert(error.message || 'Failed to update description');
        }
      }
    );
  };

  const handleCancelEdit = () => {
    setDescription(chat?.description || "");
    setIsEditingDescription(false);
  };

  const handleClose = () => {
    setIsEditingDescription(false);
    setDescription(chat?.description || "");
    onClose();
  };

  if (!isOpen || !chat) return null;

  const members = getGroupMembers();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Group Information</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">{chat?.name}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Description Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Description</h3>
              {canEditDescription && !isEditingDescription && (
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              )}
            </div>
            
            {isEditingDescription ? (
              <div className="space-y-3">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter group description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDescription}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 text-sm flex items-center gap-2"
                  >
                    {isUpdating ? <Loader /> : null}
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  {chat?.description || "No description set"}
                </p>
              </div>
            )}
          </div>

          {/* Members Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Members ({members.length})
            </h3>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{member.name}</h4>
                      <p className="text-sm text-gray-500">@{member.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.role === 'Owner'
                        ? 'bg-purple-100 text-purple-700'
                        : member.role === 'Admin'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal;
