
import React from 'react';
import { MediaType } from '../types';
import Loader from './Loader';

interface MediaDisplayProps {
  isLoading: boolean;
  loadingMessage: string;
  mediaType: MediaType;
  result: string | null;
  error: string | null;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  isLoading,
  loadingMessage,
  mediaType,
  result,
  error,
}) => {
  if (isLoading) {
    return <Loader mediaType={mediaType} message={loadingMessage} />;
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-gray-700/50 rounded-lg flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-red-500/50">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-red-400">An Error Occurred</h3>
        <p className="text-gray-300 mt-2 max-w-md">{error}</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        {mediaType === MediaType.Image ? (
          <img src={result} alt="Generated content" className="w-full h-full object-contain" />
        ) : (
          <video src={result} controls autoPlay loop className="w-full h-full object-contain" />
        )}
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-gray-700/50 rounded-lg flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-600">
       <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 className="text-xl font-semibold text-gray-300">Your masterpiece awaits</h3>
      <p className="text-gray-400 mt-1">Enter a prompt and click "Generate" to see the magic happen.</p>
    </div>
  );
};

export default MediaDisplay;
