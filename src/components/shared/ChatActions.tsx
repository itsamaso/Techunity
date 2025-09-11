import { useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useRemoveParticipantFromChat, useKickMemberFromGroup, useDeleteChat, useGetUsers } from "@/lib/react-query/queries";
import AddMemberModal from "./AddMemberModal";
import KickMembersModal from "./KickMembersModal";
import AssignAdminModal from "./AssignAdminModal";
import GroupInfoModal from "./GroupInfoModal";

interface ChatActionsProps {
  chat: any;
  onChatDeleted?: () => void;
  onParticipantRemoved?: () => void;
}

const ChatActions = ({ chat, onChatDeleted, onParticipantRemoved }: ChatActionsProps) => {
  const { user } = useUserContext();
  const [showActions, setShowActions] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showKickMembersModal, setShowKickMembersModal] = useState(false);
  const [showAssignAdminModal, setShowAssignAdminModal] = useState(false);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);

  const { mutate: removeParticipant, isPending: isRemoving } = useRemoveParticipantFromChat();
  const { mutate: deleteChat, isPending: isDeleting } = useDeleteChat();

  const isGroupCreator = chat.createdBy === user.id;
  const isDirectChat = chat.type === 'direct';

  const handleDeleteDirectChat = () => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      removeParticipant(
        { chatId: chat.$id, participantId: user.id },
        {
          onSuccess: () => {
            onChatDeleted?.();
          },
          onError: (error: any) => {
            alert(error.message || 'Failed to delete chat');
          }
        }
      );
    }
  };

  const handleExitGroup = () => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      removeParticipant(
        { chatId: chat.$id, participantId: user.id },
        {
          onSuccess: () => {
            onChatDeleted?.();
          },
          onError: (error: any) => {
            alert(error.message || 'Failed to leave group');
          }
        }
      );
    }
  };

  const handleDeleteGroup = () => {
    if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      deleteChat(chat.$id, {
        onSuccess: () => {
          onChatDeleted?.();
        },
        onError: (error: any) => {
          alert(error.message || 'Failed to delete group');
        }
      });
    }
  };


  return (
    <div className="relative">
      {/* Action Button */}
      <button
        onClick={() => setShowActions(!showActions)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        disabled={isRemoving || isDeleting}
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {/* Actions Menu */}
      {showActions && (
        <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[160px]">
          {isDirectChat ? (
            // Direct Chat Actions
            <button
              onClick={handleDeleteDirectChat}
              disabled={isRemoving}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isRemoving ? 'Deleting...' : 'Delete Chat'}
            </button>
          ) : (
            // Group Chat Actions
            <>
              <button
                onClick={() => setShowGroupInfoModal(true)}
                className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Group Info
              </button>
              <button
                onClick={handleExitGroup}
                disabled={isRemoving}
                className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {isRemoving ? 'Leaving...' : 'Leave Group'}
              </button>

              {isGroupCreator && (
                <>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Members
                  </button>
                  <button
                    onClick={() => setShowKickMembersModal(true)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    <span className="text-red-600">Kick Members</span>
                  </button>
                  <button
                    onClick={() => setShowAssignAdminModal(true)}
                    className="w-full px-4 py-2 text-left text-sm text-purple-600 hover:bg-purple-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Assign Admin
                  </button>
                  <button
                    onClick={handleDeleteGroup}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {isDeleting ? 'Deleting...' : 'Delete Group'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}


      {/* Backdrop to close menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowActions(false);
          }}
        />
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        chat={chat}
        onMemberAdded={() => {
          onParticipantRemoved?.();
          setShowActions(false);
        }}
      />

      {/* Kick Members Modal */}
      <KickMembersModal
        isOpen={showKickMembersModal}
        onClose={() => setShowKickMembersModal(false)}
        chat={chat}
        onMemberKicked={() => {
          onParticipantRemoved?.();
          setShowActions(false);
        }}
      />

      {/* Assign Admin Modal */}
      <AssignAdminModal
        isOpen={showAssignAdminModal}
        onClose={() => setShowAssignAdminModal(false)}
        chat={chat}
        onAdminUpdated={() => {
          onParticipantRemoved?.();
          setShowActions(false);
        }}
      />

      {/* Group Info Modal */}
      <GroupInfoModal
        isOpen={showGroupInfoModal}
        onClose={() => setShowGroupInfoModal(false)}
        chat={chat}
        onDescriptionUpdated={() => {
          onParticipantRemoved?.();
        }}
      />
    </div>
  );
};

export default ChatActions;
