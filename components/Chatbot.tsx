import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { marked } from 'marked';
import { ChatMessage } from '../types';
import * as geminiService from '../services/Service';

const UserAvatar: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-white">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  </div>
);

const ModelAvatar: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
    <div className="w-5 h-5 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-sm transform rotate-45"></div>
  </div>
);

const initialMessage: ChatMessage = {
    role: 'model',
    parts: [{ text: "Hello! I'm Z-AI, your creative partner. How can I help you be creative today?" }]
};

const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([initialMessage]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Fix: Use `any` for SpeechRecognition ref to avoid type error since it's a browser-specific API.
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    setChat(geminiService.createChat());
    
    // Fix: Cast window to `any` to access browser-specific SpeechRecognition API and its vendor prefixes.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
        setHasSpeechSupport(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            setUserInput(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        recognitionRef.current = recognition;
    } else {
        console.warn("Speech Recognition API is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [userInput]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !chat || isLoading) return;

    const text = userInput;
    setUserInput('');
    setIsLoading(true);

    const userMessage: ChatMessage = { role: 'user', parts: [{ text }] };
    setHistory(prev => [...prev, userMessage]);
    
    try {
      const responseStream = await chat.sendMessageStream({ message: text });
      
      let modelResponse = '';
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of responseStream) {
        modelResponse += chunk.text;
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: modelResponse }] };
          return newHistory;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
          role: 'model',
          parts: [{ text: "Sorry, I encountered an error. Please try again." }],
      };
      setHistory(prev => {
        const newHistory = [...prev];
        // If the last message was the empty placeholder, replace it. Otherwise, add new error message.
        if (newHistory[newHistory.length-1].parts[0].text === '') {
          newHistory[newHistory.length-1] = errorMessage;
        } else {
          newHistory.push(errorMessage)
        }
        return newHistory;
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMicClick = () => {
    if (isLoading || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const renderMessageContent = (content: string) => {
    const htmlContent = marked.parse(content, { gfm: true, breaks: true });
    return <div className="prose prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-pre:bg-gray-800 prose-pre:p-3 prose-pre:rounded-md" dangerouslySetInnerHTML={{ __html: htmlContent as string }} />;
  };

  return (
    <>
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          ZAI Chat
        </h1>
        <p className="text-gray-400 mt-2">Your creative and helpful AI assistant.</p>
      </header>
      
      {/* Chat history area that flows with the page */}
      <div className="space-y-6 pb-32">
        {history.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'model' ? <ModelAvatar /> : <UserAvatar />}
            <div className={`max-w-xl p-3 rounded-lg shadow-md ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-700 text-gray-200 rounded-bl-none'
            }`}>
              {renderMessageContent(msg.parts[0].text)}
            </div>
          </div>
        ))}
        {isLoading && history[history.length - 1]?.role === 'user' && (
          <div className="flex items-start gap-3 flex-row">
            <ModelAvatar />
            <div className="max-w-xl p-3 rounded-lg bg-gray-700 text-gray-200 rounded-bl-none">
              <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      {/* Fixed input bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
            <div className="p-4">
              <div className="bg-gray-700 rounded-xl p-2 flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={isListening ? "Listening..." : "Type your message..."}
                  className="flex-grow p-2 text-base bg-transparent border-none focus:ring-0 transition-colors resize-none max-h-36 overflow-y-auto"
                  rows={1}
                  disabled={isLoading}
                  aria-label="Chat input"
                />
                {hasSpeechSupport && (
                    <button
                    onClick={handleMicClick}
                    disabled={isLoading}
                    className={`h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 14a2 2 0 1 0-2-2a2 2 0 0 0 2 2m0-10a4 4 0 0 0-4 4v4a4 4 0 0 0 8 0V8a4 4 0 0 0-4-4m6 10a1 1 0 0 0-1 1a5 5 0 0 1-10 0a1 1 0 0 0-2 0a7 7 0 0 0 6 6.92V22a1 1 0 0 0 2 0v-1.08A7 7 0 0 0 18 15a1 1 0 0 0-1-1"/>
                    </svg>
                    </button>
                )}
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !userInput.trim()}
                  className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-blue-600 rounded-full text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:bg-gray-500 disabled:cursor-not-allowed transform enabled:hover:scale-110"
                  aria-label="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;