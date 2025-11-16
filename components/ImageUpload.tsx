import React, { useState, useCallback, useRef } from 'react';
import type { ImageData } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import PhotoIcon from './icons/PhotoIcon';

interface ImageUploadProps {
  onImageUpload: (imageData: ImageData) => void;
  title: string;
  description: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, title, description }) => {
  const [dragging, setDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const base64 = await fileToBase64(file);
        const mimeType = file.type;
        onImageUpload({ base64, mimeType, file });
        setImagePreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error converting file to base64:", error);
        alert("There was an error processing your image. Please try another one.");
      }
    } else {
      alert("Please upload a valid image file (e.g., PNG, JPG, WEBP).");
    }
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          handleFile(e.target.files[0]);
      }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />
      <div
        onClick={handleAreaClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col justify-center items-center transition-colors duration-200 cursor-pointer ${
          dragging ? 'border-indigo-400 bg-gray-800' : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="text-center text-gray-400">
            <PhotoIcon className="w-12 h-12 mx-auto" />
            <p className="mt-2 font-semibold text-gray-300">{title}</p>
            <p className="text-sm">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
