import React from 'react';
import { BookOpen } from 'lucide-react';

const LoadingScreen = ({ customMessage = "Please wait while we load your experience and open in dekstop for better visulization experience..." }) => {
  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-md animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
            <BookOpen className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Code Morph
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-gray-400 text-sm">{customMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;