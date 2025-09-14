import { useCallback, useState, useEffect } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
  onRemovePhoto?: () => void;
};

const FileUploader = ({ fieldChange, mediaUrl, onRemovePhoto }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  // Update fileUrl when mediaUrl changes (e.g., when photo is removed)
  useEffect(() => {
    setFileUrl(mediaUrl);
  }, [mediaUrl]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [file]
  );

  const handleRemovePhoto = () => {
    setFile([]);
    setFileUrl("");
    fieldChange([]);
    if (onRemovePhoto) {
      onRemovePhoto();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="group relative flex flex-center flex-col bg-gradient-to-br from-blue-50/30 to-purple-50/20 backdrop-blur-sm rounded-2xl cursor-pointer border-2 border-dashed border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 hover:shadow-xl overflow-hidden">
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <>
          <div className="relative flex flex-1 justify-center w-full p-4 lg:p-6">
            <img 
              src={fileUrl} 
              alt="image" 
              className="file_uploader-img rounded-xl shadow-2xl" 
            />
            
            {/* Hover overlay with replace and remove buttons */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center gap-4">
              {/* Replace button */}
              <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-2xl cursor-pointer hover:scale-110 transition-transform duration-300">
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-primary-500"
                >
                  <path 
                    d="M14.5 4h-5L7 7H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-3l-2.5-3zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
              
              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePhoto();
                }}
                className="bg-red-500 backdrop-blur-sm rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-300 hover:bg-red-600 border-2 border-white/20 hover:border-white/40"
                title="Remove photo"
              >
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-white drop-shadow-sm"
                >
                  <path 
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" 
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full p-4 bg-gradient-to-r from-primary-500/15 to-accent-500/15 border-t border-primary-500/10">
            <p className="text-center text-sm text-light-2 font-medium">
              Click or drag to replace photo
            </p>
          </div>
        </>
      ) : (
        <div className="relative">
          <div className="file_uploader-box group-hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500/15 to-secondary-500/15 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-primary-500/20">
                <img
                  src="/assets/icons/file-upload.svg"
                  width={20}
                  height={16}
                  alt="file upload"
                  className="text-primary-500"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-light-1 group-hover:text-primary-400 transition-colors duration-300">
                  Upload Photo
                </h3>
                <p className="text-light-4 text-xs">
                  Drag & drop or click
                </p>
              </div>
            </div>

            <div className="flex gap-1 justify-center mb-3">
              <span className="px-2 py-1 bg-primary-500/15 text-primary-400 text-xs rounded border border-primary-500/25">
                PNG
              </span>
              <span className="px-2 py-1 bg-secondary-500/15 text-secondary-400 text-xs rounded border border-secondary-500/25">
                JPG
              </span>
              <span className="px-2 py-1 bg-green-500/15 text-green-400 text-xs rounded border border-green-500/25">
                SVG
              </span>
            </div>

            <Button 
              type="button" 
              className="shad-button_primary px-4 py-2 rounded-lg font-medium text-xs shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            >
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="mr-1"
              >
                <path 
                  d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" 
                  fill="currentColor"
                />
                <path 
                  d="M14 2v6h6" 
                  fill="currentColor"
                />
              </svg>
              Choose File
            </Button>
          </div>
          
          {/* Hover overlay for default state */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-2xl cursor-pointer hover:scale-110 transition-transform duration-300">
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-primary-500"
              >
                <path 
                  d="M14.5 4h-5L7 7H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-3l-2.5-3zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" 
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
