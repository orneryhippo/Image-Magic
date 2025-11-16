import React, { useState } from 'react';
import type { AppTab } from './types';
import ImageEditor from './components/ImageEditor';
import TimeTravelBooth from './components/TimeTravelBooth';
import SparklesIcon from './components/icons/SparklesIcon';
import HistoryIcon from './components/icons/HistoryIcon';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('editor');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'editor':
        return <ImageEditor />;
      case 'timeTravel':
        return <TimeTravelBooth />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabName: AppTab; icon: React.ReactNode; label: string }> = ({ tabName, icon, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm md:text-base font-medium rounded-md transition-colors ${
        activeTab === tabName
          ? 'bg-indigo-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">Gemini Image Magic</h1>
          </div>
          <nav className="flex items-center gap-2 p-1 bg-gray-800 rounded-lg">
            <TabButton 
              tabName="editor" 
              icon={<SparklesIcon className="w-5 h-5" />} 
              label="Image Editor" 
            />
            <TabButton 
              tabName="timeTravel" 
              icon={<HistoryIcon className="w-5 h-5" />} 
              label="Time-Travel Booth" 
            />
          </nav>
        </div>
      </header>
      <main>
        {renderTabContent()}
      </main>
    </div>
  );
};

export default App;
