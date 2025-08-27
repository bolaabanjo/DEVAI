import React, { useState } from 'react';
import { Tool } from './types';
import BugExplainer from './components/BugExplainer';
import SnippetManager from './components/SnippetManager';
import CommitGenerator from './components/CommitGenerator';

const HeaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);


const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(Tool.BUG_EXPLAINER);

  const renderTool = () => {
    switch (activeTool) {
      case Tool.BUG_EXPLAINER:
        return <BugExplainer />;
      case Tool.SNIPPET_MANAGER:
        return <SnippetManager />;
      case Tool.COMMIT_GENERATOR:
        return <CommitGenerator />;
      default:
        return null;
    }
  };
  
  const tools = Object.values(Tool);

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans flex">
      <aside className="w-64 bg-black border-r border-[#333] p-6 flex flex-col fixed h-full">
          <div className="flex items-center space-x-3 mb-10">
            <HeaderIcon />
            <h1 className="text-2xl font-bold text-white tracking-tight">DevToolkit AI</h1>
          </div>
          <nav className="flex flex-col space-y-2">
            {tools.map((tool) => (
              <button
                key={tool}
                onClick={() => setActiveTool(tool)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                    activeTool === tool
                        ? 'bg-white text-black'
                        : 'text-gray-400 hover:bg-gray-900/70 hover:text-white'
                }`}
              >
                {tool}
              </button>
            ))}
          </nav>
          <footer className="mt-auto text-center text-gray-600 text-xs">
            <p>Powered by AI. Built for developers.</p>
          </footer>
      </aside>
      
      <main className="flex-1 ml-64 p-4 sm:p-6 lg:p-8">
        <div>
          {renderTool()}
        </div>
      </main>
    </div>
  );
};

export default App;