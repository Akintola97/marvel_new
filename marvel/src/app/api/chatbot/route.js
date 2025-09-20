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






// /api/chatbot/route.js
import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // avoid caching
export const revalidate = 0;

export async function POST(request) {
  const { messages } = await request.json();
  const OPENAI_KEY = process.env.OPENAI_KEY;
  const TMDB_KEY = process.env.API_KEY; // your TMDB key

  if (!OPENAI_KEY) {
    return NextResponse.json({ message: "OpenAI key not set" }, { status: 500 });
  }

  const userMessage = messages?.[messages.length - 1]?.message || "";
  let tmdb = null;

  // Pick a solid trailer key (prefer Official Trailer, fallback to Trailer, then Teaser)
  async function pickTrailerKey(videos = []) {
    if (!videos.length) return null;

    const officialTrailer =
      videos.find(
        (v) =>
          v.site === "YouTube" &&
          v.type === "Trailer" &&
          /official/i.test(v.name || "")
      ) || null;

    if (officialTrailer?.key) return officialTrailer.key;

    const anyTrailer = videos.find((v) => v.site === "YouTube" && v.type === "Trailer");
    if (anyTrailer?.key) return anyTrailer.key;

    const teaser = videos.find((v) => v.site === "YouTube" && v.type === "Teaser");
    return teaser?.key || null;
  }

  async function fetchTMDBInfo(query) {
    if (!TMDB_KEY) return null;

    const common = {
      api_key: TMDB_KEY,
      include_adult: false,
      language: "en-US",
    };

    try {
      // Search both movie & TV
      const [movieRes, tvRes] = await Promise.all([
        axios.get("https://api.themoviedb.org/3/search/movie", {
          params: { ...common, query },
        }),
        axios.get("https://api.themoviedb.org/3/search/tv", {
          params: { ...common, query },
        }),
      ]);

      const movie = movieRes.data?.results?.[0];
      const tv = tvRes.data?.results?.[0];

      // pick a better match by popularity
      const choice =
        (movie && !tv) || (movie && movie.popularity > (tv?.popularity || 0))
          ? { type: "movie", id: movie.id, title: movie.title, poster_path: movie.poster_path }
          : tv
          ? { type: "tv", id: tv.id, title: tv.name, poster_path: tv.poster_path }
          : null;

      if (!choice) return null;

      // Details (overview, cast, poster)
      const detailsRes = await axios.get(
        `https://api.themoviedb.org/3/${choice.type}/${choice.id}`,
        { params: { ...common, append_to_response: "credits" } }
      );
      const d = detailsRes.data;

      // Videos (language-expanded to improve trailer hit rate)
      const videosRes = await axios.get(
        `https://api.themoviedb.org/3/${choice.type}/${choice.id}/videos`,
        {
          params: {
            ...common,
            include_video_language: "en,null",
          },
        }
      );
      const videos = videosRes.data?.results || [];
      const trailerKey = await pickTrailerKey(videos);

      const baseImg = "https://image.tmdb.org/t/p/original";
      const posterUrl =
        (choice.poster_path && `${baseImg}${choice.poster_path}`) ||
        (d.poster_path && `${baseImg}${d.poster_path}`) ||
        null;

      return {
        type: choice.type,
        id: choice.id,
        title: choice.title,
        release_date: d.release_date || d.first_air_date || null,
        overview: d.overview || null,
        cast: (d.credits?.cast || []).slice(0, 5).map((c) => c.name),
        trailerKey, // <- for react-youtube
        posterUrl,  // <- full-size poster url
      };
    } catch (err) {
      console.error("TMDB fetch error:", err?.response?.data || err?.message || err);
      return null;
    }
  }

  // Only hit TMDB if the query looks entertainment-related
  if (/(marvel|movie|film|show|series|season|episode|release|cast|trailer)/i.test(userMessage)) {
    tmdb = await fetchTMDBInfo(userMessage);
  }

  // Ask OpenAI with TMDB grounding
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
              "You are a Marvel entertainment expert. Prefer facts from TMDB_JSON when present (titles, dates, cast). If key info is missing, say you're not certain.",
          },
          ...(tmdb ? [{ role: "system", content: `TMDB_JSON:\n${JSON.stringify(tmdb, null, 2)}` }] : []),
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

    aiResponse = openai.data?.choices?.[0]?.message?.content?.trim() || aiResponse;
  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ response: aiResponse, tmdb }, { status: 200 });
}
