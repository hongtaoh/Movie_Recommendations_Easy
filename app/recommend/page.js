// app/recommend/page.js
'use client';
import { useState } from 'react';
import MovieCard from '@/components/MovieCard';

export default function RecommendPage() {
  const [query, setQuery] = useState('');
  const [model, setModel] = useState('gemini');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, model })
      });

      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="gemini">Google Gemini</option>
          <option value="deepseek">DeepSeek</option>
        </select>

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
          {loading ? 'Searching...' : 'Get Recommendations'}
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
              <p className="whitespace-pre-wrap">{results.explanation}</p>
            </div>
          )}

        {results.movies? (
            <div>
                {results.qdrantResults.map(m => 
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