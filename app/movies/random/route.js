import movies from '@/data/movies.json';

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let k = Number(searchParams.get('k')) || 5; // Default to 5 movies
    
    // Validate k value
    k = Math.min(Math.max(1, k), movies.length); // Clamp between 1 and total movies
    
    // Shuffle and select
    const shuffled = shuffleArray([...movies]);
    const randomMovies = shuffled.slice(0, k);

    return new Response(JSON.stringify(randomMovies), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to get random movies' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}