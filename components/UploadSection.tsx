import React, { useRef, useState } from 'react';
import { UploadCloud, AlertCircle, Loader2, Globe, AlertTriangle } from 'lucide-react';
import { LoadingState, SummaryLanguage } from '../types';

interface UploadSectionProps {
  onFileSelected: (file: File, language: SummaryLanguage) => void;
  loadingState: LoadingState;
  error: string | null;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelected, loadingState, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [language, setLanguage] = useState<SummaryLanguage>('auto');

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
    // so we also check extensions as a fallback if needed.
    
    if (validTypes.includes(file.type) || file.name.match(/\.(mp3|wav|m4a|mp4|mov|webm)$/i)) {
      onFileSelected(file, language);
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

      {/* Language Selector */}
      <div className="mb-6 flex flex-col items-center">
        <label className="text-sm text-gray-600 mb-2 font-medium">Summary Language / 要約の言語</label>
        <div className="bg-gray-100 p-1 rounded-lg flex gap-1 border border-gray-200">
          <button
            onClick={() => setLanguage('auto')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              language === 'auto' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            Auto
          </button>
          <button
            onClick={() => setLanguage('ja')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              language === 'ja' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            日本語 (Japanese)
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            English
          </button>
        </div>
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
              MP3, M4A, MP4, MOV (Max 5GB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm whitespace-pre-line">{error}</p>
        </div>
      )}
      
      {/* Warning regarding Browser Limits for Large Files */}
      <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-amber-900">Important: Large File Warning / ファイルサイズに関する注意</h4>
          <p className="text-sm text-amber-800 mt-1">
            We accept files up to 5GB. However, due to browser memory limits, <b>processing files larger than 500MB may cause the browser to freeze or crash</b>.
            <br className="mb-1"/>
            5GBまでのファイルを受け付けていますが、ブラウザのメモリ制限により、500MBを超えるファイルは処理中にブラウザが停止する可能性があります。
          </p>
          <p className="text-xs text-amber-700 mt-2 font-medium">
            Tip: For long meetings, converting video to audio-only (MP3/M4A) significantly reduces file size.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;