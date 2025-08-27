import React, { useState } from 'react';
import { generateCommitMessage } from '../services/geminiService';
import { COMMIT_TYPES } from '../constants';
import Card from './Card';

const LoadingIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);


const CommitGenerator: React.FC = () => {
  const [type, setType] = useState('feat');
  const [scope, setScope] = useState('');
  const [description, setDescription] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setCommitMessage('');
    setCopied(false);

    try {
      const result = await generateCommitMessage({ type, scope, description });
      setCommitMessage(result);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(commitMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold text-white mb-4">Commit Message Generator</h2>
        <p className="text-gray-400 mb-6">Describe your changes, and the AI will generate a conventional commit message for you.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="commit-type" className="block text-sm font-medium text-gray-300">Commit Type</label>
            <select
              id="commit-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-black border-[#333] focus:outline-none focus:ring-white focus:border-white sm:text-sm rounded-md text-white"
            >
              {COMMIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="commit-scope" className="block text-sm font-medium text-gray-300">Scope (Optional)</label>
            <input
              type="text"
              id="commit-scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="e.g., api, auth, ui"
              className="mt-1 block w-full px-3 py-2 bg-black border border-[#333] rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-white focus:border-white sm:text-sm text-white"
            />
          </div>
          
          <div>
            <label htmlFor="commit-description" className="block text-sm font-medium text-gray-300">Description of Changes</label>
            <textarea
              id="commit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Implemented user authentication endpoint with JWT."
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-black border border-[#333] rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-white focus:border-white sm:text-sm text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !description.trim()}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition"
          >
            {isLoading ? <><LoadingIcon /> Generating...</> : 'Generate Commit Message'}
          </button>
        </form>
      </Card>
      
      {error && (
        <Card className="border-red-500/50">
          <p className="text-red-400">{error}</p>
        </Card>
      )}

      {commitMessage && (
        <Card>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-white">Generated Message</h3>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition"
            >
              <CopyIcon />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <pre className="bg-gray-900/50 text-white p-4 rounded-md font-mono text-sm whitespace-pre-wrap border border-[#333]">{commitMessage}</pre>
        </Card>
      )}
    </div>
  );
};

export default CommitGenerator;