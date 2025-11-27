import React, { useRef, useState } from 'react';
import { UploadCloud, FileAudio, AlertCircle, Loader2 } from 'lucide-react';
import { formatBytes } from '../utils/fileHelper';
import { LoadingState } from '../types';

interface UploadSectionProps {
  onFileSelected: (file: File) => void;
  loadingState: LoadingState;
  error: string | null;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelected, loadingState, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    // Basic validation for common audio/video types
    const validTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-m4a', 'audio/aac', 'audio/ogg',
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'
    ];
    
    // Note: Checking specific mime types can be tricky across browsers, 
    // so we also check extensions as a fallback if needed, but strict type check is safer.
    
    if (validTypes.includes(file.type) || file.name.match(/\.(mp3|wav|m4a|mp4|mov|webm)$/i)) {
      onFileSelected(file);
    } else {
      alert("Unsupported file format. Please upload an audio (MP3, WAV, M4A) or video (MP4, MOV) file.");
    }
  };

  const isLoading = loadingState === LoadingState.READING_FILE || loadingState === LoadingState.GENERATING;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload Recording</h2>
        <p className="text-gray-500">
          Upload your Zoom local recording or downloaded cloud recording.
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-200 ease-in-out flex flex-col items-center justify-center cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*,video/*"
          onChange={handleChange}
        />

        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        {isLoading ? (
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Processing...</p>
            <p className="text-sm text-gray-500 mt-1">
              {loadingState === LoadingState.READING_FILE ? 'Reading file...' : 'Analyzing with Gemini AI...'}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500 mt-1">
              MP3, M4A, MP4, MOV (Max 20MB recommended)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
        <div className="flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-blue-900">Why upload a file instead of a URL?</h4>
          <p className="text-sm text-blue-700 mt-1">
            Zoom recordings are protected by privacy settings and cannot be accessed directly by third-party web apps without complex authentication. For your security, please download the recording from Zoom and upload the file here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
