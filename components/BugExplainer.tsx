import React, { useState } from 'react';
import { explainBug } from '../services/geminiService';
import Card from './Card';

const LoadingIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const BugExplainer: React.FC = () => {
  const [input, setInput] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setExplanation('');

    try {
      const result = await explainBug(input);
      setExplanation(result);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold text-white mb-4">AI Bug Explainer</h2>
        <p className="text-gray-400 mb-6">Paste your error message or buggy code snippet below, and our AI will provide a detailed explanation and suggest fixes.</p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., TypeError: Cannot read properties of undefined (reading 'map')"
            className="w-full h-48 p-4 bg-black border border-[#333] rounded-md text-gray-300 font-mono text-sm focus:ring-2 focus:ring-white focus:outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="mt-4 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition"
          >
            {isLoading ? <><LoadingIcon /> Analyzing...</> : 'Explain Bug'}
          </button>
        </form>
      </Card>

      {error && (
        <Card className="border-red-500/50">
          <p className="text-red-400">{error}</p>
        </Card>
      )}

      {explanation && (
        <Card>
          <h3 className="text-xl font-semibold text-white mb-4">Explanation</h3>
          <div className="prose prose-invert prose-slate max-w-none text-gray-300">
            <pre className="whitespace-pre-wrap font-sans bg-black p-4 rounded-md border border-[#333]">{explanation}</pre>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BugExplainer;