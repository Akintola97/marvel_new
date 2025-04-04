import axios from "axios";
import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";


export async function POST(request) {
  await dbConnect();

  const { entertainmentSearch } = await request.json();

  if (!entertainmentSearch) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const api_key = process.env.API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";
  const encodedSearchTerm = encodeURIComponent(entertainmentSearch);

  try {
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key, query: encodedSearchTerm },
      }),
      axios.get(`${BASE_URL}/search/tv`, {
        params: { api_key, query: encodedSearchTerm },
      })
    ]);

    const combinedResults = [
      ...movieResponse.data.results.map(item => ({ ...item, type: 'movie', entertainmentId: item.id })),
      ...tvResponse.data.results.map(item => ({ ...item, type: 'tv', entertainmentId: item.id }))
    ];

    const detailedResults = await Promise.all(combinedResults.map(async (item) => {
      try {
        const detailsResponse = await axios.get(`${BASE_URL}/${item.type}/${item.entertainmentId}`, {
          params: { api_key },
        });
        const details = detailsResponse.data;
        return {
          ...item,
          producer: details.production_companies.map(comp => comp.name),
          actors: details.credits.cast.slice(0, 10).map(actor => actor.name),
          rating: details.vote_average,
        };
      } catch (detailsError) {
        console.error(`Error fetching details for ${item.entertainmentId}:`, detailsError);
        return { ...item, producer: [], actors: [], rating: null }; // Return partial data
      }
    }));

    if (detailedResults.length === 0) {
      return NextResponse.json(
        { message: "No results found" },
        { status: 404 }
      );
    }

    return NextResponse.json(detailedResults, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}
