// app/page.js 
'use client';
import { useState } from 'react';
import MovieCard from '@/components/MovieCard';
import movies from '@/data/movies.json';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 12;

  const filteredMovies = movies.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMovies = filteredMovies.slice(0, currentPage * moviesPerPage);

  return (
    <div>
      <input
        type="text"
        placeholder='Search movies...'
        className='w-full p-2 mb-4 border'
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page on new search
        }}
      />

      <div>
        {currentMovies.map(m => 
          <MovieCard 
            key={m.id}
            movie={m}
          />
        )}
      </div>

      {currentMovies.length < filteredMovies.length && (
        <div className='flex justify-center p-4'>
          <button 
            className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded'
            // () => ... is essentially a function
            // onClick(myFunction)
            // but onClick(setCu...) is just like onClick(myFunction())
            // This means the function will execute once the page is rerendered
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Load More 
          </button>
        </div>
      )}

    </div>
  )

}