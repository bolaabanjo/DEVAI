import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Snippet } from '../types';
import Card from './Card';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;


const SnippetForm: React.FC<{ onSave: (snippet: Omit<Snippet, 'id' | 'createdAt'>) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [tags, setTags] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      language,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      code
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-black border border-[#333] rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">New Code Snippet</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Title (e.g., React Fetch Hook)" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 bg-black border border-[#333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" />
          <div className="flex space-x-4">
            <input type="text" placeholder="Language (e.g., javascript)" value={language} onChange={e => setLanguage(e.target.value)} required className="flex-1 px-3 py-2 bg-black border border-[#333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" />
            <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} className="flex-1 px-3 py-2 bg-black border border-[#333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" />
          </div>
          <textarea placeholder="Your code snippet here..." value={code} onChange={e => setCode(e.target.value)} required rows={10} className="w-full p-4 bg-black border border-[#333] rounded-md text-gray-300 font-mono text-sm focus:ring-2 focus:ring-white focus:outline-none transition" />
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-900 border border-transparent hover:border-[#333] transition">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md text-black bg-white hover:bg-gray-200 transition">Save Snippet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SnippetItem: React.FC<{ snippet: Snippet; onDelete: (id: string) => void }> = ({ snippet, onDelete }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(snippet.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    
    return (
        <Card className="flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-white">{snippet.title}</h4>
                    <span className="text-xs font-mono bg-[#111] text-gray-400 px-2 py-1 rounded border border-[#333]">{snippet.language}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {snippet.tags.map(tag => <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">{tag}</span>)}
                </div>
                <pre className="mt-4 bg-[#111] border border-[#333] text-gray-300 p-3 rounded-md font-mono text-xs max-h-40 overflow-auto">{snippet.code}</pre>
            </div>
            <div className="mt-4 pt-4 border-t border-[#333] flex justify-between items-center">
                <p className="text-xs text-gray-500">Created: {new Date(snippet.createdAt).toLocaleDateString()}</p>
                <div className="flex space-x-2">
                    <button onClick={handleCopy} className="p-2 text-gray-400 hover:text-white transition rounded-full hover:bg-gray-900">
                      {copied ? <span className="text-xs text-white">Copied!</span> : <CopyIcon />}
                    </button>
                    <button onClick={() => onDelete(snippet.id)} className="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-gray-900"><TrashIcon /></button>
                </div>
            </div>
        </Card>
    );
};


const SnippetManager: React.FC = () => {
  const [snippets, setSnippets] = useLocalStorage<Snippet[]>('code-snippets', []);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const addSnippet = (newSnippetData: Omit<Snippet, 'id' | 'createdAt'>) => {
    const newSnippet: Snippet = {
      ...newSnippetData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setSnippets(prev => [newSnippet, ...prev]);
    setShowForm(false);
  };
  
  const deleteSnippet = (id: string) => {
    if(window.confirm("Are you sure you want to delete this snippet?")){
      setSnippets(prev => prev.filter(s => s.id !== id));
    }
  };
  
  const filteredSnippets = useMemo(() => {
    if (!searchTerm) return snippets;
    const lowercasedTerm = searchTerm.toLowerCase();
    return snippets.filter(s => 
      s.title.toLowerCase().includes(lowercasedTerm) ||
      s.language.toLowerCase().includes(lowercasedTerm) ||
      s.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm)) ||
      s.code.toLowerCase().includes(lowercasedTerm)
    );
  }, [snippets, searchTerm]);

  return (
    <div className="space-y-6">
      {showForm && <SnippetForm onSave={addSnippet} onCancel={() => setShowForm(false)} />}
      <Card>
        <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Code Snippet Manager</h2>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 border border-[#333] text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-colors">
                <PlusIcon />
                New Snippet
            </button>
        </div>
        <p className="text-gray-400 mt-2">Manage your reusable code snippets. Data is saved locally in your browser.</p>
      </Card>

      <Card>
        <input 
            type="text"
            placeholder="Search snippets by title, language, tag, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-[#333] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
        />
      </Card>
      
      {filteredSnippets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.map(snippet => <SnippetItem key={snippet.id} snippet={snippet} onDelete={deleteSnippet} />)}
        </div>
      ) : (
        <Card>
            <p className="text-center text-gray-400">
                {snippets.length === 0 ? "You don't have any snippets yet. Click 'New Snippet' to add one!" : "No snippets found for your search."}
            </p>
        </Card>
      )}

    </div>
  );
};

export default SnippetManager;