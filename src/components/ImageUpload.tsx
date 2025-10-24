import React, { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { getAdminHeaders } from '../utils/auth';

interface ImageUploadProps {
  section: 'vendors' | 'professionals' | 'products' | 'ads';
  imageType: 'logo' | 'product' | 'ad' | 'profile';
  isVerified?: boolean;
  testMode?: boolean;
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  currentImage?: string;
  label?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  section,
  imageType,
  isVerified = false,
  testMode = false,
  onUploadSuccess,
  onUploadError,
  currentImage,
  label = 'Upload Image',
  maxSizeMB = 2
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file format. Please upload JPG, PNG, or WEBP';
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      return `File exceeds ${maxSizeMB}MB limit`;
    }

    return null;
  };

  const uploadImage = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (onUploadError) onUploadError(validationError);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', section);
      formData.append('image_type', imageType);
      formData.append('is_verified', String(isVerified));
      formData.append('test_mode', String(testMode));

      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const headers = getAdminHeaders() as Record<string, string>;
      
      const authHeaders: Record<string, string> = {};
      if ('Authorization' in headers) {
        authHeaders['Authorization'] = headers['Authorization'];
      } else if ('X-Admin-Secret' in headers) {
        authHeaders['X-Admin-Secret'] = headers['X-Admin-Secret'];
      }

      const response = await fetch(`${backendUrl}/api/upload-image`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      onUploadSuccess(data.url);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      if (onUploadError) onUploadError(errorMessage);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
            dragActive
              ? 'border-[#00A86B] bg-emerald-50'
              : 'border-gray-300 hover:border-[#C5A14E]'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleChange}
            disabled={uploading}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`p-3 rounded-full ${dragActive ? 'bg-emerald-100' : 'bg-gray-100'}`}>
              <Upload className={`w-8 h-8 ${dragActive ? 'text-[#00A86B]' : 'text-gray-400'}`} />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {uploading ? 'Uploading...' : 'Drag and drop your image here'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or <span className="text-[#C5A14E] font-medium">Browse Files</span>
              </p>
            </div>

            <p className="text-xs text-gray-400">
              JPG, PNG, WEBP • Max {maxSizeMB}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative border-2 border-[#00A86B] rounded-lg overflow-hidden shadow-md">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />

          <div className="absolute top-2 right-2 flex space-x-2">
            {!uploading && (
              <>
                <button
                  onClick={handleRemove}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-[#C5A14E] text-white rounded-full hover:bg-[#B39043] transition-colors shadow-lg"
                  title="Replace image"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00A86B]"></div>
                <span className="text-sm font-medium text-gray-700">Processing...</span>
              </div>
            </div>
          )}

          {!uploading && (
            <div className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
              <Check className="w-4 h-4" />
              <span className="text-xs font-medium">Uploaded</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleChange}
            disabled={uploading}
          />
        </div>
      )}

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isVerified && !error && preview && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700">
            ✓ BlkXchange™ Verified watermark will be added automatically
          </p>
        </div>
      )}
    </div>
  );
}
