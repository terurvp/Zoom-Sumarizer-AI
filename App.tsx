import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import SummaryResult from './components/SummaryResult';
import { fileToBase64 } from './utils/fileHelper';
import { generateZoomSummary } from './services/geminiService';
import { LoadingState, FileData } from './types';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);

  const handleFileSelected = async (file: File) => {
    setError(null);
    setSummary(null);
    
    // Size check: Client side limit recommendation for browser performance (Base64 overhead)
    // 50MB is generous but manageable for modern browsers.
    if (file.size > 50 * 1024 * 1024) {
      setError("File is too large (max 50MB recommended for browser-based processing). Please trim the recording or use a smaller format.");
      return;
    }

    try {
      setLoadingState(LoadingState.READING_FILE);
      
      const base64 = await fileToBase64(file);
      
      setCurrentFile({
        name: file.name,
        type: file.type,
        size: file.size,
        base64: base64 // Storing purely for metadata if needed, usually just passed to service
      });

      setLoadingState(LoadingState.GENERATING);
      const generatedSummary = await generateZoomSummary(base64, file.type);
      
      setSummary(generatedSummary);
      setLoadingState(LoadingState.SUCCESS);
      
    } catch (err: any) {
      console.error(err);
      setLoadingState(LoadingState.ERROR);
      setError(err.message || "An unexpected error occurred while processing the file.");
    }
  };

  const handleReset = () => {
    setSummary(null);
    setCurrentFile(null);
    setError(null);
    setLoadingState(LoadingState.IDLE);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Zoom Recordings into <br/>
            <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Actionable Summaries</span>
          </h1>
          <p className="text-lg text-gray-600">
            Upload your audio or video file. Our AI listens to the meeting, extracts key points, and drafts a professional summary in seconds.
          </p>
        </div>

        {!summary && (
          <UploadSection 
            onFileSelected={handleFileSelected} 
            loadingState={loadingState}
            error={error}
          />
        )}

        {summary && (
          <SummaryResult 
            summary={summary} 
            fileData={currentFile}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Zoom Summarizer AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
