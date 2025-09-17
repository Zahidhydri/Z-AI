
import React from 'react';
import { MediaType } from '../types';

interface LoaderProps {
  mediaType: MediaType;
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ mediaType, message }) => {
  return (
    <div className="w-full aspect-video bg-gray-700/50 rounded-lg flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-600">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-b-transparent border-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
      </div>
      <h3 className="text-xl font-semibold text-gray-200 mt-6">Generating...</h3>
      {mediaType === MediaType.Video && (
        <p className="text-gray-400 mt-2 animate-pulse-fast max-w-sm">{message}</p>
      )}
    </div>
  );
};

export default Loader;
