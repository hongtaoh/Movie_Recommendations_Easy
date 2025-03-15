// app/movies/[id]/page.js

import movies from '@/data/movies.json'

export default function MoviePage({ params }) {
    const movie = movies.find(m => m.id == Number(params.id));
    const posterURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`

    return (
        <div className='max-w-4xl mx-auto p-4'>
            <div className='bg-white rounded-xl shadow-sm'>
                <div className='grid md:grid-cols-2 gap-8 p-6'>
                    <div className='flex justify-center'>
                        <img 
                            src={posterURL}
                            alt={movie.title}
                            className='w-64 h-96 object-cover rounded-lg'
                        />
                    </div>
                    <div className='space-y-4'>
                        <h1 className='text-3xl font-bold'>{movie.title}</h1>
                        <p className='text-gray-600'>{movie.overview}</p>
                        <div className='space-y-2'>
                            <p className='text-sm'>
                                <span className='font-semibold'>Revenue:</span> ${movie.revenue.toLocalString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}