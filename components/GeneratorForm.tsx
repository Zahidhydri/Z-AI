
import React from 'react';

interface GeneratorFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  onRefine: () => void;
  isLoading: boolean;
  isRefining: boolean;
  mediaType: 'image' | 'video';
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  onRefine,
  isLoading,
  isRefining,
  mediaType,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={mediaType === 'image' 
              ? "e.g., A cinematic shot of a raccoon astronaut on Mars"
              : "e.g., A majestic whale breaching the ocean in slow motion"
            }
            className="w-full h-28 p-4 pr-12 text-lg bg-gray-700 border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors resize-none"
            disabled={isLoading || isRefining}
            aria-label="Prompt for media generation"
          />
          <div className="absolute top-0 right-0 h-full p-3 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L17.5 2.5z" />
            </svg>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col gap-3">
             <button
                type="button"
                onClick={onRefine}
                disabled={isLoading || isRefining || !prompt}
                className="w-full md:w-48 h-12 flex items-center justify-center px-6 text-base font-semibold text-gray-900 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-md hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
             >
                {isRefining ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refining...
                    </>
                ) : (
                    <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Refine Prompt
                    </>
                )}
             </button>
             <button
                type="submit"
                disabled={isLoading || isRefining}
                className="w-full md:w-48 h-12 flex items-center justify-center px-6 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                {isLoading ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                    </>
                ) : (
                    'Generate'
                )}
            </button>
        </div>
      </div>
    </form>
  );
};

export default GeneratorForm;