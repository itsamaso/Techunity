import { useState, useMemo } from "react";
import { useGetUsers, useKickMemberFromGroup } from "@/lib/react-query/queries";
import { Loader } from "@/components/shared";

interface KickMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: any;
  onMemberKicked?: () => void;
}

const KickMembersModal = ({ isOpen, onClose, chat, onMemberKicked }: KickMembersModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading: isUsersLoading } = useGetUsers();
  const { mutate: kickMember, isPending: isKicking } = useKickMemberFromGroup();

  // Filter to show only current group members (excluding the group creator)
  const currentMembers = useMemo(() => {
    if (!users?.documents || !chat.participants) return [];
    
    return users.documents.filter((userData: any) => {
      // Don't show the group creator (they can't be kicked)
      if (userData.$id === chat.createdBy) return false;
      
      // Only show users who are currently in the group
      if (!chat.participants.includes(userData.$id)) return false;
      
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
  }, [users?.documents, chat.participants, chat.createdBy, searchTerm]);

  const handleKickMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to kick this member from the group?')) {
      kickMember(
        { chatId: chat.$id, memberId },
        {
          onSuccess: () => {
            onMemberKicked?.();
            onClose();
          },
          onError: (error: any) => {
            console.error('Error kicking member:', error);
            alert(error.message || 'Failed to kick member');
          }
        }
      );
    }
  };

  const handleClose = () => {
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
            <h2 className="text-lg font-bold text-gray-800">Kick Members</h2>
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
            Remove members from "{chat.name}"
          </p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isUsersLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader />
            </div>
          ) : currentMembers.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium text-sm">No members found</p>
              <p className="text-xs text-gray-400 mt-1">
                {searchTerm ? 'Try a different search term' : 'Only group creator can be shown'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {currentMembers.map((member: any) => (
                <div
                  key={member.$id}
                  className="p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate text-sm">
                          {member.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          @{member.username}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleKickMember(member.$id)}
                      disabled={isKicking}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Kick member"
                    >
                      {isKicking ? (
                        <Loader />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      )}
                    </button>
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
              {currentMembers.length} member{currentMembers.length !== 1 ? 's' : ''} can be kicked
            </span>
            <button
              onClick={handleClose}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KickMembersModal;
