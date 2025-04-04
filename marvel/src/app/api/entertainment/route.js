import axios from "axios";
import { NextResponse } from "next/server";


export const dynamic = 'force-dynamic';

export async function GET(request) {


  const api_key = process.env.API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  try {
    // Fetch Marvel movies
    const moviesResponse = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: api_key,
        query: "Avengers",
      },
    });


    // Fetch Marvel TV shows
    const tvShowsResponse = await axios.get(`${BASE_URL}/search/tv`, {
      params: {
        api_key: api_key,
        query: "Avengers",
      },
    });

    // Combine the results
    const combinedResults = [
      ...moviesResponse.data.results.map(item => ({ ...item, type: 'movie' })),
      ...tvShowsResponse.data.results.map(item => ({ ...item, type: 'tv' }))
    ];

    return NextResponse.json(combinedResults, { status: 200 });
  } catch (error) {
    console.error("Error fetching Marvel entertainment data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
