import React, { useState, useCallback } from 'react';
import GeneratorForm from './GeneratorForm';
import MediaDisplay from './MediaDisplay';
import { MediaType } from '../types';
import * as geminiService from '../services/Service';

const MediaGenerator: React.FC = () => {
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.Image);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pageTitle = "Z-AI Media Generator";
  const pageDescription = "Create stunning images and videos from text with the power of Gemini.";

  const handleRefine = useCallback(async () => {
    if (!prompt) {
      return;
    }
    setIsRefining(true);
    setError(null);
    try {
      const refinedPrompt = await geminiService.refinePrompt(prompt);
      setPrompt(refinedPrompt);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Refine failed: ${errorMessage}`);
    } finally {
      setIsRefining(false);
    }
  }, [prompt]);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setError(null);
    setLoadingMessage('Initializing generation...');

    try {
      let generatedResult: string;
      if (mediaType === MediaType.Image) {
        setLoadingMessage('Generating your image...');
        generatedResult = await geminiService.generateImage(prompt);
      } else {
        generatedResult = await geminiService.generateVideo(prompt, setLoadingMessage);
      }
      setResult(generatedResult);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Generation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [prompt, mediaType]);

  return (
    <>
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {pageTitle}
        </h1>
        <p className="text-gray-400 mt-2">{pageDescription}</p>
      </header>
      
      <main className="bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8">
        <div className="flex justify-center mb-6">
            <div className="relative bg-gray-700 rounded-full p-1 flex items-center transition-all duration-300">
                <span
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-blue-600 rounded-full transition-transform duration-300 transform ${
                        mediaType === MediaType.Image ? 'translate-x-[4px]' : 'translate-x-[calc(100%+4px)]'
                    }`}
                    style={{ left: 0 }}
                ></span>
                <button
                    onClick={() => setMediaType(MediaType.Image)}
                    className="relative z-10 w-24 py-2 text-sm font-semibold text-white rounded-full focus:outline-none transition-colors duration-300"
                    aria-pressed={mediaType === MediaType.Image}
                >
                    Image
                </button>
                <button
                    onClick={() => setMediaType(MediaType.Video)}
                    className="relative z-10 w-24 py-2 text-sm font-semibold text-white rounded-full focus:outline-none transition-colors duration-300"
                    aria-pressed={mediaType === MediaType.Video}
                >
                    Video
                </button>
            </div>
        </div>

        <GeneratorForm
          prompt={prompt}
          setPrompt={setPrompt}
          onSubmit={handleGenerate}
          onRefine={handleRefine}
          isLoading={isLoading}
          isRefining={isRefining}
          mediaType={mediaType}
        />
        <div className="mt-8">
          <MediaDisplay
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            mediaType={mediaType}
            result={result}
            error={error}
          />
        </div>
      </main>
    </>
  );
};

export default MediaGenerator;