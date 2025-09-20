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






// /api/chatbot/route.ts (or route.js)
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { messages } = await request.json();
  const OPENAI_KEY = process.env.OPENAI_KEY;
  const TMDB_KEY = process.env.API_KEY; // 👈 your TMDB key

  if (!OPENAI_KEY) {
    return NextResponse.json({ message: "OpenAI key not set" }, { status: 500 });
  }

  const userMessage = messages?.[messages.length - 1]?.message || "";
  let tmdb = null;

  // Inline TMDB lookup
  async function fetchTMDBInfo(query) {
    if (!TMDB_KEY) return null;
    try {
      const [movieRes, tvRes] = await Promise.all([
        axios.get("https://api.themoviedb.org/3/search/movie", {
          params: { query, api_key: TMDB_KEY, include_adult: false },
        }),
        axios.get("https://api.themoviedb.org/3/search/tv", {
          params: { query, api_key: TMDB_KEY, include_adult: false },
        }),
      ]);

      const movie = movieRes.data.results?.[0];
      const tv = tvRes.data.results?.[0];

      const choice =
        (movie && !tv) || (movie && movie.popularity > (tv?.popularity || 0))
          ? { type: "movie", id: movie.id, title: movie.title, poster_path: movie.poster_path }
          : tv
          ? { type: "tv", id: tv.id, title: tv.name, poster_path: tv.poster_path }
          : null;

      if (!choice) return null;

      const detailsRes = await axios.get(
        `https://api.themoviedb.org/3/${choice.type}/${choice.id}`,
        { params: { api_key: TMDB_KEY, append_to_response: "videos,credits" } }
      );

      const d = detailsRes.data;

      const ytTrailer = d.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      const trailerKey = ytTrailer?.key || null;

      // Build a full-size poster URL if TMDB gave us a path
      const posterUrl = choice.poster_path
        ? `https://image.tmdb.org/t/p/original${choice.poster_path}`
        : d.poster_path
        ? `https://image.tmdb.org/t/p/original${d.poster_path}`
        : null;

      return {
        type: choice.type,
        id: choice.id,
        title: choice.title,
        release_date: d.release_date || d.first_air_date || null,
        overview: d.overview || null,
        cast: (d.credits?.cast || []).slice(0, 5).map((c) => c.name),
        trailerKey, // 👈 for react-youtube
        posterUrl,  // 👈 full URL
      };
    } catch (err) {
      console.error("TMDB fetch error:", err?.message || err);
      return null;
    }
  }

  // Try TMDB when it looks like entertainment content
  if (/(marvel|movie|film|show|series|season|episode|release|cast|trailer)/i.test(userMessage)) {
    tmdb = await fetchTMDBInfo(userMessage);
  }

  // Ask the LLM, giving it TMDB JSON (if present) for grounding
  let aiResponse = "Sorry, I couldn’t get a response.";
  try {
    const openai = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a Marvel entertainment expert. Use provided TMDB JSON verbatim for facts (titles, dates, cast). If TMDB is missing, say you’re not certain.",
          },
          ...(tmdb
            ? [
                {
                  role: "system",
                  content: `TMDB_JSON:\n${JSON.stringify(tmdb, null, 2)}`,
                },
              ]
            : []),
          ...messages.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.message,
          })),
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    aiResponse = openai.data.choices?.[0]?.message?.content?.trim() || aiResponse;
  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }

  // Return both the LLM text and any TMDB struct
  return NextResponse.json({ response: aiResponse, tmdb }, { status: 200 });
}
