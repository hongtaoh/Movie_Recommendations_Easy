// app/movies/[id]/route.js
import { NextResponse } from 'next/server';
import movies from '@/data/movies.json';

export async function GET(request, { params }) {
  try {
    const movie = movies.find(m => m.id === Number(params.id));
    
    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' }, 
      { status: 500 }
    );
  }
}