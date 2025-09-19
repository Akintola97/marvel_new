// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   const { messages } = await request.json();
//   const API_KEY = process.env.OPENAI_KEY;

//   if (!API_KEY) {
//     console.error("API key is not set in environment variables");
//     return NextResponse.json(
//       { message: "API key is not configured" },
//       { status: 500 }
//     );
//   }
//   try {
//     const response = await axios.post(
//       `https://api.openai.com/v1/chat/completions`,
//       {
//         model: "gpt-4o",
//         messages: [
//           {
//             role: "system",
//             content:
//               "This assistant is specialized in discussing marvel movies, tv-shows and comics",
//           },
//           ...messages.map((msg) => ({
//             role: msg.from === "user" ? "user" : "assistant",
//             content: msg.message,
//           })),
//         ],
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const aiResponse = response.data.choices[0].message.content.trim();
//     return NextResponse.json({ response: aiResponse }, { status: 200 });
//   } catch (error) {
//     console.error(
//       "Error occurred:",
//       error.response ? error.response.data : error.message
//     );
//     return NextResponse.json(
//       { message: "Something went wrong", error: error.message },
//       { status: 500 }
//     );
//   }
// }







import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { messages } = await request.json();
  const OPENAI_KEY = process.env.OPENAI_KEY;
  const TMDB_KEY = process.env.API_KEY; // 👈 using your API_KEY for TMDB

  if (!OPENAI_KEY) {
    return NextResponse.json({ message: "OpenAI key not set" }, { status: 500 });
  }

  const userMessage = messages[messages.length - 1]?.message || "";
  let tmdbInfo = null;

  // 🔎 Inline TMDB fetcher
  async function fetchTMDBInfo(query) {
    if (!TMDB_KEY) return null;

    try {
      // Search both movies and TV shows
      const [movieRes, tvRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/search/movie`, {
          params: { query, api_key: TMDB_KEY },
        }),
        axios.get(`https://api.themoviedb.org/3/search/tv`, {
          params: { query, api_key: TMDB_KEY },
        }),
      ]);

      const movie = movieRes.data.results?.[0];
      const tv = tvRes.data.results?.[0];
      const choice =
        (movie && !tv) || (movie && movie.popularity > (tv?.popularity || 0))
          ? { type: "movie", id: movie.id, title: movie.title }
          : tv
          ? { type: "tv", id: tv.id, title: tv.name }
          : null;

      if (!choice) return null;

      // Fetch details (overview, cast, trailers)
      const detailsRes = await axios.get(
        `https://api.themoviedb.org/3/${choice.type}/${choice.id}`,
        { params: { api_key: TMDB_KEY, append_to_response: "videos,credits" } }
      );

      const d = detailsRes.data;
      return {
        title: choice.title,
        release_date: d.release_date || d.first_air_date,
        overview: d.overview,
        cast: d.credits?.cast?.slice(0, 5).map((c) => c.name).join(", "),
        trailer: d.videos?.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        )
          ? `https://www.youtube.com/watch?v=${
              d.videos.results.find(
                (v) => v.type === "Trailer" && v.site === "YouTube"
              ).key
            }`
          : null,
      };
    } catch (err) {
      console.error("TMDB fetch error:", err.message);
      return null;
    }
  }

  // Check if query is Marvel/movie/show-related
  if (/marvel|movie|show|series|release/i.test(userMessage)) {
    tmdbInfo = await fetchTMDBInfo(userMessage);
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a Marvel expert. If TMDB info is provided, always use it for accuracy.",
          },
          ...(tmdbInfo
            ? [
                {
                  role: "system",
                  content: `Here is real-time data from TMDB:\n${JSON.stringify(
                    tmdbInfo,
                    null,
                    2
                  )}`,
                },
              ]
            : []),
          ...messages.map((msg) => ({
            role: msg.from === "user" ? "user" : "assistant",
            content: msg.message,
          })),
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content.trim();
    return NextResponse.json({ response: aiResponse }, { status: 200 });
  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}