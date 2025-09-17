import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import MediaGenerator from './components/MediaGenerator';
import { ActiveView } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('chat');

  const renderContent = () => {
    switch (activeView) {
      case 'chat':
        return <Chatbot />;
      case 'media':
        return <MediaGenerator />;
      default:
        return <Chatbot />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <Navbar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-grow flex flex-col items-center p-4">
         <div className="w-full max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
      
      {activeView !== 'chat' && <Footer />}
    </div>
  );
};

export default App;