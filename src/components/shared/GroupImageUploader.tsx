import { useState, useRef } from "react";
import { useUpdateGroupImage } from "@/lib/react-query/queries";
import { Loader } from "@/components/shared";

interface GroupImageUploaderProps {
  chatId: string;
  currentImageUrl?: string;
  isGroupCreator: boolean;
  onImageUpdate?: () => void;
}

const GroupImageUploader = ({ 
  chatId, 
  currentImageUrl, 
  isGroupCreator, 
  onImageUpdate 
}: GroupImageUploaderProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: updateGroupImage, isPending: isUpdating } = useUpdateGroupImage();

  const handleImageClick = () => {
    if (isGroupCreator && !isUpdating) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      updateGroupImage(
        { chatId, file },
        {
          onSuccess: () => {
            onImageUpdate?.();
          },
          onError: (error: any) => {
            console.error('Error updating group image:', error);
            alert(error.message || 'Failed to update group image');
          }
        }
      );
    }
  };

  return (
    <div className="relative">
      <div
        className={`relative w-12 h-12 rounded-full overflow-hidden cursor-pointer transition-all duration-300 ${
          isGroupCreator ? 'hover:ring-2 hover:ring-primary-500/50' : 'cursor-default'
        } ${isUpdating ? 'opacity-50' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleImageClick}
      >
        {currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt="Group"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
            G
          </div>
        )}

        {/* Overlay for group creator */}
        {isGroupCreator && (
          <div
            className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {isUpdating ? (
              <Loader />
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
        )}

        {/* Online indicator for group chats */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default GroupImageUploader;
