import React from 'react';
import { Video, Mic, FileText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Zoom<span className="text-blue-600">Summarizer</span></h1>
        </div>
        <div className="flex gap-4 text-sm text-gray-500 hidden sm:flex">
          <span className="flex items-center gap-1"><Mic className="w-4 h-4" /> Audio Support</span>
          <span className="flex items-center gap-1"><Video className="w-4 h-4" /> Video Support</span>
          <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> Instant Text</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
