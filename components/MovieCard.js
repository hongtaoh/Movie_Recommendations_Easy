// components/MovieCard.js
'use client';
import Link from 'next/link';

const MovieCard = ({movie}) => {
    const posterURL = `https://image.tmdb.org/t/p/w92${movie.poster_path}`;

    return (
        <div className='flex items-start gap-4 p-4 border-b hover:bg-gray-50 h-32'>
            {/* Poster */}
            <img 
                src={posterURL}
                alt={movie.title}
                className='w-16 h-24 object-cover rounded'
            />

            {/* Text Content */}
            <div className='flex-1 min-w-0 h-full flex flex-col justify-between'>
                <Link href={`/movies/${movie.id}`} className='block'>
                    <h3 className='font-medium line-clamp-1'>
                        {movie.title}
                    </h3>
                    <p className='text-sm text-gray-600 line-clamp-2'>{movie.overview}</p>
                </Link>
            </div>

        </div>
    )
}

export default MovieCard; 