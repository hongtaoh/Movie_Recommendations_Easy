// app/recommend/page.js
'use client';
import { useState } from 'react';
import MovieCard from '@/components/MovieCard';
import ReactMarkdown from 'react-markdown'; 

export default function RecommendPage() {
  const [query, setQuery] = useState('');
  const [model, setModel] = useState('gemini');
  const [showExplanation, setShowExplanation] = useState(true);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // If explanations are turned off, use a direct search API call instead
      if (!showExplanation) {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&k=5`);
        if (!response.ok) throw new Error('Search request failed');
        const data = await response.json();
        setResults({
          movies: data.results,
          explanation: null
        });
      } else {
        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // The variable names (query, model) become the property names in the JSON string, 
          // and their values are what you've set in your application.
          body: JSON.stringify({ query, model })
        });
  
        if (!response.ok) throw new Error('Request failed');
        const data = await response.json();
        setResults(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={showExplanation}
              onChange={() => {
                setShowExplanation(!showExplanation);
                setResults(null);
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900">AI Explanation</span>
          </label>
        </div>

        {showExplanation && (
          <div className="space-y-1">
              <label className="text-sm text-gray-600">Choose LLM Model:</label>
              <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-2 border rounded"
              >
                  <option value="gemini">Google Gemini</option>
                  <option value="deepseek">DeepSeek</option>
              </select>
          </div>
        ) 
        }
        

        <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe movie plots you want to see..."
            className="w-full p-3 text-lg border rounded resize min-h-[48px]"
            disabled={loading}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={loading || !query}
        >
          {loading ? 'Searching...' : showExplanation ? 'Get AI Recommendations' : 'Search Movies'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
          Error: {error}
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {results.explanation && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">AI Explanation:</h3>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>
                  {results.explanation}
                </ReactMarkdown>
              </div>
            </div>
          )}

        {results.movies && results.movies.length > 0 ? (
            <div>
                {results.movies.map(m => 
                <MovieCard 
                    key={m.id}
                    movie={m}
                />
                )}
            </div>
          ) : (
            <p className="text-gray-500">No movies found</p>
          )}
        </div>
      )}
    </div>
  );
}