// app/movies/[id]/page.js

import movies from '@/data/movies.json'
import Image from 'next/image';

export default async function MoviePage({ params }) {
    // Await the params to resolve the async value
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const movie = movies.find(m => m.id == Number(id));
    const posterURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`

    return (
        <div className='max-w-4xl mx-auto p-4'>
            <div className='bg-white rounded-xl shadow-sm'>
                <div className='grid md:grid-cols-2 gap-8 p-6'>
                    <div className='flex justify-center'>
                    <Image 
                        src={posterURL}
                        alt={movie.title}
                        width={256} // Set explicit width (matches w-64 in Tailwind)
                        height={384} // Set explicit height (matches h-96 in Tailwind)
                        className='object-cover rounded-lg'
                        priority // Optional: Prioritize loading for LCP
                    />
                    </div>
                    <div className='space-y-4'>
                        <h1 className='text-3xl font-bold'>{movie.title}</h1>
                        <p className='text-gray-600'>{movie.overview}</p>
                        <div className='space-y-2'>
                            <p className='text-sm'>
                                <span className='font-semibold'>Revenue:</span> ${movie.revenue.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}